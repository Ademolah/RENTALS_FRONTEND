import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState} from 'react';
import { Heart, Building, Settings, CalendarDays, X, Sun, Moon, LogOut, Clock, ShieldAlert, BedDouble, Lock, ChevronDown, Sparkles } from 'lucide-react';
import {PropertyCard} from '../../components/shared/PropertyCard'

export const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(true); // Default premium dark stance

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
    <div className={`min-h-screen font-sans selection:bg-brand-gold/20 selection:text-brand-gold antialiased transition-colors duration-300 ${isDarkMode ? 'bg-brand-midnight text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="px-4 py-8 md:py-16 max-w-7xl mx-auto space-y-10">
        
        {/* =======================================================================
            HEADER & APP SYSTEM BAR
            ======================================================================= */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-brand-gold uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Welcome to your Rentals
            </div>
            <h1 className={`text-3xl md:text-5xl font-display font-black tracking-tight ${isDarkMode ? 'bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent' : 'text-slate-900'}`}>
              User Registry
            </h1>
          </div>

          {/* Absolute Action Buttons Frame */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Elegant Theme Toggle */}
            <button 
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center ${isDarkMode ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-brand-gold' : 'bg-white hover:bg-slate-100 border-slate-200 text-amber-500 shadow-sm'}`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-white' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'}`}>
              <Settings size={14} />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none bg-brand-coral/10 hover:bg-brand-coral/20 border border-brand-coral/20 text-brand-coral px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* =======================================================================
            MAIN SPLIT WORKSPACE GRID
            ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ---------------------------------------------------------------------
              LEFT PANEL: EXECUTIVE INSIGNIA CARD (Surgically removed fixed sticky)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`relative border rounded-3xl p-6 md:p-8 overflow-hidden shadow-premium backdrop-blur-xl transition-all ${isDarkMode ? 'bg-gradient-to-b from-white/[0.03] to-white/[0.005] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative flex flex-col items-center text-center">
                {/* Profile Avatar Frame */}
                <div className={`relative w-24 h-24 rounded-2xl border-2 flex items-center justify-center text-2xl font-display font-black text-brand-cobalt shadow-xl mb-4 shrink-0 overflow-hidden ${isDarkMode ? 'bg-brand-midnight border-brand-cobalt/30' : 'bg-slate-100 border-slate-200'}`}>
                  {user?.firstName?.charAt(0) || 'U'}
                </div>

                {/* Identity Fields */}
                <h2 className={`text-xl md:text-2xl font-display font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {user?.firstName} {user?.lastName}
                </h2>
                
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Standard Renter Account
                </div>

                {/* Technical Profile Breakdown Fields */}
                <div className={`w-full mt-6 space-y-2.5 pt-6 border-t text-left text-xs ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                    <span className={isDarkMode ? 'text-white/40 font-medium' : 'text-slate-400 font-medium'}>Email Address</span>
                    <span className={`font-bold truncate max-w-[170px] font-mono ${isDarkMode ? 'text-white/90' : 'text-slate-700'}`}>{user?.email}</span>
                  </div>
                  {user?.phoneNumber && (
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                      <span className={isDarkMode ? 'text-white/40 font-medium' : 'text-slate-400 font-medium'}>Contact Phone</span>
                      <span className={`font-bold font-mono ${isDarkMode ? 'text-white/90' : 'text-slate-700'}`}>{user?.phoneNumber}</span>
                    </div>
                  )}
                  {user?.agencyId && (
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-brand-gold/[0.02] border-brand-gold/10' : 'bg-amber-500/[0.02] border-amber-500/20'}`}>
                      <span className="text-brand-gold/80 font-mono uppercase tracking-wider text-[10px] font-bold">Agency Key</span>
                      <span className="font-mono text-brand-gold truncate max-w-[140px] font-bold">{user.agencyId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------------
              RIGHT PANEL: MULTI-TENANT LEDGER HUBS (8 Columns)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ===================================================================
                UPGRADE DRAWER BANNER SECTOR
                =================================================================== */}
            <div className="w-full">
              <button
                type="button"
                onClick={() => setIsUpgradeExpanded(!isUpgradeExpanded)}
                className={`w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border hover:border-brand-gold/30 transition-all duration-300 shadow-premium text-left relative overflow-hidden group focus:outline-none ${isDarkMode ? 'bg-gradient-to-r from-white/[0.03] to-white/[0.005] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}
              >
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-gold/10 transition-colors duration-500" />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center text-brand-gold shadow-inner group-hover:scale-105 transition-transform ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className={`text-base font-display font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Corporate & Merchant Upgrades
                      {(isAgencyPending || isHotelPending) && (
                        <span className="inline-flex items-center gap-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[9px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Action Pending
                        </span>
                      )}
                    </h3>
                    <p className={`text-xs mt-0.5 max-w-xl ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                      Elevate your status to list luxury hotel architectures or deploy corporate real estate portfolios.
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-none pt-3 md:pt-0 relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-gold group-hover:text-slate-400 transition-colors">
                    {isUpgradeExpanded ? "Collapse Tiers" : "View Tiers"}
                  </span>
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 ${isUpgradeExpanded ? 'rotate-180 text-brand-gold bg-brand-gold/10 border-brand-gold/20' : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200')}`}>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </button>

              {/* Expandable Grid Drawer */}
              <div className={`grid transition-all duration-500 ease-in-out ${isUpgradeExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                    
                    {/* 1. REAL ESTATE AGENCY CARD */}
                    {isAgencyPending ? (
                      <div className={`border rounded-2xl p-6 relative overflow-hidden ${isDarkMode ? 'bg-white/[0.01] border-brand-gold/30' : 'bg-white border-brand-gold/40'}`}>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={14} className="text-brand-gold" />
                              <span className="text-brand-gold text-[10px] font-mono font-black tracking-widest uppercase">Under Review</span>
                            </div>
                            <h4 className={`text-xl font-display font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Agency Pending</h4>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                              Your configuration is currently under strict verification by Rentals Administrators.
                            </p>
                          </div>
                          <button disabled className={`w-fit border px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center gap-2 ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            <ShieldAlert size={14} /> Awaiting Clearance
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'} ${isHotelPending ? 'opacity-40 grayscale select-none' : ''}`}>
                        {isHotelPending && (
                          <div className={`absolute inset-0 z-30 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-brand-midnight/60' : 'bg-white/80'}`}>
                            <Lock className={isDarkMode ? 'text-white/40 mb-1' : 'text-slate-400 mb-1'} size={20} />
                            <span className={`font-bold text-[10px] uppercase tracking-wider text-center ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Hotel approval is pending</span>
                          </div>
                        )}
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Building size={14} className="text-brand-gold" />
                              <span className="text-brand-gold text-[10px] font-mono font-black tracking-widest uppercase">Brokers</span>
                            </div>
                            <h4 className={`text-xl font-display font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Real Estate Agency</h4>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                              Upgrade to a Corporate Agency profile to list commercial and premium sale properties.
                            </p>
                          </div>
                          <Link to={isHotelPending ? "#" : "/register-agency"} className={`w-fit bg-brand-gold text-brand-midnight font-mono font-black uppercase tracking-wider text-[10px] hover:bg-slate-900 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-lg ${isHotelPending ? 'pointer-events-none' : 'active:scale-95'}`}>
                            Establish Agency
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* 2. HOTEL ADMINISTRATOR CARD */}
                    {isHotelPending ? (
                      <div className={`border rounded-2xl p-6 relative overflow-hidden ${isDarkMode ? 'bg-white/[0.01] border-brand-gold/30' : 'bg-white border-brand-gold/40'}`}>
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Clock size={14} className="text-brand-gold" />
                              <span className="text-brand-gold text-[10px] font-mono font-black tracking-widest uppercase">CAC Verification</span>
                            </div>
                            <h4 className={`text-xl font-display font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Hotel Pending</h4>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                              Merchant details are being cross-referenced with official enterprise registries.
                            </p>
                          </div>
                          <button disabled className={`w-fit border px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center gap-2 ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            <ShieldAlert size={14} /> Awaiting Clearance
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'} ${isAgencyPending ? 'opacity-40 grayscale select-none' : ''}`}>
                        {isAgencyPending && (
                          <div className={`absolute inset-0 z-30 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 ${isDarkMode ? 'bg-brand-midnight/60' : 'bg-white/80'}`}>
                            <Lock className={isDarkMode ? 'text-white/40 mb-1' : 'text-slate-400 mb-1'} size={20} />
                            <span className={`font-bold text-[10px] uppercase tracking-wider text-center ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Agency approval is pending</span>
                          </div>
                        )}
                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <BedDouble size={14} className="text-brand-gold" />
                              <span className="text-brand-gold text-[10px] font-mono font-black tracking-widest uppercase">Hospitality</span>
                            </div>
                            <h4 className={`text-xl font-display font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Luxury Hotels</h4>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                              Verify your merchant identity via CAC to acquire Hotel Administrator listing engines.
                            </p>
                          </div>
                          <Link to={isAgencyPending ? "#" : "/hotel-application"} className={`w-fit bg-brand-gold text-brand-midnight font-mono font-black uppercase tracking-wider text-[10px] hover:bg-slate-900 hover:text-white px-4 py-2.5 rounded-xl transition-all shadow-lg ${isAgencyPending ? 'pointer-events-none' : 'active:scale-95'}`}>
                            Register Hotel Entity
                          </Link>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================================
    DYNAMIC COUTURE STAY ITINERARIES (UX CLARITY UPGRADE: FEATURE PREVIEW)
    =================================================================== */}
<div className={`border rounded-3xl p-6 md:p-8 shadow-premium transition-all ${isDarkMode ? 'bg-gradient-to-br from-white/[0.02] to-transparent border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl border border-brand-gold/20">
        <CalendarDays size={18} />
      </div>
      <div>
        <h3 className={`text-lg font-display font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Check-ins & Bookings</h3>
        <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Real-time status updates of your shortlet and luxury lodging itineraries</p>
      </div>
    </div>
    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-widest uppercase border ${isDarkMode ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
      Coming Soon
    </span>
  </div>

  {/* Itinerary Stream Pipeline */}
  <div className="space-y-3">
    <div className={`relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border transition-all select-none opacity-75 ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
      
      {/* Visual background hint that it's a structural layout preview */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/[0.01] to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-white/5 border-white/10 text-white/20' : 'bg-white border-slate-200 text-slate-300'}`}>
          <BedDouble size={18} />
        </div>
        <div>
          <h5 className={`font-bold text-sm ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>No active shortlet itineraries</h5>
          <p className={`text-[11px] flex items-center gap-1 mt-0.5 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
            Your upcoming check-ins across premium properties will synchronize directly here.
          </p>
          <div className={`flex items-center gap-4 mt-1.5 text-[10px] font-mono ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>
            <span>Check-In Tracker: Pipeline Offline</span>
          </div>
        </div>
      </div>
      
      <div className={`flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black tracking-widest uppercase ${isDarkMode ? 'bg-white/5 text-white/30 border border-white/10' : 'bg-slate-200 text-slate-400 border border-slate-300/40'}`}>
          Preview Mode
        </span>
        <p className={`text-[10px] sm:mt-1 font-mono ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>v2.1</p>
      </div>
    </div>
  </div>
</div>
            {/* ===================================================================
                SAVED LUXURY LISTINGS (DYNAMIC PRIVATE VAULT)
                =================================================================== */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-coral/10 text-brand-coral rounded-xl border border-brand-coral/20">
                  <Heart className="fill-brand-coral/10" size={18} />
                </div>
                <div>
                  <h3 className={`text-lg font-display font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Private Collection</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Luxury assets flagged for curation or strategic placement</p>
                </div>
              </div>
              
              {user?.savedCollections && user.savedCollections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.savedCollections.map((property) => (
                    <div key={property._id} className="relative group w-full h-full">
                      <PropertyCard property={property} hideAction={true} />
                      <button 
                        className="absolute top-4 left-4 z-30 bg-brand-midnight/90 hover:bg-rose-500 backdrop-blur-md p-2 rounded-full text-white/70 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 border border-white/10"
                        title="Remove from collection"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Remove property:", property._id);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`w-full border border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <p className={`text-xs font-bold ${isDarkMode ? 'text-white/80' : 'text-slate-700'}`}>Your Vault is Empty</p>
                  <p className={`text-[11px] max-w-xs mt-1 mb-4 leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                    Properties tracked across Nigeria and Africa will populate directly within this workspace view.
                  </p>
                  <Link to="/" className={`px-4 py-2 rounded-xl font-mono font-black text-[10px] uppercase tracking-wider transition-all transform active:scale-95 shadow-md ${isDarkMode ? 'bg-white text-brand-midnight hover:bg-brand-gold' : 'bg-slate-950 text-white hover:bg-brand-gold hover:text-brand-midnight'}`}>
                    Browse Portfolio
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};