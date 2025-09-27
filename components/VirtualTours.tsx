import React, { useState, useEffect } from 'react';
import { MapPinIcon, XIcon, BookOpenIcon, SpinnerIcon, PlayIcon, PauseIcon, StopIcon } from './Icons';
import { GoogleGenAI } from '@google/genai';

// Declare global variables for libraries loaded via script tags
declare const DOMPurify: any;
declare const marked: any;

interface Tour {
  title: string;
  url: string;
}

const monasteries = [
  {
    name: 'Rumtek Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'One of the largest and most significant monasteries in Sikkim, also known as the Dharmachakra Centre.',
    imageUrl: 'https://picsum.photos/seed/rumtek/600/400',
    tours: [
      {
        title: 'Main View',
        url: 'https://www.google.com/maps/embed?pb=!4v1758956479640!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJRDJnWVdjb2dF!2m2!1d27.2885258949387!2d88.56180959787903!3f157.19902114051968!4f-10.15059945569736!5f0.7820865974627469'
      },
      {
        title: 'Courtyard View',
        url: 'https://www.google.com/maps/embed?pb=!4v1758956788981!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQzZ1dHFlT0E.!2m2!1d27.28927618120664!2d88.56148569156855!3f260!4f20!5f0.7820865974627469'
      },
      {
        title: 'Video Tour',
        url: 'https://www.youtube.com/embed/YlPDA7cwMdU'
      }
    ],
  },
  {
    name: 'Pemayangtse Monastery',
    location: 'Pelling, West Sikkim',
    description: 'A premier monastery of the Nyingma order of Tibetan Buddhism, known for its intricate sculptures and paintings.',
    imageUrl: 'https://picsum.photos/seed/pemayangtse/600/400',
    tours: [
      {
        title: 'Main View',
        url: 'https://www.google.com/maps/embed?pb=!4v1716927514332!6m8!1m7!1sCAoSLEFGMVFpcE5yVDRvQ3RzZDRiX0Y1Y1JtZGF3Zm9wUDF5d3ZqLXN6d3d3bUot!2m2!1d27.3005556!2d88.2561111!3f270!4f0!5f0.7820865974627469'
      },
      {
        title: 'Video Tour',
        url: 'https://www.youtube.com/embed/S0y-y-1-lWE'
      }
    ],
  },
  {
    name: 'Tashiding Monastery',
    location: 'Near Ravangla, West Sikkim',
    description: 'Considered one of the holiest monasteries in Sikkim, it is perched on a heart-shaped hill offering panoramic views.',
    imageUrl: 'https://picsum.photos/seed/tashiding/600/400',
    tours: [],
  },
  {
    name: 'Enchey Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'An important seat of the Nyingma order, this 200-year-old monastery is blessed by the tantric master Lama Drupthob Karpo.',
    imageUrl: 'https://picsum.photos/seed/enchey/600/400',
    tours: [],
  },
  {
    name: 'Ralang Monastery',
    location: 'Near Ravangla, South Sikkim',
    description: 'Famous for its annual Pang Lhabsol festival, it houses an extensive collection of paintings and thangkas.',
    imageUrl: 'https://picsum.photos/seed/ralang/600/400',
    tours: [],
  },
  {
    name: 'Dubdi Monastery',
    location: 'Yuksom, West Sikkim',
    description: 'Also known as the Hermit\'s Cell, this is the oldest monastery in Sikkim, established in 1701.',
    imageUrl: 'https://picsum.photos/seed/dubdi/600/400',
    tours: [],
  },
];

interface MonasteryCardProps {
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    tours: Tour[];
    onStartTour: (tours: Tour[], name: string) => void;
    onReadArticle: (name: string) => void;
}

const MonasteryCard: React.FC<MonasteryCardProps> = ({ name, location, description, imageUrl, tours, onStartTour, onReadArticle }) => (
  <div className="bg-brand-gray rounded-xl overflow-hidden group border border-brand-light-gray/50 hover:border-brand-teal/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
    <div className="relative h-64">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-bold text-white">{name}</h3>
        <div className="flex items-center mt-2 text-brand-text-secondary text-sm">
          <MapPinIcon />
          <span className="ml-2">{location}</span>
        </div>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col justify-between">
      <p className="text-brand-text-secondary">{description}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        <button 
          onClick={() => tours && tours.length > 0 && onStartTour(tours, name)}
          disabled={!tours || tours.length === 0}
          className="text-brand-teal font-semibold hover:text-brand-teal-dark transition-colors self-start disabled:text-brand-text-secondary/50 disabled:cursor-not-allowed"
        >
          {tours && tours.length > 0 ? 'Start Virtual Tour →' : 'Tour Coming Soon'}
        </button>
        <button 
          onClick={() => onReadArticle(name)}
          className="flex items-center space-x-2 text-brand-teal font-semibold hover:text-brand-teal-dark transition-colors self-start"
        >
          <BookOpenIcon />
          <span>Read Article</span>
        </button>
      </div>
    </div>
  </div>
);

const VirtualTours: React.FC = () => {
  const [activeToursInfo, setActiveToursInfo] = useState<{tours: Tour[]; name: string} | null>(null);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);

  const [activeMonasteryForArticle, setActiveMonasteryForArticle] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState('');
  const [isArticleLoading, setIsArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState('');

  // State for text-to-speech
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
            setVoices(availableVoices.filter(v => v.lang.startsWith('en')));
        }
    };

    loadVoices();
    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
    };
  }, []);

  const handleStartTour = (tours: Tour[], name: string) => {
      if (name === 'Rumtek Monastery') {
        const utterance = new SpeechSynthesisUtterance("Welcome to Rumtek Monastery. We hope you enjoy the view and the virtual tour.");
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
      setActiveToursInfo({tours, name});
      setCurrentTourIndex(0);
  };

  const handleCloseTour = () => {
      window.speechSynthesis.cancel();
      setActiveToursInfo(null);
  };
  
  const handleSelectTour = (index: number) => {
      setCurrentTourIndex(index);
  };

  const htmlToText = (htmlString: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handlePlay = (gender: 'male' | 'female') => {
    if (!articleContent || voices.length === 0) return;

    window.speechSynthesis.cancel();

    const plainText = htmlToText(articleContent);
    
    // Naive voice selection logic
    const maleVoice = voices.find(v => v.name.toLowerCase().includes('male')) || voices.find(v => v.name.includes('David')) || voices.find(v => v.name.includes('Google US English'));
    const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female')) || voices.find(v => v.name.includes('Zira')) || voices.find(v => v.name.includes('Google UK English Female'));

    let selectedVoice = gender === 'female' ? femaleVoice : maleVoice;
    
    // Fallback to the first available English voice
    if (!selectedVoice) {
        selectedVoice = voices[0];
    }
    if (!selectedVoice) {
      console.error("No English voices available for speech synthesis.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.voice = selectedVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
    };
    utterance.onpause = () => {
        setIsPaused(true);
        setIsSpeaking(true); // Still speaking, just paused
    };
    utterance.onresume = () => {
        setIsPaused(false);
    };
    utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResume = () => {
      if (isPaused) {
          window.speechSynthesis.resume();
      } else {
          window.speechSynthesis.pause();
      }
  };

  const handleStop = () => {
      window.speechSynthesis.cancel();
  };

  const handleReadArticle = async (name: string) => {
    setActiveMonasteryForArticle(name);
    setIsArticleLoading(true);
    setArticleContent('');
    setArticleError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a historian and cultural expert specializing in Himalayan Buddhism. Write a detailed and engaging article about ${name} in Sikkim. Cover its history, architectural significance, important artifacts or features, and its role in the local community. Structure the article with headings and paragraphs in Markdown.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const textResponse = result.text;
      const unsafeHtml = await marked.parse(textResponse);
      const safeHtml = DOMPurify.sanitize(unsafeHtml);
      setArticleContent(safeHtml);

    } catch (e) {
      console.error(e);
      setArticleError('Sorry, we couldn\'t generate the article at this moment. Please try again later.');
    } finally {
      setIsArticleLoading(false);
    }
  };

  const handleCloseArticleModal = () => {
    window.speechSynthesis.cancel();
    setActiveMonasteryForArticle(null);
    setIsSpeaking(false);
    setIsPaused(false);
  };
    
  return (
    <div className="animate-fade-in">
        {/* Tour Modal */}
        {activeToursInfo && (
            <div 
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in" 
                onClick={handleCloseTour} 
                role="dialog" 
                aria-modal="true"
                aria-labelledby="tour-title"
            >
              <div 
                className="relative w-full max-w-5xl h-[90vh] bg-brand-dark rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" 
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50 flex-shrink-0">
                  <h2 id="tour-title" className="text-lg font-semibold text-white">{activeToursInfo.name} - Virtual Tour</h2>
                  <button onClick={handleCloseTour} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close virtual tour">
                    <XIcon />
                  </button>
                </div>
                
                {activeToursInfo.tours.length > 1 && (
                  <div className="p-2 border-b border-brand-light-gray/50 flex-shrink-0 flex items-center justify-center flex-wrap gap-2">
                    {activeToursInfo.tours.map((tour, index) => (
                      <button 
                        key={index}
                        onClick={() => handleSelectTour(index)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            currentTourIndex === index 
                                ? 'bg-brand-teal text-brand-dark' 
                                : 'bg-brand-light-gray/50 text-brand-text-secondary hover:bg-brand-light-gray'
                        }`}
                      >
                        {tour.title}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex-grow p-2">
                    <iframe 
                        src={activeToursInfo.tours[currentTourIndex].url} 
                        className="w-full h-full rounded-b-lg"
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        title={`${activeToursInfo.name} Virtual Tour - ${activeToursInfo.tours[currentTourIndex].title}`}
                    ></iframe>
                </div>
              </div>
            </div>
        )}
        
        {/* Article Modal */}
        {activeMonasteryForArticle && (
            <div 
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in" 
                onClick={handleCloseArticleModal} 
                role="dialog" 
                aria-modal="true"
                aria-labelledby="article-title"
            >
                 <div 
                    className="relative w-full max-w-3xl h-[90vh] bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50 flex-shrink-0">
                        <h2 id="article-title" className="text-lg font-semibold text-white">{activeMonasteryForArticle}</h2>
                        <button onClick={handleCloseArticleModal} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close article">
                            <XIcon />
                        </button>
                    </div>

                    <div className="overflow-y-auto px-6 py-6 flex-grow">
                        {isArticleLoading && (
                            <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                                <SpinnerIcon />
                                <p className="mt-4 text-brand-text-secondary">AI is writing your article...</p>
                            </div>
                        )}
                        {articleError && <p className="text-red-400 text-center p-8">{articleError}</p>}
                        {articleContent && (
                            <div 
                                className="prose prose-invert max-w-none prose-p:text-brand-text-secondary prose-headings:text-white prose-strong:text-brand-text prose-a:text-brand-teal prose-li:marker:text-brand-teal prose-h2:border-b prose-h2:border-brand-light-gray/50 prose-h2:pb-2"
                                dangerouslySetInnerHTML={{ __html: articleContent }}
                            />
                        )}
                    </div>
                    
                    {articleContent && !isArticleLoading && voices.length > 0 && (
                        <div className="flex-shrink-0 p-4 border-t border-brand-light-gray/50">
                            {!isSpeaking ? (
                                <div className="flex items-center justify-center gap-4">
                                    <span className="text-sm font-semibold text-brand-text-secondary">Listen to article:</span>
                                    <button onClick={() => handlePlay('female')} className="px-4 py-2 text-sm font-medium rounded-md bg-brand-light-gray/50 text-brand-text hover:bg-brand-light-gray transition-colors">
                                        Female Voice
                                    </button>
                                    <button onClick={() => handlePlay('male')} className="px-4 py-2 text-sm font-medium rounded-md bg-brand-light-gray/50 text-brand-text hover:bg-brand-light-gray transition-colors">
                                        Male Voice
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={handlePauseResume} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-brand-light-gray/50 text-brand-text hover:bg-brand-light-gray transition-colors">
                                        {isPaused ? <PlayIcon /> : <PauseIcon />}
                                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                                    </button>
                                    <button onClick={handleStop} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-brand-light-gray/50 text-brand-text hover:bg-brand-light-gray transition-colors">
                                        <StopIcon />
                                        <span>Stop</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                 </div>
            </div>
        )}

        <section className="py-20 sm:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Virtual Monastery Tours</h1>
            <p className="mt-4 text-lg text-brand-text-secondary">
                Step inside Sikkim's most sacred spaces from anywhere in the world. Experience the serene beauty and intricate art of these ancient monasteries through immersive 360° tours.
            </p>
            </div>
            <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {monasteries.map(monastery => (
                <MonasteryCard 
                    key={monastery.name} 
                    {...monastery} 
                    onStartTour={handleStartTour}
                    onReadArticle={handleReadArticle}
                />
            ))}
            </div>
        </div>
        </section>
    </div>
  );
};

export default VirtualTours;