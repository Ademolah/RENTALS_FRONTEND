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
    <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* =======================================================================
           HEADER & IDENTITY
           ======================================================================= */}
        <div className="relative border-b border-white/10 pb-8">
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button 
              onClick={handleLogout}
              className="bg-brand-coral/10 hover:bg-brand-coral/20 border border-brand-coral/20 text-brand-coral px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          <div className="flex items-center gap-6 pt-10 md:pt-0">
            <div className="w-20 h-20 rounded-2xl bg-brand-midnight border border-brand-cobalt/30 flex items-center justify-center text-3xl font-display font-bold text-brand-cobalt shadow-lg shadow-brand-cobalt/10 shrink-0 uppercase">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="bg-brand-cobalt/20  border border-brand-cobalt/30 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded text-white">
                  Verified Broker
                </span>
                <span className="text-white/40 text-xs font-mono">Agency ID: {user?.agencyId || 'Pending'}</span>
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight text-white capitalize">
                {user?.firstName} {user?.lastName}
              </h1>
            </div>
          </div>
        </div>

        {/* =======================================================================
           PRIMARY ACTION BANNER
           ======================================================================= */}
        <div className="bg-brand-midnight border border-white/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Grow Your Portfolio</h2>
            <p className="text-brand-slate/60 text-sm max-w-xl">
              Upload new luxury listings directly to the global feed. Ensure your property images are high-resolution to maximize client engagement.
            </p>
          </div>
          <Link 
            to="/agent/upload" 
            className="shrink-0 w-full md:w-auto bg-brand-coral hover:bg-brand-coral/90 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-coral/10 transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={18} strokeWidth={3} />
            Upload Property
          </Link>
        </div>

        {/* =======================================================================
           PERFORMANCE METRICS (Now Dynamic)
           ======================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Active Listings</p>
            <p className="text-4xl font-display font-black mt-2">
              {isLoadingProps ? '-' : activeListingsCount}
            </p>
            <Home className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Total Impressions</p>
            <p className="text-4xl font-display font-black mt-2">0</p>
            <Eye className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Engagement Rate</p>
            <p className="text-4xl font-display font-black mt-2 text-emerald-400">0%</p>
            <TrendingUp className="absolute right-4 bottom-4 text-white/5 w-16 h-16" strokeWidth={1} />
          </div>
        </div>

        {/* =======================================================================
           LISTING INVENTORY TABLE (Fully Dynamic)
           ======================================================================= */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
          <h3 className="text-xl font-display font-bold mb-4">Your Active Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="text-xs text-white/40 uppercase font-mono border-b border-white/5">
                <tr>
                  <th className="py-3 px-2">Property Identity</th>
                  <th className="py-3 px-2">Market Price</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoadingProps ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-white/30 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-brand-cobalt border-t-transparent rounded-full animate-spin"></div>
                        Syncing Portfolio...
                      </div>
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-white/30 font-medium">
                      No properties currently active in your portfolio. Click 'Launch Upload Studio' to begin.
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-2">
                        <p className="text-white font-bold text-sm truncate max-w-[200px]">{property.title}</p>
                        <p className="text-xs text-brand-cobalt mt-0.5">{property.location?.locality || property.locality}, {property.location?.state || property.state}</p>
                      </td>
                      <td className="py-4 px-2 font-mono text-white">
                        ₦ {property.pricePerAnnum?.toLocaleString()}<span className="text-white/30 text-xs">/yr</span>
                      </td>
                      
                      {/* Availability Toggle */}
                      <td className="py-4 px-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(property._id, property.isAvailable)}
                            className={`
                              relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                              transition-colors duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-brand-cobalt/50
                              ${property.isAvailable ? 'bg-emerald-500' : 'bg-white/10'}
                            `}
                          >
                            <span
                              className={`
                                pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 
                                transition duration-300 ease-in-out
                                ${property.isAvailable ? 'translate-x-4' : 'translate-x-0'}
                              `}
                            />
                          </button>
                          <span className={`text-[9px] uppercase font-bold tracking-wider ${property.isAvailable ? 'text-emerald-400' : 'text-white/40'}`}>
                            {property.isAvailable ? 'Active' : 'Private'}
                          </span>
                        </div>
                      </td>
                      
                      {/* Action Buttons */}
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                          <button 
                            onClick={() => setEditingProperty(property)}
                            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/5 hover:bg-brand-cobalt/20 text-white/60 hover:text-brand-cobalt rounded-lg transition-all duration-300 group/edit"
                            title="Edit Listing"
                          >
                            <svg className="w-4 h-4 transition-transform group-hover/edit:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteProperty(property._id)}
                            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 rounded-lg transition-all duration-300 group/delete"
                            title="Delete Listing"
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

        {/* =======================================================================
           EDIT MODAL (Conditionally Rendered)
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