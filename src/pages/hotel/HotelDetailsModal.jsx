import { useState, useEffect } from 'react';
import { X, Star, MapPin, Users, CheckCircle, MessageSquare,Navigation, Send, User as UserIcon } from 'lucide-react';
import { HotelCardCarousel } from './HotelCardCarousel';
import toast from 'react-hot-toast';
import { apiClient } from '../../services/apiClient'; // Adjust path

export const HotelDetailsModal = ({ isOpen, onClose, hotel, darkMode = true }) => {
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 NEW STATE: Review Data Fetching
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // 🎯 NEW EFFECT: Fetch reviews when the modal opens
  useEffect(() => {
    let isMounted = true;
    
    const fetchReviews = async () => {
      if (!isOpen || !hotel) return;
      
      setIsLoadingReviews(true);
      try {
        const response = await apiClient.get(`/hotels/${hotel._id}/reviews`);
        if (isMounted) {
          setReviews(response.data.data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        if (isMounted) setIsLoadingReviews(false);
      }
    };

    fetchReviews();

    return () => { isMounted = false; };
  }, [isOpen, hotel]);

  if (!isOpen || !hotel) return null;

  const handleSubmitReview = async () => {
    if (rating === 0) return toast.error("Please select a star rating to proceed.");
    if (!reviewText.trim()) return toast.error("Please provide details about your experience.");

    setIsSubmitting(true);
    try {
      const response = await apiClient.post(`/hotels/${hotel._id}/reviews`, { 
        rating, 
        review: reviewText 
      });
      
      toast.success("Premium review submitted successfully!");
      
      // 🎯 Instantly add the new review to the top of the list so the user sees it immediately
      setReviews([response.data.data.review, ...reviews]);
      
      setIsWritingReview(false);
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row border ${
          darkMode ? "bg-[#0F172A] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md transition-colors ${
            darkMode ? "bg-black/40 hover:bg-black/60 text-white/70 hover:text-white" : "bg-white/80 hover:bg-slate-100 text-slate-600 shadow-sm"
          }`}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Left Side: Media */}
        <div className="md:w-1/2 relative bg-zinc-900 min-h-[300px] md:min-h-full">
          <div className="h-full w-full absolute inset-0">
            <HotelCardCarousel mediaUrls={hotel.mediaUrls} title={hotel.title} />
          </div>
        </div>

        {/* Right Side: Deep Details & Review Interface */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center text-brand-gold gap-0.5 mb-2">
            {Array.from({ length: hotel.starRating || 5 }).map((_, sIdx) => (
              <Star key={sIdx} size={14} fill="currentColor" />
            ))}
          </div>

          <h2 className="text-3xl font-black tracking-tight leading-tight mb-2">
            {hotel.title}
          </h2>
          
          <p className={`text-sm font-bold flex items-center gap-1.5 mb-4 text-brand-cobalt`}>
            <MapPin size={16} /> 
            {hotel.streetAddress}, {hotel.locality}, {hotel.state}
          </p>

          {/* 🗺️ PREMIUM EMBEDDED GOOGLE MAP (With shrink-0 Fix) */}
          <div className={`relative w-full h-36 md:h-40 mb-6 shrink-0 overflow-hidden border group shadow-sm rounded-2xl ${
            darkMode ? "border-white/10 bg-white/[0.02]" : "border-slate-200 bg-slate-50"
          }`}>
            <iframe
              title="Property Location View"
              width="100%"
              height="100%"
              className={`border-0 transition-all duration-500 group-hover:scale-[1.02] ${
                darkMode 
                  ? "invert-[92%] hue-rotate-180 contrast-[115%] brightness-[90%] grayscale-[20%]" 
                  : "grayscale-[10%]"
              }`}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${hotel.streetAddress}, ${hotel.locality}, ${hotel.state}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
            
            {/* Ambient Dark Mode Gradient Protector Layer */}
            {darkMode && <div className="absolute inset-0 bg-brand-cobalt/5 pointer-events-none mix-blend-color" />}

            {/* Premium Floating Direction Card Overlay */}
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.streetAddress}, ${hotel.locality}, ${hotel.state}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex bg-brand-cobalt text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl hover:bg-brand-cobalt/90 transform active:scale-95 transition-all items-center gap-1.5 border border-white/10"
            >
              <Navigation size={11} fill="currentColor" />
              <span>Navigate</span>
            </a>
          </div>

          {/* Social Proof / Current Stats */}
          <div className={`p-4 rounded-2xl mb-6 border flex items-center justify-between flex-wrap gap-4 ${
            darkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"
          }`}>
             <div className="flex items-center gap-3">
               <div className="bg-brand-cobalt text-white font-black text-xl px-3 py-2 rounded-xl shadow-md">
                 {hotel.ratingsAverage ? hotel.ratingsAverage.toFixed(1) : '—'}
               </div>
               <div className="flex flex-col">
                 <span className="font-bold uppercase tracking-wider text-sm">
                   {hotel.ratingsAverage >= 4.8 ? 'Exceptional' : hotel.ratingsAverage >= 4.0 ? 'Very Good' : 'Good'}
                 </span>
                 <span className={`text-xs flex items-center gap-1 ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>
                   <MessageSquare size={12} /> Based on {hotel.ratingsQuantity || 0} verified reviews
                 </span>
               </div>
             </div>
             
             <button 
                onClick={() => setIsWritingReview(!isWritingReview)}
                className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${
                  darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white" : "bg-white border-slate-200 hover:bg-slate-50 text-brand-cobalt"
                }`}
             >
               {isWritingReview ? "Cancel" : "Rate Property"}
             </button>
          </div>

          <div className="space-y-8 flex-grow">
            
            {/* CONDITIONAL RENDER: Form OR Details */}
            {isWritingReview ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 border-b pb-8 border-white/10">
                {/* ... (Your existing review form code remains unchanged here) ... */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Your Rating</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} size={28}
                        className={`cursor-pointer transition-colors ${
                          (hoverRating || rating) >= star ? "text-brand-gold fill-brand-gold" : darkMode ? "text-white/20" : "text-slate-300"
                        }`}
                        onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Your Experience</h3>
                  <textarea 
                    value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your corporate lodging experience..."
                    className={`w-full p-4 rounded-xl text-sm border focus:ring-2 focus:outline-none transition-all resize-none h-32 ${
                      darkMode ? "bg-black/50 border-white/10 text-white focus:border-brand-cobalt focus:ring-brand-cobalt/20 placeholder:text-white/30" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-brand-cobalt focus:ring-brand-cobalt/20 placeholder:text-slate-400"
                    }`}
                  />
                </div>
                <button 
                  onClick={handleSubmitReview} disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                  className="w-full bg-brand-cobalt hover:bg-brand-cobalt/90 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Verifying..." : "Submit Verified Review"} <Send size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">About this property</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-slate-600"}`}>
                      {hotel.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">Verified Amenities</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {hotel.amenities?.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                          <span className={darkMode ? "text-white/80" : "text-slate-700"}>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {hotel.roomTypes?.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-60">Available Suites</h3>
                    <div className="space-y-3">
                      {hotel.roomTypes.map((room) => (
                        <div 
                          key={room._id} 
                          className={`group p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-lg cursor-pointer ${
                            darkMode ? "bg-white/[0.02] border-white/10 hover:border-brand-cobalt/50" : "bg-white border-slate-200 hover:border-brand-cobalt/40"
                          }`}
                        >
                          <div>
                            <h4 className="text-base font-bold group-hover:text-brand-cobalt transition-colors">{room.name}</h4>
                            <div className={`text-xs mt-1.5 flex items-center gap-3 ${darkMode ? "text-white/60" : "text-slate-500"}`}>
                              <span className="flex items-center gap-1 font-medium">
                                {/* Make sure to import { Users } from 'lucide-react' */}
                                <Users size={12} /> Up to {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                              </span>
                              {room.isAvailable ? (
                                <span className="text-emerald-500 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                                  Available
                                </span>
                              ) : (
                                <span className="text-rose-500 flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                                  Sold Out
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className={`text-left sm:text-right border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-5 mt-2 sm:mt-0 ${
                            darkMode ? "border-white/10" : "border-slate-200"
                          }`}>
                            <span className={`text-[10px] uppercase tracking-wider block font-bold ${darkMode ? "text-white/40" : "text-slate-500"}`}>
                              Per Night
                            </span>
                            <h5 className="text-xl font-mono font-black text-brand-cobalt">
                              ₦{room.pricePerNight.toLocaleString()}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 🎯 NEW RENDER: The Guest Reviews Feed */}
            <div className="pt-4 mt-6 border-t border-white/10">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                Guest Experiences <span className="bg-brand-cobalt/20 text-brand-cobalt px-2 py-0.5 rounded text-[10px]">{reviews.length}</span>
              </h3>
              
              {isLoadingReviews ? (
                <div className="animate-pulse space-y-4">
                   <div className="h-20 bg-white/5 rounded-xl w-full"></div>
                   <div className="h-20 bg-white/5 rounded-xl w-full"></div>
                </div>
              ) : reviews.length === 0 ? (
                <p className={`text-xs italic ${darkMode ? "text-white/40" : "text-slate-500"}`}>
                  Be the first to share your corporate experience at this location.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className={`p-4 rounded-2xl border ${darkMode ? "bg-white/[0.02] border-white/5" : "bg-white border-slate-100"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${darkMode ? "bg-brand-cobalt text-white" : "bg-slate-200 text-slate-700"}`}>
                            {review.user?.firstName ? review.user.firstName.charAt(0) : <UserIcon size={14} />}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{review.user?.firstName || "Verified Guest"}</p>
                            <p className={`text-[10px] ${darkMode ? "text-white/40" : "text-slate-400"}`}>
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex bg-brand-gold/10 px-2 py-1 rounded text-brand-gold">
                          <span className="text-[10px] font-black">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed ${darkMode ? "text-white/80" : "text-slate-600"}`}>
                        "{review.review}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};