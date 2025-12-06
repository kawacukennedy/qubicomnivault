import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api/v1';

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
      const response = await fetch(`${API_BASE}/valuation/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch valuation');
      return response.json();
    },
    enabled: !!jobId,
  });
};

export const useMint = () => {
  return useMutation({
    mutationFn: async (data: { document_id: string; accepted_value_usd: number }) => {
      const response = await fetch(`${API_BASE}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Mint failed');
      return response.json();
    },
  });
};

// Portfolio
export const usePortfolioSummary = (userId: string) => {
  return useQuery({
    queryKey: ['portfolio', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/users/${userId}/portfolio/summary`);
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
    enabled: !!userId,
  });
};

export const usePositions = (userId: string) => {
  return useQuery({
    queryKey: ['positions', userId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/positions`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      return response.json();
    },
    enabled: !!userId,
  });
};

// Loans
export const useRepayLoan = () => {
  return useMutation({
    mutationFn: async ({ loanId, data }: { loanId: string; data: { amount: number; from_wallet?: string } }) => {
      const response = await fetch(`${API_BASE}/loans/${loanId}/repay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Repay failed');
      return response.json();
    },
  });
};

// EasyConnect
export const useCreateTemplate = () => {
  return useMutation({
    mutationFn: async (data: { template_name: string; event_type: string; destination: string; payload_mapping?: object }) => {
      const response = await fetch(`${API_BASE}/easyconnect/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Template creation failed');
      return response.json();
    },
  });
};