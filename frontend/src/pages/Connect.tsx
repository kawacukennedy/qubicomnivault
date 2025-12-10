import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import WalletButton from '../components/WalletButton';
import { useLogin, useNonce } from '../services/api';

const Connect = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { open } = useWeb3Modal();
  const loginMutation = useLogin();
  const { data: nonceData, isLoading: nonceLoading, error: nonceError } = useNonce();

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/app');
    }
  }, [navigate]);

  const handleAuth = async () => {
    if (!address) return;

    setIsAuthenticating(true);
    setAuthError(null);
    try {
      // Skip signature for mock data
      const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      let result;

      if (useMock) {
        // Mock authentication - just simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        result = {
          jwt: 'mock-jwt-token',
          refresh_token: 'mock-refresh-token'
        };
      } else {
        if (!nonceData?.nonce) return;
        const message = `Sign this message to authenticate with Qubic OmniVault: ${nonceData.nonce}`;
        const signature = await signMessageAsync({ message });

        result = await loginMutation.mutateAsync({
          wallet_address: address,
          signature,
          nonce: nonceData.nonce,
        });
      }

      // Store tokens
      localStorage.setItem('authToken', result.jwt);
      localStorage.setItem('refreshToken', result.refresh_token);

      navigate('/app');
    } catch (error) {
      console.error('Authentication failed:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Auto-authenticate when connected
  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';
    if (isConnected && !isAuthenticating && !authError && (useMock || (nonceData?.nonce && !nonceError))) {
      handleAuth();
    }
  }, [isConnected, nonceData, isAuthenticating, authError, nonceError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-md w-full mx-auto">
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
              {isConnected ? (
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-4">
                    Wallet connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                  {nonceLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mr-2"></div>
                      Loading...
                    </div>
                  ) : nonceError ? (
                    <div className="text-center">
                      <p className="text-sm text-red-600 mb-2">
                        Backend server not available. Please start the backend server:
                      </p>
                      <p className="text-xs text-neutral-600 mb-2">
                        cd backend && npm install && npm run start:dev
                      </p>
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  ) : isAuthenticating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mr-2"></div>
                      Authenticating...
                    </div>
                  ) : authError ? (
                    <div className="text-center">
                      <p className="text-sm text-red-600 mb-2">{authError}</p>
                      <Button variant="outline" size="sm" onClick={handleAuth}>
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleAuth} className="w-full">
                      Authenticate
                    </Button>
                  )}
                </div>
                ) : (
                  <Button onClick={() => open()} className="w-full flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Connect Wallet
                  </Button>
                )}

               <div className="text-center">
                 <p className="text-sm text-neutral-500 mb-4">Supported wallets:</p>
                 <div className="grid grid-cols-3 gap-2 sm:flex sm:justify-center sm:space-x-4">
                   <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                     <div className="w-6 h-6 bg-blue-500 rounded"></div>
                     <span className="text-xs text-center sm:text-left">MetaMask</span>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                     <div className="w-6 h-6 bg-orange-500 rounded"></div>
                     <span className="text-xs text-center sm:text-left">WalletConnect</span>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
                     <div className="w-6 h-6 bg-purple-500 rounded"></div>
                     <span className="text-xs text-center sm:text-left">Coinbase</span>
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