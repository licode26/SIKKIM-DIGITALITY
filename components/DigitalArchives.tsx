import React, { useState, useEffect } from 'react';
import { DownloadIcon } from './Icons';

type Category = 'All' | 'Manuscript' | 'Photograph' | 'Map' | 'Document';

interface ArchiveItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  downloadUrl: string;
  category: Category;
  date: string;
}

const archiveData: ArchiveItem[] = [
  { id: 1, title: 'Prajnaparamita Sutra Text', description: 'An ancient Buddhist manuscript detailing the "Perfection of Wisdom" scriptures.', imageUrl: 'https://picsum.photos/seed/Prajnaparamita/400/300', downloadUrl: 'https://picsum.photos/seed/Prajnaparamita/1200/900', category: 'Manuscript', date: 'c. 12th Century' },
  { id: 2, title: 'Gangtok Bazaar, c. 1920', description: 'A bustling street scene from early Gangtok, showing traders and traditional architecture.', imageUrl: 'https://picsum.photos/seed/GangtokBazaar/400/300', downloadUrl: 'https://picsum.photos/seed/GangtokBazaar/1200/900', category: 'Photograph', date: 'c. 1920' },
  { id: 3, title: 'Map of Independent Sikkim, 1910', description: 'A detailed cartographic representation of Sikkim\'s borders and regions prior to major geopolitical changes.', imageUrl: 'https://picsum.photos/seed/SikkimMap1910/400/300', downloadUrl: 'https://picsum.photos/seed/SikkimMap1910/1200/900', category: 'Map', date: '1910' },
  { id: 4, title: 'Sino-Sikkimese Convention of 1890', description: 'The official document defining the border between Sikkim and Tibet, signed by British and Chinese representatives.', imageUrl: 'https://picsum.photos/seed/Convention1890/400/300', downloadUrl: 'https://picsum.photos/seed/Convention1890/1200/900', category: 'Document', date: '1890' },
  { id: 5, title: 'Coronation of Chogyal Palden Thondup', description: 'Photograph capturing the historic coronation ceremony of the last king of Sikkim.', imageUrl: 'https://picsum.photos/seed/Coronation/400/300', downloadUrl: 'https://picsum.photos/seed/Coronation/1200/900', category: 'Photograph', date: '1965' },
  { id: 6, title: 'Biography of Guru Rinpoche', description: 'A sacred text written in classical Tibetan script, narrating the life of Padmasambhava.', imageUrl: 'https://picsum.photos/seed/GuruRinpocheBio/400/300', downloadUrl: 'https://picsum.photos/seed/GuruRinpocheBio/1200/900', category: 'Manuscript', date: 'c. 17th Century' },
  { id: 7, title: 'Mule Train on the Nathu La Pass', description: 'Image depicting the traditional mode of transport and trade over the high-altitude Himalayan passes.', imageUrl: 'https://picsum.photos/seed/NathuLaMules/400/300', downloadUrl: 'https://picsum.photos/seed/NathuLaMules/1200/900', category: 'Photograph', date: 'c. 1940' },
  { id: 8, title: 'Indo-Sikkim Treaty of 1950', description: 'The foundational treaty establishing the relationship between the Republic of India and the Kingdom of Sikkim.', imageUrl: 'https://picsum.photos/seed/Treaty1950/400/300', downloadUrl: 'https://picsum.photos/seed/Treaty1950/1200/900', category: 'Document', date: '1950' },
  { id: 9, title: 'British Survey Map of Trade Routes', description: 'A colonial-era map showing the key trade routes connecting Sikkim with Tibet and India.', imageUrl: 'https://picsum.photos/seed/TradeRoutesMap/400/300', downloadUrl: 'https://picsum.photos/seed/TradeRoutesMap/1200/900', category: 'Map', date: '1888' },
  { id: 10, title: 'John Claude White in Sikkim', description: 'A portrait of the first British Political Officer in Sikkim, a key figure in its history.', imageUrl: 'https://picsum.photos/seed/JCWhite/400/300', downloadUrl: 'https://picsum.photos/seed/JCWhite/1200/900', category: 'Photograph', date: 'c. 1905' },
  { id: 11, title: '18th Century Lepcha Chronicle', description: 'A rare manuscript documenting the history and folklore of the Lepcha community.', imageUrl: 'https://picsum.photos/seed/LepchaChronicle/400/300', downloadUrl: 'https://picsum.photos/seed/LepchaChronicle/1200/900', category: 'Manuscript', date: 'c. 18th Century' },
  { id: 12, title: 'Rumtek Monastery Construction', description: 'A photograph showing the early stages of construction of the new Rumtek Monastery.', imageUrl: 'https://picsum.photos/seed/RumtekConstruction/400/300', downloadUrl: 'https://picsum.photos/seed/RumtekConstruction/1200/900', category: 'Photograph', date: 'c. 1962' },
  { id: 13, title: 'Hand-drawn Map of Yuksom Region', description: 'An intricate, locally-drawn map of the first capital of Sikkim and its sacred sites.', imageUrl: 'https://picsum.photos/seed/YuksomMap/400/300', downloadUrl: 'https://picsum.photos/seed/YuksomMap/1200/900', category: 'Map', date: 'c. 1930' },
  { id: 14, title: 'Kagyur Text Fragment', description: 'A preserved section of the Kagyur, the translated words of the Buddha.', imageUrl: 'https://picsum.photos/seed/Kagyur/400/300', downloadUrl: 'https://picsum.photos/seed/Kagyur/1200/900', category: 'Manuscript', date: 'c. 16th Century' },
  { id: 15, title: 'Lepcha Weavers, c. 1930', description: 'A photograph capturing the traditional weaving techniques and attire of the Lepcha people.', imageUrl: 'https://picsum.photos/seed/LepchaWeavers/400/300', downloadUrl: 'https://picsum.photos/seed/LepchaWeavers/1200/900', category: 'Photograph', date: 'c. 1930' },
  { id: 16, title: 'Royal Decree of Chogyal Tashi Namgyal', description: 'An official proclamation from one of Sikkim\'s most reformist kings.', imageUrl: 'https://picsum.photos/seed/RoyalDecree/400/300', downloadUrl: 'https://picsum.photos/seed/RoyalDecree/1200/900', category: 'Manuscript', date: '1925' },
  { id: 17, title: 'British Residency Building', description: 'Photograph of the historic British Residency in Gangtok, a center of political activity.', imageUrl: 'https://picsum.photos/seed/BritishResidency/400/300', downloadUrl: 'https://picsum.photos/seed/BritishResidency/1200/900', category: 'Photograph', date: 'c. 1915' },
  { id: 18, title: 'Letter from the 13th Dalai Lama', description: 'Correspondence from the Dalai Lama during his exile in Sikkim, discussing matters of state and religion.', imageUrl: 'https://picsum.photos/seed/DalaiLamaLetter/400/300', downloadUrl: 'https://picsum.photos/seed/DalaiLamaLetter/1200/900', category: 'Document', date: '1910' },
  { id: 19, title: 'Portrait of Sir Thutob Namgyal', description: 'A formal portrait of the 9th Chogyal of Sikkim, who ruled during a period of significant change.', imageUrl: 'https://picsum.photos/seed/ThutobNamgyal/400/300', downloadUrl: 'https://picsum.photos/seed/ThutobNamgyal/1200/900', category: 'Photograph', date: 'c. 1895' },
  { id: 20, title: 'Monastery Distribution Map, c. 1900', description: 'A map illustrating the locations of major monasteries across Sikkim at the turn of the 20th century.', imageUrl: 'https://picsum.photos/seed/MonasteryMap/400/300', downloadUrl: 'https://picsum.photos/seed/MonasteryMap/1200/900', category: 'Map', date: 'c. 1900' }
];

const categoryColors: { [key in Category]?: string } = {
  'Manuscript': 'bg-sky-500/10 text-sky-400',
  'Photograph': 'bg-amber-500/10 text-amber-400',
  'Map': 'bg-rose-500/10 text-rose-400',
  'Document': 'bg-emerald-500/10 text-emerald-400',
};


const ArchiveCard: React.FC<{ item: ArchiveItem }> = ({ item }) => (
  <div className="bg-brand-gray rounded-xl overflow-hidden group border border-brand-light-gray/50 hover:border-brand-teal/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
    <div className="relative">
      <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[item.category] || 'bg-gray-500/10 text-gray-400'}`}>
          {item.category}
        </span>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div>
        <p className="text-sm text-brand-text-secondary">{item.date}</p>
        <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
      </div>
      <div className="mt-6 pt-4 border-t border-brand-light-gray/50 flex items-center justify-between">
         <p className="text-xs text-brand-text-secondary">High-Resolution</p>
         <a 
            href={item.downloadUrl} 
            download={`${item.title.replace(/\s/g, '_')}.jpg`}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105"
            aria-label={`Download ${item.title}`}
        >
            <DownloadIcon />
            <span>Download</span>
        </a>
      </div>
    </div>
  </div>
);


const DigitalArchives: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [filteredArchives, setFilteredArchives] = useState<ArchiveItem[]>(archiveData);

  const filters: Category[] = ['All', 'Manuscript', 'Photograph', 'Map', 'Document'];

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredArchives(archiveData);
    } else {
      setFilteredArchives(archiveData.filter(item => item.category === activeFilter));
    }
  }, [activeFilter]);

  return (
    <div className="animate-fade-in">
      <section className="py-20 sm:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Digital Archives</h1>
            <p className="mt-4 text-lg text-brand-text-secondary">
              Explore a curated collection of historical manuscripts, photographs, maps, and documents that tell the story of Sikkim's rich cultural and political heritage.
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
            {filteredArchives.map(item => (
              <ArchiveCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DigitalArchives;