import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState} from 'react';
import { Heart, Building, Settings, X, LogOut, Clock, ShieldAlert, BedDouble, Lock, ChevronDown, Sparkles } from 'lucide-react';
import {PropertyCard} from '../../components/shared/PropertyCard'

export const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("💎 Current User State on Profile Page:", user);
  // 🛡️ DYNAMIC STATE INTERCEPTION
  // Evaluates both router payload states and database statuses
  const isAgencyPending = location.state?.upgradePending || user?.agencyStatus === 'PENDING';
  
  const isHotelPending = location.state?.hotelUpgradePending || user?.hotelStatus === 'PENDING';

  const [isUpgradeExpanded, setIsUpgradeExpanded] = useState(isAgencyPending || isHotelPending);

// 2. Keep track of the previous pending flags to detect external changes (e.g., after form redirects)
const [prevPending, setPrevPending] = useState({ 
  agency: isAgencyPending, 
  hotel: isHotelPending 
});

// 3. 🟢 THE FIX: Adjust state directly during rendering if external pending metrics update
if (isAgencyPending !== prevPending.agency || isHotelPending !== prevPending.hotel) {
  setPrevPending({ agency: isAgencyPending, hotel: isHotelPending });
  if (isAgencyPending || isHotelPending) {
    setIsUpgradeExpanded(true);
  }
}

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  

  return (
    <div className="min-h-screen bg-brand-slate text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* =======================================================================
            HEADER & IDENTITY
            ======================================================================= */}
        <div className="relative border-b border-white/10 pb-8">
          
          {/* Absolute Action Buttons (Top Right) */}
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="bg-brand-coral/10 hover:bg-brand-coral/20 border border-brand-coral/20 text-brand-coral px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* User Identity Section */}
          <div className="flex items-center gap-6 pt-10 md:pt-0">
            <div className="w-20 h-20 rounded-2xl bg-brand-midnight border border-brand-cobalt/30 flex items-center justify-center text-3xl font-display font-bold text-brand-cobalt shadow-lg shadow-brand-cobalt/10 shrink-0">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-brand-slate/60 text-sm mt-1 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Standard Renter Account
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================================
    DYNAMIC CORPORATE UPGRADE SECTOR (UX REFINED BANNER)
    ======================================================================= */}
<div className="w-full mb-8">
  {/* Premium Toggle Action Bar */}
  <button
    type="button"
    onClick={() => setIsUpgradeExpanded(!isUpgradeExpanded)}
    className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl md:rounded-[1.5rem] bg-gradient-to-r from-brand-midnight via-[#141d33] to-brand-midnight border border-brand-cobalt/20 hover:border-brand-gold/30 transition-all duration-300 shadow-premium text-left relative overflow-hidden group focus:outline-none"
  >
    {/* Decorative Soft Radial Background Glow */}
    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-colors duration-500" />

    <div className="flex items-center gap-4 relative z-10">
      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold/10 to-brand-cobalt/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shadow-inner group-hover:scale-105 transition-transform">
        <Sparkles size={22} className="animate-pulse" />
      </div>
      <div>
        <h3 className="text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
          Corporate & Merchant Upgrades
          {(isAgencyPending || isHotelPending) && (
            <span className="inline-flex items-center gap-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              1 Action Pending
            </span>
          )}
        </h3>
        <p className="text-white/50 text-xs md:text-sm font-medium mt-0.5 max-w-2xl">
          Elevate your standardized profile to an official Merchant entity to list luxury hotel architectures or deploy corporate real estate portfolios.
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-white/5 md:border-none pt-3 md:pt-0 relative z-10">
      <span className="text-xs font-bold uppercase tracking-widest text-brand-gold group-hover:text-white transition-colors">
        {isUpgradeExpanded ? "Collapse Tiers" : "View Tiers"}
      </span>
      <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 ${isUpgradeExpanded ? 'rotate-180 bg-white/10 text-white' : ''}`}>
        <ChevronDown size={16} />
      </div>
    </div>
  </button>

  {/* Expandable Grid Drawer */}
  <div 
    className={`grid transition-all duration-500 ease-in-out ${
      isUpgradeExpanded 
        ? 'grid-rows-[1fr] opacity-100 mt-6' 
        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
    }`}
  >
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
        
        {/* 1. REAL ESTATE AGENCY CARD */}
        {isAgencyPending ? (
          <div className="bg-gradient-to-r from-brand-midnight to-[#1a233a] border border-brand-gold/30 rounded-[2rem] p-8 relative overflow-hidden shadow-premium">
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Verification in Progress</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Agency Account Pending</h2>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  Your real estate agency configuration is currently under strict review by Rentals Super Administrators.
                </p>
              </div>
              <button 
                disabled
                className="w-fit bg-white/5 border border-white/10 text-white/40 px-6 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed flex items-center gap-2"
              >
                <ShieldAlert size={18} />
                Awaiting Clearance
              </button>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-5 pointer-events-none">
              <Clock size={200} />
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r from-brand-midnight to-[#1a233a] border border-brand-cobalt/20 rounded-[2rem] p-8 relative overflow-hidden shadow-premium transition-all duration-300 ${isHotelPending ? 'opacity-50 grayscale select-none' : ''}`}>
            {isHotelPending && (
              <div className="absolute inset-0 z-30 bg-brand-slate/40 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[2rem]">
                <Lock className="text-white/60 mb-2" size={28} />
                <span className="text-white/80 font-bold text-sm px-6 text-center">Action disabled while Hotel verification is pending</span>
              </div>
            )}
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building size={18} className="text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">For Professionals</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Are you a Real Estate Broker?</h2>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  Upgrade your standard account to a Corporate Agency profile to list premium properties.
                </p>
              </div>
              <Link 
                to={isHotelPending ? "#" : "/register-agency"} 
                className={`w-fit bg-brand-gold text-brand-midnight hover:bg-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-gold/20 ${isHotelPending ? 'pointer-events-none' : 'active:scale-95'}`}
              >
                Establish Agency
              </Link>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-5 pointer-events-none">
              <Building size={200} />
            </div>
          </div>
        )}

        {/* 2. HOTEL ADMINISTRATOR CARD */}
        {isHotelPending ? (
          <div className="bg-gradient-to-r from-brand-midnight to-[#1a233a] border border-brand-gold/30 rounded-[2rem] p-8 relative overflow-hidden shadow-premium">
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Verification in Progress</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Hotel Verification Pending</h2>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  Your merchant corporate details are being cross-referenced with the CAC ledger. Your dashboard will unlock soon.
                </p>
              </div>
              <button 
                disabled
                className="w-fit bg-white/5 border border-white/10 text-white/40 px-6 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed flex items-center gap-2"
              >
                <ShieldAlert size={18} />
                Awaiting Clearance
              </button>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-5 pointer-events-none">
              <Clock size={200} />
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r from-brand-midnight to-[#1a233a] border border-brand-cobalt/20 rounded-[2rem] p-8 relative overflow-hidden shadow-premium transition-all duration-300 ${isAgencyPending ? 'opacity-50 grayscale select-none' : ''}`}>
            {isAgencyPending && (
              <div className="absolute inset-0 z-30 bg-brand-slate/40 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[2rem]">
                <Lock className="text-white/60 mb-2" size={28} />
                <span className="text-white/80 font-bold text-sm px-6 text-center">Action disabled while Agency verification is pending</span>
              </div>
            )}
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BedDouble size={18} className="text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">For Hospitality</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Manage Luxury Hotels?</h2>
                <p className="text-white/60 text-sm leading-relaxed font-medium">
                  Verify your merchant identity via CAC to attain Hotel Administrator status and deploy suites.
                </p>
              </div>
              <Link 
                to={isAgencyPending ? "#" : "/hotel-application"} 
                className={`w-fit bg-brand-gold text-brand-midnight hover:bg-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-gold/20 ${isAgencyPending ? 'pointer-events-none' : 'active:scale-95'}`}
              >
                Register Hotel Entity
              </Link>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-5 pointer-events-none">
              <BedDouble size={200} />
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
</div>
        
        {/* =======================================================================
            SAVED LUXURY LISTINGS (DYNAMIC)
            ======================================================================= */}
        <div>
  <div className="flex items-center gap-3 mb-6">
    <Heart className="text-brand-coral fill-brand-coral/20" size={24} />
    <h3 className="text-2xl font-display font-bold tracking-tight">Your Private Collection</h3>
  </div>
  
  {/* Check if the user has saved properties */}
  {user?.savedCollections && user.savedCollections.length > 0 ? (
    
    /* Render Dynamic Grid */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {user.savedCollections.map((property) => (
        <div key={property._id} className="relative group w-full h-full">
          
          {/* Standard Property Card */}
          <PropertyCard property={property} hideAction={true} />
          
          {/* Quick "Remove" button overlay that shows on hover */}
          <button 
            className="absolute top-5 left-5 z-30 bg-brand-midnight/80 hover:bg-rose-500 backdrop-blur-md p-2.5 rounded-full text-white/70 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 border border-white/10"
            title="Remove from collection"
            onClick={(e) => {
              e.stopPropagation();
              // Add your remove-from-collection API call here
              console.log("Remove property:", property._id);
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>

  ) : (
    /* Premium Empty State */
    <div className="w-full bg-gradient-to-b from-brand-midnight to-[#141d33] border border-white/5 rounded-[2rem] p-10 md:p-16 text-center flex flex-col items-center justify-center shadow-premium">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/20 shadow-inner">
        <Heart size={32} />
      </div>
      <h4 className="text-2xl font-display font-bold text-white mb-3">No Properties Saved Yet</h4>
      <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
        Your private collection is currently empty. Explore our exclusive portfolio of premium real estate and luxury hotel suites to begin curating your stays.
      </p>
      <Link 
        to="/profile" 
        className="bg-white text-brand-midnight hover:bg-brand-slate hover:text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg"
      >
        Explore Luxury Portfolio
      </Link>
    </div>
  )}
</div>

      </div>
    </div>
  );
};