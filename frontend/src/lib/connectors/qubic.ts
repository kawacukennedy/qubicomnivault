import { QubicConnector } from '@qubic/web3-sdk/wagmi';

export const qubicConnector = () => {
  return new QubicConnector({
    options: {
      appName: 'Qubic OmniVault',
      rpcUrl: process.env.REACT_APP_QUBIC_RPC_URL || 'https://rpc.qubic.org',
      chainId: parseInt(process.env.REACT_APP_QUBIC_CHAIN_ID || '12345'),
    },
  });
};