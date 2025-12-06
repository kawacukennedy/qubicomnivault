# Qubic OmniVault Smart Contracts

Smart contracts for the Qubic OmniVault DeFi platform on Qubic blockchain.

## Contracts Overview

### Core Contracts

- **oqAsset.sol**: ERC-20 token representing tokenized real-world assets
- **LendingPool.sol**: Decentralized lending pool for collateralized borrowing
- **LiquidityPool.sol**: Automated Market Maker for oqAsset-Stablecoin pairs
- **AssetOracle.sol**: Decentralized oracle for asset valuations
- **Governance.sol**: DAO governance for platform decisions

### Utility Contracts

- **MockERC20.sol**: Mock ERC-20 token for testing

## Development

### Prerequisites
- Node.js 18+
- Hardhat
- Qubic RPC access

### Setup
```bash
npm install
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Deploy Contracts
```bash
# Local deployment
npm run deploy

# Qubic network deployment
npx hardhat run scripts/deploy.js --network qubic
```

## Contract Addresses

After deployment, addresses are saved to `deployment.json`:

```json
{
  "oqAsset": "0x...",
  "usdc": "0x...",
  "oracle": "0x...",
  "lendingPool": "0x...",
  "liquidityPool": "0x...",
  "governance": "0x..."
}
```

## Key Features

### oqAsset Token
- ERC-20 compatible
- Metadata storage for asset details
- Eligibility checks for collateral
- Burn functionality for loan repayment

### Lending Pool
- Collateralized borrowing with LTV limits
- Interest accrual over time
- Liquidation protection
- Pool liquidity management

### Liquidity Pool
- AMM with 0.3% fee
- Add/remove liquidity
- Token swapping
- Price discovery

### Asset Oracle
- Multi-oracle valuation system
- Confidence scoring
- Decentralized price feeds
- Anti-manipulation safeguards

### Governance
- Proposal creation and voting
- Quadratic voting power
- Timelock execution
- Emergency controls

## Security Considerations

- All contracts use OpenZeppelin battle-tested libraries
- Reentrancy protection on state-changing functions
- Access controls and authorization checks
- Emergency pause functionality
- Comprehensive test coverage required

## Integration

Contracts integrate with the NestJS backend via the BlockchainService:

- Minting oqAssets from tokenized documents
- Managing loan lifecycle
- Providing liquidity pool interactions
- Submitting oracle valuations
- Executing governance decisions

## Testing

```bash
# Unit tests
npm run test

# Coverage report
npx hardhat coverage

# Gas usage analysis
npm run test:gas
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Qubic RPC endpoint tested
- [ ] Private key secured
- [ ] Contract ownership transferred to multisig
- [ ] Initial liquidity provided
- [ ] Oracle network established
- [ ] Governance parameters set
- [ ] Backend integration tested