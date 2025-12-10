import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { qubic, qubicTestnet } from './chains/qubic';
import { qubicConnector } from './connectors/qubic';

export const config = createConfig({
  chains: [mainnet, sepolia, qubic, qubicTestnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '2f05a7db73c4b8b0e4b4e0b1f2c3d4e5' }),
    qubicConnector(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [qubic.id]: http(process.env.REACT_APP_QUBIC_RPC_URL || 'https://rpc.qubic.org'),
    [qubicTestnet.id]: http(process.env.REACT_APP_QUBIC_TESTNET_RPC_URL || 'https://testnet-rpc.qubic.org'),
  },
});