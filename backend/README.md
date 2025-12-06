# Qubic OmniVault Backend

A comprehensive backend API for the Qubic OmniVault platform, built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Authentication**: Wallet-based authentication with JWT tokens
- **Document Tokenization**: Upload and tokenize documents into oqAssets
- **Loan Management**: Create and manage collateralized loans
- **Liquidity Pools**: Provide and remove liquidity from pools
- **Governance**: Vote on protocol proposals
- **Real-time Updates**: WebSocket support for live updates
- **File Storage**: AWS S3 integration for document storage
- **Background Processing**: Bull queues for valuation jobs

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Queue System**: Bull with Redis
- **WebSockets**: Socket.IO
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- AWS Account (for S3)

## Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

## Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE qubic_omnivault;
   ```

2. Run the application - TypeORM will automatically create tables

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001`
Swagger documentation at `http://localhost:3001/api`

## API Endpoints

### Authentication
- `POST /auth/nonce` - Get login nonce
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with wallet signature
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/profile` - Get user profile

### Tokenization
- `POST /tokenize` - Upload documents for tokenization
- `GET /tokenize/valuation/:jobId` - Get valuation result
- `POST /tokenize/mint` - Mint oqAsset token
- `GET /tokenize/documents` - Get user documents
- `GET /tokenize/oq-assets` - Get user oqAssets

### Loans
- `POST /loans` - Create a new loan
- `GET /loans` - Get user loans
- `GET /loans/:id` - Get loan details
- `POST /loans/:id/repay` - Repay loan

### Pools
- `GET /pools` - Get all liquidity pools
- `GET /pools/:id` - Get pool details
- `POST /pools/:id/add-liquidity` - Add liquidity to pool
- `POST /pools/:id/remove-liquidity` - Remove liquidity from pool
- `GET /pools/user/liquidity` - Get user liquidity positions

### Governance
- `GET /governance/proposals` - Get all proposals
- `GET /governance/proposals/:id` - Get proposal details
- `POST /governance/proposals/:id/vote` - Vote on a proposal
- `POST /governance/proposals` - Create a new proposal
- `GET /governance/voting-power` - Get user voting power

### Dashboard
- `GET /dashboard/portfolio` - Get user portfolio overview
- `GET /dashboard/activity` - Get user activity feed
- `GET /dashboard/positions` - Get user positions
- `GET /dashboard/notifications` - Get user notifications

## WebSocket Events

Connect to the WebSocket server for real-time updates

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

This project is licensed under the MIT License.
