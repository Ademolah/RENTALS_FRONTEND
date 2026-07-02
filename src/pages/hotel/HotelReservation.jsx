import  { useState, } from 'react';
import { X, Calendar, User, Mail, Phone, MessageSquare, Loader2,ChevronDown, BedDouble, CheckCircle2, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/apiClient'
import toast from 'react-hot-toast'

export const ReservationModal = ({ isOpen, onClose, hotel, selectedRoom,setSelectedRoom, darkMode = true }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  

  // 🟢 STEP 1: Halt execution immediately if modal is inactive or data is missing
  if (!isOpen || !hotel || !selectedRoom) return null;

  // 🟢 STEP 2: Now it is 100% safe to compute derived pricing metrics
  let nights = 0;
  let total = 0;

  if (formData.checkInDate && formData.checkOutDate) {
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkOut > checkIn) {
      const timeDelta = Math.abs(checkOut.getTime() - checkIn.getTime());
      nights = Math.ceil(timeDelta / (1000 * 60 * 60 * 24));
      total = nights * (selectedRoom.pricePerNight || 0);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPipeline = async (e) => {
    e.preventDefault();
    if (nights === 0) {
      setErrorMsg('Invalid timeline: Check-out date must succeed check-in.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    // 🛑 CRITICAL SAFETY: Ensure any previous success states are dropped 
    // the moment a fresh submission pipeline begins processing.
    setIsSuccess(false); 

    try {
      // 🟢 Swapped to unified apiClient architecture
      const response = await apiClient.post('/reservations', {
        hotelId: hotel._id,
        roomTypeId: selectedRoom._id || selectedRoom.id,
        ...formData
      });

      // Axios unpacks response payloads directly into the .data property
      const result = response.data;

      // Check for backend success wrapper structure (adjust if your API returns result.status === 'success')
      if (result.success || result.status === 'success') {
        setIsSuccess(true);
        toast.success('Reservation Made Successfully!');
      } else {
        setErrorMsg(result.message || 'Transmission pipeline execution failed.');
      }
    } catch (err) {
      // Unwraps custom backend error structures seamlessly (e.g. 404 validation messages)
      const serverErrorMsg = err.response?.data?.message;
      setErrorMsg(serverErrorMsg || 'Unable to connect to reservations server gateway.');
      console.warn('🚨 [Reservation Pipeline Failure]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookingForm = () => {
    // 1. Drop the success modal layout block
    setIsSuccess(false);
    
    // 2. Clear out any lingering error alerts
    setErrorMsg('');
    
    // 3. Reset your form fields back to their blank initialization states
    if (setFormData) {
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkInDate: '',
        checkOutDate: '',
        // Include any other structural keys your form maps to here
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Cinematic Glass Backdrop Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Main Modal Surface */}
      <div className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 max-h-[90vh] flex flex-col ${
        darkMode ? "bg-zinc-950 border-white/5 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        
        {/* Absolute Close Control Button */}
        <button 
          onClick={() => {
              resetBookingForm(); 
              onClose();          
            }}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-colors z-10 ${
            darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
          }`}
        >
          <X size={16} />
        </button>

        {/* SUCCESS OVERLAY STATE */}
        {isSuccess ? (
        <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-4 my-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tight">Reservation Secured</h3>
            <p className={`text-xs max-w-sm ${darkMode ? "text-white/40" : "text-slate-500"}`}>
              Your lodging request for the <span className="font-bold text-brand-cobalt">{selectedRoom?.name || selectedRoom?.title}</span> at <span className="font-bold">{hotel?.title}</span> has been committed to the concierge dashboard ledger.
            </p>
          </div>
          <button 
            onClick={() => {
              resetBookingForm(); // 1. Wipes the state and drops isSuccess back to false
              onClose();          // 2. Closes the modal window framework smoothly
            }}
            className="mt-4 px-6 py-2.5 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
        ) : (
          <>
           
            {/* Header Content Block */}
<div className={`p-6 md:p-8 border-b shrink-0 ${darkMode ? "border-white/5 bg-white/[0.01]" : "border-slate-100 bg-slate-50/50"}`}>
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
        Secure Booking
      </span>
      <h2 className="text-xl font-black tracking-tight uppercase mt-2 text-white">
  {hotel?.title}
</h2>

{/* 🏨 PREMIUM ROOM TYPE SELECTOR ENGINE */}
<div className="mt-4 space-y-2">
  <label className={`text-[10px] font-black tracking-widest uppercase block ${
    darkMode ? "text-white/40" : "text-slate-400"
  }`}>
    Select Suite Architecture
  </label>
  
  <div className="relative w-full sm:max-w-md">
    {/* Left Icon Decorator */}
    <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
      darkMode ? "text-white/40" : "text-slate-400"
    }`}>
      <BedDouble size={14} />
    </div>

    <select
      value={selectedRoom?._id || selectedRoom?.id || selectedRoom?.name || ""}
      onChange={(e) => {
        const targetValue = e.target.value;
        const baselineRoomsList = hotel?.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes : [selectedRoom];
        
        // Find matching room while safeguarding against type differences
        const pickedRoom = baselineRoomsList.find(r => 
          String(r._id || r.id || r.name) === String(targetValue)
        );
        
        // 🚨 THE FIX: Spread into a brand new object reference pointer!
        // This forces React to detect the change and re-render the paragraph instantly.
        if (pickedRoom) {
          setSelectedRoom({ ...pickedRoom });
        }
      }}
      className={`w-full appearance-none pl-11 pr-10 py-3.5 text-xs font-bold uppercase tracking-wider rounded-full border outline-none transition-all cursor-pointer ${
        darkMode 
          ? "bg-white/5 border-white/10 text-white focus:border-brand-cobalt focus:ring-2 focus:ring-brand-cobalt/20" 
          : "bg-slate-50 border-slate-200 text-slate-800 focus:border-brand-cobalt focus:ring-2 focus:ring-brand-cobalt/20"
      }`}
    >
      {(hotel?.roomTypes && hotel.roomTypes.length > 0 ? hotel.roomTypes : [selectedRoom]).map((room, idx) => {
        const uniqueValue = room._id || room.id || room.name;
        return (
          <option 
            key={uniqueValue || idx} 
            value={uniqueValue}
            className="text-slate-900 bg-white"
          >
            {room.name} — ₦{room.pricePerNight?.toLocaleString()}/night
          </option>
        );
      })}
    </select>

    {/* Right Custom Chevron */}
    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${
      darkMode ? "text-white/40" : "text-slate-400"
    }`}>
      <ChevronDown size={14} strokeWidth={2.5} />
    </div>
  </div>

  {/* Real-time Dynamic Feedback Copy */}
  <p className={`text-[11px] font-medium mt-1.5 ${darkMode ? "text-white/50" : "text-slate-500"}`}>
    Allocating: <span className="font-bold text-brand-cobalt">{selectedRoom?.name || 'Processing...'}</span> — <span className="text-emerald-500 font-bold">₦{selectedRoom?.pricePerNight?.toLocaleString() || '0'}</span> / night
  </p>
</div>
    </div>

    {/* 🎯 SURGICAL MATRIX INJECTION: Live Hotel Admin Contact Desk via partner payload */}
    {hotel?.partner && (
          <div className={`flex flex-col gap-1 p-3 rounded-xl border text-xs md:text-right md:items-end ${
              darkMode ? "bg-black/20 border-white/5" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <p className={`text-[9px] uppercase font-mono font-black tracking-widest ${darkMode ? "text-white/30" : "text-slate-400"}`}>
                Hospitality Desk
              </p>
              <a 
                href={`tel:${hotel.partner.phoneNumber}`} 
                className={`font-mono font-bold transition-colors ${darkMode ? "text-brand-gold hover:text-white" : "text-brand-cobalt hover:opacity-80"}`}
              >
                {hotel.partner.phoneNumber}
              </a>
              <a 
                href={`mailto:${hotel.partner.email}`} 
                className={`text-[11px] transition-colors ${darkMode ? "text-white/50 hover:text-brand-gold" : "text-slate-600 hover:text-brand-cobalt"}`}
              >
                {hotel.partner.email}
              </a>
            </div>
          )}
        </div>
      </div>

            {/* Main Form Area */}
            <form onSubmit={handleSubmitPipeline} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Guest Personal Data Array */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Guest Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" required name="guestName" value={formData.guestName} onChange={handleInputChange}
                      placeholder="e.g. Alhaji Kunle Adeleke"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                        darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Contact Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" required name="guestPhone" value={formData.guestPhone} onChange={handleInputChange}
                      placeholder="e.g. +234 803 999 8888"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                        darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Email Document Delivery Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" required name="guestEmail" value={formData.guestEmail} onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                      darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* Check In / Out Timeline Matrices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Check-In Arrival Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" required name="checkInDate" value={formData.checkInDate} onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                        darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white [color-scheme:dark]" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Check-Out Departure Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" required name="checkOutDate" value={formData.checkOutDate} onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                        darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white [color-scheme:dark]" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Special Logistics Demands */}
              <div className="space-y-1.5">
                <label className={`text-[10px] uppercase font-mono tracking-wider font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>Special Provisions / Concierge Notes</label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <textarea 
                    name="specialRequests" rows={3} value={formData.specialRequests} onChange={handleInputChange}
                    placeholder="Specify physical suite placement adjustments, airport shuttle synchronization, or dietary parameters..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:outline-none transition-all resize-none ${
                      darkMode ? "bg-white/5 border-white/5 focus:border-white/20 text-white" : "bg-slate-50 border-slate-200 focus:border-slate-400 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* Premium Live Price Dynamic Output Ticker */}
              {nights > 0 && (
                <div className={`p-4 rounded-2xl flex items-center justify-between border border-dashed transition-all ${
                  darkMode ? "bg-brand-cobalt/5 border-brand-cobalt/20" : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="text-left">
                    <p className="text-[11px] uppercase tracking-wide font-mono font-bold text-brand-cobalt">Financial Computation</p>
                    <p className={`text-[10px] ${darkMode ? "text-white/40" : "text-slate-400"}`}>
                      ₦{selectedRoom.pricePerNight?.toLocaleString()} × {nights} luxury nights
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] uppercase font-bold ${darkMode ? "text-white/30" : "text-slate-400"}`}>Gross Estimate</p>
                    <h4 className="text-lg font-mono font-black text-brand-cobalt">₦{total?.toLocaleString()}</h4>
                  </div>
                </div>
              )}

              {/* Submission Action Executor */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-brand-cobalt/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Verifying Allocation...
                  </>
                ) : (
                  <>
                    Make Booking <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};