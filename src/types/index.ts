export interface Pass {
  id: string;
  mint: string;
  name: string;
  description: string;
  price: number;
  currency: 'SOL' | 'USDC';
  startTime: number;
  endTime: number;
  maxSupply: number;
  currentSupply: number;
  transferable: boolean;
  organizer: string;
  imageUrl?: string;
}

export interface PassMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface VerificationResult {
  valid: boolean;
  pass?: Pass;
  reason?: string;
}
