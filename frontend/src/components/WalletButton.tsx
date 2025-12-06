import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';
import { modal } from '../lib/web3modal';

const WalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => modal.open()}>
      Connect Wallet
    </Button>
  );
};

export default WalletButton;