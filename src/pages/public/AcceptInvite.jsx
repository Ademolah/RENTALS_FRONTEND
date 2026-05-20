import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';

export const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract the unique token injected into the magic link URL from the backend
  const inviteToken = searchParams.get('token'); 

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match.");
    
    setLoading(true);
    setError(null);

    try {
      // Complete the invitation cycle on the backend
      await apiClient.post('/auth/accept-invite', {
        token: inviteToken,
        password
      });

      // Send them straight to the login door to establish their fresh session
      navigate('/login?verified=true');
    } catch (err) {
      setError(err.response?.data?.message || 'This invitation token has expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-brand-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-premium">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Secure Activation
          </h1>
          <p className="text-brand-slate/60 mt-2 text-sm">
            Set your secure access credential to join your corporate real estate network.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Create Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors"
          />

          <button
            type="submit"
            disabled={loading || !inviteToken}
            className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            {loading ? 'Activating Credentials...' : 'Claim Agent Access'}
          </button>
        </form>

      </div>
    </div>
  );
};