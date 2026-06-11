import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/auth.service';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

// 🌍 Comprehensive African Countries Dial Codes Matrix (51 Sovereign Nations & Regions)
const AFRICAN_COUNTRIES = [
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { code: 'CD', name: 'DR Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CG', name: 'Republic of the Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'CI', name: 'Ivory Coast', dialCode: '+225', flag: '🇨🇮' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' }, // 👈 Core Ecosystem Default
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'ST', name: 'São Tomé and Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
].sort((a, b) => a.name.localeCompare(b.name)); // Alphabetically cataloged for premium navigation flows

export const Register = () => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const dropdownRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Initialize with Nigeria as the standard flagship selection
  const [selectedCountry, setSelectedCountry] = useState(
    AFRICAN_COUNTRIES.find((c) => c.code === 'NG') || AFRICAN_COUNTRIES[0]
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '', 
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Close dropdown cleanly if clicking outside its container boundaries
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  // 1. Strip away any accidental leading zeros typed by the explorer
  const cleanedLocalNumber = formData.phoneNumber.replace(/^0+/, '');

  // 2. 🟢 CONCATENATION FLOW: Merge them into the single phoneNumber field
  const combinedPhoneNumber = `${selectedCountry.dialCode}${cleanedLocalNumber}`;

  const submissionPayload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    dialCode: selectedCountry.dialCode, // 👈 Saved cleanly for future regional filtering
    phoneNumber: combinedPhoneNumber,   // 👈 The existing field now holds the full international number
  };

  try {
    const response = await authService.register(submissionPayload);
    loginAction(response.data.user, response.token);
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed. Try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[80vh] bg-brand-midnight flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-premium">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Join the Network
          </h1>
          <p className="text-brand-slate/60 mt-2 text-sm">
            Create an account to explore elite rental properties.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
  <div className="flex gap-4">
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      required
      onChange={handleChange}
      className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      required
      onChange={handleChange}
      className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
    />
  </div>

  <input
    type="email"
    name="email"
    placeholder="Email Address"
    required
    onChange={handleChange}
    className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
  />

  {/* 📞 PREMIUM SURGICALLY ALIGNED TELEPHONY FIELD */}
  <div className="relative w-full z-20" ref={dropdownRef}>
    {/* Absolute Floating Country Code Selector Engine */}
    <div className="absolute left-1 top-1 bottom-1 flex items-center z-30">
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1.5 h-full px-3 text-white text-sm font-medium hover:bg-white/5 rounded-l-lg transition-all focus:outline-none min-w-[85px] justify-between cursor-pointer"
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span className="text-white/80 text-xs font-semibold">{selectedCountry.dialCode}</span>
        <ChevronDown size={12} className={`text-white/30 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Flyout Country Menu Drawer */}
      {isDropdownOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 max-h-64 overflow-y-auto bg-brand-midnight/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl scrollbar-thin scrollbar-thumb-white/10 animate-in fade-in slide-in-from-top-2 duration-150">
          {AFRICAN_COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                setSelectedCountry(country);
                setIsDropdownOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-white/5 cursor-pointer ${
                selectedCountry.code === country.code ? 'bg-brand-cobalt/20 text-brand-coral font-bold' : 'text-white/80'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <span className="text-base flex-shrink-0">{country.flag}</span>
                <span className="truncate text-xs font-medium">{country.name}</span>
              </span>
              <span className="text-xs text-white/40 font-mono pl-2">{country.dialCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Integrated Local Telephone Number Input Element */}
    <input
      type="tel"
      name="phoneNumber"
      placeholder="Phone Number"
      required
      value={formData.phoneNumber}
      onChange={handleChange}
      onKeyPress={(e) => {
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      }}
      // 🟢 NOTICE THE LEFT PADDING (pl-[95px]) -> Ensures text streams gracefully past the floating flag trigger area without collision
      className="w-full bg-brand-slate/5 border border-white/10 rounded-xl pr-4 pl-[95px] py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm tracking-wide"
    />
  </div>

  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Create Password"
      required
      onChange={handleChange}
      className="w-full bg-brand-slate/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-cobalt transition-colors font-medium text-sm"
    />
    
    <button
      type="button" 
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors cursor-pointer p-1 focus:outline-none"
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff size={18} className="transition-transform duration-200 active:scale-95" />
      ) : (
        <Eye size={18} className="transition-transform duration-200 active:scale-95" />
      )}
    </button>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4 text-sm tracking-wide uppercase"
  >
    {loading ? 'Creating Account...' : 'Register'}
  </button>
</form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-brand-slate/60 hover:text-white text-sm transition-colors">
            Already have an account? <span className="text-brand-coral font-bold">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};