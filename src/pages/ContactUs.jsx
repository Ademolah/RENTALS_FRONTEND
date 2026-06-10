import  { useState } from 'react';
import { Mail, Phone,  MapPin,  Send, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/layouts/Navbar';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';


export const ContactUs = () => {
  const [form, setForm] = useState({
        from_name: '',
        from_email: '',
        message: '',
      });

      const [isSubmitted, setIsSubmitted] = useState(false);
    
      const [errors, setErrors] = useState({});
    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
      const validate = () => {
        const newErrors = {};
        if (!form.from_name.trim()) newErrors.from_name = 'Name is required';
        if (!form.from_email.trim()) {
          newErrors.from_email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(form.from_email)) {
          newErrors.from_email = 'Email is invalid';
        }
       
        if (!form.message.trim()) newErrors.message = 'Message is required';
    
        return newErrors;
      };
    
      const sendEmail = (e) => {
  e.preventDefault();
  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsSubmitted(true);
  setErrors({});

  toast.promise(
    emailjs.send(
      'service_5xchz5i',
      'template_gehipuf',
      form,
      '5rER37I1dsORgSj8n'
    ),
    {
      loading: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Try again later.',
    }
  ).then(() => {
    // Clear out form inputs locally
    setForm({
      from_name: '',
      from_email: '',
      message: '',
    });

    // 🟢 SURGICAL ADDITION: Refresh layout after the success notification has been read
    setTimeout(() => {
      window.location.reload();
    }, 1800); // 1.8 seconds lets the toast slide in smoothly and complete its lifecycle
  });
};

  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 pt-32 pb-20 px-6 md:px-10 relative overflow-hidden">
        <Navbar/>
      {/* Background Micro-Glow Layer */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-brand-cobalt/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT PANELS: Corporate Coordinates & Communication Lines */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12">
            <div>
              <p className="text-brand-cobalt text-xs font-bold tracking-[0.25em] uppercase mb-4">
                Concierge Desk
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Connect with our global operators.
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Have architectural inquiries or enterprise onboarding requests? Our structural verification agents respond within single-digit minutes.
              </p>
            </div>

            {/* Visual Metadata Vectors */}
            <div className="flex flex-col gap-6 bg-white/[0.01] border border-white/5 p-6 rounded-2xl backdrop-blur-md">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-cobalt shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">Nigeria Sovereign Hub</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                    District Suite 4B, Executive Enclave, Bodija, Ibadan, Oyo State.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-cobalt shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">Digital Desk</h4>
                  <p className="text-slate-400 text-xs mt-1">relations@rentalsluxury.network</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-cobalt shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">Digital Desk</h4>
                  <p className="text-slate-400 text-xs mt-1">relations@rentalsluxury.network</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Glassmorphic Communication Console */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-xl relative">
            
            {isSubmitted ? (
              <div className="absolute inset-0 bg-[#0F172A] rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-brand-cobalt/10 border border-brand-cobalt/20 text-brand-cobalt rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight">Transmission Secured</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">
                  Your pipeline ticket has passed checking. A network concierge agent will review and update shortly.
                </p>
              </div>
            ) : null}

            <form onSubmit={sendEmail} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={form.from_name}
                    onChange={handleChange}
                    name="from_name"
                    placeholder="Charles Ademola"
                    className="bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-cobalt/40 focus:ring-1 focus:ring-brand-cobalt/40 transition-all"
                  />
                  {errors.from_name && <p className="text-red-500 text-sm mt-1">{errors.from_name}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Identity Email</label>
                  <input 
                    type="email" 
                    required
                    value={form.from_email}
                    onChange={handleChange}
                    name="from_email"
                    placeholder="charles@domain.com"
                    className="bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-cobalt/40 focus:ring-1 focus:ring-brand-cobalt/40 transition-all"
                  />
                  {errors.from_email && <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Message Protocol Payload</label>
                <textarea 
                  rows={6}
                  required
                  value={form.message}
                  onChange={handleChange}
                  name="message"
                  placeholder="Describe your enterprise architectural objectives or application requirements..."
                  className="bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-cobalt/40 focus:ring-1 focus:ring-brand-cobalt/40 transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="bg-brand-coral hover:bg-brand-coral/90 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] shadow-lg shadow-brand-coral/20 mt-2"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>

          </div>

        </div>

      </div>

      
    </main>
  );
};