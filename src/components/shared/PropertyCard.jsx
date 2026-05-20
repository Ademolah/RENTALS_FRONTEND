import { MapPin, BedDouble, Bath } from 'lucide-react';

export const PropertyCard = ({ property }) => {
  return (
    <div 
      className={`
        group relative overflow-hidden w-full h-full 
        md:rounded-[2rem] shadow-premium shrink-0
        snap-start snap-always
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
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {property.price}
          </p>
          <button className="bg-brand-coral hover:bg-brand-coral/90 text-white px-8 py-3.5 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg shadow-brand-coral/25">
            Book Tour
          </button>
        </div>
      </div>
    </div>
  );
};