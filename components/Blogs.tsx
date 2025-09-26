import React from 'react';
import { ArrowRightIcon } from './Icons';

interface BlogCardProps {
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  date: string;
}

const categoryColors: { [key: string]: string } = {
  'Culture': 'bg-sky-500/10 text-sky-400',
  'Food': 'bg-amber-500/10 text-amber-400',
  'Art & Craft': 'bg-rose-500/10 text-rose-400',
};

const BlogCard: React.FC<BlogCardProps> = ({ category, title, excerpt, imageUrl, author, date }) => (
  <div className="bg-brand-gray rounded-xl overflow-hidden group border border-brand-light-gray/50 hover:border-brand-teal/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
    <div className="relative">
      <img src={imageUrl} alt={title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div>
        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[category] || 'bg-gray-500/10 text-gray-400'}`}>
          {category}
        </span>
        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-brand-teal transition-colors duration-200">{title}</h3>
        <p className="mt-2 text-brand-text-secondary text-sm">{excerpt}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-brand-light-gray/50 flex items-center justify-between">
         <div className="flex items-center">
            <img className="h-10 w-10 rounded-full object-cover" src={author.avatarUrl} alt={author.name} />
            <div className="ml-3 text-sm">
                <p className="font-semibold text-brand-text">{author.name}</p>
                <p className="text-brand-text-secondary">{date}</p>
            </div>
        </div>
         <a href="#" className="text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-label={`Read more about ${title}`}>
            <ArrowRightIcon />
        </a>
      </div>
    </div>
  </div>
);

const Blogs: React.FC = () => {
  const blogPosts = [
    {
      category: 'Culture',
      title: 'The Mystical Dances of the Chaam Festival',
      excerpt: 'Explore the vibrant masks, traditional music, and spiritual significance behind Sikkim\'s most famous monastic dance.',
      imageUrl: 'https://picsum.photos/seed/dance/400/300',
      author: { name: 'Tenzin Wangyal', avatarUrl: 'https://i.pravatar.cc/40?u=a' },
      date: 'Oct 12, 2023'
    },
    {
      category: 'Food',
      title: 'A Culinary Journey: The Flavors of Sikkim',
      excerpt: 'From fiery Dalle Khursani to hearty Thukpa and delicate Momos, discover the unique tastes of the local food scene.',
      imageUrl: 'https://picsum.photos/seed/food/400/300',
      author: { name: 'Pema Choden', avatarUrl: 'https://i.pravatar.cc/40?u=b' },
      date: 'Oct 08, 2023'
    },
    {
      category: 'Art & Craft',
      title: 'Living Heritage: The Art of Thangka Painting',
      excerpt: 'Uncover the intricate process and deep symbolism of Thangka painting, a sacred art form passed down through generations.',
      imageUrl: 'https://picsum.photos/seed/art/400/300',
      author: { name: 'Karma Dorjee', avatarUrl: 'https://i.pravatar.cc/40?u=c' },
      date: 'Oct 02, 2023'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Stories from Sikkim</h2>
          <p className="mt-4 text-lg text-brand-text-secondary">
            Dive deep into the vibrant culture, rich history, and unique traditions of the Himalayan state.
          </p>
        </div>
        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <BlogCard key={post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;