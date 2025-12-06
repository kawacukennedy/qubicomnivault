// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./oqAsset.sol";

/**
 * @title LendingPool
 * @dev Decentralized lending pool for oqAssets collateralized borrowing
 */
contract LendingPool is ReentrancyGuard, Ownable {
    oqAsset public immutable oqAssetToken;
    IERC20 public immutable stablecoin; // USDC or similar

    struct Loan {
        uint256 id;
        address borrower;
        uint256 oqAssetAmount;
        uint256 stablecoinAmount;
        uint256 collateralRatio; // in basis points (10000 = 100%)
        uint256 interestRate;    // annual interest in basis points
        uint256 startTime;
        uint256 lastInterestUpdate;
        bool isActive;
        uint256 assetId; // Reference to oqAsset metadata
    }

    struct PoolReserve {
        uint256 totalStablecoin;
        uint256 totalBorrowed;
        uint256 interestRate; // base rate in basis points
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;
    uint256 public nextLoanId = 1;

    PoolReserve public reserve;

    uint256 public constant MAX_LTV = 7000; // 70% max LTV
    uint256 public constant LIQUIDATION_THRESHOLD = 8000; // 80% liquidation
    uint256 public constant INTEREST_PRECISION = 10000;

    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 oqAssetAmount, uint256 stablecoinAmount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanLiquidated(uint256 indexed loanId, address indexed liquidator, uint256 profit);
    event InterestAccrued(uint256 indexed loanId, uint256 interest);

    constructor(address _oqAssetToken, address _stablecoin) {
        oqAssetToken = oqAsset(_oqAssetToken);
        stablecoin = IERC20(_stablecoin);
        reserve.interestRate = 500; // 5% base rate
    }

    /**
     * @dev Create a new loan by depositing oqAssets as collateral
     */
    function createLoan(
        uint256 oqAssetAmount,
        uint256 stablecoinAmount,
        uint256 assetId
    ) external nonReentrant {
        require(oqAssetAmount > 0, "Invalid collateral amount");
        require(stablecoinAmount > 0, "Invalid loan amount");
        require(oqAssetToken.isEligibleForCollateral(assetId), "Asset not eligible for collateral");

        // Calculate LTV
        (, uint256 valuation) = getAssetValuation(assetId);
        uint256 maxLoan = (valuation * MAX_LTV) / INTEREST_PRECISION;
        require(stablecoinAmount <= maxLoan, "Loan exceeds max LTV");

        // Check pool has enough liquidity
        require(reserve.totalStablecoin >= stablecoinAmount, "Insufficient pool liquidity");

        // Transfer collateral
        require(oqAssetToken.transferFrom(msg.sender, address(this), oqAssetAmount), "Collateral transfer failed");

        // Create loan
        uint256 loanId = nextLoanId++;
        uint256 collateralRatio = (stablecoinAmount * INTEREST_PRECISION) / valuation;

        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            oqAssetAmount: oqAssetAmount,
            stablecoinAmount: stablecoinAmount,
            collateralRatio: collateralRatio,
            interestRate: reserve.interestRate,
            startTime: block.timestamp,
            lastInterestUpdate: block.timestamp,
            isActive: true,
            assetId: assetId
        });

        userLoans[msg.sender].push(loanId);
        reserve.totalBorrowed += stablecoinAmount;

        // Transfer stablecoin to borrower
        require(stablecoin.transfer(msg.sender, stablecoinAmount), "Loan transfer failed");

        emit LoanCreated(loanId, msg.sender, oqAssetAmount, stablecoinAmount);
    }

    /**
     * @dev Repay loan with interest
     */
    function repayLoan(uint256 loanId, uint256 amount) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");
        require(loan.borrower == msg.sender, "Not loan owner");

        // Calculate accrued interest
        uint256 interest = calculateInterest(loanId);
        uint256 totalOwed = loan.stablecoinAmount + interest;

        uint256 repayAmount = amount > totalOwed ? totalOwed : amount;

        // Transfer payment
        require(stablecoin.transferFrom(msg.sender, address(this), repayAmount), "Payment transfer failed");

        // Update loan
        if (repayAmount >= totalOwed) {
            // Full repayment
            loan.isActive = false;
            loan.stablecoinAmount = 0;
            reserve.totalBorrowed -= loan.stablecoinAmount;

            // Return collateral
            require(oqAssetToken.transfer(msg.sender, loan.oqAssetAmount), "Collateral return failed");
            emit LoanRepaid(loanId, msg.sender, repayAmount);
        } else {
            // Partial repayment
            loan.stablecoinAmount -= repayAmount;
            loan.lastInterestUpdate = block.timestamp;
            emit LoanRepaid(loanId, msg.sender, repayAmount);
        }
    }

    /**
     * @dev Liquidate undercollateralized loan
     */
    function liquidateLoan(uint256 loanId) external nonReentrant {
        Loan storage loan = loans[loanId];
        require(loan.isActive, "Loan not active");

        (, uint256 currentValuation) = getAssetValuation(loan.assetId);
        uint256 currentLTV = (loan.stablecoinAmount * INTEREST_PRECISION) / currentValuation;

        require(currentLTV >= LIQUIDATION_THRESHOLD, "Loan not undercollateralized");

        // Calculate liquidation
        uint256 collateralValue = (loan.oqAssetAmount * currentValuation) / oqAssetToken.balanceOf(address(this));
        uint256 liquidationPenalty = collateralValue / 20; // 5% penalty
        uint256 liquidatorReward = collateralValue - loan.stablecoinAmount - liquidationPenalty;

        // Transfer collateral to liquidator
        require(oqAssetToken.transfer(msg.sender, loan.oqAssetAmount), "Collateral transfer failed");

        // Update pool
        reserve.totalBorrowed -= loan.stablecoinAmount;
        loan.isActive = false;

        emit LoanLiquidated(loanId, msg.sender, liquidatorReward);
    }

    /**
     * @dev Calculate accrued interest for a loan
     */
    function calculateInterest(uint256 loanId) public view returns (uint256) {
        Loan memory loan = loans[loanId];
        if (!loan.isActive) return 0;

        uint256 timeElapsed = block.timestamp - loan.lastInterestUpdate;
        uint256 annualInterest = (loan.stablecoinAmount * loan.interestRate) / INTEREST_PRECISION;
        uint256 accruedInterest = (annualInterest * timeElapsed) / 365 days;

        return accruedInterest;
    }

    /**
     * @dev Get asset valuation from oracle (simplified)
     */
    function getAssetValuation(uint256 assetId) public view returns (bool success, uint256 valuation) {
        // In production, this would call an oracle
        // For now, return stored valuation
        try oqAssetToken.getAssetMetadata(assetId) returns (oqAsset.AssetMetadata memory metadata) {
            return (true, metadata.valuation);
        } catch {
            return (false, 0);
        }
    }

    /**
     * @dev Get user's active loans
     */
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    /**
     * @dev Add liquidity to the pool
     */
    function addLiquidity(uint256 amount) external nonReentrant {
        require(stablecoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        reserve.totalStablecoin += amount;
    }

    /**
     * @dev Remove liquidity from the pool
     */
    function removeLiquidity(uint256 amount) external nonReentrant onlyOwner {
        require(reserve.totalStablecoin >= amount, "Insufficient liquidity");
        reserve.totalStablecoin -= amount;
        require(stablecoin.transfer(msg.sender, amount), "Transfer failed");
    }

    /**
     * @dev Update interest rate (governance function)
     */
    function updateInterestRate(uint256 newRate) external onlyOwner {
        reserve.interestRate = newRate;
    }
}