import { Search, MapPin, Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { PropertyCard } from './PropertyCard';

// ---------------------------------------------------------------------------
// MOCK DATA ENGINES
// ---------------------------------------------------------------------------
const MOCK_LOCATIONS = [
  { id: 'l1', name: 'Ikoyi', count: '142 Properties', image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80' },
  { id: 'l2', name: 'Victoria Island', count: '98 Properties', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
  { id: 'l3', name: 'Maitama', count: '65 Properties', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80' },
  { id: 'l4', name: 'Lekki Phase 1', count: '210 Properties', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
  { id: 'l5', name: 'Asokoro', count: '45 Properties', image: 'https://images.unsplash.com/photo-1600607687931-cece5ce21448?auto=format&fit=crop&w=600&q=80' },
];

const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury 4-Bedroom Detached Duplex',
    locality: 'Ikoyi',
    price: '₦ 85,000,000 / yr',
    beds: 4,
    baths: 5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPremium: true,
    span: 'md:col-span-2 md:row-span-2', 
  },
  {
    id: '2',
    title: 'Minimalist Studio Apartment',
    locality: 'Victoria Island',
    price: '₦ 12,000,000 / yr',
    beds: 1,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    span: 'md:col-span-1 md:row-span-1', 
  },
  {
    id: '3',
    title: 'Zenith Penthouse Suite',
    locality: 'Lekki Phase 1',
    price: '₦ 150,000,000 / yr',
    beds: 5,
    baths: 6,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPremium: true,
    span: 'md:col-span-3 md:row-span-2', 
  }
];

export const PropertyFeed = () => {
  return (
    <div className="bg-brand-midnight text-white min-h-screen font-sans pb-20">
      
      {/* =======================================================================
          1. CINEMATIC HERO & BRANDING
          ======================================================================= */}
      <div className="relative pt-24 md:pt-32 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Abstract Glow Effect */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-cobalt/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <span className="text-brand-gold text-xs font-black tracking-[0.2em] uppercase mb-4 block">
            Welcome to Rentals
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight mb-6">
            Discover Exquisite <br className="hidden md:block"/> Real Estate.
          </h1>
          <p className="text-brand-slate/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 font-medium">
            The exclusive network for verified corporate agencies and discerning tenants. Find premium apartments, commercial spaces, and luxury villas curated for your lifestyle.
          </p>
        </div>
      </div>

      {/* =======================================================================
          2. THE SEARCH CONSOLE (GLASSMORPHISM)
          ======================================================================= */}
      <div className="px-6 md:px-10 max-w-[1200px] mx-auto relative z-20 -mt-6 md:-mt-10 mb-16">
        <div className="bg-[#1a233a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-premium flex flex-col md:flex-row items-center gap-4">
          
          <div className="flex-1 w-full bg-white/5 rounded-xl flex items-center px-4 py-3.5 border border-transparent focus-within:border-brand-cobalt/50 transition-colors">
            <MapPin size={18} className="text-brand-gold shrink-0 mr-3" />
            <input 
              type="text" 
              placeholder="Where do you want to live?" 
              className="w-full bg-transparent border-none text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:w-48 bg-white/5 rounded-xl flex items-center px-4 py-3.5 border border-transparent focus-within:border-brand-cobalt/50 transition-colors">
              <Filter size={18} className="text-white/40 shrink-0 mr-3" />
              <select className="w-full bg-transparent border-none text-sm text-white/80 focus:outline-none appearance-none cursor-pointer">
                <option value="any" className="bg-brand-midnight">Max Budget</option>
                <option value="10m" className="bg-brand-midnight">Up to ₦10M</option>
                <option value="50m" className="bg-brand-midnight">Up to ₦50M</option>
                <option value="100m" className="bg-brand-midnight">₦100M+</option>
              </select>
            </div>

            <button className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors shrink-0">
              <SlidersHorizontal size={20} />
            </button>

            <button className="bg-brand-cobalt hover:bg-brand-cobalt/90 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-cobalt/20 shrink-0 flex items-center gap-2">
              <Search size={16} />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* =======================================================================
          3. HORIZONTAL LOCATION EXPLORER
          ======================================================================= */}
      <div className="mb-20">
        <div className="px-6 md:px-10 max-w-[1400px] mx-auto flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Prime Neighborhoods</h2>
            <p className="text-white/40 text-sm mt-1">Explore exclusive properties by district.</p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-sm font-bold text-brand-gold hover:text-white transition-colors">
            View All <ChevronRight size={16} />
          </button>
        </div>

        {/* The Snapping Horizontal Scroll Container */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 md:px-10 pb-4">
          {MOCK_LOCATIONS.map((loc) => (
            <div 
              key={loc.id} 
              className="relative w-[280px] h-[360px] shrink-0 snap-start rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
            >
              <img 
                src={loc.image} 
                alt={loc.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/40 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-display font-bold text-white mb-1">{loc.name}</h3>
                <p className="text-brand-gold text-xs font-bold tracking-wider uppercase">{loc.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =======================================================================
          4. THE BENTO GRID FEED (FEATURED LISTINGS)
          ======================================================================= */}
      <div className="px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Listings</h2>
            <p className="text-white/40 text-sm mt-1">Hand-picked premium spaces available right now.</p>
          </div>
        </div>

        {/* Re-integrated Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[450px] gap-6">
          {MOCK_PROPERTIES.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all inline-flex items-center gap-2">
            Load More Properties
          </button>
        </div>
      </div>

    </div>
  );
};