// Mock data for development when backend is not available

export const mockNonce = {
  nonce: 'mock-nonce-123456789'
};

export const mockLoginResponse = {
  jwt: 'mock-jwt-token',
  refresh_token: 'mock-refresh-token',
  user: {
    id: '1',
    wallet_address: '0x1234567890123456789012345678901234567890',
    email: 'user@example.com'
  }
};

export const mockPortfolio = {
  total_value_usd: 125000,
  change_24h_percentage: 2.5,
  breakdown: [
    { name: 'Real Estate', value: 40, usd_value: 50000 },
    { name: 'Commercial Paper', value: 30, usd_value: 37500 },
    { name: 'Invoices', value: 20, usd_value: 25000 },
    { name: 'Other Assets', value: 10, usd_value: 12500 }
  ]
};

export const mockPositions = [
  {
    id: '1',
    asset: 'Downtown Office Building',
    collateral_value: 50000,
    loan_amount: 35000,
    ltv: 70,
    status: 'healthy',
    interest_rate: 5.5,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    asset: 'Commercial Invoice Portfolio',
    collateral_value: 25000,
    loan_amount: 20000,
    ltv: 80,
    status: 'at_risk',
    interest_rate: 6.2,
    created_at: '2024-01-20T14:30:00Z'
  }
];

export const mockProposals = [
  {
    id: '1',
    title: 'Increase Liquidity Pool Rewards',
    description: 'Proposal to increase rewards for liquidity providers to 8% APY',
    status: 'active',
    creator: '0x1234...5678',
    created_at: '2024-01-10T09:00:00Z',
    votes_for: 150,
    votes_against: 20,
    end_date: '2024-01-25T09:00:00Z'
  },
  {
    id: '2',
    title: 'Add New Asset Class Support',
    description: 'Support for tokenized green energy certificates',
    status: 'passed',
    creator: '0x9876...1234',
    created_at: '2024-01-05T11:00:00Z',
    votes_for: 200,
    votes_against: 15,
    end_date: '2024-01-20T11:00:00Z'
  }
];

export const mockPools = [
  {
    id: '1',
    name: 'QUBIC-USDC Pool',
    tokenA: 'QUBIC',
    tokenB: 'USDC',
    tvl: 500000,
    volume_24h: 25000,
    fee: 0.3,
    apr: 12.5
  },
  {
    id: '2',
    name: 'oQUBIC-QUBIC Pool',
    tokenA: 'oQUBIC',
    tokenB: 'QUBIC',
    tvl: 750000,
    volume_24h: 45000,
    fee: 0.3,
    apr: 15.2
  }
];

export const mockValuation = {
  asset_id: 'asset-123',
  value_usd: 100000,
  confidence: 95,
  timestamp: '2024-01-22T12:00:00Z'
};