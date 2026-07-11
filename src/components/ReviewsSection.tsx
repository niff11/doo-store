import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Plus, Share2, Twitter, MessageCircle, Send, CheckCircle2, Award, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';
import { INITIAL_REVIEWS, PRODUCTS } from '../data';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Form States
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0].nameAr);
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('doo_store_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('doo_store_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  const handleLike = (id: string) => {
    const updated = reviews.map((rev) => {
      if (rev.id === id) {
        return { ...rev, likes: rev.likes + 1 };
      }
      return rev;
    });
    setReviews(updated);
    localStorage.setItem('doo_store_reviews', JSON.stringify(updated));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      username: username.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      likes: 0,
      productName: selectedProduct
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('doo_store_reviews', JSON.stringify(updated));

    // Reset Form
    setUsername('');
    setRating(5);
    setComment('');
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowForm(false);
    }, 2000);
  };

  const handleShare = (id: string, text: string) => {
    if (activeShareId === id) {
      setActiveShareId(null);
      return;
    }
    setActiveShareId(id);
  };

  const getShareUrl = (platform: 'twitter' | 'whatsapp' | 'copy', commentText: string) => {
    const text = encodeURIComponent(`متجر Doo لخدمات الديسكورد رهيب وسريع! تقييمي: "${commentText}"`);
    const url = encodeURIComponent(window.location.origin);
    if (platform === 'twitter') {
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    }
    if (platform === 'whatsapp') {
      return `https://api.whatsapp.com/send?text=${text}%20${url}`;
    }
    return '';
  };

  const copyToClipboard = (commentText: string) => {
    const text = `تقييمي لمتجر Doo لخدمات الديسكورد: "${commentText}" - ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    alert('تم نسخ رابط المشاركة والتقييم بنجاح! 🚀');
    setActiveShareId(null);
  };

  return (
    <div className="py-16 px-4 max-w-5xl mx-auto font-sans" dir="rtl" id="reviews-section-container">
      {/* Title & Trust Stats */}
      <div className="text-center mb-12">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-discord-purple/10 border border-discord-purple/30 text-discord-purple text-xs font-semibold mb-3"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Award className="w-4 h-4 text-discord-fuchsia" />
          <span>مقياس الموثوقية والمصداقية</span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ماذا يقول <span className="text-discord-purple">عملاؤنا؟</span>
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          أكثر من <span className="text-white font-bold underline decoration-discord-purple decoration-2">+5,000 عميل سعيد</span> يثقون في متجر Doo للحصول على خدمات النيترو والبوستات بأعلى جودة وتفعيل فوري تلقائي.
        </motion.p>
      </div>

      {/* Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-5 rounded-2xl bg-[#1e1f22]/60 border border-white/5 text-center space-y-2">
          <Users className="w-8 h-8 text-discord-purple mx-auto animate-pulse" />
          <h4 className="text-xl font-black text-white">+5,000 عميل</h4>
          <p className="text-xs text-gray-400">يثقون بمتجرنا في الشرق الأوسط بالكامل</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#1e1f22]/60 border border-white/5 text-center space-y-2">
          <div className="flex justify-center items-center gap-1">
            <Star className="w-5 h-5 text-discord-yellow fill-discord-yellow" />
            <Star className="w-5 h-5 text-discord-yellow fill-discord-yellow" />
            <Star className="w-5 h-5 text-discord-yellow fill-discord-yellow" />
            <Star className="w-5 h-5 text-discord-yellow fill-discord-yellow" />
            <Star className="w-5 h-5 text-discord-yellow fill-discord-yellow" />
          </div>
          <h4 className="text-xl font-black text-white">4.9 / 5.0</h4>
          <p className="text-xs text-gray-400">متوسط تقييمات الخدمة من المشترين</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#1e1f22]/60 border border-white/5 text-center space-y-2">
          <Shield className="w-8 h-8 text-discord-green mx-auto" />
          <h4 className="text-xl font-black text-white">100% ضمان وحماية</h4>
          <p className="text-xs text-gray-400">تفعيل فوري أو تعويض مباشر بموجب شرط الفيديو</p>
        </div>
      </div>

      {/* Add Review Button & Panel */}
      <div className="mb-10 text-center">
        {!showForm ? (
          <motion.button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-discord-purple hover:bg-[#4752c4] text-xs font-bold text-white rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-105 active:scale-95"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4.5 h-4.5" />
            <span>كتابة تقييم وتجربة جديدة</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="max-w-xl mx-auto p-6 rounded-2xl bg-discord-dark border border-discord-purple/30 text-right space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-base">أضف تقييمك لمتجرنا</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                إلغاء
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-discord-green/20 border border-discord-green text-discord-green rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold">شكراً لك! تم إضافة تقييمك بنجاح ونشره بالمتجر.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs md:text-sm">
                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-medium">اسمك بالكامل / اسم الشهرة:</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: أحمد الشهري"
                    className="w-full bg-discord-darker border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple placeholder:text-gray-500 text-right text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-gray-300 font-medium">الخدمة المشتراة:</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-discord-darker border border-white/10 rounded-xl px-3 py-3 text-white outline-none focus:border-discord-purple text-right text-xs"
                    >
                      {PRODUCTS.map((prod) => (
                        <option key={prod.id} value={prod.nameAr}>{prod.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-gray-300 font-medium">التقييم بالنجوم:</label>
                    <div className="flex items-center gap-1.5 py-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'text-discord-yellow fill-discord-yellow' : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-gray-300 font-medium">مشاركتنا تجربتك الصادقة:</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="اكتب تفاصيل تجربتك وسرعة التوصيل والأمان هنا..."
                    className="w-full bg-discord-darker border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple placeholder:text-gray-500 text-right text-xs resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-discord-purple hover:bg-[#4752c4] text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 transform rotate-180" />
                  <span>إرسال ونشر التقييم فوراً</span>
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>

      {/* Reviews Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, showAllReviews ? undefined : 3).map((rev) => (
          <motion.div
            key={rev.id}
            layout
            className="p-4 rounded-xl bg-discord-darker/60 border border-white/5 space-y-3 flex flex-col justify-between hover:border-discord-purple/20 transition-all relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
          >
            {/* Top Row: User info and Stars */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-discord-purple to-discord-fuchsia flex items-center justify-center font-bold text-white uppercase text-xs">
                    {rev.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      {rev.username}
                      {rev.verifiedPurchase && (
                        <span className="text-[8px] bg-discord-green/10 text-discord-green border border-discord-green/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-2 h-2" />
                          مشتري مؤكد
                        </span>
                      )}
                    </h4>
                    <p className="text-[9px] text-gray-500">{rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-discord-yellow fill-discord-yellow' : 'text-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Product tag */}
              {rev.productName && (
                <div className="inline-block bg-discord-dark px-2 py-0.5 rounded-md text-[9px] text-discord-purple font-semibold">
                  🏷️ {rev.productName}
                </div>
              )}

              {/* Comment text */}
              <p className="text-gray-300 text-xs leading-relaxed pt-1">
                {rev.comment}
              </p>
            </div>

            {/* Bottom Actions: Likes and Share */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
              <button
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-discord-fuchsia" />
                <span>أعجبني ({rev.likes})</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => handleShare(rev.id, rev.comment)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-discord-purple" />
                  <span>مشاركة</span>
                </button>

                {/* Share Options Popover */}
                <AnimatePresence>
                  {activeShareId === rev.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-8 left-0 bg-[#1e1f22] border border-white/10 rounded-xl p-2 flex gap-2 shadow-2xl z-20"
                    >
                      <a
                        href={getShareUrl('twitter', rev.comment)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-black/40 hover:bg-black/80 rounded-lg text-white hover:text-[#1da1f2] transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={getShareUrl('whatsapp', rev.comment)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-black/40 hover:bg-black/80 rounded-lg text-white hover:text-[#25d366] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(rev.comment)}
                        className="p-1.5 bg-black/40 hover:bg-black/80 rounded-lg text-white hover:text-discord-purple transition-colors cursor-pointer text-[9px] font-bold px-2"
                      >
                        نسخ الرابط
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center pt-8">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-discord-purple/10 hover:bg-discord-purple/20 border border-discord-purple/20 hover:border-discord-purple/40 text-xs font-black text-discord-purple hover:text-white rounded-xl transition-all cursor-pointer shadow-lg"
          >
            {showAllReviews ? 'عرض تقييمات أقل 🪙' : `عرض جميع التقييمات الآتية (+${reviews.length - 3}) 📂`}
          </button>
        </div>
      )}
    </div>
  );
}
