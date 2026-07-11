import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Check, Flame, MessageCircleHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'support',
      text: 'مرحباً بك في متجر Doo! 👋 كيف يمكنني مساعدتك اليوم؟ يمكنك الاستفسار عن النيترو (١٩ ريال)، البوستات، طرق الدفع، أو شروط الاسترجاع والضمان.',
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Alert/notify user when closed about the welcoming bot
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const userQuery = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    // Simulate smart bot response based on keywords
    setTimeout(() => {
      let botResponse = '';
      if (userQuery.includes('نيترو') || userQuery.includes('nitro') || userQuery.includes('19') || userQuery.includes('١٩')) {
        botResponse = 'ديسكورد نيترو متوفر لدينا بسعر خاص جداً (19 ريال فقط بدلاً من 29 ريال) تفعيل تلقائي وفوري! الضمان يوجب تصوير فيديو من بداية الشراء وحتى التفعيل لضمان حقك كاملاً 🛡️.';
      } else if (userQuery.includes('بوست') || userQuery.includes('boost')) {
        botResponse = 'نوفر بوستات ديسكورد للسيرفرات (14 بوست ليفل 3) بأسعار تبدأ من 39 ريال للشهر، و79 ريال لـ 3 أشهر. تفعيل آمن بدون الحاجة لحسابك ⚡.';
      } else if (userQuery.includes('دفع') || userQuery.includes('تحويل') || userQuery.includes('stc') || userQuery.includes('apple')) {
        botResponse = 'نوفر طرق دفع آمنة ومشفرة: بطاقات مدى، فيزا، Apple Pay، STC Pay، بالإضافة للتحويل البنكي المباشر لراجحي/الأهلي. يتم التوصيل تلقائياً فور إتمام الدفع!';
      } else if (userQuery.includes('ضمان') || userQuery.includes('استرجاع') || userQuery.includes('فيديو') || userQuery.includes('ترجيع')) {
        botResponse = 'نضمن لك تفعيلاً كاملاً للخدمات. شرط الضمان: تصوير مقطع فيديو واضح دون انقطاع يبدأ من لحظة استلام الكود والضغط على زر الشراء حتى تفعيله، مع ضرورة إظهار اسم المستخدم (Username) بوضوح لضمان حقك.';
      } else if (userQuery.includes('دعم') || userQuery.includes('انسان') || userQuery.includes('مشكلة') || userQuery.includes('تواصل')) {
        botResponse = 'سيقوم الدعم الفني البشري بالرد عليك فوراً. يمكنك أيضاً الانضمام لسيرفر الدعم الفني بالديسكورد للرد المباشر: https://discord.gg/h7a46w6bh3 أو التواصل عبر الديسكورد الخاص بالإدارة 940y أو انستغرام vaur.1.';
      } else if (userQuery.includes('مرحبا') || userQuery.includes('سلام') || userQuery.includes('هلا') || userQuery.includes('كيف')) {
        botResponse = 'أهلاً بك يا بطل! متجر Doo يرحب بك. نحن متجر معتمد نوفر شحن نيترو وبوستات ديسكورد بأسرع تفعيل وأفضل الأسعار. كيف أخدمك اليوم؟';
      } else {
        botResponse = 'شكراً لرسالتك! لم أفهم استفسارك تماماً، ولكن يمكنك التواصل مع الإدارة مباشرة عبر سيرفر الدعم الفني بالديسكورد: https://discord.gg/h7a46w6bh3 أو الانستغرام vaur.1 أو واتساب/إيميل Ahmed.amk208@gmail.com.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'support',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" dir="rtl">
      {/* Floating Button */}
      <motion.button
        id="live-chat-toggle-btn"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewMessage(false);
        }}
        className="relative p-4 rounded-full bg-discord-purple hover:bg-[#4752c4] text-white shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 glow-purple"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
        {hasNewMessage && !isOpen && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-discord-fuchsia opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-discord-fuchsia text-[10px] items-center justify-center font-bold text-white">1</span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="live-chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[500px] rounded-2xl glass-premium shadow-2xl flex flex-col overflow-hidden border border-discord-purple/30 text-white"
          >
            {/* Header */}
            <div className="bg-[#1e1f22] p-4 border-b border-discord-purple/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-discord-purple flex items-center justify-center text-white font-bold text-lg">
                    D
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-discord-green border-2 border-[#1e1f22]"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">مساعد Doo الذكي</h4>
                  <p className="text-[11px] text-discord-green flex items-center gap-1">
                    <span>•</span> متصل الآن (دعم 24/7)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Banner for discord server */}
            <div className="bg-discord-purple/10 px-4 py-2 border-b border-discord-purple/10 flex items-center justify-between text-xs text-discord-purple">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-discord-fuchsia" />
                سيرفر الدعم الفني بالديسكورد جاهز
              </span>
              <a
                href="https://discord.gg/h7a46w6bh3"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white font-bold"
              >
                انضم الآن
              </a>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user' ? 'bg-discord-fuchsia' : 'bg-discord-purple'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1 max-w-[75%]">
                    <div
                      className={`p-3 rounded-2xl text-[13px] leading-relaxed break-words shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-discord-fuchsia text-white rounded-tr-none'
                          : 'bg-discord-dark text-[#f2f3f5] rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text.includes('https://') ? (
                        <>
                          {msg.text.split(' ').map((word, idx) => {
                            if (word.startsWith('https://')) {
                              return (
                                <a
                                  key={idx}
                                  href={word}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-400 hover:underline break-all block mt-1 font-semibold"
                                >
                                  {word}
                                </a>
                              );
                            }
                            return word + ' ';
                          })}
                        </>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 px-1 text-right">{msg.timestamp}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-discord-purple flex items-center justify-center text-xs font-bold shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-discord-dark border border-white/5 rounded-tl-none">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick suggest tags */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-black/20 border-t border-white/5">
              <button
                onClick={() => setInputText('كيف تفعيل النيترو؟')}
                className="text-[11px] bg-discord-dark/50 border border-white/10 px-2 py-1 rounded-full text-gray-300 hover:text-white hover:border-discord-purple transition-all cursor-pointer"
              >
                💡 تفعيل النيترو
              </button>
              <button
                onClick={() => setInputText('شرط الضمان وتصوير الفيديو')}
                className="text-[11px] bg-discord-dark/50 border border-white/10 px-2 py-1 rounded-full text-gray-300 hover:text-white hover:border-discord-purple transition-all cursor-pointer"
              >
                📹 شرط الفيديو
              </button>
              <button
                onClick={() => setInputText('سعر بوستات الديسكورد')}
                className="text-[11px] bg-discord-dark/50 border border-white/10 px-2 py-1 rounded-full text-gray-300 hover:text-white hover:border-discord-purple transition-all cursor-pointer"
              >
                ⚡ البوستات
              </button>
              <button
                onClick={() => setInputText('هل يوجد دعم مباشر؟')}
                className="text-[11px] bg-discord-dark/50 border border-white/10 px-2 py-1 rounded-full text-gray-300 hover:text-white hover:border-discord-purple transition-all cursor-pointer"
              >
                👥 تواصل مباشر
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#111214] border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب استفسارك هنا..."
                className="flex-1 bg-discord-dark text-white rounded-xl px-3.5 py-2.5 text-xs outline-none border border-white/10 focus:border-discord-purple transition-all placeholder:text-gray-500 text-right"
              />
              <button
                type="submit"
                className="p-2.5 bg-discord-purple hover:bg-[#4752c4] text-white rounded-xl cursor-pointer flex items-center justify-center transition-all glow-purple shrink-0"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
