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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blockchain_service_1 = require("./blockchain.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BlockchainController = class BlockchainController {
    blockchainService;
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    async getBalance(address) {
        return this.blockchainService.getBalance(address);
    }
    async getOqAssetBalance(address) {
        return this.blockchainService.getOqAssetBalance(address);
    }
    async getOqAssetMetadata(assetId) {
        return this.blockchainService.getOqAssetMetadata(assetId);
    }
    async mintOqAsset(req, body) {
        const txHash = await this.blockchainService.mintOqAsset(body.to, body.amount, body.metadata);
        return { transactionHash: txHash };
    }
    async createLoan(req, body) {
        const txHash = await this.blockchainService.createLoan(req.user.walletAddress, body.oqAssetAmount, body.stablecoinAmount, body.assetId);
        return { transactionHash: txHash };
    }
    async repayLoan(loanId, body) {
        const txHash = await this.blockchainService.repayLoan(loanId, body.amount);
        return { transactionHash: txHash };
    }
    async getLoanDetails(loanId) {
        return this.blockchainService.getLoanDetails(loanId);
    }
    async addLiquidity(body) {
        const txHash = await this.blockchainService.addLiquidity(body.tokenAAmount, body.tokenBAmount);
        return { transactionHash: txHash };
    }
    async removeLiquidity(body) {
        const txHash = await this.blockchainService.removeLiquidity(body.liquidityAmount);
        return { transactionHash: txHash };
    }
    async swapTokens(body) {
        const txHash = await this.blockchainService.swapTokens(body.tokenIn, body.amountIn, body.minAmountOut);
        return { transactionHash: txHash };
    }
    async submitValuation(body) {
        const txHash = await this.blockchainService.submitValuation(body.assetId, body.value);
        return { transactionHash: txHash };
    }
    async getValuation(assetId) {
        return this.blockchainService.getValuation(assetId);
    }
    async createProposal(body) {
        const txHash = await this.blockchainService.createProposal(body.description, body.target, body.data, body.value);
        return { transactionHash: txHash };
    }
    async castVote(body) {
        const txHash = await this.blockchainService.castVote(body.proposalId, body.support);
        return { transactionHash: txHash };
    }
    async getNetworkStatus() {
        const [blockNumber, gasPrice] = await Promise.all([
            this.blockchainService.getBlockNumber(),
            this.blockchainService.getGasPrice()
        ]);
        return { blockNumber, gasPrice };
    }
    async getHealth() {
        try {
            const blockNumber = await this.blockchainService.getBlockNumber();
            const gasPrice = await this.blockchainService.getGasPrice();
            return {
                status: 'healthy',
                network: 'qubic',
                blockNumber,
                gasPrice,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                network: 'qubic',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    getContractAddresses() {
        return {
            oqAsset: process.env.OQASSET_CONTRACT_ADDRESS || 'not-deployed',
            lendingPool: process.env.LENDING_POOL_CONTRACT_ADDRESS || 'not-deployed',
            liquidityPool: process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS || 'not-deployed',
            oracle: process.env.ORACLE_CONTRACT_ADDRESS || 'not-deployed',
            governance: process.env.GOVERNANCE_CONTRACT_ADDRESS || 'not-deployed',
        };
    }
};
exports.BlockchainController = BlockchainController;
__decorate([
    (0, common_1.Get)('balance/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get native token balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance retrieved successfully' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('oqasset/balance/:address'),
    (0, swagger_1.ApiOperation)({ summary: 'Get oqAsset balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Balance retrieved successfully' }),
    __param(0, (0, common_1.Param)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getOqAssetBalance", null);
__decorate([
    (0, common_1.Get)('oqasset/metadata/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get oqAsset metadata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Metadata retrieved successfully' }),
    __param(0, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getOqAssetMetadata", null);
__decorate([
    (0, common_1.Post)('oqasset/mint'),
    (0, swagger_1.ApiOperation)({ summary: 'Mint oqAsset tokens' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'oqAsset minted successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "mintOqAsset", null);
__decorate([
    (0, common_1.Post)('loans/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a loan' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Loan created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "createLoan", null);
__decorate([
    (0, common_1.Post)('loans/:loanId/repay'),
    (0, swagger_1.ApiOperation)({ summary: 'Repay a loan' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Loan repaid successfully' }),
    __param(0, (0, common_1.Param)('loanId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "repayLoan", null);
__decorate([
    (0, common_1.Get)('loans/:loanId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get loan details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Loan details retrieved successfully' }),
    __param(0, (0, common_1.Param)('loanId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getLoanDetails", null);
__decorate([
    (0, common_1.Post)('pools/add-liquidity'),
    (0, swagger_1.ApiOperation)({ summary: 'Add liquidity to pool' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Liquidity added successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "addLiquidity", null);
__decorate([
    (0, common_1.Post)('pools/remove-liquidity'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove liquidity from pool' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liquidity removed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "removeLiquidity", null);
__decorate([
    (0, common_1.Post)('pools/swap'),
    (0, swagger_1.ApiOperation)({ summary: 'Swap tokens in pool' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tokens swapped successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "swapTokens", null);
__decorate([
    (0, common_1.Post)('oracle/submit-valuation'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit asset valuation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Valuation submitted successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "submitValuation", null);
__decorate([
    (0, common_1.Get)('oracle/valuation/:assetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get asset valuation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation retrieved successfully' }),
    __param(0, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getValuation", null);
__decorate([
    (0, common_1.Post)('governance/propose'),
    (0, swagger_1.ApiOperation)({ summary: 'Create governance proposal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proposal created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "createProposal", null);
__decorate([
    (0, common_1.Post)('governance/vote'),
    (0, swagger_1.ApiOperation)({ summary: 'Cast vote on proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote cast successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "castVote", null);
__decorate([
    (0, common_1.Get)('network/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get network status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Network status retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getNetworkStatus", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Check Qubic blockchain connectivity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Qubic blockchain health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlockchainController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('contracts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deployed contract addresses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract addresses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlockchainController.prototype, "getContractAddresses", null);
exports.BlockchainController = BlockchainController = __decorate([
    (0, swagger_1.ApiTags)('blockchain'),
    (0, common_1.Controller)('blockchain'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], BlockchainController);
//# sourceMappingURL=blockchain.controller.js.map