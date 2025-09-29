import React, { useState, useEffect } from 'react';
import { auth } from './database';
// Import the full firebase namespace to access auth persistence types.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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
import AudioGuide from './components/AudioGuide';
import InteractiveMap from './components/InteractiveMap';
import CulturalCalendar from './components/CulturalCalendar';
import DigitalArchives from './components/DigitalArchives';
import LocalServices from './components/LocalServices';
import ProfileModal from './components/ProfileModal';
import { SpinnerIcon } from './components/Icons';
import EmailAuthModal from './components/EmailAuthModal';

export type Page =
  | 'home'
  | 'virtual-tours'
  | 'audio-guide'
  | 'interactive-map'
  | 'cultural-calendar'
  | 'digital-archives'
  | 'local-services';

const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  useEffect(() => {
    // This function sets up auth persistence and listeners.
    const initializeAuth = async () => {
      try {
        // Set persistence to 'none' (in-memory) to support environments where web storage is not available.
        // This avoids the 'auth/invalid-persistence-type' error by using the explicit string value.
        await auth.setPersistence('none');
      } catch (error) {
          console.error("Firebase Auth: Could not set persistence.", error);
      }

      // The onAuthStateChanged listener is now attached after persistence is set.
      return auth.onAuthStateChanged(async (currentUser) => {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          // If user exists but has no display name, prompt them to set one.
          if (!currentUser.displayName) {
            setIsProfileModalOpen(true);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    };

    const unsubscribePromise = initializeAuth();

    // The cleanup function handles the promise returned by our async setup function.
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, []);

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);
  const handleOpenAuth = () => setIsAuthModalOpen(true);
  const handleCloseAuth = () => setIsAuthModalOpen(false);
  
  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (userCredential.user) {
            await userCredential.user.updateProfile({
                displayName: name,
            });
            // The onAuthStateChanged listener will handle the rest of the logic,
            // including setting the user state and closing the auth modal.
        }
    } catch (error) {
        console.error("Sign-Up Error:", error);
        throw error; // Re-throw to be caught in the modal
    }
  };

  const handleSignIn = async (email: string, password: string) => {
     try {
        await auth.signInWithEmailAndPassword(email, password);
        // onAuthStateChanged will handle UI updates
     } catch (error) {
        console.error("Sign-In Error:", error);
        throw error; // Re-throw to be caught in the modal
     }
  };

  const handleSignOut = async () => {
      try {
          await auth.signOut();
          setCurrentPage('home');
      } catch (error) {
          console.error("Sign-Out Error:", error);
      }
  };
  
  const handleSaveProfile = async (name: string) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
        await user.updateProfile({ displayName: name });
        // Update state with the latest from Firebase auth to reflect the change.
        setUser(auth.currentUser);
        setIsProfileModalOpen(false);
    } catch (error) {
        console.error('Error saving profile:', error);
        // You could set an error state here to show in the modal.
    } finally {
        setIsSavingProfile(false);
    }
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
        <div className="bg-brand-dark text-brand-text min-h-screen flex items-center justify-center">
            <SpinnerIcon />
        </div>
    );
  }

  return (
    <div className="bg-brand-dark text-brand-text min-h-screen relative z-0">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header
          user={user}
          onAuthClick={handleOpenAuth}
          onSignOut={handleSignOut}
          onSearchClick={handleOpenSearch}
          onNavigate={navigateTo}
          currentPage={currentPage}
        />
        <main>
          {!user ? (
             <Hero onAuthClick={handleOpenAuth} />
          ) : (
            <>
              {currentPage === 'home' && (
                <>
                  <Hero user={user} />
                  <Features onNavigate={navigateTo} />
                  <ItineraryPlanner />
                  <Blogs />
                  <SearchCallToAction onSearchClick={handleOpenSearch} />
                </>
              )}
              {currentPage === 'virtual-tours' && <VirtualTours />}
              {currentPage === 'audio-guide' && <AudioGuide />}
              {currentPage === 'interactive-map' && <InteractiveMap />}
              {currentPage === 'cultural-calendar' && <CulturalCalendar />}
              {currentPage === 'digital-archives' && <DigitalArchives />}
              {currentPage === 'local-services' && <LocalServices />}
            </>
          )}
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
      {user && <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} />}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => { if (user?.displayName) setIsProfileModalOpen(false) }}
        onSave={handleSaveProfile}
        isSaving={isSavingProfile}
      />
      <EmailAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
      />
    </div>
  );
};

export default App;