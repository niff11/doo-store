import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquareCode, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQS } from '../data';

export default function FAQSection() {
  const [activeId, setActiveId] = useState<string | null>('faq_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = ['الكل', 'التسليم والضمان', 'طرق التفعيل', 'الدفع والأمان'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      (faq.question || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (faq.answer || '').toLowerCase().includes((searchQuery || '').toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto font-sans" dir="rtl" id="faq-section-wrapper">
      <div className="text-center mb-12">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-discord-purple/10 border border-discord-purple/30 text-discord-purple text-xs font-semibold mb-3"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <HelpCircle className="w-4.5 h-4.5 text-discord-fuchsia animate-pulse" />
          <span>الأسئلة الأكثر شيوعاً</span>
        </motion.div>
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          ألديك أي <span className="text-discord-purple">استفسار؟</span>
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          استخدمت أسلوب البطاقات التفاعلية لترتيب الأسئلة الأكثر شيوعاً (مثل وقت التسليم، الضمان، وطرق التفعيل) مما يسهل عليك العثور على المعلومة فورياً.
        </motion.p>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الأسئلة الشائعة..."
            className="w-full bg-discord-dark border border-white/10 rounded-2xl py-3.5 pr-11 pl-4 text-xs text-white placeholder-gray-500 outline-none focus:border-discord-purple focus:glow-purple transition-all"
          />
          <Search className="w-5 h-5 text-gray-500 absolute top-3.5 right-4" />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-discord-purple text-white glow-purple'
                  : 'bg-discord-dark/50 border border-white/5 text-gray-400 hover:text-white hover:bg-discord-dark'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = activeId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-discord-darker/80 border-discord-purple/40 glow-purple'
                      : 'bg-discord-dark/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setActiveId(isOpen ? null : faq.id)}
                    className="w-full text-right p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="p-2 rounded-xl bg-discord-purple/10 text-discord-purple shrink-0">
                        <Sparkles className="w-4 h-4 text-discord-fuchsia" />
                      </span>
                      <span className="font-bold text-sm md:text-base text-white hover:text-discord-purple transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-discord-purple shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-300 leading-relaxed border-t border-white/5 bg-black/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-discord-dark/20 border border-white/5 rounded-2xl">
              <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">لم يتم العثور على أي نتائج مطابقة لبحثك.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Discord Help Banner */}
      <motion.div
        className="mt-12 p-6 rounded-2xl glass-premium border border-discord-purple/30 text-center flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-right space-y-1">
          <h4 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5 text-discord-fuchsia animate-bounce" />
            لم تجد إجابة لاستفسارك؟
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            انضم الآن إلى سيرفر الدعم الفني الخاص بـ متجر Doo على الديسكورد لتلقي المساعدة المباشرة وحل جميع مشاكلك طوال الـ 24 ساعة.
          </p>
        </div>
        <a
          href="https://discord.gg/h7a46w6bh3"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-105 active:scale-95 text-center shrink-0 w-full md:w-auto"
        >
          الانضمام لسيرفر الدعم الفني
        </a>
      </motion.div>
    </div>
  );
}
