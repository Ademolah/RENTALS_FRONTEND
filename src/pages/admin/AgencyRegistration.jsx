import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';
import { Building2, FileCheck, MapPin, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AgencyRegistration = () => {
  const navigate = useNavigate();
  const { user,} = useAuthStore(); // Grab login action to update the user's role globally

  const [formData, setFormData] = useState({
    corporateName: '',
    cacNumber: '',
    hqAddress: '',
    corporatePhone: '',
    agencyEmail: user?.email || '', // Pre-fill with their current authenticated email
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Dispatch corporate data to create a PENDING agency record
      await apiClient.post('/agencies', formData);
      
      // 2. We do NOT update the role to ADMIN yet. 
      // We route them back to their profile with a state flag so the UI knows to show the pending card.
      navigate('/profile', { state: { upgradePending: true } });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Corporate onboarding failed. Please verify your CAC metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-slate text-white p-6 md:p-10 font-sans flex items-center justify-center">
      <div className="w-full max-w-2xl bg-brand-midnight border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-premium relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cobalt/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

        {/* Back navigation and title */}
        <div className="mb-8 flex items-center gap-4 relative z-10">
          <button 
            onClick={() => navigate('/profile')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-brand-coral"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-brand-gold text-[10px] font-black tracking-widest uppercase block mb-0.5">Corporate Portal</span>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">Establish Your Corporate Agency</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-medium mb-6 text-center relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Section Indicator */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-white/40">
            <ShieldCheck size={14} className="text-brand-cobalt" />
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Legal & Operational Directives</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1.5">
                <Building2 size={12} /> Company / Agency Name
              </label>
              <input 
                type="text" name="corporateName" required placeholder="E.g., Vanguard Luxury Real Estate"
                value={formData.corporateName} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1.5">
                <FileCheck size={12} /> CAC Verification Number
              </label>
              <input 
                type="text" name="cacNumber" required placeholder="E.g., RC-1234567"
                value={formData.cacNumber} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1.5">
              <MapPin size={12} /> Principal Corporate Address
            </label>
            <input 
              type="text" name="hqAddress" required placeholder="E.g., 45 Alfred Rewane Road, Ikoyi, Lagos"
              value={formData.hqAddress} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1.5">
                <Phone size={12} /> Official Phone Hotline
              </label>
              <input 
                type="tel" name="corporatePhone" required placeholder="E.g., +234 812 345 6789"
                value={formData.corporatePhone} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/40 font-bold uppercase">Corporate Contact Email</label>
              <input 
                type="email" name="agencyEmail" required placeholder="info@youragency.com"
                value={formData.agencyEmail} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/50 placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium cursor-not-allowed"
                disabled // Pre-linked to account to maintain security custody
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-brand-gold text-brand-midnight font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-all transform active:scale-[0.99] disabled:opacity-40 shadow-lg shadow-brand-gold/10 hover:bg-white"
            >
              {loading ? 'Authenticating Corporate Credentials...' : 'Deploy Firm Setup & Upgrade'}
            </button>
            <p className="text-[10px] text-white/30 text-center mt-3 font-medium leading-relaxed">
              By upgrading, your profile status shifts to a corporate entity shell. You will immediately inherit full administrative capability over your designated workspace, agent rosters, and property syndications.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};