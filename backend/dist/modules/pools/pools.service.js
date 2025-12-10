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
var PoolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolsService = void 0;
const common_1 = require("@nestjs/common");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let PoolsService = PoolsService_1 = class PoolsService {
    blockchainService;
    logger = new common_1.Logger(PoolsService_1.name);
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    pools = [
        {
            id: '1',
            name: 'oqAsset/USDC',
            tokenA: 'oqAsset',
            tokenB: 'USDC',
            tvl: 2500000,
            apr: 12.5,
            volume24h: 150000,
            reserves: {
                tokenA: 1250000,
                tokenB: 1250000,
            },
        },
        {
            id: '2',
            name: 'oqAsset/DAI',
            tokenA: 'oqAsset',
            tokenB: 'DAI',
            tvl: 1800000,
            apr: 10.2,
            volume24h: 95000,
            reserves: {
                tokenA: 900000,
                tokenB: 900000,
            },
        },
        {
            id: '3',
            name: 'USDC/Stable',
            tokenA: 'USDC',
            tokenB: 'USDC',
            tvl: 5000000,
            apr: 8.7,
            volume24h: 300000,
            reserves: {
                tokenA: 2500000,
                tokenB: 2500000,
            },
        },
    ];
    async getPools() {
        return this.pools.map(pool => ({
            id: pool.id,
            name: pool.name,
            tokenA: pool.tokenA,
            tokenB: pool.tokenB,
            tvl: pool.tvl,
            apr: pool.apr,
            volume24h: pool.volume24h,
            reserves: pool.reserves,
        }));
    }
    async getPoolById(poolId) {
        const pool = this.pools.find(p => p.id === poolId);
        if (!pool) {
            throw new Error('Pool not found');
        }
        return pool;
    }
    async addLiquidity(userId, poolId, amountA, amountB) {
        try {
            const txHash = await this.blockchainService.addLiquidity(amountA, amountB);
            this.logger.log(`Liquidity added to pool ${poolId} on Qubic: ${txHash}`);
            const lpTokens = Math.sqrt(parseFloat(amountA) * parseFloat(amountB)).toString();
            return {
                pool_id: poolId,
                user_id: userId,
                amountA,
                amountB,
                lp_tokens: lpTokens,
                tx_hash: txHash,
            };
        }
        catch (error) {
            this.logger.error('Failed to add liquidity', error);
            throw error;
        }
    }
    async removeLiquidity(userId, poolId, lpTokens) {
        try {
            const txHash = await this.blockchainService.removeLiquidity(lpTokens);
            this.logger.log(`Liquidity removed from pool ${poolId} on Qubic: ${txHash}`);
            const amountAReceived = (parseFloat(lpTokens) * 0.5).toString();
            const amountBReceived = (parseFloat(lpTokens) * 0.5).toString();
            return {
                pool_id: poolId,
                user_id: userId,
                lp_tokens_burned: lpTokens,
                amountA_received: amountAReceived,
                amountB_received: amountBReceived,
                tx_hash: txHash,
            };
        }
        catch (error) {
            this.logger.error('Failed to remove liquidity', error);
            throw error;
        }
    }
    async swapTokens(userId, poolId, tokenIn, amountIn, minAmountOut) {
        try {
            const txHash = await this.blockchainService.swapTokens(tokenIn, amountIn, minAmountOut);
            this.logger.log(`Token swap in pool ${poolId} on Qubic: ${txHash}`);
            return {
                pool_id: poolId,
                user_id: userId,
                token_in: tokenIn,
                amount_in: amountIn,
                min_amount_out: minAmountOut,
                tx_hash: txHash,
            };
        }
        catch (error) {
            this.logger.error('Failed to swap tokens', error);
            throw error;
        }
    }
    async getUserLiquidity(userId) {
        return [
            {
                pool_id: '1',
                pool_name: 'oqAsset/USDC',
                lp_tokens: 1000,
                share_percentage: 0.04,
                tokenA_amount: 500,
                tokenB_amount: 500,
            },
            {
                pool_id: '3',
                pool_name: 'USDC/Stable',
                lp_tokens: 2000,
                share_percentage: 0.08,
                tokenA_amount: 1000,
                tokenB_amount: 1000,
            },
        ];
    }
};
exports.PoolsService = PoolsService;
exports.PoolsService = PoolsService = PoolsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], PoolsService);
//# sourceMappingURL=pools.service.js.map