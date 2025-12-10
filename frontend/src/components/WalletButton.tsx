import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface WalletButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'modal';
}

const WalletButton: React.FC<WalletButtonProps> = ({
  onClick,
  disabled,
  className,
  children,
  variant = 'default'
}) => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!isConnected) {
      open();
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    if (variant === 'modal') {
      return (
        <div className={cn('flex items-center gap-3 p-4', className)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
              <p className="text-xs text-neutral-600">
                {chain?.name || 'Unknown Network'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="ml-auto"
          >
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border">
          <div className="w-2 h-2 bg-success-500 rounded-full"></div>
          <span className="text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {chain && (
            <span className="text-xs text-neutral-600">
              {chain.name}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-xs"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2',
        className
      )}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      {children || 'Connect Wallet'}
    </Button>
  );
};

export default WalletButton;