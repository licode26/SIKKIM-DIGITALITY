import React from 'react';
import { SearchIcon } from './Icons';

const SearchCallToAction: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
  return (
    <section className="py-20 sm:py-24 bg-brand-gray/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">Find Anything About Sikkim</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-text-secondary">
          AI-powered search across monasteries, attractions, events, and cultural heritage
        </p>
        <div className="mt-10">
          <button
            onClick={onSearchClick}
            className="inline-flex items-center space-x-2 px-8 py-3 text-lg font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105"
          >
            <SearchIcon />
            <span>Start Searching</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchCallToAction;