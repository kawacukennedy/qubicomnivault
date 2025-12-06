import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';
import { modal } from '../lib/web3modal';

interface WalletButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onClick, disabled, className, children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!isConnected) {
      modal.open();
    }
  };

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <Button variant="outline" size="sm" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleClick} disabled={disabled} className={className}>
      {children || 'Connect Wallet'}
    </Button>
  );
};

export default WalletButton;