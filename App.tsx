import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ItineraryPlanner from './components/ItineraryPlanner';
import Blogs from './components/Blogs';
import SearchCallToAction from './components/SearchCallToAction';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import AnimatedBackground from './components/AnimatedBackground';
import { supabase } from './lib/supabase';

export interface User {
  id?: number;
  phone: string;
  name?: string;
  email?: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.phone) {
        const userPhone = session.user.phone;

        // User is authenticated, now fetch or create their profile.
        // This is the single source of truth for profile management.
        let { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', userPhone)
          .single();
        
        // Handle case where profile doesn't exist (new user)
        if (error && error.code === 'PGRST116') {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ phone: userPhone })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating user profile:", insertError.message);
            // Sign out the user if profile creation fails to avoid inconsistent state
            await supabase.auth.signOut();
            return;
          }
          userProfile = newUser;
        } else if (error) {
          console.error("Error fetching user profile:", error.message);
          return;
        }
        
        // At this point, we have a valid userProfile, either fetched or newly created.
        setCurrentUser(userProfile);
        setIsAuthModalOpen(false); // Auth is complete, close the modal.
        
        // If the profile is incomplete, prompt them to fill it out.
        if (userProfile && (!userProfile.name || !userProfile.email)) {
          setIsProfileModalOpen(true);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
    setCurrentUser(null);
  };

  const handleProfileSave = async (name: string, email: string) => {
    if (currentUser) {
      setIsProfileSaving(true);
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ name, email })
        .eq('phone', currentUser.phone)
        .select()
        .single();
      
      setIsProfileSaving(false);
      if (error) {
          console.error("Error updating profile:", error.message);
      } else {
          setCurrentUser(updatedUser);
          setIsProfileModalOpen(false);
      }
    }
  };

  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const handleOpenAuthModal = () => setIsAuthModalOpen(true);
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);
  
  const handleCloseProfileModal = () => setIsProfileModalOpen(false);

  const isSignedIn = !!currentUser;

  return (
    <div className="bg-brand-dark text-brand-text min-h-screen relative z-0">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header 
          isSignedIn={isSignedIn} 
          userName={currentUser?.name}
          userPhone={currentUser?.phone}
          onSignInClick={handleOpenAuthModal} 
          onSignOut={handleSignOut}
          onSearchClick={handleOpenSearch} 
        />
        <main>
          <Hero isSignedIn={isSignedIn} onSignInClick={handleOpenAuthModal} />
          {isSignedIn && (
            <>
              <Features />
              <ItineraryPlanner />
              <Blogs />
              <SearchCallToAction onSearchClick={handleOpenSearch} />
            </>
          )}
        </main>
        <Footer isSignedIn={isSignedIn} />
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={handleCloseProfileModal} 
        onSave={handleProfileSave}
        isSaving={isProfileSaving}
      />
    </div>
  );
};

export default App;