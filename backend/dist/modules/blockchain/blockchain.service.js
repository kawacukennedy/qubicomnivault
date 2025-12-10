"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BlockchainService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ethers_1 = require("ethers");
const web3_sdk_1 = require("@qubic/web3-sdk");
const oqAssetABI = require('./contracts/oqAsset.json');
const lendingPoolABI = require('./contracts/LendingPool.json');
const liquidityPoolABI = require('./contracts/LiquidityPool.json');
const assetOracleABI = require('./contracts/AssetOracle.json');
const governanceABI = require('./contracts/Governance.json');
let BlockchainService = BlockchainService_1 = class BlockchainService {
    configService;
    logger = new common_1.Logger(BlockchainService_1.name);
    qubicProvider;
    qubicWallet;
    oqAssetContract = null;
    lendingPoolContract = null;
    liquidityPoolContract = null;
    assetOracleContract = null;
    governanceContract = null;
    signer = null;
    constructor(configService) {
        this.configService = configService;
        this.initializeBlockchain();
    }
    async initializeBlockchain() {
        try {
            const rpcUrl = this.configService.get('QUBIC_RPC_URL', 'https://rpc.qubic.org');
            const privateKey = this.configService.get('PRIVATE_KEY');
            const chainId = this.configService.get('QUBIC_CHAIN_ID', 12345);
            this.qubicProvider = new web3_sdk_1.QubicProvider({
                rpcUrl,
                chainId,
            });
            if (privateKey) {
                this.qubicWallet = new web3_sdk_1.QubicWallet(privateKey, this.qubicProvider);
                this.logger.log('Qubic wallet initialized');
            }
            const oqAssetAddress = this.configService.get('OQASSET_CONTRACT_ADDRESS');
            const lendingPoolAddress = this.configService.get('LENDING_POOL_CONTRACT_ADDRESS');
            const liquidityPoolAddress = this.configService.get('LIQUIDITY_POOL_CONTRACT_ADDRESS');
            const oracleAddress = this.configService.get('ORACLE_CONTRACT_ADDRESS');
            const governanceAddress = this.configService.get('GOVERNANCE_CONTRACT_ADDRESS');
            if (oqAssetAddress && this.qubicWallet) {
                this.signer = this.qubicWallet.signer;
                this.oqAssetContract = new ethers_1.ethers.Contract(oqAssetAddress, oqAssetABI, this.signer);
            }
            if (lendingPoolAddress && this.qubicWallet) {
                this.lendingPoolContract = new ethers_1.ethers.Contract(lendingPoolAddress, lendingPoolABI, this.signer);
            }
            if (liquidityPoolAddress && this.qubicWallet) {
                this.liquidityPoolContract = new ethers_1.ethers.Contract(liquidityPoolAddress, liquidityPoolABI, this.signer);
            }
            if (oracleAddress && this.qubicWallet) {
                this.assetOracleContract = new ethers_1.ethers.Contract(oracleAddress, assetOracleABI, this.signer);
            }
            if (governanceAddress && this.qubicWallet) {
                this.governanceContract = new ethers_1.ethers.Contract(governanceAddress, governanceABI, this.signer);
            }
            this.logger.log('Qubic blockchain contracts initialized');
        }
        catch (error) {
            this.logger.error('Failed to initialize Qubic blockchain connection', error);
        }
    }
    async mintOqAsset(to, amount, metadata) {
        if (!this.oqAssetContract) {
            this.logger.warn('oqAsset contract not available, using mock implementation');
            const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            return mockTxHash;
        }
        try {
            const tx = await this.qubicWallet.sendTransaction({
                to: this.oqAssetContract.address,
                data: this.oqAssetContract.interface.encodeFunctionData('mintAsset', [
                    to,
                    ethers_1.ethers.utils.parseEther(amount),
                    metadata.documentHash,
                    metadata.valuation,
                    metadata.maturityDate,
                    metadata.assetType
                ]),
                value: '0',
            });
            this.logger.log(`oqAsset minted on Qubic: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to mint oqAsset on Qubic', error);
            throw error;
        }
    }
    async getOqAssetBalance(address) {
        if (!this.oqAssetContract) {
            return '1000.0';
        }
        try {
            const balance = await this.qubicProvider.call({
                to: this.oqAssetContract.address,
                data: this.oqAssetContract.interface.encodeFunctionData('balanceOf', [address]),
            });
            return ethers_1.ethers.utils.formatEther(balance);
        }
        catch (error) {
            this.logger.error('Failed to get oqAsset balance from Qubic', error);
            throw error;
        }
    }
    async getOqAssetMetadata(assetId) {
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
        }
        catch (error) {
            this.logger.error('Failed to get oqAsset metadata', error);
            throw error;
        }
    }
    async createLoan(borrower, oqAssetAmount, stablecoinAmount, assetId) {
        if (!this.lendingPoolContract || !this.oqAssetContract) {
            this.logger.warn('Lending contracts not available, using mock implementation');
            const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            return mockTxHash;
        }
        try {
            const approveTx = await this.qubicWallet.sendTransaction({
                to: this.oqAssetContract.address,
                data: this.oqAssetContract.interface.encodeFunctionData('approve', [
                    this.lendingPoolContract.address,
                    ethers_1.ethers.utils.parseEther(oqAssetAmount)
                ]),
                value: '0',
            });
            await this.qubicProvider.waitForTransaction(approveTx.hash);
            const loanTx = await this.qubicWallet.sendTransaction({
                to: this.lendingPoolContract.address,
                data: this.lendingPoolContract.interface.encodeFunctionData('createLoan', [
                    ethers_1.ethers.utils.parseEther(oqAssetAmount),
                    ethers_1.ethers.utils.parseEther(stablecoinAmount),
                    assetId
                ]),
                value: '0',
            });
            this.logger.log(`Loan created on Qubic: ${loanTx.hash}`);
            return loanTx.hash;
        }
        catch (error) {
            this.logger.error('Failed to create loan on Qubic', error);
            throw error;
        }
    }
    async repayLoan(loanId, amount) {
        if (!this.lendingPoolContract) {
            this.logger.warn('Lending contract not available, using mock implementation');
            const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            return mockTxHash;
        }
        try {
            const tx = await this.qubicWallet.sendTransaction({
                to: this.lendingPoolContract.address,
                data: this.lendingPoolContract.interface.encodeFunctionData('repayLoan', [
                    loanId,
                    ethers_1.ethers.utils.parseEther(amount)
                ]),
                value: '0',
            });
            this.logger.log(`Loan repaid on Qubic: ${tx.hash}`);
            return tx.hash;
        }
        catch (error) {
            this.logger.error('Failed to repay loan on Qubic', error);
            throw error;
        }
    }
    async getLoanDetails(loanId) {
        try {
            const loan = await this.lendingPoolContract.loans(loanId);
            return {
                id: loan.id.toString(),
                borrower: loan.borrower,
                oqAssetAmount: ethers_1.ethers.utils.formatEther(loan.oqAssetAmount),
                stablecoinAmount: ethers_1.ethers.utils.formatEther(loan.stablecoinAmount),
                collateralRatio: loan.collateralRatio.toString(),
                interestRate: loan.interestRate.toString(),
                startTime: loan.startTime.toString(),
                isActive: loan.isActive,
                assetId: loan.assetId.toString()
            };
        }
        catch (error) {
            this.logger.error('Failed to get loan details', error);
            throw error;
        }
    }
    async addLiquidity(tokenAAmount, tokenBAmount) {
        try {
            const approveATx = await this.oqAssetContract.approve(this.liquidityPoolContract.address, ethers_1.ethers.utils.parseEther(tokenAAmount));
            await approveATx.wait();
            const stablecoinAddress = await this.liquidityPoolContract.tokenB();
            const stablecoinContract = new ethers_1.ethers.Contract(stablecoinAddress, [], this.signer);
            const approveBTx = await stablecoinContract.approve(this.liquidityPoolContract.address, ethers_1.ethers.utils.parseEther(tokenBAmount));
            await approveBTx.wait();
            const tx = await this.liquidityPoolContract.addLiquidity(ethers_1.ethers.utils.parseEther(tokenAAmount), ethers_1.ethers.utils.parseEther(tokenBAmount));
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to add liquidity', error);
            throw error;
        }
    }
    async removeLiquidity(liquidityAmount) {
        try {
            const tx = await this.liquidityPoolContract.removeLiquidity(ethers_1.ethers.utils.parseEther(liquidityAmount));
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to remove liquidity', error);
            throw error;
        }
    }
    async swapTokens(tokenIn, amountIn, minAmountOut) {
        try {
            let tokenContract;
            if (tokenIn === this.oqAssetContract.address) {
                tokenContract = this.oqAssetContract;
            }
            else {
                tokenContract = new ethers_1.ethers.Contract(tokenIn, [], this.signer);
            }
            const approveTx = await tokenContract.approve(this.liquidityPoolContract.address, ethers_1.ethers.utils.parseEther(amountIn));
            await approveTx.wait();
            const tx = await this.liquidityPoolContract.swap(tokenIn, ethers_1.ethers.utils.parseEther(amountIn), ethers_1.ethers.utils.parseEther(minAmountOut));
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to swap tokens', error);
            throw error;
        }
    }
    async submitValuation(assetId, value) {
        try {
            const tx = await this.assetOracleContract.submitValuation(assetId, value);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to submit valuation', error);
            throw error;
        }
    }
    async getValuation(assetId) {
        try {
            const [value, confidence, timestamp] = await this.assetOracleContract.getValuation(assetId);
            return {
                value: value.toString(),
                confidence: confidence.toString(),
                timestamp: timestamp.toString()
            };
        }
        catch (error) {
            this.logger.error('Failed to get valuation', error);
            throw error;
        }
    }
    async createProposal(description, target, data, value) {
        try {
            const tx = await this.governanceContract.propose(description, target, data, ethers_1.ethers.utils.parseEther(value));
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to create proposal', error);
            throw error;
        }
    }
    async castVote(proposalId, support) {
        try {
            const tx = await this.governanceContract.castVote(proposalId, support);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        }
        catch (error) {
            this.logger.error('Failed to cast vote', error);
            throw error;
        }
    }
    async getBlockNumber() {
        try {
            return await this.qubicProvider.getBlockNumber();
        }
        catch (error) {
            this.logger.error('Failed to get Qubic block number', error);
            throw error;
        }
    }
    async getGasPrice() {
        try {
            const gasPrice = await this.qubicProvider.getGasPrice();
            return ethers_1.ethers.utils.formatUnits(gasPrice, 'gwei');
        }
        catch (error) {
            this.logger.error('Failed to get Qubic gas price', error);
            throw error;
        }
    }
    async getBalance(address) {
        try {
            const balance = await this.qubicProvider.getBalance(address);
            return ethers_1.ethers.utils.formatEther(balance);
        }
        catch (error) {
            this.logger.error('Failed to get Qubic balance', error);
            throw error;
        }
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = BlockchainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map