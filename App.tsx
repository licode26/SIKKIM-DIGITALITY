import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ItineraryPlanner from './components/ItineraryPlanner';
import Blogs from './components/Blogs';
import SearchCallToAction from './components/SearchCallToAction';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import AnimatedBackground from './components/AnimatedBackground';
import VirtualTours from './components/VirtualTours';

export type Page = 'home' | 'virtual-tours';

const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-brand-dark text-brand-text min-h-screen relative z-0">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header
          onSearchClick={handleOpenSearch}
          onNavigate={navigateTo}
          currentPage={currentPage}
        />
        <main>
          {currentPage === 'home' && (
            <>
              <Hero />
              <>
                <Features onNavigate={navigateTo} />
                <ItineraryPlanner />
                <Blogs />
                <SearchCallToAction onSearchClick={handleOpenSearch} />
              </>
            </>
          )}
          {currentPage === 'virtual-tours' && <VirtualTours />}
        </main>
        <Footer />
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} />
    </div>
  );
};

export default App;