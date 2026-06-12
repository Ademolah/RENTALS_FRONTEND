import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';
import toast from 'react-hot-toast';
import { EditPropertyModal } from '../../components/EditPropertyModal';
import {CalendarDays, Clock, Loader2, CheckCircle2, Moon, Sun, LayoutDashboard, Building2, Users2, Compass, Plus, LogOut, ShieldCheck,  Phone} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Invitation Form State Layer
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [inviteError, setInviteError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initializes as true, preventing the need for sync updates!
  const [actioningId, setActioningId] = useState(null);

  const [agents, setAgents] = useState([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  // 1. Theme Configuration State (Defaults to dark mode)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 2. Tabbed Workspace State (Defaults to the overview workspace)
  const [activeTab, setActiveTab] = useState('overview');
  
  

  // Fetch routing payload on mount
  

  useEffect(() => {
    // Defining the fetch inside the effect prevents dependency array warnings
    const fetchAgencyItinerary = async () => {
      // 🚨 Notice: No synchronous setIsLoading(true) here! This fixes the cascading render error completely.
      try {
        const response = await apiClient.get('/bookings/workspace/itinerary');
        setBookings(response.data?.data?.bookings || []);
      } catch (error) {
        console.error('Failed to resolve itinerary pipeline stream:', error);
      } finally {
        setIsLoading(false); // Async state update is perfectly safe
      }
    };

    fetchAgencyItinerary();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setActioningId(bookingId); // Triggers the loading spinner for this specific button
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => 
        prev.map(item => item._id === bookingId ? { ...item, status: newStatus } : item)
      );
    } catch (error) {
      toast.error('Status state transition aborted by verification server.');
      console.log(error)
    } finally {
      setActioningId(null);
    }
  };

  
const prioritizedBookings = [...bookings].sort((a, b) => {
    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
    return 0;
  });

  const formatBookingDate = (dateString) => {
    if (!dateString) return 'Unspecified';
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short', day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteSuccess(null);
    setInviteError(null);
    setGeneratedLink(''); // Reset historical link on new run

    try {
      const response = await apiClient.post('/auth/invite-agent', {
        email: inviteEmail,
        agencyId: user?.agencyId
      });

      // Extract the link returned from the modified backend controller
      const targetLink = response.data.magicLink;
      
      setGeneratedLink(targetLink);
      setInviteSuccess(`Onboarding credentials compiled for ${inviteEmail}!`);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to generate token infrastructure.');
    } finally {
      setInviteLoading(false);
    }
  };

  // Dedicated copy controller with temporary visual state change
  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Revert back to original layout state after 2 seconds
    } catch (err) {
      console.error('Failed to occupy clipboard:', err);
    }
  };

  useEffect(() => {
  const fetchAgencyRoster = async () => {
    try {
      // Calls the new route we just built
      const response = await apiClient.get('/agencies/agents');
      setAgents(response.data.data.agents || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sync broker roster.');
    } finally {
      setIsLoadingAgents(false);
    }
  };

  fetchAgencyRoster();
}, []);

  useEffect(() => {
    const fetchDashboardProperties = async () => {
      try {
        // We pass ?isAvailable=all so the CEO sees off-market properties too
        const response = await apiClient.get('/properties/agency-portfolio?isAvailable=all');
        setProperties(response.data.data.properties);
      } catch (error) {
        console.error("Failed to load enterprise ledger:", error);
      } finally {
        setIsLoadingProps(false);
      }
    };
    
    fetchDashboardProperties();
  }, []);

  const handleToggleAvailability = async (propertyId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI update: instantly change it on the screen so it feels native
    setProperties(prevProps => 
      prevProps.map(p => p._id === propertyId ? { ...p, isAvailable: newStatus } : p)
    );

    try {
      // Hit the UPDATE route we built earlier
      await apiClient.patch(`/properties/${propertyId}`, {
        isAvailable: newStatus
      });
    } catch (error) {
      // Revert the UI if the server request fails
      setProperties(prevProps => 
        prevProps.map(p => p._id === propertyId ? { ...p, isAvailable: currentStatus } : p)
      );
      toast.error("Failed to sync status with the server");
      console.log("Availability toggle error:", error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if(!window.confirm("Are you sure you want to permanently purge this asset?")) return;
    
    try {
      await apiClient.delete(`/properties/${propertyId}`);
      // Remove it from the UI
      setProperties(prev => prev.filter(p => p._id !== propertyId));
    } catch (error) {
      toast.error("Failed to delete property.");
      console.error("Purge failed:", error);
    }
  };

  const handleSaveEdit = async (propertyId, updatedData) => {
    try {
      // 1. Send the update to the backend
      const response = await apiClient.patch(`/properties/${propertyId}`, updatedData);
      
      // 2. Update the local state to reflect changes instantly without reloading
      setProperties(prevProps => 
        prevProps.map(p => p._id === propertyId ? { ...p, ...response.data.data.property } : p)
      );
      
      // 3. Close the modal
      setEditingProperty(null);
    } catch (error) {
      console.error("Failed to update asset:", error);
      alert("Failed to update property details. Please check your connection.");
    }
  };


  const activeListingsCount = properties.filter(p => p.isAvailable).length;

  return (
  <div className={`min-h-screen transition-colors duration-300 font-sans ${
    isDarkMode ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
  }`}>
    
    {/* Global Frame Wrapper */}
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
      
      {/* =======================================================================
         HEADER ARCHITECTURE WITH LIVE THEME CONTROLLERS
         ======================================================================= */}
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 md:pb-8 border-b ${
        isDarkMode ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="space-y-1 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-brand-cobalt text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md text-white shadow-sm">
              Enterprise Layer
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              isDarkMode ? 'bg-white/5 text-white/40' : 'bg-slate-100 text-slate-500'
            }`}>
              ID: {user?.agencyId || 'No Agency Synced'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight mt-1.5">
            CEO Management Console
          </h1>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>
            Oversee corporate properties, register field staff, and track transactional velocity.
          </p>
        </div>

        {/* Global Toolbar Framework */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Light / Dark Mode Premium Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3.5 rounded-xl border transition-all duration-300 transform active:scale-95 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-brand-gold' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-amber-500 shadow-sm'
            }`}
            title={isDarkMode ? "Switch to Light Spectrum" : "Switch to Midnight Spectrum"}
          >
            {isDarkMode ? <Sun size={18} className="animate-pulse" /> : <Moon size={18} />}
          </button>

          <Link 
            to="/agent/upload" 
            className="flex-1 sm:flex-initial bg-brand-coral hover:bg-brand-coral/90 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-coral/10 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="inline">Upload Listing</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className={`flex-1 sm:flex-initial border font-bold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <LogOut size={16} className="text-brand-coral" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* =======================================================================
         ANALYTICAL STATISTICS MATRIX GRID
         ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Metric 1 */}
        <div className={`border rounded-2xl p-5 md:p-6 relative overflow-hidden backdrop-blur-xl shadow-sm transition-all ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Active Agency Portfolio</p>
          <p className="text-3xl md:text-4xl font-display font-black mt-2">
            {isLoadingProps ? '-' : activeListingsCount} <span className={`text-xs font-normal tracking-wide uppercase ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Units Listed</span>
          </p>
          <div className={`absolute right-4 bottom-4 transition-transform duration-500 ${isDarkMode ? 'text-white/5' : 'text-slate-100'}`}>
            <Building2 size={56} strokeWidth={1} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`border rounded-2xl p-5 md:p-6 relative overflow-hidden backdrop-blur-xl shadow-sm transition-all group ${
          isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50/50'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Onboarded Broker Roster</p>
          {isLoadingAgents ? (
            <div className={`h-10 w-16 rounded-lg animate-pulse mt-2 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
          ) : (
            <p className="text-3xl md:text-4xl font-display font-black mt-2">
              {agents.length} <span className={`text-xs font-medium tracking-wide uppercase ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Verified Agents</span>
            </p>
          )}
          <div className={`absolute right-4 bottom-4 transition-transform duration-500 transform group-hover:scale-110 ${isDarkMode ? 'text-white/5' : 'text-slate-100'}`}>
            <Users2 size={56} strokeWidth={1} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`border rounded-2xl p-5 md:p-6 relative overflow-hidden backdrop-blur-xl shadow-sm transition-all sm:col-span-2 lg:col-span-1 ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>System Operational Integrity</p>
          <p className="text-3xl md:text-4xl font-display font-black mt-2 text-emerald-500 flex items-center gap-2">
            Secure <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </p>
          <div className={`absolute right-4 bottom-4 transition-transform duration-500 ${isDarkMode ? 'text-white/5' : 'text-slate-100'}`}>
            <ShieldCheck size={56} strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* =======================================================================
         SEGMENTED CONTROL SEGMENTED NAVIGATION (ANTI-ENDLESS SCROLL WORKSPACE)
         ======================================================================= */}
      <div className={`p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto custom-premium-scrollbar border shadow-inner ${
        isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-200/60 border-slate-200'
      }`}>
        {[
          { id: 'overview', label: 'Overview Matrix', icon: <LayoutDashboard size={14} /> },
          { id: 'properties', label: `Properties (${properties.length})`, icon: <Building2 size={14} /> },
          { id: 'staff', label: `Staff Registry (${agents.length})`, icon: <Users2 size={14} /> },
          { id: 'tours', label: `Tour Pipeline (${prioritizedBookings.length})`, icon: <Compass size={14} /> },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? isDarkMode
                    ? 'bg-brand-cobalt text-white shadow-md shadow-brand-cobalt/10'
                    : 'bg-white text-brand-cobalt shadow-sm'
                  : isDarkMode
                    ? 'text-white/40 hover:text-white hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =======================================================================
         CORE VIEW CONTROL SWITCH DECK
         ======================================================================= */}
      <div className="space-y-6">
        
        {/* VIEW 1: OVERVIEW COMPACT DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Frame column: Invite Card */}
            <div className={`border rounded-[2rem] p-6 backdrop-blur-xl flex flex-col justify-between h-full ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <h3 className="text-xl font-display font-bold mb-1.5 flex items-center gap-2">
                  Invite Secure Agent
                </h3>
                <p className={`text-xs leading-relaxed mb-6 font-medium ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                  Issue a single-use, cryptographically verified magic token enabling a broker to register directly under your firm.
                </p>

                {inviteSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl text-xs font-bold mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {inviteSuccess}
                  </div>
                )}

                {inviteError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-xs font-bold mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {inviteError}
                  </div>
                )}

                <form onSubmit={handleSendInvite} className="space-y-4">
                  <input 
                    type="email"
                    required
                    placeholder="agent@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-cobalt/40 transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-cobalt' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-brand-cobalt'
                    }`}
                  />
                  
                  <button 
                    type="submit"
                    disabled={inviteLoading}
                    className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all transform active:scale-[0.98] disabled:opacity-40 shadow-sm"
                  >
                    {inviteLoading ? 'Generating Link...' : 'Generate Invite Link'}
                  </button>
                </form>

                {generatedLink && (
                  <div className={`mt-5 border rounded-2xl p-4 space-y-2.5 animate-in zoom-in-95 duration-300 ${
                    isDarkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-cobalt">Onboarding Link</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">Active (24h)</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 border rounded-xl p-2 pl-3 overflow-hidden group/box ${
                      isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200'
                    }`}>
                      <p className={`text-xs font-mono truncate flex-1 select-all ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>
                        {generatedLink}
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 transform active:scale-95 ${
                          copied 
                            ? 'bg-emerald-500 text-white' 
                            : isDarkMode
                              ? 'bg-white/5 hover:bg-brand-cobalt text-white/80 hover:text-white'
                              : 'bg-slate-100 hover:bg-brand-cobalt text-slate-700 hover:text-white'
                        }`}
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`border-t pt-4 mt-6 text-[11px] flex items-center gap-2 font-mono ${
                isDarkMode ? 'border-white/5 text-white/30' : 'border-slate-100 text-slate-400'
              }`}>
                <ShieldCheck size={14} className="text-brand-cobalt" />
                Encrypted Security Vault Active
              </div>
            </div>

            {/* Right Frame Column: Compact Activity Aggregates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Component Render Previews for Overview Workspace */}
              <div className={`p-6 border rounded-[2rem] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-bold text-lg">Realtime Pipelines</h4>
                  <button onClick={() => setActiveTab('tours')} className="text-xs font-bold text-brand-cobalt hover:underline">View All Pipeline ({prioritizedBookings.length})</button>
                </div>
                <p className={`text-xs mb-4 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Displaying high-priority operations pending review.</p>
                <div className="max-h-[260px] overflow-y-auto space-y-2.5 standard-scrollbar pr-1">
                  {prioritizedBookings.slice(0, 2).map(booking => (
                    <div key={booking._id} className={`p-4 border rounded-xl flex items-center justify-between text-xs ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <div>
                        <p className="font-bold">{booking.explorer?.fullName}</p>
                        <p className={isDarkMode ? 'text-white/40' : 'text-slate-400'}>{booking.schedule?.date} • {booking.schedule?.timeSlot}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase font-bold">{booking.status}</span>
                    </div>
                  ))}
                  {prioritizedBookings.length === 0 && <p className="text-xs text-center py-6 text-slate-400">No tours logged.</p>}
                </div>
              </div>

              <div className={`p-6 border rounded-[2rem] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-display font-bold text-lg">Asset Matrix Preview</h4>
                  <button onClick={() => setActiveTab('properties')} className="text-xs font-bold text-brand-cobalt hover:underline">Manage Portfolio</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-xs text-slate-400 font-bold block">Available Units</span>
                    <span className="text-2xl font-black mt-1 block">{properties.filter(p => p.isAvailable).length}</span>
                  </div>
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-xs text-slate-400 font-bold block">Private Off-market</span>
                    <span className="text-2xl font-black mt-1 block">{properties.filter(p => !p.isAvailable).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ENTERPRISE PROPERTY LEDGER ROUTER */}
        {activeTab === 'properties' && (
          <div className={`border rounded-[2rem] p-4 md:p-6 backdrop-blur-xl ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-display font-bold">Enterprise Property Ledger</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Real-time corporate portfolio evaluation and availability controls.</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                isDarkMode ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-600'
              }`}>
                Asset Control Matrix
              </span>
            </div>
            
            {/* Table Scroll Engine */}
            <div className="w-full overflow-x-auto max-h-[500px] overflow-y-auto pr-1 custom-premium-scrollbar border rounded-xl">
              <table className="w-full text-left text-sm relative border-collapse">
                <thead className={`text-xs uppercase font-mono sticky top-0 z-10 backdrop-blur-md border-b ${
                  isDarkMode ? 'text-white/40 border-white/5 bg-[#1E293B]' : 'text-slate-500 border-slate-100 bg-slate-50'
                }`}>
                  <tr>
                    <th className="py-4 px-4 bg-transparent">Property Asset</th>
                    <th className="py-4 px-4 bg-transparent">Valuation (NGN)</th>
                    <th className="py-4 px-4 bg-transparent text-center">Market Status</th>
                    <th className="py-4 px-4 bg-transparent text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                  {isLoadingProps ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center font-bold">
                        <div className="flex items-center justify-center gap-2 text-xs font-mono">
                          <Loader2 size={16} className="animate-spin text-brand-cobalt" />
                          Syncing Ledger...
                        </div>
                      </td>
                    </tr>
                  ) : properties.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-16 text-center text-slate-400 font-medium text-xs">
                        No real estate assets logged in the corporate portfolio yet.
                      </td>
                    </tr>
                  ) : (
                    properties.map((property) => (
                      <tr key={property._id} className={`transition-colors group ${
                        isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/60'
                      }`}>
                        <td className="py-4 px-4">
                          <p className="font-bold text-sm truncate max-w-[240px]">{property.title}</p>
                          <p className="text-xs text-brand-cobalt mt-0.5 font-medium">{property.location?.locality || property.locality}, {property.location?.state || property.state}</p>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold">
                          ₦ {property.pricePerAnnum?.toLocaleString()}<span className="text-slate-400 text-xs font-sans font-normal">/yr</span>
                        </td>
                        
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(property._id, property.isAvailable)}
                              className={`
                                relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-cobalt/40
                                ${property.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}
                              `}
                            >
                              <span
                                className={`
                                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 
                                  transition duration-300 ease-in-out
                                  ${property.isAvailable ? 'translate-x-4' : 'translate-x-0'}
                                `}
                              />
                            </button>
                            <span className={`text-[9px] uppercase font-black tracking-wider ${property.isAvailable ? 'text-emerald-500' : 'text-slate-400'}`}>
                              {property.isAvailable ? 'Active' : 'Private'}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setEditingProperty(property)}
                              className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-all group/edit cursor-pointer ${
                                isDarkMode ? 'bg-white/5 border-white/5 hover:bg-brand-cobalt/20 text-white/60 hover:text-brand-cobalt' : 'bg-white border-slate-200 hover:bg-brand-cobalt/10 text-slate-600 hover:text-brand-cobalt'
                              }`}
                              title="Edit Listing"
                            >
                              <svg className="w-4 h-4 transition-transform group-hover/edit:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteProperty(property._id)}
                              className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-all group/delete cursor-pointer ${
                                isDarkMode ? 'bg-white/5 border-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-500' : 'bg-white border-slate-200 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500'
                              }`}
                              title="Purge Listing"
                            >
                              <svg className="w-4 h-4 transition-transform group-hover/delete:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: STAFF REGISTRY CONTROL ENGINE */}
        {activeTab === 'staff' && (
          <div className={`border rounded-[2rem] p-4 md:p-6 backdrop-blur-xl ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-display font-bold">Staff Registry</h3>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Live credential status and security scope clearings for your corporate field agents.</p>
              </div>
              <span className={`text-[10px] font-mono tracking-wider uppercase px-3 py-1 rounded-full border ${
                isDarkMode ? 'bg-white/5 border-white/10 text-white/60' : 'bg-slate-50 border-slate-200 text-slate-600 shadow-sm'
              }`}>
                Roster Scope: Global
              </span>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-1 custom-premium-scrollbar border rounded-xl">
              <table className="w-full text-left text-sm relative border-collapse">
                <thead className={`text-xs uppercase font-mono sticky top-0 z-10 backdrop-blur-md border-b ${
                  isDarkMode ? 'text-white/40 border-white/5 bg-[#1E293B]' : 'text-slate-500 border-slate-100 bg-slate-50'
                }`}>
                  <tr>
                    <th className="py-4 px-4 bg-transparent">Broker Name</th>
                    <th className="py-4 px-4 bg-transparent">Email Handle</th>
                    <th className="py-4 px-4 bg-transparent">Clearance Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                  {isLoadingAgents ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`} className="animate-pulse">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                          <div className="space-y-2">
                            <div className={`h-4 w-28 rounded ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                            <div className={`h-3 w-16 rounded ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`h-4 w-40 rounded ${isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`} />
                        </td>
                        <td className="py-4 px-4">
                          <div className={`h-6 w-20 rounded-md ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
                        </td>
                      </tr>
                    ))
                  ) : agents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-16 text-center text-slate-400 font-medium text-xs">
                        No active agents synced to your administrative shell yet.
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent) => {
                      const isProfileActive = agent.status?.toUpperCase() === 'ACTIVE';
                      const isProfilePending = agent.status?.toUpperCase() === 'PENDING';
                      
                      return (
                        <tr key={agent._id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/60'}`}>
                          <td className="py-4 px-4 font-medium flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden group-hover:border-white/20 transition-colors ${
                              isDarkMode ? 'bg-[#0F172A] border-white/10 text-brand-gold' : 'bg-slate-100 border-slate-200 text-brand-cobalt'
                            }`}>
                              {agent.avatar ? (
                                <img src={agent.avatar} alt="Broker Signature Profile" className="w-full h-full object-cover" />
                              ) : (
                                `${agent.firstName?.[0] || ''}${agent.lastName?.[0] || ''}`.toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-display font-bold tracking-wide group-hover:text-brand-gold transition-colors">
                                {agent.firstName} {agent.lastName}
                              </p>
                              <p className={`text-[10px] font-mono uppercase tracking-widest mt-0.5 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
                                Joined {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </td>

                          <td className={`py-4 px-4 font-mono text-xs ${isDarkMode ? 'text-white/50 group-hover:text-white/80' : 'text-slate-500 group-hover:text-slate-900'}`}>
                            {agent.email}
                          </td>

                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                              isProfileActive 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                : isProfilePending
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isProfileActive ? 'bg-emerald-500 animate-pulse' : isProfilePending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                              {agent.status || 'UNVERIFIED'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: UPCOMING TOUR PIPELINE EXECUTOR */}
        {activeTab === 'tours' && (
          <div className={`border rounded-[2rem] p-4 md:p-6 backdrop-blur-xl flex flex-col min-h-[500px] ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4 shrink-0 border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-xl font-display font-bold">Upcoming Tour Booking Pipeline</h3>
                <p className={`text-xs font-medium mt-0.5 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>Real-time evaluations managed by client explorers.</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-bold text-amber-500 tracking-wide uppercase">Live Stream</span>
              </div>
            </div>

            {/* Bookings Scroll deck */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-premium-scrollbar max-h-[440px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 gap-2 text-xs font-mono">
                  <Loader2 size={16} className="animate-spin text-brand-cobalt" /> Syncing data registries...
                </div>
              ) : prioritizedBookings.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-center text-slate-400 text-xs font-medium">
                  No active property tours currently scheduled.
                </div>
              ) : (
                prioritizedBookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className={`border hover:border-brand-cobalt/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      booking.status === 'PENDING' 
                        ? isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200/60'
                        : 'opacity-70 border-transparent bg-transparent'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold truncate">{booking.explorer?.fullName}</span>
                        <span className={`text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded uppercase ${
                          booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                          booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1 shrink-0 font-medium">
                          <CalendarDays size={12} className="text-brand-cobalt" /> 
                          {formatBookingDate(booking.schedule?.date)}
                        </span>
                        <span className="flex items-center gap-1 capitalize shrink-0 font-medium">
                          <Clock size={12} /> 
                          {booking.schedule?.timeSlot}
                        </span>
                        <a href={`tel:${booking.explorer?.phone}`} className="flex items-center gap-1 text-emerald-500 hover:underline font-mono text-[11px] shrink-0 font-bold">
                          <Phone size={10} /> {booking.explorer?.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {actioningId === booking._id ? (
                        <div className="px-6 py-2 flex items-center justify-center">
                          <Loader2 size={16} className="animate-spin text-brand-cobalt" />
                        </div>
                      ) : booking.status === 'PENDING' ? (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'CANCELLED')}
                            className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isDarkMode ? 'bg-white/5 hover:bg-rose-500/10 text-white/60 hover:text-rose-400 border-white/5' : 'bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-500 border-slate-200'
                            }`}
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'CONFIRMED')}
                            className="px-4 py-2 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Accept Tour
                          </button>
                        </>
                      ) : booking.status === 'CONFIRMED' ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-500 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Confirmed
                          </span>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'COMPLETED')}
                            className={`text-[10px] uppercase tracking-wider font-black px-3 py-1.5 border rounded-lg transition-all cursor-pointer ${
                              isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                            }`}
                          >
                            Conclude Tour
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[11px] font-mono px-3 py-1 rounded-lg border ${
                          isDarkMode ? 'bg-black/20 border-white/5 text-white/20' : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          ARCHIVED
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Metadata */}
            <div className={`border-t pt-4 mt-6 text-[11px] flex items-center justify-between font-mono w-full ${
              isDarkMode ? 'border-white/5 text-white/30' : 'border-slate-100 text-slate-400'
            }`}>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Automated Router Engaged
              </span>
              <span className="font-bold">{bookings?.length || 0} Total Units</span>
            </div>
          </div>
        )}

      </div>

    </div>

    {/* PERSISTENT CRITICAL MODALS (Stays contextual outside grid locks) */}
    {editingProperty && (
      <EditPropertyModal 
        property={editingProperty}
        onClose={() => setEditingProperty(null)}
        onSave={handleSaveEdit}
      />
    )}
  </div>
);
};