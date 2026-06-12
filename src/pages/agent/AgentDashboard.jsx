import  { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Eye, TrendingUp, LogOut, Settings, Plus } from 'lucide-react';
import {apiClient} from '../../services/apiClient'
import { EditPropertyModal } from '../../components/EditPropertyModal'; // Adjust path if necessary
import toast from 'react-hot-toast'

export const AgentDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // =======================================================================
  // STATE MANAGEMENT
  // =======================================================================
  const [properties, setProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  // Theme Configuration State (Defaults to dark mode)
const [isDarkMode, setIsDarkMode] = useState(true);

  // =======================================================================
  // DATA FETCHING
  // =======================================================================
  useEffect(() => {
    const fetchAgentProperties = async () => {
      try {
        // Fetch properties (isAvailable=all ensures we see off-market ones too)
        const response = await apiClient.get('/properties?isAvailable=all');
        
        
        setProperties(response.data.data.properties);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setIsLoadingProps(false);
      }
    };
    
    fetchAgentProperties();
  }, [user]);

  // =======================================================================
  // CRUD CONTROLLERS
  // =======================================================================
  const handleToggleAvailability = async (propertyId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Optimistic UI Update
    setProperties(prevProps => 
      prevProps.map(p => p._id === propertyId ? { ...p, isAvailable: newStatus } : p)
    );

    try {
      await apiClient.patch(`/properties/${propertyId}`, { isAvailable: newStatus });
    } catch (error) {
      // Revert if server fails
      setProperties(prevProps => 
        prevProps.map(p => p._id === propertyId ? { ...p, isAvailable: currentStatus } : p)
      );
      toast.error("Failed to sync status with the server.");
      console.error("Availability toggle failed:", error);
    }
  };

  const handleSaveEdit = async (propertyId, updatedData) => {
    try {
      const response = await apiClient.patch(`/properties/${propertyId}`, updatedData);
      setProperties(prevProps => 
        prevProps.map(p => p._id === propertyId ? { ...p, ...response.data.data.property } : p)
      );
      setEditingProperty(null);
    } catch (error) {
      console.error("Failed to update asset:", error);
      alert("Failed to update property details.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if(!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      await apiClient.delete(`/properties/${propertyId}`);
      setProperties(prev => prev.filter(p => p._id !== propertyId));
    } catch (error) {
      console.error("Purge failed:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dynamic Metrics Calculations
  const activeListingsCount = properties.filter(p => p.isAvailable).length;

  return (
  <div className={`min-h-screen font-sans transition-colors duration-300 ${
    isDarkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
  }`}>
    
    {/* MAIN CONTAINER */}
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 md:space-y-10">
      
      {/* =======================================================================
          HEADER & IDENTITY WORKSPACE
          ======================================================================= */}
      <div className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 overflow-hidden ${
        isDarkMode 
          ? 'bg-[#131C2E]/60 border-white/[0.06] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(148,163,184,0.12)]'
      }`}>
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-coral/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-cobalt/5 rounded-full blur-3xl pointer-events-none" />

        {/* Action Controls & Theme Switcher Grid */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-6 transition-colors duration-300 ${
          isDarkMode ? 'border-white/[0.06]' : 'border-slate-100'
        }">
          {/* Workspace Branding / Mode Indicator */}
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              properties.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
            <p className={`text-xs font-mono tracking-wider uppercase font-bold ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Broker Execution Environment
            </p>
          </div>

          {/* Controls Hook */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto sm:ml-0">
            {/* Dynamic Theme Controller Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Switch to Luxury Light' : 'Switch to Onyx Dark'}
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.344l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button className={`border px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}>
              <Settings size={16} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <button 
              onClick={handleLogout}
              className="bg-brand-coral/10 hover:bg-brand-coral/20 border border-brand-coral/20 text-brand-coral px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Identity Profile Stack */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center text-2xl sm:text-3xl font-display font-black shadow-xl shrink-0 uppercase transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[#1E293B] border-brand-cobalt/30 text-brand-cobalt shadow-brand-cobalt/5' 
              : 'bg-slate-50 border-slate-200 text-brand-cobalt shadow-slate-200/5'
          }`}>
            {user?.firstName?.charAt(0) || 'A'}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-brand-cobalt/10 border border-brand-cobalt/30 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded text-brand-cobalt">
                Verified Broker
              </span>
              <span className={`text-xs font-mono ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                Agency ID: <span className="font-bold underline tracking-wide">{user?.agencyId || 'Pending'}</span>
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-display font-black tracking-tight capitalize ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
        </div>
      </div>

      {/* =======================================================================
          PRIMARY ACTION BANNER
          ======================================================================= */}
      <div className={`border rounded-[1.75rem] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-300 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-white/10 shadow-xl' 
          : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md'
      }`}>
        <div className="space-y-1.5 max-w-2xl">
          <h2 className={`text-xl sm:text-2xl font-display font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Grow Your Portfolio
          </h2>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Upload new luxury listings directly to the global feed. Ensure your property images are high-resolution to maximize client engagement.
          </p>
        </div>
        <Link 
          to="/agent/upload" 
          className="shrink-0 w-full lg:w-auto bg-brand-coral hover:bg-brand-coral/90 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg shadow-brand-coral/20 hover:shadow-brand-coral/30 transform active:scale-[0.98] flex items-center justify-center gap-2 font-sans tracking-wide"
        >
          <Plus size={16} strokeWidth={3} />
          Upload Property
        </Link>
      </div>

      {/* =======================================================================
          PERFORMANCE METRICS MATRIX
          ======================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Listings Card */}
        <div className={`border rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200'
        }`}>
          <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Active Listings
          </p>
          <p className={`text-3xl sm:text-4xl font-display font-black mt-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {isLoadingProps ? (
              <span className="inline-block w-8 h-8 rounded bg-slate-700/20 animate-pulse" />
            ) : activeListingsCount}
          </p>
          <Home className={`absolute right-4 bottom-2 w-14 h-14 sm:w-16 sm:h-16 transition-colors duration-300 ${
            isDarkMode ? 'text-white/[0.03]' : 'text-slate-200/50'
          }`} strokeWidth={1} />
        </div>

        {/* Total Impressions Card */}
        <div className={`border rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 ${
          isDarkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200'
        }`}>
          <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Total Impressions
          </p>
          <p className={`text-3xl sm:text-4xl font-display font-black mt-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            0
          </p>
          <Eye className={`absolute right-4 bottom-2 w-14 h-14 sm:w-16 sm:h-16 transition-colors duration-300 ${
            isDarkMode ? 'text-white/[0.03]' : 'text-slate-200/50'
          }`} strokeWidth={1} />
        </div>

        {/* Engagement Rate Card */}
        <div className={`border rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 sm:col-span-2 lg:col-span-1 ${
          isDarkMode ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200'
        }`}>
          <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
            Engagement Rate
          </p>
          <p className="text-3xl sm:text-4xl font-display font-black mt-2 text-emerald-500 tracking-tight">
            0%
          </p>
          <TrendingUp className={`absolute right-4 bottom-2 w-14 h-14 sm:w-16 sm:h-16 transition-colors duration-300 ${
            isDarkMode ? 'text-white/[0.03]' : 'text-slate-200/50'
          }`} strokeWidth={1} />
        </div>
      </div>

      {/* =======================================================================
          LISTING INVENTORY DATA MATRIX
          ======================================================================= */}
      <div className={`border rounded-[1.75rem] p-4 sm:p-6 transition-all duration-300 overflow-hidden ${
        isDarkMode ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-lg sm:text-xl font-display font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Your Active Inventory
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time synchronization with cloud storage channels
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
            isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            Total Records: {properties.length}
          </div>
        </div>

        {/* DATA SCROLL ARCHITECTURE */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle p-4 sm:p-0">
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-mono tracking-wider border-b transition-colors duration-300 ${
                isDarkMode ? 'text-slate-400 border-white/[0.05]' : 'text-slate-500 border-slate-100'
              }`}>
                <tr>
                  <th className="py-3.5 px-3 font-semibold">Property Identity</th>
                  <th className="py-3.5 px-3 font-semibold">Market Price</th>
                  <th className="py-3.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${
                isDarkMode ? 'divide-white/[0.05]' : 'divide-slate-100'
              }`}>
                {/* STATE 1: ASYNC LOADING DATA */}
                {isLoadingProps ? (
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-brand-cobalt border-t-transparent rounded-full animate-spin" />
                        <p className={`text-xs font-medium tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          Syncing Portfolio Pipeline...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  /* STATE 2: EMPTY REPOSITORY VALUE */
                  <tr>
                    <td colSpan="4" className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          No Active Assets Discovered
                        </p>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          No properties currently active in your portfolio. Click 'Launch Upload Studio' to begin onboarding asset links.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* STATE 3: INTERACTIVE DATATABLE ROWS */
                  properties.map((property) => (
                    <tr 
                      key={property._id} 
                      className={`transition-colors duration-200 group ${
                        isDarkMode ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Identity Details */}
                      <td className="py-4 px-3 max-w-[240px]">
                        <p className={`font-bold text-sm truncate transition-colors duration-200 ${
                          isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'
                        }`}>
                          {property.title}
                        </p>
                        <p className="text-xs text-brand-cobalt mt-0.5 font-medium tracking-wide truncate">
                          {property.location?.locality || property.locality}, {property.location?.state || property.state}
                        </p>
                      </td>

                      {/* Financial Index Column */}
                      <td className={`py-4 px-3 font-mono text-sm font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        ₦ {property.pricePerAnnum?.toLocaleString()}
                        <span className={`text-[11px] font-normal font-sans ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>
                          /yr
                        </span>
                      </td>
                      
                      {/* Interactive Availability Toggle Element */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(property._id, property.isAvailable)}
                            className={`
                              relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                              transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-cobalt/40
                              ${property.isAvailable ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}
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
                          <span className={`text-[9px] uppercase font-black tracking-widest ${
                            property.isAvailable ? 'text-emerald-500' : isDarkMode ? 'text-white/30' : 'text-slate-400'
                          }`}>
                            {property.isAvailable ? 'Active' : 'Private'}
                          </span>
                        </div>
                      </td>
                      
                      {/* Action Interface Operations */}
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Trigger Update Form */}
                          <button 
                            onClick={() => setEditingProperty(property)}
                            className={`flex items-center justify-center w-9 h-9 border rounded-xl transition-all duration-300 group/edit ${
                              isDarkMode 
                                ? 'bg-white/5 border-white/5 hover:bg-brand-cobalt/20 text-slate-400 hover:text-brand-cobalt hover:border-brand-cobalt/30' 
                                : 'bg-slate-50 border-slate-200 hover:bg-brand-cobalt/10 text-slate-500 hover:text-brand-cobalt hover:border-brand-cobalt/20'
                            }`}
                            title="Edit Listing Details"
                          >
                            <svg className="w-4 h-4 transition-transform group-hover/edit:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          {/* Trigger Cloud Purging Lifecycle */}
                          <button 
                            onClick={() => handleDeleteProperty(property._id)}
                            className={`flex items-center justify-center w-9 h-9 border rounded-xl transition-all duration-300 group/delete ${
                              isDarkMode 
                                ? 'bg-white/5 border-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 hover:border-rose-500/20' 
                                : 'bg-slate-50 border-slate-200 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 hover:border-rose-500/20'
                            }`}
                            title="Purge Asset Records"
                          >
                            <svg className="w-4 h-4 transition-transform group-hover/delete:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      </div>

      {/* =======================================================================
          EDIT MODAL SUBSYSTEM (Conditionally Rendered)
          ======================================================================= */}
      {editingProperty && (
        <EditPropertyModal 
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  </div>
);
};