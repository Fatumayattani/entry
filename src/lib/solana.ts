import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Program } from '@coral-xyz/anchor';
import { Pass, VerificationResult } from '../types';
import {
  getProgram,
  getUserPassPDA,
  createPassCollection,
  purchasePass,
  verifyPass,
  fetchAllPassCollections,
  fetchUserPasses,
  fetchPassCollection,
  fetchUserPass,
  PassCollectionData,
  UserPassData,
} from './program';

export class EntryProgram {
  private program: Program | null = null;

  constructor(
    connection: Connection,
    wallet?: AnchorWallet
  ) {
    if (wallet) {
      this.program = getProgram(connection, wallet);
    }
  }

  private ensureProgram(): Program {
    if (!this.program) {
      throw new Error('Wallet not connected');
    }
    return this.program;
  }

  async createPass(
    _organizer: PublicKey,
    name: string,
    description: string,
    price: number,
    _currency: 'SOL' | 'USDC',
    _startTime: Date,
    endTime: Date,
    maxSupply: number,
    _transferable: boolean
  ): Promise<string> {
    const program = this.ensureProgram();

    const priceInLamports = price * LAMPORTS_PER_SOL;
    const validityPeriodInSeconds = Math.floor((endTime.getTime() - Date.now()) / 1000);

    const { tx } = await createPassCollection(
      program,
      name,
      description,
      priceInLamports,
      maxSupply,
      validityPeriodInSeconds > 0 ? validityPeriodInSeconds : 0
    );

    return tx;
  }

  async purchasePass(
    _buyer: PublicKey,
    passCollectionKey: PublicKey,
    organizerKey: PublicKey
  ): Promise<string> {
    const program = this.ensureProgram();
    const { tx } = await purchasePass(program, passCollectionKey, organizerKey);
    return tx;
  }

  async verifyPass(wallet: PublicKey, passCollectionKey?: PublicKey): Promise<VerificationResult> {
    const program = this.ensureProgram();

    if (passCollectionKey) {
      const [userPassPDA] = getUserPassPDA(passCollectionKey, wallet);
      const isValid = await verifyPass(program, userPassPDA, wallet);

      if (!isValid) {
        return { valid: false, reason: 'Pass not found or invalid' };
      }

      const passData = await fetchPassCollection(program, passCollectionKey);
      const userPassData = await fetchUserPass(program, userPassPDA);

      if (!passData || !userPassData) {
        return { valid: false, reason: 'Pass data not found' };
      }

      const pass = this.convertToPass(passCollectionKey, passData, userPassData);
      return { valid: true, pass };
    }

    const userPasses = await fetchUserPasses(program, wallet);

    for (const { publicKey, account } of userPasses) {
      const isValid = await verifyPass(program, publicKey, wallet);
      if (isValid && account.isActive) {
        const passData = await fetchPassCollection(program, account.passCollection);
        if (passData) {
          const pass = this.convertToPass(account.passCollection, passData, account);
          return { valid: true, pass };
        }
      }
    }

    return { valid: false, reason: 'No active passes found' };
  }

  async getAllPasses(): Promise<Pass[]> {
    const program = this.ensureProgram();
    const collections = await fetchAllPassCollections(program);

    return collections.map(({ publicKey, account }) => ({
      id: publicKey.toString(),
      mint: publicKey.toString(),
      name: account.name,
      description: account.description,
      price: account.price.toNumber() / LAMPORTS_PER_SOL,
      currency: 'SOL' as const,
      startTime: Date.now(),
      endTime: account.validityPeriod.toNumber() > 0
        ? account.createdAt.toNumber() * 1000 + account.validityPeriod.toNumber() * 1000
        : Date.now() + 365 * 24 * 60 * 60 * 1000,
      maxSupply: account.maxSupply.toNumber(),
      currentSupply: account.currentSupply.toNumber(),
      transferable: false,
      organizer: account.organizer.toString(),
      imageUrl: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400`,
    }));
  }

  async getPassById(passId: string): Promise<Pass | undefined> {
    const program = this.ensureProgram();
    try {
      const passCollectionKey = new PublicKey(passId);
      const passData = await fetchPassCollection(program, passCollectionKey);

      if (!passData) return undefined;

      return {
        id: passId,
        mint: passId,
        name: passData.name,
        description: passData.description,
        price: passData.price.toNumber() / LAMPORTS_PER_SOL,
        currency: 'SOL' as const,
        startTime: Date.now(),
        endTime: passData.validityPeriod.toNumber() > 0
          ? passData.createdAt.toNumber() * 1000 + passData.validityPeriod.toNumber() * 1000
          : Date.now() + 365 * 24 * 60 * 60 * 1000,
        maxSupply: passData.maxSupply.toNumber(),
        currentSupply: passData.currentSupply.toNumber(),
        transferable: false,
        organizer: passData.organizer.toString(),
        imageUrl: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400`,
      };
    } catch {
      return undefined;
    }
  }

  async getUserPassIds(wallet: PublicKey): Promise<string[]> {
    const program = this.ensureProgram();
    const userPasses = await fetchUserPasses(program, wallet);
    return userPasses.map(({ account }) => account.passCollection.toString());
  }

  private convertToPass(
    publicKey: PublicKey,
    passData: PassCollectionData,
    userPassData: UserPassData
  ): Pass {
    return {
      id: publicKey.toString(),
      mint: publicKey.toString(),
      name: passData.name,
      description: passData.description,
      price: passData.price.toNumber() / LAMPORTS_PER_SOL,
      currency: 'SOL' as const,
      startTime: userPassData.purchasedAt.toNumber() * 1000,
      endTime: userPassData.expiresAt.toNumber() === Number.MAX_SAFE_INTEGER
        ? Date.now() + 365 * 24 * 60 * 60 * 1000
        : userPassData.expiresAt.toNumber() * 1000,
      maxSupply: passData.maxSupply.toNumber(),
      currentSupply: passData.currentSupply.toNumber(),
      transferable: false,
      organizer: passData.organizer.toString(),
      imageUrl: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400`,
    };
  }
}
