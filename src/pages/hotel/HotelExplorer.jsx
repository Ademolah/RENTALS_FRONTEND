
import { Star, MapPin, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

export const HotelExplorerGrid = ({ hotels, onBack, darkMode = true }) => {
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
            <ArrowLeft size={14} strokeWidth={3} /> Return to Map Space
          </button>
          <span className={`text-xs font-mono tracking-wider ${darkMode ? "text-white/40" : "text-slate-500"}`}>
            {hotels?.length || 0} Exclusive Matches Discovered
          </span>
        </div>

        {/* Header Block */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Elite Corporate Lodging</h1>
          <p className={`text-xs mt-1 ${darkMode ? "text-white/40" : "text-slate-500"}`}>
            Direct API feeds verified for security, structural amenity parameters, and pricing layout transparency.
          </p>
        </div>

        {/* Structured Row Pipeline (Inspired by Booking.com Layout) */}
        <div className="space-y-4">
          {hotels?.map((hotel) => {
            // Compute minimum base rate straight from the room variants map array matrix
            const baseRate = hotel.roomTypes && hotel.roomTypes.length > 0 
              ? Math.min(...hotel.roomTypes.map(r => Number(r.pricePerNight || 0))) 
              : 0;

            return (
              <div 
                key={hotel._id}
                className={`border rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 transition-all duration-300 group ${
                  darkMode ? "bg-white/[0.02] border-white/5 hover:border-white/10" : "bg-white border-slate-200/60 hover:shadow-xl shadow-slate-100"
                }`}
              >
                {/* Column 1: Multi-Media Frame (md:span-4) */}
                <div className="md:col-span-4 h-56 md:h-full min-h-[220px] relative overflow-hidden bg-zinc-900">
                  <img 
                    src={hotel.mediaUrls?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"} 
                    alt={hotel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 bg-brand-midnight/80 backdrop-blur-md border border-white/10 text-brand-gold px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold font-mono">
                    <Shield size={10} /> Tier Verified
                  </div>
                </div>

                {/* Column 2: Structural Meta Layer Details (md:span-5) */}
                <div className={`md:col-span-5 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r ${
                  darkMode ? "border-white/5" : "border-slate-100"
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h2 className="text-xl font-extrabold tracking-tight leading-snug">{hotel.title}</h2>
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

                    <p className={`text-xs line-clamp-3 leading-relaxed ${
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
                          darkMode ? "bg-white/5 border-white/5 text-white/50" : "bg-slate-100 border-slate-200 text-slate-600"
                        }`}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Column 3: Booking Outlay Financial Card Block (md:span-3) */}
                <div className={`md:col-span-3 p-6 flex flex-col justify-between items-stretch text-right md:text-right bg-opacity-10 bg-brand-cobalt/5 ${
                  darkMode ? "bg-white/[0.005]" : "bg-slate-50/50"
                }`}>
                  <div className="space-y-1 hidden md:block">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                      Available Direct
                    </span>
                    <p className={`text-[11px] font-medium block mt-1 ${darkMode ? "text-white/40" : "text-slate-400"}`}>
                      Includes service provisions
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <span className={`text-[10px] uppercase tracking-wider block font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>
                      Nightly Pricing Starts From
                    </span>
                    <h3 className="text-2xl font-mono font-black tracking-tight text-brand-cobalt mt-0.5">
                      ₦{baseRate.toLocaleString()}
                    </h3>
                    <p className={`text-[10px] font-medium block ${darkMode ? "text-white/30" : "text-slate-400"}`}>
                      Excluding discretionary local taxes
                    </p>
                  </div>

                  <button className="w-full mt-4 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-cobalt/10 flex items-center justify-center gap-1.5 group/btn cursor-pointer">
                    Examine Suites <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}