import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth.service';
import { Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', // 👈 Added to satisfy backend validator constraints
    password: '',
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
      const response = await authService.register(formData);
      loginAction(response.data.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-midnight flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-premium">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Join the Network
          </h1>
          <p className="text-brand-slate/60 mt-2 text-sm">
            Create an account to explore elite rental properties.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
          />

          {/* 📞 NEW PREMIUM PHONE NUMBER FIELD */}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number (e.g. +234...)"
            required
            onChange={handleChange}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
          />

          <div className="relative w-full">
          <input
            type= {showPassword ? "text" : "password"}
            name="password"
            placeholder="Create Password"
            required
            onChange={handleChange}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
          />
          
          <button
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer p-1 focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} className="transition-transform duration-200 active:scale-95" />
            ) : (
              <Eye size={18} className="transition-transform duration-200 active:scale-95" />
            )}
          </button>
        </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4 text-sm tracking-wide uppercase"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-brand-slate/60 hover:text-white text-sm transition-colors">
            Already have an account? <span className="text-brand-coral font-bold">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};