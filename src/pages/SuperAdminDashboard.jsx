import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Building2, FileText, CheckCircle, XCircle, 
  ChevronRight, X, Clock, AlertTriangle, LogOut, Loader2, BedDouble
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../services/apiClient'; // Adjust path to your axios instance
import { useAuthStore } from '../store/useAuthStore';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // Data & UI State
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Action State
  const [reviewState, setReviewState] = useState({ decision: null, notes: '' });
  const [isProcessing, setIsProcessing] = useState(false);


 const initials = user 
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'A';

  // =======================================================================
  // 1. PREMIUM UNIFIED DATA INGESTION
  // =======================================================================
  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        setIsLoading(true);
        // Pinging the unified endpoint that parallel-fetches both portfolios
        const response = await apiClient.get('/admin/applications?status=PENDING');
        
        // ⚡️ VISUAL NORMALIZATION: Add explicit tracking properties for the UI data tables
        const normalizedAgencies = (response.data.data.agencies || []).map(agency => ({
          ...agency,
          type: 'agency',
          displayName: agency.corporateName || 'Unnamed Agency',
          displayEmail: agency.agencyEmail || 'No Email Linked'
        }));

        const normalizedHotels = (response.data.data.hotels || []).map(hotel => ({
          ...hotel,
          type: 'hotel',
          displayName: hotel.businessName || 'Premium Hotel Group',
          displayEmail: hotel.applicantEmail || 'No Email Linked'
        }));

        // Merge both arrays cleanly into a unified chronological or structured state
        setApplications([...normalizedAgencies, ...normalizedHotels]);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to securely fetch unified pending applications.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingApplications();
  }, []);

  // =======================================================================
  // 2. BACKEND ACTION HANDLERS (UNIFIED PIPELINE)
  // =======================================================================
  const executeReview = async () => {
    if (!selectedApp || !selectedApp._id) return;

    if (reviewState.decision === 'REJECTED' && reviewState.notes.trim().length < 10) {
      toast.error('You must provide a detailed reason for rejection.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 🧠 INTELLIGENT DISPATCH: Pinging the unified evaluation controller route
      await apiClient.patch(`/admin/applications/${selectedApp._id}/review`, {
        decision: reviewState.decision,
        adminNotes: reviewState.notes,
        type: selectedApp.type // ⚡️ Explictly passed to accelerate backend lookup performance
      });

      // Optimistic UI Removal (Works flawlessly across both types seamlessly)
      setApplications(prev => prev.filter(app => app._id !== selectedApp._id));
      
      const isApproved = reviewState.decision === 'APPROVED';
      const labelType = selectedApp.type === 'hotel' ? 'Hotel Partner' : 'Corporate Agency';

      toast.success(`${labelType} application ${isApproved ? 'Activated' : 'Rejected'} successfully!`, {
        icon: isApproved ? '✅' : '🚨',
        style: { 
          background: '#0B1329', 
          color: '#fff', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px'
        }
      });
      
      // Reset State Closures
      setSelectedApp(null);
      setReviewState({ decision: null, notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
 const handleLogout = () => {
    logout();
    navigate('/');
  };

  // =======================================================================
  // RENDER UI
  // =======================================================================
  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden">
      
      {/* =======================================================================
          A. MOBILE OPTIMIZED NAVIGATION HEADER
          ======================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Left Cluster: Command Context */}
      <div className="flex items-center gap-3 text-brand-gold">
        <Shield size={24} className="shrink-0" />
        <span className="hidden md:inline text-sm font-bold tracking-[0.2em] uppercase">
          Super Admin Command
        </span>
      </div>

      {/* Right Cluster: Profile Engine & Session Management */}
      <div className="flex items-center gap-4 md:gap-6">
        {user && (
          <div className="flex items-center gap-3 border-r border-white/5 pr-4 md:pr-6">
            {/* Geometric Initials Avatar */}
            <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-xs tracking-wider shadow-inner">
              {initials}
            </div>
            
            {/* Chronological Nameplate */}
            <div className="hidden sm:block text-left">
              <p className="text-white font-semibold text-sm leading-none tracking-wide">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase mt-1">
                System Admin
              </p>
            </div>
          </div>
        )}

        {/* Action Trigger */}
        <button 
          onClick={handleLogout}
          className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 group dynamic-blur"
        >
          <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>

      
      <main className="p-6 md:p-10 max-w-[1400px] mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight">Partner Approvals</h1>
          <p className="text-white/40 mt-2 text-sm md:text-base">Review and verify corporate agencies and hotel entities requesting platform access.</p>
        </div>

        {/* =======================================================================
            B. RESPONSIVE DATA GRID (Transforms on Mobile)
            ======================================================================= */}
        <div className="bg-[#1E293B]/50 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl">
          
          {/* Desktop Table Header (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider">
            <div className="col-span-4">Applicant / Entity</div>
            <div className="col-span-3">Registration ID</div>
            <div className="col-span-3">Submission Date</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Dynamic State Rendering */}
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-brand-cobalt">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="text-white/60 text-sm font-bold animate-pulse">Syncing Encrypted Data...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-white/40 flex flex-col items-center">
              <CheckCircle size={48} className="mb-4 text-emerald-500/50" />
              <p className="text-lg font-medium text-white">Inbox Zero</p>
              <p className="text-sm">All partner applications have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {applications.map((app) => (
                <div 
                  key={app._id} 
                  onClick={() => setSelectedApp(app)}
                  /* 🚨 MOBILE TRANSFORMATION LOGIC: Flex-col on mobile, Grid on MD+ */
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 p-5 md:p-6 items-start md:items-center hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  
                  {/* Entity Profile */}
                  <div className="w-full md:col-span-4 flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-4">
                      {/* 🟢 SURGICAL UPDATE: Dynamic Icon based on application type */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0F172A] border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                        {app.type === 'hotel' ? (
                          <BedDouble size={18} className="text-brand-coral" />
                        ) : (
                          <Building2 size={18} className="text-brand-gold" />
                        )}
                        {/* Subtle colored glow based on type */}
                        <div className={`absolute bottom-0 w-full h-1 ${app.type === 'hotel' ? 'bg-brand-coral/50' : 'bg-brand-gold/50'}`} />
                      </div>
                      <div>
                        {/* 🟢 SURGICAL UPDATE: Uses normalized displayName and displayEmail */}
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base md:text-lg text-white line-clamp-1">{app.displayName}</h3>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${app.type === 'hotel' ? 'bg-brand-coral/20 text-brand-coral' : 'bg-brand-gold/20 text-brand-gold'}`}>
                            {app.type}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-white/40 truncate">{app.displayEmail}</p>
                      </div>
                    </div>
                    {/* Mobile Only Quick Action Chevron */}
                    <ChevronRight size={20} className="md:hidden text-white/20 group-hover:text-white" />
                  </div>

                  {/* Registration Number (Stacks nicely on mobile) */}
                  <div className="md:col-span-3 w-full pl-14 md:pl-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs md:text-sm font-mono text-white/80">
                      <FileText size={14} className="text-white/40" /> 
                      {/* 🟢 SURGICAL UPDATE: Fallback chain for different collection schemas */}
                      {app.cacNumber || app.registrationNumber || app.rcNumber || 'Pending ID'}
                    </span>
                  </div>

                  {/* Date (Stacks on mobile) */}
                  <div className="md:col-span-3 w-full pl-14 md:pl-0 flex items-center gap-2 text-xs md:text-sm text-white/40">
                    <Clock size={14} /> 
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Action Button (Hidden on Mobile, Chevron used instead) */}
                  <div className="hidden md:block md:col-span-2 text-right">
                    <button className="text-sm font-bold text-brand-cobalt group-hover:text-white transition-colors inline-flex items-center justify-end gap-1 w-full">
                      Review File <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* =======================================================================
          C. THE MOBILE-OPTIMIZED SLIDE-OVER REVIEW CONSOLE
          ======================================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isProcessing && setSelectedApp(null)}
          />
          
          {/* Slide-over Panel (100% width on mobile, 600px on Desktop) */}
          <div className="relative w-full max-w-[600px] bg-[#1E293B] border-l border-white/10 h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Panel Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex items-start justify-between sticky top-0 bg-[#1E293B]/95 backdrop-blur-md z-10">
              <div className="pr-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 border border-yellow-500/20">
                  <AlertTriangle size={12} /> Pending {selectedApp.type === 'hotel' ? 'Hotel' : 'Agency'} Verification
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                  {/* 🟢 SURGICAL UPDATE: Normalized Name */}
                  {selectedApp.displayName}
                </h2>
              </div>
              <button 
                onClick={() => !isProcessing && setSelectedApp(null)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Application Data Sheet */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              
              {/* Data Cards (Responsive Stacking) */}
              <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-5 md:p-6 space-y-5">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">
                    {selectedApp.type === 'hotel' ? 'Hotel Registration' : 'CAC Registration'}
                  </p>
                  <p className="font-mono text-lg text-white">
                    {selectedApp.cacNumber || selectedApp.registrationNumber || selectedApp.rcNumber || 'Not Provided'}
                  </p>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">Contact Email</p>
                  <p className="text-white break-all">{selectedApp.displayEmail}</p>
                </div>
                <div className="h-px w-full bg-white/5" />
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">Registered Headquarters</p>
                  <p className="text-white text-sm leading-relaxed">
                    {selectedApp.hqAddress || 'Address pending physical verification.'}
                  </p>
                </div>
                
                {/* 🟢 SURGICAL UPDATE: Only show template selection if it exists on the schema */}
                {selectedApp.selectedTemplate && (
                  <>
                    <div className="h-px w-full bg-white/5" />
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1 font-bold">Requested UI Template</p>
                      <span className="inline-block mt-1 capitalize px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-bold text-brand-gold">
                        {selectedApp.selectedTemplate} Architecture
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Area */}
              <div className="pt-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Final Decision</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setReviewState({ ...reviewState, decision: 'APPROVED' })}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                      reviewState.decision === 'APPROVED' 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <CheckCircle size={18} /> Authorize
                  </button>
                  <button
                    onClick={() => setReviewState({ ...reviewState, decision: 'REJECTED' })}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-bold text-sm ${
                      reviewState.decision === 'REJECTED' 
                        ? 'border-rose-500 bg-rose-500/10 text-rose-400' 
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>

                {reviewState.decision === 'REJECTED' && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <textarea 
                      value={reviewState.notes}
                      onChange={(e) => setReviewState({ ...reviewState, notes: e.target.value })}
                      placeholder="Explain reason for rejection..."
                      className="w-full bg-[#0F172A] border border-rose-500/30 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose-500 transition-colors resize-none h-28"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-6 border-t border-white/10 bg-[#1E293B] sticky bottom-0 z-10 flex flex-col-reverse sm:flex-row gap-3">
              <button 
                onClick={() => setSelectedApp(null)}
                className="w-full sm:w-auto px-6 py-4 font-bold text-white/60 hover:text-white transition-colors bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                onClick={executeReview}
                disabled={!reviewState.decision || isProcessing}
                className={`w-full flex-1 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 text-sm ${
                  !reviewState.decision 
                    ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                    : reviewState.decision === 'APPROVED'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20 active:scale-95'
                      : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20 active:scale-95'
                }`}
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Execute Decision'}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}