import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PoolsService } from './pools.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('pools')
@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all liquidity pools' })
  @ApiResponse({ status: 200, description: 'Pools retrieved successfully' })
  async getPools() {
    return this.poolsService.getPools();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pool details' })
  @ApiResponse({ status: 200, description: 'Pool details retrieved successfully' })
  async getPoolById(@Param('id') poolId: string) {
    return this.poolsService.getPoolById(poolId);
  }

  @Post(':id/add-liquidity')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add liquidity to pool' })
  @ApiResponse({ status: 201, description: 'Liquidity added successfully' })
  async addLiquidity(
    @Request() req,
    @Param('id') poolId: string,
    @Body() body: { amountA: string; amountB: string },
  ) {
    return this.poolsService.addLiquidity(req.user.userId, poolId, body.amountA, body.amountB);
  }

  @Post(':id/remove-liquidity')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove liquidity from pool' })
  @ApiResponse({ status: 200, description: 'Liquidity removed successfully' })
  async removeLiquidity(
    @Request() req,
    @Param('id') poolId: string,
    @Body() body: { lpTokens: string },
  ) {
    return this.poolsService.removeLiquidity(req.user.userId, poolId, body.lpTokens);
  }

  @Post(':id/swap')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Swap tokens in pool' })
  @ApiResponse({ status: 200, description: 'Token swap executed successfully' })
  async swapTokens(
    @Request() req,
    @Param('id') poolId: string,
    @Body() body: { tokenIn: string; amountIn: string; minAmountOut: string },
  ) {
    return this.poolsService.swapTokens(req.user.userId, poolId, body.tokenIn, body.amountIn, body.minAmountOut);
  }

  @Get('user/liquidity')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user liquidity positions' })
  @ApiResponse({ status: 200, description: 'User liquidity retrieved successfully' })
  async getUserLiquidity(@Request() req) {
    return this.poolsService.getUserLiquidity(req.user.userId);
  }
}