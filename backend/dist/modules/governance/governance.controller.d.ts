import { GovernanceService } from './governance.service';
export declare class GovernanceController {
    private readonly governanceService;
    constructor(governanceService: GovernanceService);
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
    voteOnProposal(req: any, proposalId: string, body: {
        vote: 'for' | 'against';
    }): Promise<{
        proposal_id: string;
        vote: "for" | "against";
        tx_hash: string;
        voting_power_used: number;
        status: string;
    }>;
    createProposal(req: any, body: {
        title: string;
        description: string;
    }): Promise<{
        proposal_id: string;
        tx_hash: string;
        status: string;
        end_time: Date;
    }>;
    getUserVotingPower(req: any): Promise<{
        voting_power: number;
        breakdown: {
            oq_assets: number;
            staked_tokens: number;
        };
    }>;
}
