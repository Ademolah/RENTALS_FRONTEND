import { useState, useEffect } from 'react';
import { 
  X, CalendarDays, Clock, Video, MapPin, 
  Phone, Mail, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const TourBookingModal = ({ isOpen, onClose, property }) => {
  const [tourType, setTourType] = useState('in-person');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !property) return null;

 

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Heavy Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-brand-midnight border border-white/10 rounded-[2rem] shadow-2xl flex flex-col hide-scrollbar animate-in fade-in zoom-in-95 duration-300">
        
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-10 bg-brand-midnight/90 backdrop-blur-xl border-b border-white/5 p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg md:text-xl leading-tight line-clamp-1">
                {property.title}
              </h3>
              <p className="text-brand-coral font-bold mt-1">{property.price}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* 1. Tour Type Selection */}
          <div className="space-y-3">
            <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Viewing Preference</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setTourType('in-person')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  tourType === 'in-person' 
                    ? 'bg-brand-cobalt/20 border-brand-cobalt text-white' 
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <MapPin size={24} className={tourType === 'in-person' ? 'text-brand-cobalt' : ''} />
                <span className="text-sm font-bold">In-Person VIP</span>
              </button>
              <button 
                onClick={() => setTourType('virtual')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                  tourType === 'virtual' 
                    ? 'bg-brand-cobalt/20 border-brand-cobalt text-white' 
                    : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <Video size={24} className={tourType === 'virtual' ? 'text-brand-cobalt' : ''} />
                <span className="text-sm font-bold">Live Virtual Tour</span>
              </button>
            </div>
          </div>

          {/* 2. Direct Concierge Contact */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white">Contact Listing Agent</h4>
                <p className="text-xs text-white/50 mt-0.5">{property.agent.name} is available to assist you.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cobalt to-purple-500 flex items-center justify-center text-white font-bold">
                {property.agent.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`tel:${property.agent.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-medium transition-colors">
                <Phone size={16} className="text-emerald-400" />
                {property.agent.phone}
              </a>
              <a href={`mailto:${property.agent.email}`} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-medium transition-colors">
                <Mail size={16} className="text-brand-cobalt" />
                Email Agent
              </a>
            </div>
          </div>

          {/* 3. Date & Time Selection (Simplified UI) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wider flex items-center gap-2">
                <CalendarDays size={14} /> Preferred Date
              </label>
              <input 
                type="date" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium color-scheme-dark"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} /> Time Slot
              </label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none"
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="" disabled selected className="bg-brand-midnight text-white/50">Select timeframe...</option>
                <option value="morning" className="bg-brand-midnight">Morning (9AM - 12PM)</option>
                <option value="afternoon" className="bg-brand-midnight">Afternoon (12PM - 4PM)</option>
                <option value="evening" className="bg-brand-midnight">Evening (4PM - 6PM)</option>
              </select>
            </div>
          </div>

          {/* 4. The Security Advisory (Crucial) */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert size={20} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Security Advisory</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Never transfer funds for any property before a physical tour and verification. Rentals™ is not liable for transactions made outside our secure escrow system or before physical satisfaction.
              </p>
            </div>
          </div>

        </div>

        {/* ================= FOOTER / CTA ================= */}
        <div className="sticky bottom-0 bg-brand-midnight/90 backdrop-blur-xl border-t border-white/5 p-6">
          <button 
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-brand-coral hover:bg-brand-coral/90 disabled:bg-white/10 disabled:text-white/30 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {selectedDate && selectedTime ? <CheckCircle2 size={20} /> : null}
            {selectedDate && selectedTime ? 'Confirm Concierge Request' : 'Select Date & Time to Continue'}
          </button>
        </div>

      </div>
    </div>
  );
};