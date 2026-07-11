import React, { useState, useEffect } from 'react';
import { Terminal, Shield, TrendingUp, RefreshCw, Layers, CheckSquare, Edit3, Settings, DollarSign, Users, Star, AlertCircle, ShoppingBag, UserPlus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Order } from '../types';
import { PRODUCTS } from '../data';

interface AdminPanelProps {
  products: Product[];
  onUpdateProductPrice: (id: string, price: number) => void;
  onUpdateProductStock: (id: string, stock: number) => void;
  onUpdateProductImage: (id: string, image: string) => void;
  categoryNames?: { nitro: string; boosts: string; effects: string };
  onUpdateCategoryNames?: (names: { nitro: string; boosts: string; effects: string }) => void;
  addToast: (msg: string) => void;
  adminPasscode: string;
  onUpdateAdminPasscode: (code: string) => void;
}

export default function AdminPanel({
  products,
  onUpdateProductPrice,
  onUpdateProductStock,
  onUpdateProductImage,
  categoryNames,
  onUpdateCategoryNames,
  addToast,
  adminPasscode,
  onUpdateAdminPasscode
}: AdminPanelProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'admins'>('orders');

  // Admins state
  const [admins, setAdmins] = useState<{ id: string; username: string; role: string; addedDate: string }[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('مشرف عام');

  useEffect(() => {
    const savedAdmins = localStorage.getItem('doo_store_admins');
    if (savedAdmins) {
      setAdmins(JSON.parse(savedAdmins));
    } else {
      const defaultAdmins = [
        { id: '1', username: '940y', role: 'المدير العام (المالك)', addedDate: '2026-07-01' },
        { id: '2', username: 'Ahmed.amk208', role: 'مدير العمليات', addedDate: '2026-07-05' }
      ];
      setAdmins(defaultAdmins);
      localStorage.setItem('doo_store_admins', JSON.stringify(defaultAdmins));
    }
  }, []);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim()) return;

    // Check if already exists
    if (admins.some((a) => a.username.toLowerCase() === newAdminUsername.trim().toLowerCase())) {
      addToast('هذا المستخدم مضاف بالفعل كمدير! ❌');
      return;
    }

    const newAdmin = {
      id: `admin_${Date.now()}`,
      username: newAdminUsername.trim(),
      role: newAdminRole,
      addedDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...admins, newAdmin];
    setAdmins(updated);
    localStorage.setItem('doo_store_admins', JSON.stringify(updated));
    setNewAdminUsername('');
    addToast(`تم إضافة الإداري الجديد ${newAdmin.username} بنجاح! 👑`);
  };

  const handleDeleteAdmin = (id: string, username: string) => {
    if (username === '940y') {
      addToast('لا يمكن حذف المدير العام والمالك الأساسي للموقع! ⛔');
      return;
    }

    const updated = admins.filter((a) => a.id !== id);
    setAdmins(updated);
    localStorage.setItem('doo_store_admins', JSON.stringify(updated));
    addToast(`تم سحب رتبة الإدارة من ${username} بنجاح! 🗑️`);
  };

  const [localCategoryNames, setLocalCategoryNames] = useState({
    nitro: categoryNames?.nitro || 'ديسكورد نيترو',
    boosts: categoryNames?.boosts || 'بوستات السيرفر',
    effects: categoryNames?.effects || 'تأثيرات الملف الشخصي',
  });

  const [tempPasscode, setTempPasscode] = useState(adminPasscode);

  useEffect(() => {
    setTempPasscode(adminPasscode);
  }, [adminPasscode]);

  const handleSavePasscode = () => {
    if (!tempPasscode.trim()) {
      addToast('❌ لا يمكن أن يكون رمز المرور فارغاً!');
      return;
    }
    onUpdateAdminPasscode(tempPasscode.trim());
    addToast('🔒 تم تحديث رمز مرور الإدارة بنجاح! احتفظ به جيداً.');
  };

  useEffect(() => {
    if (categoryNames) {
      setLocalCategoryNames(categoryNames);
    }
  }, [categoryNames]);

  const handleSaveCategories = () => {
    if (onUpdateCategoryNames) {
      onUpdateCategoryNames(localCategoryNames);
      addToast('تم تحديث مسميات أقسام المنتجات بنجاح! 🎉');
    }
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('doo_store_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Seed a couple of mock orders to show on first load
      const seedOrders: Order[] = [
        {
          id: 'DOO-928401',
          customerName: 'فهد المطيري',
          email: 'fahad@gmail.com',
          discordUsername: 'fahad_55',
          items: [
            { product: PRODUCTS[0], quantity: 1 } // Discord Nitro
          ],
          total: 20,
          paymentMethod: 'credit_card',
          paymentDetails: { cardNumber: '**** **** **** 4810' },
          status: 'completed',
          date: '2026-07-09',
          trackingCode: 'TRK-9831048'
        },
        {
          id: 'DOO-481029',
          customerName: 'فيصل السديري',
          email: 'faisal@sod.com',
          discordUsername: 'faisal_sd',
          items: [
            { product: PRODUCTS[1], quantity: 1 } // Server Boosts 14
          ],
          total: 83,
          paymentMethod: 'bank_transfer',
          paymentDetails: { referenceNumber: 'REF-30198' },
          status: 'pending',
          date: '2026-07-10',
        }
      ];
      setOrders(seedOrders);
      localStorage.setItem('doo_store_orders', JSON.stringify(seedOrders));
    }
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('doo_store_orders', JSON.stringify(updated));
    addToast(`تم تحديث حالة الطلب ${orderId} إلى: ${status === 'completed' ? 'تم التوصيل' : 'تحت المراجعة'}! ⚡`);
  };

  // Calculate stats
  const totalRevenue = orders.reduce((acc, o) => o.status === 'completed' ? acc + o.total : acc, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto font-sans text-right" dir="rtl" id="admin-panel-container">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5 font-display">
            <Shield className="w-8 h-8 text-discord-fuchsia animate-pulse shrink-0" />
            <span>لوحة التحكم الإدارية</span>
          </h1>
          <p className="text-xs text-gray-400">إدارة المخزون، الطلبات والتحليلات لمتجر Doo لخدمات الديسكورد.</p>
        </div>

        {/* Tab selection */}
        <div className="flex gap-2 bg-discord-dark/50 border border-white/5 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            إدارة الطلبات ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            إدارة المخزون والأسعار
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            التحليلات والمبيعات
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admins' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            إدارة المدراء ({admins.length})
          </button>
        </div>
      </div>

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-discord-darker/60 border border-white/5">
          <p className="text-[10px] text-gray-400 font-bold">إجمالي المبيعات المؤكدة</p>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{totalRevenue} <span className="text-xs text-discord-purple">ريال</span></h3>
        </div>
        <div className="p-4 rounded-xl bg-discord-darker/60 border border-white/5">
          <p className="text-[10px] text-gray-400 font-bold">طلبات بانتظار الدفع/التحقق</p>
          <h3 className="text-xl sm:text-2xl font-black text-discord-yellow mt-1">{pendingOrdersCount}</h3>
        </div>
        <div className="p-4 rounded-xl bg-discord-darker/60 border border-white/5">
          <p className="text-[10px] text-gray-400 font-bold">طلبات تم تفعيلها تلقائياً</p>
          <h3 className="text-xl sm:text-2xl font-black text-discord-green mt-1">{completedOrdersCount}</h3>
        </div>
        <div className="p-4 rounded-xl bg-discord-darker/60 border border-white/5">
          <p className="text-[10px] text-gray-400 font-bold">إجمالي الخدمات الموفرة</p>
          <h3 className="text-xl sm:text-2xl font-black text-discord-fuchsia mt-1">{products.length}</h3>
        </div>
      </div>

      {/* Tab: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="bg-[#1e1f22]/70 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20">
            <h3 className="font-bold text-white text-sm sm:text-base">جميع الطلبات وقنوات السداد</h3>
            <span className="text-xs text-gray-400">تحديث فوري تلقائي</span>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-xs">لا يوجد أي طلبات حالياً بالمتجر.</div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-black/10 border-b border-white/5 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="p-4">رقم الطلب / العميل</th>
                    <th className="p-4">الخدمة والكمية</th>
                    <th className="p-4">المجموع</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-left">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-white font-mono">{o.id}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{o.customerName} (@{o.discordUsername})</p>
                        <p className="text-[9px] text-gray-500">{o.date}</p>
                      </td>
                      <td className="p-4">
                        {o.items.map((item, idx) => (
                          <div key={idx}>
                            <p className="font-semibold text-white">{item.product.nameAr}</p>
                            <p className="text-[10px] text-gray-400">الكمية: {item.quantity}</p>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-discord-fuchsia">{o.total} ريال</td>
                      <td className="p-4 font-semibold text-gray-400 uppercase">
                        {o.paymentMethod === 'credit_card' && '💳 مدى / فيزا'}
                        {o.paymentMethod === 'apple_pay' && ' Apple Pay'}
                        {o.paymentMethod === 'stc_pay' && '📱 STC Pay'}
                        {o.paymentMethod === 'bank_transfer' && '🏦 تحويل بنكي'}
                        {o.paymentDetails?.referenceNumber && (
                          <p className="text-[9px] text-discord-purple mt-0.5 font-mono">مرجع: {o.paymentDetails.referenceNumber}</p>
                        )}
                        {o.paymentDetails?.receiptUrl && (
                          <span className="text-[9px] bg-discord-purple/10 text-discord-purple border border-discord-purple/20 px-1 py-0.5 rounded mt-1 inline-block">إيصال مرفق 📄</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          o.status === 'completed'
                            ? 'bg-discord-green/10 text-discord-green border border-discord-green/20'
                            : o.status === 'pending'
                            ? 'bg-discord-yellow/10 text-discord-yellow border border-discord-yellow/20 animate-pulse'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {o.status === 'completed' ? 'مكتمل ومفعل ✅' : 'قيد الانتظار ⏳'}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        {o.status === 'pending' && (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'completed')}
                              className="px-2.5 py-1 bg-discord-green/10 hover:bg-discord-green text-discord-green hover:text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                            >
                              موافقة وتفعيل ⚡
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'failed')}
                              className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                            >
                              إلغاء الطلب ❌
                            </button>
                          </div>
                        )}
                        {o.status === 'completed' && (
                          <span className="text-[10px] text-gray-500">تم الانتهاء تلقائياً</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab: INVENTORY MANAGER */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Category Names Customization Card */}
          <div className="p-6 rounded-2xl bg-[#1e1f22]/90 border border-discord-purple/30 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base">⚙️ تعديل مسميات أقسام المنتجات</h3>
            <p className="text-xs text-gray-400">يمكنك هنا تعديل أسماء أقسام المتجر الثلاثة المعروضة في كافة صفحات الموقع فورياً.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-right">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">مسمى قسم ديسكورد نيترو:</label>
                <input
                  type="text"
                  value={localCategoryNames.nitro}
                  onChange={(e) => setLocalCategoryNames({ ...localCategoryNames, nitro: e.target.value })}
                  className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">مسمى قسم بوستات السيرفر:</label>
                <input
                  type="text"
                  value={localCategoryNames.boosts}
                  onChange={(e) => setLocalCategoryNames({ ...localCategoryNames, boosts: e.target.value })}
                  className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">مسمى قسم تأثيرات الملف:</label>
                <input
                  type="text"
                  value={localCategoryNames.effects}
                  onChange={(e) => setLocalCategoryNames({ ...localCategoryNames, effects: e.target.value })}
                  className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveCategories}
                className="px-6 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg glow-purple"
              >
                حفظ مسميات الأقسام الجديدة 🎉
              </button>
            </div>
          </div>

          {/* Secure Admin Passcode Settings Card */}
          <div className="p-6 rounded-2xl bg-[#1e1f22]/90 border border-red-500/20 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500 animate-pulse" />
              <span>🔐 حماية لوحة الإدارة (رمز المرور السري)</span>
            </h3>
            <p className="text-xs text-gray-400">
              قم بتعديل رمز المرور السري المخصص لك لمنع أي زائر من تفعيل لوحة الإدارة أو التعديل على أسعار وصور منتجات المتجر.
            </p>
            
            <div className="max-w-md space-y-3 text-right text-xs">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">رمز المرور السري الحالي (أو الجديد):</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tempPasscode}
                    onChange={(e) => setTempPasscode(e.target.value)}
                    placeholder="اكتب رمز المرور الجديد هنا..."
                    className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-4 text-white text-center font-mono outline-none focus:border-red-500 tracking-wider"
                    dir="ltr"
                  />
                  <button
                    onClick={handleSavePasscode}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shrink-0 shadow-lg"
                  >
                    تحديث الرمز السري 🔒
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed">
                * ملاحظة: تأكد من حفظ هذا الرمز جيداً. رمز المرور النشط حالياً والمطلوب لتسجيل الدخول هو: <span className="font-bold text-red-400 font-mono bg-red-500/10 px-1.5 py-0.5 rounded">{adminPasscode}</span>.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4">
            <h3 className="font-extrabold text-white text-base">قائمة المنتجات والتحكم بالأسعار والمخزون</h3>
            <p className="text-xs text-gray-400">تعديل الأسعار والمخزون هنا ينعكس فوراً على المتجر أمام الزوار.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-discord-darker/80 border border-white/5 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-right">
                      <h4 className="font-extrabold text-white text-sm">{p.nameAr}</h4>
                      <p className="text-[10px] text-discord-purple font-semibold uppercase mt-0.5">تصنيف: {p.category}</p>
                    </div>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.nameAr}
                        className="w-12 h-12 rounded-lg object-cover bg-discord-dark shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-discord-purple/20 to-discord-fuchsia/20 border border-discord-purple/30 flex items-center justify-center shrink-0">
                        <Settings className="w-6 h-6 text-discord-fuchsia" />
                      </div>
                    )}
                  </div>

                  {/* Settings Inputs */}
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-gray-400">السعر الحالي (ريال):</label>
                        <input
                          type="number"
                          disabled={p.priceOnRequest}
                          value={p.price}
                          onChange={(e) => onUpdateProductPrice(p.id, parseFloat(e.target.value) || 0)}
                          className="w-full bg-discord-dark border border-white/10 rounded-lg py-2 px-2.5 text-center text-white outline-none focus:border-discord-purple font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400">كمية المخزون (أكواد):</label>
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => onUpdateProductStock(p.id, parseInt(e.target.value) || 0)}
                          className="w-full bg-discord-dark border border-white/10 rounded-lg py-2 px-2.5 text-center text-white outline-none focus:border-discord-purple font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 block">رابط صورة المنتج (URL):</label>
                      <input
                        type="text"
                        value={p.image || ''}
                        onChange={(e) => onUpdateProductImage(p.id, e.target.value)}
                        placeholder="مثال: https://images.com/nitro.png"
                        className="w-full bg-discord-dark border border-white/10 rounded-lg py-2 px-3 text-left text-white outline-none focus:border-discord-purple font-mono text-[11px]"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4">
            <h3 className="font-extrabold text-white text-base">مخطط نسبة المبيعات بالمتجر</h3>
            <div className="h-48 bg-discord-darker/60 rounded-xl border border-white/5 flex items-end justify-around p-4 gap-2">
              <div className="text-center w-12">
                <div className="bg-discord-purple h-32 rounded-t-lg glow-purple animate-pulse" style={{ width: '100%' }}></div>
                <p className="text-[10px] text-gray-400 mt-2">النيترو</p>
              </div>
              <div className="text-center w-12">
                <div className="bg-discord-fuchsia h-24 rounded-t-lg glow-fuchsia animate-pulse" style={{ width: '100%' }}></div>
                <p className="text-[10px] text-gray-400 mt-2">بوستات</p>
              </div>
              <div className="text-center w-12">
                <div className="bg-discord-green h-12 rounded-t-lg animate-pulse" style={{ width: '100%' }}></div>
                <p className="text-[10px] text-gray-400 mt-2">التأثيرات</p>
              </div>
            </div>
            <p className="text-[11px] text-center text-gray-400">بناءً على طلبات التفعيل التلقائي بالشرق الأوسط.</p>
          </div>

          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4 text-xs">
            <h3 className="font-extrabold text-white text-base">سجلات حماية المتجر والتشفير 🛡️</h3>
            <div className="space-y-2.5 bg-discord-darker/50 p-4 rounded-xl border border-white/5 font-mono">
              <div className="flex items-center gap-2 text-discord-green">
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>SSL 256-bit ACTIVE: All connections secure</span>
              </div>
              <div className="flex items-center gap-2 text-discord-green">
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>Auto Activation system: CONNECTED with Discord API</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                <span>Checking payment hooks... OK</span>
              </div>
              <div className="flex items-center gap-2 text-discord-purple">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Server is running on PORT 3000 container</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-500">متجر Doo متصل بالكامل بشبكة تسليم فوري وتلقائي 100%.</p>
          </div>
        </div>
      )}

      {/* Tab: ADMINS MANAGER */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: Add Admin Form */}
            <div className="p-6 rounded-2xl bg-[#1e1f22]/90 border border-discord-purple/30 space-y-4 shadow-2xl h-fit">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-discord-purple" />
                <span>إضافة إداري جديد معي</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                يمكنك هنا توظيف مشرفين أو مدراء لمساعدتك في إدارة طلبات المتجر وتحديث الأسعار والمخزون.
              </p>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-bold block">اسم مستخدم ديسكورد (Username):</label>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="مثال: turki_99 أو vaur.1"
                    className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3 text-white text-left outline-none focus:border-discord-purple"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-gray-300 font-bold block">رتبة الإشراف / الصلاحية:</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3 text-white outline-none focus:border-discord-purple cursor-pointer"
                  >
                    <option value="مشرف عام">مشرف عام (كامل الصلاحيات)</option>
                    <option value="مشرف طلبات ومبيعات">مشرف طلبات ومبيعات</option>
                    <option value="مساعد دعم فني">مساعد دعم فني</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg glow-purple"
                >
                  تعيين وتأكيد الإداري الجديد 👑
                </button>
              </form>
            </div>

            {/* Column 2 & 3: Admins List */}
            <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4 md:col-span-2">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-discord-fuchsia" />
                <span>قائمة الإداريين الحاليين في متجر Doo</span>
              </h3>
              <p className="text-xs text-gray-400">جميع الحسابات التالية لديها صلاحية الدخول وإدارة هذه اللوحة بالكامل.</p>

              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-black/25 border-b border-white/5 text-[11px] text-gray-400 uppercase tracking-wider">
                      <th className="p-4">اسم حساب الإداري</th>
                      <th className="p-4">رتبة الصلاحية</th>
                      <th className="p-4">تاريخ التعيين</th>
                      <th className="p-4 text-left">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-discord-purple/10 flex items-center justify-center font-bold text-discord-purple font-mono text-xs">
                              {adm.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white font-mono">@{adm.username}</p>
                              <p className="text-[10px] text-gray-500">ID: {adm.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            adm.username === '940y'
                              ? 'bg-discord-fuchsia/15 text-discord-fuchsia border border-discord-fuchsia/20'
                              : 'bg-discord-purple/10 text-discord-purple border border-discord-purple/15'
                          }`}>
                            {adm.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 font-mono">
                          {adm.addedDate}
                        </td>
                        <td className="p-4 text-left">
                          {adm.username === '940y' ? (
                            <span className="text-[10px] text-gray-500 font-semibold pl-2">المالك الأساسي 👑</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmin(adm.id, adm.username)}
                              className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-all"
                              title="حذف هذا المشرف"
                            >
                              <Trash2 className="w-4 h-4 inline-block" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
