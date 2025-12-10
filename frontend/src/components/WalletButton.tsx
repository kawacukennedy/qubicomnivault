import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from './ui/Button';

interface WalletButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onClick, disabled, className, children }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConnectors, setShowConnectors] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!isConnected) {
      setShowConnectors(true);
    }
  };

  const handleConnectorClick = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      connect({ connector });
      setShowConnectors(false);
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

  if (showConnectors) {
    return (
      <div className={`relative ${className || ''}`}>
        <div className="absolute top-full mt-2 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 min-w-48 z-50">
          <div className="text-xs text-neutral-500 mb-2 px-2">Choose Wallet</div>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnectorClick(connector.id)}
              disabled={!connector.ready || isPending}
              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connector.name}
            </button>
          ))}
          <button
            onClick={() => setShowConnectors(false)}
            className="w-full text-left px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-50 rounded mt-1"
          >
            Cancel
          </button>
        </div>
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