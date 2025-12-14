# Entry Pass - Anchor Smart Contract Setup

This project includes a simple Anchor smart contract for managing membership passes on the Solana blockchain.

## Overview

The Entry Pass program allows:
- Organizers to create pass collections with customizable parameters
- Users to purchase passes with SOL
- Verification of pass ownership and validity on-chain
- Organizers to revoke passes if needed

## Contract Structure

### Accounts

**PassCollection**
- Stores metadata about a pass type (name, description, price, supply limits)
- Created by organizers
- PDA derived from: `["pass-collection", organizer_pubkey, pass_name]`

**UserPass**
- Represents an individual pass owned by a user
- Created when a user purchases a pass
- PDA derived from: `["user-pass", pass_collection_pubkey, buyer_pubkey]`

### Instructions

1. **create_pass_collection** - Create a new pass type
   - Parameters: name, description, price, max_supply, validity_period
   - Only callable by pass organizer

2. **purchase_pass** - Buy a pass from a collection
   - Transfers SOL from buyer to organizer
   - Creates a UserPass account for the buyer
   - Checks supply limits

3. **verify_pass** - Verify if a wallet has a valid pass
   - Returns boolean indicating pass validity
   - Checks ownership, active status, and expiration

4. **revoke_pass** - Revoke a pass (organizer only)
   - Sets pass inactive status

## Building and Deploying

### Prerequisites

Install Rust and Solana CLI:
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli
```

### Build the Program

```bash
# Build the program
anchor build

# This generates:
# - target/deploy/entry_pass.so (compiled program)
# - target/idl/entry_pass.json (interface definition)
```

### Deploy to Devnet

```bash
# Configure Solana to use devnet
solana config set --url devnet

# Create a new keypair (or use existing)
solana-keygen new

# Airdrop SOL for deployment (devnet only)
solana airdrop 2

# Deploy the program
anchor deploy

# Note the Program ID from output and update:
# - Anchor.toml
# - programs/entry-pass/src/lib.rs (declare_id!)
# - src/lib/program.ts (PROGRAM_ID)
```

### Deploy to Mainnet

```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Deploy (ensure you have enough SOL for deployment)
anchor deploy
```

## Frontend Integration

The frontend is already configured to use the program:

1. **Program Utilities** (`src/lib/program.ts`)
   - Helper functions for all program instructions
   - PDA derivation helpers
   - Account fetching utilities

2. **EntryProgram Class** (`src/lib/solana.ts`)
   - High-level interface matching the existing API
   - Integrates with Anchor client

3. **Page Components**
   - Organizer page: Create pass collections
   - Browse page: View and purchase passes
   - Verifier page: Verify pass ownership

## Testing

Run tests with Anchor:

```bash
# Run tests on local validator
anchor test

# Run tests on devnet
anchor test --provider.cluster devnet
```

## Security Considerations

1. **Row Level Security (RLS)**
   - Pass collections can only be created by the organizer
   - Passes can only be revoked by the organizer
   - All state transitions are validated on-chain

2. **Supply Limits**
   - Max supply is enforced on-chain
   - Prevents overselling passes

3. **Payment Security**
   - SOL transfers happen atomically
   - Payment goes directly to organizer

4. **Validity Checks**
   - Expiration is checked during verification
   - Active status can be revoked by organizer

## Program Accounts Space Calculations

- PassCollection: ~350 bytes
- UserPass: ~150 bytes

Rent-exempt minimum: ~0.002 SOL per account

## Example Usage

### Create a Pass Collection

```typescript
import { createPassCollection } from './lib/program';

const priceInLamports = 0.5 * LAMPORTS_PER_SOL;
const maxSupply = 100;
const validityPeriodInSeconds = 30 * 24 * 60 * 60; // 30 days

await createPassCollection(
  program,
  "Summer Festival 2024",
  "3-day music festival pass",
  priceInLamports,
  maxSupply,
  validityPeriodInSeconds
);
```

### Purchase a Pass

```typescript
import { purchasePass } from './lib/program';

await purchasePass(
  program,
  passCollectionPubkey,
  organizerPubkey
);
```

### Verify Pass Ownership

```typescript
import { verifyPass } from './lib/program';

const isValid = await verifyPass(
  program,
  userPassPubkey,
  ownerPubkey
);
```

## Troubleshooting

**Program ID Mismatch**
- Ensure the Program ID in `declare_id!`, `Anchor.toml`, and frontend code all match

**Insufficient SOL**
- Airdrop more devnet SOL: `solana airdrop 2`
- Check balance: `solana balance`

**Account Not Found**
- Verify you're using the correct network (devnet/mainnet)
- Ensure program is deployed
- Check PDA derivation matches program

**Build Errors**
- Update Anchor: `cargo install --git https://github.com/coral-xyz/anchor --tag v0.29.0 anchor-cli --force`
- Clean and rebuild: `anchor clean && anchor build`

## Next Steps

1. Deploy the program to devnet for testing
2. Update the Program ID in all configuration files
3. Test creating, purchasing, and verifying passes
4. Deploy to mainnet when ready for production

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Program Derived Addresses](https://solanacookbook.com/core-concepts/pdas.html)
