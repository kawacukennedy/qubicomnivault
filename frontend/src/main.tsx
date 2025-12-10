import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import './index.css'
import App from './App.tsx'
import { config } from './lib/wagmi'
import { ErrorBoundary } from './components/ErrorBoundary'

// Web3Modal configuration
createWeb3Modal({
  wagmiConfig: config,
  projectId: 'e3c5f0a5c6b1b5c3f2e8d9a7b6c4e5f0', // Replace with your actual project ID
  enableAnalytics: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#3b82f6',
    '--w3m-border-radius-master': '8px',
  },
  chains: config.chains,
  defaultChain: config.chains[0],
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </StrictMode>,
)
