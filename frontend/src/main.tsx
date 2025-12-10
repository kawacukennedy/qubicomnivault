import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import './index.css'
import App from './App.tsx'
import { config } from './lib/wagmi'
import { ErrorBoundary } from './components/ErrorBoundary'

const queryClient = new QueryClient()

createWeb3Modal({
  wagmiConfig: config,
  projectId: 'e3c5f0a5c6b1b5c3f2e8d9a7b6c4e5f0',
  enableAnalytics: false,
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#229FFF',
    '--w3m-color-mix-strength': 20
  }
})

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
