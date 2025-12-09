import { defineChain } from 'viem';

export const qubic = defineChain({
  id: 12345, // Replace with actual Qubic chain ID
  name: 'Qubic',
  network: 'qubic',
  nativeCurrency: {
    decimals: 18,
    name: 'Qubic',
    symbol: 'QUBIC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.qubic.org'],
    },
    public: {
      http: ['https://rpc.qubic.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Qubic Explorer', url: 'https://explorer.qubic.org' },
  },
  testnet: false,
});

export const qubicTestnet = defineChain({
  id: 12346, // Replace with actual Qubic testnet chain ID
  name: 'Qubic Testnet',
  network: 'qubic-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Qubic',
    symbol: 'tQUBIC',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.qubic.org'],
    },
    public: {
      http: ['https://testnet-rpc.qubic.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Qubic Testnet Explorer', url: 'https://testnet-explorer.qubic.org' },
  },
  testnet: true,
});