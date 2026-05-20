import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';

export const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Invitation Form State Layer
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteSuccess(null);
    setInviteError(null);

    try {
      // Simply await the post request without assigning it to an unused variable
      await apiClient.post('/auth/invite-agent', {
        email: inviteEmail,
        agencyId: user?.agencyId
      });

      setInviteSuccess(`Invitation successfully generated for ${inviteEmail}!`);
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.response?.data?.message || 'Failed to dispatch magic link invitation.');
    } finally {
      setInviteLoading(false);
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
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-medium mb-4">
                  {inviteSuccess}
                </div>
              )}

              {inviteError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-medium mb-4">
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
                  className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-opacity disabled:opacity-40"
                >
                  {inviteLoading ? 'Generating Token...' : 'Generate Magic Link'}
                </button>
              </form>
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

          </div>

        </div>

      </div>
    </div>
  );
};