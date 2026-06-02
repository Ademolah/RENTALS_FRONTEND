import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, LogOut, Plus, CalendarDays, TrendingUp, 
  Users,  Clock, CheckCircle2, MoreHorizontal, MapPin, Moon, Sun
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
  const {  logout } = useAuthStore();

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
const tokenAmountText = darkMode ? "text-white/90" : "text-slate-900";

const tokenBtnSecondary = darkMode
  ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm";

  // =========================================================================
  // DATA INGESTION ENGINE (Simulated API Fetch)
  // =========================================================================
  useEffect(() => {
    const fetchDashboardMatrix = async () => {
      try {
        // 1. ACTUALLY USE apiClient to fetch the real hotel you just uploaded!
        const res = await apiClient.get('/hotels'); 
        
        // Assuming your GET /hotels returns an array of hotels, we grab the first one
        // Adjust the mapping based on exactly how your hotelController.searchHotels responds
        const fetchedHotel = res.data?.data?.hotels?.[0] || res.data?.data?.hotel || res.data?.[0];

        // 2. Mix Real Hotel Data with Simulated Stats
        setHotelData({
          name: fetchedHotel?.title || "The George Hotel",
          location: fetchedHotel ? `${fetchedHotel.locality}, ${fetchedHotel.state}` : "Ikoyi, Lagos",
          stats: {
            occupancy: "84%",
            revenue: "₦12.4M",
            activeGuests: 42,
            pendingRequests: 5
          }
        });

        // 3. Simulated Bookings (Until we build BookHotel.jsx)
        setBookings([
          { id: 'RES-0091', guest: 'Alexander Wright', contact: '+234 801 234 5678', suite: 'Presidential Suite', checkIn: 'Today', status: 'Confirmed', amount: '₦450,000' },
          { id: 'RES-0092', guest: 'Sarah Johnson', contact: 'sarah.j@corporate.com', suite: 'Deluxe Room', checkIn: 'Tomorrow', status: 'Pending', amount: '₦120,000' },
          { id: 'RES-0093', guest: 'Chief Oluwaseun', contact: '+234 902 333 4444', suite: 'Executive Suite', checkIn: 'Jun 4, 2026', status: 'Confirmed', amount: '₦280,000' },
          { id: 'RES-0094', guest: 'Michael Chen', contact: 'm.chen@logistics.net', suite: 'Standard Room', checkIn: 'Jun 5, 2026', status: 'Checked-Out', amount: '₦85,000' },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to authenticate real-time dashboard feeds.");
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
    navigate('/hotel-admin/upload'); // Maps to your new HotelUpload.jsx route
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
    
    {/* 1. ELITE GLOBAL NAVIGATION BAR */}
    <nav className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${tokenNav}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        {/* Corporate Identity Branding */}
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

        {/* Action Triggers */}
        <div className="flex items-center gap-2.5">
          
          {/* Tactical Ambient Mode Toggle Switch */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              darkMode 
                ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
                : "bg-white border-slate-200 text-brand-midnight hover:bg-slate-100 shadow-sm"
            }`}
            title={darkMode ? "Switch to Gallery Light Mode" : "Switch to Luxury Dark Mode"}
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
      
      {/* Mobile Upload Fallback */}
      <button onClick={handleUploadNav} className="w-full md:hidden flex items-center justify-center gap-2 bg-brand-cobalt text-white px-4 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-cobalt/10">
        <Plus size={16} /> Upload New Property
      </button>

      {/* 2. KPI TELEMETRY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass custom attributes or let child components adapt automatically via parent layout scope parameters */}
        <KPICard title="Current Occupancy" value={hotelData?.stats.occupancy} icon={<CalendarDays size={18} />} trend="+2.4%" isDark={darkMode} />
        <KPICard title="Weekly Revenue" value={hotelData?.stats.revenue} icon={<TrendingUp size={18} />} trend="+12%" isDark={darkMode} />
        <KPICard title="Active Guests" value={hotelData?.stats.activeGuests} icon={<Users size={18} />} isDark={darkMode} />
        <KPICard title="Pending Bookings" value={hotelData?.stats.pendingRequests} icon={<Clock size={18} />} alert isDark={darkMode} />
      </div>

      {/* 3. CORE RESERVATION MATRIX */}
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
              {bookings.map((booking) => (
                <tr key={booking.id} className={`transition-colors group ${tokenTableRowHover}`}>
                  <td className="px-6 py-4">
                    <div className={`font-bold transition-colors ${tokenRowTextMain}`}>{booking.guest}</div>
                    <div className={`text-[11px] mt-0.5 transition-colors ${tokenTextMuted}`}>{booking.contact}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`border px-2.5 py-1 rounded-md text-xs font-medium transition-all ${tokenSuiteTag}`}>
                      {booking.suite}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium transition-colors ${tokenDateText}`}>{booking.checkIn}</td>
                  <td className={`px-6 py-4 font-mono font-bold transition-colors ${tokenAmountText}`}>{booking.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`transition-colors p-2 rounded-lg border cursor-pointer ${tokenBtnSecondary}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
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
  // Absolute explicit token evaluation based on the passed state
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
  
  if (status === 'Confirmed') {
    style = isDark 
      ? "bg-green-500/10 text-green-400 border-green-500/20" 
      : "bg-green-50 text-green-700 border-green-200/80";
  }
  
  if (status === 'Pending') {
    style = isDark 
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
      : "bg-yellow-50 text-yellow-700 border-yellow-200/80";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all duration-300 ${style}`}>
      {status === 'Confirmed' && <CheckCircle2 size={10} />}
      {status === 'Pending' && <Clock size={10} />}
      {status}
    </span>
  );
}