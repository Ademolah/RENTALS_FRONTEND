
import { Star, MapPin, ArrowUpRight } from 'lucide-react';

export const HotelBentoGrid = ({ hotels, onSelectHotel }) => {
  // Balanced modular design layout mapper
  const getBentoSpanClass = (index) => {
    if (index === 0) return "md:col-span-2 md:row-span-2 h-[420px]"; // Featured Spotlight Layout
    if (index === 3) return "md:col-span-2 h-[200px]";             // Horizontal Banner Layout
    return "h-[200px]";                                            // Standard Grid Block
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr max-w-7xl mx-auto p-4">
      {hotels.map((hotel, index) => (
        <div
          key={hotel._id}
          onClick={() => onSelectHotel(hotel._id)}
          className={`relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10 bg-brand-midnight transition-all duration-500 hover:border-white/20 ${getBentoSpanClass(index)}`}
        >
          {/* Elite Background Image Optimization Layer */}
          <img 
            src={hotel.mediaUrls[0] || "/placeholder-hotel.jpg"} 
            alt={hotel.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75] group-hover:brightness-[0.65]"
          />

          {/* Absolute Linear Shadow Vignette Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Upper Micro Floating Chips */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-yellow-400 tracking-wide">
              <Star size={10} fill="currentColor" /> {hotel.starRating}.0 Rating
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300 flex items-center justify-center text-white">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Bottom Descriptive Information Matrix */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end text-white z-10">
            <div className="flex items-center gap-1 text-white/50 text-[11px] font-medium mb-1">
              <MapPin size={11} className="text-brand-cobalt" />
              <span>{hotel.locality}, {hotel.state}</span>
            </div>
            <h3 className="text-lg font-black tracking-tight leading-tight mb-2 group-hover:text-brand-cobalt transition-colors">
              {hotel.title}
            </h3>
            
            {/* Dynamic Room Starting Price Matrix */}
            <p className="text-xs text-white/40">
              Rooms from <span className="text-sm font-black text-white">₦{Math.min(...hotel.roomTypes.map(r => r.pricePerNight)).toLocaleString()}</span> / night
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}