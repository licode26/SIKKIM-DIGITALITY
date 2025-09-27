
import React, { useState, useEffect } from 'react';
import { UsersIcon, PhoneIcon, MapPinIcon, CarIcon, CompassIcon, BedIcon, ShieldCheckIcon, LeafIcon, WifiIcon } from './Icons';

type ServiceCategory = 'All' | 'Transport' | 'Tour Operator' | 'Accommodation' | 'Emergency' | 'Environmental' | 'Digital';

interface Service {
  name: string;
  category: ServiceCategory;
  location: string;
  contact: string;
}

const servicesData: Service[] = [
  { name: 'Himalayan Wheels', category: 'Transport', location: 'Gangtok', contact: '+91-9876543210' },
  { name: 'Sikkim Adventures', category: 'Tour Operator', location: 'Gangtok', contact: '+91-9876543211' },
  { name: 'The Golden Crest', category: 'Accommodation', location: 'Pelling', contact: '+91-9876543212' },
  { name: 'STNM Hospital', category: 'Emergency', location: 'Gangtok', contact: '108 / 03592-202955' },
  { name: 'Green Sikkim Initiative', category: 'Environmental', location: 'State-wide', contact: 'contact@greensikkim.org' },
  { name: 'Sikkim NetLink', category: 'Digital', location: 'Gangtok', contact: '+91-9876543213' },
  { name: 'Pelling Taxi Service', category: 'Transport', location: 'Pelling', contact: '+91-9876543214' },
  { name: 'Khangchendzonga Treks', category: 'Tour Operator', location: 'Yuksom', contact: '+91-9876543215' },
  { name: 'Yarlam Resort', category: 'Accommodation', location: 'Lachung', contact: '+91-9876543216' },
  { name: 'Namchi District Hospital', category: 'Emergency', location: 'Namchi', contact: '03595-263733' },
  { name: 'WASTE Project Sikkim', category: 'Environmental', location: 'Gangtok', contact: '+91-9876543217' },
  { name: 'Gangtok Cabs', category: 'Transport', location: 'Gangtok', contact: '+91-9876543218' },
  { name: 'Red Panda Tours', category: 'Tour Operator', location: 'Ravangla', contact: '+91-9876543219' },
  { name: 'Mayfair Spa Resort & Casino', category: 'Accommodation', location: 'Gangtok', contact: '+91-9876543220' },
  { name: 'Police Helpline', category: 'Emergency', location: 'State-wide', contact: '100 / 112' },
  { name: 'The Elgin Nor-Khill', category: 'Accommodation', location: 'Gangtok', contact: '+91-3592205637' },
  { name: 'Summit Sobralia Resort & Spa', category: 'Accommodation', location: 'Namchi', contact: '+91-8373050777' },
  { name: 'Yuksom Porters & Guides', category: 'Transport', location: 'Yuksom', contact: '+91-9593979459' },
  { name: 'Yak & Yeti Travels', category: 'Tour Operator', location: 'Gangtok', contact: '+91-3592201990' },
  { name: 'Fire & Emergency Services', category: 'Emergency', location: 'State-wide', contact: '101' },
  { name: 'Sikkim Forest Department', category: 'Environmental', location: 'State-wide', contact: '03592-202483' },
  { name: 'Jio Fiber Sikkim', category: 'Digital', location: 'Major Towns', contact: '1800-896-9999' },
  { name: 'Mountain Homestays', category: 'Tour Operator', location: 'State-wide', contact: 'info@mountainhomestays.com' },
  { name: 'The Cherry Resort', category: 'Accommodation', location: 'Namchi', contact: '+91-9876543222' },
];

const categoryIcons: { [key in ServiceCategory]?: React.ReactNode } = {
    'Transport': <CarIcon />,
    'Tour Operator': <CompassIcon />,
    'Accommodation': <BedIcon />,
    'Emergency': <ShieldCheckIcon />,
    'Environmental': <LeafIcon />,
    'Digital': <WifiIcon />,
};


const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const isEmail = /@/.test(service.contact);
    let contactElement;

    if (isEmail) {
        contactElement = (
            <a href={`mailto:${service.contact}`} className="hover:text-brand-teal transition-colors break-all">
                {service.contact}
            </a>
        );
    } else {
        const contactParts = service.contact.split('/').map(part => part.trim());
        contactElement = (
            <span>
                {contactParts.map((part, index) => {
                    const isPhoneNumber = /^\+?\d[\d\s-]+$/.test(part);
                    return (
                        <React.Fragment key={index}>
                            {isPhoneNumber ? (
                                <a href={`tel:${part.replace(/\s|-/g, '')}`} className="hover:text-brand-teal transition-colors">
                                    {part}
                                </a>
                            ) : (
                                <span>{part}</span>
                            )}
                            {index < contactParts.length - 1 && <span className="mx-1">/</span>}
                        </React.Fragment>
                    );
                })}
            </span>
        );
    }

    return (
        <div className="bg-brand-gray rounded-xl group border border-brand-light-gray/50 p-6 flex flex-col">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    <p className="text-sm text-brand-text-secondary mt-1">{service.category}</p>
                </div>
                <div className="p-3 bg-brand-dark/50 rounded-full text-brand-teal">
                    {categoryIcons[service.category] || <UsersIcon />}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-brand-light-gray/50 space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-brand-text">
                    <MapPinIcon />
                    <span>{service.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-brand-text">
                    <PhoneIcon />
                    {contactElement}
                </div>
            </div>
        </div>
    );
};


const LocalServices: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ServiceCategory>('All');
  const [filteredServices, setFilteredServices] = useState<Service[]>(servicesData);

  const filters: ServiceCategory[] = ['All', 'Accommodation', 'Transport', 'Tour Operator', 'Emergency', 'Environmental', 'Digital'];

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredServices(servicesData);
    } else {
      setFilteredServices(servicesData.filter(item => item.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <div className="animate-fade-in">
      <section className="py-20 sm:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Local Services Hub</h1>
            <p className="mt-4 text-lg text-brand-text-secondary">
              Connect with verified local guides, transport providers, accommodations, and essential services to make your trip to Sikkim smooth and memorable.
            </p>
          </div>
          
          <div className="mt-12 flex justify-center flex-wrap gap-3">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  activeFilter === filter
                    ? 'bg-brand-teal text-brand-dark border-brand-teal'
                    : 'bg-brand-dark/50 border-brand-light-gray text-brand-text-secondary hover:border-brand-teal/50 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-16 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map(item => (
              <ServiceCard key={item.name} service={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocalServices;
