import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from './wagmi';

export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '2f05a7db73c4b8b0e4b4e0b1f2c3d4e5', // Demo project ID for development
  enableAnalytics: false, // Disable analytics for development
});