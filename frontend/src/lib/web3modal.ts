import { createWeb3Modal } from '@web3modal/wagmi/react';
import { config } from './wagmi';

export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: 'e3c5f0a5c6b1b5c3f2e8d9a7b6c4e5f0', // Reown demo project ID
  enableAnalytics: false,
  enableOnramp: false, // Disable onramp to reduce API calls
});