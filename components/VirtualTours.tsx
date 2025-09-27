import React, { useState } from 'react';
import { MapPinIcon, XIcon } from './Icons';

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
    tours: [],
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
}

const MonasteryCard: React.FC<MonasteryCardProps> = ({ name, location, description, imageUrl, tours, onStartTour }) => (
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
      <button 
        onClick={() => tours && tours.length > 0 && onStartTour(tours, name)}
        disabled={!tours || tours.length === 0}
        className="mt-4 text-brand-teal font-semibold hover:text-brand-teal-dark transition-colors self-start disabled:text-brand-text-secondary/50 disabled:cursor-not-allowed"
      >
        {tours && tours.length > 0 ? 'Start Virtual Tour →' : 'Tour Coming Soon'}
      </button>
    </div>
  </div>
);

const VirtualTours: React.FC = () => {
  const [activeToursInfo, setActiveToursInfo] = useState<{tours: Tour[]; name: string} | null>(null);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);

  const handleStartTour = (tours: Tour[], name: string) => {
      setActiveToursInfo({tours, name});
      setCurrentTourIndex(0);
  };

  const handleCloseTour = () => {
      setActiveToursInfo(null);
  };
  
  const handleSelectTour = (index: number) => {
      setCurrentTourIndex(index);
  };
    
  return (
    <div className="animate-fade-in">
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
                />
            ))}
            </div>
        </div>
        </section>
    </div>
  );
};

export default VirtualTours;