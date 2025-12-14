import { useState } from 'react';
import { ArrowLeft, Ticket, CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { EntryProgram } from '../lib/solana';
import { VerificationResult } from '../types';

interface VerifierProps {
  onNavigate: (page: string) => void;
}

export default function Verifier({ onNavigate }: VerifierProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!connected || !publicKey || !wallet) {
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      const program = new EntryProgram(connection, wallet as any);
      const verification = await program.verifyPass(publicKey);
      setResult(verification);
    } catch (err) {
      setResult({
        valid: false,
        reason: 'Verification failed. Please try again.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-entry-cream">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-entry-teal backdrop-blur-lg border-b border-entry-teal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Ticket className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">Entry</span>
            </div>
            <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg" />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-entry-blue mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              Verify Access
            </h1>
            <p className="text-lg text-gray-700">
              Check wallet ownership and pass validity on-chain
            </p>
          </div>

          {!connected ? (
            <div className="bg-white border-2 border-entry-teal rounded-xl p-12 text-center shadow-lg">
              <Ticket className="w-16 h-16 text-entry-teal mx-auto mb-4" />
              <h2 className="text-xl font-bold text-black mb-3">Connect Wallet to Verify</h2>
              <p className="text-gray-700 mb-6">
                Connect your Phantom wallet to check if you have a valid pass
              </p>
              <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg !mx-auto" />
            </div>
          ) : !result ? (
            <div className="bg-white border-2 border-entry-teal rounded-xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-entry-blue mx-auto mb-6 flex items-center justify-center">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-black mb-3">Ready to Verify</h2>
              <p className="text-gray-700 mb-8">
                Click the button below to check your wallet for valid passes
              </p>

              <button
                onClick={handleVerify}
                disabled={verifying}
                className="px-8 py-4 bg-entry-yellow hover:bg-entry-yellow-dark disabled:bg-gray-300 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-entry-yellow/50 disabled:shadow-none"
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Verify Pass
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t-2 border-entry-teal">
                <p className="text-sm text-gray-600 font-medium">
                  Connected Wallet: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                </p>
              </div>
            </div>
          ) : result.valid ? (
            <div className="bg-gradient-to-br from-entry-teal/20 to-entry-blue/20 border-2 border-entry-teal rounded-xl p-12 text-center animate-in shadow-lg">
              <div className="w-24 h-24 rounded-full bg-entry-yellow mx-auto mb-6 flex items-center justify-center shadow-lg shadow-entry-yellow/50">
                <CheckCircle className="w-14 h-14 text-black" />
              </div>

              <h2 className="text-3xl font-bold text-black mb-2">Access Granted</h2>
              <p className="text-entry-teal text-lg font-bold mb-8">Valid pass found in wallet</p>

              {result.pass && (
                <div className="bg-white rounded-lg p-6 mb-8 text-left border-2 border-entry-teal">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-entry-teal/30 to-entry-blue/30 flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-8 h-8 text-entry-teal" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-2">{result.pass.name}</h3>
                      <p className="text-gray-700 text-sm mb-3">{result.pass.description}</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          Valid until: <span className="text-black font-bold">{formatDate(result.pass.endTime)}</span>
                        </p>
                        <p className="text-gray-600">
                          Pass ID: <span className="text-black font-mono font-bold">{result.pass.id.slice(0, 16)}...</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-entry-teal hover:bg-entry-teal-dark text-white font-bold rounded-lg transition-all shadow-md"
              >
                Verify Another Wallet
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-entry-pink/20 to-red-500/20 border-2 border-entry-pink rounded-xl p-12 text-center animate-in shadow-lg">
              <div className="w-24 h-24 rounded-full bg-entry-pink mx-auto mb-6 flex items-center justify-center shadow-lg shadow-entry-pink/50">
                <XCircle className="w-14 h-14 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-black mb-2">Access Denied</h2>
              <p className="text-red-600 text-lg font-bold mb-8">
                {result.reason || 'No valid pass found'}
              </p>

              <div className="bg-white rounded-lg p-6 mb-8 text-left border-2 border-entry-pink">
                <h3 className="text-black font-bold mb-3">Possible Reasons:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-entry-pink mt-1 font-bold">•</span>
                    <span>No pass found in this wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-entry-pink mt-1 font-bold">•</span>
                    <span>Pass has expired</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-entry-pink mt-1 font-bold">•</span>
                    <span>Pass is not active yet</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-entry-teal hover:bg-entry-teal-dark text-white font-bold rounded-lg transition-all shadow-md"
                >
                  Try Again
                </button>
                <button
                  onClick={() => onNavigate('browse')}
                  className="px-6 py-3 bg-entry-yellow hover:bg-entry-yellow-dark text-black font-bold rounded-lg transition-all shadow-md"
                >
                  Browse Passes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
