import { injected } from 'wagmi/connectors';

export const qubicConnector = () => {
  return injected({
    target: 'metaMask',
  });
};