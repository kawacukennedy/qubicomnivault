import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('blockchain')
@Controller('blockchain')
@UseGuards(JwtAuthGuard)
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get native token balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getBalance(@Param('address') address: string) {
    return this.blockchainService.getBalance(address);
  }

  @Get('oqasset/balance/:address')
  @ApiOperation({ summary: 'Get oqAsset balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  async getOqAssetBalance(@Param('address') address: string) {
    return this.blockchainService.getOqAssetBalance(address);
  }

  @Get('oqasset/metadata/:assetId')
  @ApiOperation({ summary: 'Get oqAsset metadata' })
  @ApiResponse({ status: 200, description: 'Metadata retrieved successfully' })
  async getOqAssetMetadata(@Param('assetId') assetId: string) {
    return this.blockchainService.getOqAssetMetadata(assetId);
  }

  @Post('oqasset/mint')
  @ApiOperation({ summary: 'Mint oqAsset tokens' })
  @ApiResponse({ status: 201, description: 'oqAsset minted successfully' })
  async mintOqAsset(
    @Request() req,
    @Body() body: { to: string; amount: string; metadata: any }
  ) {
    const txHash = await this.blockchainService.mintOqAsset(
      body.to,
      body.amount,
      body.metadata
    );
    return { transactionHash: txHash };
  }

  @Post('loans/create')
  @ApiOperation({ summary: 'Create a loan' })
  @ApiResponse({ status: 201, description: 'Loan created successfully' })
  async createLoan(
    @Request() req,
    @Body() body: { oqAssetAmount: string; stablecoinAmount: string; assetId: string }
  ) {
    const txHash = await this.blockchainService.createLoan(
      req.user.walletAddress,
      body.oqAssetAmount,
      body.stablecoinAmount,
      body.assetId
    );
    return { transactionHash: txHash };
  }

  @Post('loans/:loanId/repay')
  @ApiOperation({ summary: 'Repay a loan' })
  @ApiResponse({ status: 200, description: 'Loan repaid successfully' })
  async repayLoan(
    @Param('loanId') loanId: string,
    @Body() body: { amount: string }
  ) {
    const txHash = await this.blockchainService.repayLoan(loanId, body.amount);
    return { transactionHash: txHash };
  }

  @Get('loans/:loanId')
  @ApiOperation({ summary: 'Get loan details' })
  @ApiResponse({ status: 200, description: 'Loan details retrieved successfully' })
  async getLoanDetails(@Param('loanId') loanId: string) {
    return this.blockchainService.getLoanDetails(loanId);
  }

  @Post('pools/add-liquidity')
  @ApiOperation({ summary: 'Add liquidity to pool' })
  @ApiResponse({ status: 201, description: 'Liquidity added successfully' })
  async addLiquidity(
    @Body() body: { tokenAAmount: string; tokenBAmount: string }
  ) {
    const txHash = await this.blockchainService.addLiquidity(
      body.tokenAAmount,
      body.tokenBAmount
    );
    return { transactionHash: txHash };
  }

  @Post('pools/remove-liquidity')
  @ApiOperation({ summary: 'Remove liquidity from pool' })
  @ApiResponse({ status: 200, description: 'Liquidity removed successfully' })
  async removeLiquidity(@Body() body: { liquidityAmount: string }) {
    const txHash = await this.blockchainService.removeLiquidity(body.liquidityAmount);
    return { transactionHash: txHash };
  }

  @Post('pools/swap')
  @ApiOperation({ summary: 'Swap tokens in pool' })
  @ApiResponse({ status: 200, description: 'Tokens swapped successfully' })
  async swapTokens(
    @Body() body: { tokenIn: string; amountIn: string; minAmountOut: string }
  ) {
    const txHash = await this.blockchainService.swapTokens(
      body.tokenIn,
      body.amountIn,
      body.minAmountOut
    );
    return { transactionHash: txHash };
  }

  @Post('oracle/submit-valuation')
  @ApiOperation({ summary: 'Submit asset valuation' })
  @ApiResponse({ status: 201, description: 'Valuation submitted successfully' })
  async submitValuation(
    @Body() body: { assetId: string; value: string }
  ) {
    const txHash = await this.blockchainService.submitValuation(body.assetId, body.value);
    return { transactionHash: txHash };
  }

  @Get('oracle/valuation/:assetId')
  @ApiOperation({ summary: 'Get asset valuation' })
  @ApiResponse({ status: 200, description: 'Valuation retrieved successfully' })
  async getValuation(@Param('assetId') assetId: string) {
    return this.blockchainService.getValuation(assetId);
  }

  @Post('governance/propose')
  @ApiOperation({ summary: 'Create governance proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  async createProposal(
    @Body() body: { description: string; target: string; data: string; value: string }
  ) {
    const txHash = await this.blockchainService.createProposal(
      body.description,
      body.target,
      body.data,
      body.value
    );
    return { transactionHash: txHash };
  }

  @Post('governance/vote')
  @ApiOperation({ summary: 'Cast vote on proposal' })
  @ApiResponse({ status: 200, description: 'Vote cast successfully' })
  async castVote(
    @Body() body: { proposalId: string; support: boolean }
  ) {
    const txHash = await this.blockchainService.castVote(body.proposalId, body.support);
    return { transactionHash: txHash };
  }

  @Get('network/status')
  @ApiOperation({ summary: 'Get network status' })
  @ApiResponse({ status: 200, description: 'Network status retrieved successfully' })
  async getNetworkStatus() {
    const [blockNumber, gasPrice] = await Promise.all([
      this.blockchainService.getBlockNumber(),
      this.blockchainService.getGasPrice()
    ]);
    return { blockNumber, gasPrice };
  }
}