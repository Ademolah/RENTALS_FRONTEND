import { useState } from 'react';
import { Building2, FileText, Mail, Phone, MapPin, Map, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient'; // Mapped to your global API client
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

export const HotelApplicationForm = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    cacNumber: '',
    contactEmail: '',
    contactPhone: '',
    registeredAddress: '',
    state: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cacNumber' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus({ type: null, message: '' });

  try {
    const response = await apiClient.post('/hotels/submit', formData);
    
    if (response.data?.success) {
      setStatus({
        type: 'success',
        message: 'Application submitted successfully to the verification ledger. Our super admin team will review your CAC credentials shortly.'
      });
      toast.success('Application logged successfully!');
      
      if (onSubmissionSuccess) onSubmissionSuccess(response.data.data.application);
      
      // 🚀 THE FIX: Route explicitly to the profile path and pass the transient state
      navigate('/profile', { 
        state: { hotelUpgradePending: true },
        replace: true 
      });
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to submit registration. Please verify your connection.';
    setStatus({ type: 'error', message: errorMsg });
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/40 overflow-hidden transition-all duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 md:p-10 text-white relative">
  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
  
  <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
    Merchant Onboarding
  </span>
  
  <div className="flex items-center gap-4 mb-2">
    <button 
      onClick={() => navigate(-1)}
      type="button"
      className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
    </button>
    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Become a Hotel Administrator</h1>
  </div>
  
  <p className="text-slate-400 text-sm md:text-base max-w-xl sm:pl-14">
    Register your corporate entity using your official CAC number to elevate your status and list premium properties on Rentals.
  </p>
</div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8">
        
        {/* Status Messaging Banner */}
        {status.type && (
          <div className={`p-4 rounded-xl flex items-start gap-3 border animate-fadeIn transition-all duration-200 ${
            status.type === 'success' 
              ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800' 
              : 'bg-rose-50/60 border-rose-100 text-rose-800'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            )}
            <p className="text-sm font-medium leading-relaxed">{status.message}</p>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          
          {/* Business Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Business / Hotel Name
            </label>
            <div className="relative group">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Grand Horizon Suites LTD"
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium disabled:opacity-60"
              />
            </div>
          </div>

          {/* CAC Number */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              CAC Registration Number (RC / BN)
            </label>
            <div className="relative group">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="cacNumber"
                required
                value={formData.cacNumber}
                onChange={handleChange}
                placeholder="e.g. RC-1234567"
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium tracking-wide disabled:opacity-60"
              />
            </div>
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Operations Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="e.g. operations@hotel.ng"
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium disabled:opacity-60"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Corporate Contact Line
            </label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="tel"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="e.g. +234 803 123 4567"
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium disabled:opacity-60"
              />
            </div>
          </div>

          {/* Registered Address */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Headquarters / Registered Address
            </label>
            <div className="relative group">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <textarea
                name="registeredAddress"
                required
                rows={2}
                value={formData.registeredAddress}
                onChange={handleChange}
                placeholder="Provide the exact physical corporate address registered with the CAC"
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium resize-none disabled:opacity-60"
              />
            </div>
          </div>

          {/* State Select Dropdown */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Operating Base State
            </label>
            <div className="relative group">
              <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
              <select
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                disabled={loading || status.type === 'success'}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-medium appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="" disabled>Select corporate location state...</option>
                {NIGERIAN_STATES.map((stateName) => (
                  <option key={stateName} value={stateName}>{stateName}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
            </div>
          </div>

        </div>

        {/* Action Button Section */}
        {status.type !== 'success' && (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Ledger Entries...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}