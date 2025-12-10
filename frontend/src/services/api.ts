import { useQuery, useMutation } from '@tanstack/react-query';
import * as mockData from './mockData';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Auth
export const useNonce = () => {
  return useQuery({
    queryKey: ['nonce'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockNonce;
      }
      const response = await fetch(`${API_BASE}/auth/nonce`);
      if (!response.ok) throw new Error('Failed to fetch nonce');
      return response.json();
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { wallet_address: string; email?: string }) => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { wallet_address: string; signature: string; nonce: string }) => {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockData.mockLoginResponse;
      }
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
  });
};

// Tokenize
export const useTokenize = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE}/tokenize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error('Tokenization failed');
      return response.json();
    },
  });
};

export const useValuation = (jobId: string) => {
  return useQuery({
    queryKey: ['valuation', jobId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { ...mockData.mockValuation, asset_id: jobId };
      }
      const response = await fetch(`${API_BASE}/tokenize/valuation/${jobId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch valuation');
      return response.json();
    },
    enabled: !!jobId,
  });
};

export const useMint = () => {
  return useMutation({
    mutationFn: async (data: { document_id: string; accepted_value_usd: number }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          success: true,
          transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          asset_id: `asset-${Date.now()}`
        };
      }
      const response = await fetch(`${API_BASE}/tokenize/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Mint failed');
      return response.json();
    },
  });
};

// Portfolio
export const usePortfolioSummary = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockData.mockPortfolio;
      }
      const response = await fetch(`${API_BASE}/dashboard/portfolio`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
  });
};

export const usePositions = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return mockData.mockPositions;
      }
      const response = await fetch(`${API_BASE}/dashboard/positions`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch positions');
      return response.json();
    },
  });
};

export const usePositionDetails = (positionId: string) => {
  return useQuery({
    queryKey: ['position', positionId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/positions/${positionId}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch position details');
      return response.json();
    },
    enabled: !!positionId,
  });
};

export const usePositionLtvHistory = (positionId: string) => {
  return useQuery({
    queryKey: ['position-ltv', positionId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/positions/${positionId}/ltv-history`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch LTV history');
      return response.json();
    },
    enabled: !!positionId,
  });
};

// Loans
export const useCreateLoan = () => {
  return useMutation({
    mutationFn: async (data: { oqAsset_id: string; amount_usd: number }) => {
      const response = await fetch(`${API_BASE}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Loan creation failed');
      return response.json();
    },
  });
};

export const useRepayLoan = () => {
  return useMutation({
    mutationFn: async ({ loanId, amount }: { loanId: string; amount: number }) => {
      const response = await fetch(`${API_BASE}/loans/${loanId}/repay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Repay failed');
      return response.json();
    },
  });
};

export const useAddCollateral = () => {
  return useMutation({
    mutationFn: async ({ positionId, amount }: { positionId: string; amount: number }) => {
      const response = await fetch(`${API_BASE}/positions/${positionId}/add-collateral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Add collateral failed');
      return response.json();
    },
  });
};

// Pools
export const usePools = () => {
  return useQuery({
    queryKey: ['pools'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.mockPools;
      }
      const response = await fetch(`${API_BASE}/pools`);
      if (!response.ok) throw new Error('Failed to fetch pools');
      return response.json();
    },
  });
};

export const usePoolDetails = (poolId: string) => {
  return useQuery({
    queryKey: ['pool', poolId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/pools/${poolId}`);
      if (!response.ok) throw new Error('Failed to fetch pool details');
      return response.json();
    },
    enabled: !!poolId,
  });
};

export const useProvideLiquidity = () => {
  return useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: number }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
          success: true,
          transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          amount_provided: amount
        };
      }
      const response = await fetch(`${API_BASE}/pools/${poolId}/provide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Provide liquidity failed');
      return response.json();
    },
  });
};

export const useRemoveLiquidity = () => {
  return useMutation({
    mutationFn: async ({ poolId, amount }: { poolId: string; amount: number }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return {
          success: true,
          transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          amount_removed: amount
        };
      }
      const response = await fetch(`${API_BASE}/pools/${poolId}/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Remove liquidity failed');
      return response.json();
    },
  });
};

// Governance
export const useProposals = () => {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 700));
        return mockData.mockProposals;
      }
      const response = await fetch(`${API_BASE}/governance/proposals`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch proposals');
      return response.json();
    },
  });
};

export const useVotingPower = () => {
  return useQuery({
    queryKey: ['voting-power'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/governance/voting-power`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch voting power');
      return response.json();
    },
  });
};

export const useVote = () => {
  return useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: string; vote: 'for' | 'against' }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, proposalId, vote };
      }
      const response = await fetch(`${API_BASE}/governance/proposals/${proposalId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ vote }),
      });
      if (!response.ok) throw new Error('Vote failed');
      return response.json();
    },
  });
};

export const useCreateProposal = () => {
  return useMutation({
    mutationFn: async (data: { title: string; description: string; type: string }) => {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          id: `proposal-${Date.now()}`,
          ...data,
          status: 'active',
          votes_for: 0,
          votes_against: 0,
          created_at: new Date().toISOString()
        };
      }
      const response = await fetch(`${API_BASE}/governance/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Create proposal failed');
      return response.json();
    },
  });
};

// Settings
export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/users/preferences`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch preferences');
      return response.json();
    },
  });
};

export const useUpdatePreferences = () => {
  return useMutation({
    mutationFn: async (preferences: any) => {
      const response = await fetch(`${API_BASE}/users/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error('Update preferences failed');
      return response.json();
    },
  });
};

export const useEasyConnectTemplates = () => {
  return useQuery({
    queryKey: ['easyconnect-templates'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/easyconnect/templates`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    },
  });
};

export const useCreateEasyConnectTemplate = () => {
  return useMutation({
    mutationFn: async (data: { template_name: string; event_type: string; destination: string; payload_mapping: any }) => {
      const response = await fetch(`${API_BASE}/easyconnect/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Create template failed');
      return response.json();
    },
  });
};

export const useApiKeys = () => {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/users/api-keys`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch API keys');
      return response.json();
    },
  });
};

export const useCreateApiKey = () => {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch(`${API_BASE}/users/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Create API key failed');
      return response.json();
    },
  });
};

export const useRevokeApiKey = () => {
  return useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`${API_BASE}/users/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Revoke API key failed');
      return response.json();
    },
  });
};