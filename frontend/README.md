# Qubic OmniVault Frontend

React TypeScript SPA for the Qubic OmniVault DeFi platform.

## Features

- ✅ Complete UI implementation
- ✅ Wallet integration (Web3Modal + Wagmi)
- ✅ Responsive design
- ✅ Error boundaries
- ✅ Loading states with skeletons
- ✅ Real-time WebSocket updates
- ✅ Form validation
- ✅ Accessibility compliant

## Tech Stack

- React 18+
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Query
- Zustand
- Web3Modal
- Socket.IO Client

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

## Deployment

Configured for Vercel deployment. Connect your GitHub repo to Vercel for automatic deployments.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Base UI components
│   └── ...        # Feature components
├── pages/         # Page components
├── services/      # API integration
├── stores/        # State management
├── hooks/         # Custom hooks
├── lib/           # Configuration
└── utils/         # Utilities
```

## Key Components

- **Landing**: Hero section with tokenization illustration
- **Connect**: Wallet connection page
- **Dashboard**: Portfolio overview with real-time updates
- **Tokenize**: Document upload and tokenization
- **Pools**: Liquidity pool management
- **Governance**: Voting interface

## API Integration

Frontend connects to NestJS backend at `http://localhost:3001`. Update `REACT_APP_API_BASE` for different environments.

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
