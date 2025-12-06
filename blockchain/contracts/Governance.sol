// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Governance
 * @dev Decentralized governance for Qubic OmniVault platform
 */
contract Governance is ReentrancyGuard, Ownable {
    IERC20 public governanceToken; // oqAsset or separate governance token

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        address target;
        bytes data;
        uint256 value;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
        mapping(address => bool) votes; // true = for, false = against
    }

    struct ProposalCore {
        uint256 id;
        address proposer;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool canceled;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public votingPower;
    uint256 public proposalCount;

    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 tokens to propose
    uint256 public constant QUORUM_THRESHOLD = 1000; // 10% of circulating supply
    uint256 public constant VOTE_DIFFERENTIAL = 5100; // 51% to pass

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }

    /**
     * @dev Create a new proposal
     */
    function propose(
        string memory description,
        address target,
        bytes memory data,
        uint256 value
    ) external nonReentrant returns (uint256) {
        require(governanceToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD, "Insufficient tokens to propose");
        require(bytes(description).length > 0, "Empty description");

        uint256 proposalId = ++proposalCount;

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.target = target;
        proposal.data = data;
        proposal.value = value;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }

    /**
     * @dev Cast vote on a proposal
     */
    function castVote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = support;

        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @dev Execute a successful proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(block.timestamp > proposal.endTime, "Voting not ended");

        // Check if proposal passed
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 quorum = (governanceToken.totalSupply() * QUORUM_THRESHOLD) / 10000;

        require(totalVotes >= quorum, "Quorum not reached");
        require(proposal.forVotes > proposal.againstVotes, "Proposal failed");

        // Execute proposal
        proposal.executed = true;

        if (proposal.target != address(0)) {
            (bool success,) = proposal.target.call{value: proposal.value}(proposal.data);
            require(success, "Execution failed");
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal (only proposer or owner)
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(!proposal.executed, "Cannot cancel executed proposal");
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");

        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (ProposalCore memory) {
        Proposal storage proposal = proposals[proposalId];
        return ProposalCore({
            id: proposal.id,
            proposer: proposal.proposer,
            description: proposal.description,
            startTime: proposal.startTime,
            endTime: proposal.endTime,
            forVotes: proposal.forVotes,
            againstVotes: proposal.againstVotes,
            executed: proposal.executed,
            canceled: proposal.canceled
        });
    }

    /**
     * @dev Check if proposal can be executed
     */
    function canExecute(uint256 proposalId) external view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.id == 0 || proposal.executed || proposal.canceled) return false;
        if (block.timestamp <= proposal.endTime) return false;

        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 quorum = (governanceToken.totalSupply() * QUORUM_THRESHOLD) / 10000;

        if (totalVotes < quorum) return false;
        if (proposal.forVotes <= proposal.againstVotes) return false;

        return true;
    }

    /**
     * @dev Get voting power of an address
     */
    function getVotingPower(address account) external view returns (uint256) {
        return governanceToken.balanceOf(account);
    }

    /**
     * @dev Check if address has voted on proposal
     */
    function hasVoted(uint256 proposalId, address account) external view returns (bool) {
        return proposals[proposalId].hasVoted[account];
    }

    /**
     * @dev Get vote details
     */
    function getVote(uint256 proposalId, address account) external view returns (bool hasVoted, bool support) {
        Proposal storage proposal = proposals[proposalId];
        return (proposal.hasVoted[account], proposal.votes[account]);
    }

    /**
     * @dev Emergency pause
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }

    /**
     * @dev Update voting parameters (governance proposal)
     */
    function updateVotingParameters(
        uint256 newVotingPeriod,
        uint256 newProposalThreshold,
        uint256 newQuorumThreshold
    ) external onlyOwner {
        // Update parameters - in production this should be through governance
    }
}