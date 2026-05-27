import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth.service';

export const Login = () => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      
      // Save session context to global state
      loginAction(response.data.user, response.token);

      // Secure dynamic routing based on corporate role
      const userRole = response.data.user.role;
      if (userRole === 'AGENCY_ADMIN') navigate('/admin');
      else if (userRole === 'AGENT') navigate('/agent');
      else if (userRole === 'SUPERADMIN') navigate('/superadmin');
      else navigate('/'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-midnight flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-premium">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-brand-slate/60 mt-2 text-sm">
            Sign in to manage your premium listings on Rentals.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4 text-sm tracking-wide uppercase"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/register" className="text-brand-slate/60 hover:text-white text-sm transition-colors">
            Don't have an account? <span className="text-brand-coral font-bold">Join Network</span>
          </Link>
        </div>
      </div>
    </div>
  );
};