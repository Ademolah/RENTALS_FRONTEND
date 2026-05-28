
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Globe, ArrowUpRight,  } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#090D1A] border-t border-white/5 pt-20 pb-8 px-6 md:px-10 text-slate-400 font-sans overflow-hidden">
      {/* Visual Design Element: Subdued Premium Background Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-cobalt/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto">
        
        {/* TOP LAYER: Brand Core & Strategic SEO Link Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Core Corporate DNA */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-brand-cobalt flex items-center justify-center shadow-lg shadow-brand-cobalt/20">
                <span className="text-white font-bold font-display text-xl tracking-tighter">R</span>
              </div>
              <span className="text-white font-display font-bold text-xl tracking-wide">
                Rentals<span className="text-brand-cobalt">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              The premium real estate network offering end-to-end cloud infrastructure for verified digital property portfolios. Experience institutional-grade verification engines engineered for modern asset deployment.
            </p>
            {/* Trust Badges */}
            <div className="flex items-center gap-4 text-[11px] font-bold tracking-wider uppercase text-slate-500 mt-2">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <ShieldCheck size={14} className="text-brand-cobalt" />
                Verified Agents Only
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                <Building2 size={14} className="text-brand-gold" />
                Premium Class Assets
              </div>
            </div>
          </div>

          {/* Column 2: SEO Targeted Portfolios */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Prime Portfolios</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center justify-between group">
                  Luxury Penthouses
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center justify-between group">
                  Serviced Apartments
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center justify-between group">
                  Vacation Short-Lets
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center justify-between group">
                  Executive Mansions
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SEO Geo-Targeted Regions */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Strategic Hubs</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <MapPin size={12} className="text-slate-600 group-hover:text-brand-cobalt transition-colors" />
                  Abuja
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <MapPin size={12} className="text-slate-600 group-hover:text-brand-cobalt transition-colors" />
                  Rivers State Enclaves
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <MapPin size={12} className="text-slate-600 group-hover:text-brand-cobalt transition-colors" />
                  Lagos Corporate Districts
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <Globe size={12} className="text-slate-600 group-hover:text-brand-cobalt transition-colors" />
                  National Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Infrastructure & Corporate Touchpoints */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Enterprise</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Corporate Vision</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Relations</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Agency Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Agent Workspace</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM LAYER: Cryptographic Integrity, Social Hooks & Sovereign Identity */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Copyright Metadata */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-xs text-slate-500 text-center md:text-left">
            <p>© {currentYear} Rentals Luxury Network. Structured for Absolute Precision.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Charter</Link>
              <span className="text-white/5">•</span>
              <Link to="/terms" className="hover:text-slate-300 transition-colors">Operating Terms</Link>
              <span className="text-white/5">•</span>
              <Link to="/security" className="hover:text-slate-300 transition-colors">Security Protocols</Link>
            </div>
          </div>

          {/* Right Sub-Cluster: Social signals & Pixel-Perfect Nigerian Flag Badge */}
          <div className="flex items-center gap-6">
            {/* Social Signal Indexes */}
            <div className="flex gap-4 text-xs font-semibold tracking-wider uppercase text-slate-500">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X / Twitter</a>
            </div>

            {/* Separator Divider */}
            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Pure CSS Premium Sovereign Nigerian Flag Badge */}
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 hover:border-white/10 px-3.5 py-1.5 rounded-xl transition-all group cursor-default">
              <div className="w-5 h-3.5 flex rounded-[2px] overflow-hidden shadow-sm relative transition-transform group-hover:scale-105">
                <div className="w-1/3 bg-[#008751]" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-[#008751]" />
              </div>
              <span className="text-slate-400 font-bold text-[10px] tracking-[0.15em] uppercase">
                NG<span className="text-slate-600 font-medium lowercase ml-0.5">/hub</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
};