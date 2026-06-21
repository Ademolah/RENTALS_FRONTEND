import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, LogOut, Plus, CalendarDays, TrendingUp, 
  Users, Clock, CheckCircle2, MoreHorizontal, MapPin, Moon, Sun, XCircle, Sliders, 
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
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
const [isProcessingAsset, setIsProcessingAsset] = useState(false);
const [assetAction, setAssetAction] = useState(null); 



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
  // const tokenBorder = darkMode ? "border-white/5" : "border-slate-200/80";

  // const tokenCard = darkMode 
  // ? "bg-white/[0.02] border-white/5 backdrop-blur-md" 
  // : "bg-white border-slate-200/80 shadow-xl shadow-slate-200/30";

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

  const [timeframeFilter, setTimeframeFilter] = useState('active');

const filteredBookings = bookings.filter((booking) => {
  const now = new Date();
  const checkoutTimestamp = new Date(booking.checkOutDate).getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  // Additional state vectors required for property mutation life cycles
// 'update' | 'delete'



  // CASE A: DEFAULT OPERATIONAL DASHBOARD VIEW
  if (timeframeFilter === 'active') {
    // Keep active or pending reservations visible unconditionally
    if (['pending', 'confirmed', 'checked-in'].includes(booking.status)) {
      return true;
    }
    // Auto-clear archival states (checked-out, cancelled, etc.) exactly 24 hours post checkout date
    return (now.getTime() - checkoutTimestamp) < twentyFourHoursInMs;
  }

  // CASE B: HISTORICAL LOOKBACK WINDOWS
  if (timeframeFilter === 'day') {
    return (now.getTime() - checkoutTimestamp) <= twentyFourHoursInMs;
  }
  if (timeframeFilter === 'week') {
    return (now.getTime() - checkoutTimestamp) <= (7 * twentyFourHoursInMs);
  }
  if (timeframeFilter === 'month') {
    return (now.getTime() - checkoutTimestamp) <= (30 * twentyFourHoursInMs);
  }

  return true;
});

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
        ...fetchedHotel, // <-- CRITICAL: Injects _id, roomTypes, amenities, etc.
        name: fetchedHotel.title,
        location: fetchedHotel.isPlaceholder 
          ? `${fetchedHotel.state}`
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

/**
 * Handles multi-part structural changes to the master hotel asset configuration
 * @param {string} hotelId - The targeted resource identifier
 * @param {FormData|Object} updatedPayload - Fully prepared mutation fields (can include files)
 */
const handleUpdateHotel = async (hotelId, updatedPayload) => {
  setIsProcessingAsset(true);
  setAssetAction('update');
  
  try {
    // 1. Convert object to FormData
    const formData = new FormData();
    
    for (const key in updatedPayload) {
      if (key === 'roomTypes' || key === 'amenities') {
        // Stringify complex structures to match backend expectation
        formData.append(key, JSON.stringify(updatedPayload[key]));
      } else if (key === 'images') {
        // Handle image files
        updatedPayload.images.forEach((file) => formData.append('images', file));
      } else {
        formData.append(key, updatedPayload[key]);
      }
    }

    // 2. Request with FormData
    const response = await apiClient.patch(`/hotels/${hotelId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success("Property specifications modified successfully!");
    
    setHotelData(prev => ({
      ...prev,
      ...response.data.data.hotel
    }));

    setIsConfigDrawerOpen(false);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to adjust hotel configurations.");
  } finally {
    setIsProcessingAsset(false);
    setAssetAction(null);
  }
};

/**
 * Destructively purges the property configuration and all attached image layers
 * @param {string} hotelId - The targeted resource identifier
 */
const handleDeleteHotel = async (hotelId) => {
  // Defensive check to avoid accidental single-click clearings
  const confirmPurge = window.confirm("Are you certain you want to permanently delete this luxury property configuration? This action is catastrophic and clears all underlying data models.");
  if (!confirmPurge) return;

  setIsProcessingAsset(true);
  setAssetAction('delete');
  
  try {
    // Hits your newly compiled DELETE route (yielding a 204 No Content state)
    await apiClient.delete(`/hotels/${hotelId}`);
    
    toast.success("Property and linked binary storage successfully erased.");
    
    // Reroute user out of the deleted context or clear parent dashboard framework
    window.location.href = '/agency/dashboard'; 
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to purge asset configuration.");
  } finally {
    setIsProcessingAsset(false);
    setAssetAction(null);
  }
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

            {/* Premium Property Configuration Trigger */}
            <button
              type="button"
              onClick={() => setIsConfigDrawerOpen(true)}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                darkMode 
                  ? "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
              }`}
              title="Configure Property Master Settings"
            >
              <Sliders size={14} />
              <span className="hidden lg:inline">Property Config</span>
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
        
        {/* Mobile Responsive Action Hub Grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <button 
            onClick={handleUploadNav} 
            className="flex items-center justify-center gap-2 bg-brand-cobalt text-white px-4 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-brand-cobalt/10 transform active:scale-[0.99] transition-all"
          >
            <Plus size={14} strokeWidth={2.5} /> Upload New
          </button>
          <button 
            onClick={() => setIsConfigDrawerOpen(true)} 
            className={`flex items-center justify-center gap-2 border px-4 py-3.5 rounded-xl text-xs font-bold transform active:scale-[0.99] transition-all ${
              darkMode 
                ? "bg-white/5 border-white/10 text-white/80" 
                : "bg-white border-slate-200 text-slate-700 shadow-sm"
            }`}
          >
            <Sliders size={14} /> Config Setup
          </button>
        </div>

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
        <div className="space-y-4">
  {/* PREMIUM TIMEFRAME CONTROLLER TABS */}
  <div className="flex items-center justify-between border-b pb-1 border-slate-200/60 dark:border-white/5">
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/[0.03] rounded-xl border border-slate-200/40 dark:border-white/[0.02]">
      {[
        { id: 'active', label: 'Active Live View' },
        { id: 'day', label: 'Past 24h' },
        { id: 'week', label: 'Past Week' },
        { id: 'month', label: 'Past Month' }
      ].map((tab) => {
        const isActive = timeframeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setTimeframeFilter(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-mono tracking-wider uppercase font-bold transition-all duration-300 cursor-pointer ${
              isActive
                ? darkMode
                  ? 'bg-white/[0.07] text-white border border-white/10 shadow-sm'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
    
    {/* Micro Indicators */}
    <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono tracking-widest uppercase opacity-40 mix-blend-plus-lighter">
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      <span className={tokenTextMuted}>System Live Scope</span>
    </div>
  </div>

  {/* MAIN TABLE CONTAINER DATA MATRICES */}
  <div className="overflow-x-auto -mx-4 sm:mx-0">
    <div className="inline-block min-w-full align-middle p-4 sm:p-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`text-[10px] uppercase tracking-widest font-mono border-b transition-colors ${tokenTableHead}`}>
            <th className="px-6 py-4 font-bold">Guest Details</th>
            <th className="px-6 py-4 font-bold">Suite</th>
            <th className="px-6 py-4 font-bold">Check-In / Check-Out</th>
            <th className="px-6 py-4 font-bold">Pricing</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y text-sm transition-colors ${tokenTableRowBorder}`}>
          {/* NULL REPOSITORY LIFECYCLE */}
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan="6" className={`text-center py-16 text-sm font-medium ${tokenTextMuted}`}>
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="font-bold text-base">No Bookings Found</p>
                  <p className="text-xs opacity-70">No reservations match the selected timeframe context or filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            /* INTERACTIVE MAP COMPONENT ROWS */
            filteredBookings.map((booking) => (
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

                {/* 🛠️ STAY DURATION TIMELINE MODULE */}
                <td className="px-6 py-4 whitespace-nowrap text-xs tracking-wide">
                  <div className="flex items-center space-x-3">
                    {/* Check-In Column Block */}
                    <div className="flex flex-col">
                      <span className={`font-semibold transition-colors ${tokenDateText}`}>
                        {new Date(booking.checkInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-50 ${tokenTextMuted}`}>
                        Check-In
                      </span>
                    </div>
                    
                    {/* Elegant Vector Directional Line */}
                    <div className="flex items-center text-slate-500/50 px-0.5">
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    
                    {/* Check-Out Column Block */}
                    <div className="flex flex-col">
                      <span className={`font-semibold transition-colors ${tokenDateText}`}>
                        {new Date(booking.checkOutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 opacity-50 ${tokenTextMuted}`}>
                        Check-Out
                      </span>
                    </div>

                    {/* Dynamic Nights Computational Badge */}
                    {booking.checkInDate && booking.checkOutDate && (
                      <div className="ml-3 hidden sm:inline-block">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          darkMode 
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} Nights
                        </span>
                      </div>
                    )}
                  </div>
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

      {isConfigDrawerOpen && (
  <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-fade-in">
    {/* Backdrop Blur Overlay */}
    <div 
      className="absolute inset-0 bg-brand-midnight/45 backdrop-blur-md transition-opacity duration-300"
      onClick={() => !isProcessingAsset && setIsConfigDrawerOpen(false)}
    />
    
    <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 sm:pl-16">
      <div className={`w-screen max-w-md transform transition-all duration-300 shadow-2xl border-l border-slate-200/60 dark:border-white/10 ${
        darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}>
        <div className="h-full flex flex-col py-6 overflow-y-auto space-y-6 px-4 sm:px-6">
          
          {/* Header Context Bar */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-200/60 dark:border-white/5">
            <div className="space-y-1">
              <h2 className="text-sm font-black uppercase tracking-wider">Property Management Deck</h2>
              <p className={`text-[10px] font-medium tracking-tight ${tokenTextMuted}`}>
                Surgically mutate database layers, room rates, and assets
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setIsConfigDrawerOpen(false)}
              disabled={isProcessingAsset}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                darkMode ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <XCircle size={14} className={isProcessingAsset ? "opacity-30" : ""} />
            </button>
          </div>

          {/* Live Form Configuration Controller */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              
              // 1. Resolve identifier matrix with prioritized fallback checks
              const targetHotelId = hotelData?._id || hotelData?.id;
              
              if (!targetHotelId) {
                alert("Identity Error: Cannot identify the specific asset to update. Please close and re-open the drawer.");
                return;
              }

              const formData = new FormData(e.currentTarget);
              
              // 2. Dynamically extract Room Types (works for both existing array and fallback block)
              const roomTypes = [];
              let i = 0;
              while (formData.has(`roomTypes[${i}][name]`)) {
                roomTypes.push({
                  name: formData.get(`roomTypes[${i}][name]`),
                  pricePerNight: Number(formData.get(`roomTypes[${i}][pricePerNight]`)),
                  capacity: Number(formData.get(`roomTypes[${i}][capacity]`)),
                });
                i++;
              }

              // 3. Construct unified final payload for the handler
              const finalPayload = {
                title: formData.get('title'),
                description: formData.get('description'),
                starRating: Number(formData.get('starRating')),
                isAvailable: formData.get('isAvailable') === 'true', // Validates against your value="true" HTML attribute
                streetAddress: formData.get('streetAddress'),
                locality: formData.get('locality'),
                state: formData.get('state'),
                appendMedia: formData.get('appendMedia'),
                roomTypes: roomTypes,
                images: Array.from(formData.getAll('files'))
              };

              handleUpdateHotel(targetHotelId, finalPayload);
            }} 
            className="flex-1 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6 pb-4">
              
              {/* SECTION 1: CORE REPOSITORY IDENTITY */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-mono tracking-widest font-black text-brand-cobalt dark:text-brand-cobalt/80">
                  01 // Core Specification
                </h3>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Listing Title Name</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    defaultValue={hotelData?.title} 
                    disabled={isProcessingAsset}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                      darkMode 
                        ? "bg-white/[0.03] border-white/5 focus:border-brand-cobalt text-white focus:bg-white/[0.06]" 
                        : "bg-slate-50 border-slate-200 focus:border-brand-cobalt text-slate-900 focus:bg-white shadow-sm"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Star Rating</label>
                    <select
                      name="starRating"
                      defaultValue={hotelData?.starRating || 4}
                      disabled={isProcessingAsset}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all cursor-pointer ${
                        darkMode 
                          ? "bg-slate-900 border-white/5 focus:border-brand-cobalt text-white" 
                          : "bg-slate-50 border-slate-200 focus:border-brand-cobalt text-slate-900 shadow-sm"
                      }`}
                    >
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <option key={stars} value={stars}>{stars} Star Luxury</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Listing Visibility</label>
                    <div className="flex items-center h-[46px]">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="isAvailable" 
                          defaultChecked={hotelData?.isAvailable ?? true}
                          value="true"
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cobalt"></div>
                        <span className="ml-3 text-xs font-semibold opacity-80">Live & Bookable</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Property Narrative Overview</label>
                  <textarea 
                    name="description"
                    rows={3}
                    disabled={isProcessingAsset}
                    defaultValue={hotelData?.description}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all resize-none ${
                      darkMode 
                        ? "bg-white/[0.03] border-white/5 focus:border-brand-cobalt text-white focus:bg-white/[0.06]" 
                        : "bg-slate-50 border-slate-200 focus:border-brand-cobalt text-slate-900 focus:bg-white shadow-sm"
                    }`}
                  />
                </div>
              </div>

              {/* SECTION 2: GEOGRAPHIC GEOLOCATION LAYERS */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40 dark:border-white/5">
                <h3 className="text-[10px] uppercase font-mono tracking-widest font-black text-brand-cobalt dark:text-brand-cobalt/80">
                  02 // Location Coordinates
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Street Address</label>
                    <input 
                      type="text" 
                      name="streetAddress"
                      defaultValue={hotelData?.streetAddress}
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                        darkMode ? "bg-white/[0.03] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Locality / City</label>
                      <input 
                        type="text" 
                        name="locality"
                        defaultValue={hotelData?.locality}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                          darkMode ? "bg-white/[0.03] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">State</label>
                      <input 
                        type="text" 
                        name="state"
                        defaultValue={hotelData?.state}
                        className={`w-full px-4 py-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                          darkMode ? "bg-white/[0.03] border-white/5 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: DYNAMIC SUITE RATE CONFIGURATOR (PRICING MATRIX) */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40 dark:border-white/5">
                <h3 className="text-[10px] uppercase font-mono tracking-widest font-black text-brand-cobalt dark:text-brand-cobalt/80">
                  03 // Suite Configurations & Rates
                </h3>

                <div className="space-y-4">
                  {hotelData?.roomTypes && hotelData.roomTypes.length > 0 ? (
                    hotelData.roomTypes.map((room, idx) => (
                      <div 
                        key={room._id || idx} 
                        className={`p-3.5 rounded-xl border space-y-3 ${
                          darkMode ? "bg-white/[0.02] border-white/5" : "bg-slate-50/50 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold opacity-50 flex items-center gap-1.5">
                            SUITE TIER #{idx + 1}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            name={`roomTypes[${idx}][name]`}
                            defaultValue={room.name}
                            placeholder="Suite Class Title"
                            required
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none ${
                              darkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"
                            }`}
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            {/* Price Nightly Rate Input Field */}
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-xs font-mono font-bold opacity-40">₦</span>
                              <input 
                                type="number" 
                                name={`roomTypes[${idx}][pricePerNight]`}
                                defaultValue={room.pricePerNight || room.price}
                                placeholder="Rate / Night"
                                required
                                className={`w-full pl-6 pr-2 py-2 rounded-lg border text-xs font-mono font-bold outline-none ${
                                  darkMode ? "bg-slate-900 border-white/5 text-amber-400" : "bg-white border-slate-200 text-slate-900"
                                }`}
                              />
                            </div>

                            {/* Guest Capacity Input Field */}
                            <input 
                              type="number" 
                              name={`roomTypes[${idx}][capacity]`}
                              defaultValue={room.capacity || 2}
                              placeholder="Max Guests"
                              required
                              min={1}
                              className={`w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold outline-none ${
                                darkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Dynamic safety fallback template block if roomTypes schema array starts out unpopulated */
                    <div className={`p-3.5 rounded-xl border space-y-3 ${darkMode ? "bg-white/[0.02] border-white/5" : "bg-slate-50/50 border-slate-200"}`}>
                      <span className="text-[10px] font-mono font-bold opacity-50">INITIAL BASE RATE SUITE BLOCK</span>
                      <div className="space-y-2">
                        <input type="text" name="roomTypes[0][name]" defaultValue="Standard Luxury Suite" required className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none ${darkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"}`} />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-2.5 top-2 text-xs font-bold opacity-40">₦</span>
                            <input type="number" name="roomTypes[0][pricePerNight]" placeholder="75000" required className={`w-full pl-6 pr-2 py-2 rounded-lg border text-xs font-mono font-bold outline-none ${darkMode ? "bg-slate-900 border-white/5 text-amber-400" : "bg-white border-slate-200"}`} />
                          </div>
                          <input type="number" name="roomTypes[0][capacity]" defaultValue={2} required className={`w-full px-3 py-2 rounded-lg border text-xs font-mono font-bold outline-none ${darkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"}`} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: CLOUDINARY MEDIA MANAGER & FRESH ASSET UPLOAD */}
              <div className="space-y-4 pt-2 border-t border-slate-200/40 dark:border-white/5">
                <h3 className="text-[10px] uppercase font-mono tracking-widest font-black text-brand-cobalt dark:text-brand-cobalt/80">
                  04 // Cloudinary Media Pipeline
                </h3>
                
                {/* File Input Controller Dropzone */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Upload Fresh Images</label>
                  <input 
                    type="file" 
                    name="files" // Maps directly to your backend's req.files array inspector
                    multiple 
                    accept="image/*"
                    disabled={isProcessingAsset}
                    className={`w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold ${
                      darkMode 
                        ? "text-slate-400 file:bg-white/5 file:text-white hover:file:bg-white/10" 
                        : "text-slate-600 file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200"
                    }`}
                  />
                </div>

                {/* Upload Integration Strategy Strategy Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-60">Media Injection Strategy</label>
                  <select
                    name="appendMedia" // Read directly by your updateHotel backend controller rule!
                    defaultValue="true"
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer ${
                      darkMode ? "bg-slate-900 border-white/5" : "bg-slate-50 border-slate-200 shadow-sm"
                    }`}
                  >
                    <option value="true">Append (Keep existing pictures and add new uploads)</option>
                    <option value="false">Overwrite (Completely replace image array with new files)</option>
                  </select>
                </div>

                {/* Existing Storage Gallery Previews */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-bold tracking-widest opacity-40">Current Active Artifacts ({hotelData?.mediaUrls?.length || 0})</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {hotelData?.mediaUrls?.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200/40 dark:border-white/5 bg-slate-100 dark:bg-white/[0.02]">
                        <img src={url} alt="Artifact View" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Operations Deck Controls */}
            <div className="border-t pt-5 border-slate-200/60 dark:border-white/5 space-y-3 shrink-0">
              <button
                type="submit"
                disabled={isProcessingAsset}
                className={`w-full flex items-center justify-center gap-2 bg-brand-cobalt text-white py-3 rounded-xl text-xs font-bold shadow-lg shadow-brand-cobalt/10 transition-all duration-300 transform active:scale-[0.99] cursor-pointer ${
                  isProcessingAsset && assetAction === 'update' ? 'animate-pulse opacity-80' : 'hover:bg-brand-cobalt/90'
                }`}
              >
                {isProcessingAsset && assetAction === 'update' ? 'Re-balancing Infrastructure...' : 'Save Dynamic Changes'}
              </button>

              <button
                type="button"
                disabled={isProcessingAsset}
                onClick={() => {
                  const targetHotelId = hotelData?._id || hotelData?.id;
                  if (targetHotelId) handleDeleteHotel(targetHotelId);
                }}
                className={`w-full flex items-center justify-center gap-2 border py-3 rounded-xl text-xs font-bold transition-all duration-300 transform active:scale-[0.99] cursor-pointer ${
                  isProcessingAsset && assetAction === 'delete'
                    ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 animate-pulse'
                    : darkMode
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white'
                      : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white'
                }`}
              >
                {isProcessingAsset && assetAction === 'delete' ? 'Purging Asset Channels...' : 'Danger: Purge Property Configuration'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
)}
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