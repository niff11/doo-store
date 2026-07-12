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
  X,
  AlertCircle
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
import OrderReceipt from './components/OrderReceipt';

// Import Supabase helpers
import { getProducts, createProductInDb, updateProductInDb, deleteProductFromDb, getOrders, saveOrder, updateOrderInDb, supabase, isSupabaseConfigured, mapOrderRow } from './lib/supabase';

// Types and static data
import { Product, CartItem, Order } from './types';
import { PRODUCTS } from './data';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [myOrdersQuery, setMyOrdersQuery] = useState<string>('');
  const [trackingTab, setTrackingTab] = useState<'general' | 'direct_id'>('direct_id');
  const [directOrderIdQuery, setDirectOrderIdQuery] = useState<string>('');
  const [viewingReceiptOrder, setViewingReceiptOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('doo_admin_passcode') || 'Loveloly1234';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('doo_admin_email') || 'ahmed.amk208@gmail.com';
  });
  const [categoryNames, setCategoryNames] = useState({
    nitro: 'Nitro 1 month',
    boosts: ' Boosts',
    effects: 'Effects',
    users_premium: ' Usernames',
    creations_custom: 'Discord server modifications',
    old_accounts: 'Old accounts',
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

    // Load products and orders from Supabase backend (with LocalStorage automatic fallback)
    async function fetchBackendData() {
      try {
        const loadedProducts = await getProducts();
        setProducts(loadedProducts);
      } catch (err) {
        console.error('Failed to load products from Supabase startup:', err);
      }

      try {
        const loadedOrders = await getOrders();
        setOrders(loadedOrders);
      } catch (err) {
        console.error('Failed to load orders from Supabase startup:', err);
      }
    }
    fetchBackendData();
  }, []);

  // Supabase Realtime subscription for orders
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      console.log('Subscribing to Supabase Realtime for orders...');
      const channel = supabase
        .channel('public-orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'orders',
          },
          (payload) => {
            console.log('Realtime change received for orders:', payload);
            const eventType = payload.eventType;

            if (eventType === 'INSERT') {
              const newOrder = mapOrderRow(payload.new);
              setOrders((prev) => {
                if (prev.some((o) => o.id === newOrder.id)) return prev;
                // Dispatch custom event for real-time notification audio & alerts
                window.dispatchEvent(new CustomEvent('supabase_new_order', { detail: newOrder }));
                return [newOrder, ...prev];
              });
            } else if (eventType === 'UPDATE') {
              const updatedOrder = mapOrderRow(payload.new);
              setOrders((prev) =>
                prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
              );
            } else if (eventType === 'DELETE') {
              const deletedId = payload.old?.id;
              if (deletedId) {
                setOrders((prev) => prev.filter((o) => o.id !== deletedId));
              }
            }
          }
        )
        .subscribe((status) => {
          console.log(`Supabase Realtime orders subscription status: ${status}`);
        });

      return () => {
        console.log('Unsubscribing from Supabase Realtime for orders...');
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleUpdateCategoryNames = (names: { nitro: string; boosts: string; effects: string; users_premium?: string; creations_custom?: string; old_accounts?: string }) => {
    setCategoryNames(names as any);
    localStorage.setItem('doo_store_category_names', JSON.stringify(names));
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
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
        const order = customEvent.detail;
        
        // 1. Show live notification on screen
        setLiveNotification({
          name: order.customerName,
          action: `أتم عملية دفع ناجحة لخدمات بقيمة ${order.total} ريال وبانتظار موافقة الإدارة! ⏳🛍️`,
          time: 'الآن'
        });
        setTimeout(() => {
          setLiveNotification(null);
        }, 8000);

        // 2. Generate Automated Email Alert to Manager
        const savedEmails = localStorage.getItem('doo_sent_emails');
        const currentEmails = savedEmails ? JSON.parse(savedEmails) : [];
        const itemsText = order.items.map(item => `${item.product.nameAr} (الكمية: ${item.quantity})`).join('، ');
        const currentAdminEmail = localStorage.getItem('doo_admin_email') || 'ahmed.amk208@gmail.com';
        
        const emailContent = `مرحباً مدير متجر Doo، هناك طلب جديد في المتجر قيد الانتظار بانتظار موافقتك وتفعيلك:
• رقم الطلب: ${order.id}
• اسم العميل: ${order.customerName}
• البريد الإلكتروني: ${order.email}
• حساب الديسكورد: ${order.discordUsername}
• المنتجات المطلوبة: ${itemsText}
• المبلغ الإجمالي: ${order.total} ريال سعودي
• طريقة الدفع: ${order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي (إيصال مرفق)' : order.paymentMethod}
• حالة الدفع: قيد التحقق (يرجى مراجعة إيصال التحويل المرفق)

تم إرسال هذا التنبيه التلقائي إلى بريدك الإلكتروني لتسريع الاستجابة وتفعيل الخدمة للعميل فوراً.`;

        const newEmailLog = {
          id: `EML-${Math.floor(100000 + Math.random() * 900000)}`,
          recipient: currentAdminEmail,
          subject: `🚨 طلب جديد بالانتظار رقم #${order.id} - متجر Doo`,
          body: emailContent,
          status: 'success',
          date: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };

        localStorage.setItem('doo_sent_emails', JSON.stringify([newEmailLog, ...currentEmails]));
        
        // Reload orders state to capture the newly created order instantly from Supabase
        getOrders().then((loadedOrders) => {
          setOrders(loadedOrders);
        }).catch((err) => {
          console.error("Failed to load orders after placement:", err);
          // Fallback to prepending if fetching fails
          setOrders((prev) => {
            if (!prev.some((o) => o.id === order.id)) {
              return [order, ...prev];
            }
            return prev;
          });
        });

        // Show a beautiful toast confirming email alert dispatch
        addToast(`📧 تم إرسال تنبيه بريد آلي للمدير (${currentAdminEmail}) بنجاح لتسريع التفعيل!`);
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
    supporterName?: string,
    customImage?: string
  ) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedOption === selectedOption &&
        item.serverLink === serverLink &&
        item.supporterName === supporterName &&
        item.customImage === customImage
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [
        ...cartItems,
        { product, quantity, selectedOption, serverLink, supporterName, customImage },
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
  const handleCreateProduct = async (p: Product) => {
    const updated = [...products, p];
    setProducts(updated);
    await createProductInDb(p);
  };

  const handleDeleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    await deleteProductFromDb(id);
  };

  const handleUpdateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    setProducts(updated);
    await updateProductInDb(id, updatedFields);
  };

  const handlePurchaseProduct = (id: string) => {
    handleUpdateProduct(id, { stock: 0 });
  };

  const handleUpdateProductPrice = (id: string, price: number) => {
    handleUpdateProduct(id, { price });
  };

  const handleUpdateProductStock = (id: string, stock: number) => {
    handleUpdateProduct(id, { stock });
  };

  const handleUpdateProductImage = (id: string, image: string) => {
    handleUpdateProduct(id, { image });
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
      (p.nameAr || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (p.descriptionAr || '').toLowerCase().includes((searchQuery || '').toLowerCase());
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
            orders={orders}
            onUpdateOrders={handleUpdateOrders}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateProductImage={handleUpdateProductImage}
            onUpdateProduct={handleUpdateProduct}
            onCreateProduct={handleCreateProduct}
            onDeleteProduct={handleDeleteProduct}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    {/* Category 4: Premium Usernames */}
                    <motion.div
                      onClick={() => handleNavigate('users_premium')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'users_premium')?.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                          alt={categoryNames.users_premium}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.users_premium}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">يوزرات وحسابات ديسكورد ثلاثية ورباعية مميزة جداً وشبه خماسية.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">حسب الطلب 💬</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Category 5: Creations */}
                    <motion.div
                      onClick={() => handleNavigate('creations_custom')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'creations_custom')?.image || 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80'}
                          alt={categoryNames.creations_custom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.creations_custom}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">برمجة بوتات مخصصة، تصميم سيرفرات احترافية متكاملة، والمزيد.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">حسب الطلب 💬</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Category 6: Old Accounts */}
                    <motion.div
                      onClick={() => handleNavigate('old_accounts')}
                      className="group cursor-pointer rounded-3xl bg-discord-darker/60 border border-white/5 hover:border-discord-purple/40 overflow-hidden shadow-xl transition-all relative flex flex-col justify-between"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-discord-black">
                        <div className="absolute inset-0 bg-gradient-to-t from-discord-black via-transparent to-transparent z-10"></div>
                        <img
                          src={products.find(p => p.category === 'old_accounts')?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'}
                          alt={categoryNames.old_accounts}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-4 relative z-20 text-right">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white group-hover:text-discord-purple transition-colors">{categoryNames.old_accounts}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">امتلك حسابات ديسكورد قديمة من سنوات 2015-2020 بضمان كامل.</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[11px] text-discord-purple font-black">تصفح المنتجات ←</span>
                          <span className="text-xs font-bold text-gray-500">تسليم فوري ومضمون ⚡</span>
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

            {/* VIEW 4.1: PREMIUM USERNAMES VIEW */}
            {currentView === 'users_premium' && (
              <motion.div
                key="users-premium-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <div className="max-w-7xl mx-auto px-4 space-y-12 text-right">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">يوزرات وحسابات ديسكورد مميزة</h1>
                    <p className="text-xs text-gray-400">تصفح واقتنِ أفخم اليوزرات النادرة والثنائية والرباعية المتوفرة حسب طلبك.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.filter(p => p.category === 'users_premium' && p.stock > 0).length === 0 ? (
                      <div className="col-span-full text-center p-12 bg-discord-dark rounded-2xl border border-white/5 text-gray-400">
                        <AlertCircle className="w-8 h-8 text-discord-purple mx-auto mb-2" />
                        <p className="text-xs">لا يوجد يوزرات معروضة حالياً. يمكنك إضافتها من لوحة الإدارة.</p>
                      </div>
                    ) : (
                      products.filter(p => p.category === 'users_premium' && p.stock > 0).map((uProd) => (
                        <div
                          key={uProd.id}
                          className="p-6 rounded-3xl bg-discord-dark border border-white/5 hover:border-discord-purple/20 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <div className="aspect-video rounded-xl overflow-hidden bg-discord-black border border-white/5">
                              <img
                                src={uProd.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                                alt={uProd.nameAr}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="space-y-2">
                              <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-discord-purple bg-discord-purple/10 rounded">يوزر مميز 🔥</span>
                              <h3 className="font-extrabold text-base text-white">{uProd.nameAr}</h3>
                              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{uProd.descriptionAr}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                            <span className="text-discord-fuchsia font-extrabold text-sm">
                              {uProd.priceOnRequest ? 'السعر حسب الطلب 💬' : `${uProd.price} ريال`}
                            </span>
                            <button
                              onClick={() => handleNavigate('product_details', uProd)}
                              className="px-4 py-2 bg-discord-purple hover:bg-[#4752c4] text-white text-[11px] font-bold rounded-xl cursor-pointer transition-all"
                            >
                              تفاصيل وحجز اليوزر
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4.2: CUSTOM CREATIONS VIEW */}
            {currentView === 'creations_custom' && (
              <motion.div
                key="creations-custom-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <div className="max-w-7xl mx-auto px-4 space-y-12 text-right">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">إنشاءات وتصميم ديسكورد احترافي</h1>
                    <p className="text-xs text-gray-400">برمجة بوتات مخصصة متكاملة، تصميم سيرفرات من الصفر، وتصميم لوجوهات وبنرات بجودة أسطورية.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.filter(p => p.category === 'creations_custom').map((cProd) => (
                      <div
                        key={cProd.id}
                        className="p-6 rounded-3xl bg-discord-dark border border-white/5 hover:border-discord-purple/20 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="aspect-video rounded-xl overflow-hidden bg-discord-black border border-white/5">
                            <img
                              src={cProd.image || 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80'}
                              alt={cProd.nameAr}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-discord-fuchsia bg-discord-fuchsia/10 rounded">إنشاء احترافي 🛠️</span>
                            <h3 className="font-extrabold text-base text-white">{cProd.nameAr}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{cProd.descriptionAr}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <span className="text-discord-fuchsia font-extrabold text-sm">
                            {cProd.priceOnRequest ? 'السعر حسب الطلب 💬' : `${cProd.price} ريال`}
                          </span>
                          <button
                            onClick={() => handleNavigate('product_details', cProd)}
                            className="px-4 py-2 bg-discord-purple hover:bg-[#4752c4] text-white text-[11px] font-bold rounded-xl cursor-pointer transition-all"
                          >
                            طلب الخدمة ومناقشتها
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4.3: OLD ACCOUNTS CREATIONS VIEW */}
            {currentView === 'old_accounts' && (
              <motion.div
                key="old-accounts-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12"
              >
                <div className="max-w-7xl mx-auto px-4 space-y-12 text-right">
                  <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-white font-display">إنشاءات حسابات ديسكورد قديمة</h1>
                    <p className="text-xs text-gray-400">احصل على حساب ديسكورد نادر وتاريخ إنشاء قديم يمنحك ثقة كاملة ومصداقية فورية في المنصة.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {products.filter(p => p.category === 'old_accounts').map((cProd) => (
                      <div
                        key={cProd.id}
                        className="p-6 rounded-3xl bg-discord-dark border border-white/5 hover:border-discord-purple/20 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="aspect-video rounded-xl overflow-hidden bg-discord-black border border-white/5 relative">
                            <img
                              src={cProd.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'}
                              alt={cProd.nameAr}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 right-2 bg-discord-purple text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">شعبية فائقة 🔥</div>
                          </div>
                          <div className="space-y-2">
                            <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-discord-fuchsia bg-discord-fuchsia/10 rounded">حسابات قديمة ⏱️</span>
                            <h3 className="font-extrabold text-base text-white">{cProd.nameAr}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{cProd.descriptionAr}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] line-through font-sans">10 ريال</span>
                            <span className="text-discord-green font-black text-sm">
                              يبدأ من 4 ريال ⚡
                            </span>
                          </div>
                          <button
                            onClick={() => handleNavigate('product_details', cProd)}
                            className="px-4 py-2 bg-discord-purple hover:bg-[#4752c4] text-white text-[11px] font-bold rounded-xl cursor-pointer transition-all"
                          >
                            عرض الخيارات والتعديل
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW 4.4: MY ORDERS STATUS LOOKUP */}
            {currentView === 'my_orders' && (
              <motion.div
                key="my-orders-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-12 max-w-2xl mx-auto px-4 space-y-10 text-right font-sans"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex w-12 h-12 rounded-full bg-discord-purple/10 border border-discord-purple/20 items-center justify-center text-discord-purple mb-2">
                    <ShoppingCart className="w-6 h-6 animate-bounce text-discord-purple" />
                  </div>
                  <h1 className="text-3xl font-black text-white font-display">تتبع حالة طلباتك 📦</h1>
                  <p className="text-xs text-gray-400">تابع تحديثات وإشعارات طلباتك لحظة بلحظة واستخرج فواتير الدفع المعتمدة.</p>
                </div>

                {/* Tracking Method Tabs */}
                <div className="flex bg-[#1e1f22] p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setTrackingTab('direct_id')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      trackingTab === 'direct_id'
                        ? 'bg-discord-purple text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    تتبع فوري برقم الطلب ⚡
                  </button>
                  <button
                    onClick={() => setTrackingTab('general')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      trackingTab === 'general'
                        ? 'bg-discord-purple text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    البحث العام بالبريد أو ديسكورد 🔍
                  </button>
                </div>

                {/* Tab Content */}
                {trackingTab === 'direct_id' ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-discord-dark border border-white/5 space-y-4 shadow-xl">
                      <h3 className="font-bold text-sm text-white">أدخل رقم طلبك للتتبع الفوري والمباشر:</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="مثال: DOO-12345"
                          value={directOrderIdQuery}
                          onChange={(e) => setDirectOrderIdQuery(e.target.value)}
                          className="flex-grow bg-discord-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-discord-purple text-center font-bold font-mono"
                          dir="ltr"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        * يرجى إدخال كود الطلب بالكامل للحصول على التفاصيل اللحظية، وتنبيهات المدير الخاصة بطلبك وتاريخ التسليم.
                      </p>
                    </div>

                    {/* Direct Tracking Result */}
                    {(() => {
                      if (!directOrderIdQuery.trim()) return null;
                      const targetOrder = orders.find(o => o.id.trim().toUpperCase() === directOrderIdQuery.trim().toUpperCase());

                      if (!targetOrder) {
                        return (
                          <div className="text-center py-12 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2">
                            <AlertCircle className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
                            <h4 className="font-bold text-red-400 text-sm">عذراً، لم نجد طلب بهذا الرقم!</h4>
                            <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed">
                              تأكد من كتابة رمز الطلب بشكل صحيح ومطابق تماماً للرمز الذي ظهر لك بعد الدفع (مثال: DOO-XXXXX).
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-discord-dark border border-white/10 p-6 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
                          {/* Stepper Wizard Flow */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                              <span className="text-xs font-black text-gray-400">تحديث حالة الطلب اللحظي:</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                                targetOrder.status === 'completed'
                                  ? 'bg-discord-green/20 text-discord-green border border-discord-green/30'
                                  : targetOrder.status === 'processing'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : targetOrder.status === 'pending'
                                  ? 'bg-discord-yellow/20 text-discord-yellow border border-discord-yellow/30 animate-pulse'
                                  : 'bg-red-500/20 text-red-500 border border-red-500/30'
                              }`}>
                                {targetOrder.status === 'completed' && 'مكتمل ومفعل بنجاح ✅'}
                                {targetOrder.status === 'processing' && 'جاري العمل والتجهيز ⚙️'}
                                {targetOrder.status === 'pending' && 'قيد الانتظار للمراجعة ⏳'}
                                {targetOrder.status === 'failed' && 'ملغي أو مرفوض ❌'}
                              </span>
                            </div>

                            {/* Custom Responsive Progress Steps */}
                            <div className="grid grid-cols-4 gap-2 text-center pt-2 relative">
                              <div className="space-y-2">
                                <div className="w-8 h-8 rounded-full bg-discord-green text-white mx-auto flex items-center justify-center font-bold text-xs shadow-lg shadow-discord-green/20">1</div>
                                <p className="text-[10px] font-black text-white">تقديم الطلب</p>
                              </div>

                              <div className="space-y-2">
                                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                                  targetOrder.status !== 'pending' ? 'bg-discord-green text-white shadow-lg' : 'bg-discord-yellow text-discord-black animate-pulse font-black'
                                }`}>2</div>
                                <p className="text-[10px] font-black text-white">مراجعة الدفع</p>
                              </div>

                              <div className="space-y-2">
                                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
                                  targetOrder.status === 'completed' 
                                    ? 'bg-discord-green text-white shadow-lg' 
                                    : targetOrder.status === 'processing'
                                    ? 'bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/20'
                                    : 'bg-discord-black border border-white/10 text-gray-500'
                                }`}>3</div>
                                <p className="text-[10px] font-black text-white">تفعيل الخدمة</p>
                              </div>

                              <div className="space-y-2">
                                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                                  targetOrder.status === 'completed' 
                                    ? 'bg-discord-green text-white shadow-lg' 
                                    : targetOrder.status === 'failed'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-discord-black border border-white/10 text-gray-500'
                                }`}>4</div>
                                <p className="text-[10px] font-black text-white">اكتمال وتسليم</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Notifications & Alerts */}
                          <div className="space-y-3 bg-[#1e1f22] p-4 rounded-2xl border border-white/5">
                            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
                              <Bell className="w-4 h-4 text-discord-fuchsia animate-bounce shrink-0" />
                              <span>إشعارات وتنبيهات الإدارة الفورية لطلبك 📣</span>
                            </h4>
                            {targetOrder.alerts && targetOrder.alerts.length > 0 ? (
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {targetOrder.alerts.map((alert, idx) => (
                                  <div key={idx} className="p-3 rounded-xl bg-discord-black border border-discord-purple/20 space-y-1">
                                    <p className="text-xs font-bold text-white leading-relaxed">{alert.message}</p>
                                    <span className="text-[9px] text-gray-500 font-mono block text-left">{alert.timestamp}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-gray-400 py-2">
                                {targetOrder.status === 'pending'
                                  ? 'طلبك الآن في مرحلة المراجعة والتحقق، سنقوم بإرسال إشعارات وتحديثات فورية لك هنا بمجرد مراجعته! ⏳'
                                  : 'طلبك قيد التفعيل حالياً، وسنقوم بإعلامك بالتفاصيل فوراً.'}
                              </p>
                            )}
                          </div>

                          {/* Order Details summary */}
                          <div className="space-y-3 bg-discord-black/50 p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">رقم التعريفي الفريد:</span>
                              <span className="font-mono font-bold text-white">{targetOrder.id}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">تاريخ ووقت تقديم الطلب:</span>
                              <span className="font-mono text-gray-300">{targetOrder.date}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">العميل صاحب الطلب:</span>
                              <span className="font-bold text-discord-purple">{targetOrder.customerName} (@{targetOrder.discordUsername})</span>
                            </div>

                            {/* Products bought */}
                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                              {targetOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs bg-discord-black p-2 rounded-lg border border-white/5">
                                  <span>{item.product.nameAr}</span>
                                  <span className="font-sans font-bold text-discord-purple bg-discord-purple/10 px-2 py-0.5 rounded">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                              <span className="text-gray-400">إجمالي السداد:</span>
                              <span className="font-black text-discord-green text-sm">{targetOrder.total} ريال سعودي</span>
                            </div>
                          </div>

                          {/* Action button to print receipt */}
                          <button
                            onClick={() => setViewingReceiptOrder(targetOrder)}
                            className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg glow-purple"
                          >
                            <span>عرض وطباعة إيصال السداد وفاتورة الطلب المعتمدة 🧾</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* General lookup input */
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-discord-dark border border-white/5 space-y-4 shadow-xl">
                      <h3 className="font-bold text-sm text-white">ابحث عن طلباتك بالمتجر:</h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="أدخل بريدك الإلكتروني، حساب ديسكورد، أو رقم الطلب (DOO-...)"
                          value={myOrdersQuery}
                          onChange={(e) => setMyOrdersQuery(e.target.value)}
                          className="flex-grow bg-discord-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-discord-purple text-right font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">تلميح: سيتم فلترة وعرض كافة طلباتك تلقائياً وبشكل فوري بمجرد كتابة بريدك أو يوزرك.</p>
                    </div>

                    {/* Search Results Display */}
                    <div className="space-y-4">
                      {(() => {
                        const query = myOrdersQuery.trim().toLowerCase();

                        let filtered = orders;
                        let showInfoMsg = false;

                        if (query) {
                          filtered = orders.filter(o => 
                            o.id.toLowerCase().includes(query) ||
                            (o.email || '').toLowerCase().includes(query) ||
                            (o.discordUsername || '').toLowerCase().includes(query) ||
                            (o.customerName || '').toLowerCase().includes(query)
                          );
                        } else {
                          // Try to autoload from current logged-in user
                          const savedUserStr = localStorage.getItem('doo_current_user');
                          if (savedUserStr) {
                            const user = JSON.parse(savedUserStr);
                            const userEmail = (user.email || '').toLowerCase();
                            const userDiscord = (user.discordId || '').toLowerCase();
                            const userName = (user.username || '').toLowerCase();
                            filtered = orders.filter(o => 
                              (o.email && o.email.toLowerCase() === userEmail) ||
                              (o.discordUsername && o.discordUsername.toLowerCase() === userDiscord) ||
                              (o.customerName && o.customerName.toLowerCase() === userName)
                            );
                            showInfoMsg = true;
                          } else {
                            filtered = [];
                          }
                        }

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-12 bg-discord-dark/20 border border-white/5 rounded-2xl space-y-3">
                              <ShoppingCart className="w-10 h-10 text-gray-600 mx-auto animate-pulse" />
                              <h4 className="font-bold text-gray-400 text-sm">لم نجد أي طلبات مطابقة!</h4>
                              <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                                {query ? 'تأكد من إدخال بريدك الإلكتروني أو حساب ديسكورد بشكل صحيح كما كتبته في نموذج الدفع.' : 'اكتب بريدك أو حساب ديسكورد بالبحث في الأعلى للاستعلام الفوري.'}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {showInfoMsg && (
                              <div className="p-3 bg-discord-purple/10 border border-discord-purple/20 text-discord-purple rounded-xl text-xs font-semibold text-center">
                                👤 تم تحميل الطلبات المرتبطة بحسابك الحالي تلقائياً.
                              </div>
                            )}
                            <h3 className="font-extrabold text-sm text-white">الطلبات التي تم العثور عليها ({filtered.length}):</h3>
                            <div className="space-y-4">
                              {filtered.map((order) => (
                                <div 
                                  key={order.id} 
                                  className="bg-discord-dark border border-white/5 hover:border-white/10 p-5 rounded-2xl text-right space-y-4 transition-all"
                                >
                                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                                    <div className="space-y-1">
                                      <span className="text-xs font-black text-white font-mono">{order.id}</span>
                                      <span className="text-[10px] text-gray-500 block">{order.date}</span>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                      order.status === 'completed' 
                                        ? 'bg-discord-green/10 text-discord-green border border-discord-green/20' 
                                        : order.status === 'pending'
                                          ? 'bg-discord-yellow/10 text-discord-yellow border border-discord-yellow/20'
                                          : order.status === 'processing'
                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                      {order.status === 'completed' && 'تم التفعيل والتسليم بنجاح ✅'}
                                      {order.status === 'pending' && 'قيد الانتظار للتحقق والمراجعة ⏳'}
                                      {order.status === 'processing' && 'جاري العمل والتنفيذ حالياً ⚙️'}
                                      {order.status === 'failed' && 'مرفوض أو ملغي ❌'}
                                    </span>
                                  </div>

                                  {/* Items in order */}
                                  <div className="space-y-2 text-xs text-gray-300">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between items-center bg-[#1e1f22] p-3 rounded-xl border border-white/5">
                                        <div className="space-y-1">
                                          <p className="font-bold text-white">{item.product.nameAr}</p>
                                          {item.selectedOption && (
                                            <p className="text-[10px] text-discord-purple font-medium font-sans">{item.selectedOption}</p>
                                          )}
                                        </div>
                                        <span className="font-bold text-discord-purple bg-discord-purple/10 px-2.5 py-0.5 rounded-full text-[10px] font-sans">الكمية: {item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between text-xs pt-2">
                                    <span className="text-gray-400">طريقة الدفع: <span className="font-bold text-white font-sans">{
                                      order.paymentMethod === 'apple_pay' ? 'Apple Pay' :
                                      order.paymentMethod === 'stc_pay' ? 'STC Pay' :
                                      order.paymentMethod === 'credit_card' ? 'بطاقة مدى/ائتمان' : 'تحويل بنكي'
                                    }</span></span>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() => setViewingReceiptOrder(order)}
                                        className="px-3 py-1 bg-discord-purple/20 hover:bg-discord-purple text-discord-purple hover:text-white rounded text-[10px] font-black cursor-pointer transition-all"
                                      >
                                        فاتورة 🧾
                                      </button>
                                      <span className="text-discord-green font-black text-sm font-sans">{order.total} ريال سعودي</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
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
                onPurchaseProduct={handlePurchaseProduct}
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

      {viewingReceiptOrder && (
        <OrderReceipt
          order={viewingReceiptOrder}
          onClose={() => setViewingReceiptOrder(null)}
        />
      )}

    </div>
  );
}
