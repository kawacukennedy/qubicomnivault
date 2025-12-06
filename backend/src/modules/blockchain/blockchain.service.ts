import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

// Import contract ABIs (would be generated from compilation)
const oqAssetABI = require('./contracts/oqAsset.json');
const lendingPoolABI = require('./contracts/LendingPool.json');
const liquidityPoolABI = require('./contracts/LiquidityPool.json');
const assetOracleABI = require('./contracts/AssetOracle.json');
const governanceABI = require('./contracts/Governance.json');

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Wallet;

  // Contract instances
  private oqAssetContract: ethers.Contract;
  private lendingPoolContract: ethers.Contract;
  private liquidityPoolContract: ethers.Contract;
  private assetOracleContract: ethers.Contract;
  private governanceContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private async initializeBlockchain() {
    try {
      const rpcUrl = this.configService.get<string>('QUBIC_RPC_URL', 'http://localhost:8545');
      const privateKey = this.configService.get<string>('PRIVATE_KEY');

      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      if (privateKey) {
        this.signer = new ethers.Wallet(privateKey, this.provider);
        this.logger.log('Blockchain signer initialized');
      }

      // Initialize contracts with deployed addresses
      const oqAssetAddress = this.configService.get<string>('OQASSET_CONTRACT_ADDRESS');
      const lendingPoolAddress = this.configService.get<string>('LENDING_POOL_CONTRACT_ADDRESS');
      const liquidityPoolAddress = this.configService.get<string>('LIQUIDITY_POOL_CONTRACT_ADDRESS');
      const oracleAddress = this.configService.get<string>('ORACLE_CONTRACT_ADDRESS');
      const governanceAddress = this.configService.get<string>('GOVERNANCE_CONTRACT_ADDRESS');

      if (oqAssetAddress) {
        this.oqAssetContract = new ethers.Contract(oqAssetAddress, oqAssetABI, this.signer);
      }
      if (lendingPoolAddress) {
        this.lendingPoolContract = new ethers.Contract(lendingPoolAddress, lendingPoolABI, this.signer);
      }
      if (liquidityPoolAddress) {
        this.liquidityPoolContract = new ethers.Contract(liquidityPoolAddress, liquidityPoolABI, this.signer);
      }
      if (oracleAddress) {
        this.assetOracleContract = new ethers.Contract(oracleAddress, assetOracleABI, this.signer);
      }
      if (governanceAddress) {
        this.governanceContract = new ethers.Contract(governanceAddress, governanceABI, this.signer);
      }

      this.logger.log('Blockchain contracts initialized');
    } catch (error) {
      this.logger.error('Failed to initialize blockchain connection', error);
    }
  }

  // oqAsset functions
  async mintOqAsset(to: string, amount: string, metadata: any): Promise<string> {
    try {
      const tx = await this.oqAssetContract.mintAsset(
        to,
        ethers.utils.parseEther(amount),
        metadata.documentHash,
        metadata.valuation,
        metadata.maturityDate,
        metadata.assetType
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to mint oqAsset', error);
      throw error;
    }
  }

  async getOqAssetBalance(address: string): Promise<string> {
    try {
      const balance = await this.oqAssetContract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      this.logger.error('Failed to get oqAsset balance', error);
      throw error;
    }
  }

  async getOqAssetMetadata(assetId: string): Promise<any> {
    try {
      const metadata = await this.oqAssetContract.getAssetMetadata(assetId);
      return {
        documentHash: metadata.documentHash,
        valuation: metadata.valuation.toString(),
        maturityDate: metadata.maturityDate.toString(),
        creator: metadata.creator,
        isActive: metadata.isActive,
        assetType: metadata.assetType
      };
    } catch (error) {
      this.logger.error('Failed to get oqAsset metadata', error);
      throw error;
    }
  }

  // Lending Pool functions
  async createLoan(
    borrower: string,
    oqAssetAmount: string,
    stablecoinAmount: string,
    assetId: string
  ): Promise<string> {
    try {
      // First approve oqAsset transfer
      const approveTx = await this.oqAssetContract.approve(
        this.lendingPoolContract.address,
        ethers.utils.parseEther(oqAssetAmount)
      );
      await approveTx.wait();

      const tx = await this.lendingPoolContract.createLoan(
        ethers.utils.parseEther(oqAssetAmount),
        ethers.utils.parseEther(stablecoinAmount),
        assetId
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to create loan', error);
      throw error;
    }
  }

  async repayLoan(loanId: string, amount: string): Promise<string> {
    try {
      const tx = await this.lendingPoolContract.repayLoan(loanId, ethers.utils.parseEther(amount));
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to repay loan', error);
      throw error;
    }
  }

  async getLoanDetails(loanId: string): Promise<any> {
    try {
      const loan = await this.lendingPoolContract.loans(loanId);
      return {
        id: loan.id.toString(),
        borrower: loan.borrower,
        oqAssetAmount: ethers.utils.formatEther(loan.oqAssetAmount),
        stablecoinAmount: ethers.utils.formatEther(loan.stablecoinAmount),
        collateralRatio: loan.collateralRatio.toString(),
        interestRate: loan.interestRate.toString(),
        startTime: loan.startTime.toString(),
        isActive: loan.isActive,
        assetId: loan.assetId.toString()
      };
    } catch (error) {
      this.logger.error('Failed to get loan details', error);
      throw error;
    }
  }

  // Liquidity Pool functions
  async addLiquidity(
    tokenAAmount: string,
    tokenBAmount: string
  ): Promise<string> {
    try {
      // Approve tokens
      const approveATx = await this.oqAssetContract.approve(
        this.liquidityPoolContract.address,
        ethers.utils.parseEther(tokenAAmount)
      );
      await approveATx.wait();

      // Assuming tokenB is stablecoin, need to get its contract
      const stablecoinAddress = await this.liquidityPoolContract.tokenB();
      const stablecoinContract = new ethers.Contract(stablecoinAddress, [], this.signer);
      const approveBTx = await stablecoinContract.approve(
        this.liquidityPoolContract.address,
        ethers.utils.parseEther(tokenBAmount)
      );
      await approveBTx.wait();

      const tx = await this.liquidityPoolContract.addLiquidity(
        ethers.utils.parseEther(tokenAAmount),
        ethers.utils.parseEther(tokenBAmount)
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to add liquidity', error);
      throw error;
    }
  }

  async removeLiquidity(liquidityAmount: string): Promise<string> {
    try {
      const tx = await this.liquidityPoolContract.removeLiquidity(
        ethers.utils.parseEther(liquidityAmount)
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to remove liquidity', error);
      throw error;
    }
  }

  async swapTokens(
    tokenIn: string,
    amountIn: string,
    minAmountOut: string
  ): Promise<string> {
    try {
      // Approve token
      let tokenContract;
      if (tokenIn === this.oqAssetContract.address) {
        tokenContract = this.oqAssetContract;
      } else {
        tokenContract = new ethers.Contract(tokenIn, [], this.signer);
      }

      const approveTx = await tokenContract.approve(
        this.liquidityPoolContract.address,
        ethers.utils.parseEther(amountIn)
      );
      await approveTx.wait();

      const tx = await this.liquidityPoolContract.swap(
        tokenIn,
        ethers.utils.parseEther(amountIn),
        ethers.utils.parseEther(minAmountOut)
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to swap tokens', error);
      throw error;
    }
  }

  // Oracle functions
  async submitValuation(assetId: string, value: string): Promise<string> {
    try {
      const tx = await this.assetOracleContract.submitValuation(assetId, value);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to submit valuation', error);
      throw error;
    }
  }

  async getValuation(assetId: string): Promise<any> {
    try {
      const [value, confidence, timestamp] = await this.assetOracleContract.getValuation(assetId);
      return {
        value: value.toString(),
        confidence: confidence.toString(),
        timestamp: timestamp.toString()
      };
    } catch (error) {
      this.logger.error('Failed to get valuation', error);
      throw error;
    }
  }

  // Governance functions
  async createProposal(
    description: string,
    target: string,
    data: string,
    value: string
  ): Promise<string> {
    try {
      const tx = await this.governanceContract.propose(
        description,
        target,
        data,
        ethers.utils.parseEther(value)
      );
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to create proposal', error);
      throw error;
    }
  }

  async castVote(proposalId: string, support: boolean): Promise<string> {
    try {
      const tx = await this.governanceContract.castVote(proposalId, support);
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      this.logger.error('Failed to cast vote', error);
      throw error;
    }
  }

  // Utility functions
  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      this.logger.error('Failed to get block number', error);
      throw error;
    }
  }

  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      this.logger.error('Failed to get gas price', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      this.logger.error('Failed to get balance', error);
      throw error;
    }
  }
}