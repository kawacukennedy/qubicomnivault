import { PoolsService } from './pools.service';
export declare class PoolsController {
    private readonly poolsService;
    constructor(poolsService: PoolsService);
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
    addLiquidity(req: any, poolId: string, body: {
        amountA: string;
        amountB: string;
    }): Promise<{
        pool_id: string;
        user_id: string;
        amountA: string;
        amountB: string;
        lp_tokens: string;
        tx_hash: string;
    }>;
    removeLiquidity(req: any, poolId: string, body: {
        lpTokens: string;
    }): Promise<{
        pool_id: string;
        user_id: string;
        lp_tokens_burned: string;
        amountA_received: string;
        amountB_received: string;
        tx_hash: string;
    }>;
    swapTokens(req: any, poolId: string, body: {
        tokenIn: string;
        amountIn: string;
        minAmountOut: string;
    }): Promise<{
        pool_id: string;
        user_id: string;
        token_in: string;
        amount_in: string;
        min_amount_out: string;
        tx_hash: string;
    }>;
    getUserLiquidity(req: any): Promise<{
        pool_id: string;
        pool_name: string;
        lp_tokens: number;
        share_percentage: number;
        tokenA_amount: number;
        tokenB_amount: number;
    }[]>;
}
