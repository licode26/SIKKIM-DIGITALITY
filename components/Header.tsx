import React, { useState, useEffect, useRef } from 'react';
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
  UserIcon,
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
  isSignedIn: boolean;
  userName?: string;
  userPhone?: string;
  onSignInClick: () => void;
  onSignOut: () => void;
  onSearchClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ isSignedIn, userName, userPhone, onSignInClick, onSignOut, onSearchClick, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navItems = [
    { page: 'home', icon: <HomeIcon />, text: 'Home' },
    { page: 'virtual-tours', icon: <CameraIcon />, text: 'Virtual Tours' },
    { page: 'interactive-map', icon: <MapIcon />, text: 'Interactive Map', disabled: true },
    { page: 'cultural-calendar', icon: <CalendarIcon />, text: 'Cultural Calendar', disabled: true },
    { page: 'audio-guide', icon: <HeadphonesIcon />, text: 'Audio Guide', disabled: true },
    { page: 'digital-archives', icon: <ArchiveIcon />, text: 'Digital Archives', disabled: true },
    { page: 'local-services', icon: <UsersIcon />, text: 'Local Services', disabled: true },
  ];

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

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
             {navItems.map(item => {
               if (!isSignedIn && item.page !== 'home') return null;
               return (
                 <NavButton 
                    key={item.text} 
                    onClick={() => onNavigate(item.page as Page)} 
                    icon={item.icon} 
                    isActive={currentPage === item.page}
                    disabled={item.disabled}
                >
                    {item.text}
                 </NavButton>
               )
             })}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={onSearchClick} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
              <SearchIcon />
            </button>
            {isSignedIn ? (
               <div className="relative" ref={profileRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-3 rounded-full hover:bg-brand-gray p-1 transition-colors">
                     <span className="text-sm font-medium text-brand-text hidden sm:block">Welcome, {userName || 'User'}!</span>
                     <div className="w-9 h-9 bg-brand-teal rounded-full flex items-center justify-center text-brand-dark font-bold">
                       {getInitials(userName)}
                     </div>
                  </button>
                   {isProfileOpen && (
                     <div className="absolute right-0 mt-2 w-64 bg-brand-gray border border-brand-light-gray rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-brand-light-gray">
                          <p className="text-sm font-semibold text-white">{userName || 'Anonymous User'}</p>
                          <p className="text-xs text-brand-text-secondary">{userPhone}</p>
                        </div>
                        <button 
                          onClick={() => {
                            onSignOut();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-light-gray hover:text-white transition-colors"
                        >
                          Sign Out
                        </button>
                     </div>
                   )}
               </div>
            ) : (
              <button 
                onClick={onSignInClick}
                className="px-4 py-2 text-sm font-semibold bg-brand-gray text-white rounded-md hover:bg-brand-light-gray transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="lg:hidden">
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
             {(isSignedIn ? navItems : navItems.slice(0,1)).map(item => (
                <button
                    key={item.text}
                    onClick={() => {
                        if (!item.disabled) {
                            onNavigate(item.page as Page);
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
             {isSignedIn && (
                <div className="flex items-center px-5 mb-3">
                    <div className="flex-shrink-0">
                       <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center text-brand-dark font-bold">
                         {getInitials(userName)}
                       </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">{userName || 'Anonymous User'}</div>
                        <div className="text-sm font-medium leading-none text-brand-text-secondary mt-1">{userPhone}</div>
                    </div>
                </div>
              )}
            <div className="flex items-center px-5 space-x-4">
               <button onClick={onSearchClick} className="flex-grow flex items-center justify-center p-2 rounded-md text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
                 <SearchIcon /> <span className="ml-2">Search</span>
               </button>
               {isSignedIn ? (
                  <div className="flex-grow flex justify-center">
                    <button 
                      onClick={onSignOut}
                      className="w-full px-4 py-2 text-sm font-semibold bg-brand-gray text-white rounded-md hover:bg-brand-light-gray transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
               ) : (
                  <div className="flex-grow flex justify-center">
                    <button 
                      onClick={onSignInClick}
                      className="w-full px-4 py-2 text-sm font-semibold bg-brand-gray text-white rounded-md hover:bg-brand-light-gray transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;