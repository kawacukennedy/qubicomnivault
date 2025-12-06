// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidityPool
 * @dev Automated Market Maker for oqAsset-Stablecoin pairs
 */
contract LiquidityPool is ERC20, ReentrancyGuard, Ownable {
    IERC20 public tokenA; // oqAsset
    IERC20 public tokenB; // Stablecoin (USDC)

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;

    uint256 public constant FEE_NUMERATOR = 3;
    uint256 public constant FEE_DENOMINATOR = 1000; // 0.3% fee
    uint256 public constant MINIMUM_LIQUIDITY = 1000;

    mapping(address => uint256) public liquidityBalance;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) ERC20("Qubic LP Token", "QLP") {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    /**
     * @dev Add liquidity to the pool
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external nonReentrant returns (uint256) {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        uint256 liquidity;

        if (totalLiquidity == 0) {
            // First liquidity provision
            liquidity = sqrt(amountA * amountB) - MINIMUM_LIQUIDITY;
            _mint(address(this), MINIMUM_LIQUIDITY); // Permanently lock minimum liquidity
        } else {
            // Subsequent liquidity provisions
            uint256 liquidityA = (amountA * totalLiquidity) / reserveA;
            uint256 liquidityB = (amountB * totalLiquidity) / reserveB;
            liquidity = liquidityA < liquidityB ? liquidityA : liquidityB;
        }

        require(liquidity > 0, "Insufficient liquidity minted");

        // Transfer tokens
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "TokenA transfer failed");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "TokenB transfer failed");

        // Update reserves
        reserveA += amountA;
        reserveB += amountB;
        totalLiquidity += liquidity;

        // Mint LP tokens
        _mint(msg.sender, liquidity);
        liquidityBalance[msg.sender] += liquidity;

        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
        return liquidity;
    }

    /**
     * @dev Remove liquidity from the pool
     */
    function removeLiquidity(uint256 liquidity) external nonReentrant returns (uint256, uint256) {
        require(liquidity > 0, "Invalid liquidity amount");
        require(balanceOf(msg.sender) >= liquidity, "Insufficient LP tokens");

        uint256 amountA = (liquidity * reserveA) / totalLiquidity;
        uint256 amountB = (liquidity * reserveB) / totalLiquidity;

        require(amountA > 0 && amountB > 0, "Insufficient reserves");

        // Burn LP tokens
        _burn(msg.sender, liquidity);
        liquidityBalance[msg.sender] -= liquidity;
        totalLiquidity -= liquidity;

        // Update reserves
        reserveA -= amountA;
        reserveB -= amountB;

        // Transfer tokens back
        require(tokenA.transfer(msg.sender, amountA), "TokenA transfer failed");
        require(tokenB.transfer(msg.sender, amountB), "TokenB transfer failed");

        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
        return (amountA, amountB);
    }

    /**
     * @dev Swap tokens using AMM formula
     */
    function swap(address tokenIn, uint256 amountIn, uint256 minAmountOut) external nonReentrant returns (uint256) {
        require(amountIn > 0, "Invalid input amount");
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");

        bool isTokenA = tokenIn == address(tokenA);
        (uint256 reserveIn, uint256 reserveOut) = isTokenA ? (reserveA, reserveB) : (reserveB, reserveA);

        // Calculate output amount with fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;
        uint256 amountOut = numerator / denominator;

        require(amountOut >= minAmountOut, "Insufficient output amount");
        require(amountOut <= reserveOut, "Insufficient liquidity");

        // Transfer input token
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), "Input transfer failed");

        // Transfer output token
        address tokenOut = isTokenA ? address(tokenB) : address(tokenA);
        require(IERC20(tokenOut).transfer(msg.sender, amountOut), "Output transfer failed");

        // Update reserves
        if (isTokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
        return amountOut;
    }

    /**
     * @dev Get output amount for a given input
     */
    function getAmountOut(address tokenIn, uint256 amountIn) external view returns (uint256) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");

        bool isTokenA = tokenIn == address(tokenA);
        (uint256 reserveIn, uint256 reserveOut) = isTokenA ? (reserveA, reserveB) : (reserveB, reserveA);

        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - FEE_NUMERATOR);
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * FEE_DENOMINATOR) + amountInWithFee;

        return numerator / denominator;
    }

    /**
     * @dev Get current reserves
     */
    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /**
     * @dev Calculate square root (for initial liquidity)
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner(), amount), "Transfer failed");
    }
}