import { useState } from 'react';
import { SolanaWalletProvider } from './contexts/WalletProvider';
import Landing from './pages/Landing';
import Organizer from './pages/Organizer';
import Browse from './pages/Browse';

type Page = 'landing' | 'organizer' | 'browse' | 'verifier';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <SolanaWalletProvider>
      {currentPage === 'landing' && <Landing onNavigate={handleNavigate} />}
      {currentPage === 'organizer' && <Organizer onNavigate={handleNavigate} />}
      {currentPage === 'browse' && <Browse onNavigate={handleNavigate} />}
    </SolanaWalletProvider>
  );
}

export default App;
