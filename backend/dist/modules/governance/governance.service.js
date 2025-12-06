"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceService = void 0;
const common_1 = require("@nestjs/common");
let GovernanceService = class GovernanceService {
    proposals = [
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
    async getProposals() {
        return this.proposals.map(proposal => ({
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
    async getProposalById(proposalId) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }
        return proposal;
    }
    async voteOnProposal(userId, proposalId, vote) {
        const proposal = this.proposals.find(p => p.id === proposalId);
        if (!proposal) {
            throw new Error('Proposal not found');
        }
        if (proposal.status !== 'active') {
            throw new Error('Proposal is not active');
        }
        if (vote === 'for') {
            proposal.votesFor += 1000;
        }
        else {
            proposal.votesAgainst += 1000;
        }
        return {
            proposal_id: proposalId,
            vote,
            voting_power_used: 1000,
            new_votes_for: proposal.votesFor,
            new_votes_against: proposal.votesAgainst,
        };
    }
    async createProposal(userId, data) {
        const newProposal = {
            id: (this.proposals.length + 1).toString(),
            title: data.title,
            description: data.description,
            status: 'active',
            votesFor: 0,
            votesAgainst: 0,
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            proposer: `0x${Math.random().toString(16).substr(2, 40)}`,
            createdAt: new Date(),
        };
        this.proposals.unshift(newProposal);
        return {
            proposal_id: newProposal.id,
            status: 'created',
            end_time: newProposal.endTime,
        };
    }
    async getUserVotingPower(userId) {
        return {
            voting_power: 1250,
            breakdown: {
                oq_assets: 1000,
                staked_tokens: 250,
            },
        };
    }
};
exports.GovernanceService = GovernanceService;
exports.GovernanceService = GovernanceService = __decorate([
    (0, common_1.Injectable)()
], GovernanceService);
//# sourceMappingURL=governance.service.js.map