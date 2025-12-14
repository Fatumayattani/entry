import { Ticket, ShieldCheck, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WorkingCharacter, RelaxingCharacter, WalletCharacter } from '../components/Illustrations';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-entry-cream">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-entry-teal backdrop-blur-lg border-b border-entry-teal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Ticket className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">Entry</span>
            </div>
            <div className="flex items-center gap-4">
              {connected && (
                <>
                  <button
                    onClick={() => onNavigate('browse')}
                    className="hidden sm:block text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Browse
                  </button>
                  <button
                    onClick={() => onNavigate('organizer')}
                    className="hidden sm:block text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Create Pass
                  </button>
                  <button
                    onClick={() => onNavigate('verifier')}
                    className="hidden sm:block text-white/90 hover:text-white transition-colors font-medium"
                  >
                    Verify
                  </button>
                </>
              )}
              <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg !transition-all" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="relative overflow-hidden py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-6">
                <div className="bg-white border-3 border-black rounded-3xl p-8 shadow-lg relative">
                  <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 leading-tight">
                    Don't use traditional tickets.
                    <br />
                    <span className="text-entry-pink">That's outdated!</span>
                  </h2>
                </div>

                <div className="relative">
                  <div className="w-full aspect-square max-w-md mx-auto">
                    <WorkingCharacter />
                  </div>
                  <div className="absolute top-4 left-4 sm:left-8 bg-white border-3 border-black rounded-2xl p-4 shadow-lg max-w-xs">
                    <p className="text-lg font-medium text-black">
                      Instead of selling tickets...
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 lg:mt-12">
                <div className="relative">
                  <div className="w-full aspect-square max-w-md mx-auto">
                    <RelaxingCharacter />
                  </div>
                  <div className="absolute bottom-4 right-4 sm:right-8 bg-white border-3 border-black rounded-2xl p-4 shadow-lg max-w-xs">
                    <p className="text-lg font-medium text-black">
                      ...use your wallet as your pass!
                    </p>
                  </div>
                </div>

                <div className="bg-white border-3 border-black rounded-3xl p-8 shadow-lg">
                  <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 leading-tight">
                    Your Wallet Is
                    <br />
                    <span className="bg-gradient-to-r from-entry-yellow to-entry-pink text-transparent bg-clip-text">
                      Your Access Pass
                    </span>
                  </h2>
                  <p className="text-lg text-gray-700 mb-6">
                    Entry transforms your Phantom wallet into a digital membership pass. Buy, hold, and verify access instantly on the blockchain.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="relative w-48 h-48">
                <WalletCharacter />
              </div>
              <div className="bg-white border-3 border-black rounded-3xl p-8 shadow-lg text-center max-w-2xl">
                {connected ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-black mb-4">Ready to get started?</h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => onNavigate('browse')}
                        className="px-8 py-4 bg-entry-yellow hover:bg-entry-yellow-dark text-black font-bold rounded-lg shadow-lg shadow-entry-yellow/50 transition-all transform hover:scale-105"
                      >
                        Browse Passes
                      </button>
                      <button
                        onClick={() => onNavigate('organizer')}
                        className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-lg border-2 border-black transition-all"
                      >
                        Create Pass
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-black mb-2">Connect your wallet to begin!</h3>
                    <p className="text-gray-600 mb-4">
                      Your Phantom wallet becomes your membership pass
                    </p>
                    <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg !px-8 !py-4 !text-lg !transition-all !shadow-lg !shadow-entry-yellow/50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                How Entry Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple, secure, and instant access management powered by blockchain
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border-2 border-entry-teal rounded-xl p-8 hover:border-entry-pink transition-colors shadow-lg">
                <div className="w-14 h-14 rounded-lg bg-entry-yellow flex items-center justify-center mb-6">
                  <Wallet className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Connect Wallet</h3>
                <p className="text-gray-700 leading-relaxed">
                  Link your Phantom wallet in one click. Your wallet becomes your identity and access pass.
                </p>
              </div>

              <div className="bg-white border-2 border-entry-teal rounded-xl p-8 hover:border-entry-pink transition-colors shadow-lg">
                <div className="w-14 h-14 rounded-lg bg-entry-pink flex items-center justify-center mb-6">
                  <Ticket className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Buy Pass</h3>
                <p className="text-gray-700 leading-relaxed">
                  Browse available passes and purchase with SOL or USDC. The pass appears instantly in your wallet.
                </p>
              </div>

              <div className="bg-white border-2 border-entry-teal rounded-xl p-8 hover:border-entry-pink transition-colors shadow-lg">
                <div className="w-14 h-14 rounded-lg bg-entry-blue flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Verify Access</h3>
                <p className="text-gray-700 leading-relaxed">
                  Verifiers check your wallet ownership on-chain. Access granted or denied instantly without personal info.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-entry-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-entry-pink/20 to-entry-blue/20 border-2 border-entry-teal rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Create your first membership pass or browse available passes now
              </p>
              {connected ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => onNavigate('organizer')}
                    className="px-8 py-4 bg-entry-yellow hover:bg-entry-yellow-dark text-black font-bold rounded-lg transition-all shadow-lg"
                  >
                    Create Pass
                  </button>
                  <button
                    onClick={() => onNavigate('browse')}
                    className="px-8 py-4 bg-entry-teal hover:bg-entry-teal-dark text-white font-bold rounded-lg transition-all"
                  >
                    Browse Passes
                  </button>
                </div>
              ) : (
                <WalletMultiButton className="!bg-entry-yellow hover:!bg-entry-yellow-dark !text-black !font-bold !rounded-lg !px-8 !py-4 !text-lg" />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-entry-teal border-t border-entry-teal-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">Entry</span>
            </div>
            <p className="text-white/80 text-sm">
              Blockchain-powered membership passes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
