

import { useState, useEffect } from 'react';
import { MapPin, BedDouble, Bath, X, ChevronLeft, ChevronRight, Send, Heart, ShieldCheck, CalendarDays, Star, ArrowRight } from 'lucide-react';
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

  const [portfolioProperties, setPortfolioProperties] = useState([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

// Inside PropertyCard.jsx:
const liveRating = property.averageRating && property.averageRating > 0 ? property.averageRating : 'New';
const reviewCount = property.numberOfReviews || 0;

// =======================================================================
// REVIEWS STATE ENGINE & BACKGROUND STORAGE
// =======================================================================
const [reviews, setReviews] = useState([]);
const [isLoadingReviews, setIsLoadingReviews] = useState(false);
const [isSubmittingReview, setIsSubmittingReview] = useState(false);

// Form Ingestion Parameters
const [userRating, setUserRating] = useState(5);
const [userComment, setUserComment] = useState('');
const [hoverRating, setHoverRating] = useState(0);

const propertyId = property?._id || property?.id || property?.propertyId;

useEffect(() => {
  const fetchPropertyReviews = async () => {
    // Prevent execution if structural tracking parameters are missing
    if (!isOpen || !propertyId) {
      console.warn('⚠️ [Reviews Fetch Skipped]: Card not open or propertyId missing layout profile.');
      return;
    }
    
    setIsLoadingReviews(true);
    try {
      // Diagnostic tracking log
      console.log(`📡 Fetching logs from stream pipeline for asset target ID: ${propertyId}`);
      
      const response = await apiClient.get(`/properties/reviews?propertyId=${propertyId}`);
      
      setReviews(response.data?.data?.reviews || []);
    } catch (err) {
      console.warn('🚨 [Reviews Fetch Error]:', err?.response?.data || err.message);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  fetchPropertyReviews();
}, [isOpen, propertyId]);

// 2. Transmit New Verified Feedback Review Payload
const handleSubmitReview = async (e) => {
  e.preventDefault();
  if (!userComment.trim()) return;

  setIsSubmittingReview(true);
  try {
    const response = await apiClient.post('/properties/reviews', {
      propertyId,
      rating: userRating,
      review: userComment
    });

    if (response.data?.status === 'success') {
      // Clear tracking form variables seamlessly
      setUserComment('');
      setUserRating(5);
      
      // Refresh local review state stack natively
      const freshReviewsResponse = await apiClient.get(`/properties/reviews?propertyId=${propertyId}`);
      setReviews(freshReviewsResponse.data?.data?.reviews || []);
      
      // Optional: Inform user via notification or alert framework if available
    }
  } catch (err) {
    console.error('🚨 [Review Transmission Fault]: Check auth state parameters:', err?.response?.data?.message || err.message);
    alert(err?.response?.data?.message || 'Authentication required to post active verified reviews.');
  } finally {
    setIsSubmittingReview(false);
  }
};

useEffect(() => {
  const fetchAgencyPortfolio = async () => {
    // Only fetch if the modal overlay is active and an agencyId exists
    if (!isOpen || !property.agencyId) return;
    
    setIsLoadingPortfolio(true);
    try {
      // Fetch matching properties from your high-performance engine
      // Requesting 6 to ensure we get 5 options even after filtering out the current listing
      const response = await apiClient.get(`/properties/search?agencyId=${property.agencyId}&limit=6`);
      const fetchedItems = response.data?.data?.properties || response.data?.properties || [];
      
      const currentId = property._id || property.id;
      
      // 🚨 EXCLUSION ENGINE: Remove the current property being viewed from its own portfolio block
      const calibratedPortfolio = fetchedItems
        .filter((item) => (item._id || item.id) !== currentId)
        .slice(0, 5) // Lock explicitly to a max of 5 items
        .map((item) => ({
          ...item,
          id: item._id || item.id,
          image: (item.mediaUrls && item.mediaUrls.length > 0) 
            ? item.mediaUrls[0] 
            : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
          formattedPrice: `₦${Number(item.pricePerAnnum || 0).toLocaleString()}`
        }));

      setPortfolioProperties(calibratedPortfolio);
    } catch (err) {
      console.warn('🚨 [Portfolio Fetch Error]: Unreachable agency network:', err);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  fetchAgencyPortfolio();
}, [isOpen, property.agencyId, property._id, property.id]);
  
  // 🟢 SURGICAL UPDATE: Extract 'user' state to check active collection statuses
  const { isAuthenticated, setUser, user } = useAuthStore();

  // 🟢 SURGICAL UPDATE: Live Database Fallbacks for Media Assets
  const images = property.mediaUrls && property.mediaUrls.length > 0 
    ? property.mediaUrls 
    : [property.image || ''];

    // Dynamic Tenure Calculator
const calculateTenure = (joinDate) => {
  if (!joinDate) return 'Recently';
  
  const start = new Date(joinDate);
  const now = new Date();
  
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (diffDays < 30) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  }
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
  }
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}`;
};

// Compute runtime branding variables safely from the calibrated property object
const agencyTenure = calculateTenure(property.agencyCreatedAt);

    
  const cardBackgroundImage = property.image || images[0];

  // 🟢 SURGICAL UPDATE: Fallback parser for currency and numeric evaluations
    const displayPrice = (() => {
    // Force clean extraction of whatever numeric values exist
    const rawPrice = property.price !== undefined && property.price !== null ? Number(property.price) : null;
    const rawAnnum = property.pricePerAnnum !== undefined && property.pricePerAnnum !== null ? Number(property.pricePerAnnum) : null;
    
    // Pick whichever valid number is greater than zero
    const finalNumericValue = rawPrice || rawAnnum || 0;
    
    // If both fields are empty or zero, display fallback stance
    if (finalNumericValue === 0) {
      return 'Price on Application';
    }

    if (finalNumericValue >= 1000000000) {
      return `₦${(finalNumericValue / 1000000000).toFixed(1).replace(/\.0$/, '')} B`;
    }
    
    if (finalNumericValue >= 1000000) {
      return `₦${(finalNumericValue / 1000000).toFixed(1).replace(/\.0$/, '')} M`;
    }
    
    if (finalNumericValue >= 1000) {
      return `₦${(finalNumericValue / 1000).toFixed(1).replace(/\.0$/, '')} k`;
    }
    
    return `₦${finalNumericValue.toLocaleString()}`;
  })();

  // 🟢 SURGICAL UPDATE: Evaluate if this specific property layout is currently saved
  const isSaved = user?.savedCollections?.some(item => 
    typeof item === 'string' ? item === property._id : item?._id === property._id
  );

  const checkIsVideo = (url) => {
    if (!url) return false;
    return url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|quicktime)$/i);
  };

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
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl pointer-events-auto flex p-4 transition-all duration-300`}
    >
      <div className="flex-1 w-0 flex items-center gap-4">
        {/* Welcoming & Elegant Heart Icon Shell */}
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        
        {/* Inviting Copy Context */}
        <div className="flex-1">
          <p className="text-xs font-mono uppercase tracking-widest text-rose-400/80 font-bold">Save Your Favorites</p>
          <p className="text-sm font-medium text-white/90 mt-0.5 tracking-wide leading-relaxed">
            Create a free account to save this listing and curate your dream collection.
          </p>
        </div>
      </div>
    </div>
  ), {
    duration: 3000
  });

  // Smooth, inviting transition to the login/signup gateway
  setTimeout(() => {
    navigate('/login');
  }, 1200);
  
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
      {/* 1. Main Bento Grid Card Wrapper */}
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
        {/* 🟢 SURGICAL ADJUSTMENT 1: Added pointer-events-none and isolated layout boundaries */}
        {checkIsVideo(cardBackgroundImage) ? (
          <video
            src={cardBackgroundImage}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-transform duration-1000 group-hover:scale-105"
            style={{ contentVisibility: 'auto' }} // Forces modern layout engines to contain subpixel dimensions safely
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url(${cardBackgroundImage})` }}
          />
        )}
        
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

        {/* Floating Save/Love Action Button */}
        <button 
          onClick={handleSaveToCollection}
          className="absolute top-5 right-5 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110 shadow-lg border border-white/10 group/btn"
          aria-label="Save to Collection"
        >
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
          
          {/* Badge Container */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {/* Availability Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit transition-colors ${
              property.isAvailable 
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                : "bg-white/10 text-white/50 border border-white/5"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${property.isAvailable ? 'bg-emerald-400' : 'bg-white/30'}`} />
              {property.isAvailable ? "Market Active" : "Off-Market"}
            </div>

            {/* 🎯 SURGICAL ADDITION: Premium Property Classification Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit bg-white/10 text-brand-gold border border-brand-gold/20 backdrop-blur-md select-none transition-all">
              {(() => {
                const typeMapping = {
                  house: 'Rent',
                  penthouse: 'Elite Penthouse',
                  apartment: 'Serviced Apartment',
                  shortlet: 'Shortlet Stay',
                  land: 'Premium Land Allocation',
                  commercial: 'Commercial Workspace',
                  terraced: 'Terraced Duplex',
                  bungalow: 'Premium Bungalow',
                  house_sale: 'House For Sale'
                };

                return typeMapping[property.propertyType] || property.propertyType || 'Premium Asset';
              })()}
            </div>
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
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight shrink-0 flex items-baseline gap-1">
              {displayPrice}
              {/* 🎯 SURGICAL DATA ADJUSTMENT: Suppress layout pricing denominator suffix for outright sales entries */}
              {!['land', 'house_sale'].includes(property.propertyType) && (
                <span className="text-[10px] sm:text-xs text-white/50 font-medium uppercase tracking-widest">
                   {['shortlet', 'apartment'].includes(property.propertyType) ? 'Day' : 'Year'}
                </span>
              )}
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
          // 🟢 SURGICAL ADJUSTMENT 2: Added overflow-x-hidden to fully protect the screen width axis
          className="fixed inset-0 z-50 bg-brand-midnight/98 backdrop-blur-2xl overflow-y-auto overflow-x-hidden flex flex-col"
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
            {checkIsVideo(images[currentImageIndex]) ? (
              <video
                src={images[currentImageIndex]}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img 
                src={images[currentImageIndex]} 
                alt={`${property.title} viewing frame`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-all duration-500"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Render left/right swipe controls */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => handlePrev(e)}
                  className="absolute left-6 md:left-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-full transition-all backdrop-blur-md shadow-xl transform active:scale-90 z-20"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => handleNext(e)}
                  className="absolute right-6 md:right-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-full transition-all backdrop-blur-md shadow-xl transform active:scale-90 z-20"
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
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">
                  {['land', 'house_sale'].includes(property.propertyType) ? 'Outright Purchase Valuation' : 'Premium Valuation'}
                </p>
                <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-start md:justify-end gap-2">
                  {displayPrice}
                  {/* 🎯 SURGICAL DATA ADJUSTMENT: Suppress details short-hand denominator label for outright sales assets */}
                  {!['land', 'house_sale'].includes(property.propertyType) && (
                    <span className="text-sm md:text-lg text-white/40 font-medium uppercase tracking-widest">
                       {['shortlet', 'apartment'].includes(property.propertyType) ? 'Dy' : 'Yr'}
                    </span>
                  )}
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
                <span className="text-sm font-medium text-white/80 truncate capitalize">
                  {property.propertyType === 'house_sale' ? 'House For Sale' : property.propertyType || 'Not specified'}
                </span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-2">
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Service Charge</span>
                <span className="text-base font-bold text-white">
                  {/* 🎯 SURGICAL DATA ADJUSTMENT: Reflect complete structural lack of service charges dynamically */}
                  {['land', 'house_sale'].includes(property.propertyType) 
                    ? 'N/A (Outright Sale)' 
                    : property.serviceCharge && Number(property.serviceCharge) > 0
                    ? `₦${Number(property.serviceCharge).toLocaleString()}`
                    : '₦0'}
                </span>
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

            {/* =======================================================================
                🟢 TRUST & TRANSPARENCY: CORPORATE PROFILE ENGINE
                ======================================================================= */}
            {/* =======================================================================
    🟢 TRUST & TRANSPARENCY: CORPORATE PROFILE ENGINE & INTEGRATED REVIEWS
    ======================================================================= */}
<div className="mt-16 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
  {/* Decorative background glow */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cobalt/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
  
  {/* Profile Header Matrix */}
  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8 relative z-10">
    <div className="flex items-center gap-4 md:gap-6">
      {/* Agency Avatar */}
      <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-slate/10 border border-white/20 rounded-full flex items-center justify-center text-2xl font-black text-brand-cobalt shrink-0">
        {property.corporateName ? property.corporateName.charAt(0).toUpperCase() : 'A'}
      </div>
      
      {/* Agency Meta */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            {property.corporateName || 'Premium Agency Partner'}
          </h3>
          <ShieldCheck size={20} className="text-blue-400" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/60">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-white/40" />
            On Rentals for {agencyTenure}
          </span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          
          {/* Dynamic Database Rating Counter Badge */}
          <div className="flex items-center gap-1.5 text-amber-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
            <Star size={14} fill={liveRating !== 'New' ? 'currentColor' : 'none'} />
            <span className="text-white font-bold text-sm">
              {liveRating}
            </span> 
            {reviewCount > 0 ? (
              <span className="text-white/40 font-normal text-xs">
                ({reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'})
              </span>
            ) : (
              <span className="text-white/40 font-normal text-xs">(No reviews yet)</span>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Call to Action Matrix */}
    <button className="w-full md:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 transition-all rounded-xl text-sm font-bold tracking-wide text-white flex items-center justify-center gap-2">
      View Full Profile <ArrowRight size={16} />
    </button>
  </div>

  {/* Similar Properties Carousel Matrix */}
  <div className="relative z-10 pt-6 border-t border-white/5 mb-8">
    <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">
      More from this Portfolio
    </h4>
    
    {/* Horizontal Scroll Track */}
    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
      
      {/* A. LOADING STATE: High-End Shimmer Skeleton Tracks */}
      {isLoadingPortfolio && (
        Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="min-w-[240px] md:min-w-[280px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-32 bg-white/5" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))
      )}

      {/* B. LIVE STATE: Mapped Real Database Assets */}
      {!isLoadingPortfolio && portfolioProperties.length > 0 && (
        portfolioProperties.map((item) => (
          <div key={item.id} className="min-w-[240px] md:min-w-[280px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden snap-start group cursor-pointer hover:border-brand-cobalt/50 transition-all">
            <div className="h-32 bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-sm font-bold text-white">
                  {item.formattedPrice}
                  <span className="text-[10px] text-white/60 font-normal uppercase tracking-wider ml-1">
                    /{['shortlet', 'apartment'].includes(item.propertyType) ? 'Dy' : 'Yr'}
                  </span>
                </p>
              </div>
            </div>
            <div className="p-4">
              <h5 className="text-sm font-bold text-white/90 truncate mb-1">{item.title}</h5>
              <p className="text-xs text-white/50 flex items-center gap-1"><MapPin size={10} className="text-brand-cobalt" /> {item.locality || 'Lagos'}, {item.state || 'Nigeria'}</p>
            </div>
          </div>
        ))
      )}

      {/* C. EMPTY STATE: Graceful fallback layout if the agency has no other properties */}
      {!isLoadingPortfolio && portfolioProperties.length === 0 && (
        <div className="w-full py-4 text-left">
          <p className="text-sm font-medium text-white/40 italic">This is currently the exclusive active listing in this portfolio.</p>
        </div>
      )}
    </div>
  </div>

  {/* =======================================================================
      💎 REAL-TIME CLIENT VERIFIED REVIEWS PIPELINE (Surgically Clean & Balanced)
      ======================================================================= */}
  <div className="relative z-10 pt-6 border-t border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    {/* LEFT COLUMN: Active Review Stream Listing (7 Columns) */}
    <div className="lg:col-span-7 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
        Verified Inhabitant Feedback
      </h4>

      {isLoadingReviews ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-white/5 rounded-2xl w-full" />
          <div className="h-16 bg-white/5 rounded-2xl w-5/6" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.map((rev) => (
            <div key={rev._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl transition-all hover:bg-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-cobalt/20 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 uppercase">
                    {rev.userId?.firstName ? rev.userId.firstName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/90">
                      {rev.userId ? `${rev.userId.firstName} ${rev.userId.lastName}` : 'Anonymous User'}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Recent'}
                    </p>
                  </div>
                </div>
                {/* Micro Star Layout */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={10} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? 'text-amber-400' : 'text-white/10'} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/70 font-medium leading-relaxed pl-9">
                "{rev.review}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
          <p className="text-xs text-white/40 italic">No Reviews Yet</p>
        </div>
      )}
    </div>

    {/* RIGHT COLUMN: Premium Review Form Ingestion Interface (5 Columns) */}
    <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6">
      <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-4">
        Leave a Verification Score
      </h4>
      
      <form onSubmit={handleSubmitReview} className="space-y-4">
        {/* Interactive Star Matrix Picker */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1.5">Your Experience Rating</label>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, idx) => {
              const currentStarValue = idx + 1;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setUserRating(currentStarValue)}
                  onMouseEnter={() => setHoverRating(currentStarValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-all transform hover:scale-120 duration-150 focus:outline-none"
                >
                  <Star 
                    size={22} 
                    fill={currentStarValue <= (hoverRating || userRating) ? '#fbbf24' : 'none'} 
                    className={currentStarValue <= (hoverRating || userRating) ? 'text-amber-400' : 'text-white/20'}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Area Review Input */}
        <div>
          <label className="text-[10px] uppercase font-bold tracking-wider text-white/40 block mb-1.5">Your Statement Feedback</label>
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Share details on management execution, structural accuracy, or premium local amities..."
            maxLength={300}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand-cobalt/50 resize-none transition-all"
          />
        </div>

        {/* Submission Execution Button */}
        <button
          type="submit"
          disabled={isSubmittingReview || !userComment.trim()}
          className="w-full py-2.5 bg-brand-cobalt hover:bg-brand-cobalt/80 disabled:opacity-40 disabled:hover:bg-brand-cobalt text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isSubmittingReview ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Submit Review <Send size={12} /></>
          )}
        </button>
      </form>
    </div>
  </div>
</div>
            {/* =======================================================================
                END TRUST & TRANSPARENCY MODULE
                ======================================================================= */}

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