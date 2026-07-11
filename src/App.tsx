import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  Plus,
  ShoppingCart,
  MessageSquare,
  Instagram,
  Mail,
  Send,
  HelpCircle,
  FileText,
  Lock,
  User,
  Star,
  Activity,
  Heart,
  Globe,
  Bell,
  X
} from 'lucide-react';

// Import local components
import Header from './components/Header';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import FAQSection from './components/FAQSection';
import TermsPage from './components/TermsPage';
import ReviewsSection from './components/ReviewsSection';
import LiveChat from './components/LiveChat';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';

// Types and static data
import { Product, CartItem, Order } from './types';
import { PRODUCTS } from './data';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('doo_admin_passcode') || 'Loveloly1234';
  });
  const [categoryNames, setCategoryNames] = useState({
    nitro: 'ديسكورد نيترو',
    boosts: 'بوستات السيرفر',
    effects: 'تأثيرات الملف الشخصي',
  });
  
  // Custom Toasts state
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);

  // Simulated live purchases to create social proof
  const [liveNotification, setLiveNotification] = useState<{ name: string; action: string; time: string } | null>(null);

  // Load cart, categories and products on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('doo_store_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    const savedNames = localStorage.getItem('doo_store_category_names');
    if (savedNames) {
      setCategoryNames(JSON.parse(savedNames));
    }
    const savedProducts = localStorage.getItem('doo_store_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleUpdateCategoryNames = (names: { nitro: string; boosts: string; effects: string }) => {
    setCategoryNames(names);
    localStorage.setItem('doo_store_category_names', JSON.stringify(names));
  };

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem('doo_store_cart', JSON.stringify(newCart));
  };

  // Toast notifier helper
  const addToast = (text: string) => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Automated notification simulation for customer engagement
  useEffect(() => {
    const names = ['سلمان', 'بندر', 'عبدالله', 'مشاري', 'ريان', 'سعد', 'تركي', 'هند', 'جود', 'نورة'];
    const actions = [
      'قام بشراء ديسكورد نيترو - شهر كامل بسعر ١٩ ريال ⚡',
      'قام بترقية سيرفره الخاص بـ 14 بوست 🚀',
      'طلب تخصيص تأثير بروفايل ديسكورد حاد وجميل ✨',
      'قام بوضع تقييم 5 نجوم لسرعة التفعيل التلقائي بالمتجر 🏆'
    ];

    const interval = setInterval(() => {
      // Trigger notification occasionally
      if (Math.random() > 0.4) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        setLiveNotification({
          name: randomName,
          action: randomAction,
          time: 'الآن'
        });
        
        // Clear after 6 seconds
        setTimeout(() => {
          setLiveNotification(null);
        }, 6000);
      }
    }, 25000); // every 25 seconds

    return () => clearInterval(interval);
  }, []);

  // Catch custom event from checkouts to update notifications instantly
  useEffect(() => {
    const handleNewOrder = (e: Event) => {
      const customEvent = e as CustomEvent<Order>;
      if (customEvent.detail) {
        setLiveNotification({
          name: customEvent.detail.customerName,
          action: `أتم عملية دفع ناجحة لخدمات بقيمة ${customEvent.detail.total} ريال وتوصيل تلقائي! 🛍️`,
          time: 'الآن'
        });
        setTimeout(() => {
          setLiveNotification(null);
        }, 8000);
      }
    };
    window.addEventListener('new_order_placed', handleNewOrder);
    return () => window.removeEventListener('new_order_placed', handleNewOrder);
  }, []);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number,
    selectedOption?: string,
    serverLink?: string,
    supporterName?: string
  ) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedOption === selectedOption &&
        item.serverLink === serverLink &&
        item.supporterName === supporterName
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...cartItems,
        { product, quantity, selectedOption, serverLink, supporterName },
      ];
    }
    saveCart(updated);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    saveCart(updated);
    addToast('تم حذف المنتج من سلة المشتريات 🗑️');
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Navigation controller with page scrolling restoration
  const handleNavigate = (view: string, product: Product | null = null) => {
    setCurrentView(view);
    if (product) {
      setSelectedProduct(product);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin adjustments
  const handleUpdateProductPrice = (id: string, price: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, price };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('doo_store_products', JSON.stringify(updated));
  };

  const handleUpdateProductStock = (id: string, stock: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, stock };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('doo_store_products', JSON.stringify(updated));
  };

  const handleUpdateProductImage = (id: string, image: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, image };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('doo_store_products', JSON.stringify(updated));
  };

  // Contact Form submit
  const [contactName, setContactName] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) return;
    setContactSubmitted(true);
    addToast('تم إرسال رسالتك بنجاح وسيتواصل الدعم معك! 📥');
    setTimeout(() => {
      setContactName('');
      setContactMsg('');
      setContactSubmitted(false);
    }, 4000);
  };

  // Filters depending on search queries
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleToggleAdmin = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      addToast('🔓 تم تسجيل الخروج من لوحة الإدارة بنجاح!');
    } else {
      setShowAdminLogin(true);
      setAdminPasswordInput('');
    }
  };

  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === adminPasscode) {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPasswordInput('');
      addToast('👑 مرحباً بك يا مدير! تم التحقق من هويتك بنجاح.');
    } else {
      addToast('❌ رمز المرور المدخل غير صحيح! الدخول للإدارة فقط.');
    }
  };

  return (
    <div className="min-h-screen bg-discord-black text-[#f2f3f5] relative flex flex-col justify-between selection:bg-discord-purple selection:text-white" dir="rtl">
      
      {/* Dynamic Header */}
      <Header
        cartItems={cartItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={(view) => handleNavigate(view)}
        currentView={currentView}
        toggleAdmin={handleToggleAdmin}
        isAdminMode={isAdminMode}
        categoryNames={categoryNames}
      />

      {/* Main Content Render */}
      <main className="flex-grow">
        
        {/* IF ADMIN MODE IS TRIGGERED OVERRIDE CURRENT VIEW */}
        {isAdminMode ? (
          <AdminPanel
            products={products}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateProductImage={handleUpdateProductImage}
            categoryNames={categoryNames}
            onUpdateCategoryNames={handleUpdateCategoryNames}
            addToast={addToast}
            adminPasscode={adminPasscode}
            onUpdateAdminPasscode={(newCode) => {
              setAdminPasscode(newCode);
              localStorage.setItem('doo_admin_passcode', newCode);
            }}
          />
        ) : (
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: HOME PAGE */}
            {currentView === 'home' && (
              <motion.div
                key="home-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-16 pb-16"
              >
                {/* HERO SECTION - SLEEK DISCORD THEME */}
                <section className="relative overflow-hidden py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-gradient-to-b from-discord-purple/10 via-discord-black to-discord-black">
                  
                  {/* Backdrop glow dots */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-discord-purple/10 rounded-full filter blur-3xl animate-pulse-glow"></div>

                  <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-discord-purple/20 border border-discord-purple/40 text-white text-xs font-semibold">
                      <Flame className="w-4.5 h-4.5 text-discord-fuchsia animate-bounce" />
                      <span>أقوى عروض الديسكورد بالشرق الأوسط</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl font-black font-display text-white leading-tight tracking-tight">
                      مرحباً بك في <span className="text-discord-purple">متجر Doo</span>
                    </h1>
                    
                    <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
                      الخيار الأول والآمن لشحن ديسكورد نيترو وبوستات السيرفرات وتأثيرات الحساب مع نظام دفع آمن ومشفر وتفعيل فوري تلقائي في ثوانٍ معدودة.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                      <button
                        onClick={() => handleNavigate('shop')}
                        className="w-full sm:w-auto px-10 py-4.5 bg-discord-purple hover:bg-[#4752c4] text-white text-sm font-black rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-103 active:scale-97 text-center flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>تسوق الآن</span>
                      </button>
                    </div>

                    {/* Security declaration */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                      <Lock className="w-4 h-4 text-discord-green" />
                      <span>بوابات دفع مشفرة 100% بالكامل • تفعيل فوري مع الضمان</span>
                    </div>
                  </div>
                </section>

                {/* FEATURE BENEFITS GRID */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl font-extrabold text-white font-display">لماذا يختارنا مئات العملاء يومياً؟</h3>
                    <p className="text-xs text-gray-400 mt-1">نسعى دائمًا لتقديم تجربة شرائية استثنائية وآمنة بالكامل 🛡️</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-discord-darker/60 border border-white/5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-discord-purple/15 text-discord-purple flex items-center justify-center font-bold">
                        ⚡
                      </div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">تفعيل تلقائي سريع</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        بمجرد السداد بنجاح عبر البطاقات البنكية أو المحافظ الرقمية، يقوم نظامنا بتوصيل أكواد التفعيل وتفعيل البوستات والخدمات تلقائياً.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-discord-darker/60 border border-white/5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-discord-purple/15 text-discord-purple flex items-center justify-center font-bold">
                        🔒
                      </div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">تشفير وخصوصية تامة</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        جميع البيانات الحساسة مشفرة عبر طبقات أمان SSL. نحن لا نطلب أي كلمات مرور لحساباتكم على ديسكورد إطلاقاً لضمان الخصوصية.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-discord-darker/60 border border-white/5 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-discord-purple/15 text-discord-purple flex items-center justify-center font-bold">
                        📹
                      </div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">ضمان حقيقي بمصداقية</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        نضمن كود تفعيل سليم 100%. شرط الضمان تسجيل فيديو من الدفع للتفعيل لحماية حقوقك وإعطائك بديلاً أو استرجاعاً فورياً في حال وجود مشكلة.
                      </p>
                    </div>
                  </div>
                </section>



                {/* INTERACTIVE CUSTOMER REVIEWS & RATINGS SECTION */}
                <ReviewsSection />

                {/* FAQ SECTION */}
                <FAQSection />

                {/* CONTACT US QUICK CONTEXT ON HOME PAGE */}
                <section className="max-w-4xl mx-auto px-4">
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#1e1f22]/70 border border-white/10 space-y-6">
                    <div className="text-center space-y-1">
                      <h3 className="text-xl font-bold text-white font-display">تواصل مباشرة معنا</h3>
                      <p className="text-xs text-gray-400">نحن متصلون لمساعدتك وحل مشاكلك الفنية طوال الـ 24 ساعة!</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                      {/* Left: Contact Info */}
                      <div className="space-y-4 text-xs">
                        <p className="font-extrabold text-white text-[13px] border-b border-white/5 pb-2">قنوات الدعم الفني الرسمية:</p>
                        
                        <div className="space-y-3">
                          <a
                            href="https://discord.gg/h7a46w6bh3"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 bg-discord-black rounded-xl hover:border-discord-purple border border-white/5 transition-all cursor-pointer"
                          >
                            <span className="p-2 rounded-lg bg-discord-purple/10 text-discord-purple shrink-0">💬</span>
                            <div>
                              <p className="font-bold text-white">سيرفر الدعم الفني (ديسكورد):</p>
                              <p className="text-[10px] text-gray-400">discord.gg/h7a46w6bh3</p>
                            </div>
                          </a>

                          <div className="flex items-center gap-3 p-3 bg-discord-black rounded-xl border border-white/5">
                            <span className="p-2 rounded-lg bg-discord-purple/10 text-discord-purple shrink-0">👤</span>
                            <div>
                              <p className="font-bold text-white">حساب ديسكورد الإدارة المباشر:</p>
                              <p className="text-[10px] text-gray-400">940y</p>
                            </div>
                          </div>

                          <a
                            href="https://instagram.com/vaur.1"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 p-3 bg-discord-black rounded-xl hover:border-discord-purple border border-white/5 transition-all cursor-pointer"
                          >
                            <span className="p-2 rounded-lg bg-discord-purple/10 text-discord-purple shrink-0"><Instagram className="w-4 h-4 text-discord-fuchsia" /></span>
                            <div>
                              <p className="font-bold text-white">حساب الإنستغرام للدعم:</p>
                              <p className="text-[10px] text-gray-400">vaur.1</p>
                            </div>
                          </a>

                          <a
                            href="mailto:Ahmed.amk208@gmail.com"
                            className="flex items-center gap-3 p-3 bg-discord-black rounded-xl hover:border-discord-purple border border-white/5 transition-all cursor-pointer"
                          >
                            <span className="p-2 rounded-lg bg-discord-purple/10 text-discord-purple shrink-0"><Mail className="w-4 h-4 text-discord-fuchsia" /></span>
                            <div>
                              <p className="font-bold text-white">البريد الإلكتروني المعتمد:</p>
                              <p className="text-[10px] text-gray-400">Ahmed.amk208@gmail.com</p>
                            </div>
                          </a>
                        </div>
                      </div>

                      {/* Right: Contact Form */}
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="space-y-1.5 text-xs">
                          <label className="block text-gray-300">اسمك بالكامل:</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="مثال: تركي الرويلي"
                            className="w-full bg-discord-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-discord-purple text-right"
                          />
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <label className="block text-gray-300">نص رسالتك أو استفسارك الفني:</label>
                          <textarea
                            required
                            rows={3}
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            placeholder="اكتب استفسارك بالتفصيل حول كود التفعيل أو الطلبات..."
                            className="w-full bg-discord-black border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-discord-purple text-right resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-4 h-4 transform rotate-180" />
                          <span>إرسال الرسالة للإدارة فورا</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </section>

              </motion.div>
            )}

            {/* VIEW 1.5: SHOP / CATEGORIES VIEW */}
            {currentView === 'shop' && (
              <motion.div
                key="shop-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-16 py-12 pb-16"
              >
                {/* CATEGORIES SECTION */}
                <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                  <div className="text-center mb-12 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-discord-purple/15 text-discord-purple text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>فئات الخدمات المتاحة</span>
                    </div>
                    <h2 className="text-3xl font-black text-white font-display">تصفح أقسام المتجر</h2>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">اختر القسم الذي تريده واستمتع بتسليم فوري مع كامل الضمان والأمان.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Category 1: Nitro */}
                    <motion.div
                      onClick={() => handleNavigate('nitro')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'nitro')?.image}
                          alt={categoryNames.nitro}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.nitro}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">اشتراك ديسكورد نيترو القيّيم بكامل الميزات وبأرخص الأسعار.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">متوفر فوري ⚡</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Category 2: Boosts */}
                    <motion.div
                      onClick={() => handleNavigate('boosts')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'boosts')?.image}
                          alt={categoryNames.boosts}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.boosts}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">رقي سيرفرك إلى ليفل 3 فورياً مع أقصى ثبات وأرخص سعر.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">متوفر فوري ⚡</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Category 3: Effects */}
                    <motion.div
                      onClick={() => handleNavigate('effects')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'effects')?.image}
                          alt={categoryNames.effects}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.effects}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">زخارف حصرية وصانعة تميز لحسابك في ديسكورد حسب طلبك.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">حسب الطلب 💬</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* VIEW 2: DISCORD NITRO SPECIFIC FILTERED VIEW */}
            {currentView === 'nitro' && (
              <motion.div
                key="nitro-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <div className="max-w-7xl mx-auto px-4 space-y-12">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">ديسكورد نيترو القيّم</h1>
                    <p className="text-xs text-gray-400">أرخص سعر اشتراك بالوطن العربي بـ ١٩ ريال فقط لتفعيل حسابك تلقائياً.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Visual card */}
                    <div className="p-6 bg-discord-dark rounded-3xl border border-white/10 glow-purple space-y-4">
                      <img
                        src={products.find(p => p.category === 'nitro')?.image}
                        alt="Discord Nitro"
                        className="w-full h-auto rounded-2xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold">الضمان والتسليم الفوري:</span>
                        <span className="text-discord-green font-bold">توصيل تلقائي في أقل من دقيقة ⚡</span>
                      </div>
                    </div>

                    {/* Order action */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-white">تفعيل ديسكورد نيترو - شهر كامل</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        نوفر اشتراكات هدايا رسمية 100% تفعل على حسابك مباشرة. الضمان يوجب تصوير فيديو أثناء التفعيل لضمان المصداقية ومنعاً لأي ادعاءات معطلة.
                      </p>
                      
                      <div className="p-4 rounded-xl bg-black/35 border border-discord-purple/20">
                        <p className="text-xs text-gray-400">السعر الحالي:</p>
                        <p className="text-2xl font-black text-discord-fuchsia mt-0.5">19 ريال سعودي <span className="text-xs text-gray-500 line-through">29 ريال</span></p>
                      </div>

                      <button
                        onClick={() => handleNavigate('product_details', products.find(p => p.category === 'nitro') || null)}
                        className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer text-center shadow-lg transition-all glow-purple"
                      >
                        عرض وتأكيد الشراء الفوري
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: DISCORD SERVER BOOSTS VIEW */}
            {currentView === 'boosts' && (
              <motion.div
                key="boosts-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="max-w-7xl mx-auto px-4 space-y-12">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">بوستات ديسكورد للسيرفرات</h1>
                    <p className="text-xs text-gray-400">رقي سيرفرك إلى ليفل 3 فورياً بأعلى ثبات ودون الحاجة لحسابك.</p>
                  </div>

                  <div className="grid grid-cols-1 max-w-xl mx-auto gap-8">
                    {products.filter(p => p.category === 'boosts').map((bProd) => (
                      <div
                        key={bProd.id}
                        className="p-6 rounded-3xl bg-discord-dark border border-white/5 hover:border-discord-purple/20 transition-all text-right flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <img
                            src={bProd.image}
                            alt={bProd.nameAr}
                            className="w-full h-48 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <h3 className="font-extrabold text-lg text-white">{bProd.nameAr}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">{bProd.descriptionAr}</p>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <span className="text-discord-fuchsia font-extrabold text-base">{bProd.price} ريال</span>
                          <button
                            onClick={() => handleNavigate('product_details', bProd)}
                            className="px-5 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                          >
                            طلب الخدمة والتفعيل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4: PROFILE EFFECTS VIEW */}
            {currentView === 'effects' && (
              <motion.div
                key="effects-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="max-w-3xl mx-auto px-4 text-center space-y-8">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">تأثيرات وزينة الملف الشخصي</h1>
                    <p className="text-xs text-gray-400">تأثيرات وزخارف بصرية مذهلة لتزيين حسابك وإعطائه مظهراً فريداً وخاطفاً للأنظار. متوفرة حسب الطلب.</p>
                  </div>

                  <div className="p-8 rounded-3xl bg-discord-dark border border-white/10 glow-purple text-right space-y-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-discord-fuchsia animate-pulse" />
                      طلب تأثير مخصص على حسابك
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      نحن نوفر تزيينات وزخارف ديسكورد وتأثيرات للأفاتار والغلاف. الخدمة متوفرة بأسعار ممتازة حسب رغبتك بالكامل. الرجاء تقديم طلبك بالأسفل لتحديد السعر الفوري والبدء.
                    </p>

                    <button
                      onClick={() => handleNavigate('product_details', products.find(p => p.category === 'effects') || null)}
                      className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                    >
                      فتح صفحة الطلب والمواصفات
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 5: FAQ PAGE */}
            {currentView === 'faq' && <FAQSection />}

            {/* VIEW 6: TERMS & POLICIES */}
            {currentView === 'terms' && <TermsPage />}

            {/* VIEW 7: CONTACT US PAGE */}
            {currentView === 'contact' && (
              <motion.div
                key="contact-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-16 max-w-2xl mx-auto px-4 space-y-8 text-center font-sans"
                dir="rtl"
              >
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white font-display">تواصل معنا</h1>
                  <p className="text-xs sm:text-sm text-gray-400">يسعدنا تواصلك معنا مباشرة عبر قنوات الدعم الرسمية التالية:</p>
                </div>

                <div className="bg-[#1e1f22]/90 border border-discord-purple/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-discord-purple/5 rounded-full filter blur-2xl"></div>
                  
                  <div className="space-y-4 text-right">
                    {/* Discord */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-discord-black/60 rounded-2xl border border-white/5 gap-3 hover:border-discord-purple/40 transition-all">
                      <span className="text-xs font-black text-gray-300">سيرفرنا ديسكورد:</span>
                      <a 
                        href="https://discord.gg/h7a46w6bh3" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm font-bold text-discord-purple hover:text-[#5865f2] underline decoration-discord-purple/40 hover:scale-102 transition-transform break-all"
                      >
                        https://discord.gg/h7a46w6bh3
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-discord-black/60 rounded-2xl border border-white/5 gap-3 hover:border-discord-purple/40 transition-all">
                      <span className="text-xs font-black text-gray-300">بريدي الالكتروني:</span>
                      <a 
                        href="mailto:Ahmed.amk208@gmail.com" 
                        className="text-sm font-bold text-discord-fuchsia hover:underline font-mono break-all"
                      >
                        Ahmed.amk208@gmail.com
                      </a>
                    </div>

                    {/* Instagram */}
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-discord-black/60 rounded-2xl border border-white/5 gap-3 hover:border-discord-purple/40 transition-all">
                      <span className="text-xs font-black text-gray-300">انستا:</span>
                      <a 
                        href="https://instagram.com/vaur.1" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm font-bold text-white hover:text-discord-fuchsia hover:underline font-mono"
                      >
                        vaur.1
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  سيقوم فريق الدعم الفني بالرد عليك في أسرع وقت ممكن. شكراً لثقتك بمتجرنا! 🤝
                </div>
              </motion.div>
            )}

            {/* VIEW 8: PRODUCT DETAILS */}
            {currentView === 'product_details' && selectedProduct && (
              <ProductDetails
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onNavigate={(v) => handleNavigate(v)}
                addToast={addToast}
              />
            )}

            {/* VIEW 9: SHOPPING CART */}
            {currentView === 'cart' && (
              <Cart
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigate={(v, p) => handleNavigate(v, p)}
                addToast={addToast}
              />
            )}

            {/* VIEW 10: USER PROFILE & CREATIONS */}
            {currentView === 'profile' && (
              <UserProfile
                addToast={addToast}
                onNavigate={(v) => handleNavigate(v)}
              />
            )}

          </AnimatePresence>
        )}

      </main>

      {/* FLOAT CHAT SUPPORT WIDGET */}
      <LiveChat />

      {/* FOOTER SECTION */}
      <footer className="bg-discord-black border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
          
          {/* Logo & Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-discord-purple flex items-center justify-center text-white glow-purple">
                <Sparkles className="w-4.5 h-4.5 text-discord-fuchsia animate-pulse" />
              </div>
              <span className="text-lg font-black font-display text-white">متجر <span className="text-discord-purple">Doo</span></span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              متجر Doo لبيع خدمات ديسكورد نيترو وبوستات السيرفرات وتأثيرات الحساب بأرخص الأسعار بالشرق الأوسط مع تسليم فوري وتلقائي مشفر بالكامل لضمان حقوقك وخصوصيتك.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://discord.gg/h7a46w6bh3" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-discord-dark hover:bg-discord-purple text-gray-400 hover:text-white flex items-center justify-center transition-colors">💬</a>
              <a href="https://instagram.com/vaur.1" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-discord-dark hover:bg-discord-purple text-gray-400 hover:text-white flex items-center justify-center transition-colors"><Instagram className="w-4.5 h-4.5" /></a>
            </div>
          </div>

          {/* Core pages */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs sm:text-sm">روابط تهمك</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition-colors cursor-pointer text-right">الصفحة الرئيسية</button></li>
              <li><button onClick={() => handleNavigate('faq')} className="hover:text-white transition-colors cursor-pointer text-right">الأسئلة الشائعة</button></li>
              <li><button onClick={() => handleNavigate('terms')} className="hover:text-white transition-colors cursor-pointer text-right">شروط الخدمة والضمان</button></li>
              <li><button onClick={() => handleNavigate('contact')} className="hover:text-white transition-colors cursor-pointer text-right">تواصل مع الدعم الفني</button></li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs sm:text-sm">روابط الإدارة السريعة</h4>
            <ul className="space-y-2 text-xs text-gray-400 font-mono">
              <li>ديسكورد: 940y</li>
              <li>إنستغرام: vaur.1</li>
              <li>سيرفر الدعم: h7a46w6bh3</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & secure icon */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} متجر Doo - جميع الحقوق محفوظة لخدمات ديسكورد بالشرق الأوسط.</p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-discord-dark/50 px-3 py-1.5 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-discord-green" />
            <span>نظام دفع آمن وتوصيل فوري مشفر 100% SSL</span>
          </div>
        </div>
      </footer>

      {/* CUSTOM TOAST SYSTEM ALERT POPUPS */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.9 }}
              className="p-3.5 rounded-xl bg-discord-dark border border-discord-purple/40 text-white font-sans text-xs flex items-center gap-2 shadow-2xl pointer-events-auto border-r-4 border-r-discord-purple glow-purple"
            >
              <Sparkles className="w-4.5 h-4.5 text-discord-fuchsia animate-pulse shrink-0" />
              <p className="font-semibold">{toast.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* SIMULATED LIVE CUSTOMER NOTIFICATION ALERT POPUPS */}
      <AnimatePresence>
        {liveNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-6 sm:left-auto sm:right-6 md:right-auto md:left-6 bg-discord-darker/95 border border-discord-purple/30 p-4 rounded-2xl shadow-2xl z-40 max-w-[320px] font-sans flex gap-3 text-right text-xs glow-purple border-r-4 border-r-discord-fuchsia"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-discord-purple to-discord-fuchsia flex items-center justify-center text-white font-bold shrink-0 text-sm">
              {liveNotification.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-white text-xs">{liveNotification.name} ⚡</h4>
              <p className="text-gray-400 text-[11px] leading-relaxed">{liveNotification.action}</p>
              <span className="text-[9px] text-gray-500 block">{liveNotification.time} • متجر Doo المعتمد</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURE ADMIN LOGIN PASSWORD MODAL */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminLogin(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-discord-dark border border-discord-purple/40 p-6 rounded-2xl relative z-10 shadow-2xl space-y-4 text-center glow-purple"
            >
              <div className="w-12 h-12 rounded-full bg-discord-purple/10 border border-discord-purple/20 flex items-center justify-center mx-auto text-discord-purple">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">التحقق من صلاحيات الإدارة 👑</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  هذه المنطقة مخصصة لإدارة متجر Doo وتغيير الأسعار والصور فقط. يرجى إدخال رمز المرور الخاص بك.
                </p>
              </div>

              <form onSubmit={handleVerifyAdmin} className="space-y-4">
                <div className="space-y-1.5 text-right">
                  <label className="text-[11px] font-bold text-gray-400 block pr-1">رمز المرور السري (Passcode):</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="أدخل الرمز السري هنا..."
                    className="w-full bg-discord-darker border border-white/10 rounded-xl py-3 px-4 text-white text-center font-mono placeholder-gray-600 outline-none focus:border-discord-purple focus:ring-2 focus:ring-discord-purple/25 transition-all text-sm tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLogin(false)}
                    className="py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold rounded-xl cursor-pointer transition-all border border-white/5"
                  >
                    إلغاء التراجع
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-lg glow-purple"
                  >
                    تأكيد الدخول 🔑
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
