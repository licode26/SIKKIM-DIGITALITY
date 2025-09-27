
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
  onSearchClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FIX: Added an explicit type to the navItems array to include the optional 'disabled' property, resolving TypeScript errors.
  const navItems: { page: Page; icon: React.ReactNode; text: string; disabled?: boolean }[] = [
    { page: 'home', icon: <HomeIcon />, text: 'Home' },
    { page: 'virtual-tours', icon: <CameraIcon />, text: 'Virtual Tours' },
    { page: 'interactive-map', icon: <MapIcon />, text: 'Interactive Map' },
    { page: 'cultural-calendar', icon: <CalendarIcon />, text: 'Cultural Calendar' },
    { page: 'audio-guide', icon: <HeadphonesIcon />, text: 'Talk to Guide' },
    { page: 'digital-archives', icon: <ArchiveIcon />, text: 'Digital Archives' },
    { page: 'local-services', icon: <UsersIcon />, text: 'Local Services' },
  ];

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
                    // FIX: Removed unnecessary 'as Page' type assertion as 'item.page' is now correctly typed.
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
            <button onClick={onSearchClick} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
              <SearchIcon />
            </button>
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
             {navItems.map(item => (
                <button
                    key={item.text}
                    onClick={() => {
                        if (!item.disabled) {
                            // FIX: Removed unnecessary 'as Page' type assertion as 'item.page' is now correctly typed.
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
            <div className="flex items-center px-5 space-x-4">
               <button onClick={onSearchClick} className="flex-grow flex items-center justify-center p-2 rounded-md text-brand-text-secondary hover:text-white hover:bg-brand-gray transition-colors">
                 <SearchIcon /> <span className="ml-2">Search</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
