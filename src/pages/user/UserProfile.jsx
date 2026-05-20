import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building, Settings, MapPin, LogOut } from 'lucide-react';

export const UserProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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
           AGENCY UPGRADE BANNER (CRITICAL GATEWAY)
           ======================================================================= */}
        <div className="bg-gradient-to-r from-brand-midnight to-[#1a233a] border border-brand-cobalt/20 rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-premium">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <Building size={18} className="text-brand-gold" />
                <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">For Professionals</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Are you a Real Estate Broker?</h2>
              <p className="text-white/60 text-sm leading-relaxed font-medium">
                Upgrade your standard account to a Corporate Agency profile. Gain the ability to list premium properties, invite agents, and access our high-end administrative console.
              </p>
            </div>
            <Link 
              to="/register-agency" 
              className="shrink-0 bg-brand-gold text-brand-midnight hover:bg-white px-8 py-4 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg shadow-brand-gold/20"
            >
              Establish Agency
            </Link>
          </div>
          
          {/* Abstract Background Graphic */}
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <Building size={300} />
          </div>
        </div>

        {/* =======================================================================
           SAVED LUXURY LISTINGS (PLACEHOLDERS)
           ======================================================================= */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Heart className="text-brand-coral" size={20} />
            <h3 className="text-xl font-display font-bold">Saved Collections</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Mock Property Card 1 */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-brand-cobalt/50 transition-colors">
              <div className="h-48 bg-brand-slate relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" alt="Mansion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full text-brand-coral">
                  <Heart size={16} fill="currentColor" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-brand-cobalt font-bold text-lg mb-1">₦ 45,000,000 <span className="text-xs text-white/40 font-normal">/ year</span></p>
                <h4 className="font-bold text-white mb-2">Maitama Prime Villa</h4>
                <p className="text-white/40 text-xs font-medium flex items-center gap-1"><MapPin size={12}/> Maitama District</p>
              </div>
            </div>

            {/* Mock Property Card 2 */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-brand-cobalt/50 transition-colors">
              <div className="h-48 bg-brand-slate relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600607687931-cece5ce21448?auto=format&fit=crop&w=800&q=80" alt="Penthouse" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full text-brand-coral">
                  <Heart size={16} fill="currentColor" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-brand-cobalt font-bold text-lg mb-1">₦ 28,500,000 <span className="text-xs text-white/40 font-normal">/ year</span></p>
                <h4 className="font-bold text-white mb-2">Victoria Island Penthouse</h4>
                <p className="text-white/40 text-xs font-medium flex items-center gap-1"><MapPin size={12}/> Victoria Island</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};