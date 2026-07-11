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
  onUpdateProduct?: (id: string, updatedFields: Partial<Product>) => void;
  onCreateProduct?: (p: Product) => void;
  onDeleteProduct?: (id: string) => void;
  categoryNames?: { nitro: string; boosts: string; effects: string; users_premium?: string; creations_custom?: string };
  onUpdateCategoryNames?: (names: { nitro: string; boosts: string; effects: string; users_premium?: string; creations_custom?: string }) => void;
  addToast: (msg: string) => void;
  adminPasscode: string;
  onUpdateAdminPasscode: (code: string) => void;
}

export default function AdminPanel({
  products,
  onUpdateProductPrice,
  onUpdateProductStock,
  onUpdateProductImage,
  onUpdateProduct,
  onCreateProduct,
  onDeleteProduct,
  categoryNames,
  onUpdateCategoryNames,
  addToast,
  adminPasscode,
  onUpdateAdminPasscode
}: AdminPanelProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics' | 'admins' | 'users' | 'creations'>('orders');
  
  // Custom states for dialogs to prevent alert()/confirm() failures inside iframe
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [viewedEmailBody, setViewedEmailBody] = useState<string | null>(null);
  const [viewedEmailSubject, setViewedEmailSubject] = useState<string | null>(null);
  const [deleteConfirmationOrderId, setDeleteConfirmationOrderId] = useState<string | null>(null);

  // Admins state
  const [admins, setAdmins] = useState<{ id: string; username: string; role: string; addedDate: string }[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('مشرف عام');

  // Users and Creations local states
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [creations, setCreations] = useState<any[]>([]);

  useEffect(() => {
    // Load admins
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

    // Load registered users
    const savedUsers = localStorage.getItem('doo_registered_users');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    } else {
      const demoUsers = [
        { username: 'خالد الحربي', email: 'khaled@gmail.com', discordId: 'khaled_99', joinedDate: '2026-07-08' },
        { username: 'سعد العتيبي', email: 'saad_otb@outlook.com', discordId: 'saad_otb', joinedDate: '2026-07-09' }
      ];
      setRegisteredUsers(demoUsers);
      localStorage.setItem('doo_registered_users', JSON.stringify(demoUsers));
    }

    // Load custom creations requests
    const savedCreations = localStorage.getItem('doo_user_creations');
    if (savedCreations) {
      setCreations(JSON.parse(savedCreations));
    } else {
      const demoCreations = [
        {
          id: 'CR-908123',
          username: 'خالد الحربي',
          title: 'برمجة بوت متجر متكامل مع سلة سريعة',
          category: 'custom_bot',
          categoryAr: 'برمجة بوت مخصص متكامل',
          description: 'أريد بوت يقوم بإدارة المنتجات وعرض الأكواد مباشرة وتلقائياً للأعضاء عند استخدام زر شراء.',
          budget: '350 ريال',
          discordId: 'khaled_99',
          status: 'pending',
          date: '2026-07-09'
        }
      ];
      setCreations(demoCreations);
      localStorage.setItem('doo_user_creations', JSON.stringify(demoCreations));
    }
  }, []);

  const handleUpdateCreationStatus = (creationId: string, status: any) => {
    const updated = creations.map((c) => {
      if (c.id === creationId) {
        return { ...c, status };
      }
      return c;
    });
    setCreations(updated);
    localStorage.setItem('doo_user_creations', JSON.stringify(updated));
    addToast(`تم تحديث حالة طلب الإنشاء ${creationId} بنجاح! 🎨`);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim()) return;

    // Check if already exists
    if (admins.some((a) => (a.username || '').toLowerCase() === newAdminUsername.trim().toLowerCase())) {
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
    users_premium: categoryNames?.users_premium || 'يوزرات مميزة',
    creations_custom: categoryNames?.creations_custom || 'إنشاءات',
  });

  // New Product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(0);
  const [newProdStock, setNewProdStock] = useState(99);
  const [newProdCategory, setNewProdCategory] = useState<'nitro' | 'boosts' | 'effects' | 'users_premium' | 'creations_custom'>('users_premium');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdPriceOnReq, setNewProdPriceOnReq] = useState(false);
  const [newProdBenefits, setNewProdBenefits] = useState('');

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim() || !newProdDescAr.trim()) {
      addToast('⚠️ الرجاء ملء اسم المنتج ووصفه باللغة العربية على الأقل!');
      return;
    }

    if (!onCreateProduct) {
      addToast('⚠️ ميزة إضافة المنتجات غير مدعومة من المضيف حالياً.');
      return;
    }

    const benefitsAr = newProdBenefits
      ? newProdBenefits.split('\n').map(b => b.trim()).filter(Boolean)
      : ['تسليم آمن وسريع', 'ضمان كامل ومستقر طوال المدة'];

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: newProdName.trim() || newProdNameAr.trim(),
      nameAr: newProdNameAr.trim(),
      description: newProdDesc.trim() || newProdDescAr.trim(),
      descriptionAr: newProdDescAr.trim(),
      price: newProdPriceOnReq ? 0 : newProdPrice,
      originalPrice: newProdOriginalPrice || undefined,
      category: newProdCategory,
      image: newProdImage.trim() || 'https://static.wikia.nocookie.net/discord/images/7/77/Server_Boosting.png',
      benefits: benefitsAr,
      benefitsAr: benefitsAr,
      stock: newProdStock,
      rating: 5.0,
      reviewsCount: 1,
      priceOnRequest: newProdPriceOnReq
    };

    onCreateProduct(newProduct);
    addToast('🎉 تم إضافة المنتج الجديد بنجاح إلى المتجر!');

    // Reset form
    setNewProdName('');
    setNewProdNameAr('');
    setNewProdDesc('');
    setNewProdDescAr('');
    setNewProdPrice(0);
    setNewProdOriginalPrice(0);
    setNewProdStock(99);
    setNewProdImage('');
    setNewProdPriceOnReq(false);
    setNewProdBenefits('');
  };

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

  const handleDeleteOrder = (orderId: string) => {
    // Instead of confirm() which fails in sandboxed iframes, we use our custom state confirmation modal!
    setDeleteConfirmationOrderId(orderId);
  };

  const confirmDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    localStorage.setItem('doo_store_orders', JSON.stringify(updated));
    addToast(`🗑️ تم حذف الطلب ${orderId} نهائياً بنجاح!`);
    setDeleteConfirmationOrderId(null);
  };

  const [emailLogs, setEmailLogs] = useState<{ id: string; recipient: string; subject: string; body: string; status: string; date: string }[]>([]);
  const [customAdminEmail, setCustomAdminEmail] = useState(() => {
    return localStorage.getItem('doo_admin_email') || 'ahmed.amk208@gmail.com';
  });

  useEffect(() => {
    const savedLogs = localStorage.getItem('doo_sent_emails');
    if (savedLogs) {
      setEmailLogs(JSON.parse(savedLogs));
    }
  }, [orders]);

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
        <div className="flex flex-wrap gap-2 bg-discord-dark/50 border border-white/5 p-1 rounded-xl self-start">
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
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            إدارة المستخدمين ({registeredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('creations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'creations' ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            طلبات الإنشاء والتصميم ({creations.length})
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
          <button
            onClick={() => setActiveTab('emails' as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === ('emails' as any) ? 'bg-discord-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            تنبيهات البريد الآلية ({emailLogs.length})
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
                        <div className="flex gap-2 justify-end items-center">
                          {o.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(o.id, 'completed');
                                  addToast(`🎉 تم قبول وتفعيل الطلب رقم ${o.id} بنجاح!`);
                                }}
                                className="px-2.5 py-1 bg-discord-green/20 hover:bg-discord-green text-discord-green hover:text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                              >
                                قبول ✅
                              </button>
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(o.id, 'failed');
                                  addToast(`❌ تم رفض وإلغاء الطلب رقم ${o.id}.`);
                                }}
                                className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                              >
                                رفض ❌
                              </button>
                            </>
                          )}
                          {o.status === 'completed' && (
                            <span className="text-[10px] bg-discord-green/10 text-discord-green border border-discord-green/20 px-2 py-0.5 rounded font-bold">مقبول ومفعل ✅</span>
                          )}
                          {o.status === 'failed' && (
                            <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold">مرفوض/ملغي ❌</span>
                          )}
                          
                          {o.paymentDetails?.receiptUrl && (
                            <button
                              onClick={() => {
                                setSelectedReceiptUrl(o.paymentDetails?.receiptUrl || null);
                              }}
                              className="p-1 rounded bg-discord-purple/20 hover:bg-discord-purple text-discord-purple hover:text-white transition-colors cursor-pointer text-[10px] font-semibold"
                              title="عرض إيصال التحويل"
                            >
                              عرض الإيصال 📄
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer"
                            title="حذف الطلب نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
            <p className="text-xs text-gray-400">يمكنك هنا تعديل أسماء أقسام المتجر الخمسة المعروضة في كافة صفحات الموقع فورياً.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs text-right">
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
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">مسمى قسم يوزرات مميزة:</label>
                <input
                  type="text"
                  value={localCategoryNames.users_premium}
                  onChange={(e) => setLocalCategoryNames({ ...localCategoryNames, users_premium: e.target.value })}
                  className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">مسمى قسم إنشاءات:</label>
                <input
                  type="text"
                  value={localCategoryNames.creations_custom}
                  onChange={(e) => setLocalCategoryNames({ ...localCategoryNames, creations_custom: e.target.value })}
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

          {/* Add New Product Card */}
          <div className="p-6 rounded-2xl bg-[#1e1f22]/90 border border-discord-purple/30 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-discord-purple" />
              <span>🆕 إضافة منتج جديد إلى المتجر</span>
            </h3>
            <p className="text-xs text-gray-400">يمكنك هنا ملء تفاصيل المنتج لإضافته فورياً إلى أي قسم تريده بالمتجر.</p>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">اسم المنتج (بالعربية) <span className="text-red-500">*</span>:</label>
                  <input
                    type="text"
                    required
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    placeholder="مثال: يوزر رباعي مميز d7om"
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">اسم المنتج (بالإنجليزي - اختياري):</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="مثال: Premium Discord Username d7om"
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">وصف المنتج (بالعربية) <span className="text-red-500">*</span>:</label>
                  <textarea
                    required
                    value={newProdDescAr}
                    onChange={(e) => setNewProdDescAr(e.target.value)}
                    placeholder="اكتب تفاصيل ومواصفات المنتج هنا..."
                    rows={3}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">وصف المنتج (بالإنجليزي - اختياري):</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Write English product description here..."
                    rows={3}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple resize-none"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">القسم / التصنيف:</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple cursor-pointer"
                  >
                    <option value="users_premium">يوزرات مميزة</option>
                    <option value="creations_custom">إنشاءات مخصصة</option>
                    <option value="nitro">ديسكورد نيترو</option>
                    <option value="boosts">بوستات السيرفر</option>
                    <option value="effects">تأثيرات الملف</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">السعر (ريال):</label>
                  <input
                    type="number"
                    disabled={newProdPriceOnReq}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">السعر الأصلي (قبل الخصم - اختياري):</label>
                  <input
                    type="number"
                    disabled={newProdPriceOnReq}
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">المخزون المتوفر:</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">رابط الصورة (URL):</label>
                  <input
                    type="text"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="مثال: https://images.com/username.png"
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple font-mono"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold block">مزايا وفوائد المنتج (كل ميزة في سطر منفصل):</label>
                  <textarea
                    value={newProdBenefits}
                    onChange={(e) => setNewProdBenefits(e.target.value)}
                    placeholder="مثال:&#10;تسليم فوري ومباشر&#10;يوزر نادر ومميز&#10;ضمان مدى الحياة"
                    rows={2}
                    className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newProdPriceOnReq"
                  checked={newProdPriceOnReq}
                  onChange={(e) => setNewProdPriceOnReq(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-discord-purple focus:ring-discord-purple bg-discord-dark cursor-pointer"
                />
                <label htmlFor="newProdPriceOnReq" className="text-xs text-gray-300 font-bold cursor-pointer select-none">
                  هذا المنتج "حسب الطلب" (مثال: يوزر مميز يتم حجزه خصيصاً ولا يوجد سعر ثابت)
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة المنتج للمتجر الآن ✨</span>
                </button>
              </div>
            </form>
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm">{p.nameAr}</h4>
                        {onDeleteProduct && (
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف المنتج: ${p.nameAr}؟`)) {
                                onDeleteProduct(p.id);
                                addToast(`🗑️ تم حذف المنتج ${p.nameAr} من المتجر.`);
                              }
                            }}
                            className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors cursor-pointer"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-discord-purple font-semibold uppercase mt-0.5">
                        تصنيف: {p.category === 'users_premium' ? 'يوزرات مميزة' : p.category === 'creations_custom' ? 'إنشاءات مخصصة' : p.category}
                      </p>
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

                    <div className="space-y-1">
                      <label className="text-gray-300 block font-bold">اسم المنتج (بالعربية):</label>
                      <input
                        type="text"
                        value={p.nameAr || ''}
                        onChange={(e) => {
                          if (onUpdateProduct) {
                            onUpdateProduct(p.id, { nameAr: e.target.value });
                          }
                        }}
                        placeholder="أدخل اسم المنتج بالكامل..."
                        className="w-full bg-discord-dark border border-white/10 rounded-lg py-2 px-3 text-white outline-none focus:border-discord-purple text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 block font-bold">وصف المنتج (بالعربية):</label>
                      <textarea
                        value={p.descriptionAr || ''}
                        onChange={(e) => {
                          if (onUpdateProduct) {
                            onUpdateProduct(p.id, { descriptionAr: e.target.value });
                          }
                        }}
                        placeholder="أدخل وصفاً تفصلاً للمنتج..."
                        rows={2}
                        className="w-full bg-discord-dark border border-white/10 rounded-lg py-2 px-3 text-white outline-none focus:border-discord-purple text-xs resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`request-price-${p.id}`}
                        checked={p.priceOnRequest || false}
                        onChange={(e) => {
                          if (onUpdateProduct) {
                            onUpdateProduct(p.id, { priceOnRequest: e.target.checked });
                            addToast(`💡 تم تحديث خيار السعر حسب الطلب لـ ${p.nameAr}`);
                          }
                        }}
                        className="w-4 h-4 rounded border-white/10 text-discord-purple focus:ring-discord-purple bg-discord-dark cursor-pointer"
                      />
                      <label htmlFor={`request-price-${p.id}`} className="text-xs text-gray-300 font-bold cursor-pointer select-none">
                        تفعيل خيار "السعر حسب الطلب" (مثال: يوزرات مميزة)
                      </label>
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

      {/* Tab: AUTOMATED EMAILS AUDIT LOG */}
      {activeTab === ('emails' as any) && (
        <div className="space-y-6">
          {/* Configure Admin Email Card */}
          <div className="p-6 rounded-2xl bg-[#1e1f22]/90 border border-discord-purple/30 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-base">⚙️ إعدادات التنبيهات البريدية الآلية للمدير</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              عند حدوث أي طلب جديد في المتجر، يقوم النظام تلقائياً بإرسال تنبيه آلي تفصيلي بالطلب والعميل والمبلغ إلى بريد المدير المدخل أدناه لضمان سرعة الاستجابة والتفعيل المباشر.
            </p>
            
            <div className="flex flex-col sm:flex-row items-end gap-3 max-w-xl text-xs text-right">
              <div className="space-y-1.5 flex-1 w-full">
                <label className="text-gray-300 font-bold block">البريد الإلكتروني المعتمد لتلقي التنبيهات:</label>
                <input
                  type="email"
                  value={customAdminEmail}
                  onChange={(e) => setCustomAdminEmail(e.target.value)}
                  placeholder="مثال: admin@doo.store"
                  className="w-full bg-discord-dark border border-white/10 rounded-lg py-2.5 px-3 text-white outline-none focus:border-discord-purple text-left font-mono"
                  dir="ltr"
                />
              </div>
              <button
                onClick={() => {
                  if (!customAdminEmail.trim() || !customAdminEmail.includes('@')) {
                    addToast('❌ الرجاء إدخال بريد إلكتروني صحيح!');
                    return;
                  }
                  localStorage.setItem('doo_admin_email', customAdminEmail.trim());
                  addToast(`🔒 تم حفظ بريد التنبيهات المعتمد للمدير بنجاح: ${customAdminEmail}`);
                }}
                className="px-6 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg shrink-0"
              >
                حفظ البريد المعتمد 📧
              </button>
            </div>
          </div>

          {/* Email Logs List */}
          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4">
            <h3 className="font-extrabold text-white text-base">سجل التنبيهات البريدية الآلية الصادرة للمدير</h3>
            <p className="text-xs text-gray-400">تتبع الإشعارات الآلية المرسلة فورياً إلى بريد المدير العام عند إتمام أي طلب جديد بالمتجر.</p>

            <div className="overflow-x-auto">
              {emailLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-xs">لا يوجد أي سجل تنبيهات بريدية حالياً. سيظهر السجل هنا بمجرد إجراء طلب جديد بالمتجر.</div>
              ) : (
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-black/10 border-b border-white/5 text-[11px] text-gray-400 uppercase tracking-wider">
                      <th className="p-4">رقم التنبيه / التاريخ</th>
                      <th className="p-4">المستلم (المدير)</th>
                      <th className="p-4">عنوان الرسالة</th>
                      <th className="p-4">حالة الإرسال</th>
                      <th className="p-4 text-left">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono">
                          <p className="font-bold text-white">{log.id}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{log.date}</p>
                        </td>
                        <td className="p-4 font-mono text-gray-300">{log.recipient}</td>
                        <td className="p-4 font-bold text-discord-fuchsia">{log.subject}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-discord-green/10 text-discord-green border border-discord-green/20">
                            تم الإرسال بنجاح ✅
                          </span>
                        </td>
                        <td className="p-4 text-left">
                          <button
                            onClick={() => {
                              setViewedEmailBody(log.body);
                              setViewedEmailSubject(log.subject);
                            }}
                            className="px-2.5 py-1 bg-discord-purple/20 hover:bg-discord-purple text-discord-purple hover:text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                          >
                            عرض نص الرسالة 📄
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">إدارة أعضاء ومستخدمين المتجر</h3>
                <p className="text-xs text-gray-400 mt-0.5">قائمة بجميع العملاء المسجلين بالمتجر ونشاط طلباتهم.</p>
              </div>
              <span className="bg-discord-purple/20 text-discord-purple border border-discord-purple/30 text-xs px-3 py-1 rounded-full font-bold">
                {registeredUsers.length} عضو مسجل
              </span>
            </div>

            <div className="overflow-x-auto border border-white/5 rounded-xl">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-black/25 border-b border-white/5 text-[11px] text-gray-400 uppercase tracking-wider">
                    <th className="p-4">العضو / الاسم</th>
                    <th className="p-4">البريد الإلكتروني</th>
                    <th className="p-4">حساب ديسكورد</th>
                    <th className="p-4">تاريخ التسجيل</th>
                    <th className="p-4 text-center">الطلبات والمشتريات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-gray-300">
                  {registeredUsers.map((u, index) => {
                    const userOrdersCount = orders.filter(
                      (o) => {
                        const orderEmail = (o.email || '').toLowerCase();
                        const userEmail = (u.email || '').toLowerCase();
                        const orderDiscord = (o.discordUsername || '').toLowerCase();
                        const userDiscord = (u.discordId || '').toLowerCase();
                        return (
                          (orderEmail && orderEmail === userEmail) ||
                          (orderDiscord && orderDiscord === userDiscord)
                        );
                      }
                    ).length;

                    return (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-discord-purple/20 to-discord-fuchsia/20 border border-discord-purple/30 flex items-center justify-center font-bold text-discord-fuchsia font-sans text-xs">
                              {u.username.slice(0, 1).toUpperCase()}
                            </div>
                            <span className="font-bold text-white">{u.username}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-gray-400 text-[11px]">
                          {u.email}
                        </td>
                        <td className="p-4 font-mono text-discord-purple text-[11px]" dir="ltr">
                          @{u.discordId}
                        </td>
                        <td className="p-4 text-gray-400">
                          {u.joinedDate || '2026-07-10'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            userOrdersCount > 0 
                              ? 'bg-discord-green/10 text-discord-green border border-discord-green/20' 
                              : 'bg-white/5 text-gray-400'
                          }`}>
                            {userOrdersCount} طلبات
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CREATIONS (CUSTOM PROJECTS) */}
      {activeTab === 'creations' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-discord-dark border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-base">طلبات ديسكورد الإنشائية والتصاميم المخصصة</h3>
                <p className="text-xs text-gray-400 mt-0.5">مراجعة والتحكم في حالات طلبات برمجة البوتات، تجهيز السيرفرات والتصاميم الجرافيكية المخصصة.</p>
              </div>
              <span className="bg-discord-fuchsia/20 text-discord-fuchsia border border-discord-fuchsia/30 text-xs px-3 py-1 rounded-full font-bold">
                {creations.length} طلبات مشاريع
              </span>
            </div>

            {creations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                لا توجد طلبات إنشاء مخصصة حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creations.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-5 rounded-xl bg-discord-darker/70 border border-white/5 space-y-4 hover:border-discord-purple/20 transition-all flex flex-col justify-between text-right"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-discord-fuchsia font-bold uppercase">📁 {c.categoryAr}</span>
                          <h4 className="font-extrabold text-white text-sm">{c.title}</h4>
                        </div>
                        <span className="font-mono text-[10px] text-gray-500">ID: {c.id}</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 bg-black/10 p-2.5 rounded-lg border border-white/5">
                        <span>👤 طالب الخدمة: <span className="font-bold text-white">{c.username}</span></span>
                        <span>•</span>
                        <span dir="ltr">🎮 ديسكورد: <span className="font-bold text-discord-purple font-mono">@{c.discordId}</span></span>
                        <span>•</span>
                        <span>📅 التاريخ: {c.date}</span>
                      </div>

                      <div className="text-xs text-gray-300 bg-black/35 p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                        {c.description}
                      </div>
                    </div>

                    <div className="space-y-4 pt-3 border-t border-white/5 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">💰 الميزانية المقترحة:</span>
                        <span className="font-black text-white text-sm font-sans">{c.budget}</span>
                      </div>

                      {/* Status controls */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 block">تحديث حالة طلب المشروع:</label>
                        <div className="grid grid-cols-5 gap-1 bg-black/30 p-1 rounded-lg border border-white/5 text-[10px] font-bold">
                          <button
                            onClick={() => handleUpdateCreationStatus(c.id, 'pending')}
                            className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                              c.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            مراجعة
                          </button>
                          <button
                            onClick={() => handleUpdateCreationStatus(c.id, 'processing')}
                            className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                              c.status === 'processing' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            عمل
                          </button>
                          <button
                            onClick={() => handleUpdateCreationStatus(c.id, 'approved')}
                            className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                              c.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            اعتماد
                          </button>
                          <button
                            onClick={() => handleUpdateCreationStatus(c.id, 'completed')}
                            className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                              c.status === 'completed' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            تسليم
                          </button>
                          <button
                            onClick={() => handleUpdateCreationStatus(c.id, 'rejected')}
                            className={`py-1.5 rounded text-center cursor-pointer transition-all ${
                              c.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 CUSTOM DIALOG: VIEW RECEIPT IMAGE OR FILE */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity">
          <div className="relative bg-discord-dark border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 text-right space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-extrabold text-white text-sm">عرض إيصال السداد المرفق 📄</h3>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-auto max-h-[60vh] overflow-y-auto rounded-xl bg-discord-black p-2 flex items-center justify-center border border-white/5">
              {selectedReceiptUrl.startsWith('data:image') || selectedReceiptUrl.includes('http') || selectedReceiptUrl.includes('/') ? (
                <img
                  src={selectedReceiptUrl}
                  alt="Receipt"
                  className="max-w-full h-auto rounded-lg object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                    const parent = (e.target as any).parentElement;
                    if (parent) {
                      const msg = document.createElement('p');
                      msg.className = 'text-xs text-gray-400 p-6 text-center leading-relaxed';
                      msg.innerText = 'هذا الإيصال عبارة عن بيانات نصية أو لم يتمكن المتصفح من تحميل الصورة مباشرة.';
                      parent.appendChild(msg);
                    }
                  }}
                />
              ) : (
                <div className="p-6 text-center space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">تفاصيل مرجع أو محتوى الإيصال:</p>
                  <pre className="p-3 bg-discord-black/50 text-discord-green font-mono text-xs rounded-lg select-all border border-discord-green/20 break-all whitespace-pre-wrap">{selectedReceiptUrl}</pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="px-5 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📧 CUSTOM DIALOG: VIEW EMAIL MESSAGE BODY */}
      {viewedEmailBody && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity">
          <div className="relative bg-discord-dark border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-sm">محتوى الإشعار البريدي الصادر للمدير 📧</h3>
                <p className="text-[10px] text-discord-purple font-semibold">{viewedEmailSubject}</p>
              </div>
              <button
                onClick={() => {
                  setViewedEmailBody(null);
                  setViewedEmailSubject(null);
                }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-discord-black border border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[50vh] text-right">
              <div className="whitespace-pre-wrap text-xs text-gray-300 leading-relaxed font-sans select-all">
                {viewedEmailBody}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className="text-[10px] text-gray-500">تم رصد هذا الإشعار تلقائياً بنجاح بواسطة نظام البريد.</p>
              <button
                onClick={() => {
                  setViewedEmailBody(null);
                  setViewedEmailSubject(null);
                }}
                className="px-5 py-2.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                حسناً، إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ CUSTOM DIALOG: SECURE DELETE ORDER CONFIRMATION */}
      {deleteConfirmationOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-opacity">
          <div className="relative bg-discord-dark border border-red-500/20 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 items-center justify-center flex mx-auto text-red-500 animate-bounce">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-white text-sm">حذف الطلب نهائياً!</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف الطلب <span className="font-mono text-discord-fuchsia font-bold">{deleteConfirmationOrderId}</span> نهائياً؟
                لا يمكن التراجع عن هذه العملية أو استعادة بيانات الطلب بعد ذلك.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => confirmDeleteOrder(deleteConfirmationOrderId)}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                نعم، احذف نهائياً 🗑️
              </button>
              <button
                onClick={() => setDeleteConfirmationOrderId(null)}
                className="flex-1 py-3 bg-discord-black hover:bg-discord-dark border border-white/10 text-gray-300 hover:text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                تراجع وإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
