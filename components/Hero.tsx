import React, { useState, useEffect } from 'react';
import Counter from './Counter';
// FIX: Updated Firebase import for v8 compatibility to correctly reference the User type.
// FIX: Switched to Firebase v8 compat import to resolve type error for firebase.User.
import type firebase from 'firebase/compat/app';

interface HeroProps {
  onAuthClick?: () => void;
  user?: firebase.User | null;
}

const sikkimQuotes = [
  "Sikkim is a land of majestic mountains, vibrant monasteries, and a culture steeped in tradition.",
  "Where every glance is a painting, and every step is a pilgrimage into the heart of the Himalayas.",
  "Discover a mystical world where ancient chants echo through verdant valleys.",
  "The jewel of the Himalayas, offering a symphony of nature, spirituality, and adventure."
];

const Hero: React.FC<HeroProps> = ({ onAuthClick, user }) => {
  const stats = [
    { label: 'Active Monasteries', value: 108 },
    { label: 'Annual Cultural Events', value: 52 },
    { label: 'Documented Trek Routes', value: 35 },
    { label: 'Digitized Archival Items', value: 15621 },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!user) { // Only run the quote animation if the user is logged out
      const intervalId = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setQuoteIndex((prevIndex) => (prevIndex + 1) % sikkimQuotes.length);
          setIsFading(false);
        }, 500); // Corresponds to the fade duration
      }, 6000); // Change quote every 6 seconds

      return () => clearInterval(intervalId);
    }
  }, [user]);

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
        <p className={`mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-text-secondary transition-opacity duration-500 ease-in-out ${isFading && !user ? 'opacity-0' : 'opacity-100'}`}>
          { user 
            ? `Welcome back, ${user.displayName || 'Explorer'}! Continue your journey into the heart of Sikkim.` 
            : sikkimQuotes[quoteIndex]
          }
        </p>
        {!user && onAuthClick && (
            <div className="mt-10">
                <button onClick={onAuthClick} className="inline-flex items-center space-x-3 px-8 py-4 text-lg font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105">
                    <span>Sign Up to Explore</span>
                </button>
            </div>
        )}
      </div>
      <div className="relative -mt-24 md:-mt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-brand-gray/50 backdrop-blur-md border border-brand-light-gray/20 rounded-xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-extrabold text-brand-teal tracking-tight">
                    <Counter end={stat.value} duration={2000} />
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-brand-text-secondary uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;