import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, LogOut, Plus, CalendarDays, TrendingUp, 
  Users, Clock, CheckCircle2, MoreHorizontal, MapPin, Moon, Sun, XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../services/apiClient';
import { useAuthStore } from '../../store/useAuthStore';

export const HotelAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState(null);
const [bookings, setBookings] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const { logout } = useAuthStore();

  // Near your other useState hooks:
const [processingId, setProcessingId] = useState(null); // Tracks which row is running an API call
const [processingAction, setProcessingAction] = useState(null); // Tracks 'confirm', 'reject', or 'delete'

  const tokenBg = darkMode 
  ? "bg-black text-white selection:bg-brand-cobalt selection:text-white" 
  : "bg-slate-50 text-slate-900 selection:bg-brand-cobalt selection:text-white";

  const tokenNav = darkMode 
  ? "bg-black/80 border-white/5" 
  : "bg-white/80 border-slate-200/80 shadow-sm shadow-slate-100/40";

  const tokenTextTitle = darkMode ? "text-white" : "text-slate-900";
  const tokenTextMuted = darkMode ? "text-white/40" : "text-slate-500";
  const tokenBorder = darkMode ? "border-white/5" : "border-slate-200/80";

  const tokenCard = darkMode 
  ? "bg-white/[0.02] border-white/5 backdrop-blur-md" 
  : "bg-white border-slate-200/80 shadow-xl shadow-slate-200/30";

  const tokenTableHead = darkMode 
  ? "bg-white/[0.02] text-white/40 border-white/5" 
  : "bg-slate-100/80 text-slate-500 border-slate-200";

  const tokenTableRowBorder = darkMode ? "divide-white/5" : "divide-slate-100";
  const tokenTableRowHover = darkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/80";

  const tokenRowTextMain = darkMode ? "text-white group-hover:text-brand-cobalt" : "text-slate-900 group-hover:text-brand-cobalt";
  const tokenSuiteTag = darkMode ? "bg-white/5 border-white/10 text-white/80" : "bg-slate-100 border-slate-200 text-slate-700 font-semibold";
  const tokenDateText = darkMode ? "text-white/70" : "text-slate-600";
  const tokenAmountText = darkMode ? "text-emerald-400" : "text-emerald-700";

  const tokenBtnSecondary = darkMode
  ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm";

  // =========================================================================
  // LIVE DATA INGESTION ENGINE
  // =========================================================================
  useEffect(() => {
  const fetchDashboardMatrix = async () => {
    try {
      // 1. Fetch exclusively the hotel asset owned by this logged-in session profile
      const res = await apiClient.get('/hotels/owned-asset'); 
      const fetchedHotel = res.data?.data?.hotel;

      if (!fetchedHotel) {
        throw new Error("No hotel assets linked to this admin profile.");
      }

      // 2. Handle reservation queries dynamically based on whether the hotel asset is live
      let liveBookings = [];
      if (fetchedHotel._id) {
        const resvResponse = await apiClient.get(`/hotels/${fetchedHotel._id}/reservations`);
        liveBookings = resvResponse.data?.data?.reservations || [];
      }

      // --- 🟢 KPI CALCULATION ENGINE ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      let activeGuestsCount = 0;
      let weeklyRevenueSum = 0;
      let pendingCount = 0;

      liveBookings.forEach(booking => {
        const createdAt = new Date(booking.createdAt);
        const currentStatus = booking.status?.toLowerCase() || '';

        if (currentStatus === 'pending') {
          pendingCount++;
        }

        if (currentStatus === 'confirmed') {
          activeGuestsCount++;
        }

        if (currentStatus !== 'cancelled' && currentStatus !== 'rejected' && createdAt >= sevenDaysAgo) {
          weeklyRevenueSum += (Number(booking.totalAmount) || 0);
        }
      });

      // Premium Currency Formatter
      const formatRevenue = (amount) => {
        if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `₦${(amount / 1000).toFixed(1)}k`;
        return `₦${amount.toLocaleString()}`;
      };

      // 4. Occupancy Rate Calculation 
      const totalCapacity = fetchedHotel.totalRooms || 50; 
      const occupancyRate = activeGuestsCount > 0 
        ? Math.min(Math.round((activeGuestsCount / totalCapacity) * 100), 100)
        : 0;

      // --- 🟢 INJECT LIVE DATA INTO STATE ---
      setHotelData({
        name: fetchedHotel.title,
        location: fetchedHotel.isPlaceholder 
          ? `${fetchedHotel.state} (Setup Pending)`
          : `${fetchedHotel.locality}, ${fetchedHotel.state}`,
        stats: {
          occupancy: `${occupancyRate}%`, 
          revenue: formatRevenue(weeklyRevenueSum),
          activeGuests: activeGuestsCount,  
          pendingRequests: pendingCount,
          totalCapacity: totalCapacity
        }
      });

      setBookings(liveBookings);
      
    } catch (error) {
      console.warn("🚨 [Dashboard Feed Error]:", error);
      toast.error(error.response?.data?.message || "Failed to sync real-time dashboard feeds.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardMatrix();
}, []);

  // =========================================================================
  // ACTION HANDLERS
  // =========================================================================
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUploadNav = () => {
  navigate('/hotel-admin/upload', {
    state: { prefilledTitle: hotelData?.name }
  });
};

 const handleConfirmReservation = async (reservationId) => {
    setProcessingId(reservationId);
    setProcessingAction('confirm');
    try {
      // Hits your reservation status update route
      await apiClient.patch(`/hotels/${reservationId}/confirm`);
      
      toast.success("Reservation officially confirmed!");
      
      // Morph state in real-time
      setBookings(prev => 
        prev.map(b => b._id === reservationId ? { ...b, status: 'confirmed' } : b)
      );
      
      // Re-trigger metric balancing dynamically
      setHotelData(prev => {
        const updatedBookings = bookings.map(b => b._id === reservationId ? { ...b, status: 'confirmed' } : b);
        return recalculateMetrics(prev, updatedBookings);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm reservation.");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // 2. REJECT / CANCEL PIPELINE
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to reject this reservation request?")) return;
    
    setProcessingId(reservationId);
    setProcessingAction('reject');
    try {
      await apiClient.patch(`/hotels/${reservationId}/cancel`);
      toast.success("Reservation request rejected.");
      
      setBookings(prev => 
        prev.map(b => b._id === reservationId ? { ...b, status: 'cancelled' } : b)
      );

      setHotelData(prev => {
        const updatedBookings = bookings.map(b => b._id === reservationId ? { ...b, status: 'cancelled' } : b);
        return recalculateMetrics(prev, updatedBookings);
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject reservation.");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // 3. PURGE / DELETE PIPELINE (Only available for dead states)
  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm("Archiving this record will permanently remove it from the live feed. Proceed?")) return;
    
    setProcessingId(reservationId);
    setProcessingAction('delete');
    try {
      await apiClient.delete(`/hotels/${reservationId}`);
      toast.success("Record permanently archived.");
      
      // Completely slice out of local rendering matrix
      setBookings(prev => prev.filter(b => b._id !== reservationId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to purge record.");
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Helper utility to keep your top KPI cards running perfectly in sync with button clicks!
  const recalculateMetrics = (currentData, totalBookings) => {
    let activeGuestsCount = 0;
    let pendingCount = 0;

    totalBookings.forEach(booking => {
      // Force lowercase to match main engine
      const currentStatus = booking.status?.toLowerCase() || '';
      
      if (currentStatus === 'pending') pendingCount++;
      
      // 🟢 Keep logic synced: Count all confirmed records
      if (currentStatus === 'confirmed') activeGuestsCount++;
    });

    const totalCapacity = currentData.stats.totalCapacity || 50;
    const occupancyRate = Math.min(Math.round((activeGuestsCount / totalCapacity) * 100), 100);

    return {
      ...currentData,
      stats: {
        ...currentData.stats,
        pendingRequests: pendingCount,
        activeGuests: activeGuestsCount,
        occupancy: `${occupancyRate}%`
      }
    };
  };

  // =========================================================================
  // RENDER UI MATRIX
  // =========================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-white/10 border-t-brand-cobalt rounded-full animate-spin" />
        <p className="text-xs text-white/40 font-mono uppercase tracking-widest animate-pulse">Decrypting Concierge Feeds...</p>
      </div>
    );
  }
return (
    <div className={`min-h-screen pb-16 font-sans transition-colors duration-300 ${tokenBg}`}>
      
      {/* =======================================================================
          STICKY CONCIERGE NAVIGATION CHANNELS
          ======================================================================= */}
      <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${tokenNav}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
          
          {/* Identity Block */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-brand-cobalt/10 dark:bg-brand-cobalt/20 border border-brand-cobalt/20 rounded-xl flex items-center justify-center text-brand-cobalt shrink-0 shadow-sm shadow-brand-cobalt/5">
              <Building size={18} className="transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="space-y-0.5">
              <h1 className={`text-base sm:text-lg font-black tracking-tight leading-none transition-colors ${tokenTextTitle}`}>
                {hotelData?.name}
              </h1>
              <p className={`text-[10px] uppercase font-black tracking-widest flex items-center gap-1 transition-colors ${tokenTextMuted}`}>
                <MapPin size={10} className="text-brand-cobalt shrink-0" /> 
                <span className="truncate max-w-[140px] sm:max-w-none">{hotelData?.location}</span>
                <span className="opacity-40">•</span> Admin Console
              </p>
            </div>
          </div>

          {/* Action Interface Operations */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Immersive Theme Switcher Trigger */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                darkMode 
                  ? "bg-white/5 border-white/10 text-amber-400 hover:bg-white/10 hover:border-white/20" 
                  : "bg-slate-50 border-slate-200 text-brand-midnight hover:bg-slate-100 shadow-sm"
              }`}
              title={darkMode ? "Switch to Luxury Light" : "Switch to Onyx Dark"}
            >
              {darkMode ? <Sun size={14} className="animate-spin-slow" /> : <Moon size={14} />}
            </button>

            {/* Desktop Collection Upload Trigger */}
            <button 
              onClick={handleUploadNav}
              className="hidden md:flex items-center gap-2 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white transition-all duration-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-cobalt/10 hover:shadow-brand-cobalt/20 transform active:scale-[0.98]"
            >
              <Plus size={14} strokeWidth={3} /> Upload Asset Collection
            </button>
            
            {/* System Session Signout */}
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                darkMode 
                  ? "bg-white/5 border-white/10 text-white/70 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 shadow-sm"
              }`}
            >
              <LogOut size={14} /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* =======================================================================
          MAIN CONCIERGE ENVIRONMENT LAYOUT
          ======================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        
        {/* Mobile Asset Upload Switcher */}
        <button 
          onClick={handleUploadNav} 
          className="w-full md:hidden flex items-center justify-center gap-2 bg-brand-cobalt text-white px-4 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-cobalt/10 transform active:scale-[0.99] transition-transform"
        >
          <Plus size={16} strokeWidth={2.5} /> Upload New Property
        </button>

        {/* =======================================================================
            ANALYTICAL STATISTICS MATRIX
            ======================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <KPICard title="Current Occupancy" value={hotelData?.stats.occupancy} icon={<CalendarDays size={18} />} trend="+2.4%" isDark={darkMode} />
          <KPICard title="Weekly Revenue" value={hotelData?.stats.revenue} icon={<TrendingUp size={18} />} trend="+12%" isDark={darkMode} />
          <KPICard title="Active Guests" value={hotelData?.stats.activeGuests} icon={<Users size={18} />} isDark={darkMode} />
          <KPICard title="Pending Bookings" value={hotelData?.stats.pendingRequests} icon={<Clock size={18} />} alert={hotelData?.stats.pendingRequests > 0} isDark={darkMode} />
        </div>

        {/* =======================================================================
            RESERVATIONS DATA ENVIRONMENT
            ======================================================================= */}
        <div className={`border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${tokenCard}`}>
          {/* Section Header */}
          <div className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${tokenBorder}`}>
            <div className="space-y-1">
              <h2 className={`text-base sm:text-lg font-black tracking-tight transition-colors ${tokenTextTitle}`}>
                Recent Reservations
              </h2>
              <p className={`text-xs transition-colors ${tokenTextMuted}`}>
                Live booking feeds routed directly from explorer client applications.
              </p>
            </div>
            <button className="text-xs font-bold text-brand-cobalt bg-brand-cobalt/10 hover:bg-brand-cobalt/20 border border-brand-cobalt/20 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer text-center">
              View All
            </button>
          </div>

          {/* TABLE DATA ARCHITECTURE */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle p-4 sm:p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-widest font-mono border-b transition-colors ${tokenTableHead}`}>
                    <th className="px-6 py-4 font-bold">Guest Details</th>
                    <th className="px-6 py-4 font-bold">Suite Config</th>
                    <th className="px-6 py-4 font-bold">Check-In</th>
                    <th className="px-6 py-4 font-bold">Pricing</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm transition-colors ${tokenTableRowBorder}`}>
                  {/* NULL REPOSITORY LIFECYCLE */}
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={`text-center py-16 text-sm font-medium ${tokenTextMuted}`}>
                        <div className="max-w-sm mx-auto space-y-1">
                          <p className="font-bold text-base">No Bookings Found</p>
                          <p className="text-xs opacity-70">No reservations found for this luxury asset property yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    /* INTERACTIVE MAP COMPONENT ROWS */
                    bookings.map((booking) => (
                      <tr key={booking._id} className={`transition-colors duration-200 group ${tokenTableRowHover}`}>
                        {/* Guest Profiling */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className={`font-bold text-sm transition-colors tracking-tight ${tokenRowTextMain}`}>
                            {booking.guestName}
                          </p>
                          <p className={`text-[11px] mt-0.5 transition-colors font-medium tracking-wide ${tokenTextMuted}`}>
                            {booking.guestPhone} <span className="opacity-30 mx-1">•</span> {booking.guestEmail}
                          </p>
                        </td>

                        {/* Room Specifications Tagging */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`border px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all duration-300 ${tokenSuiteTag}`}>
                            {booking.roomTypeName}
                          </span>
                        </td>

                        {/* Check-In Timestamps */}
                        <td className={`px-6 py-4 whitespace-nowrap text-xs font-semibold tracking-wide transition-colors ${tokenDateText}`}>
                          {new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        {/* Financial Audit Settlement */}
                        <td className={`px-6 py-4 whitespace-nowrap font-mono text-sm font-bold transition-colors ${tokenAmountText}`}>
                          ₦{booking.totalAmount?.toLocaleString()}
                        </td>

                        {/* Workflow System State Badges */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={booking.status} isDark={darkMode} />
                        </td>

                        {/* Transaction Operations Controller Deck */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* ─── CASE A: PENDING LIFECYCLE (DUAL ACTION CONTROLLERS) ─── */}
                            {booking.status === 'pending' && (
                              <>
                                {/* Approve Registration Hook */}
                                <button
                                  onClick={() => handleConfirmReservation(booking._id)}
                                  disabled={processingId !== null}
                                  className={`transition-all duration-300 px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-black flex items-center gap-1 cursor-pointer shadow-sm ${
                                    darkMode
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                                  } ${processingId === booking._id && processingAction === 'confirm' ? 'animate-pulse' : ''} ${
                                    processingId !== null ? 'opacity-40 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {processingId === booking._id && processingAction === 'confirm' ? '...' : 'Accept'}
                                </button>

                                {/* Reject Request Linkage */}
                                <button
                                  onClick={() => handleCancelReservation(booking._id)}
                                  disabled={processingId !== null}
                                  title="Reject Request"
                                  className={`transition-all duration-300 p-2 rounded-lg border flex items-center justify-center cursor-pointer ${
                                    darkMode
                                      ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                  } ${processingId !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                  {processingId === booking._id && processingAction === 'reject' ? (
                                    <span className="text-[10px] px-1 font-bold">...</span>
                                  ) : (
                                    <XCircle size={14} />
                                  )}
                                </button>
                              </>
                            )}

                            {/* ─── CASE B: UNFULFILLED REJECTION MATRIX (DATABASE RECORD SCRUBBER) ─── */}
                            {(booking.status === 'cancelled' || booking.status === 'rejected' || booking.status === 'failed') && (
                              <button
                                onClick={() => handleDeleteReservation(booking._id)}
                                disabled={processingId !== null}
                                title="Purge Record Permanently"
                                className={`transition-all duration-300 px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-widest font-black flex items-center gap-1 cursor-pointer ${
                                  darkMode
                                    ? "bg-white/[0.02] border-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                                    : "bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                                } ${processingId !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
                              >
                                {processingId === booking._id && processingAction === 'delete' ? 'Purging' : 'Purge'}
                              </button>
                            )}

                            {/* ─── CASE C: ESTABLISHED SECURE RESERVATIONS STATE (OVERFLOW BACKUP) ─── */}
                            {booking.status === 'confirmed' && (
                              <button 
                                className={`transition-all duration-300 p-2 rounded-lg border flex items-center justify-center cursor-pointer ${tokenBtnSecondary}`}
                                title="Manage Confirmed Reservation"
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// =========================================================================
// ISOLATED CONCIERGE UI MICRO-COMPONENTS
// =========================================================================

function KPICard({ title, value, icon, trend, alert, isDark }) {
  const tokenCard = isDark 
    ? "bg-[#131C2E]/60 border-white/[0.06] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]" 
    : "bg-white border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.12)]";
    
  const tokenTitle = isDark ? "text-slate-400" : "text-slate-500";
  
  const tokenValue = alert 
    ? "text-rose-500 font-extrabold" 
    : (isDark ? "text-slate-100" : "text-slate-900");
    
  const tokenTrend = isDark ? "text-emerald-400" : "text-emerald-600";

  return (
    <div className={`border p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 ${tokenCard}`}>
      {/* Structural Backdrop Deco Symbol */}
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-brand-cobalt`}>
        {icon}
      </div>
      
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 transition-colors duration-300 ${tokenTitle}`}>
        {title}
      </p>
      
      <div className="flex items-end gap-2.5">
        <h3 className={`text-2xl sm:text-3xl font-display font-black tracking-tight transition-colors duration-300 ${tokenValue}`}>
          {value}
        </h3>
        {trend && (
          <span className={`text-[11px] font-mono font-bold mb-1 transition-colors duration-300 ${tokenTrend}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, isDark }) {
  let style = isDark 
    ? "bg-white/5 text-slate-400 border-white/10" 
    : "bg-slate-100 text-slate-600 border-slate-200"; // Fallback Architecture / Checked-Out
  
  if (status === 'confirmed') {
    style = isDark 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
      : "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  }
  
  if (status === 'pending') {
    style = isDark 
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
      : "bg-amber-50 text-amber-700 border-amber-200/80";
  }

  if (status === 'cancelled' || status === 'rejected') {
    style = isDark 
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
      : "bg-rose-50 text-rose-700 border-rose-200/80";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 ${style}`}>
      {status === 'confirmed' && <CheckCircle2 size={10} className="shrink-0" />}
      {status === 'pending' && <Clock size={10} className="shrink-0" />}
      {(status === 'cancelled' || status === 'rejected') && <XCircle size={10} className="shrink-0" />}
      {status}
    </span>
  );
}