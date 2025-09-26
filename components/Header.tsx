import React, { useState } from 'react';
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
  XIcon
} from './Icons';

const NavLink: React.FC<{ href: string; icon: React.ReactNode; children: React.ReactNode }> = ({ href, icon, children }) => (
  <a href={href} className="flex items-center space-x-2 text-brand-text-secondary hover:text-brand-text transition-colors duration-200">
    {icon}
    <span className="text-sm font-medium">{children}</span>
  </a>
);

interface HeaderProps {
  isSignedIn: boolean;
  userName?: string;
  onSignInClick: () => void;
  onSignOut: () => void;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSignedIn, userName, onSignInClick, onSignOut, onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '#', icon: <HomeIcon />, text: 'Home' },
    { href: '#', icon: <CameraIcon />, text: 'Virtual Tours' },
    { href: '#', icon: <MapIcon />, text: 'Interactive Map' },
    { href: '#', icon: <CalendarIcon />, text: 'Cultural Calendar' },
    { href: '#', icon: <HeadphonesIcon />, text: 'Audio Guide' },
    { href: '#', icon: <ArchiveIcon />, text: 'Digital Archives' },
    { href: '#', icon: <UsersIcon />, text: 'Local Services' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-lg border-b border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-brand-teal rounded-md flex items-center justify-center text-brand-dark font-bold text-lg">S</span>
              <span className="text-xl font-bold text-white">Sikkim Digital</span>
            </a>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-6">
             <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-brand-gray text-white">
                <HomeIcon /> <span className="ml-2">Home</span>
            </a>
            {isSignedIn && navItems.slice(1).map(item => (
                 <NavLink key={item.text} href={item.href} icon={item.icon}>{item.text}</NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={onSearchClick} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
              <SearchIcon />
            </button>
            {isSignedIn ? (
               <div className="flex items-center space-x-4">
                 <span className="text-sm font-medium text-brand-text">Welcome, {userName}!</span>
                 <button 
                    onClick={onSignOut}
                    className="px-4 py-2 text-sm font-semibold bg-brand-gray text-white rounded-md hover:bg-brand-light-gray transition-colors"
                  >
                    Sign Out
                  </button>
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
             {(isSignedIn ? navItems : [navItems[0]]).map(item => (
                <a key={item.text} href={item.href} className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors duration-200">
                    {item.icon}
                    <span>{item.text}</span>
                </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-brand-gray">
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