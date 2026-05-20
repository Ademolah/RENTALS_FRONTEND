import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Eye, TrendingUp, LogOut, Settings, Plus } from 'lucide-react';

export const AgentDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-slate text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* =======================================================================
           HEADER & IDENTITY (Responsive Absolute Positioning)
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

          {/* Agent Identity Section */}
          <div className="flex items-center gap-6 pt-10 md:pt-0">
            <div className="w-20 h-20 rounded-2xl bg-brand-midnight border border-brand-cobalt/30 flex items-center justify-center text-3xl font-display font-bold text-brand-cobalt shadow-lg shadow-brand-cobalt/10 shrink-0">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-brand-cobalt/20 text-brand-cobalt border border-brand-cobalt/30 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded text-white">
                  Verified Broker
                </span>
                <span className="text-white/40 text-xs font-mono">Agency ID: {user?.agencyId || 'Pending'}</span>
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight text-white">
                {user?.firstName} {user?.lastName}
              </h1>
            </div>
          </div>
        </div>

        {/* =======================================================================
           PRIMARY ACTION BANNER
           ======================================================================= */}
        <div className="bg-brand-midnight border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Grow Your Portfolio</h2>
            <p className="text-brand-slate/60 text-sm max-w-xl">
              Upload new luxury listings directly to the global feed. Ensure your property images are high-resolution to maximize client engagement.
            </p>
          </div>
          <Link 
            to="/agent/upload" 
            className="shrink-0 w-full md:w-auto bg-brand-coral hover:bg-brand-coral/90 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-coral/10 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            Launch Upload Studio
          </Link>
        </div>

        {/* =======================================================================
           PERFORMANCE METRICS
           ======================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Active Listings</p>
            <p className="text-4xl font-display font-black mt-2">0</p>
            <Home className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Impressions</p>
            <p className="text-4xl font-display font-black mt-2">0</p>
            <Eye className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Engagement Rate</p>
            <p className="text-4xl font-display font-black mt-2 text-emerald-400">0%</p>
            <TrendingUp className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>
        </div>

        {/* =======================================================================
           LISTING INVENTORY TABLE
           ======================================================================= */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
          <h3 className="text-xl font-display font-bold mb-4">Your Active Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="text-xs text-white/40 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="py-3 px-2">Property Identity</th>
                  <th className="py-3 px-2">Market Price</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td colSpan="4" className="py-12 text-center text-white/30 font-medium">
                    No properties currently active in your portfolio. Click 'Launch Upload Studio' to begin.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};