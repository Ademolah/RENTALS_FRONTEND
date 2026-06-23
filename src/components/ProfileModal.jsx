import{ useEffect } from 'react';
import { X, Phone, MapPin, Building2, ShieldCheck } from 'lucide-react';

export default function ProfileModal({ 
  isOpen, 
  onClose, 
  lister, 
  portfolioProperties, 
  isLoadingPortfolio 
}) {
  
  // Prevent background body scrolling when modal overlay is active
  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen, lister]);

  if (!isOpen) return null;

  const activeLister = lister || {};
const fullName = activeLister.firstName 
  ? `${activeLister.firstName} ${activeLister.lastName || ''}`.trim() 
  : 'Premium Agency Partner';
const initialLetter = activeLister.firstName ? activeLister.firstName.charAt(0).toUpperCase() : 'A';

// 🟢 SURGICAL ADDITION: Extract phone record and build dynamic communication actions
const phoneNumber = activeLister.phoneNumber || '';
const hasContact = phoneNumber.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop Layer */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Main Structural Layout Card */}
      <div className="bg-[#0F172A] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden relative z-10 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
        
        {/* 🟢 FIXED CLOSE NODE: Shifted to absolute z-50 to dominate the click event stack */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-5 right-5 z-50 p-2.5 bg-white/5 hover:bg-white/10 active:scale-95 rounded-full border border-white/10 text-white/60 hover:text-white transition-all focus:outline-none cursor-pointer"
          aria-label="Close Profile Modal"
        >
          <X size={18} />
        </button>

        {/* PROFILE HEADER PANEL */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-white/[0.03] to-transparent border-b border-white/5 relative shrink-0">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-cobalt/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {/* Initials Avatar Block */}
              <div className="w-20 h-20 bg-gradient-to-tr from-brand-cobalt/20 to-brand-cobalt/5 border border-white/20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shrink-0 shadow-inner">
                {initialLetter}
              </div>

              {/* Lister Identity Details */}
              <div className="space-y-1.5 flex-1 pr-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">{fullName}</h3>
                  <ShieldCheck size={18} className="text-blue-400 shrink-0" />
                </div>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                  <span className="flex items-center gap-1"><Building2 size={12} /> Authorized Representative</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:inline" />
                  <span className="text-brand-cobalt">{activeLister.role?.replace('_', ' ') || 'AGENCY PARTNER'}</span>
                </div>
              </div>
            </div>

            {/* 🟢 PREMIUM MOBILE RESPONSIVE COMMUNICATION SHELL */}
            {hasContact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
                {/* Voice Line Gateway */}
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold tracking-wide text-xs transition-all duration-300 active:scale-[0.98] shadow-sm group"
                >
                  <Phone size={14} className="text-brand-cobalt group-hover:scale-110 transition-transform" />
                  <span>Call {phoneNumber}</span>
                </a>

                {/* Secure WhatsApp Gateway */}
                <a
                    href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello! I am reaching out from Rentals regarding your property listings. I would love to get more information.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold tracking-wide text-xs transition-all duration-300 active:scale-[0.98] shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.704 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            ) : (
              <div className="w-full pt-2">
                <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl text-center">
                  <p className="text-[11px] text-white/40 font-medium tracking-wide">
                    Direct voice communications are managed strictly via secure platform request routing.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LISTINGS / PORTFOLIO HUB */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white/40">
            Active Footprint Portfolio Listings ({portfolioProperties.length})
          </h4>

          {isLoadingPortfolio ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="h-24 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : portfolioProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolioProperties.map((item) => (
                <div 
                  key={item.id || item._id}
                  className="bg-black/20 border border-white/5 rounded-2xl p-3 flex gap-3 transition-all hover:border-white/10 hover:bg-black/40 group"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Context Meta */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h5 className="text-xs font-bold text-white truncate mb-0.5">{item.title}</h5>
                      <p className="text-[10px] text-white/40 flex items-center gap-1 truncate">
                        <MapPin size={10} className="text-brand-cobalt shrink-0" />
                        {item.locality || 'Lagos'}, {item.state || 'Nigeria'}
                      </p>
                    </div>

                    <p className="text-xs font-black text-white/90">
                      {item.formattedPrice}
                      {item.propertyType !== 'house_sale' && (
                        <span className="text-[9px] text-white/40 font-normal uppercase tracking-wider ml-0.5">
                          /{['shortlet', 'apartment'].includes(item.propertyType) ? 'Dy' : 'Yr'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl">
              <p className="text-xs text-white/40 italic">This representative currently has no alternative properties mapped to this index matrix.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}