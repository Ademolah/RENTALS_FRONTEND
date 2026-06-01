import React, { useState } from 'react';
import { Calendar, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function BookHotel({ hotel, onClose }) {
  const [selectedRoom, setSelectedRoom] = useState(hotel.roomTypes[0]?._id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const activeRoomObject = hotel.roomTypes.find(r => r._id === selectedRoom);

  // Real-time Nightly Rate Mathematical Processing
  const calculateTotalCost = () => {
    if (!checkIn || !checkOut || !activeRoomObject) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays || 1) * activeRoomObject.pricePerNight;
  };

  const executeReservation = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error("Please pick valid checking date metrics.");
      return;
    }
    toast.success(`Reservation request dispatched! Total Outlay: ₦${calculateTotalCost().toLocaleString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-brand-midnight border border-white/10 w-full max-w-md rounded-3xl p-6 relative text-white space-y-5 animate-fade-in">
        
        {/* Header Block */}
        <div>
          <span className="text-[10px] text-brand-cobalt font-black uppercase tracking-widest bg-brand-cobalt/10 border border-brand-cobalt/20 px-2.5 py-1 rounded-md">Hospitality Secure Link</span>
          <h3 className="text-xl font-black tracking-tight mt-2">{hotel.title}</h3>
          <p className="text-xs text-white/40">{hotel.streetAddress}, {hotel.locality}</p>
        </div>

        <form onSubmit={executeReservation} className="space-y-4">
          {/* Room Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40 font-bold uppercase tracking-wide">Select Suite Category</label>
            <select 
              value={selectedRoom} 
              onChange={e => setSelectedRoom(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-cobalt outline-none text-white cursor-pointer"
            >
              {hotel.roomTypes.map(room => (
                <option key={room._id} value={room._id} className="bg-brand-midnight text-white">
                  {room.name} — (₦{room.pricePerNight.toLocaleString()} / night)
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wide">Check In</label>
              <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-cobalt" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wide">Check Out</label>
              <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-brand-cobalt" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>
          </div>

          {/* Real-time Dynamic Financial Ledger */}
          {calculateTotalCost() > 0 && (
            <div className="bg-brand-cobalt/10 border border-brand-cobalt/20 rounded-2xl p-4 flex justify-between items-center text-white">
              <div>
                <p className="text-[10px] text-brand-cobalt font-bold uppercase tracking-wider">Estimated Lodging Cost</p>
                <p className="text-xs text-white/40">All taxes & resort fees inclusive</p>
              </div>
              <p className="text-lg font-black">₦{calculateTotalCost().toLocaleString()}</p>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-bold transition-all">Cancel</button>
            <button type="submit" className="w-2/3 bg-brand-cobalt hover:bg-brand-cobalt/90 rounded-xl py-3 text-sm font-bold shadow-lg shadow-brand-cobalt/20 transition-all flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Instant Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}