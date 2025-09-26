import React from 'react';
import { MapPinIcon } from './Icons';

const monasteries = [
  {
    name: 'Rumtek Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'One of the largest and most significant monasteries in Sikkim, also known as the Dharmachakra Centre.',
    imageUrl: 'https://picsum.photos/seed/rumtek/600/400',
  },
  {
    name: 'Pemayangtse Monastery',
    location: 'Pelling, West Sikkim',
    description: 'A premier monastery of the Nyingma order of Tibetan Buddhism, known for its intricate sculptures and paintings.',
    imageUrl: 'https://picsum.photos/seed/pemayangtse/600/400',
  },
  {
    name: 'Tashiding Monastery',
    location: 'Near Ravangla, West Sikkim',
    description: 'Considered one of the holiest monasteries in Sikkim, it is perched on a heart-shaped hill offering panoramic views.',
    imageUrl: 'https://picsum.photos/seed/tashiding/600/400',
  },
  {
    name: 'Enchey Monastery',
    location: 'Gangtok, East Sikkim',
    description: 'An important seat of the Nyingma order, this 200-year-old monastery is blessed by the tantric master Lama Drupthob Karpo.',
    imageUrl: 'https://picsum.photos/seed/enchey/600/400',
  },
  {
    name: 'Ralang Monastery',
    location: 'Near Ravangla, South Sikkim',
    description: 'Famous for its annual Pang Lhabsol festival, it houses an extensive collection of paintings and thangkas.',
    imageUrl: 'https://picsum.photos/seed/ralang/600/400',
  },
  {
    name: 'Dubdi Monastery',
    location: 'Yuksom, West Sikkim',
    description: 'Also known as the Hermit\'s Cell, this is the oldest monastery in Sikkim, established in 1701.',
    imageUrl: 'https://picsum.photos/seed/dubdi/600/400',
  },
];

interface MonasteryCardProps {
    name: string;
    location: string;
    description: string;
    imageUrl: string;
}

const MonasteryCard: React.FC<MonasteryCardProps> = ({ name, location, description, imageUrl }) => (
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
      <button className="mt-4 text-brand-teal font-semibold hover:text-brand-teal-dark transition-colors self-start">
        Start Virtual Tour &rarr;
      </button>
    </div>
  </div>
);

const VirtualTours: React.FC = () => {
  return (
    <div className="animate-fade-in">
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
                <MonasteryCard key={monastery.name} {...monastery} />
            ))}
            </div>
        </div>
        </section>
    </div>
  );
};

export default VirtualTours;
