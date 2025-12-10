import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { qubic, qubicTestnet } from './chains/qubic';

export const config = createConfig({
  chains: [mainnet, sepolia, qubic, qubicTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId: 'e3c5f0a5c6b1b5c3f2e8d9a7b6c4e5f0' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [qubic.id]: http(process.env.REACT_APP_QUBIC_RPC_URL || 'https://rpc.qubic.org'),
    [qubicTestnet.id]: http(process.env.REACT_APP_QUBIC_TESTNET_RPC_URL || 'https://testnet-rpc.qubic.org'),
  },
});