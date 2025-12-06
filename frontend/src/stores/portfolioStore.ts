import { create } from 'zustand';

interface Portfolio {
  totalValue: number;
  change24h: number;
  breakdown: { name: string; value: number }[];
}

interface Position {
  id: string;
  asset: string;
  collateral_value: number;
  loan_amount: number;
  ltv: number;
}

interface PortfolioStore {
  portfolio: Portfolio | null;
  positions: Position[];
  setPortfolio: (portfolio: Portfolio) => void;
  setPositions: (positions: Position[]) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolio: null,
  positions: [],
  setPortfolio: (portfolio) => set({ portfolio }),
  setPositions: (positions) => set({ positions }),
}));