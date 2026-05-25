import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';
import toast from 'react-hot-toast';
import { EditPropertyModal } from '../../components/EditPropertyModal';

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
    const fetchDashboardProperties = async () => {
      try {
        // We pass ?isAvailable=all so the CEO sees off-market properties too
        const response = await apiClient.get('/properties?isAvailable=all');
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

  // const handleDeleteProperty = async (propertyId) => {
  //   if(!window.confirm("Are you sure you want to permanently purge this asset?")) return;
    
  //   try {
  //     await apiClient.delete(`/properties/${propertyId}`);
  //     // Remove it from the UI
  //     setProperties(prev => prev.filter(p => p._id !== propertyId));
  //   } catch (error) {
  //     toast.error("Failed to delete property.");
  //     console.error("Purge failed:", error);
  //   }
  // };

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

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* =======================================================================
           HEADER ARCHITECTURE
           ======================================================================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-brand-cobalt text-xs font-black tracking-widest uppercase px-3 py-1 rounded-md text-white">
                Enterprise Layer
              </span>
              <span className="text-white/40 text-xs font-mono">ID: {user?.agencyId || 'No Agency Synced'}</span>
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight text-white mt-2">
              CEO Management Console
            </h1>
            <p className="text-brand-slate/60 text-sm mt-1 font-medium">
              Oversee corporate properties, register field staff, and track transactional velocity.
            </p>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-4">
            <Link 
              to="/agent/upload" 
              className="bg-brand-coral hover:bg-brand-coral/90 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-brand-coral/10 transform active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
              Upload New Listing
            </Link>
            
            <button 
              onClick={handleLogout}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-brand-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* =======================================================================
           ANALYTICAL STATISTICS MATRIX
           ======================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Active Agency Portfolio</p>
            <p className="text-4xl font-display font-black mt-2">0 <span className="text-sm font-normal text-white/40">Units Listed</span></p>
            <div className="absolute right-4 bottom-4 text-white/5">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Onboarded Broker Roster</p>
            <p className="text-4xl font-display font-black mt-2">0 <span className="text-sm font-normal text-white/40">Verified Agents</span></p>
            <div className="absolute right-4 bottom-4 text-white/5">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">System Operational Integrity</p>
            <p className="text-4xl font-display font-black mt-2 text-emerald-400">Secure</p>
            <div className="absolute right-4 bottom-4 text-white/5">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* =======================================================================
           THE MAGIC LINK INTERACTIVE INVITATION LAYER
           ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Agent Invitation Form */}
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display font-bold mb-2">Invite Secure Agent</h3>
              <p className="text-brand-slate/60 text-xs leading-relaxed mb-6 font-medium">
                Issue a single-use, cryptographically verified magic token enabling a broker to register directly under your firm.
              </p>

              {inviteSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-medium mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {inviteSuccess}
                </div>
              )}

              {inviteError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-medium mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
                
                <button 
                  type="submit"
                  disabled={inviteLoading}
                  className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all transform active:scale-[0.98] disabled:opacity-40"
                >
                  {inviteLoading ? 'Generating Link...' : 'Generate Invite Link'}
                </button>
              </form>

              {/* Dynamic Copiable Token Display Box */}
              {generatedLink && (
                <div className="mt-5 bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2.5 animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-cobalt">Onboarding Link</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active (24h)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl p-2 pl-3 overflow-hidden group/box">
                    <p className="text-xs font-mono text-white/40 truncate flex-1 select-all">
                      {generatedLink}
                    </p>
                    
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 transform active:scale-95 ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white/5 hover:bg-brand-cobalt text-white/80 hover:text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-white/5 pt-4 mt-6 text-[11px] text-white/30 flex items-center gap-2 font-mono">
              <svg className="w-3.5 h-3.5 text-brand-cobalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Encrypted Security Vault Active
            </div>
          </div>

          {/* =======================================================================
             PORTFOLIO & STAFF TRACKING LISTS
             ======================================================================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Agency Roster Monitoring */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
              <h3 className="text-xl font-display font-bold mb-4">Staff Registry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/60">
                  <thead className="text-xs text-white/40 uppercase font-mono border-b border-white/5">
                    <tr>
                      <th className="py-3 px-2">Broker Name</th>
                      <th className="py-3 px-2">Email Handle</th>
                      <th className="py-3 px-2">Clearance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Empty State UI placeholder until agents populate the table */}
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-white/30 font-medium">
                        No active agents synced to your administrative shell yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* =======================================================================
               2. ENTERPRISE PROPERTY LEDGER (NEW CRUD & AVAILABILITY SECTION)
               ======================================================================= */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold">Enterprise Property Ledger</h3>
                <span className="bg-white/5 text-white/60 text-xs px-3 py-1 rounded-full font-medium">
                  Asset Control
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/60">
                  <thead className="text-xs text-white/40 uppercase font-mono border-b border-white/5">
                    <tr>
                      <th className="py-3 px-2">Property Asset</th>
                      <th className="py-3 px-2">Valuation (NGN)</th>
                      <th className="py-3 px-2 text-center">Market Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    {/* 👇 Replace this mock <tr> block with your actual properties.map(...) 👇 */}
                    
                   {isLoadingProps ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-white/30 font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-brand-cobalt border-t-transparent rounded-full animate-spin"></div>
                            Syncing Ledger...
                          </div>
                        </td>
                      </tr>
                    ) : properties.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-12 text-center text-white/30 font-medium">
                          No real estate assets logged in the corporate portfolio yet.
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
                          
                          {/* Interactive Availability Toggle Cell */}
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
                          
                          {/* CRUD Administrative Actions */}
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
                              
                              {/* <button 
                                onClick={() => handleDeleteProperty(property._id)}
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 rounded-lg transition-all duration-300 group/delete"
                                title="Purge Listing"
                              >
                                <svg className="w-4 h-4 transition-transform group-hover/delete:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                

                  </tbody>
                </table>
              </div>
            </div>

              {editingProperty && (
          <EditPropertyModal 
            property={editingProperty}
            onClose={() => setEditingProperty(null)}
            onSave={handleSaveEdit}
          />
        )}

          </div>

        </div>
      </div>
    </div>
  );
};