"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GovernanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
const blockchain_service_1 = require("../blockchain/blockchain.service");
let GovernanceService = GovernanceService_1 = class GovernanceService {
    blockchainService;
    logger = new common_1.Logger(GovernanceService_1.name);
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }
    async getProposals() {
        try {
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
        }
        catch (error) {
            this.logger.error('Failed to get proposals', error);
            throw error;
        }
    }
    async getProposalById(proposalId) {
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
    async voteOnProposal(userId, proposalId, vote) {
        try {
            const support = vote === 'for';
            const txHash = await this.blockchainService.castVote(proposalId, support);
            this.logger.log(`Vote cast on Qubic: ${txHash}`);
            return {
                proposal_id: proposalId,
                vote,
                tx_hash: txHash,
                voting_power_used: 1000,
                status: 'voted',
            };
        }
        catch (error) {
            this.logger.error('Failed to vote on proposal', error);
            throw error;
        }
    }
    async createProposal(userId, data) {
        try {
            const txHash = await this.blockchainService.createProposal(data.description, data.target || '0x0000000000000000000000000000000000000000', data.data || '0x', data.value || '0');
            this.logger.log(`Proposal created on Qubic: ${txHash}`);
            return {
                proposal_id: `proposal_${Date.now()}`,
                tx_hash: txHash,
                status: 'created',
                end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            };
        }
        catch (error) {
            this.logger.error('Failed to create proposal', error);
            throw error;
        }
    }
    async getUserVotingPower(userId) {
        try {
            return {
                voting_power: 1250,
                breakdown: {
                    oq_assets: 1000,
                    staked_tokens: 250,
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get user voting power', error);
            throw error;
        }
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = GovernanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blockchain_service_1.BlockchainService])
], GovernanceService);
//# sourceMappingURL=governance.service.js.map