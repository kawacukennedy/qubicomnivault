import { Injectable } from '@nestjs/common';

@Injectable()
export class PoolsService {
  // Mock data for demonstration
  private pools = [
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
      tokenB: 'USDC', // Simplified
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

  async getPoolById(poolId: string) {
    const pool = this.pools.find(p => p.id === poolId);
    if (!pool) {
      throw new Error('Pool not found');
    }
    return pool;
  }

  async addLiquidity(userId: string, poolId: string, amountA: number, amountB: number) {
    // TODO: Implement actual liquidity addition
    return {
      pool_id: poolId,
      user_id: userId,
      amountA,
      amountB,
      lp_tokens: Math.sqrt(amountA * amountB), // Simplified calculation
      tx_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  }

  async removeLiquidity(userId: string, poolId: string, lpTokens: number) {
    // TODO: Implement actual liquidity removal
    return {
      pool_id: poolId,
      user_id: userId,
      lp_tokens_burned: lpTokens,
      amountA_received: lpTokens * 0.5, // Simplified
      amountB_received: lpTokens * 0.5,
      tx_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    };
  }

  async getUserLiquidity(userId: string) {
    // Mock user liquidity data
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
}