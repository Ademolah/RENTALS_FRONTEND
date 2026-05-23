import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { Upload, X, ArrowLeft, Building2, MapPin, DollarSign, Layers } from 'lucide-react';
import toast from 'react-hot-toast'


export const PropertyUpload = () => {
  const navigate = useNavigate();
  
  // Structured Property State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerAnnum: '', 
    serviceCharge: '0', 
    cautionFee: '0',    
    propertyType: 'house',
    beds: '',          
    baths: '',         
    streetAddress: '', 
    locality: '',
    state: 'Lagos',
    longitude: '',     
    latitude: '',    
    isAvailable: true,  
  });

  const NIGERIA_LOCATIONS = {
  "Abuja (FCT)": ["Maitama", "Wuse", "Asokoro", "Garki", "Gwarinpa", "Jabi", "Utako", "Apo", "Lugbe", "Kubwa", "Gudu", "Lokogoma"],
  "Lagos": ["Ikoyi", "Victoria Island", "Lekki Phase 1", "Ikeja GRA", "Surulere", "Yaba", "Ajah", "Banana Island", "Magodo", "Maryland"],
  "Rivers": ["Port Harcourt City", "Obio-Akpor", "Eleme", "Oyigbo", "Bonny", "GRA Phase 1-3", "Trans Amadi"],
  "Oyo": ["Ibadan North", "Ibadan South-West", "Oluyole", "Bodija", "Agodi GRA", "Samonda"],
  "Ogun": ["Abeokuta", "Ota", "Ibafo", "Mowe", "Arepo", "Sagamu"],
  "Enugu": ["Enugu East", "Enugu North", "Enugu South", "Independence Layout", "GRA"],
  "Kano": ["Kano Municipal", "Nassarawa", "Tarauni", "Kumbotso", "Gwale"],
  // Add other states and their LGAs/Localities here...
};

 const AVAILABLE_STATES = Object.keys(NIGERIA_LOCATIONS).sort();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Direct Multi-File Selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  // Evict file from staging queue
  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const payload = new FormData();


  // 1. Direct text fields
  payload.append('title', formData.title);
  payload.append('description', formData.description);
  payload.append('locality', formData.locality);
  payload.append('state', formData.state);
  payload.append('streetAddress', formData.streetAddress); 

  // 2. Number conversions
  payload.append('pricePerAnnum', Number(formData.pricePerAnnum));
  payload.append('serviceCharge', Number(formData.serviceCharge || 0));
  payload.append('cautionFee', Number(formData.cautionFee || 0));
  payload.append('beds', Number(formData.beds));       
  payload.append('baths', Number(formData.baths));    
  
  // 3. Status Flags
  payload.append('isAvailable', formData.isAvailable);

  // 3. The Strict Geospatial Object
  const geoJSONLocation = {
    type: 'Point',
    coordinates: [Number(formData.longitude), Number(formData.latitude)],
  };
  payload.append('location', JSON.stringify(geoJSONLocation));

  // 4. File attachments
  images.forEach((file) => {
  payload.append('images', file); 
});

  try {
    await apiClient.post('/properties', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toast.success('Property uploaded successfully!');
    navigate(-1); 
  } catch (err) {
    setError(err.response?.data?.message || 'Data ingestion failed.');
    toast.error('Failed to upload property.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-brand-slate text-white p-6 md:p-10 font-sans">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* Navigation / Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-brand-coral"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white">Property Upload Studio</h1>
            <p className="text-brand-slate/60 text-xs font-medium mt-0.5">Asset Onboarding & Media Ingestion Matrix</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Core Core Specs (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Core Details Block */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Building2 size={16} className="text-brand-cobalt" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white/70">Structural Identity</h3>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Listing Title</label>
                <input 
                  type="text" name="title" required placeholder="Luxury 4-Bedroom Detached Duplex"
                  value={formData.title} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Description Narrative</label>
                <textarea 
                  name="description" required rows="4" placeholder="Detail the interior specifications, automated automation systems, and luxury amenities..."
                  value={formData.description} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1"><DollarSign size={12}/> Valuation (NGN / Year)</label>
                  <input 
                    type="number" name="pricePerAnnum" required placeholder="45000000"
                    value={formData.pricePerAnnum} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
              {/* =======================================================================
                  AVAILABILITY TOGGLE (PREMIUM UI ELEMENT)
                  ======================================================================= */}
             
              <div className="pt-6 col-span-full w-full">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:border-white/20">
                  <div className="space-y-0.5">
                    <label className="text-xs text-white/40 font-bold uppercase block">Market Availability Status</label>
                    <p className="text-xs text-white/60 font-medium">
                      {formData.isAvailable 
                        ? "Listing is active, public, and open for clients to tour" 
                        : "Listing is marked private, hidden, or temporarily off-market"}
                    </p>
                  </div>

                  {/* The Custom Switch Mechanism */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    className={`
                      relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                      transition-colors duration-300 ease-in-out focus:outline-none focus:ring-1 focus:ring-brand-cobalt/50
                      ${formData.isAvailable ? 'bg-emerald-500' : 'bg-white/10'}
                    `}
                  >
                    {/* Toggle Handle Knob */}
                    <span
                      className={`
                        pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 
                        transition duration-300 ease-in-out
                        ${formData.isAvailable ? 'translate-x-5' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              </div>

                  {/* Appended Financial Constraints */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Service Charge </label>
                <input 
                  type="number" name="serviceCharge" placeholder="0" min="0"
                  value={formData.serviceCharge} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Caution Fee </label>
                <input 
                  type="number" name="cautionFee" placeholder="0" min="0"
                  value={formData.cautionFee} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
              </div>
            </div>
                </div>


              


                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1"><Layers size={12}/> Property Classification</label>
                  <select 
                    name="propertyType" value={formData.propertyType} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none"
                  >
                    <option value="house" className="bg-brand-midnight">Detached House / Duplex</option>
                    <option value="penthouse" className="bg-brand-midnight">Luxury Penthouse</option>
                    <option value="apartment" className="bg-brand-midnight">Serviced Apartment</option>
                    <option value="shortlet" className="bg-brand-midnight">Luxury Shortlet / Vacation Rental</option>
                    <option value="land" className="bg-brand-midnight">Premium Land Allocation</option>
                    <option value="commercial" className="bg-brand-midnight">Commercial Office Space</option>
                    <option value="terraced" className="bg-brand-midnight">Terraced Townhouse</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Constraints Block */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin size={16} className="text-brand-coral" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white/70">Geospatial Routing</h3>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/40 font-bold uppercase">Street Address Mapping</label>
                <input 
                  type="text" name="streetAddress" required placeholder="Plot 1024, Banana Island Way"
                  value={formData.streetAddress} onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 1. LOCALITY / DISTRICT (DEPENDENT DROPDOWN) */}
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Locality / District</label>
                  <div className="relative">
                    <select 
                      name="locality" 
                      required 
                      value={formData.locality} 
                      onChange={handleInputChange}
                      disabled={!formData.state}
                      className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none 
                        ${!formData.state ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <option value="" disabled className="bg-brand-midnight text-white/50">
                        {formData.state ? `Select locality in ${formData.state}` : "Select a state first"}
                      </option>
                      
                      {/* Render localities dynamically based on selected state */}
                      {formData.state && NIGERIA_LOCATIONS[formData.state]?.map(loc => (
                        <option key={loc} value={loc} className="bg-brand-midnight text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                    {/* Premium Custom Chevron */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* 2. REGIONAL STATE JURISDICTION (PRIMARY DROPDOWN) */}
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Regional State Jurisdiction</label>
                  <div className="relative">
                    <select 
                      name="state" 
                      required 
                      value={formData.state} 
                      onChange={(e) => {
                        // Update the state AND safely wipe the locality clean
                        setFormData(prev => ({ 
                          ...prev, 
                          state: e.target.value, 
                          locality: '' 
                        }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="bg-brand-midnight text-white/50">Select State</option>
                      {AVAILABLE_STATES.map(state => (
                        <option key={state} value={state} className="bg-brand-midnight text-white">
                          {state}
                        </option>
                      ))}
                    </select>
                    {/* Premium Custom Chevron */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Appended Geospatial Pinpoints */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Longitude (X)</label>
                  <input 
                    type="number" name="longitude" required placeholder="3.4308" step="any" min="-180" max="180"
                    value={formData.longitude} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Latitude (Y)</label>
                  <input 
                    type="number" name="latitude" required placeholder="6.4531" step="any" min="-90" max="90"
                    value={formData.latitude} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Direct File Ingestion & Specs (Right Column) */}
          <div className="space-y-6">
            
            {/* Size Configurations */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Bedrooms</label>
                  <input 
                    type="number" name="beds" required placeholder="4" min="0"
                    value={formData.bedrooms} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/40 font-bold uppercase">Bathrooms</label>
                  <input 
                    type="number" name="baths" required placeholder="5" min="0"
                    value={formData.bathrooms} onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Direct Multi-File Media Dropzone */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block">Media Storage Pipeline</label>
              
              <div className="border-2 border-dashed border-white/10 hover:border-brand-cobalt/50 rounded-2xl p-6 text-center cursor-pointer transition-colors relative group">
                <input 
                  type="file" multiple accept="image/*" onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="mx-auto text-white/20 group-hover:text-brand-cobalt transition-colors mb-2" size={24} />
                <p className="text-xs font-bold text-white/60">Select Local Media Files</p>
                <p className="text-[10px] text-white/30 font-mono mt-1">PNG, JPG formats accepted</p>
              </div>

              {/* Upload Staging Line Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {images.map((file, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-white/5">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Staged asset" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button" onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-brand-coral/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Final Submission Execution */}
            <button 
              type="submit" disabled={loading}
              className="w-full bg-brand-coral hover:bg-brand-coral/90 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-opacity disabled:opacity-40 shadow-lg shadow-brand-coral/10"
            >
              {loading ? 'Listing Assets...' : 'Commit Listing Live'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};