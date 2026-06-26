/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import React from 'react';
import { Search, MapPin, Filter, SlidersHorizontal, ChevronRight, Building, Loader2 } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { apiClient } from '../../services/apiClient';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'
import { HotelExplorerGrid } from '../../pages/hotel/HotelExplorer'
import verifiedSpacesImg from '../../assets/facade2.jpg'
import portfolioYieldImg from '../../assets/modern-facade.jpg'
import { useParams} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';



export const PropertyFeed = () => {

  const { id } = useParams(); 
 

  

  // Controlled console inputs
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBudget, setSearchBudget] = useState('any');

  
  
  // Central core application states
  const [properties, setProperties] = useState([]);
  const [isSearching, setIsSearching] = useState(true); // Default to true to trigger shimmers on mount
  const [activeCategoryView, setActiveCategoryView] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // =======================================================================
  // 🟢 NEW CORE: HOSPITALITY GATEWAY AMBIENT STATES
  // ========================================================================
  const [currentView, setCurrentView] = useState('landing'); // view routes: 'landing' | 'hotels'
  const [liveHotels, setLiveHotels] = useState([]);
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);

  const HERO_PHRASES = [
  { text: "Rent.", type: "rentals", metric: "4,200+ Premium Listings Live" },
  { text: "Shortlet.", type: "shortlets", metric: "1,850+ Verified Stays Available" },
  { text: "Purchase.", type: "acquisitions", metric: "₦3.5B+ Handpicked Asset Portfolio" }
];

const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentPhrase = HERO_PHRASES[phraseIdx].text;
    
    // Smooth timing variations for writing vs backspacing
    const typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
      }, typingSpeed);
    }

    // Node state transition checkpoints
    if (!isDeleting && displayedText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // Hold word on screen
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length); // Advance to next phrase
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIdx]);

  const activeType = HERO_PHRASES[phraseIdx].type;

  // =======================================================================
  // 1. CENTRAL DATABASE LOOKUP ENGINE (UNIFIED & SINGLE-SOURCE)
  // =======================================================================
  const executeSearch = async (e, locationOverride, budgetOverride) => {
    if (e) e.preventDefault();
    setIsSearching(true);

    const locationValue = locationOverride !== undefined ? locationOverride : searchLocation;
    const budgetValue = budgetOverride !== undefined ? budgetOverride : searchBudget;

    try {
      const params = new URLSearchParams();
      
      // 1. Location Parameter
      if (locationValue.trim()) {
        params.append('location', locationValue.trim());
      }
      
      // 2. Smart Budget Parser
      if (budgetValue !== 'any') {
        if (budgetValue.startsWith('<')) {
          params.append('maxBudget', budgetValue.replace('<', ''));
        } else if (budgetValue.startsWith('>')) {
          params.append('minBudget', budgetValue.replace('>', ''));
        } else if (budgetValue.includes('-')) {
          const [min, max] = budgetValue.split('-');
          params.append('minBudget', min);
          params.append('maxBudget', max);
        } else {
          params.append('maxBudget', budgetValue);
        }
      }

      // Executes query seamlessly via your frontend apiClient
      const response = await apiClient.get(`/properties/search?${params.toString()}`);
      
      const fetchedItems = response.data?.data?.properties || response.data?.properties || [];
      
      if (fetchedItems && fetchedItems.length > 0) {
        // 🚨 THE TRANSLATION ENGINE (Feeds clean variables directly to your PropertyCard grid)
        const calibratedProperties = fetchedItems.map((item, index) => ({
          ...item,
          id: item._id || item.id,
          
          image: (item.mediaUrls && item.mediaUrls.length > 0) 
            ? item.mediaUrls[0] 
            : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
            
          price: `₦${Number(item.pricePerAnnum || 0).toLocaleString()}`,
          
          // 🟢 SURGICAL CAPTURE: Forwarding live database metrics directly to your cards
          corporateName: item.corporateName || 'Premium Agency Partner',
          agencyCreatedAt: item.agencyCreatedAt || item.createdAt,

          
          
          span: index === 0 ? 'md:col-span-2 md:row-span-2' : 
                index === 2 ? 'md:col-span-3 md:row-span-2' : 
                'md:col-span-1 md:row-span-1'
        }));
        
        setProperties(calibratedProperties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.warn('🚨 [Catalog Engine Error]: Search payload unreachable:', err);
      setProperties([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Run database lookup exactly once on initialization
  useEffect(() => {
    executeSearch();
    
  }, []);

  const handleBudgetChange = (e) => {
    const selectedBudget = e.target.value;
    setSearchBudget(selectedBudget);

    // Instantly execute the search with the new budget, bypassing the submit button
    executeSearch(null, searchLocation, selectedBudget);
  };

  const checkIsVideo = (url) => {
    if (!url) return false;
    return url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|quicktime)$/i);
  };


  // =======================================================================
  // 2. ULTRA-ROBUST NEIGHBORHOOD AGGREGATION ENGINE
  // =======================================================================
  const liveNeighborhoods = React.useMemo(() => {
    if (!properties || !Array.isArray(properties)) return [];
    
    const aggregation = properties.reduce((acc, property) => {
      let locality = null;
      
      if (property.location) {
        if (typeof property.location === 'object') {
          locality = property.location.locality;
        } else if (typeof property.location === 'string') {
          try {
            const parsed = JSON.parse(property.location);
            locality = parsed.locality;
          } catch (e) {
            locality = property.location.split(',')[0].trim();
            console.warn(e)
          }
        }
      }
      
      if (!locality) {
        locality = property.locality || property.district || property.neighborhood;
      }

      if (!locality) return acc;
      
      const normalizedKey = locality.trim();

      if (!acc[normalizedKey]) {
        acc[normalizedKey] = {
          name: normalizedKey,
          count: 0,
          image: property.image || (property.mediaUrls && property.mediaUrls[0]) || null
        };
      }
      
      if (property.isAvailable !== false) {
        acc[normalizedKey].count += 1;
      }
      
      return acc;
    }, {});

    const curatedNeighborhoodCovers = {
      "Apo": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
      "Maitama": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      "Wuse": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      "Ikoyi": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80",
      "Lekki": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
    };

    const premiumFallbackShowcases = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80"
    ];

    return Object.values(aggregation).map((loc, index) => ({
      id: `locality-${loc.name}-${index}`,
      name: loc.name,
      count: `${loc.count} ${loc.count === 1 ? 'Listing' : 'Listings'}`,
      image: curatedNeighborhoodCovers[loc.name] || loc.image || premiumFallbackShowcases[index % premiumFallbackShowcases.length]
    }));
    
  }, [properties]);

  // =======================================================================
  // 🟢 3. HOSPITALITY CORES DATABASE INGESTION ENGINE
  // =======================================================================
  useEffect(() => {
    if (currentView === 'hotels') {
      const fetchHotelCollection = async () => {
        setIsLoadingHotels(true);
        try {
          const response = await apiClient.get('/hotels');
          
          // 🔍 MONITORING TERMINAL: Press F12 in your browser to inspect this log
          console.log('📡 [Hospitality API Payload Matrix]:', response.data);
          
          const payload = response.data;
          let fetchedHotels = [];
          
          // Ultra-flexible structural parser to unwrap backend response arrays safely
          if (Array.isArray(payload)) {
            fetchedHotels = payload;
          } else if (payload && typeof payload === 'object') {
            fetchedHotels = payload.hotels || payload.data?.hotels || payload.data || [];
          }
          
          // Hard guard clause to guarantee state only receives clean array blocks
          setLiveHotels(Array.isArray(fetchedHotels) ? fetchedHotels : []);
          
        } catch (error) {
          console.warn('🚨 [Hospitality Engine Error]: Collection database unreachable:', error);
          setLiveHotels([]);
        } finally {
          setIsLoadingHotels(false);
        }
      };

      fetchHotelCollection();
    }
  }, [currentView]);


  const handleLocationChange = (e) => {
    const inputValue = e.target.value;
    setSearchLocation(inputValue);

    if (inputValue.trim() === '') {
      executeSearch(null, '');
    }
  };

  // =======================================================================
  // CONDITIONAL VIEW BALANCING (Bypasses regular page layout if Hotels are active)
  // =======================================================================
  if (currentView === 'hotels') {
  return (
    <HotelExplorerGrid 
      hotels={liveHotels} 
      isLoading={isLoadingHotels}
      onBack={() => setCurrentView('landing')} // 🟢 This will now work perfectly
      darkMode={true}
    />
  );
}

const activeSEOProperty = id ? properties.find(p => (p._id === id || p.id === id)) : null;

  return (
    <div className="bg-brand-midnight text-white min-h-screen font-sans pb-20">
      
      {/* =======================================================================
    1. CINEMATIC HERO & BRANDING (CLEAN & SECURE VIEWPORT)
    ======================================================================= */}
<div className="relative pt-20 md:pt-28 pb-10 px-6 md:px-10 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
  
  {/* Abstract Multilayered Glow Effects (Now safely bound inside the parent) */}
  <div className="absolute top-10 left-10 w-72 h-72 bg-brand-cobalt/10 rounded-full blur-[100px] pointer-events-none" />
  <div className="absolute bottom-0 right-10 w-72 h-72 bg-brand-coral/5 rounded-full blur-[100px] pointer-events-none hidden md:block" />

  {/* Main Typographic Column */}
  <div className="max-w-2xl relative z-10 flex-1 text-center md:text-left">
    
    {/* High-Impact Headline with Premium Self-Writing Engine */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.1] mb-6 text-white min-h-[165px] md:min-h-[auto]">
        Rent, Shortlet, <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cobalt via-indigo-200 to-brand-gold relative inline-block">
          {displayedText}
          {/* Sleek Minimalist Terminal Blinking Cursor */}
          <span className="absolute -right-2 md:-right-4 top-0 text-white animate-pulse font-light">|</span>
        </span>
      </h1>
      
      {/* Clean, targeted explanation directly guiding focus + Contextual Wonder */}
      <div className="space-y-4">
        <p className="text-brand-slate/70 text-base md:text-xl leading-relaxed max-w-xl font-medium transition-all duration-500">
          The exclusive marketplace for premium{' '}
          <span className={`transition-all duration-300 px-1 rounded-md ${
            activeType === 'rentals' ? 'text-white font-black bg-brand-cobalt/10 shadow-sm shadow-brand-cobalt/5' : 'text-brand-slate/90'
          }`}>
            rentals
          </span>
          , bespoke{' '}
          <span className={`transition-all duration-300 px-1 rounded-md ${
            activeType === 'shortlets' ? 'text-brand-gold font-black bg-brand-gold/10 shadow-sm shadow-brand-gold/5' : 'text-brand-slate/90'
          }`}>
            shortlets
          </span>
          , and luxury{' '}
          <span className={`transition-all duration-300 px-1 rounded-md ${
            activeType === 'acquisitions' ? 'text-white font-black bg-white/10' : 'text-brand-slate/90'
          }`}>
            acquisitions
          </span>{' '}
          curated specifically for your lifestyle.
        </p>

        {/* 🟢 The "Wonder" Asset: Live Contextual Micro-Feed Data Ticker */}
        <div className="h-6 overflow-hidden relative">
          <div 
            key={phraseIdx} 
            className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase animate-fade-in-up"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {HERO_PHRASES[phraseIdx].metric}
          </div>
        </div>
      </div>
      </div>


{/* 🟢 SURGICAL UPDATE: Added '-mt-8 mb-6' to shift layout upward and protect breathing room */}
<div className="relative z-10 hidden md:flex flex-col gap-4 w-full max-w-xs shrink-0 select-none -mt-8 mb-6">
  
  {/* Metric Card 1: Verified Spaces */}
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-premium relative h-44 overflow-hidden group transition-all duration-500 hover:border-white/20">
    {/* Full-Bleed Background Image (Supports standard .jpg / .jpeg) */}
    <img 
      src={verifiedSpacesImg}
      alt="Premium Architectural Facade" 
      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
    />
    {/* Premium Gradient Overlay Shield */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-transparent z-10" />
    
    {/* Core Context Content */}
    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/50 w-max">
        Verified Real Estate
      </span>
      <div>
        <p className="text-white font-display font-black text-3xl tracking-tight leading-none">
          148 <span className="text-xs font-normal text-white/40 font-sans tracking-normal ml-1">Active Portfolios</span>
        </p>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-2.5 font-mono">
          Rentals & Luxury Shortlets
        </p>
      </div>
    </div>
  </div>

  {/* Metric Card 2: Asset Utilization */}
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-premium relative h-44 overflow-hidden group transition-all duration-500 hover:border-white/20">
    {/* Full-Bleed Background Image */}
    <img 
      src={portfolioYieldImg}
      alt="Luxury Interior Aesthetic"
      className="absolute inset-0 w-full h-full object-cover opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
    />
    {/* Premium Gradient Overlay Shield */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-transparent z-10" />
    
    {/* Core Context Content */}
    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/50 w-max">
        Asset Utilization
      </span>
      <div>
        <p className="text-white font-display font-black text-3xl tracking-tight leading-none">
          94.2% <span className="text-xs font-normal text-emerald-400 font-sans tracking-normal ml-1">Optimal</span>
        </p>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-2.5 font-mono">
          Operational Occupancy
        </p>
      </div>
    </div>
  </div>
</div>
</div>


{/* 🟢 SEO SURGERY: Invisible Metadata Engine for Google & Social Previews */}
      {activeSEOProperty && (
        <Helmet>
          <title>{`${activeSEOProperty.title || 'Premium Listing'} | Rentals Africa`}</title>
          <meta name="description" content={activeSEOProperty.description?.substring(0, 155) || 'Explore exclusive luxury properties and premium shortlets across Africa.'} />
          
          {/* World-Class Social Media Card Formatting */}
          <meta property="og:title" content={activeSEOProperty.title || 'Premium Listing'} />
          <meta property="og:description" content={activeSEOProperty.description?.substring(0, 155)} />
          <meta property="og:image" content={activeSEOProperty.image} />
          <meta property="og:url" content={`https://rentalsafrica.com/properties/${id}`} />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
      )}

      {/* =======================================================================
          2. THE SEARCH CONSOLE (GLASSMORPHISM)
          ======================================================================= */}
      <div className="px-6 md:px-10 max-w-[1200px] mx-auto relative z-20 -mt-6 md:-mt-10 mb-16">
        <form onSubmit={(e) => executeSearch(e)} className="bg-[#1a233a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-premium flex flex-col md:flex-row items-center gap-4">
          
          <div className="flex-1 w-full bg-white/5 rounded-xl flex items-center px-4 py-3.5 border border-transparent focus-within:border-brand-cobalt/50 transition-colors">
            <MapPin size={18} className="text-brand-gold shrink-0 mr-3" />
            
            <input 
              type="text" 
              value={searchLocation}
              onChange={handleLocationChange}
              placeholder="Where do you want to live?" 
              className="w-full bg-transparent border-none text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:w-48 bg-white/5 rounded-xl flex items-center px-4 py-3.5 border border-transparent focus-within:border-brand-cobalt/50 transition-colors">
              <Filter size={18} className="text-white/40 shrink-0 mr-3" />
              <select 
                value={searchBudget}
                onChange={handleBudgetChange}
                className="w-full bg-transparent border-none text-sm text-white/80 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="any" className="bg-brand-midnight">Any Budget</option>
                <option value="<100000" className="bg-brand-midnight">Less than ₦100k</option>
                <option value="100000-500000" className="bg-brand-midnight">₦100k - ₦500k</option>
                <option value="500000-1000000" className="bg-brand-midnight">₦500k - ₦1M</option>
                <option value="1000000-5000000" className="bg-brand-midnight">₦1M - ₦5M</option>
                <option value="5000000-10000000" className="bg-brand-midnight">₦5M - ₦10M</option>
                <option value="10000000-50000000" className="bg-brand-midnight">₦10M - ₦50M</option>
                <option value=">50000000" className="bg-brand-midnight">Greater than ₦50M</option>
              </select>
            </div>

            <button type="button" className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors shrink-0">
              <SlidersHorizontal size={20} />
            </button>

            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-brand-cobalt hover:bg-brand-cobalt/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-cobalt/20 shrink-0 flex items-center justify-center gap-2 min-w-[120px]"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span className="hidden md:inline">{isSearching ? 'Scanning...' : 'Search'}</span>
            </button>
          </div>
        </form>
      </div>

    {/* =======================================================================
    3. HORIZONTAL LOCATION EXPLORER (PRISTINE, FUNCTIONAL & LIVE)
    ======================================================================= */}
<div className="mb-20">
  <div className="px-6 md:px-10 max-w-[1400px] mx-auto flex items-end justify-between mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Prime Neighborhoods</h2>
      <p className="text-white/40 text-sm mt-1">Explore exclusive properties by district.</p>
    </div>
    
    <button 
      onClick={() => {
        setSearchLocation('');
        executeSearch(null, '');
      }}
      className={`items-center gap-1 text-sm font-bold text-brand-gold hover:text-white transition-colors py-2 md:py-0 ${
        searchLocation ? 'flex' : 'hidden md:flex'
      }`}
    >
      View All <ChevronRight size={16} />
    </button>
  </div>

  {/* The Snapping Horizontal Scroll Container */}
  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 md:px-10 pb-4">
    
    {/* =========================================================================
        PREMIUM LEFTMOST PROPERTY TYPE ANCHOR: HOTELS
        ========================================================================= */}
    <div 
      onClick={() => setCurrentView('hotels')}
      className="relative w-[280px] h-[360px] shrink-0 snap-start rounded-3xl overflow-hidden group cursor-pointer border border-brand-cobalt/20 shadow-xl shadow-brand-cobalt/5 bg-black"
    >
      {/* High-End Editorial Contextual Background */}
      <img 
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" 
        alt="Luxury Hospitality Portal" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000 ease-out"
        loading="lazy"
      />
      {/* Linear Matrix Overlay Layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 group-hover:via-black/20 transition-all duration-500"></div>
      
      {/* Ultra-Bold Editorial Typography Stack */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-xl bg-brand-cobalt/20 backdrop-blur-md border border-brand-cobalt/30 flex items-center justify-center text-brand-cobalt">
            <Building size={20} />
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-cobalt bg-brand-cobalt/10 border border-brand-cobalt/20 px-2.5 py-1 rounded-md">
            Premium Hotels
          </span>
        </div>

        <div>
          <p className="text-[10px] font-mono font-black text-brand-gold uppercase tracking-widest mb-1">
            Browse Collection
          </p>
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none mb-2">
            Hotels
          </h2>
          <p className="text-xs text-white/60 font-medium leading-normal max-w-[200px]">
            Explore elite five-star hotel portfolios and presidential suite configurations.
          </p>
        </div>
      </div>
    </div>

    {/* =========================================================================
        DYNAMIC NEIGHBORHOOD REGISTRIES LAYER
        ========================================================================= */}
    {isSearching ? (
      /* World-Class Shimmer Loading Skeletons */
      Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={`skeleton-loc-${i}`}
          className="relative w-[280px] h-[360px] shrink-0 bg-white/[0.03] border border-white/5 rounded-3xl animate-pulse flex flex-col justify-end p-6"
        >
          <div className="h-6 w-2/3 bg-white/10 rounded-md mb-2" />
          <div className="h-4 w-1/3 bg-white/5 rounded-md" />
        </div>
      ))
    ) : !liveNeighborhoods || liveNeighborhoods.length === 0 ? (
      /* Minimalist Luxury Empty State */
      <div className="w-full flex items-center justify-center py-12 text-white/20 text-xs uppercase tracking-widest font-mono">
        No neighborhood registries cataloged yet
      </div>
    ) : (
      liveNeighborhoods.map((loc) => (
        <div 
          key={loc.id} 
          onClick={() => {
            setSearchLocation(loc.name);
            executeSearch(null, loc.name);
          }}
          className="relative w-[280px] h-[360px] shrink-0 snap-start rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-premium"
        >
          {/* 🎯 SURGICAL MEDIA ADJUSTMENT: Dynamically handle video backgrounds for premium neighborhood cards */}
          {typeof checkIsVideo === 'function' && checkIsVideo(loc.image) ? (
            <video
              src={loc.image}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-1000 group-hover:scale-105"
              style={{ contentVisibility: 'auto' }}
            />
          ) : (
            <img 
              src={loc.image} 
              alt={`${loc.name} District View`} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              loading="lazy"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/30 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h3 className="text-xl font-display font-bold text-white mb-1 tracking-tight">{loc.name}</h3>
            
            {/* Live Counter Pill */}
            <div className="inline-flex items-center gap-1.5 bg-brand-midnight/60 backdrop-blur-md border border-white/5 px-2.5 py-1 rounded-md mt-1">
              <span className="w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
              <p className="text-brand-gold text-[10px] font-mono font-bold tracking-widest uppercase">
                {loc.count}
              </p>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>

      {/* =======================================================================
        4. FEATURED LISTINGS GRID WITH DYNAMIC PAGINATION
        ======================================================================= */}
    <div className="px-6 md:px-10 max-w-[1400px] mx-auto mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Listings</h2>
          <p className="text-white/40 text-sm mt-1">Hand-picked premium spaces available right now.</p>
        </div>
      </div>

      {/* The Grid: Takes the properties array, slices it to only show up to the 
        visibleCount, and maps them cleanly.
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[450px] gap-6">
        {properties.slice(0, visibleCount).map((prop) => (
          <PropertyCard key={prop._id || prop.id} property={prop}  />
        ))}
      </div>
      
      {/* The Pagination Controller: Only renders the button if there are 
        more properties left in the database array to show.
      */}
      {visibleCount < properties.length && (
        <div className="mt-12 text-center animate-in fade-in duration-300">
          <button 
            onClick={() => setVisibleCount((prevCount) => prevCount + 6)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all inline-flex items-center gap-2 transform active:scale-95"
          >
            Load More Properties
          </button>
        </div>
      )}
    </div>

       {/* =======================================================================
          5. HORIZONTAL PROPERTY TYPE EXPLORER (REAL DATA & MEDIA FIX)
          ======================================================================= */}
      <div className="mb-24 w-full">
        <div className="px-6 md:px-10 max-w-[1400px] mx-auto flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Browse by Collection</h2>
            <p className="text-white/40 text-sm mt-1">Curated classes matching your specific structural preferences.</p>
          </div>
        </div>

        {/* The Snapping Horizontal Track */}
        <div 
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-10 pb-6 scrollbar-hide-type-feed"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[
            { id: 'house', label: 'Houses & Duplexes', fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600' },
            { id: 'penthouse', label: 'Luxury Penthouses', fallback: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600' },
            { id: 'apartment', label: 'Serviced Apartments', fallback: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600' },
            { id: 'shortlet', label: 'Vacation Shortlets', fallback: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600' },
            { id: 'land', label: 'Premium Land Allocations', fallback: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600' },
            { id: 'commercial', label: 'Commercial Office Spaces', fallback: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600' },
            { id: 'terraced', label: 'Terraced Townhouses', fallback: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=600' }
          ].map((cat) => {
            
            // 1. DYNAMIC DATA INJECTION: Count exactly how many assets match this category
            const matchingListings = properties.filter(p => p.propertyType === cat.id);
            const inventoryCount = matchingListings.length;
            
            // 2. 🚨 THE MEDIA URL FIX 🚨
            // We check the real database for mediaUrls. If the category has properties, 
            // it uses the first real image. If it has 0 properties, it uses the fallback.
            const activeImage = inventoryCount > 0 && matchingListings[0]?.mediaUrls?.length > 0
              ? matchingListings[0].mediaUrls[0] 
              : cat.fallback;

            return (
              <div 
                key={cat.id}
                onClick={() => {
                  if (inventoryCount > 0) {
                    setActiveCategoryView(cat.id);
                  } else {
                    toast(`New ${cat.label.toLowerCase()} coming soon!`, {
                      icon: '⏳',
                      style: {
                        borderRadius: '10px',
                        background: '#1E293B',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)'
                      },
                    });
                  }
                }}
                className="relative w-[290px] sm:w-[320px] md:w-[360px] h-[380px] shrink-0 snap-start rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
              >
                {/* Image Component rendering the Real DB Image or Fallback */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
                
                {/* Midnight Protection Gradient Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/40 to-transparent transition-opacity duration-500" />
                
                {/* Card Content Layout */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
                  <span className="inline-block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black text-white mb-4 border border-white/10 uppercase tracking-widest w-fit shadow-md">
                    {inventoryCount} {inventoryCount === 1 ? 'Asset' : 'Assets'} Available
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight leading-none">
                    {cat.label}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Style Block to Safely Remove Horizontal Scrollbar Shadows */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide-type-feed::-webkit-scrollbar {
          display: none;
        }
      `}} />

      {/* =======================================================================
          6. FULL-SCREEN COLLECTION OVERLAY (Dynamic Filtered View)
          ======================================================================= */}
      {activeCategoryView && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
          
          {/* Glassmorphism Sticky Header */}
          <div className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
            <div>
              <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-1">
                Curated Collection
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-black text-white capitalize">
                {/* Dynamically translates 'shortlet' back to 'Vacation Shortlets' */}
                {
                  {
                    house: 'Houses & Duplexes',
                    penthouse: 'Luxury Penthouses',
                    apartment: 'Serviced Apartments',
                    shortlet: 'Vacation Shortlets',
                    land: 'Premium Land Allocations',
                    commercial: 'Commercial Office Spaces',
                    terraced: 'Terraced Townhouses'
                  }[activeCategoryView] || activeCategoryView
                }
              </h2>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveCategoryView(null)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 md:px-6 md:py-3 rounded-full md:rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              <span className="hidden md:inline">Close Collection</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Filtered Grid Layout */}
          <div className="px-6 md:px-10 max-w-[1400px] mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[450px] gap-6 md:gap-8">
              {properties
                .filter(prop => prop.propertyType === activeCategoryView)
                .map(prop => (
                  /* Your exact, unmodified PropertyCard! */
                  <PropertyCard key={prop._id || prop.id} property={prop} />
                ))
              }
            </div>
          </div>
          
        </div>
      )}

    </div>

    
  );
};