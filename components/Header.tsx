import React, { useState } from 'react';
// FIX: Updated Firebase import for v8 compatibility to correctly reference the User type.
// FIX: Switched to Firebase v8 compat import to resolve type error for firebase.User.
import type firebase from 'firebase/compat/app';
import {
  HomeIcon,
  CameraIcon,
  MapIcon,
  CalendarIcon,
  HeadphonesIcon,
  ArchiveIcon,
  UsersIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
} from './Icons';
import type { Page } from '../App';

interface NavButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  disabled?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ onClick, icon, children, isActive, disabled }) => {
  if (disabled) {
    return (
      <span className="flex items-center space-x-2 text-brand-text-secondary/50 cursor-not-allowed px-3 py-2 text-sm font-medium">
        {icon}
        <span>{children}</span>
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-brand-gray text-white'
          : 'text-brand-text-secondary hover:text-white hover:bg-brand-gray/50'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

interface HeaderProps {
  user: firebase.User | null;
  onAuthClick: () => void;
  onSignOut: () => void;
  onSearchClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onSignOut, onSearchClick, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems: { page: Page; icon: React.ReactNode; text: string; disabled?: boolean }[] = [
    { page: 'home', icon: <HomeIcon />, text: 'Home' },
    { page: 'virtual-tours', icon: <CameraIcon />, text: 'Virtual Tours', disabled: !user },
    { page: 'interactive-map', icon: <MapIcon />, text: 'Interactive Map', disabled: !user },
    { page: 'cultural-calendar', icon: <CalendarIcon />, text: 'Cultural Calendar', disabled: !user },
    { page: 'audio-guide', icon: <HeadphonesIcon />, text: 'Talk to Guide', disabled: !user },
    { page: 'digital-archives', icon: <ArchiveIcon />, text: 'Digital Archives', disabled: !user },
    { page: 'local-services', icon: <UsersIcon />, text: 'Local Services', disabled: !user },
  ];

  const userDropdownContent = (
    <div className="absolute right-0 mt-2 w-56 bg-brand-gray rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 animate-fade-in z-50">
      <div className="px-4 py-3">
        <p className="text-sm text-white font-semibold truncate">{user?.displayName || 'Anonymous User'}</p>
        <p className="text-sm text-brand-text-secondary truncate">{user?.email || 'No email provided'}</p>
      </div>
      <div className="border-t border-brand-light-gray/50"></div>
      <button 
        onClick={() => { onSignOut(); setIsUserMenuOpen(false); }} 
        className="block w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-light-gray hover:text-white transition-colors"
      >
        Sign Out
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-lg border-b border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('home')} className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-brand-teal rounded-md flex items-center justify-center text-brand-dark font-bold text-lg">S</span>
              <span className="text-xl font-bold text-white">Sikkim Digital</span>
            </button>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-1">
             {navItems.map(item => (
                 <NavButton 
                    key={item.text}
                    onClick={() => onNavigate(item.page)} 
                    icon={item.icon} 
                    isActive={currentPage === item.page}
                    disabled={item.disabled}
                >
                    {item.text}
                 </NavButton>
               )
             )}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <button onClick={onSearchClick} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
                  <SearchIcon />
                </button>
                <div className="relative">
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)} className="flex items-center">
                    <img src={user.photoURL || `https://i.pravatar.cc/40?u=${user.uid}`} alt="User avatar" className="w-8 h-8 rounded-full" />
                  </button>
                  {isUserMenuOpen && userDropdownContent}
                </div>
              </>
            ) : (
              <button onClick={onAuthClick} className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-brand-dark border border-brand-light-gray text-white rounded-md hover:bg-brand-gray transition-colors">
                <span>Sign In / Sign Up</span>
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)} className="flex items-center">
                  <img src={user.photoURL || `https://i.pravatar.cc/40?u=${user.uid}`} alt="User avatar" className="w-8 h-8 rounded-full" />
                </button>
                {isUserMenuOpen && userDropdownContent}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-brand-text-secondary hover:text-white hover:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-teal"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-brand-dark border-b border-brand-gray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navItems.map(item => (
                <button
                    key={item.text}
                    onClick={() => {
                        if (!item.disabled) {
                            onNavigate(item.page);
                            setIsMenuOpen(false);
                        }
                    }}
                    disabled={item.disabled}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${item.disabled ? 'text-brand-text-secondary/50 cursor-not-allowed' : currentPage === item.page ? 'bg-brand-gray text-white' : 'text-brand-text-secondary hover:text-white hover:bg-brand-gray'}`}
                >
                    {item.icon}
                    <span>{item.text}</span>
                </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-brand-gray">
            <div className="px-5">
              {user ? (
                <div className="space-y-2">
                  <button onClick={() => { onSearchClick(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center p-2 rounded-md text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
                    <SearchIcon /> <span className="ml-2">Search</span>
                  </button>
                  <button onClick={() => { onSignOut(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center p-2 rounded-md text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center p-2 rounded-md text-white bg-brand-gray hover:bg-brand-light-gray transition-colors">
                  <span>Sign In / Sign Up</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;