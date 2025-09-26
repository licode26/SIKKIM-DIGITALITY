import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SearchIcon, XIcon, SpinnerIcon } from './Icons';

// Declare global variables for libraries loaded via script tags
declare const DOMPurify: any;
declare const marked: any;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setResponse('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: searchQuery,
        config: {
          systemInstruction: "You are an expert guide for Sikkim. The user will ask you questions about Sikkim. Provide helpful and accurate answers.",
        }
      });

      const textResponse = result.text;
      const unsafeHtml = await marked.parse(textResponse);
      const safeHtml = DOMPurify.sanitize(unsafeHtml);
      setResponse(safeHtml);

    } catch (e) {
      console.error(e);
      setError('Sorry, something went wrong while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };
  
  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
    handleSearch(exampleQuery);
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);
  
  if (!isOpen) {
    return null;
  }

  const examplePrompts = [
    "What is the significance of the Chaam festival?",
    "Best time to visit Gurudongmar Lake",
    "Tell me about Thangka painting",
    "Local dishes I must try in Gangtok",
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-10" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-3xl bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Ask Anything About Sikkim</h2>
          <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close search">
            <XIcon />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 flex-shrink-0">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'What are the main monasteries to visit?'"
                    className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-4 pr-12 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                    aria-label="Search query"
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary hover:text-brand-teal" disabled={isLoading} aria-label="Submit search">
                    {isLoading ? <SpinnerIcon /> : <SearchIcon />}
                </button>
            </form>
        </div>

        <div className="overflow-y-auto px-4 sm:px-6 pb-6 flex-grow">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <SpinnerIcon />
              <p className="mt-4 text-brand-text-secondary">Consulting the digital archives...</p>
            </div>
          )}
          {error && <p className="text-red-400 text-center p-8">{error}</p>}
          {response && (
            <div 
              className="prose prose-invert prose-p:text-brand-text-secondary prose-headings:text-white prose-strong:text-brand-text prose-a:text-brand-teal prose-li:marker:text-brand-teal"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          )}
          {!isLoading && !response && !error && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-brand-text-secondary mb-3">Try an example:</h3>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map(prompt => (
                    <button key={prompt} onClick={() => handleExampleClick(prompt)} className="px-3 py-1.5 bg-brand-light-gray/50 text-brand-text-secondary text-sm rounded-md hover:bg-brand-light-gray hover:text-white transition-colors">
                        {prompt}
                    </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchModal;