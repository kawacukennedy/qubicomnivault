import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const Governance = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userVotingPower = 1250;

  useEffect(() => {
    // Mock data
    const loadProposals = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProposals([
        {
          id: '1',
          title: 'Increase liquidation threshold to 85%',
          description: 'Proposal to adjust the LTV liquidation threshold from 80% to 85% to reduce liquidation events.',
          status: 'active',
          votesFor: 45000,
          votesAgainst: 12000,
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          myVote: null,
        },
        {
          id: '2',
          title: 'Add support for new collateral types',
          description: 'Enable tokenization of additional asset types including real estate deeds and equipment leases.',
          status: 'passed',
          votesFor: 78000,
          votesAgainst: 8000,
          endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          myVote: 'for',
        },
        {
          id: '3',
          title: 'Reduce protocol fees by 20%',
          description: 'Lower borrowing and liquidation fees to increase adoption and reduce user costs.',
          status: 'failed',
          votesFor: 25000,
          votesAgainst: 55000,
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          myVote: 'against',
        },
      ]);
      setIsLoading(false);
    };
    loadProposals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'passed': return 'success';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    setProposals(prev =>
      prev.map(p =>
        p.id === proposalId ? { ...p, myVote: vote } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Governance</h1>
          <Button className="w-full sm:w-auto">Create Proposal</Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Your Voting Power</h3>
            <p className="text-2xl font-bold text-primary-600">{userVotingPower.toLocaleString()}</p>
            <p className="text-sm text-neutral-600">Based on oqAsset holdings</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Active Proposals</h3>
            <p className="text-2xl font-bold text-warning-600">
              {proposals.filter(p => p.status === 'active').length}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Proposals</h3>
            <p className="text-2xl font-bold text-neutral-700">{proposals.length}</p>
          </Card>
        </div>

        {/* Proposals */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Proposals</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="border border-neutral-200 rounded-medium p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{proposal.title}</h3>
                      <p className="text-neutral-600 mb-4 text-sm sm:text-base">{proposal.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Badge variant={getStatusColor(proposal.status)}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-neutral-500">
                          Ends: {proposal.endTime.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {proposal.status === 'active' && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                        <Button
                          size="sm"
                          variant={proposal.myVote === 'for' ? 'solid' : 'outline'}
                          onClick={() => handleVote(proposal.id, 'for')}
                          className="w-full sm:w-auto"
                        >
                          For ({proposal.votesFor.toLocaleString()})
                        </Button>
                        <Button
                          size="sm"
                          variant={proposal.myVote === 'against' ? 'solid' : 'outline'}
                          onClick={() => handleVote(proposal.id, 'against')}
                          className="w-full sm:w-auto"
                        >
                          Against ({proposal.votesAgainst.toLocaleString()})
                        </Button>
                      </div>
                    )}
                  </div>

                  {proposal.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>For: {((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span>
                        <span>Against: {((proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{
                            width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {proposal.myVote && (
                    <p className="text-sm text-neutral-600">
                      Your vote: {proposal.myVote === 'for' ? 'For' : 'Against'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Governance;