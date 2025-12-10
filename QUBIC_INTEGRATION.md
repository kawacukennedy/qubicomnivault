# Qubic Blockchain Integration

This document outlines the integration of Qubic OmniVault with the Qubic blockchain ecosystem.

## Overview

Qubic OmniVault is built on the Qubic blockchain, utilizing smart contracts for:
- **oqAsset Tokenization**: ERC-20 tokens representing real-world assets
- **Decentralized Lending**: Collateralized borrowing with oqAssets
- **Liquidity Pools**: AMM-based trading and liquidity provision
- **Oracle System**: Multi-source asset valuation feeds
- **Governance**: Decentralized platform governance

## Architecture

### Smart Contracts

1. **oqAsset.sol**: ERC-20 token for tokenized assets
   - Mint/burn functionality with metadata
   - Authorized minters system
   - Asset lifecycle management

2. **LendingPool.sol**: Decentralized lending protocol
   - Collateralized borrowing with oqAssets
   - Interest accrual and liquidation
   - Risk management (LTV ratios)

3. **LiquidityPool.sol**: Automated market maker
   - Token swapping functionality
   - Liquidity provision incentives
   - Price discovery

4. **AssetOracle.sol**: Multi-oracle valuation system
   - Multiple data source aggregation
   - Confidence scoring
   - Anti-manipulation safeguards

5. **Governance.sol**: Decentralized governance
   - Proposal creation and voting
   - Parameter updates
   - Emergency controls

### Integration Points

#### Backend (NestJS)
- **@qubic/web3-sdk**: Primary Qubic blockchain interaction
- **QubicProvider**: RPC connection management
- **QubicWallet**: Transaction signing and sending
- **Contract ABIs**: TypeScript interfaces for smart contracts

#### Frontend (React)
- **@qubic/web3-sdk/wagmi**: Wagmi connector for Qubic
- **Web3Modal**: Wallet connection UI
- **Real-time Updates**: WebSocket integration for live data

## Setup Instructions

### 1. Environment Configuration

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Configure Qubic settings
QUBIC_RPC_URL=https://rpc.qubic.org
QUBIC_CHAIN_ID=12345
PRIVATE_KEY=your-private-key-for-deployments
```

### 2. Contract Deployment

```bash
# Install blockchain dependencies
cd blockchain
npm install

# Deploy to Qubic testnet
npx hardhat run scripts/deploy.js --network qubicTestnet

# Deploy to Qubic mainnet
npx hardhat run scripts/deploy.js --network qubic
```

### 3. Update Contract Addresses

After deployment, update the backend `.env` file with deployed contract addresses:

```env
OQASSET_CONTRACT_ADDRESS=0x...
LENDING_POOL_CONTRACT_ADDRESS=0x...
LIQUIDITY_POOL_CONTRACT_ADDRESS=0x...
ORACLE_CONTRACT_ADDRESS=0x...
GOVERNANCE_CONTRACT_ADDRESS=0x...
```

### 4. Frontend Configuration

The frontend automatically detects Qubic chain and provides wallet connection options.

## Key Features

### Asset Tokenization
- Upload documents (invoices, contracts)
- Automatic valuation via oracles
- Mint oqAsset tokens on Qubic
- Immutable proof storage

### Lending Protocol
- Deposit oqAssets as collateral
- Borrow stablecoins against collateral
- Dynamic interest rates
- Automated liquidation protection

### Liquidity Pools
- Provide liquidity to earn fees
- Swap tokens with low slippage
- Impermanent loss protection
- Yield farming incentives

### Governance
- Create proposals for platform changes
- Vote with oqAsset tokens
- Execute successful proposals
- Emergency pause functionality

## Security Considerations

### Smart Contract Security
- OpenZeppelin battle-tested contracts
- Reentrancy protection
- Access control mechanisms
- Emergency pause functionality

### Oracle Security
- Multiple oracle sources
- Confidence scoring
- Deviation checks
- Manual review overrides

### Frontend Security
- Wallet signature verification
- Transaction confirmation dialogs
- Input validation and sanitization

## Testing

### Unit Tests
```bash
cd blockchain
npx hardhat test
```

### Integration Tests
```bash
cd backend
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Deployment

### Development
```bash
# Start local Qubic node (if available)
# Deploy contracts to localhost
npx hardhat run scripts/deploy.js --network localhost

# Start backend
cd backend && npm run start:dev

# Start frontend
cd frontend && npm run dev
```

### Production
```bash
# Deploy contracts to Qubic mainnet
npx hardhat run scripts/deploy.js --network qubic

# Build and deploy backend
cd backend && npm run build && npm run start:prod

# Build and deploy frontend
cd frontend && npm run build
```

## Monitoring

### On-chain Monitoring
- Contract events logging
- Transaction monitoring
- Oracle data validation
- Liquidation triggers

### Off-chain Monitoring
- API response times
- Error rates
- User activity metrics
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check Qubic RPC URL
   - Verify private key has sufficient funds
   - Confirm network configuration

2. **Transaction Rejections**
   - Check gas limits
   - Verify contract addresses
   - Confirm wallet approvals

3. **Oracle Data Stale**
   - Check oracle authorization
   - Verify data source connectivity
   - Review confidence thresholds

### Support

For Qubic-specific issues:
- Check Qubic documentation
- Join Qubic developer community
- Review contract deployment logs

## Future Enhancements

- **Layer 2 Integration**: Optimistic rollups for faster transactions
- **Cross-chain Bridges**: Multi-chain asset support
- **Advanced Oracles**: AI-powered valuation models
- **Governance V2**: Quadratic voting and delegation
- **Insurance Protocol**: Smart contract insurance