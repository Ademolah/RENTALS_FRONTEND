import { useState } from 'react';
// Note: If you don't use lucide-react for chevrons, you can use raw SVGs
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

export const HotelCardCarousel = ({ mediaUrls, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fallback matrix layout if database entry array resolves completely empty
  const images = mediaUrls && mediaUrls.length > 0 
    ? mediaUrls 
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"];

  const handleNext = (e) => {
    e.stopPropagation(); // Prevents bubbling up to any row clicking triggers
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation(); // Prevents bubbling up to any row clicking triggers
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Active Image Layer Frame */}
      <img 
        src={images[currentIndex]} 
        alt={`${title} - View ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500 ease-out"
      />
      
      {/* Premium Gradient Overlay Shading for UI depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Navigation Layer controls - Displays cleanly on desktop hovering states */}
      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/90 z-10 cursor-pointer"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/90 z-10 cursor-pointer"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>

          {/* Premium Floating Media Counter Position Asset */}
          <div className="absolute bottom-3 right-3 bg-zinc-950/70 backdrop-blur-md border border-white/5 text-[9px] font-mono tracking-wider font-black text-white px-2 py-0.5 rounded-md shadow-sm select-none">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Sliding Indicator Dots Matrix Layout */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, idx) => (
              <span 
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-3 bg-white" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};