# Qubic Development Guide

This comprehensive guide covers all aspects of developing on the Qubic blockchain, from smart contract development to frontend integration.

## Table of Contents

1. [Smart Contract Overview](#smart-contract-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Qubic Programming Interface (QPI)](#qubic-programming-interface-qpi)
4. [Contract Structure](#contract-structure)
5. [Data Types](#data-types)
6. [Procedures and Functions](#procedures-and-functions)
7. [Asset and Share Management](#asset-and-share-management)
8. [Testing Contracts](#testing-contracts)
9. [RPC API Integration](#rpc-api-integration)
10. [Frontend Development](#frontend-development)
11. [Wallet Integrations](#wallet-integrations)
12. [TypeScript Library](#typescript-library)
13. [Best Practices](#best-practices)

## Smart Contract Overview

Qubic smart contracts are decentralized C++ programs that execute directly on baremetal hardware, eliminating the need for traditional operating systems or virtual machines. This low-level execution model provides high performance, low latency, and fine-grained control over computation.

### Key Features

1. **Baremetal Execution**: Contracts run directly on hardware without OS/VM layers
2. **IPO-Based Deployment**: Contracts require community approval through Initial Public Offering
3. **No Gas Model**: Compute resources allocated via IPO and scheduled execution
4. **Deterministic Execution**: All contracts behave identically across network nodes

### Contract Lifecycle

1. **Proposal**: Contract proposed to community
2. **IPO**: Community allocates compute resources
3. **Construction**: Contract integrated into core code
4. **Execution**: Contract runs on allocated compute resources
5. **Maintenance**: Ongoing QU burning to maintain activity

## Development Environment Setup

### Prerequisites

- **Visual Studio** with Desktop development with C++ workload
- **Qubic Core Repository**: Use the madrid-2025 branch for latest features
- **Windows SDK**: Ensure correct version is installed

### Installation Steps

1. **Install Visual Studio**
   ```bash
   # Download from https://visualstudio.microsoft.com/
   # Select Desktop development with C++ workload
   ```

2. **Clone Qubic Core**
   ```bash
   git clone https://github.com/qubic/core.git
   cd core
   git checkout madrid-2025  # Use latest demo branch
   ```

3. **Open Solution**
   ```bash
   # Open Qubic.sln in Visual Studio
   # Build test project to verify setup
   ```

### Alternative: Qubic Dev Kit

For streamlined development:
```bash
# Use Qubic Dev Kit for one-command setup
git clone https://github.com/qubic/qubic-dev-kit.git
cd qubic-dev-kit
# Follow setup instructions for HM25 demo
```

## Qubic Programming Interface (QPI)

QPI provides a restricted but powerful interface for contract development, ensuring deterministic execution across the network.

### Core QPI Functions

#### Context Functions
```cpp
id qpi.invocator()        // Direct caller of current procedure
id qpi.originator()       // Original transaction sender
sint64 qpi.invocationReward()  // QU attached to call
```

#### Transfer Functions
```cpp
sint64 qpi.transfer(id destination, sint64 amount)
sint64 qpi.burn(sint64 amount)
```

#### Cryptographic Functions
```cpp
id qpi.K12(const T& data)  // KangarooTwelve hash
```

#### Asset Management
```cpp
sint64 qpi.issueAsset(uint64 assetName, id issuer, sint8 decimalPlaces, sint64 numberOfShares, uint64 unitOfMeasurement)
sint64 qpi.transferShareOwnershipAndPossession(uint64 assetName, id issuer, id owner, id possessor, sint64 numberOfShares, id newOwner)
sint64 qpi.numberOfShares(const Asset& asset, const AssetOwnershipSelect& ownership, const AssetPossessionSelect& possession)
```

#### Time Functions
```cpp
uint16 qpi.year()
uint8 qpi.month()
uint8 qpi.day()
uint8 qpi.hour()
uint8 qpi.minute()
uint8 qpi.second()
uint16 qpi.millisecond()
uint32 qpi.tick()
uint16 qpi.epoch()
```

### Data Structures

#### Arrays and Collections
```cpp
Array<uint64, 4> fixedArray;           // Fixed-size array
BitArray<uint64, 4> bitArray;          // Compact boolean storage
HashMap<KeyT, ValueT, Length> map;     // Key-value store
HashSet<KeyT, Length> set;             // Unique element set
Collection<T, L> priorityQueue;        // Priority queue with POV
```

#### Custom Structures
```cpp
struct bit_x { uint64 _values : x; };     // x-bit integer (x = 2^n)
struct sint8_x { sint8 _values[x]; };     // Array of x signed chars
// Similar for uint8_x, sint16_x, uint16_x, sint32_x, uint32_x, sint64_x, uint64_x, id_x
```

## Contract Structure

### Basic Contract Template

```cpp
using namespace QPI;

struct MYTEST2  // Expansion state (unused in current implementation)
{
};

struct MYTEST : public ContractBase
{
public:
    sint64 myNumber;  // Contract state variables

    // Input/Output structures for functions/procedures
    struct functionName_input
    {
        // Input parameters
    };

    struct functionName_output
    {
        // Output parameters
    };

    // Functions (read-only)
    PUBLIC_FUNCTION(functionName)
    {
        // Implementation
    }

    // Procedures (state-modifying)
    PUBLIC_PROCEDURE(procedureName)
    {
        // Implementation
    }

    // System procedures
    INITIALIZE()
    {
        // One-time initialization
    }

    BEGIN_EPOCH()
    {
        // Epoch start logic
    }

    // Registration
    REGISTER_USER_FUNCTIONS_AND_PROCEDURES()
    {
        REGISTER_USER_FUNCTION(functionName, 1);
        REGISTER_USER_PROCEDURE(procedureName, 2);
    }
};
```

### Adding Contracts to Core

1. **Create Contract File**
   ```
   /contracts/MyContract.h
   ```

2. **Define Contract in contract_def.h**
   ```cpp
   #define MYTEST_CONTRACT_INDEX 13
   #define CONTRACT_INDEX MYTEST_CONTRACT_INDEX
   #define CONTRACT_STATE_TYPE MYTEST
   #define CONTRACT_STATE2_TYPE MYTEST2
   #include "contracts/MyTest.h"
   ```

3. **Add Description**
   ```cpp
   {"MYTEST", 999, 10000, sizeof(MYTEST)},
   ```

4. **Register Functions**
   ```cpp
   REGISTER_CONTRACT_FUNCTIONS_AND_PROCEDURES(MYTEST);
   ```

## Data Types

### Safe Integer Types
```cpp
sint8, uint8, sint16, uint16, sint32, uint32, sint64, uint64
```

### Special Types
```cpp
bit      // Boolean (true/false)
id       // 256-bit identifier (public keys, asset IDs)
```

### Arrays and Strings
```cpp
Array<T, Length>           // Fixed-size array
BitArray<T, Length>        // Compact bit storage
UEFIString<Length>         // Null-terminated string
```

### Collections
```cpp
HashMap<KeyT, ValueT, L>   // Key-value mapping
HashSet<KeyT, L>           // Unique elements
Collection<T, L>           // Priority queues
```

## Procedures and Functions

### Function Types

#### Public Functions
```cpp
PUBLIC_FUNCTION(functionName)
{
    // Read-only operations
    // Can call other functions
    // Cannot modify state
    // Cannot call procedures
}
```

#### Private Functions
```cpp
PRIVATE_FUNCTION(functionName)
{
    // Internal use only
    // Same restrictions as public functions
}
```

### Procedure Types

#### Public Procedures
```cpp
PUBLIC_PROCEDURE(procedureName)
{
    // Can modify state
    // Can call functions and procedures
    // Executed via transactions
}
```

#### Private Procedures
```cpp
PRIVATE_PROCEDURE(procedureName)
{
    // Internal use only
    // Same capabilities as public procedures
}
```

#### System Procedures
```cpp
INITIALIZE()           // One-time setup
BEGIN_EPOCH()          // Epoch start
END_EPOCH()           // Epoch end
BEGIN_TICK()          // Tick start
END_TICK()            // Tick end
PRE_RELEASE_SHARES()  // Asset transfer pre-hook
POST_ACQUIRE_SHARES() // Asset transfer post-hook
```

### Input/Output Handling

```cpp
struct functionName_input
{
    sint64 parameter1;
    id parameter2;
};

struct functionName_output
{
    sint64 result;
    bit success;
};

PUBLIC_FUNCTION(functionName)
{
    output.result = input.parameter1 * 2;
    output.success = true;
}
```

### Local Variables

```cpp
PUBLIC_FUNCTION_WITH_LOCALS(functionName)
{
    struct functionName_locals
    {
        sint64 tempValue;
        id tempId;
    };

    locals.tempValue = input.value * 2;
    // Use locals instead of declaring variables
}
```

## Asset and Share Management

### Asset Issuance
```cpp
sint64 qpi.issueAsset(
    uint64 assetName,           // 8-byte identifier
    id issuer,                  // Creator public key
    sint8 decimalPlaces,        // Precision (0-127)
    sint64 numberOfShares,      // Total supply
    uint64 unitOfMeasurement    // Unit code
);
```

### Share Transfers
```cpp
sint64 qpi.transferShareOwnershipAndPossession(
    uint64 assetName,
    id issuer,
    id owner,              // Current owner
    id possessor,          // Current holder
    sint64 numberOfShares,
    id newOwnerAndPossessor  // NULL_ID to burn
);
```

### Share Queries
```cpp
sint64 qpi.numberOfShares(
    const Asset& asset,
    const AssetOwnershipSelect& ownership,
    const AssetPossessionSelect& possession
);
```

### Management Rights Transfer

#### Release Rights
```cpp
sint64 qpi.releaseShares(
    const Asset& asset,
    const id& owner,
    const id& possessor,
    sint64 numberOfShares,
    uint16 destOwnershipContract,
    uint16 destPossessionContract,
    sint64 offeredFee
);
```

#### Acquire Rights
```cpp
sint64 qpi.acquireShares(
    const Asset& asset,
    const id& owner,
    const id& possessor,
    sint64 numberOfShares,
    uint16 srcOwnershipContract,
    uint16 srcPossessionContract,
    sint64 offeredFee
);
```

## Testing Contracts

### Unit Test Structure

```cpp
#define NO_UEFI

#include "contract_testing.h"

class ContractTestingMyContract : protected ContractTesting
{
public:
    ContractTestingMyContract()
    {
        initEmptySpectrum();
        initEmptyUniverse();
        INIT_CONTRACT(MYTEST);
    }

    // Wrapper methods for testing
    MYTEST::functionName_output functionName(inputs...)
    {
        MYTEST::functionName_input input;
        MYTEST::functionName_output output;
        // Set inputs
        callFunction(MYTEST_CONTRACT_INDEX, functionId, input, output);
        return output;
    }
};

TEST(MyContract, TestFunction)
{
    ContractTestingMyContract test;
    auto output = test.functionName(inputs...);
    EXPECT_EQ(output.result, expected);
}
```

### Building Tests

1. **Add Test File**: `contract_mycontract.cpp`
2. **Build**: Right-click test project → Build
3. **Run**: `test.exe --gtest_filter=MyContract.*`

### Packet Crafting for Manual Testing

```cpp
// For function calls
RequestResponseHeader header;
RequestContractFunction rcf;
header.setSize<sizeof(packet)>();
header.randomizeDejavu();
header.setType(RequestContractFunction::type);
rcf.contractIndex = MYTEST_CONTRACT_INDEX;
rcf.inputType = functionId;
rcf.inputSize = sizeof(input);

// For procedure calls (transactions)
QubicTransaction tx;
tx.setSourcePublicKey(publicKey);
tx.setDestinationPublicKey(contractAddress);
tx.setInputType(procedureId);
tx.setAmount(amount);
tx.setTick(targetTick);
```

## RPC API Integration

### Endpoints

```javascript
// Network status
GET /status
GET /v1/tick-info

// Balances
GET /v1/balances/{identityId}

// Assets
GET /v1/assets/{identity}/owned

// Transactions
POST /v1/broadcast-transaction
GET /transactions/{transactionId}

// Smart contracts
POST /v1/querySmartContract
```

### Contract Function Calls

```javascript
const response = await fetch(`${rpcUrl}/v1/querySmartContract`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractIndex: 13,
    inputType: 1,
    inputSize: 0,
    requestData: base64EncodedInput
  })
});

const result = Buffer.from(await response.text(), 'base64');
// Parse result according to output structure
```

### Transaction Broadcasting

```javascript
const tx = new QubicTransaction()
  .setSourcePublicKey(new PublicKey(sourceKey))
  .setDestinationPublicKey(new PublicKey(contractAddress))
  .setTick(targetTick)
  .setInputType(procedureId)
  .setAmount(new Long(BigInt(amount)))
  .setPayload(payload);

await tx.build(seed);
const encoded = tx.encodeTransactionToBase64(tx.getPackageData());

const response = await fetch(`${rpcUrl}/v1/broadcast-transaction`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ encodedTransaction: encoded })
});
```

## Frontend Development

### Project Setup

```bash
# Create React project
npx create-react-app my-qubic-dapp
cd my-qubic-dapp

# Install dependencies
npm install @qubic-lib/qubic-ts-library
npm install @web3modal/wagmi wagmi viem
```

### Wallet Integration

```typescript
import { injected, metaMask, walletConnect } from 'wagmi';

const config = createConfig({
  chains: [mainnet, sepolia, qubic],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: 'your-project-id' }),
  ],
  transports: {
    [qubic.id]: http(),
  },
});
```

### Smart Contract Interaction

```typescript
// Function call (read)
async function callContractFunction() {
  const response = await fetch(`${rpcUrl}/v1/querySmartContract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contractIndex: contractIndex,
      inputType: functionId,
      inputSize: payloadSize,
      requestData: base64Payload
    })
  });

  return Buffer.from(await response.text(), 'base64');
}

// Procedure call (write)
async function callContractProcedure(seed: string, inputs: any) {
  const payload = createPayload(inputs);
  const tx = new QubicTransaction()
    .setSourcePublicKey(new PublicKey(publicKey))
    .setDestinationPublicKey(new PublicKey(contractAddress))
    .setTick(currentTick + 30)
    .setInputType(procedureId)
    .setPayload(payload);

  await tx.build(seed);
  const encoded = tx.encodeTransactionToBase64(tx.getPackageData());

  return await broadcastTransaction(encoded);
}
```

## Wallet Integrations

Use standard wagmi connectors for MetaMask, WalletConnect, and other wallets. Qubic is EVM-compatible, so no special connectors are needed.

## TypeScript Library

### Installation
```bash
npm install @qubic-lib/qubic-ts-library
```

### Key Classes

```typescript
import {
  QubicTransaction,
  PublicKey,
  QubicHelper,
  DynamicPayload,
  QubicPackageBuilder,
  Long
} from '@qubic-lib/qubic-ts-library';
```

### Transaction Building

```typescript
const helper = new QubicHelper();
const idPackage = await helper.createIdPackage(seed);
const publicKey = new PublicKey(idPackage.publicKey);

const tx = new QubicTransaction()
  .setSourcePublicKey(publicKey)
  .setDestinationPublicKey(contractAddress)
  .setTick(targetTick)
  .setInputType(procedureId)
  .setAmount(amount)
  .setPayload(payload);

const signedTx = await tx.build(seed);
```

### Payload Construction

```typescript
const builder = new QubicPackageBuilder(payloadSize);

// Add data according to contract input structure
builder.add(new PublicKey(issuer));
builder.add(new Long(BigInt(assetName)));
builder.add(new Long(BigInt(price)));

const payload = new DynamicPayload(payloadSize);
payload.setPayload(builder.getData());
```

## Best Practices

### Security
- ✅ Use only QPI-approved functions
- ✅ Validate all inputs
- ✅ Implement proper access controls
- ✅ Never expose private keys
- ✅ Use secure random generation

### Performance
- ✅ Minimize state size
- ✅ Use efficient data structures
- ✅ Avoid unnecessary computations
- ✅ Cache frequently used values

### Development
- ✅ Write comprehensive tests
- ✅ Document contract interfaces
- ✅ Use meaningful variable names
- ✅ Follow established patterns

### Deployment
- ✅ Test thoroughly on testnet
- ✅ Plan IPO carefully
- ✅ Monitor contract performance
- ✅ Have emergency procedures ready

## Common Pitfalls

### Contract Development
- Using prohibited C++ features (pointers, floats, etc.)
- Incorrect input/output structure sizes
- Missing function/procedure registration
- Improper state initialization

### RPC Integration
- Wrong payload encoding (must be base64)
- Incorrect input sizes
- Invalid tick timing
- Insufficient account balance

### Frontend Integration
- Exposing sensitive data client-side
- Improper error handling
- Race conditions in state updates
- Missing wallet connection checks

## Resources

- [Qubic Core Repository](https://github.com/qubic/core)
- [Qubic Dev Kit](https://github.com/qubic/qubic-dev-kit)
- [Qubic TypeScript Library](https://github.com/qubic/ts-library)
- [HM25 Frontend Example](https://github.com/qubic/hm25-frontend)
- [RPC Documentation](https://qubic.github.io/integration/Partners/swagger/qubic-rpc-doc.html)

## Support

- Discord: #dev channel
- GitHub Issues: Report bugs and request features
- Documentation: Comprehensive guides available
- Grants: Apply for development funding</content>
</xai:function_call/>
<xai:function_call name="edit">
<parameter name="filePath">frontend/src/lib/wagmi.ts