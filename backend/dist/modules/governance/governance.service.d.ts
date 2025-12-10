import { BlockchainService } from '../blockchain/blockchain.service';
export declare class GovernanceService {
    private blockchainService;
    private readonly logger;
    constructor(blockchainService: BlockchainService);
    getProposals(): Promise<{
        id: string;
        title: string;
        description: string;
        status: string;
        votesFor: number;
        votesAgainst: number;
        totalVotes: number;
        endTime: Date;
        proposer: string;
        createdAt: Date;
    }[]>;
    getProposalById(proposalId: string): Promise<{
        id: string;
        title: string;
        description: string;
        status: string;
        votesFor: number;
        votesAgainst: number;
        endTime: Date;
    }>;
    voteOnProposal(userId: string, proposalId: string, vote: 'for' | 'against'): Promise<{
        proposal_id: string;
        vote: "for" | "against";
        tx_hash: string;
        voting_power_used: number;
        status: string;
    }>;
    createProposal(userId: string, data: {
        title: string;
        description: string;
        target?: string;
        data?: string;
        value?: string;
    }): Promise<{
        proposal_id: string;
        tx_hash: string;
        status: string;
        end_time: Date;
    }>;
    getUserVotingPower(userId: string): Promise<{
        voting_power: number;
        breakdown: {
            oq_assets: number;
            staked_tokens: number;
        };
    }>;
}
