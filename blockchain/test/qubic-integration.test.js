const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Qubic OmniVault Integration", function () {
  let oqAsset, lendingPool, liquidityPool, oracle, governance;
  let owner, user1, user2;
  let usdc;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Mock USDC
    const MockUSDC = await ethers.getContractFactory("MockERC20");
    usdc = await MockUSDC.deploy("USD Coin", "USDC", ethers.utils.parseEther("1000000"));
    await usdc.deployed();

    // Deploy oqAsset
    const oqAssetFactory = await ethers.getContractFactory("oqAsset");
    oqAsset = await oqAssetFactory.deploy();
    await oqAsset.deployed();

    // Deploy Oracle
    const OracleFactory = await ethers.getContractFactory("AssetOracle");
    oracle = await OracleFactory.deploy();
    await oracle.deployed();

    // Deploy Lending Pool
    const LendingPoolFactory = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPoolFactory.deploy(oqAsset.address, usdc.address);
    await lendingPool.deployed();

    // Deploy Liquidity Pool
    const LiquidityPoolFactory = await ethers.getContractFactory("LiquidityPool");
    liquidityPool = await LiquidityPoolFactory.deploy(oqAsset.address, usdc.address);
    await liquidityPool.deployed();

    // Deploy Governance
    const GovernanceFactory = await ethers.getContractFactory("Governance");
    governance = await GovernanceFactory.deploy(oqAsset.address);
    await governance.deployed();

    // Setup authorizations
    await oqAsset.authorizeMinter(lendingPool.address);
    await oracle.authorizeOracle(owner.address);
  });

  describe("oqAsset Token", function () {
    it("Should mint oqAsset tokens", async function () {
      const amount = ethers.utils.parseEther("1000");
      const assetId = await oqAsset.mintAsset(
        user1.address,
        amount,
        "document-hash",
        100000, // $100 valuation in cents
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year maturity
        "invoice"
      );

      expect(await oqAsset.balanceOf(user1.address)).to.equal(amount);
    });

    it("Should have correct metadata", async function () {
      const metadata = await oqAsset.getAssetMetadata(1);
      expect(metadata.documentHash).to.equal("document-hash");
      expect(metadata.valuation).to.equal(100000);
      expect(metadata.assetType).to.equal("invoice");
    });
  });

  describe("Asset Oracle", function () {
    it("Should submit and retrieve valuations", async function () {
      await oracle.submitValuation(1, 105000); // $105 valuation

      const valuation = await oracle.getValuation(1);
      expect(valuation[0]).to.equal(105000); // value
      expect(valuation[2]).to.be.gt(0); // timestamp
    });

    it("Should validate recent valuations", async function () {
      const isValid = await oracle.isValuationValid(1);
      expect(isValid).to.be.true;
    });
  });

  describe("Lending Pool", function () {
    before(async function () {
      // Fund lending pool with USDC
      await usdc.transfer(lendingPool.address, ethers.utils.parseEther("10000"));
    });

    it("Should create loans", async function () {
      const oqAssetAmount = ethers.utils.parseEther("100");
      const stablecoinAmount = ethers.utils.parseEther("70"); // 70% LTV

      // Approve oqAsset transfer
      await oqAsset.connect(user1).approve(lendingPool.address, oqAssetAmount);

      await lendingPool.connect(user1).createLoan(
        oqAssetAmount,
        stablecoinAmount,
        1 // assetId
      );

      const loan = await lendingPool.loans(1);
      expect(loan.borrower).to.equal(user1.address);
      expect(loan.oqAssetAmount).to.equal(oqAssetAmount);
      expect(loan.stablecoinAmount).to.equal(stablecoinAmount);
    });

    it("Should repay loans", async function () {
      const repayAmount = ethers.utils.parseEther("35");

      // Approve USDC transfer
      await usdc.connect(user1).approve(lendingPool.address, repayAmount);

      await lendingPool.connect(user1).repayLoan(1, repayAmount);

      const loan = await lendingPool.loans(1);
      expect(loan.stablecoinAmount).to.equal(ethers.utils.parseEther("35"));
    });
  });

  describe("Liquidity Pool", function () {
    it("Should add liquidity", async function () {
      const tokenAAmount = ethers.utils.parseEther("100");
      const tokenBAmount = ethers.utils.parseEther("100");

      // Approve tokens
      await oqAsset.connect(owner).approve(liquidityPool.address, tokenAAmount);
      await usdc.connect(owner).approve(liquidityPool.address, tokenBAmount);

      await liquidityPool.addLiquidity(tokenAAmount, tokenBAmount);

      // Check reserves (simplified check)
      expect(await oqAsset.balanceOf(liquidityPool.address)).to.equal(tokenAAmount);
      expect(await usdc.balanceOf(liquidityPool.address)).to.equal(tokenBAmount);
    });
  });

  describe("Governance", function () {
    it("Should create proposals", async function () {
      // Mint governance tokens for user1
      await oqAsset.mintAsset(
        user1.address,
        ethers.utils.parseEther("1000"), // Above proposal threshold
        "gov-token",
        1000000,
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
        "governance"
      );

      await governance.connect(user1).propose(
        "Update interest rate to 8%",
        lendingPool.address,
        "0x", // No data
        0 // No value
      );

      const proposal = await governance.getProposal(1);
      expect(proposal.description).to.equal("Update interest rate to 8%");
      expect(proposal.proposer).to.equal(user1.address);
    });

    it("Should allow voting", async function () {
      await governance.connect(user1).castVote(1, true); // Vote for

      const proposal = await governance.getProposal(1);
      expect(proposal.forVotes).to.equal(ethers.utils.parseEther("1000"));
    });
  });
});