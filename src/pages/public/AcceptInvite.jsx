import  { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import {apiClient} from '../../services/apiClient'


export const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 1. Extract the secure token from the URL parameters
  const token = searchParams.get('token');

  // 2. Form State Management
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If no token is found in the URL, block access immediately to prevent ghost submissions
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center">
          <ShieldCheck size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">Invalid Access Route</h2>
          <p className="text-white/60 text-sm">
            No secure token detected. Please ensure you clicked the exact magic link provided by your agency administrator.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 3. Dispatch payload to your backend controller
      const response = await apiClient.post('/auth/accept-invite', {
        token,
        ...formData
      });

      const { token: sessionToken, user } = response.data;

      // 4. Securely store the returned session token (Adjust depending on your auth setup)
      localStorage.setItem('token', sessionToken);
      localStorage.setItem('user', JSON.stringify(user));

      // 5. Seamless redirect directly into the agent dashboard
      navigate('/agent', { replace: true });

    } catch (err) {
      // Handle expired token or validation errors gracefully
      setError(err.response?.data?.message || 'Failed to activate profile. Please contact your administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-cobalt/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Activation Card */}
      <div className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-cobalt/20 text-brand-cobalt mb-6 border border-brand-cobalt/30 shadow-[0_0_30px_rgba(var(--brand-cobalt-rgb),0.2)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2">
            Activate Profile
          </h1>
          <p className="text-white/50 text-sm font-medium">
            Complete your security credentials to access the enterprise broker network.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold leading-relaxed animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Activation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-brand-cobalt transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="firstName"
                required
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt focus:bg-white/[0.02] transition-all text-sm font-medium"
              />
            </div>

            <div className="relative group">
              <input 
                type="text" 
                name="lastName"
                required
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt focus:bg-white/[0.02] transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-brand-cobalt transition-colors">
              <Phone size={18} />
            </div>
            <input 
              type="tel" 
              name="phoneNumber"
              required
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt focus:bg-white/[0.02] transition-all text-sm font-medium font-mono"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-brand-cobalt transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              required
              minLength={8}
              placeholder="Create Secure Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt focus:bg-white/[0.02] transition-all text-sm font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-brand-coral hover:bg-brand-coral/90 text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Complete Activation
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

        </form>

        <p className="mt-8 text-center text-[11px] text-white/40 font-mono">
          SECURE ENCRYPTED HANDSHAKE
        </p>

      </div>
    </div>
  );
};