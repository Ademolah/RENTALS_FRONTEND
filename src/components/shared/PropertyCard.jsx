import { useState } from 'react';
import { MapPin, BedDouble, Bath, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TourBookingModal } from '../TourBookingModal';

export const PropertyCard = ({ property }) => {

  // Surgical State Additions for Full Screen Engine
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Safely grab all available media URLs or fall back to the primary mapped image
  const images = property.mediaUrls && property.mediaUrls.length > 0 
    ? property.mediaUrls 
    : [property.image];

  const handleNext = (e) => {
    e.stopPropagation(); // Avoid closing the modal
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); // Avoid closing the modal
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  return (
    <>
      {/* 1. Main Bento Grid Card Wrapper (Added cursor-pointer and onClick) */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`
          group relative overflow-hidden w-full h-full 
          md:rounded-[2rem] shadow-premium shrink-0
          snap-start snap-always cursor-pointer
          ${property.span || 'col-span-1 row-span-1'} 
        `}
      >
        {/* Background Image with Hover Zoom Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url(${property.image})` }}
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white mb-3 leading-tight tracking-tight">
            {property.title}
          </h2>

          {/* Structural Metrics */}
          <div className="flex items-center text-brand-slate/90 mb-8 gap-5 text-sm md:text-base font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin size={18} className="text-brand-cobalt" /> 
              {property.locality}
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble size={18} className="text-brand-slate/60" /> 
              {property.beds} Beds
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={18} className="text-brand-slate/60" /> 
              {property.baths} Baths
            </span>
          </div>

          {/* Action Bar */}
        <div className="flex items-center justify-between gap-4 mt-auto w-full">
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight shrink-0">
            {property.price}
          </p>
          
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents launching studio view
              setIsBookingModalOpen(true); // 🚨 Opens the Concierge Desk
            }} 
            className="bg-brand-coral hover:bg-brand-coral/90 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all transform active:scale-95 shadow-md hover:shadow-lg shadow-brand-coral/20 shrink-0"
          >
            Book Tour
          </button>
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
                <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-brand-slate/80 font-medium text-base">
                  <MapPin size={20} className="text-brand-cobalt" />
                  <span>{property.locality}, {property.state || 'Nigeria'}</span>
                </div>
              </div>
              <div className="text-left md:text-right shrink-0">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Premium Valuation</p>
                <p className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  {property.price}
                </p>
              </div>
            </div>

            {/* Metrics and Specifications Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Bedrooms</span>
                <span className="flex items-center gap-2 text-xl font-bold"><BedDouble className="text-brand-slate/40" /> {property.beds} Double</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Bathrooms</span>
                <span className="flex items-center gap-2 text-xl font-bold"><Bath className="text-brand-slate/40" /> {property.baths} Bath</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Street Address</span>
                <span className="text-sm font-medium text-white/80 truncate">{property.streetAddress || 'Not specified'}</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Service Charge</span>
                <span className="text-lg font-bold text-white">₦{Number(property.serviceCharge || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Description Text block */}
            {property.description && (
              <div className="mb-12">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-3">Architectural Overview</h3>
                <p className="text-brand-slate leading-relaxed text-base md:text-lg max-w-3xl">
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

