import  { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast'

export const EditPropertyModal = ({ property, onClose, onSave }) => {
  // Local state to track form inputs
  // 1. Initialize state directly from the prop! No useEffect needed.
  const [formData, setFormData] = useState({
    title: property.title || '',
    pricePerAnnum: property.pricePerAnnum || '',
    beds: property.beds || '',
    baths: property.baths || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when modal opens with a property
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []); // <-- Empty dependency array means it only runs once on mount

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(property._id, {
      title: formData.title,
      pricePerAnnum: Number(formData.pricePerAnnum),
      beds: Number(formData.beds),
      baths: Number(formData.baths)
    });
    toast.success('Asset details updated successfully!');
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Heavy Backdrop Blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-white">Edit Asset Details</h3>
            <p className="text-xs text-white/50 font-mono mt-1">ID: {property._id.substring(0, 8)}...</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs text-white/40 font-bold uppercase">Listing Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-white/40 font-bold uppercase">Price Per Annum (₦)</label>
            <input 
              type="number" 
              required
              value={formData.pricePerAnnum}
              onChange={(e) => setFormData({...formData, pricePerAnnum: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 font-bold uppercase">Bedrooms</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.beds}
                onChange={(e) => setFormData({...formData, beds: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 font-bold uppercase">Bathrooms</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.5"
                value={formData.baths}
                onChange={(e) => setFormData({...formData, baths: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cobalt transition-colors text-sm font-mono"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 mt-2 border-t border-white/5">
            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 text-white py-4 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={18} />
                  Update Asset Registry
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};