export declare class PoolsService {
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
    addLiquidity(userId: string, poolId: string, amountA: number, amountB: number): Promise<{
        pool_id: string;
        user_id: string;
        amountA: number;
        amountB: number;
        lp_tokens: number;
        tx_hash: string;
    }>;
    removeLiquidity(userId: string, poolId: string, lpTokens: number): Promise<{
        pool_id: string;
        user_id: string;
        lp_tokens_burned: number;
        amountA_received: number;
        amountB_received: number;
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
