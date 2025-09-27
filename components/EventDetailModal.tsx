import React, { useEffect, useCallback } from 'react';
import { XIcon, BookOpenIcon, UsersIcon, SparklesIcon, CalendarIcon, MapPinIcon } from './Icons';
import type { Event } from './CulturalCalendar';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = 'unset';
        };
    }, [handleKeyDown]);

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fade-in" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="event-title"
        >
            <div 
                className="relative w-full max-w-2xl h-full max-h-[90vh] bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 sm:p-5 border-b border-brand-light-gray/50 flex-shrink-0">
                    <div>
                        <h2 id="event-title" className="text-xl font-bold text-white">{event.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-text-secondary">
                             <div className="flex items-center space-x-2">
                                <CalendarIcon />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPinIcon />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 -mt-1 -mr-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close event details">
                        <XIcon />
                    </button>
                </div>
                
                {/* Scrollable Content */}
                <div className="overflow-y-auto px-6 py-6 flex-grow space-y-6">
                    <div>
                        <p className="text-brand-text-secondary">{event.description}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="flex items-center space-x-2 font-semibold text-brand-teal"><BookOpenIcon /> <span>Historical Context</span></h3>
                        <p className="text-brand-text-secondary">{event.historicalContext}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="flex items-center space-x-2 font-semibold text-brand-teal"><UsersIcon /> <span>Participating Communities</span></h3>
                        <p className="text-brand-text-secondary">{event.communities}</p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="flex items-center space-x-2 font-semibold text-brand-teal"><SparklesIcon /> <span>Customs & Rituals</span></h3>
                        <ul className="list-disc list-inside space-y-1 text-brand-text-secondary marker:text-brand-teal">
                            {event.customs.map((custom, index) => (
                                <li key={index}>{custom}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailModal;
