export declare class GovernanceService {
    private proposals;
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
        proposer: string;
        createdAt: Date;
    }>;
    voteOnProposal(userId: string, proposalId: string, vote: 'for' | 'against'): Promise<{
        proposal_id: string;
        vote: "for" | "against";
        voting_power_used: number;
        new_votes_for: number;
        new_votes_against: number;
    }>;
    createProposal(userId: string, data: {
        title: string;
        description: string;
    }): Promise<{
        proposal_id: string;
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
