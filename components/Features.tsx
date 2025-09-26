

import React from 'react';
import { CameraIcon, MapIcon, CalendarIcon, HeadphonesIcon, ArchiveIcon, UsersIcon } from './Icons';
import type { Page } from '../App';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, imageUrl, onClick }) => {
  const commonClasses = "bg-brand-gray rounded-xl overflow-hidden group border border-brand-light-gray/50 hover:border-brand-teal/50 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col";
  
  const content = (
    <>
      <div className="relative h-56">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 right-4 p-3 bg-black/50 rounded-full text-brand-teal">
          {icon}
        </div>
      </div>
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-brand-text-secondary">{description}</p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`text-left w-full ${commonClasses}`}>
        {content}
      </button>
    );
  }

  return (
    <div className={commonClasses}>
      {content}
    </div>
  );
};

const Features: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const featuresData = [
    {
      icon: <CameraIcon />,
      title: 'Virtual Monastery Tours',
      description: 'Immersive 360° panoramic views with multilingual narrated walkthroughs',
      imageUrl: 'https://picsum.photos/seed/monastery/400/300',
      onClick: () => onNavigate('virtual-tours'),
    },
    {
      icon: <MapIcon />,
      title: 'Interactive Smart Maps',
      description: 'Geo-tagged locations, travel routes, and real-time attraction updates',
      imageUrl: 'https://picsum.photos/seed/map/400/300'
    },
    {
      icon: <CalendarIcon />,
      title: 'Cultural Event Calendar',
      description: 'Discover and book authentic cultural experiences and festivals',
      imageUrl: 'https://picsum.photos/seed/festival/400/300'
    },
    {
      icon: <HeadphonesIcon />,
      title: 'AI Audio Guide',
      description: 'Smart offline-capable audio guides with personalized recommendations',
      imageUrl: 'https://picsum.photos/seed/audio/400/300'
    },
    {
      icon: <ArchiveIcon />,
      title: 'Digital Archives',
      description: 'AI-powered search through historical manuscripts and cultural artifacts',
      imageUrl: 'https://picsum.photos/seed/archive/400/300'
    },
    {
      icon: <UsersIcon />,
      title: 'Local Services Hub',
      description: 'Connect with verified local guides, transport, and accommodation',
      imageUrl: 'https://picsum.photos/seed/services/400/300'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Revolutionary Tourism Solutions</h2>
          <p className="mt-4 text-lg text-brand-text-secondary">
            Addressing connectivity, overcrowding, and cultural preservation through innovative digital experiences
          </p>
        </div>
        <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featuresData.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;