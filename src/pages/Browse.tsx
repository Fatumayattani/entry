import { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, Clock, Users, ShoppingCart, Loader2, CheckCircle, Tag } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { EntryProgram } from '../lib/solana';
import { Pass } from '../types';

interface BrowseProps {
  onNavigate: (page: string) => void;
}

export default function Browse({ onNavigate }: BrowseProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [passes, setPasses] = useState<Pass[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (connected && wallet) {
      loadPasses();
    }
  }, [connected, wallet]);

  const loadPasses = async () => {
    if (!wallet) return;
    try {
      const program = new EntryProgram(connection, wallet as any);
      const allPasses = await program.getAllPasses();
      setPasses(allPasses);
    } catch (err) {
      console.error('Error loading passes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pass: Pass) => {
    if (!connected || !publicKey || !wallet) {
      setError('Please connect your wallet');
      return;
    }

    setPurchasing(pass.id);
    setError('');

    try {
      const program = new EntryProgram(connection, wallet as any);
      const passCollectionKey = new PublicKey(pass.id);
      const organizerKey = new PublicKey(pass.organizer);

      await program.purchasePass(publicKey, passCollectionKey, organizerKey);

      setSuccess(pass.id);
      loadPasses();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isPassActive = (pass: Pass) => {
    const now = Date.now();
    return now >= pass.startTime && now <= pass.endTime;
  };

  const isPassSoldOut = (pass: Pass) => {
    return pass.currentSupply >= pass.maxSupply;
  };

  const getPassStatus = (pass: Pass) => {
    const now = Date.now();
    if (isPassSoldOut(pass)) return { text: 'Sold Out', color: 'text-entry-pink' };
    if (now < pass.startTime) return { text: 'Coming Soon', color: 'text-entry-yellow-dark' };
    if (now > pass.endTime) return { text: 'Ended', color: 'text-gray-500' };
    return { text: 'Active', color: 'text-entry-teal' };
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              Browse Passes
            </h1>
            <p className="text-lg text-gray-700">
              Discover and purchase membership passes
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-entry-pink/20 border-2 border-entry-pink rounded-lg text-red-600 text-center font-semibold">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-entry-teal animate-spin" />
            </div>
          ) : passes.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white border-2 border-entry-teal rounded-xl p-12 text-center shadow-lg">
              <Ticket className="w-16 h-16 text-entry-teal mx-auto mb-4" />
              <h2 className="text-xl font-bold text-black mb-3">No Passes Available</h2>
              <p className="text-gray-700 mb-6">
                Be the first to create a pass for your event or membership
              </p>
              <button
                onClick={() => onNavigate('organizer')}
                className="px-6 py-3 bg-entry-yellow hover:bg-entry-yellow-dark text-black font-bold rounded-lg transition-all shadow-lg"
              >
                Create Pass
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passes.map((pass) => {
                const status = getPassStatus(pass);
                const canPurchase = isPassActive(pass) && !isPassSoldOut(pass);

                return (
                  <div
                    key={pass.id}
                    className="bg-white border-2 border-entry-teal rounded-xl overflow-hidden hover:border-entry-pink transition-all shadow-lg"
                  >
                    <div className="aspect-video bg-gradient-to-br from-entry-teal/30 to-entry-blue/30 flex items-center justify-center border-b-2 border-entry-teal">
                      <Ticket className="w-16 h-16 text-entry-teal" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-black flex-1">
                          {pass.name}
                        </h3>
                        <span className={`text-sm font-bold ${status.color}`}>
                          {status.text}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {pass.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-black">
                          <Tag className="w-4 h-4 text-entry-yellow-dark" />
                          <span className="font-bold">
                            {pass.price} {pass.currency}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-entry-teal" />
                          <span>
                            {formatDate(pass.startTime)} - {formatDate(pass.endTime)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-entry-teal" />
                          <span>
                            {pass.currentSupply} / {pass.maxSupply} sold
                          </span>
                        </div>
                      </div>

                      {success === pass.id ? (
                        <button
                          disabled
                          className="w-full px-4 py-3 bg-entry-teal text-white font-bold rounded-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Purchased!
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(pass)}
                          disabled={!connected || !canPurchase || purchasing === pass.id}
                          className="w-full px-4 py-3 bg-entry-yellow hover:bg-entry-yellow-dark disabled:bg-gray-300 disabled:text-gray-500 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          {purchasing === pass.id ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : !connected ? (
                            'Connect Wallet'
                          ) : !canPurchase ? (
                            'Unavailable'
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Buy Pass
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
