import { createWeb3Modal } from '@web3modal/wagmi';
import { config } from './wagmi';

export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: 'your-project-id', // Replace with actual project ID
  enableAnalytics: true,
});