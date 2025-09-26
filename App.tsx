import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Blogs from './components/Blogs';
import SearchCallToAction from './components/SearchCallToAction';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import * as db from './database';

export interface User {
  phone: string;
  name?: string;
  email?: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    // Initialize the database and check for an active session
    const init = async () => {
      await db.initDB();
      setIsDbReady(true);
      const userPhone = sessionStorage.getItem('sikkim-digital-session');
      if (userPhone) {
        const user = await db.getUser(userPhone);
        if (user) {
          setCurrentUser(user);
        }
      }
    };
    init();
  }, []);

  const handleSignIn = async (phone: string) => {
    setIsAuthModalOpen(false);
    const user = await db.getUser(phone);

    // If user exists and has a name, they are fully registered
    if (user && user.name) {
      sessionStorage.setItem('sikkim-digital-session', user.phone);
      setCurrentUser(user);
    } else {
      // New user or incomplete profile.
      // If the user doesn't exist at all, create a partial profile.
      const userToProcess = user || { phone };
      if (!user) {
        await db.saveUser(userToProcess);
      }
      
      sessionStorage.setItem('sikkim-digital-session', userToProcess.phone);
      setCurrentUser(userToProcess);
      setIsProfileModalOpen(true); // Open profile modal to get name/email
    }
  };
  
  const handleSignOut = () => {
    sessionStorage.removeItem('sikkim-digital-session');
    setCurrentUser(null);
  };

  const handleProfileSave = async (name: string, email: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, name, email };
      await db.saveUser(updatedUser);
      setCurrentUser(updatedUser);
      setIsProfileModalOpen(false);
    }
  };

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const handleOpenAuthModal = () => setIsAuthModalOpen(true);
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);
  
  const handleCloseProfileModal = () => setIsProfileModalOpen(false);

  const isSignedIn = !!currentUser?.name; // Consider user signed in only if they have a name

  if (!isDbReady) {
    // You can render a loading spinner here while DB initializes
    return <div className="bg-brand-dark text-brand-text min-h-screen flex items-center justify-center">Initializing...</div>;
  }

  return (
    <div className="bg-brand-dark text-brand-text min-h-screen">
      <Header 
        isSignedIn={isSignedIn} 
        userName={currentUser?.name}
        onSignInClick={handleOpenAuthModal} 
        onSignOut={handleSignOut}
        onSearchClick={handleOpenSearch} 
      />
      <main>
        <Hero isSignedIn={isSignedIn} onSignInClick={handleOpenAuthModal} />
        {isSignedIn && (
          <>
            <Features />
            <Blogs />
            <SearchCallToAction onSearchClick={handleOpenSearch} />
          </>
        )}
      </main>
      <Footer isSignedIn={isSignedIn} />
      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} onSignIn={handleSignIn} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} onSave={handleProfileSave} />
    </div>
  );
};

export default App;