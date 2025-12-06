const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Qubic OmniVault contracts...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy oqAsset token
  console.log("Deploying oqAsset...");
  const oqAsset = await ethers.getContractFactory("oqAsset");
  const oqAssetContract = await oqAsset.deploy();
  await oqAssetContract.deployed();
  console.log("oqAsset deployed to:", oqAssetContract.address);

  // Deploy mock stablecoin (USDC)
  console.log("Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockERC20");
  const usdcContract = await MockUSDC.deploy("USD Coin", "USDC", ethers.utils.parseEther("1000000"));
  await usdcContract.deployed();
  console.log("MockUSDC deployed to:", usdcContract.address);

  // Deploy Asset Oracle
  console.log("Deploying AssetOracle...");
  const AssetOracle = await ethers.getContractFactory("AssetOracle");
  const oracleContract = await AssetOracle.deploy();
  await oracleContract.deployed();
  console.log("AssetOracle deployed to:", oracleContract.address);

  // Deploy Lending Pool
  console.log("Deploying LendingPool...");
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPoolContract = await LendingPool.deploy(oqAssetContract.address, usdcContract.address);
  await lendingPoolContract.deployed();
  console.log("LendingPool deployed to:", lendingPoolContract.address);

  // Deploy Liquidity Pool
  console.log("Deploying LiquidityPool...");
  const LiquidityPool = await ethers.getContractFactory("LiquidityPool");
  const liquidityPoolContract = await LiquidityPool.deploy(oqAssetContract.address, usdcContract.address);
  await liquidityPoolContract.deployed();
  console.log("LiquidityPool deployed to:", liquidityPoolContract.address);

  // Deploy Governance
  console.log("Deploying Governance...");
  const Governance = await ethers.getContractFactory("Governance");
  const governanceContract = await Governance.deploy(oqAssetContract.address);
  await governanceContract.deployed();
  console.log("Governance deployed to:", governanceContract.address);

  // Authorize contracts
  console.log("Setting up contract authorizations...");

  // Authorize lending pool as oqAsset minter
  await oqAssetContract.authorizeMinter(lendingPoolContract.address);
  console.log("LendingPool authorized as oqAsset minter");

  // Authorize deployer as oracle
  await oracleContract.authorizeOracle(deployer.address);
  console.log("Deployer authorized as oracle");

  // Fund contracts with initial liquidity
  console.log("Funding contracts with initial liquidity...");

  // Transfer USDC to lending pool
  await usdcContract.transfer(lendingPoolContract.address, ethers.utils.parseEther("100000"));
  console.log("Transferred 100k USDC to LendingPool");

  // Add initial liquidity to pool
  await usdcContract.approve(liquidityPoolContract.address, ethers.utils.parseEther("50000"));
  await oqAssetContract.approve(liquidityPoolContract.address, ethers.utils.parseEther("50000"));
  await liquidityPoolContract.addLiquidity(
    ethers.utils.parseEther("50000"),
    ethers.utils.parseEther("50000")
  );
  console.log("Added initial liquidity to LiquidityPool");

  console.log("\n=== Deployment Complete ===");
  console.log("oqAsset:", oqAssetContract.address);
  console.log("USDC:", usdcContract.address);
  console.log("AssetOracle:", oracleContract.address);
  console.log("LendingPool:", lendingPoolContract.address);
  console.log("LiquidityPool:", liquidityPoolContract.address);
  console.log("Governance:", governanceContract.address);

  // Save deployment addresses
  const deployment = {
    oqAsset: oqAssetContract.address,
    usdc: usdcContract.address,
    oracle: oracleContract.address,
    lendingPool: lendingPoolContract.address,
    liquidityPool: liquidityPoolContract.address,
    governance: governanceContract.address,
    network: network.name,
    deployer: deployer.address
  };

  console.log("\nDeployment addresses saved to deployment.json");
  require("fs").writeFileSync("deployment.json", JSON.stringify(deployment, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });