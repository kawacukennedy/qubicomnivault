import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('loans')
@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new loan' })
  @ApiResponse({ status: 201, description: 'Loan created successfully' })
  async createLoan(
    @Request() req,
    @Body() body: { oqAsset_id: string; principal_usd: number; interest_rate_annual: number },
  ) {
    return this.loansService.createLoan(req.user.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user loans' })
  @ApiResponse({ status: 200, description: 'Loans retrieved successfully' })
  async getLoans(@Request() req) {
    return this.loansService.getLoans(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan details' })
  @ApiResponse({ status: 200, description: 'Loan details retrieved successfully' })
  async getLoanDetails(@Request() req, @Param('id') loanId: string) {
    return this.loansService.getLoanDetails(req.user.userId, loanId);
  }

  @Post(':id/repay')
  @ApiOperation({ summary: 'Repay loan' })
  @ApiResponse({ status: 200, description: 'Loan repayment processed' })
  async repayLoan(
    @Request() req,
    @Param('id') loanId: string,
    @Body() body: { amount: number },
  ) {
    return this.loansService.repayLoan(req.user.userId, loanId, body.amount);
  }
}