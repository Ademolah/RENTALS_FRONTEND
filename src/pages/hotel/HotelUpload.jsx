import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, ShieldCheck, Sparkles, Building, Layers, Tags , ChevronLeft, Sun, Moon} from 'lucide-react';
import { apiClient} from '../../services/apiClient.js'
import { toast } from 'react-hot-toast';

export const HotelUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const tokenBg = darkMode 
  ? "bg-black text-white selection:bg-brand-cobalt selection:text-white" 
  : "bg-slate-50 text-slate-900 selection:bg-brand-cobalt selection:text-white";

const tokenHeaderBorder = darkMode ? "border-white/10" : "border-slate-200";
const tokenTextMuted = darkMode ? "text-white/40" : "text-slate-500";
const tokenTextTitle = darkMode ? "text-white/80" : "text-slate-800";
const tokenLabel = darkMode ? "text-white/40 font-bold" : "text-slate-600 font-bold";

const tokenCard = darkMode 
  ? "bg-white/[0.02] border-white/5 backdrop-blur-md" 
  : "bg-white border-slate-200/80 shadow-xl shadow-slate-100/40";

const tokenCardBorder = darkMode ? "border-white/5" : "border-slate-200/60";

const tokenInput = darkMode 
  ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-brand-cobalt" 
  : "bg-slate-100 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-cobalt";

const tokenSelect = darkMode 
  ? "bg-brand-midnight border-white/10 text-white focus:border-brand-cobalt" 
  : "bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-brand-cobalt";

const tokenInnerRow = darkMode 
  ? "bg-white/5 border-white/5" 
  : "bg-slate-50/80 border-slate-200/70 shadow-inner";

const tokenTextRowLabel = darkMode ? "text-white/40 font-bold" : "text-slate-500 font-bold";
  
  // 1. Core Structural State Matrix
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starRating: '4',
    state: 'Lagos',
    locality: '',
    streetAddress: '',
  });

  // 2. Specialized Array Ingestion Engines
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [roomTypes, setRoomTypes] = useState([
    { name: 'Deluxe Suite', pricePerNight: '', capacity: '2' }
  ]);
  const [images, setImages] = useState([]);

  // Base Form Key/Value Change Link
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Dynamic Room Multi-Tier Handlers
  const addRoomTier = () => {
    setRoomTypes((prev) => [...prev, { name: '', pricePerNight: '', capacity: '2' }]);
  };

  const removeRoomTier = (index) => {
    if (roomTypes.length === 1) return;
    setRoomTypes((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRoomChange = (index, field, value) => {
    setRoomTypes((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // 4. Elite Chips Tags (Amenities) Matrix Handlers
  const handleAddAmenity = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const cleaned = amenityInput.trim();
      if (!cleaned) return;
      if (amenities.includes(cleaned)) {
        toast.error('Amenity asset classification already mapped.');
        return;
      }
      setAmenities((prev) => [...prev, cleaned]);
      setAmenityInput('');
    }
  };

  const removeAmenity = (target) => {
    setAmenities((prev) => prev.filter((item) => item !== target));
  };

  // 5. Multi-File Media Dropzone Input Pipeline
  const handleFileChange = (e) => {
    const chosenFiles = Array.from(e.target.files);
    if (images.length + chosenFiles.length > 7) {
      toast.error('Premium hospitality streams are strictly optimized for up to 7 gallery cards.');
      return;
    }
    setImages((prev) => [...prev, ...chosenFiles]);
  };

  const removeStagedImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 6. Unified Form Request Dispatched Pipeline
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('A world-class hospitality showcase requires at least 1 image.');
      return;
    }

    setLoading(true);
    const payload = new FormData();

    // Append base key text strings
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('starRating', Number(formData.starRating));
    payload.append('state', formData.state);
    payload.append('locality', formData.locality);
    payload.append('streetAddress', formData.streetAddress);

    // Append strict stringified arrays for backend JSON processing
    payload.append('amenities', JSON.stringify(amenities));
    payload.append('roomTypes', JSON.stringify(
      roomTypes.map(room => ({
        name: room.name || 'Standard Room',
        pricePerNight: Number(room.pricePerNight),
        capacity: Number(room.capacity)
      }))
    ));

    // File binary payload generation mapping
    images.forEach((file) => {
      payload.append('images', file);
    });

    try {
      await apiClient.post('/hotels', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Luxury Hotel collection published successfully!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Data ingestion pipeline rejection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen px-4 py-8 md:px-8 transition-colors duration-300 ${tokenBg}`}>
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* =========================================================================
          SURGICAL UTILITY NAVIGATION ROW (Back Track Anchor & State Switcher)
         ========================================================================= */}
      <div className="flex justify-between items-center animate-fade-in">
        {/* Elite Left Navigator Icon */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            darkMode 
              ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm"
          }`}
        >
          <ChevronLeft size={14} strokeWidth={3} /> Return
        </button>

        {/* Tactical Ambient Mode Toggle Control */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            darkMode 
              ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
              : "bg-white border-slate-200 text-brand-midnight hover:bg-slate-100 shadow-sm"
          }`}
          title={darkMode ? "Switch to Canvas Light State" : "Switch to Luxury Dark State"}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* =========================================================================
          ELITE MODULE NAVIGATION HEADER
         ========================================================================= */}
      <div className={`border-b pb-6 transition-colors duration-300 ${tokenHeaderBorder}`}>
        <div className="flex items-center gap-2 text-brand-cobalt text-xs font-black uppercase tracking-widest mb-2">
          <Sparkles size={14} /> Hospitality Concierge Pipeline
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight transition-colors">List Premium Lodging</h1>
        <p className={`text-sm mt-1 transition-colors duration-300 ${tokenTextMuted}`}>
          Deploy an institutional hospitality asset asset matrix straight into our bento explorer interface layer.
        </p>
      </div>

      {/* =========================================================================
          MAIN MULTI-COLUMN INTERACTION FORM FRAMEWORK
         ========================================================================= */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT/CENTER STRATEGY BLOCKS (Form fields) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Block 1: Base Institutional Asset Information */}
          <div className={`border rounded-3xl p-6 space-y-4 transition-all duration-300 ${tokenCard}`}>
            <div className={`flex items-center gap-2 border-b pb-3 transition-colors ${tokenCardBorder}`}>
              <Building size={16} className="text-brand-cobalt" />
              <h2 className={`text-sm font-bold uppercase tracking-wider transition-colors ${tokenTextTitle}`}>Corporate Asset Identity</h2>
            </div>

            <div className="space-y-1">
              <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Hotel / Resort Title</label>
              <input 
                type="text" name="title" required placeholder="The George Hotel"
                value={formData.title} onChange={handleInputChange}
                className={`w-full rounded-xl px-4 py-3 outline-none border transition-all text-sm font-medium ${tokenInput}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Star Classification Tier</label>
                <select 
                  name="starRating" value={formData.starRating} onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer transition-all ${tokenSelect}`}
                >
                  <option value="3">3 Star Boutique Luxury</option>
                  <option value="4">4 Star Premium Executive</option>
                  <option value="5">5 Star Ultra-Elite Heritage</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Regional State Mapping</label>
                <input 
                  type="text" name="state" required placeholder="Lagos"
                  value={formData.state} onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-medium opacity-60 cursor-not-allowed transition-all ${tokenInput}`}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Locality Neighborhood</label>
                <input 
                  type="text" name="locality" required placeholder="Ikoyi"
                  value={formData.locality} onChange={handleInputChange}
                  className={`w-full rounded-xl px-4 py-3 outline-none border transition-all text-sm font-medium ${tokenInput}`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Street Positioning Address</label>
                <input 
                  type="text" name="streetAddress" required placeholder="11 Lugard Avenue"
                  value={formData.streetAddress} onChange={handleInputChange}
                  className={`w-full rounded-xl px-4 py-3 outline-none border transition-all text-sm font-medium ${tokenInput}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-xs uppercase transition-colors ${tokenLabel}`}>Hospitality Descriptive Overview</label>
              <textarea 
                name="description" required rows={4} placeholder="Introduce your estate portfolio, highlighting signature hospitality spaces, security provisions, and elite culinary offerings..."
                value={formData.description} onChange={handleInputChange}
                className={`w-full rounded-xl px-4 py-3 outline-none border resize-none leading-relaxed transition-all text-sm font-medium ${tokenInput}`}
              />
            </div>
          </div>

          {/* Block 2: Polymorphic Suite Variant Layer Matrix Configurator */}
          <div className={`border rounded-3xl p-6 space-y-4 transition-all duration-300 ${tokenCard}`}>
            <div className={`flex justify-between items-center border-b pb-3 transition-colors ${tokenCardBorder}`}>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-brand-cobalt" />
                <h2 className={`text-sm font-bold uppercase tracking-wider transition-colors ${tokenTextTitle}`}>Room Variant Structural Matrices</h2>
              </div>
              <button 
                type="button" onClick={addRoomTier}
                className="text-xs flex items-center gap-1 text-brand-cobalt font-black bg-brand-cobalt/10 border border-brand-cobalt/20 px-3 py-1.5 rounded-xl hover:bg-brand-cobalt/20 transition-all cursor-pointer"
              >
                <Plus size={12} strokeWidth={3} /> Add Category
              </button>
            </div>

            <div className="space-y-3">
              {roomTypes.map((room, index) => (
                <div key={index} className={`grid grid-cols-1 sm:grid-cols-12 gap-3 border p-4 rounded-2xl relative group/row items-end transition-colors ${tokenInnerRow}`}>
                  
                  <div className="sm:col-span-5 space-y-1">
                    <label className={`text-[10px] uppercase transition-colors ${tokenTextRowLabel}`}>Suite Category Tag</label>
                    <input 
                      type="text" required placeholder="Presidential Suite"
                      value={room.name} onChange={(e) => handleRoomChange(index, 'name', e.target.value)}
                      className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none border transition-all ${tokenInput}`}
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className={`text-[10px] uppercase transition-colors ${tokenTextRowLabel}`}>Nightly Pricing Outlay (₦)</label>
                    <input 
                      type="number" required placeholder="450000"
                      value={room.pricePerNight} onChange={(e) => handleRoomChange(index, 'pricePerNight', e.target.value)}
                      className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none border transition-all ${tokenInput}`}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className={`text-[10px] uppercase transition-colors ${tokenTextRowLabel}`}>Max Capacity</label>
                    <select 
                      value={room.capacity} onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm font-medium outline-none cursor-pointer transition-all ${tokenSelect}`}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6+ Guests</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex justify-center pb-1">
                    <button
                      type="button" disabled={roomTypes.length === 1}
                      onClick={() => removeRoomTier(index)}
                      className={`p-2.5 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                        darkMode 
                          ? "border-white/5 bg-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20" 
                          : "border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR LAYOUT FRAME (Media Dropzone & Amenities Chips) */}
        <div className="space-y-6">
          
          {/* Block 3: Premium Multi-File Media Dropzone Interface Container */}
          <div className={`border rounded-3xl p-6 space-y-4 transition-all duration-300 ${tokenCard}`}>
            <div className={`flex justify-between items-center border-b pb-3 transition-colors ${tokenCardBorder}`}>
              <label className={`text-xs uppercase tracking-wider block transition-colors ${tokenLabel}`}>Property Gallery</label>
              <span className={`text-[10px] font-mono tracking-wider transition-colors ${images.length > 7 ? 'text-red-400 font-bold' : tokenTextMuted}`}>
                {images.length} / 7 STAGED
              </span>
            </div>

            <div className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative group bg-white/[0.005] hover:bg-white/[0.015] ${
              darkMode ? "border-white/10 hover:border-brand-cobalt/40" : "border-slate-300 hover:border-brand-cobalt/60"
            }`}>
              <input 
                type="file" multiple accept="image/png, image/jpeg, image/jpg, image/webp" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="space-y-2 pointer-events-none">
                <Upload className={`mx-auto group-hover:text-brand-cobalt group-hover:scale-105 transition-all duration-300 ${darkMode ? 'text-white/20' : 'text-slate-400'}`} size={24} />
                <p className={`text-xs font-bold transition-colors ${darkMode ? 'text-white/70 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>Upload Property Images</p>
                <p className={`text-[10px] max-w-[190px] mx-auto leading-normal transition-colors ${tokenTextMuted}`}>Select up to 7 high-resolution premium photos at once.</p>
              </div>
            </div>

            {/* Dynamic Absolute Image Rendering Line Strip */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {images.map((file, idx) => {
                  const localUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className={`aspect-square rounded-xl border relative overflow-hidden group/thumb animate-fade-in ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
                      <img 
                        src={localUrl} alt="Staged hospitality link" 
                        className="w-full h-full object-cover"
                        onLoad={() => URL.revokeObjectURL(localUrl)}
                      />
                      <button
                        type="button" onClick={() => removeStagedImage(idx)}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150 flex items-center justify-center text-red-400 font-bold text-[10px] uppercase cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Block 4: Luxury Interactive Amenities Tags Engine */}
          <div className={`border rounded-3xl p-6 space-y-4 transition-all duration-300 ${tokenCard}`}>
            <div className={`flex items-center gap-2 border-b pb-3 transition-colors ${tokenCardBorder}`}>
              <Tags size={16} className="text-brand-cobalt" />
              <h2 className={`text-sm font-bold uppercase tracking-wider transition-colors ${tokenTextTitle}`}>Premium Amenities</h2>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" placeholder="Infinity Pool..."
                value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={handleAddAmenity}
                className={`w-full rounded-xl px-3 py-2 outline-none border transition-all text-xs font-medium ${tokenInput}`}
              />
              <button
                type="button" onClick={handleAddAmenity}
                className={`border px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800"
                }`}
              >
                Add
              </button>
            </div>

            {/* Staged Chips Cloud Box Container */}
            <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {amenities.length === 0 && (
                <p className={`text-[11px] font-medium italic py-1 transition-colors ${tokenTextMuted}`}>No custom high-end features itemized yet.</p>
              )}
              {amenities.map((item, idx) => (
                <span 
                  key={idx} 
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold border px-2.5 py-1 rounded-lg group hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400 transition-all cursor-pointer ${
                    darkMode ? "bg-white/5 text-white/70 border-white/10" : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                  onClick={() => removeAmenity(item)}
                >
                  {item}
                  <span className={`text-[9px] font-bold ml-0.5 ${darkMode ? 'text-white/20 group-hover:text-red-400/50' : 'text-slate-400 group-hover:text-red-500'}`}>✕</span>
                </span>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer Policy Box */}
          <p className={`text-[10px] font-medium leading-normal flex gap-1.5 items-start p-2 transition-colors ${tokenTextMuted}`}>
            <ShieldCheck size={16} className="text-brand-cobalt shrink-0" />
            <span><strong>Compliance Disclaimer:</strong> By publishing, you confirm this corporate asset aligns with state tourism frameworks and is subject to security audits.</span>
          </p>

          {/* Primary Action Form Trigger Submission Button */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-brand-cobalt disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold tracking-wide text-sm shadow-xl shadow-brand-cobalt/10 hover:bg-brand-cobalt/90 transition-all cursor-pointer flex items-center justify-center gap-2 text-white"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Publish Luxury Hotel Collection'
            )}
          </button>

        </div>
      </form>
      </div>
    </div>
  );
}