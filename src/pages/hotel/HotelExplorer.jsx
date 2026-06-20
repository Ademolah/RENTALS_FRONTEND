import { Star, MapPin, Shield, ArrowRight, ArrowLeft, Building, MessageSquare } from 'lucide-react';
import { ReservationModal } from './HotelReservation';
import { useState } from 'react';
import { HotelCardCarousel } from './HotelCardCarousel';
import { HotelDetailsModal } from './HotelDetailsModal';
// Assuming you have or will create this full-page/modal details component:
// import { HotelDetailsModal } from './HotelDetailsModal'; 

export const HotelExplorerGrid = ({ hotels, onBack, darkMode = true }) => {
  // Tracks which hotel asset is actively opening the reservation checkout
  const [activeHotel, setActiveHotel] = useState(null);
  
  // Tracks which hotel asset is opened in "Full Mode" for exploration
  const [viewingDetails, setViewingDetails] = useState(null);

  // Helper to generate Booking.com style premium labels
  const getReviewLabel = (rating) => {
    if (!rating || rating === 0) return "New to Network";
    if (rating >= 4.8) return "Exceptional";
    if (rating >= 4.5) return "Superb";
    if (rating >= 4.0) return "Very Good";
    return "Good";
  };

  return (
    <div className={`min-h-screen px-4 py-8 md:px-10 transition-colors duration-300 ${
      darkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Action Control Bar */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all ${
              darkMode ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm"
            }`}
          >
            <ArrowLeft size={14} strokeWidth={3} /> Return
          </button>
          <span className={`text-xs font-mono tracking-wider ${darkMode ? "text-white/40" : "text-slate-500"}`}>
            {hotels?.length || 0} Exclusive Matches Discovered
          </span>
        </div>

        {/* Header Block */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Elite Corporate Lodging</h1>
          <p className={`text-xs mt-1 ${darkMode ? "text-white/40" : "text-slate-500"}`}>
            Direct feeds verified for security, structural amenity parameters, and pricing layout transparency.
          </p>
        </div>

        {!hotels || hotels.length === 0 ? (
          /* PREMIUM BOUTIQUE EMPTY STATE */
          <div className={`border rounded-3xl p-12 md:p-20 text-center space-y-4 max-w-3xl mx-auto transition-all duration-300 ${
            darkMode 
              ? "bg-white/[0.02] border-white/5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]" 
              : "bg-white border-slate-200/60 shadow-xl shadow-slate-100/50"
          }`}>
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center border transition-all duration-300 ${
              darkMode ? "bg-white/5 border-white/10 text-brand-gold" : "bg-slate-50 border-slate-200 text-brand-cobalt"
            }`}>
              <Building size={20} className="animate-pulse" />
            </div>
            
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg md:text-xl font-black tracking-tight uppercase">
                Curating Elite Spaces
              </h2>
              <p className={`text-xs leading-relaxed ${darkMode ? "text-white/60" : "text-slate-600"}`}>
                Premium hotel features and corporate hospitality portfolios are coming shortly. We are currently verifying exclusive architectural parameters for this zone.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onBack}
                className="text-[10px] font-black uppercase tracking-widest text-brand-cobalt bg-brand-cobalt/10 hover:bg-brand-cobalt/20 border border-brand-cobalt/20 px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer"
              >
                Explore Alternate Coordinates
              </button>
            </div>
          </div>
        ) : (
          /* Structured Row Pipeline (Inspired by Booking.com Layout) */
          <div className="space-y-4">
            {hotels.map((hotel) => {
              const baseRate = hotel.roomTypes && hotel.roomTypes.length > 0 
                ? Math.min(...hotel.roomTypes.map(r => Number(r.pricePerNight || 0))) 
                : 0;

              return (
                <div 
                  key={hotel._id}
                  onClick={() => setViewingDetails(hotel)} // 🟢 Entire card becomes clickable to open "Full Mode"
                  className={`border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 transition-all duration-300 group cursor-pointer ${
                    darkMode ? "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]" : "bg-white border-slate-200/60 hover:shadow-2xl shadow-slate-100"
                  }`}
                >
                  {/* Column 1: Multi-Media Frame (md:span-4) */}
                  <div className="md:col-span-4 h-56 md:h-full min-h-[220px] relative overflow-hidden bg-zinc-900" onClick={(e) => e.stopPropagation()}>
                    <HotelCardCarousel mediaUrls={hotel.mediaUrls} title={hotel.title} />
                    <div className="absolute top-4 left-4 bg-brand-midnight/80 backdrop-blur-md border border-white/10 text-brand-gold px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold font-mono z-10">
                      <Shield size={10} /> Verified
                    </div>
                  </div>

                  {/* Column 2: Structural Meta Layer Details (md:span-5) */}
                  <div className={`md:col-span-5 p-5 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r ${
                    darkMode ? "border-white/5" : "border-slate-100"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <h2 className="text-xl font-extrabold tracking-tight leading-snug group-hover:text-brand-cobalt transition-colors">{hotel.title}</h2>
                            <div className="flex items-center text-brand-gold gap-0.5">
                              {Array.from({ length: hotel.starRating || 5 }).map((_, sIdx) => (
                                <Star key={sIdx} size={12} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          
                          <p className={`text-[11px] font-bold tracking-tight flex items-center gap-1 ${
                            darkMode ? "text-brand-cobalt" : "text-brand-cobalt font-semibold"
                          }`}>
                            <MapPin size={12} className="shrink-0" /> 
                            {hotel.streetAddress}, {hotel.locality}, {hotel.state}
                          </p>
                        </div>

                        {/* 🎯 ELITE REVIEW BADGE (Booking.com Style) */}
                        <div className="flex items-center gap-2 text-right">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase tracking-wider">{getReviewLabel(hotel.ratingsAverage)}</span>
                            <span className={`text-[10px] flex items-center justify-end gap-1 ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>
                              <MessageSquare size={10} /> {hotel.ratingsQuantity || 0} reviews
                            </span>
                          </div>
                          <div className="bg-brand-cobalt text-white font-black text-sm px-2 py-1.5 rounded-lg rounded-tr-none shadow-md">
                            {hotel.ratingsAverage ? hotel.ratingsAverage.toFixed(1) : '—'}
                          </div>
                        </div>
                      </div>

                      <p className={`text-xs line-clamp-2 md:line-clamp-3 leading-relaxed ${
                        darkMode ? "text-white/60" : "text-slate-600"
                      }`}>
                        {hotel.description}
                      </p>
                    </div>

                    {/* Amenities horizontal chip cloud */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {hotel.amenities?.slice(0, 4).map((amenity, aIdx) => (
                        <span 
                          key={aIdx} 
                          className={`text-[10px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wide transition-colors ${
                            darkMode ? "bg-white/5 border-white/5 text-white/50 group-hover:border-white/20" : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities?.length > 4 && (
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wide ${
                          darkMode ? "bg-transparent border-transparent text-white/30" : "text-slate-400 border-transparent"
                        }`}>
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Booking Outlay Financial Card Block (md:span-3) */}
                  <div className={`md:col-span-3 p-5 md:p-6 flex flex-col justify-between items-stretch text-left md:text-right bg-opacity-10 bg-brand-cobalt/5 ${
                    darkMode ? "bg-white/[0.005]" : "bg-slate-50/50"
                  }`}>
                    <div className="space-y-1 flex justify-between items-start md:block">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                        Active
                      </span>
                      <p className={`text-[11px] font-medium hidden md:block mt-1 ${darkMode ? "text-white/40" : "text-slate-400"}`}>
                        Includes service provisions
                      </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex justify-between items-end md:block">
                      <div>
                        <span className={`text-[10px] uppercase tracking-wider block font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>
                          Per Night
                        </span>
                        <h3 className="text-2xl font-mono font-black tracking-tight text-brand-cobalt mt-0.5">
                          ₦{baseRate.toLocaleString()}
                        </h3>
                        <p className={`text-[10px] font-medium block ${darkMode ? "text-white/30" : "text-slate-400"}`}>
                          + taxes and charges
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      {/* 🟢 Modified Button: Prevents the card click event so it ONLY opens the reservation modal */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveHotel(hotel);
                        }} 
                        className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold py-3 px-4 rounded-xl text-[11px] tracking-wider uppercase transition-all shadow-lg shadow-brand-cobalt/10 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                      >
                        Select Room <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reservation Checkout Trigger */}
      <ReservationModal 
        isOpen={activeHotel !== null}
        onClose={() => setActiveHotel(null)} 
        hotel={activeHotel}
        selectedRoom={activeHotel?.roomTypes?.[0] || { pricePerNight: 0 }}
        darkMode={darkMode}
      />

      {/* Full Details Explorer View - Render your new component here */}
      <HotelDetailsModal 
        isOpen={viewingDetails !== null} 
        onClose={() => setViewingDetails(null)} 
        hotel={viewingDetails} 
        darkMode={darkMode} 
      /> 
     
      
    </div>
  );
}