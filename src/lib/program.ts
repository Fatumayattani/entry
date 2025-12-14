import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../../target/idl/entry_pass.json';

const PROGRAM_ID = new PublicKey('EntryPassProgram11111111111111111111111111');

export interface PassCollectionData {
  organizer: PublicKey;
  name: string;
  description: string;
  price: BN;
  maxSupply: BN;
  currentSupply: BN;
  validityPeriod: BN;
  createdAt: BN;
  bump: number;
}

export interface UserPassData {
  owner: PublicKey;
  passCollection: PublicKey;
  purchasedAt: BN;
  expiresAt: BN;
  isActive: boolean;
  bump: number;
}

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  return new Program(idl as any, PROGRAM_ID, provider);
}

export function getPassCollectionPDA(organizer: PublicKey, name: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('pass-collection'), organizer.toBuffer(), Buffer.from(name)],
    PROGRAM_ID
  );
}

export function getUserPassPDA(passCollection: PublicKey, buyer: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user-pass'), passCollection.toBuffer(), buyer.toBuffer()],
    PROGRAM_ID
  );
}

export async function createPassCollection(
  program: Program,
  name: string,
  description: string,
  priceInLamports: number,
  maxSupply: number,
  validityPeriodInSeconds: number
) {
  const organizer = program.provider.publicKey!;
  const [passCollectionPDA] = getPassCollectionPDA(organizer, name);

  const tx = await program.methods
    .createPassCollection(
      name,
      description,
      new BN(priceInLamports),
      new BN(maxSupply),
      new BN(validityPeriodInSeconds)
    )
    .accounts({
      passCollection: passCollectionPDA,
      organizer: organizer,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { tx, passCollectionPDA };
}

export async function purchasePass(
  program: Program,
  passCollectionPDA: PublicKey,
  organizerPubkey: PublicKey
) {
  const buyer = program.provider.publicKey!;
  const [userPassPDA] = getUserPassPDA(passCollectionPDA, buyer);

  const tx = await program.methods
    .purchasePass()
    .accounts({
      passCollection: passCollectionPDA,
      userPass: userPassPDA,
      buyer: buyer,
      organizer: organizerPubkey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return { tx, userPassPDA };
}

export async function verifyPass(
  program: Program,
  userPassPDA: PublicKey,
  ownerPubkey: PublicKey
): Promise<boolean> {
  try {
    const result = await program.methods
      .verifyPass()
      .accounts({
        userPass: userPassPDA,
        owner: ownerPubkey,
      })
      .view();

    return result as boolean;
  } catch (error) {
    console.error('Error verifying pass:', error);
    return false;
  }
}

export async function revokePass(
  program: Program,
  userPassPDA: PublicKey,
  passCollectionPDA: PublicKey
) {
  const organizer = program.provider.publicKey!;

  const tx = await program.methods
    .revokePass()
    .accounts({
      userPass: userPassPDA,
      passCollection: passCollectionPDA,
      organizer: organizer,
    })
    .rpc();

  return tx;
}

export async function fetchPassCollection(
  program: Program,
  passCollectionPDA: PublicKey
): Promise<PassCollectionData | null> {
  try {
    const account = await program.account.passCollection.fetch(passCollectionPDA);
    return account as unknown as PassCollectionData;
  } catch (error) {
    console.error('Error fetching pass collection:', error);
    return null;
  }
}

export async function fetchUserPass(
  program: Program,
  userPassPDA: PublicKey
): Promise<UserPassData | null> {
  try {
    const account = await program.account.userPass.fetch(userPassPDA);
    return account as unknown as UserPassData;
  } catch (error) {
    console.error('Error fetching user pass:', error);
    return null;
  }
}

export async function fetchAllPassCollections(program: Program): Promise<Array<{ publicKey: PublicKey; account: PassCollectionData }>> {
  try {
    const accounts = await program.account.passCollection.all();
    return accounts.map((item: any) => ({
      publicKey: item.publicKey,
      account: item.account as unknown as PassCollectionData,
    }));
  } catch (error) {
    console.error('Error fetching all pass collections:', error);
    return [];
  }
}

export async function fetchUserPasses(
  program: Program,
  ownerPubkey: PublicKey
): Promise<Array<{ publicKey: PublicKey; account: UserPassData }>> {
  try {
    const accounts = await program.account.userPass.all([
      {
        memcmp: {
          offset: 8,
          bytes: ownerPubkey.toBase58(),
        },
      },
    ]);
    return accounts.map((item: any) => ({
      publicKey: item.publicKey,
      account: item.account as unknown as UserPassData,
    }));
  } catch (error) {
    console.error('Error fetching user passes:', error);
    return [];
  }
}
