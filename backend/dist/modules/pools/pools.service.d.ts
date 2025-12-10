import { BlockchainService } from '../blockchain/blockchain.service';
export declare class PoolsService {
    private blockchainService;
    private readonly logger;
    constructor(blockchainService: BlockchainService);
    private pools;
    getPools(): Promise<{
        id: string;
        name: string;
        tokenA: string;
        tokenB: string;
        tvl: number;
        apr: number;
        volume24h: number;
        reserves: {
            tokenA: number;
            tokenB: number;
        };
    }[]>;
    getPoolById(poolId: string): Promise<{
        id: string;
        name: string;
        tokenA: string;
        tokenB: string;
        tvl: number;
        apr: number;
        volume24h: number;
        reserves: {
            tokenA: number;
            tokenB: number;
        };
    }>;
    addLiquidity(userId: string, poolId: string, amountA: string, amountB: string): Promise<{
        pool_id: string;
        user_id: string;
        amountA: string;
        amountB: string;
        lp_tokens: string;
        tx_hash: string;
    }>;
    removeLiquidity(userId: string, poolId: string, lpTokens: string): Promise<{
        pool_id: string;
        user_id: string;
        lp_tokens_burned: string;
        amountA_received: string;
        amountB_received: string;
        tx_hash: string;
    }>;
    swapTokens(userId: string, poolId: string, tokenIn: string, amountIn: string, minAmountOut: string): Promise<{
        pool_id: string;
        user_id: string;
        token_in: string;
        amount_in: string;
        min_amount_out: string;
        tx_hash: string;
    }>;
    getUserLiquidity(userId: string): Promise<{
        pool_id: string;
        pool_name: string;
        lp_tokens: number;
        share_percentage: number;
        tokenA_amount: number;
        tokenB_amount: number;
    }[]>;
}
