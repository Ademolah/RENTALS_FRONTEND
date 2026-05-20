import { useState } from 'react';
import { Upload, X, } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const PropertyUpload = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  
  const [metadata, setMetadata] = useState({
    title: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    address: ''
  });

  // Direct client-side handling of binary media files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Generate local virtual data strings so agents get instant visual upload confirmation
    const URLs = files.map(file => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...URLs]);
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Must use FormData format to stream direct raw binary files across the network
      const payload = new FormData();
      payload.append('title', metadata.title);
      payload.append('price', metadata.price);
      payload.append('bedrooms', metadata.bedrooms);
      payload.append('bathrooms', metadata.bathrooms);
      payload.append('address', metadata.address);

      selectedFiles.forEach((file) => {
        payload.append('images', file); // Maps straight to your media ingestion backend
      });

      await apiClient.post('/properties', payload, {
        headers: { 'Content-Type': 'multipart/form-data' } // Informs Axios to process raw binary boundaries
      });

      alert('Luxury listing uploaded successfully.');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-slate p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] p-8 shadow-premium border border-brand-midnight/5">
        
        <h1 className="text-3xl font-display font-extrabold text-brand-midnight mb-8">
          Publish Luxury Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Direct File Ingestion Component Dropzone */}
          <div className="border-2 border-dashed border-brand-slate/80 hover:border-brand-cobalt transition-colors rounded-2xl p-8 text-center bg-brand-slate/10 cursor-pointer relative">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Upload size={32} className="mx-auto text-brand-slate/60 mb-3" />
            <p className="text-brand-midnight font-bold">Upload Property Media Assets</p>
            <p className="text-brand-slate/60 text-xs mt-1 font-medium">Select real high-resolution images direct from your device</p>
          </div>

          {/* Dynamic Image Grid Preview Panel */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border border-brand-midnight/5">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-brand-midnight/80 backdrop-blur-md rounded-full text-brand-coral hover:bg-brand-midnight transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Architecture Structural Data Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" 
              placeholder="Listing Title (e.g., Luxury 4-Bedroom Detached Duplex)" 
              required
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-4 py-3.5 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              onChange={(e) => setMetadata({...metadata, title: e.target.value})}
            />
            <input 
              type="number" 
              placeholder="Price per Year (₦)" 
              required
              className="w-full bg-brand-slate/30 border border-brand-slate/50 rounded-xl px-4 py-3.5 text-brand-midnight focus:outline-none focus:border-brand-cobalt transition-colors font-medium"
              onChange={(e) => setMetadata({...metadata, price: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || selectedFiles.length === 0}
            className="w-full bg-brand-coral text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-40"
          >
            {loading ? 'Ingesting Media & Publishing...' : 'Deploy Listing to Network'}
          </button>
        </form>

      </div>
    </div>
  );
};