import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Auth
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
      const response = await fetch(`${API_BASE}/dashboard/positions`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch positions');
      return response.json();
    },
  });
};

// Loans
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

// Pools
export const usePools = () => {
  return useQuery({
    queryKey: ['pools'],
    queryFn: async () => {
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