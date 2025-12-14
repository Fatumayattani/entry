import { useState } from 'react';
import { ArrowLeft, Ticket, Loader2, CheckCircle, Calendar, DollarSign, Users, Lock } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { EntryProgram } from '../lib/solana';

interface OrganizerProps {
  onNavigate: (page: string) => void;
}

export default function Organizer({ onNavigate }: OrganizerProps) {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'SOL' as 'SOL' | 'USDC',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    maxSupply: '',
    transferable: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const program = new EntryProgram(connection, wallet as any);

      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      await program.createPass(
        publicKey,
        formData.name,
        formData.description,
        parseFloat(formData.price),
        formData.currency,
        startDateTime,
        endDateTime,
        parseInt(formData.maxSupply),
        formData.transferable
      );

      setSuccess(true);
      setTimeout(() => {
        onNavigate('browse');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pass');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">
              Create Membership Pass
            </h1>
            <p className="text-lg text-gray-700">
              Set up your event or membership pass on the blockchain
            </p>
          </div>

          {!connected ? (
            <div className="bg-white border-2 border-entry-teal rounded-xl p-12 text-center shadow-lg">
              <Ticket className="w-16 h-16 text-entry-teal mx-auto mb-4" />
              <h2 className="text-xl font-bold text-black mb-3">Connect Your Wallet</h2>
              <p className="text-gray-700 mb-6">
                You need to connect your wallet to create passes
              </p>
              <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg !mx-auto" />
            </div>
          ) : success ? (
            <div className="bg-white border-2 border-entry-teal rounded-xl p-12 text-center shadow-lg">
              <CheckCircle className="w-16 h-16 text-entry-teal mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-black mb-3">Pass Created Successfully!</h2>
              <p className="text-gray-700 mb-6">
                Your pass is now live on the blockchain. Redirecting to browse page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-entry-teal rounded-xl p-6 sm:p-8 space-y-6 shadow-lg">
              <div>
                <label className="flex items-center gap-2 text-black font-bold mb-2">
                  <Ticket className="w-4 h-4 text-entry-teal" />
                  Pass Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Summer Music Festival 2024"
                  className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-black font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describe what this pass grants access to..."
                  className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-black font-bold mb-2">
                    <DollarSign className="w-4 h-4 text-entry-yellow-dark" />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.5"
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-black font-bold mb-2">
                    <Calendar className="w-4 h-4 text-entry-blue-dark" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-black font-bold mb-2">
                    <Calendar className="w-4 h-4 text-entry-blue-dark" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-black font-bold mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-black font-bold mb-2">
                  <Users className="w-4 h-4 text-entry-pink" />
                  Maximum Supply
                </label>
                <input
                  type="number"
                  name="maxSupply"
                  value={formData.maxSupply}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="100"
                  className="w-full px-4 py-3 bg-white border-2 border-entry-teal rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-entry-pink focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-entry-cream rounded-lg border-2 border-entry-teal">
                <input
                  type="checkbox"
                  id="transferable"
                  name="transferable"
                  checked={formData.transferable}
                  onChange={handleChange}
                  className="w-5 h-5 text-entry-teal bg-white border-entry-teal rounded focus:ring-2 focus:ring-entry-pink"
                />
                <label htmlFor="transferable" className="flex items-center gap-2 text-black font-bold cursor-pointer">
                  <Lock className="w-4 h-4 text-entry-teal" />
                  Allow pass transfers between wallets
                </label>
              </div>

              {error && (
                <div className="p-4 bg-entry-pink/20 border-2 border-entry-pink rounded-lg text-red-600 font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-entry-yellow hover:bg-entry-yellow-dark disabled:bg-gray-300 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-entry-yellow/50 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Pass...
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5" />
                    Create Pass
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
