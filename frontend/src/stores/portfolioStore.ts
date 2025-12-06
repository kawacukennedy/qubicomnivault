import { create } from 'zustand';

interface Portfolio {
  totalValue: number;
  change24h: number;
  breakdown: { name: string; value: number }[];
}

interface PortfolioStore {
  portfolio: Portfolio | null;
  positions: any[];
  setPortfolio: (portfolio: Portfolio) => void;
  setPositions: (positions: any[]) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolio: null,
  positions: [],
  setPortfolio: (portfolio) => set({ portfolio }),
  setPositions: (positions) => set({ positions }),
}));