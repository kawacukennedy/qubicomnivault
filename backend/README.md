# Qubic OmniVault Backend

NestJS API server for the Qubic OmniVault DeFi platform.

## Features

- ✅ Complete API implementation
- ✅ JWT authentication with wallet signatures
- ✅ Document tokenization with S3 storage
- ✅ Background processing with Bull queues
- ✅ Real-time WebSocket updates
- ✅ PostgreSQL with TypeORM
- ✅ Redis caching
- ✅ Swagger documentation

## Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Redis
- Bull (Queue)
- AWS S3
- Socket.IO
- JWT
- Swagger

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env
# Configure environment variables
npm run start:dev
```

## Environment Variables

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
QUBIC_RPC_URL=https://rpc.qubic.org
PRIVATE_KEY=your-private-key

# Frontend
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /auth/nonce` - Get login nonce
- `POST /auth/register` - Register user
- `POST /auth/login` - Login with signature
- `POST /auth/refresh` - Refresh JWT

### Tokenization
- `POST /tokenize` - Upload documents
- `GET /tokenize/valuation/:jobId` - Get valuation
- `POST /tokenize/mint` - Mint oqAsset
- `GET /tokenize/documents` - User documents
- `GET /tokenize/oq-assets` - User oqAssets

### Dashboard
- `GET /dashboard/portfolio` - Portfolio summary
- `GET /dashboard/positions` - User positions
- `GET /dashboard/activity` - Activity feed

### Loans
- `POST /loans` - Create loan
- `GET /loans` - User loans
- `POST /loans/:id/repay` - Repay loan

### Pools
- `GET /pools` - All pools
- `GET /pools/:id` - Pool details
- `POST /pools/:id/add-liquidity` - Add liquidity
- `POST /pools/:id/remove-liquidity` - Remove liquidity

## WebSocket Events

- `join-user-room` - Join user-specific room
- `join-valuation-room` - Join valuation updates
- Events: `portfolio-update`, `loan-update`, `notification`

## Build

```bash
npm run build
npm run start:prod
```

## Testing

```bash
npm run test
npm run test:e2e
```

## Docker

```bash
docker build -t qubic-backend .
docker run -p 3001:3000 qubic-backend
```

## Documentation

API documentation available at `http://localhost:3001/api` when running.