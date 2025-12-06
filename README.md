# Qubic OmniVault

A comprehensive Real-World-Asset (RWA) tokenization, collateralized lending, and yield routing platform built for the Qubic blockchain. Transform traditional assets into digital tokens, unlock liquidity through DeFi lending, and earn yields through automated strategies.

## 🚀 Features

- **Asset Tokenization**: Convert invoices and documents into blockchain-backed oqAssets
- **Collateralized Lending**: Use oqAssets as collateral to borrow stablecoins
- **Liquidity Pools**: Provide liquidity and earn yields
- **Real-time Updates**: WebSocket-powered live portfolio tracking
- **Wallet Integration**: Seamless Web3 wallet connectivity
- **Governance**: Participate in platform governance decisions

## 🏗️ Architecture

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Web3**: Wagmi + Web3Modal
- **Routing**: React Router
- **Animations**: Framer Motion

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Queue**: Bull for background processing
- **Authentication**: JWT with wallet signatures
- **File Storage**: AWS S3
- **WebSocket**: Socket.IO for real-time updates
- **Documentation**: Swagger/OpenAPI

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Railway/Heroku (backend)

## 📁 Project Structure

```
qubic/
├── frontend/          # React SPA
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   ├── stores/    # State management
│   │   └── utils/     # Utilities
│   └── tests/         # E2E tests
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   ├── entities/  # Database entities
│   │   └── services/  # Business logic
│   └── test/          # Unit tests
├── infra/             # Infrastructure configs
│   ├── docker/        # Dockerfiles
│   ├── k8s/           # Kubernetes manifests
│   └── ci/            # CI/CD pipelines
└── README.md
```

## 🛠️ Setup & Development

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install --legacy-peer-deps  # Due to NestJS version conflicts
cp .env.example .env
# Configure environment variables
npm run start:dev
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qubic
DB_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket

# Blockchain
QUbic_RPC_URL=https://rpc.qubic.org
PRIVATE_KEY=your-private-key

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_BASE=http://localhost:3001
```

### Docker Development
```bash
# Start full stack
docker compose up --build

# Or individually
docker compose up postgres redis
cd backend && npm run start:dev
cd frontend && npm run dev
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy via Vercel CLI or connect GitHub repo
```

### Backend (Railway/Heroku)
```bash
npm run build
npm run start:prod
```

### Production Stack
- **Frontend**: Vercel
- **Backend**: Railway or Heroku
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis
- **File Storage**: AWS S3

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test        # Unit tests
npm run test:e2e    # E2E tests with Playwright
```

### Backend
```bash
cd backend
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

## 📚 API Documentation

Once backend is running, visit `http://localhost:3001/api` for Swagger documentation.

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint
- `npm run test` - Run tests

### Backend
- `npm run start:dev` - Development with watch
- `npm run start:prod` - Production build
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - ESLint

## 🎨 Design System

### Colors
- Primary: Blue (#229FFF)
- Success: Green (#2AB94B)
- Warning: Orange (#FFA800)
- Error: Red (#FF3B3B)
- Neutral: Gray scale

### Typography
- Font Family: Inter
- Headings: 48px down to 14px
- Body: 16px/24px

### Components
- Fully designed component library
- Responsive design (mobile-first)
- Accessibility compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

[Add license information]

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Status**: ✅ Frontend Complete | 🔄 Backend Setup Required | 🚀 Production Ready
