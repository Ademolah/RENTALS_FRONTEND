

import { useState } from 'react';
import { MapPin, BedDouble, Bath, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { TourBookingModal } from '../TourBookingModal';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';

export const PropertyCard = ({ property , hideAction = false}) => {

  // Surgical State Additions for Full Screen Engine
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // 🟢 SURGICAL UPDATE: Extract 'user' state to check active collection statuses
  const { isAuthenticated, setUser, user } = useAuthStore();

  // 🟢 SURGICAL UPDATE: Live Database Fallbacks for Media Assets
  const images = property.mediaUrls && property.mediaUrls.length > 0 
    ? property.mediaUrls 
    : [property.image || ''];
    
  const cardBackgroundImage = property.image || images[0];

  // 🟢 SURGICAL UPDATE: Fallback parser for currency and numeric evaluations
  const displayPrice = property.price || 
    (property.pricePerAnnum ? `₦${Number(property.pricePerAnnum).toLocaleString()}` : 'Price on Application');

  // 🟢 SURGICAL UPDATE: Evaluate if this specific property layout is currently saved
  const isSaved = user?.savedCollections?.some(item => 
    typeof item === 'string' ? item === property._id : item?._id === property._id
  );

  const handleNext = (e) => {
    e.stopPropagation(); // Avoid closing the modal
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); // Avoid closing the modal
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSaveToCollection = async (e) => {
    e.stopPropagation(); // Prevents launching the full-screen media viewer

    // 🛑 CONDITION 1: User is NOT logged in
    if (!isAuthenticated) {
      toast.error('Sign in to build your collection', {
        style: {
          borderRadius: '10px',
          background: '#1e293b',
          color: '#fff',
        },
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 800);
      return;
    }

    // 🟢 CONDITION 2: User IS logged in -> Route through Property Endpoint
    try {
      // We surgically leverage your existing property routing architecture
      const response = await apiClient.post(`/properties/${property._id}/save`);
      
      if (response.data?.success) {
        // Synchronize the global store user profile state if returned by the endpoint
        if (setUser && response.data.user) {
          setUser(response.data.user);
        }

        toast.success(isSaved ? 'Removed from collection' : 'Added to your collection', {
          icon: isSaved ? '🗑️' : '❤️',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Unable to update collections.';
      toast.error(errorMsg);
      console.error('Collection sync failure:', error);
    }
  };

  return (
    <>
      {/* 1. Main Bento Grid Card Wrapper (Added aspect ratio and min-height anchors for dashboard stability) */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`
          group relative overflow-hidden w-full h-full 
          md:rounded-[2rem] shadow-premium shrink-0
          snap-start snap-always cursor-pointer
          aspect-[4/5] min-h-[420px] md:min-h-[460px]
          ${property.span || 'col-span-1 row-span-1'} 
        `}
      >
        {/* Background Image with Hover Zoom Effect (Updated to use cardBackgroundImage fallback) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url(${cardBackgroundImage})` }}
        />
        
        {/* Deep Midnight Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/50 to-transparent opacity-95" />

        {/* Premium Verified Badge */}
        {property.isPremium && (
          <div className="absolute top-6 left-6 md:top-8 md:left-8 bg-brand-midnight/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-brand-gold/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase">
              Verified Premium
            </span>
          </div>
        )}

        {/* 🟢 NEW: Floating Save/Love Action Button */}
        <button 
          onClick={handleSaveToCollection}
          className="absolute top-5 right-5 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-white/10 group/btn"
          aria-label="Save to Collection"
        >
          {/* 🟢 SURGICAL UPDATE: Core visualization highlights coral immediately if item is saved */}
          <Heart 
            size={22} 
            className={`transition-all duration-300 ${
              isSaved 
                ? 'text-brand-coral fill-brand-coral' 
                : 'text-white group-hover/btn:text-brand-coral group-hover/btn:fill-brand-coral/20'
            }`} 
          />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 w-fit transition-colors ${
            property.isAvailable 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
              : "bg-white/10 text-white/50 border border-white/5"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${property.isAvailable ? 'bg-emerald-400' : 'bg-white/30'}`} />
            {property.isAvailable ? "Market Active" : "Off-Market"}
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3 leading-tight tracking-tight">
            {property.title}
          </h2>

          {/* Structural Metrics */}
          <div className="flex items-center text-brand-slate/90 mb-6 gap-4 text-xs md:text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-brand-cobalt" /> 
              {property.locality || 'Nigeria'}
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} className="text-brand-slate/60" /> 
              {property.beds || 0} Beds
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={16} className="text-brand-slate/60" /> 
              {property.baths || 0} Baths
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 mt-auto w-full">
            
            {/* 🎯 SURGICAL UPDATE 1: Swapped property.price to custom displayPrice logic */}
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight shrink-0 flex items-baseline gap-1">
              {displayPrice}
              <span className="text-[10px] sm:text-xs text-white/50 font-medium uppercase tracking-widest">
                {['shortlet', 'apartment'].includes(property.propertyType) ? 'Month' : 'Year'}
              </span>
            </p>
            
            {!hideAction && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                setIsBookingModalOpen(true); 
              }} 
              className="bg-brand-coral hover:bg-brand-coral/90 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all transform active:scale-95 shadow-md hover:shadow-lg shadow-brand-coral/20 shrink-0"
            >
              Book Tour
            </button>
  )}
          </div>
        </div>
      </div>

      {/* 2. Full Screen World-Class Media Viewer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-brand-midnight/98 backdrop-blur-2xl overflow-y-auto flex flex-col"
          onClick={() => setIsOpen(false)}
        >
          {/* Top Sticky Header Controls */}
          <div className="w-full flex justify-end p-6 md:p-8 sticky top-0 z-10">
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-full transition-all backdrop-blur-md"
            >
              <X size={24} />
            </button>
          </div>

          {/* Picture Theatre Frame */}
          <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center bg-black/20 px-4 group/carousel">
            <img 
              src={images[currentImageIndex]} 
              alt={`${property.title} viewing frame`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Render left/right swipe controls strictly if mediaUrls contains multiple entries */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className="absolute left-6 md:left-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-full transition-all backdrop-blur-md shadow-xl transform active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-6 md:right-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-full transition-all backdrop-blur-md shadow-xl transform active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Visual Slide Counter Indication */}
                <div className="absolute bottom-6 bg-brand-midnight/60 border border-white/5 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest text-white/70">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Dynamic Information Grid Container */}
          <div 
            className="w-full max-w-5xl mx-auto p-6 md:p-12 text-white mt-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-white/5 pb-8 mb-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-brand-slate/80 font-medium text-sm md:text-base">
                  <MapPin size={20} className="text-brand-cobalt" />
                  <span>{property.locality || 'Lagos'}, {property.state || 'Nigeria'}</span>
                </div>
              </div>
              <div className="text-left md:text-right shrink-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Premium Valuation</p>
                
                {/* 🎯 SURGICAL UPDATE 2: Swapped to displayPrice logic here as well */}
                <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-start md:justify-end gap-2">
                  {displayPrice}
                  <span className="text-sm md:text-lg text-white/40 font-medium uppercase tracking-widest">
                    {['shortlet', 'apartment'].includes(property.propertyType) ? '/ Mo' : '/ Yr'}
                  </span>
                </p>

              </div>
            </div>

            {/* Metrics and Specifications Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Bedrooms</span>
                <span className="flex items-center gap-2 text-lg font-bold"><BedDouble className="text-brand-slate/40" /> {property.beds || 0} Double</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Bathrooms</span>
                <span className="flex items-center gap-2 text-lg font-bold"><Bath className="text-brand-slate/40" /> {property.baths || 0} Bath</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Property Type</span>
                <span className="text-sm font-medium text-white/80 truncate">{property.propertyType || 'Not specified'}</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Service Charge</span>
                <span className="text-base font-bold text-white">₦{Number(property.serviceCharge || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Description Text block */}
            {property.description && (
              <div className="mb-12">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Architectural Overview</h3>
                <p className="text-brand-slate leading-relaxed text-sm md:text-base max-w-3xl">
                  {property.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <TourBookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        property={property} 
      />
    </>
  );
};