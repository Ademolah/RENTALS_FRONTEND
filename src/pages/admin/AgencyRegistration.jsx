import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { apiClient } from '../../services/apiClient';

export const AgencyRegistration = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: '',
    cacNumber: '', // Corporate Affairs Commission Registration
    officeAddress: '',
    contactPhone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Assuming backend route: POST /api/v1/agencies/register
      const response = await apiClient.post('/agencies/register', formData);
      
      setSuccess(true);
      
      // Update the global state so the user instantly gets ADMIN privileges
      updateUser({ role: 'ADMIN', agencyId: response.data.agency._id });

      // Automatically route them to their shiny new CEO dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-slate px-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-premium text-center max-w-md w-full border border-brand-slate/10">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold text-brand-midnight mb-2">Agency Verified</h2>
          <p className="text-brand-slate/60 font-medium">Your corporate dashboard is ready.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-slate px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-[2rem] p-8 md:p-10 shadow-premium border border-brand-slate/10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-brand-midnight tracking-tight">
            Register Your Agency
          </h1>
          <p className="text-brand-slate/60 mt-3 text-sm md:text-base font-medium">
            Upgrade your account to list premium properties and manage your agents on Rentals.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 p-4 rounded-xl text-sm mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-brand-midnight mb-2">Registered Agency Name</label>
            <input
              type="text"
              name="agencyName"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-5 py-4 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              placeholder="e.g. Zenith Luxury Real Estate"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-midnight mb-2">CAC Registration Number</label>
            <input
              type="text"
              name="cacNumber"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-5 py-4 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              placeholder="RC-1234567"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-midnight mb-2">Corporate Office Address</label>
            <input
              type="text"
              name="officeAddress"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-5 py-4 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              placeholder="123 Premium Avenue, Location"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-midnight mb-2">Official Contact Number</label>
            <input
              type="tel"
              name="contactPhone"
              required
              onChange={handleChange}
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-5 py-4 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              placeholder="+234 ..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-midnight hover:bg-brand-midnight/90 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-lg"
          >
            {loading ? 'Verifying Credentials...' : 'Establish Agency'}
          </button>
        </form>

      </div>
    </div>
  );
};