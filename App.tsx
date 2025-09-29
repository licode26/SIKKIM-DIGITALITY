import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from './database';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { supabase } from './lib/supabase';

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

export type Page =
  | 'home'
  | 'virtual-tours'
  | 'audio-guide'
  | 'interactive-map'
  | 'cultural-calendar'
  | 'digital-archives'
  | 'local-services';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
}

const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        // Check for profile in Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.uid)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
          console.error('Error fetching profile:', error);
        }

        if (profile) {
          setUserProfile(profile);
          setIsProfileModalOpen(false);
        } else {
          // New user, open profile modal
          setIsProfileModalOpen(true);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);
  
  const handleGoogleSignIn = async () => {
      try {
          await signInWithPopup(auth, googleProvider);
      } catch (error) {
          console.error("Google Sign-In Error:", error);
      }
  };

  const handleSignOut = async () => {
      try {
          await signOut(auth);
          setCurrentPage('home');
      } catch (error) {
          console.error("Sign-Out Error:", error);
      }
  };
  
  const handleSaveProfile = async (name: string, email: string) => {
    if (!user) return;
    setIsSavingProfile(true);
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.uid, full_name: name, email: email }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      setUserProfile(data as UserProfile);
      setIsProfileModalOpen(false);
    }
    setIsSavingProfile(false);
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
          onSignIn={handleGoogleSignIn}
          onSignOut={handleSignOut}
          onSearchClick={handleOpenSearch}
          onNavigate={navigateTo}
          currentPage={currentPage}
        />
        <main>
          {!user ? (
             <Hero onSignIn={handleGoogleSignIn} />
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
        onClose={() => { if(userProfile) setIsProfileModalOpen(false) }}
        onSave={handleSaveProfile}
        isSaving={isSavingProfile}
      />
    </div>
  );
};

export default App;
