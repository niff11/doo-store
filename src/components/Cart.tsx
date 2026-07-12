import React, { useState } from 'react';
import { ShoppingCart, Trash2, ShieldCheck, Check, CreditCard, Landmark, Phone, ArrowLeft, Loader2, Sparkles, CheckCircle2, Copy, AlertCircle, FileText, Camera, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product, Order } from '../types';
import { PRODUCTS } from '../data';
import { saveOrder, uploadProductImage } from '../lib/supabase';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigate: (view: string, selectedProd?: Product) => void;
  addToast: (message: string) => void;
  onPurchaseProduct?: (productId: string) => void;
}

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onNavigate, addToast, onPurchaseProduct }: CartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'cart' | 'checkout' | 'processing' | 'success'>('cart');
  
  // Checkout Form States
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('bank_transfer');
  
  // Details depending on Payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [stcNumber, setStcNumber] = useState('');
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Success States
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05); // 5% simulated processing/support fee
  const total = subtotal + tax;

  // Recommendations "قد يعجبك أيضاً"
  const recommendedProducts = PRODUCTS.filter(p => !cartItems.some(item => item.product.id === p.id));

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setPaymentStep('checkout');
  };

  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const handleUploadReceiptSimulated = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptName(file.name);
      setIsUploadingReceipt(true);
      
      try {
        const { isSupabaseConfigured } = await import('../lib/supabase');
        if (isSupabaseConfigured) {
          addToast('⏳ جاري رفع صورة الإيصال تلقائياً لضمان ثباتها على سيرفراتنا...');
          const publicUrl = await uploadProductImage(file);
          setReceiptDataUrl(publicUrl);
          addToast('✅ تم رفع وتخزين إيصال التحويل بنجاح! 📄');
          setIsUploadingReceipt(false);
          return;
        }
      } catch (err: any) {
        console.warn('Failed to upload receipt to Supabase storage, using base64 fallback:', err);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptDataUrl(reader.result as string);
        addToast('تم تحميل إيصال التحويل البنكي محلياً بنجاح! 📄');
        setIsUploadingReceipt(false);
      };
      reader.onerror = () => {
        addToast('❌ فشل قراءة ملف الإيصال.');
        setIsUploadingReceipt(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeOrderFinalization = () => {
    setShowWarningModal(false);
    setPaymentStep('processing');

    // Simulate 3 seconds secure processing
    setTimeout(async () => {
      // Create Order as Pending for Admin Approval
      const newOrder: Order = {
        id: `DOO-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        email,
        discordUsername,
        items: [...cartItems],
        total,
        paymentMethod,
        paymentDetails: {
          receiptUrl: receiptDataUrl || undefined,
          referenceNumber: referenceNumber || undefined,
        },
        status: 'pending', // Set to pending to require manual approval
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toLocaleString('ar-EG', { hour12: true }), // Automatic date & time timestamp
        trackingCode: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        alerts: []
      };

      // Save Order to history (both Supabase & local storage fallback)
      const isSaved = await saveOrder(newOrder);

      if (!isSaved) {
        addToast('❌ عذراً، حدث خطأ أثناء حفظ طلبك في قاعدة البيانات. يرجى المحاولة مرة أخرى!');
        setPaymentStep('cart');
        return;
      }

      // Generate simulation Activation Codes (e.g. Nitro code link or Bot invite URL)
      const codes = cartItems.map((item) => {
        if (item.product.category === 'nitro') {
          return `https://discord.gift/${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
        } else if (item.product.category === 'boosts') {
          return `https://discord.gg/h7a46w6bh3?service=boost&order=${newOrder.id}`;
        } else {
          return `https://doo.store/activation/effects-${newOrder.id}`;
        }
      });

      // Trigger removal for purchased premium usernames
      cartItems.forEach((item) => {
        if (item.product.category === 'users_premium' && onPurchaseProduct) {
          onPurchaseProduct(item.product.id);
        }
      });

      setGeneratedCodes(codes);
      setCreatedOrder(newOrder);
      setPaymentStep('success');
      onClearCart(); // empty cart
      addToast('⏳ تم إرسال طلبك بنجاح وهو الآن بانتظار موافقة الإدارة وتفعيل الخدمة!');
      
      // Emit trigger for order state notification
      window.dispatchEvent(new CustomEvent('new_order_placed', { detail: newOrder }));
    }, 3000);
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !discordUsername.trim()) {
      addToast('الرجاء إدخال كامل البيانات للتسليم! ⚠️');
      return;
    }

    if (paymentMethod === 'bank_transfer' && !receiptName) {
      addToast('⚠️ يجب تصوير الايصال و وضعه هنا لإتمام الطلب!');
      return;
    }

    // Always show receipt warning before completing payment
    if (paymentMethod === 'bank_transfer') {
      setShowWarningModal(true);
    } else {
      executeOrderFinalization();
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast('تم نسخ كود التفعيل بنجاح! 📋');
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto font-sans" dir="rtl" id="cart-page-wrapper">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: CART LIST */}
        {paymentStep === 'cart' && (
          <motion.div
            key="cart-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <ShoppingCart className="w-8 h-8 text-discord-purple" />
              <h1 className="text-2xl md:text-3xl font-black text-white font-display">سلة المشتريات</h1>
              <span className="text-xs bg-discord-purple/20 text-discord-purple border border-discord-purple/30 px-3 py-1 rounded-full font-bold">
                {cartItems.length} منتجات
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 bg-discord-dark/30 border border-white/5 rounded-3xl space-y-4">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-gray-400">سلتك فارغة حالياً!</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  تصفح فئات المنتجات في الصفحة الرئيسية لإضافة ديسكورد نيترو بسعر ١٩ ريال أو بوستات ديسكورد لسيرفرك!
                </p>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-6 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-xs font-bold text-white rounded-xl transition-all cursor-pointer inline-block"
                >
                  العودة للتسوق
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-5 rounded-2xl bg-discord-darker/70 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-discord-purple/20 transition-all"
                    >
                      <div className="flex items-center gap-4 text-right w-full sm:w-auto">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.nameAr}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-discord-dark"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-discord-purple/20 to-discord-fuchsia/20 border border-discord-purple/30 flex items-center justify-center shrink-0">
                            <Sparkles className="w-8 h-8 text-discord-fuchsia" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-extrabold text-sm md:text-base text-white">{item.product.nameAr}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">ضمان فوري 100%</p>
                          <p className="text-discord-fuchsia font-bold text-xs mt-1">
                            {item.product.priceOnRequest ? 'السعر حسب الطلب' : `${item.product.price} ريال سعودي`}
                          </p>
                          {item.product.category === 'boosts' && (
                            <div className="mt-2 space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px] text-gray-300">
                              <p>⚡ <span className="font-bold text-discord-purple">عدد البوستات:</span> {item.quantity} بوست</p>
                              {item.selectedOption && (
                                <p>📅 <span className="font-bold text-discord-purple">مدة البوست:</span> {item.selectedOption === '1 month' ? 'شهر كامل (ضمان 30 يوم)' : '3 أشهر (ضمان 90 يوم)'}</p>
                              )}
                              {item.serverLink && (
                                <p>🔗 <span className="font-bold text-discord-purple">رابط السيرفر:</span> <span className="font-mono text-gray-400" dir="ltr">{item.serverLink}</span></p>
                              )}
                              {item.supporterName && (
                                <p>👤 <span className="font-bold text-discord-purple">اسم الداعم:</span> {item.supporterName}</p>
                              )}
                            </div>
                          )}

                          {item.product.category === 'effects' && (
                            <div className="mt-2 space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px] text-gray-300">
                              {item.selectedOption && (
                                <p>🎁 <span className="font-bold text-discord-purple">الباقة المختارة:</span> {item.selectedOption}</p>
                              )}
                              {item.supporterName && (
                                <p>👤 <span className="font-bold text-discord-purple">اسم الحساب (Username):</span> {item.supporterName}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                        <div className="flex items-center gap-2 bg-discord-dark px-3 py-1.5 rounded-xl border border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white px-1.5 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-white px-2">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white px-1.5 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Panel */}
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4 shadow-xl">
                    <h3 className="font-bold text-white text-base border-b border-white/5 pb-3">ملخص الطلب</h3>
                    
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-gray-400">
                        <span>المجموع الفرعي:</span>
                        <span className="font-semibold text-white">{subtotal} ريال</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>رسوم البوابة والدعم التلقائي (5%):</span>
                        <span className="font-semibold text-white">{tax} ريال</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-extrabold border-t border-white/5 pt-3 text-white">
                        <span>المجموع النهائي:</span>
                        <span className="text-discord-fuchsia text-base">{total} ريال سعودي</span>
                      </div>
                    </div>

                    <div className="bg-discord-purple/10 border border-discord-purple/20 p-3 rounded-xl flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-discord-fuchsia shrink-0 mt-0.5" />
                      <p className="text-[10px] text-gray-300 leading-relaxed">
                        دفع سريع وآمن ومشفر 100%. يتم توليد وتسليم الأكواد والخدمات تلقائياً ومباشرة بعد الدفع.
                      </p>
                    </div>

                    <button
                      onClick={handleStartCheckout}
                      className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-103 active:scale-97 text-center"
                    >
                      إتمام عملية الشراء والدفع التلقائي
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Products: "قد يعجبك أيضاً" */}
            {recommendedProducts.length > 0 && (
              <div className="mt-16 pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-discord-fuchsia animate-pulse" />
                  قد يعجبك أيضاً بالمتجر
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recommendedProducts.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-[#1e1f22]/40 border border-white/5 flex flex-col justify-between hover:border-discord-purple/20 transition-all text-right"
                    >
                      <div>
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.nameAr}
                            className="w-full h-32 rounded-xl object-cover mb-3"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-32 rounded-xl bg-gradient-to-tr from-discord-purple/10 to-discord-fuchsia/10 border border-discord-purple/20 flex items-center justify-center mb-3">
                            <Sparkles className="w-8 h-8 text-discord-fuchsia" />
                          </div>
                        )}
                        <h4 className="font-extrabold text-xs text-white">{prod.nameAr}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-1">{prod.descriptionAr}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-discord-fuchsia font-extrabold text-xs">
                          {prod.priceOnRequest ? 'حسب الطلب' : `${prod.price} ريال`}
                        </span>
                        <button
                          onClick={() => onNavigate('product_details', prod)}
                          className="px-3 py-1.5 bg-discord-dark hover:bg-discord-purple text-[10px] font-bold text-white rounded-lg transition-all cursor-pointer"
                        >
                          عرض وتفاصيل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: CHECKOUT & AUTOMATED PAYMENT GATEWAY */}
        {paymentStep === 'checkout' && (
          <motion.div
            key="checkout-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto text-right"
          >
            <button
              onClick={() => setPaymentStep('cart')}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transform rotate-180" />
              <span>العودة إلى السلة</span>
            </button>

            <div className="bg-[#1e1f22]/80 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-extrabold text-white">إتمام الطلب والدفع الآمن المشفر</h2>
                <p className="text-xs text-gray-400 mt-1">الرجاء إدخال بياناتك بدقة لضمان دقة التسليم والترقية الفورية للتطبيق.</p>
              </div>

              <form onSubmit={handleProcessOrder} className="space-y-6 text-xs md:text-sm">
                
                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-discord-purple text-xs sm:text-sm border-r-4 border-discord-purple pr-2">1. معلومات حساب المستلم</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-medium">الاسم الكامل لطلبك:</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: خالد الشهري"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple text-xs text-right"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-gray-300 font-medium">البريد الإلكتروني للتسليم:</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="مثال: test@gmail.com"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple text-xs text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-gray-300 font-medium">اسم مستخدم ديسكورد (Discord Username) لإرسال الترقية:</label>
                    <input
                      type="text"
                      required
                      value={discordUsername}
                      onChange={(e) => setDiscordUsername(e.target.value)}
                      placeholder="مثال: user_9999 أو (940y)"
                      className="w-full bg-discord-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple text-xs text-left"
                      dir="ltr"
                    />
                    <p className="text-[10px] text-discord-yellow">⚠️ تأكد من كتابته بشكل صحيح دون أخطاء لتلقي الخدمة تلقائياً.</p>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="font-bold text-discord-purple text-xs sm:text-sm border-r-4 border-discord-purple pr-2">2. اختر طريقة الدفع المفضل لديك</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled
                      className="p-3 rounded-xl border border-white/5 bg-discord-dark/10 text-gray-500 cursor-not-allowed flex flex-col items-center justify-center gap-1.5 opacity-50 relative overflow-hidden"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-[11px] font-bold">Apple Pay</span>
                      <span className="absolute top-1 right-1 bg-discord-purple text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">soon!</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'bg-discord-purple/20 border-discord-purple text-white glow-purple'
                          : 'bg-discord-dark/40 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Landmark className="w-5 h-5 text-discord-fuchsia" />
                      <span className="text-[11px] font-bold">تحويل بنكي 🏦</span>
                    </button>
                  </div>

                  {/* Payment Forms depending on selections */}
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 mt-3">
                    
                    {/* BANK TRANSFER */}
                    {paymentMethod === 'bank_transfer' && (
                      <div className="space-y-4 text-xs">
                        <div className="p-4 bg-discord-dark border border-white/10 rounded-xl space-y-3">
                          <p className="font-extrabold text-white text-[11px] text-discord-purple">حساب متجر Doo المعتمد:</p>
                          <div className="space-y-3">
                            <p className="text-gray-300 font-bold flex items-center gap-1.5">
                              <span>🏦 مصرف الراجحي</span>
                            </p>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
                                <div className="text-right">
                                  <span className="text-gray-400 block text-[10px]">رقم الحساب:</span>
                                  <span className="text-white font-mono text-xs select-all">355000010006088521493</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText('355000010006088521493');
                                    addToast('تم نسخ رقم الحساب بنجاح! 📋');
                                  }}
                                  className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                                  title="نسخ رقم الحساب"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
                                <div className="text-right">
                                  <span className="text-gray-400 block text-[10px]">الآيبان (IBAN):</span>
                                  <span className="text-white font-mono text-xs select-all">SA33 8000 0355 6080 1852 1493</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText('SA33 8000 0355 6080 1852 1493');
                                    addToast('تم نسخ الآيبان بنجاح! 📋');
                                  }}
                                  className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-all cursor-pointer"
                                  title="نسخ الآيبان"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="block text-gray-300">تحميل صورة إيصال التحويل:</label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadReceiptSimulated}
                                className="hidden"
                                id="receipt-upload-input"
                              />
                              <label
                                htmlFor="receipt-upload-input"
                                className="w-full bg-discord-dark border border-white/10 hover:border-discord-purple rounded-xl py-3 px-4 flex items-center justify-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-all text-xs"
                              >
                                <Camera className="w-4 h-4 text-discord-fuchsia shrink-0" />
                                <span>{isUploadingReceipt ? '⏳ جاري رفع وقراءة الإيصال...' : receiptName ? receiptName : 'اضغط لتحميل الإيصال'}</span>
                              </label>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-gray-300">رقم الحوالة / المرجعي (اختياري):</label>
                            <input
                              type="text"
                              value={referenceNumber}
                              onChange={(e) => setReferenceNumber(e.target.value)}
                              placeholder="مثال: 1045938"
                              className="w-full bg-discord-dark border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-discord-purple text-center text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Complete Payment Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-102 active:scale-98 text-center"
                >
                  تأكيد ودفع {total} ريال سعودي بأمان 🔒
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 3: LOADER / ENCRYPTION PROCESSING */}
        {paymentStep === 'processing' && (
          <motion.div
            key="processing-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto text-center py-20 space-y-6 font-sans"
          >
            <div className="relative inline-block">
              <Loader2 className="w-16 h-16 text-discord-purple animate-spin mx-auto" />
              <ShieldCheck className="w-6 h-6 text-discord-fuchsia absolute top-5 left-5 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-white">معالجة دفع آمنة ومشفرة بالكامل 🔐</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                يرجى الانتظار، جاري معالجة وتشفير بيانات الدفع الحساسة والتحقق من التغطية المالية لتفعيل خدمات الديسكورد التلقائية وتوليد الروابط فورياً...
              </p>
            </div>
            <div className="w-48 h-1.5 bg-discord-dark rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-discord-purple rounded-full animate-pulse-glow" style={{ width: '80%' }}></div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS & INSTANT DELIVERY VIEW */}
        {paymentStep === 'success' && createdOrder && (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-right space-y-6"
          >
            <div className="p-6 sm:p-8 bg-[#1e1f22]/80 border border-discord-green/30 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
              {/* Confetti decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-discord-green/5 rounded-full filter blur-3xl"></div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-discord-yellow/10 text-discord-yellow flex items-center justify-center mx-auto border border-discord-yellow/30">
                  <Loader2 className="w-10 h-10 animate-spin text-discord-yellow" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">تم تقديم طلبك بنجاح وبانتظار تفعيل الإدارة ⏳</h2>
                <p className="text-xs text-gray-400">رقم طلبك القانوني بالمتجر: <span className="text-white font-mono font-bold">{createdOrder.id}</span></p>
              </div>

              {/* AUTOMATED CODES GENERATED (PENDING WARNING) */}
              <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-3.5">
                <p className="text-xs font-extrabold text-discord-yellow flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-discord-yellow" />
                  حالة أكواد التفعيل والتوصيل للطلب:
                </p>

                <div className="p-4 bg-discord-yellow/5 border border-discord-yellow/20 rounded-xl space-y-2 text-xs text-gray-300 leading-relaxed text-right">
                  <p className="font-bold text-discord-yellow">⏳ الطلب قيد المراجعة الفورية من قبل مسؤولي الإدارة:</p>
                  <p>
                    مرحباً <span className="text-white font-bold">{createdOrder.customerName}</span>، لقد استلمنا إيصال التحويل البنكي المرفق وجاري التحقق من التحصيل لتفعيل خدماتك مباشرة.
                  </p>
                  <p className="text-[11px] text-gray-400">
                    بمجرد موافقة أحد المشرفين في لوحة الإدارة، سيتم تفعيل الطلب فورياً وستتحول الأكواد أدناه إلى روابط تفعيل حية وقابلة للنسخ تلقائياً.
                  </p>
                </div>

                {generatedCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-discord-dark/50 p-3.5 rounded-xl border border-white/5 opacity-60">
                    <span className="text-xs font-mono text-gray-500 break-all select-all font-semibold" dir="ltr">
                      ************************ (قيد موافقة الإدارة 🔒)
                    </span>
                    <button
                      disabled
                      className="p-2 bg-gray-500/10 text-gray-500 rounded-lg cursor-not-allowed shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <p className="text-[10px] text-gray-400 leading-relaxed">
                  💡 تذكير: الأكواد صالحة للتفعيل لمرة واحدة على حسابك في ديسكورد فور تفعيلها من قبل الإدارة. تم إرسال نسخة احتياطية وفاتورة الشراء تلقائياً إلى بريدك الإلكتروني: <span className="text-white font-medium">{createdOrder.email}</span>.
                </p>
              </div>

              {/* COMPULSORY VIDEO REFUND NOTICE */}
              <div className="p-5 bg-discord-purple/10 border border-discord-purple/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-discord-yellow animate-pulse shrink-0" />
                  <h4 className="font-extrabold text-white text-xs sm:text-sm">توضيح الضمان وسياسة استرداد الأموال:</h4>
                </div>
                <div className="text-[11px] sm:text-xs text-gray-200 leading-relaxed space-y-2">
                  <p className="font-bold text-discord-yellow">🎥 شرط تسجيل مقطع فيديو إلزامي لحفظ حقوقك:</p>
                  <p className="bg-black/30 p-3 rounded-xl border border-white/5">
                    "يجب على العميل تسجيل مقطع فيديو مستمر للشاشة يبدأ من لحظة نسخ كود التفعيل والهدية هنا، والذهاب لمتصفحك أو تطبيق ديسكورد ومحاولة تفعيله بالكامل، مع ضرورة إظهار اسم المستخدم (Username) الخاص بك بوضوح بالمقطع. لن تقبل أي مطالبة استبدال أو استرجاع دون تزويد الدعم بهذا الفيديو."
                  </p>
                </div>
              </div>

              {/* Back to Home Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onNavigate('home')}
                  className="flex-1 py-3 bg-discord-dark border border-white/10 hover:border-discord-purple text-white text-xs font-bold rounded-xl cursor-pointer text-center transition-all"
                >
                  العودة للرئيسية للتسوق
                </button>
                <a
                  href="https://discord.gg/h7a46w6bh3"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer text-center transition-all glow-purple"
                >
                  فتح تذكرة وتثبيت طلبك بالدعم الفني
                </a>
              </div>

            </div>
          </motion.div>
        )}

        {/* WARNING MODAL BEFORE BANK TRANSFER */}
        {showWarningModal && (
          <motion.div
            key="warning-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-md p-6 bg-[#1e1f22] border border-discord-yellow/30 rounded-3xl space-y-6 text-right shadow-2xl relative"
              dir="rtl"
            >
              <div className="flex items-center gap-3 text-discord-yellow pb-2 border-b border-white/5">
                <AlertCircle className="w-8 h-8 shrink-0 animate-bounce" />
                <h3 className="text-lg font-black">تحذير هام قبل إتمام الدفع ⚠️</h3>
              </div>

              <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                <p className="font-extrabold text-white text-sm bg-discord-yellow/10 p-3 rounded-xl border border-discord-yellow/20 text-center">
                  ⚠️ يجب تصوير الايصال و وضعه هنا ⚠️
                </p>
                <p>
                  الرجاء التأكد بنسبة 100% أنك قمت بتصوير شاشة التحويل الناجحة وإرفاق صورة الإيصال بشكل صحيح في الحقل المخصص قبل تأكيد الطلب.
                </p>
                <div className="p-3.5 bg-discord-purple/10 border border-discord-purple/20 rounded-xl text-gray-200">
                  <span className="font-bold text-discord-fuchsia block mb-1">💡 لماذا هذا الإجراء؟</span>
                  طلبك لن يتم تفعيله وتمريره للمراجعة حتى تتأكد الإدارة يدويًا من مطابقة الإيصال بالتحويل الوارد بمصرف الراجحي لمتجرنا.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={executeOrderFinalization}
                  className="flex-1 py-3 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all text-center font-display shadow-md glow-purple font-black"
                >
                  أؤكد الإرفاق وإرسال الطلب 👍
                </button>
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="px-4 py-3 bg-discord-dark hover:bg-discord-dark/80 text-gray-400 hover:text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  تراجع للتعديل
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
