
import React, { useState } from 'react';
import { CalendarIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon, CrosshairIcon, SpinnerIcon } from './Icons';
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
  lat: number;
  lng: number;
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
    lat: 27.3314,
    lng: 88.6138,
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
    lat: 27.3314,
    lng: 88.6138,
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
    lat: 27.3314,
    lng: 88.6138,
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
    lat: 27.3069,
    lng: 88.3697, // Ravangla as a central point for 'Rural'
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
    lat: 27.1683,
    lng: 88.3551,
  },
  {
    name: "Indra Jatra",
    date: "September",
    location: "Gangtok",
    description: "A vibrant Nepali festival celebrated with chariot processions, masked dances, and classical performances, honoring Indra, the king of heaven.",
    month: 8,
    day: 15,
    historicalContext: "Originating in Nepal's Kathmandu Valley, Indra Jatra was brought to Sikkim by the Nepali community. It marks the end of the monsoon season and is a thanksgiving festival to Lord Indra for the rains.",
    communities: "Primarily celebrated by the Newar community within the larger Nepali Hindu population of Sikkim.",
    customs: ["Pulling of a large chariot (rath) through the streets.", "Performances of Lakhey (demon) and Pulu Kisi (elephant) dances.", "Display of the deity Akash Bhairab.", "Singing of traditional hymns."],
    lat: 27.3314,
    lng: 88.6138
  },
  {
    name: "Tihar (Diwali)",
    date: "October - November",
    location: "State-wide",
    description: "The festival of lights, celebrated over five days. Each day holds a special significance, honoring crows, dogs, cows, and the goddess of wealth, Laxmi.",
    month: 9,
    day: 31,
    historicalContext: "Tihar, also known as Deepawali, is one of the most important Hindu festivals. Its Sikkimese celebration reflects the local Nepali culture, emphasizing reverence for nature and animals alongside the worship of deities.",
    communities: "Celebrated by the Sikkimese Nepali Hindu community.",
    customs: ["Lighting of 'diyas' (oil lamps) and decorating homes.", "Worshipping crows, dogs, and cows on specific days.", "Laxmi Puja on the third day to invite prosperity.", "Playing 'Deusi' and 'Bhailo', where groups go singing and dancing from house to house."],
    lat: 27.3314,
    lng: 88.6138
  },
  {
    name: "Bumchu Festival",
    date: "January - February",
    location: "Tashiding Monastery, West Sikkim",
    description: "A unique holy water ceremony where the water level in a sacred pot foretells the fortune of the state for the coming year.",
    month: 0,
    day: 14,
    historicalContext: "The tradition dates back to the 17th century. The sacred pot, or 'Bumchu', containing holy water, was consecrated by Guru Padmasambhava. It is opened only once a year during the festival for lamas to predict the future.",
    communities: "A significant pilgrimage for Buddhists from Sikkim and neighboring regions.",
    customs: ["The sacred pot is opened by lamas in the monastery.", "The water level is observed to predict prosperity, famine, or conflict.", "A small amount of the holy water is distributed to devotees.", "The pot is refilled from a sacred river and sealed until the next year."],
    lat: 27.2731,
    lng: 88.2831
  },
  {
    name: "Drukpa Tshechi",
    date: "July - August",
    location: "Muguthang & Gangtok",
    description: "Commemorates the Buddha's first sermon, 'The Four Noble Truths', delivered at the Deer Park in Sarnath.",
    month: 6,
    day: 4,
    historicalContext: "Drukpa Tshechi falls on the fourth day ('Tshechi') of the sixth month ('Drukpa') of the Tibetan calendar. It is a day of great religious significance, marking the moment the Buddha set in motion the 'Wheel of Dharma'.",
    communities: "Devoutly observed by the Buddhist community across Sikkim.",
    customs: ["Prayers are held at monasteries, especially at Deer Park in Gangtok.", "Monks recite holy texts and deliver sermons.", "Devotees light butter lamps as offerings.", "A Yak race is sometimes organized in high-altitude areas like Muguthang."],
    lat: 27.3389,
    lng: 88.6045
  },
  {
    name: "Maghe Sankranti",
    date: "January",
    location: "Jorethang, South Sikkim",
    description: "A major Nepali harvest festival marking the end of winter. It is celebrated with large fairs (melas), cultural programs, and feasting.",
    month: 0,
    day: 14,
    historicalContext: "Maghe Sankranti is a pan-Indian festival known by various names (e.g., Makar Sankranti). In Sikkim, it's a significant cultural event for the Nepali community, symbolizing a time of togetherness and celebration after the harvest.",
    communities: "Celebrated with great enthusiasm by the Nepali community of Sikkim.",
    customs: ["Taking holy dips in rivers, especially at the confluence of Teesta and Rangit.", "The Jorethang Mela is a major attraction with food stalls and cultural shows.", "Eating special foods like 'Tarul' (yams), 'ghee-chaku' (molasses and butter), and 'til ko laddu' (sesame sweets).", "Participating in adventure sports and kite flying."],
    lat: 27.0673,
    lng: 88.3563
  },
  {
    name: "Guru Rinpoche's Thunkar Tshechu",
    date: "July - August",
    location: "Rumtek Monastery & others",
    description: "Celebrates the birth anniversary of Guru Padmasambhava, the revered saint who introduced Buddhism to Tibet and Sikkim.",
    month: 6,
    day: 10,
    historicalContext: "Guru Padmasambhava, also known as Guru Rinpoche, is considered the second Buddha in Nyingma school of Tibetan Buddhism. His birth is celebrated on the 10th day of the 5th month of the Tibetan calendar, believed to be the day he was miraculously born from a lotus.",
    communities: "Widely celebrated by the Buddhist community, particularly followers of the Nyingma and Kagyu sects.",
    customs: ["A grand procession carrying the portrait of Guru Rinpoche.", "Special prayers and religious ceremonies in monasteries.", "Elaborate masked dances depicting the life and eight manifestations of the Guru.", "Devotees flock to monasteries to receive blessings."],
    lat: 27.2885,
    lng: 88.5618
  }
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
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
    const [locationError, setLocationError] = useState('');

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };
    
    const handleFindNearbyEvents = () => {
        setLocationStatus('loading');
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const now = new Date();
                const currentMonth = now.getMonth();
                const upcomingMonths = [(currentMonth) % 12, (currentMonth + 1) % 12, (currentMonth + 2) % 12];

                const nearby = sikkimEvents.filter(event => {
                    const distance = getDistance(latitude, longitude, event.lat, event.lng);
                    const isUpcoming = upcomingMonths.includes(event.month);
                    return distance < 50 && isUpcoming; // 50km radius
                }).sort((a, b) => {
                    // Sort primarily by month, then by day
                    if (a.month !== b.month) {
                        // Handle year wrap around for sorting
                        let monthA = a.month < currentMonth ? a.month + 12 : a.month;
                        let monthB = b.month < currentMonth ? b.month + 12 : b.month;
                        return monthA - monthB;
                    }
                    return a.day - b.day;
                });
                
                setNearbyEvents(nearby);
                setLocationStatus('success');
            },
            () => {
                setLocationError("Unable to retrieve your location. Please grant permission in your browser settings.");
                setLocationStatus('error');
            }
        );
    };


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

                    {/* Nearby Events Section */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="bg-brand-gray/50 border border-brand-light-gray/20 rounded-xl shadow-lg p-6 text-center">
                            <h2 className="text-2xl font-bold text-white">Find Upcoming Events Near You</h2>

                            {locationStatus === 'idle' && (
                                <>
                                    <p className="mt-2 text-brand-text-secondary">Grant location access to discover festivals happening close by.</p>
                                    <button
                                        onClick={handleFindNearbyEvents}
                                        className="mt-4 inline-flex items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105"
                                    >
                                        <CrosshairIcon />
                                        <span>Find Events Near Me</span>
                                    </button>
                                </>
                            )}
                             {locationStatus === 'loading' && (
                                <div className="mt-4 flex flex-col items-center justify-center text-center p-4">
                                    <SpinnerIcon />
                                    <p className="mt-4 text-brand-text-secondary">Getting your location...</p>
                                </div>
                            )}

                             {locationStatus === 'error' && (
                                <div className="mt-4">
                                    <p className="text-red-400">{locationError}</p>
                                     <button
                                        onClick={handleFindNearbyEvents}
                                        className="mt-4 inline-flex items-center space-x-2 px-4 py-2 font-semibold bg-brand-light-gray text-white rounded-md hover:bg-brand-light-gray/80 transition-colors"
                                    >
                                        <span>Try Again</span>
                                    </button>
                                </div>
                            )}

                             {locationStatus === 'success' && (
                                <div className="mt-6">
                                    {nearbyEvents.length > 0 ? (
                                        <div className="space-y-8 text-left">
                                            {nearbyEvents.map(event => (
                                                <EventCard key={event.name} event={event} onClick={() => setSelectedEvent(event)} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-brand-text-secondary">No upcoming events found near your location in the next 3 months. Explore the full calendar below.</p>
                                    )}
                                </div>
                            )}
                        </div>
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
                        <h2 className="text-3xl font-bold text-white text-center">All Major Festivals</h2>
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