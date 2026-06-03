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
        // 1. Fetch the core Hotel Asset
        const res = await apiClient.get('/hotels'); 
        const fetchedHotel = res.data?.data?.hotels?.[0] || res.data?.data?.hotel || res.data?.[0];

        if (!fetchedHotel) {
          throw new Error("No hotel assets linked to this admin profile.");
        }

        // 2. Fetch the actual Reservations linked to this specific Hotel ID
        const resvResponse = await apiClient.get(`/hotels/${fetchedHotel._id}/reservations`);
        const liveBookings = resvResponse.data?.data?.reservations || [];

        // --- 🟢 KPI CALCULATION ENGINE ---
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        let activeGuestsCount = 0;
        let weeklyRevenueSum = 0;
        let pendingCount = 0;

        liveBookings.forEach(booking => {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          const createdAt = new Date(booking.createdAt);

          // 1. Pending Requests Matrix
          if (booking.status === 'pending') {
            pendingCount++;
          }

          // 2. Active Guests Matrix (Confirmed bookings currently in-house)
          if (booking.status === 'confirmed' && now >= checkIn && now <= checkOut) {
            activeGuestsCount++;
          }

          // 3. Weekly Revenue Matrix (Sum of valid bookings created in the last 7 days)
          if (booking.status !== 'cancelled' && booking.status !== 'rejected' && createdAt >= sevenDaysAgo) {
            weeklyRevenueSum += (Number(booking.totalAmount) || 0);
          }
        });

        // Smart Currency Formatter (Converts 12400000 to "12.4M")
        const formatRevenue = (amount) => {
          if (amount >= 1000000) return `₦${(amount / 1000000).toFixed(1)}M`;
          if (amount >= 1000) return `₦${(amount / 1000).toFixed(1)}k`;
          return `₦${amount.toLocaleString()}`;
        };

        // 4. Occupancy Rate Calculation 
        // IMPORTANT: Adjust 'totalCapacity' if you store available rooms in your schema (e.g., fetchedHotel.totalRooms)
        const totalCapacity = fetchedHotel.totalRooms || 50; 
        const occupancyRate = Math.min(Math.round((activeGuestsCount / totalCapacity) * 100), 100);

        // --- 🟢 INJECT LIVE DATA INTO STATE ---
        setHotelData({
          name: fetchedHotel.title,
          location: `${fetchedHotel.locality}, ${fetchedHotel.state}`,
          stats: {
            occupancy: `${occupancyRate}%`, 
            revenue: formatRevenue(weeklyRevenueSum),
            activeGuests: activeGuestsCount,  
            pendingRequests: pendingCount
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
    navigate('/hotel-admin/upload');
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
    const now = new Date();
    let activeGuestsCount = 0;
    let pendingCount = 0;

    totalBookings.forEach(booking => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      if (booking.status === 'pending') pendingCount++;
      if (booking.status === 'confirmed' && now >= checkIn && now <= checkOut) activeGuestsCount++;
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
    <div className={`min-h-screen pb-12 transition-colors duration-300 ${tokenBg}`}>
    
    <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${tokenNav}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-cobalt/10 border border-brand-cobalt/20 rounded-xl flex items-center justify-center text-brand-cobalt shrink-0">
            <Building size={20} />
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-tight leading-none transition-colors ${tokenTextTitle}`}>{hotelData?.name}</h1>
            <p className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 mt-1 transition-colors ${tokenTextMuted}`}>
              <MapPin size={10} /> {hotelData?.location} • Admin Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              darkMode 
                ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
                : "bg-white border-slate-200 text-brand-midnight hover:bg-slate-100 shadow-sm"
            }`}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button 
            onClick={handleUploadNav}
            className="hidden md:flex items-center gap-2 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white transition-all px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-brand-cobalt/10"
          >
            <Plus size={14} strokeWidth={3} /> Upload Asset Collection
          </button>
          
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              darkMode 
                ? "bg-white/5 border-white/10 text-white/70 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 shadow-sm"
            }`}
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-8">
      
      <button onClick={handleUploadNav} className="w-full md:hidden flex items-center justify-center gap-2 bg-brand-cobalt text-white px-4 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-cobalt/10">
        <Plus size={16} /> Upload New Property
      </button>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Current Occupancy" value={hotelData?.stats.occupancy} icon={<CalendarDays size={18} />} trend="+2.4%" isDark={darkMode} />
        <KPICard title="Weekly Revenue" value={hotelData?.stats.revenue} icon={<TrendingUp size={18} />} trend="+12%" isDark={darkMode} />
        <KPICard title="Active Guests" value={hotelData?.stats.activeGuests} icon={<Users size={18} />} isDark={darkMode} />
        <KPICard title="Pending Bookings" value={hotelData?.stats.pendingRequests} icon={<Clock size={18} />} alert={hotelData?.stats.pendingRequests > 0} isDark={darkMode} />
      </div>

      <div className={`border rounded-3xl overflow-hidden transition-all duration-300 ${tokenCard}`}>
        <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${tokenBorder}`}>
          <div>
            <h2 className={`text-lg font-extrabold tracking-tight transition-colors ${tokenTextTitle}`}>Recent Reservations</h2>
            <p className={`text-xs mt-1 transition-colors ${tokenTextMuted}`}>Live booking feeds routed directly from explorer client applications.</p>
          </div>
          <button className="text-xs font-bold text-brand-cobalt bg-brand-cobalt/10 border border-brand-cobalt/20 px-4 py-2 rounded-lg hover:bg-brand-cobalt/20 transition-all cursor-pointer">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className={`text-[10px] uppercase tracking-wider border-b transition-colors ${tokenTableHead}`}>
        <th className="px-6 py-4 font-bold">Guest Details</th>
        <th className="px-6 py-4 font-bold">Suite Config</th>
        <th className="px-6 py-4 font-bold">Check-In</th>
        <th className="px-6 py-4 font-bold">Pricing</th>
        <th className="px-6 py-4 font-bold">Status</th>
        <th className="px-6 py-4 text-right font-bold">Actions</th>
      </tr>
    </thead>
    <tbody className={`divide-y text-sm ${tokenTableRowBorder}`}>
      {bookings.length === 0 ? (
        <tr>
          <td colSpan="6" className={`text-center py-10 text-sm font-medium ${tokenTextMuted}`}>
            No reservations found for this property yet.
          </td>
        </tr>
      ) : (
        bookings.map((booking) => (
          <tr key={booking._id} className={`transition-colors group ${tokenTableRowHover}`}>
            <td className="px-6 py-4">
              <div className={`font-bold transition-colors ${tokenRowTextMain}`}>{booking.guestName}</div>
              <div className={`text-[11px] mt-0.5 transition-colors ${tokenTextMuted}`}>
                {booking.guestPhone} <span className="mx-1">•</span> {booking.guestEmail}
              </div>
            </td>
            <td className="px-6 py-4">
              <span className={`border px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${tokenSuiteTag}`}>
                {booking.roomTypeName}
              </span>
            </td>
            <td className={`px-6 py-4 font-medium transition-colors ${tokenDateText}`}>
              {new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </td>
            <td className={`px-6 py-4 font-mono font-bold transition-colors ${tokenAmountText}`}>
              ₦{booking.totalAmount?.toLocaleString()}
            </td>
            <td className="px-6 py-4">
              <StatusBadge status={booking.status} isDark={darkMode} />
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                
                {/* ─── CASE A: PENDING STATUS (DUAL INTERACTION DECK) ─── */}
                {booking.status === 'pending' && (
                  <>
                    {/* Approve / Accept Request */}
                    <button
                      onClick={() => handleConfirmReservation(booking._id)}
                      disabled={processingId !== null}
                      className={`transition-all px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer shadow-sm ${
                        darkMode
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                      } ${processingId === booking._id && processingAction === 'confirm' ? 'animate-pulse' : ''} ${
                        processingId !== null ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      {processingId === booking._id && processingAction === 'confirm' ? '...' : 'Accept'}
                    </button>

                    {/* Reject / Dismiss Request */}
                    <button
                      onClick={() => handleCancelReservation(booking._id)}
                      disabled={processingId !== null}
                      title="Reject Request"
                      className={`transition-all p-1.5 rounded-lg border cursor-pointer ${
                        darkMode
                          ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      } ${processingId !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {processingId === booking._id && processingAction === 'reject' ? (
                        <span className="text-[10px] px-1 font-bold">...</span>
                      ) : (
                        <XCircle size={15} />
                      )}
                    </button>
                  </>
                )}

                {/* ─── CASE B: TERMINATED STATES (DATA PURGE CONTROL) ─── */}
                {(booking.status === 'cancelled' || booking.status === 'rejected' || booking.status === 'failed') && (
                  <button
                    onClick={() => handleDeleteReservation(booking._id)}
                    disabled={processingId !== null}
                    title="Purge Record Permanently"
                    className={`transition-all px-2.5 py-1.5 rounded-lg border text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer ${
                      darkMode
                        ? "bg-white/[0.02] border-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                        : "bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                    } ${processingId !== null ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {processingId === booking._id && processingAction === 'delete' ? 'Purging' : 'Purge'}
                  </button>
                )}

                {/* ─── CASE C: ACTIVE / CONFIRMED MATRIX (OVERFLOW BACKUP) ─── */}
                {booking.status === 'confirmed' && (
                  <button 
                    className={`transition-colors p-2 rounded-lg border cursor-pointer ${tokenBtnSecondary}`}
                    title="Manage Confirmed Reservation"
                  >
                    <MoreHorizontal size={16} />
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
    </main>
  </div>
  );
}

// =========================================================================
// ISOLATED UI MICRO-COMPONENTS
// =========================================================================

function KPICard({ title, value, icon, trend, alert, isDark }) {
  const tokenCard = isDark 
    ? "bg-white/[0.02] border-white/5" 
    : "bg-white border-slate-200/80 shadow-xl shadow-slate-200/30";
    
  const tokenTitle = isDark ? "text-white/40" : "text-slate-500";
  
  const tokenValue = alert 
    ? "text-red-400" 
    : (isDark ? "text-white" : "text-slate-900");
    
  const tokenTrend = isDark ? "text-green-400" : "text-green-600";

  return (
    <div className={`border p-5 rounded-3xl relative overflow-hidden group transition-all duration-300 ${tokenCard}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 text-brand-cobalt">
        {icon}
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 transition-colors duration-300 ${tokenTitle}`}>{title}</p>
      <div className="flex items-end gap-3">
        <h3 className={`text-2xl lg:text-3xl font-black transition-colors duration-300 ${tokenValue}`}>{value}</h3>
        {trend && <span className={`text-[11px] font-bold mb-1 transition-colors duration-300 ${tokenTrend}`}>{trend}</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status, isDark }) {
  let style = isDark 
    ? "bg-white/5 text-white/50 border-white/10" 
    : "bg-slate-100 text-slate-600 border-slate-200"; // Default / Checked-Out
  
  if (status === 'confirmed') {
    style = isDark 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
      : "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  }
  
  if (status === 'pending') {
    style = isDark 
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
      : "bg-yellow-50 text-yellow-700 border-yellow-200/80";
  }

  if (status === 'cancelled' || status === 'rejected') {
    style = isDark 
      ? "bg-red-500/10 text-red-400 border-red-500/20" 
      : "bg-red-50 text-red-700 border-red-200/80";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all duration-300 ${style}`}>
      {status === 'confirmed' && <CheckCircle2 size={10} />}
      {status === 'pending' && <Clock size={10} />}
      {(status === 'cancelled' || status === 'rejected') && <XCircle size={10} />}
      {status}
    </span>
  );
}