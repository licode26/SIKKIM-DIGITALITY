import React from 'react';
import type { Page } from '../App';

interface FooterLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ children, onClick, href }) => {
  const classes = "text-brand-text-secondary hover:text-brand-teal transition-colors duration-200";
  return (
    <li>
      {onClick ? (
        <button onClick={onClick} className={`${classes} text-left w-full`}>{children}</button>
      ) : (
        <a href={href || '#'} className={classes}>{children}</a>
      )}
    </li>
  );
};

const Footer: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-dark border-t border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <div className="md:col-span-2 lg:col-span-1">
             <button onClick={() => onNavigate('home')} className="flex items-center space-x-2">
              <span className="w-8 h-8 bg-brand-teal rounded-md flex items-center justify-center text-brand-dark font-bold text-lg">S</span>
              <span className="text-xl font-bold text-white">Sikkim Digital</span>
            </button>
            <p className="mt-4 text-brand-text-secondary text-sm">
              Revolutionizing tourism in Sikkim through cutting-edge technology, sustainable practices, and authentic cultural experiences.
            </p>
          </div>

          <>
            <div>
              <h3 className="font-semibold text-white tracking-wider">Explore</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink onClick={() => onNavigate('virtual-tours')}>Virtual Tours</FooterLink>
                <FooterLink onClick={() => onNavigate('interactive-map')}>Interactive Map</FooterLink>
                <FooterLink onClick={() => onNavigate('cultural-calendar')}>Cultural Events</FooterLink>
                <FooterLink onClick={() => onNavigate('audio-guide')}>Talk to Guide</FooterLink>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-3">
                <FooterLink onClick={() => onNavigate('digital-archives')}>Digital Archives</FooterLink>
                <FooterLink onClick={() => onNavigate('local-services')}>Local Services</FooterLink>
                <FooterLink href="#">Search</FooterLink>
                <FooterLink href="#">Travel Guidelines</FooterLink>
              </ul>
            </div>
          </>
          
          <div>
            <h3 className="font-semibold text-white tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="#">Support</FooterLink>
              <FooterLink href="#">Community</FooterLink>
              <FooterLink href="#">Feedback</FooterLink>
              <FooterLink href="#">Partnership</FooterLink>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-brand-light-gray pt-8 text-center text-sm text-brand-text-secondary">
          <p>&copy; {new Date().getFullYear()} Sikkim Digital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;