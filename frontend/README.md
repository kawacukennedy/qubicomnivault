# Qubic OmniVault Frontend

A modern, responsive React TypeScript SPA for the Qubic OmniVault DeFi platform, enabling users to tokenize real-world assets, manage collateralized positions, and participate in decentralized governance.

## 🚀 Features

### Core Functionality
- ✅ **Asset Tokenization**: Upload documents and tokenize real-world assets into oQAssets
- ✅ **Portfolio Management**: Comprehensive dashboard with real-time portfolio tracking
- ✅ **Collateralized Positions**: Create and manage positions with LTV monitoring
- ✅ **Lending & Borrowing**: Borrow against tokenized assets with dynamic interest rates
- ✅ **Liquidity Pools**: Provide liquidity and earn rewards
- ✅ **Governance**: Vote on platform proposals and participate in decision-making

### Wallet Integration
- ✅ **Multi-Wallet Support**: MetaMask, Coinbase Wallet, WalletConnect, and injected wallets
- ✅ **Web3Modal**: Modern modal interface with custom theming and analytics
- ✅ **Network Support**: Ethereum, Sepolia testnet, Qubic mainnet, and Qubic testnet
- ✅ **Secure Authentication**: Wallet signature-based authentication with nonce verification
- ✅ **Real-Time Connection**: Live connection status and network switching

### User Experience
- ✅ **Universal Sidebar Navigation**: Persistent sidebar across all app pages for improved accessibility
- ✅ **Mobile-First Design**: Fully responsive with optimized mobile navbar and touch targets
- ✅ **Real-Time Updates**: WebSocket integration for live data synchronization
- ✅ **Loading States**: Skeleton components and smooth animations with Framer Motion
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- ✅ **Form Validation**: Robust client-side validation with React Hook Form and Zod

### Technical Features
- ✅ **Wallet Integration**: MetaMask and Web3Modal support with Wagmi
- ✅ **Type Safety**: Full TypeScript implementation with strict type checking
- ✅ **State Management**: Zustand for global state, TanStack Query for server state
- ✅ **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- ✅ **Performance**: Optimized builds with Vite, code splitting, and lazy loading

## 🛠️ Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **State Management**: Zustand + TanStack React Query
- **Web3**: Wagmi + Web3Modal + Viem
- **Forms**: React Hook Form + Zod validation
- **Real-Time**: Socket.IO Client
- **Charts**: Recharts
- **Icons**: Heroicons

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kawacukennedy/qubicomnivault.git
   cd qubicomnivault/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   VITE_API_BASE=http://localhost:3001
   VITE_WS_URL=ws://localhost:3001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 🧪 Testing

### Unit Tests
```bash
npm run test:unit  # Run Vitest unit tests
```

### E2E Tests
```bash
npm run test:e2e   # Run Playwright E2E tests
```

### Linting
```bash
npm run lint      # ESLint code quality checks
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `VITE_API_BASE`: Backend API URL (e.g., `https://api.qubicomnivault.com`)
   - `VITE_WS_URL`: WebSocket URL for real-time updates
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Deploy the `dist` folder to your hosting provider (Netlify, AWS S3, etc.)
```

### Environment Configuration
Create environment files for different stages:

**Development** (`.env.local`):
```env
VITE_API_BASE=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_USE_MOCK_DATA=true
VITE_QUBIC_RPC_URL=https://testnet-rpc.qubic.org
VITE_QUBIC_TESTNET_RPC_URL=https://testnet-rpc.qubic.org
```

**Production** (set in hosting platform):
```env
VITE_API_BASE=https://api.qubicomnivault.com
VITE_WS_URL=wss://api.qubicomnivault.com
VITE_USE_MOCK_DATA=false
VITE_QUBIC_RPC_URL=https://rpc.qubic.org
VITE_QUBIC_TESTNET_RPC_URL=https://testnet-rpc.qubic.org
```

### Wallet Configuration
The app supports multiple wallet connections:
- **MetaMask**: Browser extension
- **Coinbase Wallet**: Mobile and browser
- **WalletConnect**: Mobile wallets via QR code
- **Injected**: Other browser wallet extensions

Web3Modal handles wallet discovery and connection automatically.

### Build Optimization
- The app uses Vite for fast builds and hot reloading
- Code splitting is enabled for optimal loading performance
- Static assets are optimized and cached

### Maintenance
- Monitor build status on Vercel dashboard
- Check browser console for runtime errors
- Update dependencies regularly with `npm audit`
- Test on multiple browsers and devices before major releases

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, etc.)
│   ├── AppLayout.tsx    # Universal layout with sidebar
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Navbar.tsx       # Mobile-responsive navbar
│   └── ...
├── pages/               # Route components
│   ├── Landing.tsx      # Marketing landing page
│   ├── Dashboard.tsx    # Main portfolio dashboard
│   ├── Tokenize.tsx     # Asset tokenization flow
│   ├── Pools.tsx        # Liquidity pool management
│   ├── Governance.tsx   # Voting interface
│   └── ...
├── services/            # API integration
│   ├── api.ts           # REST API hooks
│   └── mockData.ts      # Mock data for development
├── stores/              # Global state management
│   ├── userStore.ts     # User authentication state
│   ├── portfolioStore.ts # Portfolio data
│   └── notificationStore.ts # Notifications
├── hooks/               # Custom React hooks
│   └── useWebSocket.ts  # WebSocket connection
├── lib/                 # Configuration & utilities
│   ├── wagmi.ts         # Web3 configuration
│   └── chains/          # Network configurations
└── utils/               # Helper functions
    └── cn.ts            # Class name utility
```

## 🔌 API Integration

The frontend integrates with a NestJS backend API. Key endpoints include:

- **Authentication**: Wallet-based auth with nonce signing
- **Tokenization**: Document upload and oQAsset minting
- **Portfolio**: Real-time portfolio and position data
- **Loans**: Borrowing and repayment operations
- **Pools**: Liquidity provision and withdrawal
- **Governance**: Proposals and voting

### Environment Variables
- `VITE_API_BASE`: Backend API URL (default: `http://localhost:3001`)
- `VITE_WS_URL`: WebSocket URL for real-time updates

## 🎨 Design System

### Color Palette
- **Primary**: Blue variants for main actions
- **Success**: Green for positive states
- **Warning**: Yellow/Orange for caution
- **Error**: Red for errors
- **Neutral**: Grays for text and backgrounds

### Typography
- **Font Family**: System fonts with fallbacks
- **Sizes**: Responsive scale from xs to 4xl
- **Weights**: Regular, medium, semibold, bold

### Components
All UI components follow a consistent API with variants, sizes, and proper TypeScript types.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
