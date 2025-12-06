import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GovernanceService } from './governance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('governance')
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get('proposals')
  @ApiOperation({ summary: 'Get all proposals' })
  @ApiResponse({ status: 200, description: 'Proposals retrieved successfully' })
  async getProposals() {
    return this.governanceService.getProposals();
  }

  @Get('proposals/:id')
  @ApiOperation({ summary: 'Get proposal details' })
  @ApiResponse({ status: 200, description: 'Proposal details retrieved successfully' })
  async getProposalById(@Param('id') proposalId: string) {
    return this.governanceService.getProposalById(proposalId);
  }

  @Post('proposals/:id/vote')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Vote on a proposal' })
  @ApiResponse({ status: 200, description: 'Vote cast successfully' })
  async voteOnProposal(
    @Request() req,
    @Param('id') proposalId: string,
    @Body() body: { vote: 'for' | 'against' },
  ) {
    return this.governanceService.voteOnProposal(req.user.userId, proposalId, body.vote);
  }

  @Post('proposals')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  async createProposal(
    @Request() req,
    @Body() body: { title: string; description: string },
  ) {
    return this.governanceService.createProposal(req.user.userId, body);
  }

  @Get('voting-power')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user voting power' })
  @ApiResponse({ status: 200, description: 'Voting power retrieved successfully' })
  async getUserVotingPower(@Request() req) {
    return this.governanceService.getUserVotingPower(req.user.userId);
  }
}