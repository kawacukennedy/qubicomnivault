import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet, metaMask } from 'wagmi/connectors';
import { qubic, qubicTestnet } from './chains/qubic';

export const config = createConfig({
  chains: [mainnet, sepolia, qubic, qubicTestnet],
  connectors: [
    metaMask(),
    injected(),
    coinbaseWallet({
      appName: 'Qubic OmniVault',
      appLogoUrl: 'https://qubicomnivault.com/logo.png',
    }),
    walletConnect({
      projectId: 'e3c5f0a5c6b1b5c3f2e8d9a7b6c4e5f0',
      showQrModal: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [qubic.id]: http(import.meta.env.VITE_QUBIC_RPC_URL || 'https://rpc.qubic.org'),
    [qubicTestnet.id]: http(import.meta.env.VITE_QUBIC_TESTNET_RPC_URL || 'https://testnet-rpc.qubic.org'),
  },
});