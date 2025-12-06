import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia], // Add Qubic chain if available
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: 'your-project-id' }), // Replace with actual project ID
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});