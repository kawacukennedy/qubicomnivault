import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import WalletButton from '../components/WalletButton';

const Connect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-lg text-neutral-600">
            Connect your wallet to access Qubic OmniVault and start tokenizing assets.
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Secure Connection</h2>
              <p className="text-neutral-600 text-sm">
                Your wallet connection is encrypted and secure. We never store your private keys.
              </p>
            </div>

            <div className="space-y-4">
              <WalletButton
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </WalletButton>

              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-4">Supported wallets:</p>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    <span className="text-xs">MetaMask</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded"></div>
                    <span className="text-xs">WalletConnect</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded"></div>
                    <span className="text-xs">Coinbase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-sm font-medium mb-3">What you'll be able to do:</h3>
              <ul className="text-sm text-neutral-600 space-y-2">
                <li>• Tokenize invoices and assets</li>
                <li>• Borrow against your collateral</li>
                <li>• Provide liquidity to earn yields</li>
                <li>• Participate in governance</li>
              </ul>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Connect;