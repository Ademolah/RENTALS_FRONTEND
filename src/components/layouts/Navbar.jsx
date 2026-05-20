import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-midnight/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-cobalt flex items-center justify-center">
            <span className="text-white font-bold font-display text-xl">R</span>
          </div>
          <span className="text-white font-display font-bold text-xl tracking-wide">
            Rentals
          </span>
        </Link>

        {/* Navigation Links & Auth Actions */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENT' ? '/agent' : '/profile'}
                className="text-brand-slate/80 hover:text-white transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="text-brand-coral hover:text-brand-coral/80 transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-brand-slate/80 hover:text-white transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-brand-coral hover:bg-brand-coral/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-brand-coral/20"
              >
                Join Network
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};