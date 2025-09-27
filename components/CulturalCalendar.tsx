import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import EventDetailModal from './EventDetailModal';

export interface Event {
  name: string;
  date: string; // Display date string
  location: string;
  description: string;
  month: number; 
  day: number;
  historicalContext: string;
  communities: string;
  customs: string[];
}

const sikkimEvents: Event[] = [
  {
    name: "Saga Dawa",
    date: "May - June",
    location: "Across Sikkim, esp. Gangtok",
    description: "A sacred Buddhist festival celebrating Buddha's birth, enlightenment, and nirvana. Monks lead a grand procession with holy scriptures.",
    month: 4, // May
    day: 23,
    historicalContext: "Saga Dawa is the most sacred month in the Tibetan Buddhist calendar, commemorating the key life events of Lord Buddha. The full moon day of this month is particularly significant as it is believed to be the day he was born, attained enlightenment, and passed away.",
    communities: "Primarily celebrated by the Buddhist communities of Sikkim, including Bhutias and Tibetans.",
    customs: ["Releasing of fish or birds to give life.", "Reading of holy scriptures (Dho-hang).", "Lighting of butter lamps in homes and monasteries.", "Abstaining from eating meat."],
  },
  {
    name: "Losar Festival",
    date: "February",
    location: "Monasteries across Sikkim",
    description: "The Tibetan New Year celebration, marked by vibrant cham dances, traditional rituals, and family feasts, welcoming a new year of peace.",
    month: 1, // Feb
    day: 10,
    historicalContext: "Losar has pre-Buddhist origins in Tibet, stemming from a winter incense-burning festival. It was later incorporated into Tibetan Buddhism and has been celebrated for centuries as a time of renewal and purification.",
    communities: "Celebrated by Tibetan Buddhists, primarily the Bhutia and Sherpa communities in Sikkim.",
    customs: ["Cleaning homes to drive away evil spirits.", "Making special offerings called 'Lama Losar'.", "Hoisting new prayer flags.", "Engaging in masked 'Cham' dances at monasteries."],
  },
  {
    name: "Pang Lhabsol",
    date: "August - September",
    location: "Tsuklakhang Palace, Gangtok",
    description: "A unique festival honoring Mount Kanchenjunga as Sikkim's guardian deity. Features the spectacular 'Pangtoed' warrior dance.",
    month: 7, // August
    day: 15,
    historicalContext: "The festival was introduced by the third Chogyal (King) of Sikkim, Chakdor Namgyal. It commemorates the blood brotherhood pact sworn between the Bhutias and Lepchas, with Mount Kanchenjunga as the witness.",
    communities: "Celebrated by all communities in Sikkim as it honors the state's guardian deity.",
    customs: ["The 'Pangtoed' chaam dance performed by warrior monks.", "The dramatic entrance of Mahakala, the protector deity.", "Offerings of 'Dzonga' (the local deity) and 'Yabdu' (the guardian of the world)."],
  },
  {
    name: "Losoong / Namsoong",
    date: "December",
    location: "Rural Sikkim & Monasteries",
    description: "The Sikkimese New Year, a harvest festival celebrated by Bhutia and Lepcha communities with archery, feasting, and religious ceremonies.",
    month: 11, // December
    day: 18,
    historicalContext: "Losoong marks the end of the harvest season and the 10th month of the Tibetan lunar calendar. It is a time for farmers to rejoice and celebrate their hard work and yield.",
    communities: "Celebrated by the Bhutia (as Losoong) and Lepcha (as Namsoong) communities.",
    customs: ["Archery competitions are a major highlight.", "Burning effigies of demons to ward off evil spirits.", "Offering 'Chi-Fut', a special kind of alcohol, to the deities.", "Performing Black Hat dances in monasteries."],
  },
  {
    name: "Tendong Lho Rum Faat",
    date: "August",
    location: "Namchi, South Sikkim",
    description: "A festival of the Lepcha tribe, celebrating the sacred Tendong Hill which is believed to have saved their ancestors from a great flood.",
    month: 7, // August
    day: 8,
    historicalContext: "According to Lepcha folklore, Tendong Hill rose like a horn to save the Lepcha people from a great deluge that flooded the region for 40 days and 40 nights. The festival pays homage to this savior hill.",
    communities: "This is the most ancient and significant festival for the Lepcha community, the original inhabitants of Sikkim.",
    customs: ["Trekking to the top of Tendong Hill to make offerings.", "Models of the hill are created and worshipped at home.", "Literary and cultural programs are organized to promote Lepcha traditions."],
  },
];


interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => (
  <button 
    id={`event-${event.month}-${event.day}`} 
    onClick={onClick}
    className="w-full text-left bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-start transition-all duration-300 transform hover:-translate-y-1 hover:border-brand-teal/50 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 focus:ring-offset-brand-dark"
    aria-label={`View details for ${event.name}`}
  >
    <div className="w-full md:w-1/3 h-48 md:h-auto rounded-lg overflow-hidden shrink-0">
      <img 
        src={`https://picsum.photos/seed/${event.name.replace(/\s/g, '')}/400/300`} 
        alt={event.name} 
        className="w-full h-full object-cover" 
      />
    </div>
    <div className="w-full md:w-2/3">
      <h3 className="text-2xl font-bold text-white">{event.name}</h3>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-brand-text-secondary">
        <div className="flex items-center space-x-2">
          <CalendarIcon />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPinIcon />
          <span>{event.location}</span>
        </div>
      </div>
      <p className="mt-4 text-brand-text">{event.description}</p>
    </div>
  </button>
);

const CulturalCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };
    
    const handleDayClick = (day: number) => {
      const eventElement = document.getElementById(`event-${month}-${day}`);
      if (eventElement) {
        eventElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    return (
        <div className="animate-fade-in">
            <section className="py-20 sm:py-24 bg-brand-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Cultural Calendar</h1>
                        <p className="mt-4 text-lg text-brand-text-secondary">
                            Immerse yourself in the vibrant traditions of Sikkim. Explore the dates, locations, and significance of the region's most important cultural events and festivals.
                        </p>
                    </div>

                    <div className="mt-16 max-w-3xl mx-auto bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-brand-light-gray/50 transition-colors" aria-label="Previous month">
                                <ChevronLeftIcon />
                            </button>
                            <h2 className="text-xl font-bold text-white">
                                {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
                            </h2>
                            <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-brand-light-gray/50 transition-colors" aria-label="Next month">
                                <ChevronRightIcon />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-brand-text-secondary">
                            {weekdays.map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 mt-2">
                            {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                            {Array.from({ length: numDays }).map((_, dayIndex) => {
                                const day = dayIndex + 1;
                                const isEventDay = sikkimEvents.some(event => event.month === month && event.day === day);
                                
                                return (
                                    <div key={day} className="flex justify-center items-center h-10">
                                        <button 
                                            onClick={() => isEventDay && handleDayClick(day)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                                isEventDay
                                                    ? 'bg-brand-teal text-brand-dark font-bold cursor-pointer hover:bg-brand-teal-dark'
                                                    : 'text-brand-text'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="mt-16 space-y-8 max-w-4xl mx-auto">
                        {sikkimEvents.map(event => (
                            <EventCard key={event.name} event={event} onClick={() => setSelectedEvent(event)} />
                        ))}
                    </div>
                </div>
            </section>
            {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

export default CulturalCalendar;
