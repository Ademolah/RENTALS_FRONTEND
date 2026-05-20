import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-brand-midnight border-t border-white/10 pt-16 pb-8 px-6 text-brand-slate/60">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-brand-cobalt flex items-center justify-center">
              <span className="text-white font-bold font-display text-xs">R</span>
            </div>
            <span className="text-white font-display font-bold text-lg tracking-wide">
              Rentals
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            The exclusive digital infrastructure for premium real estate. Discover, list, and manage high-end properties with completely world-class architectural precision.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-brand-cobalt transition-colors">Search Properties</Link></li>
            <li><Link to="/register" className="hover:text-brand-cobalt transition-colors">Agency Registration</Link></li>
            <li><Link to="/login" className="hover:text-brand-cobalt transition-colors">Agent Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-[1400px] mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {new Date().getFullYear()} Residences Luxury Network. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="cursor-pointer hover:text-white">Twitter</span>
          <span className="cursor-pointer hover:text-white">LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};