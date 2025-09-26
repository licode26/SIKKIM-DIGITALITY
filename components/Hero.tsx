import React from 'react';

const Hero: React.FC<{ isSignedIn: boolean; onSignInClick: () => void }> = ({ isSignedIn, onSignInClick }) => {
  return (
    <div
      className="relative bg-cover bg-center text-white"
      style={{ backgroundImage: "url('https://picsum.photos/id/1018/1600/900?grayscale&blur=2')" }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Discover Sikkim's<br/>
          <span className="text-brand-teal">Digital Future</span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-secondary">
          Experience the mystical beauty of Sikkim through cutting-edge technology. Virtual tours, interactive maps, and AI-powered guides await your exploration.
        </p>
        {!isSignedIn && (
          <div className="mt-10 flex justify-center">
             <button
              onClick={onSignInClick}
              className="px-8 py-3 text-lg font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
      {isSignedIn && (
         <div className="relative -mt-16 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-left">
                  <div className="text-sm">
                      <span className="font-bold text-brand-teal">Active Monasteries:</span> 108
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-brand-teal">Cultural Events:</span> 24
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-brand-teal">Travel Routes:</span> 15
                  </div>
                  <div className="text-sm">
                      <span className="font-bold text-brand-teal">Digital Archives:</span> 1,247
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;