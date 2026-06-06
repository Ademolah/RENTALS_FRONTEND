import  { useState, } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Menu, 
  X, 
  Info, 
  Mail, 
  LayoutDashboard, 
  LogOut, 
  User, 
  ChevronDown, 
  HelpCircle 
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close menus on path changes to guarantee seamless navigation state
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMobileOpen(false);
    setIsProfileDropdownOpen(false);
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dynamically determine the correct premium dashboard path based on role
  const getDashboardPath = () => {
    switch (user?.role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/admin';
      case 'ADMIN_AGENCY':
      case 'AGENCY_ADMIN':
        return '/admin-agency';
      case 'AGENT':
        return '/agent';
      default:
        return '/profile';
    }
  };

  // Extract initials for premium placeholder avatars
  const userInitials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'U';

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          
          {/* LEFT CLUSTER: Brand Identity & Public Core Navigation */}
          <div className="flex items-center gap-10">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/Rentals-Navbar.png" 
                alt="Rentals Platform" 
                className="h-7 w-auto sm:h-8 md:h-8.5 object-contain transition-transform duration-300 group-hover:scale-[1.02] select-none"
                draggable="false"
              />
            </Link>

            {/* Desktop Core Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/about" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold tracking-wide">
                <Info size={16} className="text-brand-cobalt/70" />
                About Us
              </Link>
              <Link to="/contact" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-semibold tracking-wide">
                <Mail size={16} className="text-brand-cobalt/70" />
                Contact Us
              </Link>
            </div>
          </div>

          {/* RIGHT CLUSTER: Contextual Auth Utilities & Desktop Action Elements */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/support" className="text-slate-500 hover:text-slate-300 transition-colors p-2">
              <HelpCircle size={18} />
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                {/* Desktop Account Engine Trigger */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-cobalt/10 border border-brand-cobalt/20 flex items-center justify-center text-brand-cobalt font-bold text-xs tracking-wider">
                    {userInitials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-white font-semibold text-xs leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-slate-400 text-[9px] font-bold tracking-wider uppercase mt-1">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Overlay */}
                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-[#1E293B] border border-white/5 rounded-2xl p-2 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-brand-cobalt" />
                        Profile
                      </Link>
                      <Link
                        to="/profile/settings"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
                      >
                        <User size={16} className="text-slate-400" />
                        Account Settings
                      </Link>
                      <div className="h-px bg-white/5 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-sm font-medium transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-semibold tracking-wide px-3 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="bg-brand-coral hover:bg-brand-coral/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-brand-coral/20 tracking-wide">
                  Join Network
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE BUTTON: Micro-animated Hamburger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-slate-400 hover:text-white p-2 transition-colors relative z-50"
              aria-label="Toggle navigation view"
            >
              {isMobileOpen ? <X size={24} className="animate-in spin-in-90 duration-200" /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* MOBILE DRAWER INFRASTRUCTURE */}
      {/* Backdrop scrim overlay */}
      <div 
        className={`fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Slide-out Sidebar Drawer panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[300px] bg-[#0F172A] border-l border-white/5 z-40 pt-24 px-6 flex flex-col justify-between pb-8 transform transition-transform duration-300 ease-out md:hidden ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Top Section: Links Layout */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">Company</p>
          <Link to="/about" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-base font-semibold">
            <Info size={18} className="text-brand-cobalt" />
            About Us
          </Link>
          <Link to="/contact" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-base font-semibold">
            <Mail size={18} className="text-brand-cobalt" />
            Contact Us
          </Link>
          <div className="h-px bg-white/5 my-2" />

          {isAuthenticated && (
            <>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-2">Workspace</p>
              <Link to={getDashboardPath()} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-base font-semibold">
                <LayoutDashboard size={18} className="text-brand-gold" />
                Command Dashboard
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-base font-semibold">
                <User size={18} className="text-slate-400" />
                Account Settings
              </Link>
            </>
          )}
        </div>

        {/* Bottom Section: Mobile Contextual Footprint */}
        <div className="mt-auto flex flex-col gap-4">
          {isAuthenticated ? (
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-cobalt/10 border border-brand-cobalt/20 flex items-center justify-center text-brand-cobalt font-bold text-sm tracking-wider">
                  {userInitials}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1">
                    {user?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="w-full border border-white/10 hover:border-white/20 text-white text-center py-3 rounded-xl text-sm font-bold transition-all">
                Sign In
              </Link>
              <Link to="/register" className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white text-center py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-coral/10">
                Join Network
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};