import { Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class GovernanceService {
  private readonly logger = new Logger(GovernanceService.name);

  constructor(private blockchainService: BlockchainService) {}

  async getProposals() {
    try {
      // For now, return mock data until we implement proposal querying from contract
      // TODO: Implement getProposals from governance contract
      const mockProposals = [
        {
          id: '1',
          title: 'Increase liquidation threshold to 85%',
          description: 'Proposal to adjust the LTV liquidation threshold from 80% to 85% to reduce liquidation events.',
          status: 'active',
          votesFor: 45000,
          votesAgainst: 12000,
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          proposer: '0x1234...abcd',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          title: 'Add support for new collateral types',
          description: 'Enable tokenization of additional asset types including real estate deeds and equipment leases.',
          status: 'passed',
          votesFor: 78000,
          votesAgainst: 8000,
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          proposer: '0x5678...efgh',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          title: 'Reduce protocol fees by 20%',
          description: 'Lower borrowing and liquidation fees to increase adoption and reduce user costs.',
          status: 'failed',
          votesFor: 25000,
          votesAgainst: 55000,
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          proposer: '0xabcd...1234',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
      ];

      return mockProposals.map(proposal => ({
        id: proposal.id,
        title: proposal.title,
        description: proposal.description,
        status: proposal.status,
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst,
        totalVotes: proposal.votesFor + proposal.votesAgainst,
        endTime: proposal.endTime,
        proposer: proposal.proposer,
        createdAt: proposal.createdAt,
      }));
    } catch (error) {
      this.logger.error('Failed to get proposals', error);
      throw error;
    }
  }

  async getProposalById(proposalId: string) {
    // Mock implementation - in production, query from blockchain
    const mockProposal = {
      id: proposalId,
      title: 'Mock Proposal',
      description: 'This is a mock proposal for demonstration',
      status: 'active',
      votesFor: 1000,
      votesAgainst: 500,
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    return mockProposal;
  }

  async voteOnProposal(userId: string, proposalId: string, vote: 'for' | 'against') {
    try {
      // Convert vote to boolean for contract (true = for, false = against)
      const support = vote === 'for';

      // Use blockchain service to cast vote on-chain
      const txHash = await this.blockchainService.castVote(proposalId, support);

      this.logger.log(`Vote cast on Qubic: ${txHash}`);

      // For now, return mock response until we can query updated vote counts from contract
      return {
        proposal_id: proposalId,
        vote,
        tx_hash: txHash,
        voting_power_used: 1000, // Mock voting power
        status: 'voted',
      };
    } catch (error) {
      this.logger.error('Failed to vote on proposal', error);
      throw error;
    }
  }

  async createProposal(userId: string, data: { title: string; description: string; target?: string; data?: string; value?: string }) {
    try {
      // Use blockchain service to create proposal on-chain
      const txHash = await this.blockchainService.createProposal(
        data.description,
        data.target || '0x0000000000000000000000000000000000000000', // Default target
        data.data || '0x', // Default data
        data.value || '0' // Default value
      );

      this.logger.log(`Proposal created on Qubic: ${txHash}`);

      // For now, return mock response until we can query proposal ID from transaction
      return {
        proposal_id: `proposal_${Date.now()}`, // Temporary ID until we can get from contract
        tx_hash: txHash,
        status: 'created',
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };
    } catch (error) {
      this.logger.error('Failed to create proposal', error);
      throw error;
    }
  }

  async getUserVotingPower(userId: string) {
    try {
      // TODO: Implement real voting power calculation from governance contract
      // For now, return mock data
      return {
        voting_power: 1250,
        breakdown: {
          oq_assets: 1000,
          staked_tokens: 250,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get user voting power', error);
      throw error;
    }
  }
}