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
        amountA: number;
        amountB: number;
    }): Promise<{
        pool_id: string;
        user_id: string;
        amountA: number;
        amountB: number;
        lp_tokens: number;
        tx_hash: string;
    }>;
    removeLiquidity(req: any, poolId: string, body: {
        lpTokens: number;
    }): Promise<{
        pool_id: string;
        user_id: string;
        lp_tokens_burned: number;
        amountA_received: number;
        amountB_received: number;
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
