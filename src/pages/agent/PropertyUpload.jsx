import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { Upload, X, ArrowLeft, Building2, MapPin, DollarSign, Layers, Video } from 'lucide-react';
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
    isAvailable: true,  
  });

  // Serviced Apartment and Luxury Shortlet toggle rule
const allowsVideo = formData.propertyType === 'apartment' || formData.propertyType === 'shortlet';

  const NIGERIA_LOCATIONS = {
  "Abuja (FCT)": ["Maitama", "Wuse", "Asokoro", "Garki", "Gwarinpa", "Jabi", "Utako", "Apo", "Lugbe", "Kubwa", "Gudu", "Lokogoma"],
  "Lagos": ["Ikoyi", "Victoria Island", "Lekki Phase 1", "Ikeja GRA", "Surulere", "Yaba", "Epe", "Ajah", "Banana Island", "Magodo", "Maryland"],
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
  payload.append('propertyType', formData.propertyType);

  // 2. Number conversions
  payload.append('pricePerAnnum', Number(formData.pricePerAnnum));
  payload.append('serviceCharge', Number(formData.serviceCharge || 0));
  payload.append('cautionFee', Number(formData.cautionFee || 0));
  payload.append('beds', Number(formData.beds));       
  payload.append('baths', Number(formData.baths));    
  
  // 3. Status Flags
  payload.append('isAvailable', formData.isAvailable);

  // (The Strict Geospatial Object block has been entirely removed)

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
    
    {/* 🎯 SURGICAL UPDATE: Reactive Valuation (Now includes Serviced Apartments) */}
    <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1 transition-all duration-300">
      <DollarSign size={12}/> 
      {['shortlet', 'apartment'].includes(formData.propertyType) ? 'Valuation (NGN / Month)' : 'Valuation (NGN / Year)'}
    </label>
    
    <div className="relative flex items-center group">
      <input 
        type="number" 
        name="pricePerAnnum" 
        required 
        placeholder={['shortlet', 'apartment'].includes(formData.propertyType) ? '3500000' : '45000000'}
        value={formData.pricePerAnnum} 
        onChange={handleInputChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-24 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-all text-sm font-medium focus:bg-white/[0.07]"
      />
      
      <div className="absolute right-3 pointer-events-none select-none animate-in fade-in zoom-in-95 duration-300">
        <span className={`text-[9px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-md border transition-all ${
          ['shortlet', 'apartment'].includes(formData.propertyType) 
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
            : 'bg-brand-cobalt/10 text-brand-cobalt border-brand-cobalt/20'
        }`}>
          {['shortlet', 'apartment'].includes(formData.propertyType) ? 'Per Month' : 'Per Annum'}
        </span>
      </div>
    </div>
    {/* END SURGICAL UPDATE */}


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

    <div className="space-y-3"> {/* 🟢 Changed from space-y-1 to space-y-3 to give the banner proper luxury breathing room */}
  <div className="space-y-1">
    <label className="text-xs text-white/40 font-bold uppercase flex items-center gap-1">
      <Layers size={12}/> Property Classification
    </label>
    <select 
      name="propertyType" 
      value={formData.propertyType} 
      onChange={handleInputChange}
      required
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium appearance-none cursor-pointer"
    >
      <option value="" disabled className="bg-[#1E293B] text-white/40">Select Property Category</option>
      <option value="house" className="bg-[#1E293B] text-white">Detached House / Duplex</option>
      <option value="penthouse" className="bg-[#1E293B] text-white">Luxury Penthouse</option>
      <option value="apartment" className="bg-[#1E293B] text-white">Serviced Apartment</option>
      <option value="shortlet" className="bg-[#1E293B] text-white">Luxury Shortlet / Vacation Rental</option>
      <option value="land" className="bg-[#1E293B] text-white">Premium Land Allocation</option>
      <option value="commercial" className="bg-[#1E293B] text-white">Commercial Office Space</option>
      <option value="terraced" className="bg-[#1E293B] text-white">Terraced Townhouse</option>
    </select>
  </div>

  {/* 🟢 SURGICAL UPDATE: Bold, premium notification banner */}
  {(formData.propertyType === 'apartment' || formData.propertyType === 'shortlet') && (
    <div className="bg-brand-cobalt/10 border border-brand-cobalt/30 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Cinematic/Video Sparkle Icon Indicator */}
      <div className="p-1.5 bg-brand-cobalt/20 rounded-lg text-brand-cobalt shrink-0 mt-0.5">
        <Video size={16} className="animate-pulse" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-white tracking-wide">
          Cinematic Walkthrough Enabled
        </p>
        <p className="text-[11px] text-brand-slate/70 leading-relaxed">
          Because you selected a premium listing type, you can now upload short video walkthroughs alongside your photos in the media section below to maximize client engagement.
        </p>
      </div>
    </div>
  )}
</div>
    
  </div>
            </div>

            {/* Location Constraints Block */}
            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin size={16} className="text-brand-coral" />
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white/70">Geospatial Routing</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Street Address Mapping</label>
                
                <input 
                  type="text" 
                  name="streetAddress" 
                  required 
                  placeholder="Plot 1024, Banana Island Way"
                  value={formData.streetAddress} 
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-medium"
                />

                {/* Premium Privacy Micro-copy */}
                <p className="text-[11px] text-white/30 font-medium leading-normal mt-1 flex items-start gap-1">
                  <span>🔒</span>
                  <span>
                    <strong>Confidential:</strong> This address remains completely hidden from public explorers. It is collected strictly for secure internal verification and regulatory documentation.
                  </span>
                </p>
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

            <div className="bg-brand-midnight border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block">
                Property Gallery
              </label>
              <span className={`text-[11px] font-medium tracking-wide ${images.length > 7 ? 'text-red-400 font-bold' : 'text-white/30'}`}>
                {images.length} / 7 Images
              </span>
            </div>
            
                        
                        {/* Dropzone Interactive Area */}
            <div className="border-2 border-dashed border-white/10 hover:border-brand-cobalt/40 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative group bg-white/[0.01] hover:bg-white/[0.03]">
              <input 
                type="file" 
                multiple 
                // 🟢 SURGICAL UPDATE: Dynamically unlocks video MIME formats based on property type selection
                accept={allowsVideo ? "image/png, image/jpeg, image/jpg, image/webp, video/mp4, video/webm, video/quicktime" : "image/png, image/jpeg, image/jpg, image/webp"} 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              
              <div className="space-y-2 pointer-events-none">
                <Upload className="mx-auto text-white/20 group-hover:text-brand-cobalt group-hover:scale-110 transition-all duration-300" size={26} />
                <p className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                  {/* 🟢 SURGICAL UPDATE: Dynamic Title */}
                  {allowsVideo ? "Upload Property Media Gallery" : "Upload Property Images"}
                </p>
                <p className="text-[11px] text-white/30 max-w-[240px] mx-auto leading-normal">
                  {/* 🟢 SURGICAL UPDATE: Dynamic Help Subtext */}
                  {allowsVideo 
                    ? "Select up to 7 assets. Premium photos (PNG, JPG, WEBP) or high-end video walkthroughs (MP4, MOV)."
                    : "Select up to 7 high-resolution premium photos at once. PNG, JPG, or WEBP formats."}
                </p>
              </div>
            </div>

            {/* Upload Staging Line Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-white/5">
                    
                    {/* 🟢 SURGICAL UPDATE: Safely separate rendering loops based on raw file type metadata */}
                    {file.type.startsWith('video/') ? (
                      <video 
                        src={URL.createObjectURL(file)} 
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Staged asset" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    
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