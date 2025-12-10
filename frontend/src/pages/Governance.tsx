import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { useProposals, useVotingPower, useVote, useCreateProposal } from '../services/api';

const Governance = () => {
  const [createProposalModal, setCreateProposalModal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', type: 'general' });

  const { data: proposals, isLoading } = useProposals();
  const { data: votingPower } = useVotingPower();
  const voteMutation = useVote();
  const createProposalMutation = useCreateProposal();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'passed': return 'success';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    try {
      await voteMutation.mutateAsync({ proposalId, vote });
      // Refetch proposals
      window.location.reload();
    } catch (error) {
      console.error('Vote failed:', error);
    }
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
            <p className="text-2xl font-bold text-primary-600">{(votingPower?.power || 0).toLocaleString()}</p>
            <p className="text-sm text-neutral-600">Based on oqAsset holdings</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Active Proposals</h3>
            <p className="text-2xl font-bold text-warning-600">
              {proposals?.filter(p => p.status === 'active').length || 0}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Total Proposals</h3>
            <p className="text-2xl font-bold text-neutral-700">{proposals?.length || 0}</p>
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
              {proposals?.map((proposal) => (
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
                          variant={proposal.my_vote === 'for' ? 'solid' : 'outline'}
                          onClick={() => handleVote(proposal.id, 'for')}
                          className="w-full sm:w-auto"
                          disabled={voteMutation.isPending}
                        >
                          For ({(proposal.votes_for || 0).toLocaleString()})
                        </Button>
                        <Button
                          size="sm"
                          variant={proposal.my_vote === 'against' ? 'solid' : 'outline'}
                          onClick={() => handleVote(proposal.id, 'against')}
                          className="w-full sm:w-auto"
                          disabled={voteMutation.isPending}
                        >
                          Against ({(proposal.votes_against || 0).toLocaleString()})
                        </Button>
                      </div>
                    )}
                  </div>

                  {proposal.status === 'active' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>For: {(((proposal.votes_for || 0) / ((proposal.votes_for || 0) + (proposal.votes_against || 0))) * 100).toFixed(1)}%</span>
                        <span>Against: {(((proposal.votes_against || 0) / ((proposal.votes_for || 0) + (proposal.votes_against || 0))) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{
                            width: `${((proposal.votes_for || 0) / ((proposal.votes_for || 0) + (proposal.votes_against || 0))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {proposal.my_vote && (
                    <p className="text-sm text-neutral-600">
                      Your vote: {proposal.my_vote === 'for' ? 'For' : 'Against'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={createProposalModal}
        onClose={() => setCreateProposalModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Create Proposal</ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                placeholder="Proposal title"
                value={newProposal.title}
                onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                rows={4}
                placeholder="Proposal description"
                value={newProposal.description}
                onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-neutral-200 rounded-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={newProposal.type}
                onChange={(e) => setNewProposal({ ...newProposal, type: e.target.value })}
              >
                <option value="general">General</option>
                <option value="parameter">Parameter Change</option>
                <option value="feature">New Feature</option>
              </select>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setCreateProposalModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await createProposalMutation.mutateAsync(newProposal);
                setCreateProposalModal(false);
                setNewProposal({ title: '', description: '', type: 'general' });
                // Refetch proposals
                window.location.reload();
              } catch (error) {
                console.error('Create proposal failed:', error);
              }
            }}
            disabled={createProposalMutation.isPending || !newProposal.title || !newProposal.description}
          >
            {createProposalMutation.isPending ? 'Creating...' : 'Create Proposal'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Governance;