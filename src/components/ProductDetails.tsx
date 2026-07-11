import React, { useState } from 'react';
import { Product, CartItem, Order } from '../types';
import { ShieldCheck, Video, HelpCircle, AlertTriangle, Sparkles, ShoppingCart, Send, ArrowLeft, Flame, Eye, Share2, Star, Check, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (prod: Product, quantity: number, option?: string, serverLink?: string, supporterName?: string) => void;
  onNavigate: (view: string) => void;
  addToast: (msg: string) => void;
}

const EFFECT_OPTIONS = [
  { id: 'opt1', label: 'ايفكت $4.99 (18 ريال) قـيفت بــ  7 ريال 🎁', price: 7, originalPrice: 18 },
  { id: 'opt2', label: 'ايفكت $5.99 (22 ريال) قـيفت بــ  9 ريال 🎁', price: 9, originalPrice: 22 },
  { id: 'opt3', label: 'ايفكت $6.99 (26 ريال) قـيفت بــ  12 ريال 🎁', price: 12, originalPrice: 26 },
  { id: 'opt4', label: 'ايفكت $7.99 (30 ريال) قـيفت بــ  15 ريال 🎁', price: 15, originalPrice: 30 },
  { id: 'opt5', label: 'ايفكت $8.49 (34 ريال) قـيفت بــ  17 ريال 🎁', price: 17, originalPrice: 34 },
  { id: 'opt6', label: 'ايفكت $9.99 (37 ريال) قـيفت بــ  20 ريال 🎁', price: 20, originalPrice: 37 },
  { id: 'opt7', label: 'ايفكت $11.99 (45 ريال) قـيفت بــ  24 ريال 🎁', price: 24, originalPrice: 45 }
];

const OLD_ACCOUNT_OPTIONS = [
  { id: 'acc_2020', label: 'إنشاء 2020 ⏳ بسعر 4 ريال', price: 4, originalPrice: 10 },
  { id: 'acc_2019', label: 'إنشاء 2019 ⏳ بسعر 7 ريال', price: 7, originalPrice: 18 },
  { id: 'acc_2018', label: 'إنشاء 2018 ⏳ بسعر 10 ريال', price: 10, originalPrice: 25 },
  { id: 'acc_2017', label: 'إنشاء 2017 ⏳ بسعر 13 ريال', price: 13, originalPrice: 35 },
  { id: 'acc_2016', label: 'إنشاء 2016 ⏳ بسعر 30 ريال', price: 30, originalPrice: 75 },
  { id: 'acc_2015', label: 'إنشاء 2015 ⏳ بسعر 220 ريال', price: 220, originalPrice: 450 }
];

export default function ProductDetails({ product, onAddToCart, onNavigate, addToast }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState('1 month');
  const [effectDesc, setEffectDesc] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [effectName, setEffectName] = useState('');
  const [selectedEffectOption, setSelectedEffectOption] = useState('opt1');
  const [selectedAccountOption, setSelectedAccountOption] = useState('acc_2020');
  const [submittedForm, setSubmittedForm] = useState(false);
  const [serverLink, setServerLink] = useState('');
  const [supporterName, setSupporterName] = useState('');
  
  // Custom states for direct orders and effects image uploading
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  const currentOption = product.category === 'effects'
    ? EFFECT_OPTIONS.find(o => o.id === selectedEffectOption) || EFFECT_OPTIONS[0]
    : null;

  const currentAccOption = product.category === 'old_accounts'
    ? OLD_ACCOUNT_OPTIONS.find(o => o.id === selectedAccountOption) || OLD_ACCOUNT_OPTIONS[0]
    : null;

  let currentPrice = product.price;
  let currentOriginalPrice = product.originalPrice;

  if (product.category === 'effects') {
    currentPrice = currentOption!.price;
    currentOriginalPrice = currentOption!.originalPrice;
  } else if (product.category === 'old_accounts') {
    currentPrice = currentAccOption!.price;
    currentOriginalPrice = currentAccOption!.originalPrice;
  } else if (product.category === 'boosts') {
    if (selectedDuration === '1 month') {
      currentPrice = 15;
      currentOriginalPrice = 30;
    } else if (selectedDuration === '3 months') {
      currentPrice = 45;
      currentOriginalPrice = 90;
    }
  }

  const handleAddToCart = () => {
    if (product.category === 'boosts') {
      if (!serverLink.trim()) {
        addToast('⚠️ الرجاء إدخال رابط سيرفر الديسكورد للبوست!');
        return;
      }
      if (!supporterName.trim()) {
        addToast('⚠️ الرجاء إدخال اسم الداعم لتوثيق البوست!');
        return;
      }
    }

    if (product.category === 'effects') {
      if (!discordTag.trim()) {
        addToast('⚠️ الرجاء إدخال اسم حسابك في ديسكورد (Username) لتوصيل الايفكت!');
        return;
      }
    }

    if (product.category === 'old_accounts') {
      if (!discordTag.trim()) {
        addToast('⚠️ الرجاء إدخال اسم حسابك الحالي في ديسكورد للتنسيق والتواصل!');
        return;
      }
    }

    if (product.category === 'users_premium') {
      if (!discordTag.trim()) {
        addToast('⚠️ الرجاء إدخال حسابك في ديسكورد للتواصل وتوثيق حجز اليوزر!');
        return;
      }
    }

    if (product.category === 'creations_custom') {
      if (!discordTag.trim()) {
        addToast('⚠️ الرجاء إدخال حسابك في ديسكورد للتواصل!');
        return;
      }
      if (!effectDesc.trim()) {
        addToast('⚠️ الرجاء تحديد ووصف متطلبات الإنشاء أو التعديل المطلوبة!');
        return;
      }
    }

    const finalProduct = (product.category === 'effects' || product.category === 'boosts' || product.category === 'old_accounts')
      ? { ...product, price: currentPrice, originalPrice: currentOriginalPrice }
      : product;

    const finalOptionText = product.category === 'effects'
      ? currentOption?.label
      : (product.category === 'old_accounts'
          ? currentAccOption?.label
          : (product.category === 'boosts' 
              ? (selectedDuration === '1 month' ? 'بوست شهر كامل (15 ريال)' : 'بوست 3 أشهر (45 ريال)') 
              : (product.category === 'users_premium' 
                  ? 'حجز يوزر مميز' 
                  : (product.category === 'creations_custom' ? 'طلب إنشاء مخصص' : undefined))));

    const finalServerLink = product.category === 'boosts' 
      ? serverLink 
      : (product.category === 'users_premium' || product.category === 'creations_custom' 
          ? (effectDesc || undefined) 
          : undefined);

    const finalSupporterName = product.category === 'boosts' 
      ? supporterName 
      : (product.category === 'effects' || product.category === 'users_premium' || product.category === 'creations_custom' || product.category === 'old_accounts'
          ? discordTag 
          : undefined);

    onAddToCart(
      finalProduct,
      quantity,
      finalOptionText,
      finalServerLink,
      finalSupporterName
    );
    addToast(`🛒 تم إضافة ${product.nameAr} إلى السلة بنجاح!`);
    onNavigate('cart');
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.category === 'effects') {
      if (!effectName.trim() || !discordTag.trim() || !effectDesc.trim()) {
        addToast('الرجاء تعبئة اسم الايفكت والحساب والوصف المطلوبة! ⚠️');
        return;
      }
    } else {
      if (!effectDesc.trim() || !discordTag.trim()) {
        addToast('الرجاء تعبئة البيانات المطلوبة لتلقي التسعيرة الفورية! ⚠️');
        return;
      }
    }
    setSubmittedForm(true);
    addToast('🚀 تم إرسال طلب تزيين الملف الشخصي! سيقوم الدعم بإرسال السعر والبدء بالتفعيل فوراً.');
  };

  const handleDirectCreationOrder = () => {
    if (!discordTag.trim()) {
      addToast('⚠️ الرجاء إدخال رابط السيرفر او اسم حسابك!');
      return;
    }
    if (!effectDesc.trim()) {
      addToast('⚠️ الرجاء كتابة ما تريده مخصصاً في خانة (اكتب ماتريد)!');
      return;
    }
    if (!customerName.trim()) {
      addToast('⚠️ الرجاء إدخال اسمك الكريم للتواصل!');
      return;
    }
    if (!email.trim()) {
      addToast('⚠️ الرجاء إدخال البريد الإلكتروني لمتابعة الطلب!');
      return;
    }

    // Create Order
    const newOrder: Order = {
      id: `DOO-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      email,
      discordUsername: discordTag,
      items: [
        {
          product: { ...product, price: 0 }, // price will be set by admin later
          quantity: 1,
          serverLink: discordTag,
          selectedOption: effectDesc // "اكتب ماتريد"
        }
      ],
      total: 0, // Admin will set this
      paymentMethod: 'bank_transfer',
      paymentDetails: {},
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      trackingCode: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    // Save Order to history
    const savedOrders = localStorage.getItem('doo_store_orders');
    const currentOrders = savedOrders ? JSON.parse(savedOrders) : [];
    localStorage.setItem('doo_store_orders', JSON.stringify([newOrder, ...currentOrders]));

    // Emit event so live notification is triggered!
    window.dispatchEvent(new CustomEvent('new_order_placed', { detail: newOrder }));

    setIsRequestSubmitted(true);
    addToast('🎉 تم إتمام طلبك بنجاح! طلبك قيد التنفيذ الآن.');
  };

  if (isRequestSubmitted) {
    return (
      <div className="py-20 px-4 text-center space-y-6 max-w-xl mx-auto font-sans" dir="rtl" id="direct-order-success-container">
        <div className="w-20 h-20 rounded-full bg-discord-purple/10 text-discord-purple flex items-center justify-center mx-auto border border-discord-purple/30 animate-bounce">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white">طلبك قيد التنفيذ</h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            تم استلام طلبك لـ <span className="text-discord-purple font-bold">({product.nameAr})</span> بنجاح وبشكل مباشر!
          </p>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            لقد تم إرسال الطلب والمواصفات إلى لوحة الإدارة لمراجعتها فوراً وتحديد السعر المناسب لك. ستتلقى إشعاراً وسنتواصل معك عبر حساب ديسكورد <span className="text-white font-bold">{discordTag}</span> قريباً جداً لتأكيد تفاصيل البدء والدفع.
          </p>
        </div>
        <div className="pt-6">
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto font-sans text-right" dir="rtl" id="product-details-container">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-8 cursor-pointer bg-discord-dark/40 px-3.5 py-2 rounded-xl border border-white/5 transition-all"
      >
        <ArrowLeft className="w-4.5 h-4.5 transform rotate-180" />
        <span>العودة للخلف</span>
      </button>

      {/* Main product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        
        {/* Right side: Image banner */}
        <div>
          {product.image ? (
            <motion.div
              className="rounded-3xl overflow-hidden border border-white/10 glow-purple relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={product.image}
                alt={product.nameAr}
                className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-discord-purple text-white text-[10px] font-black px-3 py-1 rounded-full shadow flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-discord-fuchsia animate-pulse" />
                <span>الخدمة الأكثر طلباً 🔥</span>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl p-8 bg-gradient-to-tr from-discord-purple/20 to-discord-fuchsia/20 border border-discord-purple/30 text-center space-y-4">
              <Sparkles className="w-16 h-16 text-discord-fuchsia mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">تصاميم تأثيرات ملف شخصي مذهلة</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                يتم توليد واختيار تأثيرات ديسكورد وزخارف أفاتار مذهلة ومخصصة حسب رغبتك بالكامل لتعطي حسابك طابعاً فاخراً.
              </p>
            </div>
          )}

          {/* Core Trust Indicators */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3.5 rounded-2xl bg-discord-darker/60 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block font-bold">التسليم والنشاط</span>
              <span className="text-xs text-discord-green font-bold mt-1 block">
                {product.category === 'effects' ? 'من 10د إلى 24 ساعة 🕒' : 'تلقائي وفوري ⚡'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-discord-darker/60 border border-white/5 text-center">
              <span className="text-[10px] text-gray-400 block font-bold">حالة التغطية</span>
              <span className="text-xs text-white font-bold mt-1 block">ضمان كامل ومضمون 🛡️</span>
            </div>
          </div>
        </div>

        {/* Left side: Information, Pricing, and Cart Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-white font-display leading-tight">{product.nameAr}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-discord-yellow">
                <Star className="w-4 h-4 fill-discord-yellow" />
                <span className="text-xs font-bold mr-1">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({product.reviewsCount} تقييمات العملاء)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#1e1f22]/95 border border-discord-purple/20 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block font-bold">السعر لعملائنا بالشرق الأوسط:</span>
              <div className="flex items-baseline gap-2 mt-1">
                {product.priceOnRequest ? (
                  <span className="text-xl font-black text-discord-fuchsia">السعر حسب الطلب</span>
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl font-black text-discord-fuchsia">{currentPrice} ريال سعودي</span>
                    {currentOriginalPrice && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through font-medium">{currentOriginalPrice} ريال</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {!product.priceOnRequest && currentOriginalPrice && (
              <span className="bg-discord-green/10 text-discord-green border border-discord-green/20 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                خصم {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% الآن
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{product.descriptionAr}</p>

          {/* Custom controls depending on Categories */}
          {product.category === 'boosts' && (
            <div className="space-y-4 p-5 rounded-2xl bg-black/20 border border-white/5 text-right">
              <p className="text-xs font-bold text-discord-purple border-r-4 border-discord-purple pr-2">تحديد تفاصيل تفعيل بوستات السيرفر:</p>
              
              {/* Server Link */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">رابط سيرفر الديسكورد (Server Link):</label>
                <input
                  type="text"
                  required
                  value={serverLink}
                  onChange={(e) => setServerLink(e.target.value)}
                  placeholder="https://discord.gg/your-server"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                  dir="ltr"
                />
              </div>

              {/* Supporter Name */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اسم الداعم (صاحب الحساب أو السيرفر):</label>
                <input
                  type="text"
                  required
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="مثال: تركي الرويلي"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-discord-purple"
                />
              </div>

              {/* Boost Count Selector (Quantity) */}
              <div className="space-y-2">
                <label className="text-gray-300 text-xs font-bold block">كم تريد بوست؟ (عدد البوستات المطلوبة):</label>
                <div className="flex items-center gap-3 bg-discord-dark px-3 py-2 rounded-xl border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white px-2.5 font-bold cursor-pointer text-lg"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white px-3 min-w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-400 hover:text-white px-2.5 font-bold cursor-pointer text-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-discord-yellow">💡 ملاحظة: سعر البوست الواحد يتم ضربه في الكمية المحددة بالكامل.</p>
              </div>

              {/* Duration of boost */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اختر مدة استمرار البوست:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration('1 month')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      selectedDuration === '1 month'
                        ? 'bg-discord-purple/20 border-discord-purple text-white shadow-md'
                        : 'bg-discord-dark/50 border-white/5 text-gray-300 hover:text-white hover:bg-discord-dark/80'
                    }`}
                  >
                    <span className="text-xs font-bold">شهر واحد 📅</span>
                    <span className="text-[10px] text-gray-400">15 ريال للبوست</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDuration('3 months')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      selectedDuration === '3 months'
                        ? 'bg-discord-purple/20 border-discord-purple text-white shadow-md'
                        : 'bg-discord-dark/50 border-white/5 text-gray-300 hover:text-white hover:bg-discord-dark/80'
                    }`}
                  >
                    <span className="text-xs font-bold">3 أشهر 📆</span>
                    <span className="text-[10px] text-gray-400">45 ريال للبوست</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom controls for Profile Effects */}
          {product.category === 'effects' && (
            <div className="space-y-4 p-5 rounded-2xl bg-black/20 border border-white/5 text-right">
              <p className="text-xs font-bold text-discord-purple border-r-4 border-discord-purple pr-2">تحديد باقة وتفاصيل تأثير الملف الشخصي:</p>
              
              {/* Discord Tag */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اسم حسابك في ديسكورد (Username):</label>
                <input
                  type="text"
                  required
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="940y أو اسم حسابك"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                  dir="ltr"
                />
              </div>

              {/* Custom Image Upload for profile effects */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">ضع صورة الطلب:</label>
                <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-4 bg-discord-black hover:border-discord-purple/40 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedImageName(e.target.files[0].name);
                        addToast('📸 تم تحديد صورة الطلب بنجاح!');
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Camera className="w-6 h-6 text-gray-500 group-hover:text-discord-purple transition-colors mb-1.5" />
                  <span className="text-[11px] text-gray-400 font-medium text-center">
                    {uploadedImageName ? `✓ تم الاختيار: ${uploadedImageName}` : 'اضغط لتحديد صورة أو اسحبها هنا لتصميم تأثيرك المخصص'}
                  </span>
                </div>
              </div>

              {/* Package Selector */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اختر باقة الايفكت المطلوبة (يتغير السعر بالأعلى فوراً):</label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {EFFECT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedEffectOption(opt.id)}
                      className={`w-full text-right px-4 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                        selectedEffectOption === opt.id
                          ? 'bg-discord-purple/20 border-discord-purple text-white shadow-md'
                          : 'bg-discord-dark/50 border-white/5 text-gray-300 hover:text-white hover:bg-discord-dark/80'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedEffectOption === opt.id && <Check className="w-4 h-4 text-discord-purple" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Custom controls for Old Discord Accounts */}
          {product.category === 'old_accounts' && (
            <div className="space-y-4 p-5 rounded-2xl bg-black/20 border border-white/5 text-right">
              <p className="text-xs font-bold text-discord-purple border-r-4 border-discord-purple pr-2">تحديد سنة إنشاء حساب ديسكورد والمواصفات:</p>
              
              {/* Discord Username for Contact */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اسم حسابك الحالي في ديسكورد للتواصل والتسليم:</label>
                <input
                  type="text"
                  required
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="مثال: user_94 أو @ahmed"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                  dir="ltr"
                />
              </div>

              {/* Account Year Selector */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اختر سنة إنشاء الحساب المطلوبة (يتغير السعر بالأعلى فوراً):</label>
                <div className="space-y-2">
                  {OLD_ACCOUNT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAccountOption(opt.id)}
                      className={`w-full text-right px-4 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                        selectedAccountOption === opt.id
                          ? 'bg-discord-purple/20 border-discord-purple text-white shadow-md'
                          : 'bg-discord-dark/50 border-white/5 text-gray-300 hover:text-white hover:bg-discord-dark/80'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedAccountOption === opt.id && <Check className="w-4 h-4 text-discord-purple" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Custom controls for Premium Usernames */}
          {product.category === 'users_premium' && (
            <div className="space-y-4 p-5 rounded-2xl bg-black/20 border border-white/5 text-right">
              <p className="text-xs font-bold text-discord-purple border-r-4 border-discord-purple pr-2">تأكيد تفاصيل حجز اليوزر:</p>
              
              {/* Discord Tag */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">حسابك في ديسكورد للتواصل ومتابعة التسليم:</label>
                <input
                  type="text"
                  required
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="مثال: custom_user أو @940y"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                  dir="ltr"
                />
              </div>

              {/* Extra Notes / Custom Username requested */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">ملاحظات إضافية أو يوزر مخصص ترغب به:</label>
                <textarea
                  value={effectDesc}
                  onChange={(e) => setEffectDesc(e.target.value)}
                  placeholder="إذا كان لديك يوزر معين تبحث عنه أو مواصفات خاصة ترغب بها، اكتبها هنا..."
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-discord-purple h-20 resize-none"
                />
              </div>
            </div>
          )}

          {/* Custom controls for Creations */}
          {product.category === 'creations_custom' && (
            <div className="space-y-4 p-5 rounded-2xl bg-black/20 border border-white/5 text-right">
              <p className="text-xs font-bold text-discord-purple border-r-4 border-discord-purple pr-2">تحديد متطلبات ومواصفات الإنشاء:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-gray-300 text-xs font-bold block">الاسم الكريم:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد العتيبي"
                    className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-discord-purple"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300 text-xs font-bold block">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Discord Tag */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">ضع رابط السيرفر او اسم حسابك:</label>
                <input
                  type="text"
                  required
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  placeholder="مثال: https://discord.gg/... أو @940y"
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white text-left outline-none focus:border-discord-purple"
                  dir="ltr"
                />
              </div>

              {/* Specifications description */}
              <div className="space-y-1.5">
                <label className="text-gray-300 text-xs font-bold block">اكتب ماتريد:</label>
                <textarea
                  required
                  value={effectDesc}
                  onChange={(e) => setEffectDesc(e.target.value)}
                  placeholder="مثال: أريد بوت إدارة وحماية متكامل مع لوحة تحكم ويب أو تصميم سيرفر ألعاب متكامل مع الرتب والبطولات..."
                  className="w-full bg-discord-dark border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-discord-purple h-28 resize-none"
                />
              </div>
            </div>
          )}

          {/* Add to Cart Control */}
          <div className="space-y-4">
              {product.category !== 'boosts' && product.category !== 'creations_custom' && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">الكمية المطلوبة:</span>
                  <div className="flex items-center gap-2 bg-discord-dark px-3 py-1.5 rounded-xl border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-400 hover:text-white px-1.5 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white px-2">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-gray-400 hover:text-white px-1.5 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {product.category === 'creations_custom' ? (
                <button
                  onClick={handleDirectCreationOrder}
                  className="w-full py-4 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-103 active:scale-97 text-center flex items-center justify-center gap-2"
                >
                  <Send className="w-4.5 h-4.5" />
                  <span>إتمام الطلب</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer shadow-lg transition-all glow-purple transform hover:scale-103 active:scale-97 text-center flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span>إضافة إلى السلة وإكمال الشراء الفوري</span>
                </button>
              )}
            </div>

          {/* CRITICAL WARRANTY NOTICE FOR DISCORD NITRO */}
          {product.category === 'nitro' && (
            <div className="p-5 rounded-2xl bg-discord-purple/10 border border-discord-purple/30 space-y-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-discord-fuchsia shrink-0 animate-bounce" />
                <h4 className="font-black text-white text-xs sm:text-sm">شرط الضمان وتصوير الفيديو:</h4>
              </div>
              <div className="text-[11px] sm:text-xs text-gray-200 leading-relaxed space-y-2">
                <p className="font-bold text-discord-yellow">🎥 لضمان المصداقية وحماية حقوق العميل:</p>
                <p className="bg-black/35 p-3 rounded-xl border border-white/5 font-black text-white text-sm">
                  "من شروط الضمان يجب ان يكون لديك مقطع عند استلام طلبك و تفعيله مع اظهار اسم مستخدم ديسكورد بوضوح وبدون أي تعديل أو انقطاع."
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">
                  نحن نلتزم بتسليم روابط هدايا معتمدة وصالحة 100%. هذا الشرط يحمي حقوق المتجر القانونية ويضمن لك تسليماً آمناً وصادقاً بالكامل.
                </p>
              </div>
            </div>
          )}

          {/* Benefits Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs sm:text-sm">المميزات الرئيسية للخدمة:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.benefitsAr.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#1e1f22]/50 p-2.5 rounded-xl border border-white/5">
                  <Check className="w-4 h-4 text-discord-green shrink-0 mt-0.5" />
                  <span className="text-gray-300 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
