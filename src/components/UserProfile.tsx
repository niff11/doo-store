import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Send, 
  Compass, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Hash,
  Activity,
  Award,
  PenTool,
  Calendar,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Order } from '../types';

interface UserProfileProps {
  addToast: (msg: string) => void;
  onNavigate: (view: string) => void;
}

export interface UserAccount {
  username: string;
  email: string;
  discordId: string;
  joinedDate: string;
}

export interface CreationRequest {
  id: string;
  username: string;
  title: string;
  category: 'server_setup' | 'graphic_design' | 'custom_bot' | 'effects_design';
  categoryAr: string;
  description: string;
  budget: string;
  discordId: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';
  date: string;
}

export default function UserProfile({ addToast, onNavigate }: UserProfileProps) {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDiscordId, setRegDiscordId] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Creation Studio Form State
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [creationTitle, setCreationTitle] = useState('');
  const [creationCategory, setCreationCategory] = useState<'server_setup' | 'graphic_design' | 'custom_bot' | 'effects_design'>('server_setup');
  const [creationDescription, setCreationDescription] = useState('');
  const [creationBudget, setCreationBudget] = useState('');
  const [creationDiscord, setCreationDiscord] = useState('');

  // Lists State
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userCreations, setUserCreations] = useState<CreationRequest[]>([]);

  // Load User and Lists on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('doo_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser) as UserAccount;
      setCurrentUser(user);
      loadUserData(user.username, user.email, user.discordId);
    }
  }, []);

  const loadUserData = (username: string, email: string, discordId: string) => {
    // Load Orders linked to this user (either by email or discordUsername)
    const savedOrders = localStorage.getItem('doo_store_orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders) as Order[];
      const filtered = allOrders.filter(
        (o) => 
          o.email.toLowerCase() === email.toLowerCase() || 
          o.discordUsername.toLowerCase() === discordId.toLowerCase() ||
          o.customerName.toLowerCase() === username.toLowerCase()
      );
      setUserOrders(filtered);
    }

    // Load custom creations requests
    const savedCreations = localStorage.getItem('doo_user_creations');
    if (savedCreations) {
      const allCreations = JSON.parse(savedCreations) as CreationRequest[];
      const filtered = allCreations.filter((c) => c.username === username);
      setUserCreations(filtered);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast('الرجاء تعبئة كافة الحقول تسجيل الدخول! ⚠️');
      return;
    }

    const savedUsersStr = localStorage.getItem('doo_registered_users');
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    const matchedUser = users.find(
      (u: any) => 
        (u.email.toLowerCase() === loginEmail.toLowerCase() || u.username.toLowerCase() === loginEmail.toLowerCase()) && 
        u.password === loginPassword
    );

    if (matchedUser) {
      const userObj: UserAccount = {
        username: matchedUser.username,
        email: matchedUser.email,
        discordId: matchedUser.discordId,
        joinedDate: matchedUser.joinedDate || new Date().toISOString().split('T')[0]
      };
      
      localStorage.setItem('doo_current_user', JSON.stringify(userObj));
      setCurrentUser(userObj);
      loadUserData(userObj.username, userObj.email, userObj.discordId);
      addToast(`🎉 أهلاً بعودتك يا ${userObj.username}! تم تسجيل الدخول بنجاح.`);
      
      // Clear forms
      setLoginEmail('');
      setLoginPassword('');
    } else {
      addToast('❌ الاسم أو كلمة المرور غير صحيحة! يرجى إعادة المحاولة.');
    }
  };

  // Register handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regDiscordId || !regPassword) {
      addToast('الرجاء تعبئة كافة الحقول لإنشاء الحساب! ⚠️');
      return;
    }

    if (regUsername.length < 3) {
      addToast('❌ يجب أن يكون اسم المستخدم 3 أحرف على الأقل!');
      return;
    }

    const savedUsersStr = localStorage.getItem('doo_registered_users');
    const users = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    const isExist = users.some(
      (u: any) => u.email.toLowerCase() === regEmail.toLowerCase() || u.username.toLowerCase() === regUsername.toLowerCase()
    );

    if (isExist) {
      addToast('❌ اسم المستخدم أو البريد الالكتروني مسجل مسبقاً!');
      return;
    }

    const newUser = {
      username: regUsername.trim(),
      email: regEmail.trim(),
      discordId: regDiscordId.trim(),
      password: regPassword,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('doo_registered_users', JSON.stringify(updatedUsers));

    // Auto login
    const userObj: UserAccount = {
      username: newUser.username,
      email: newUser.email,
      discordId: newUser.discordId,
      joinedDate: newUser.joinedDate
    };
    localStorage.setItem('doo_current_user', JSON.stringify(userObj));
    setCurrentUser(userObj);
    setUserOrders([]);
    setUserCreations([]);
    
    addToast('👑 تم إنشاء حسابك وتفعيله بنجاح! أهلاً بك في متجر Doo.');

    // Reset forms
    setRegUsername('');
    setRegEmail('');
    setRegDiscordId('');
    setRegPassword('');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('doo_current_user');
    setCurrentUser(null);
    setUserOrders([]);
    setUserCreations([]);
    addToast('🔓 تم تسجيل الخروج بنجاح! نراكم قريباً.');
  };

  // Submit Creation / Design Request
  const handleSubmitCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!creationTitle.trim() || !creationDescription.trim() || !creationBudget.trim()) {
      addToast('⚠️ الرجاء ملء كافة بيانات طلب الإنشاء!');
      return;
    }

    const categoriesAr = {
      server_setup: 'تجهيز سيرفر ديسكورد بالكامل',
      graphic_design: 'تصميم جرافيك وبنرات',
      custom_bot: 'برمجة بوت مخصص متكامل',
      effects_design: 'تصميم زينة وتأثيرات حساب مخصصة'
    };

    const newCreation: CreationRequest = {
      id: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
      username: currentUser.username,
      title: creationTitle.trim(),
      category: creationCategory,
      categoryAr: categoriesAr[creationCategory],
      description: creationDescription.trim(),
      budget: creationBudget.trim(),
      discordId: creationDiscord.trim() || currentUser.discordId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    const savedCreationsStr = localStorage.getItem('doo_user_creations');
    const creations = savedCreationsStr ? JSON.parse(savedCreationsStr) : [];
    
    const updatedCreations = [newCreation, ...creations];
    localStorage.setItem('doo_user_creations', JSON.stringify(updatedCreations));
    
    setUserCreations((prev) => [newCreation, ...prev]);
    setShowCreationForm(false);
    
    // Clear Form
    setCreationTitle('');
    setCreationDescription('');
    setCreationBudget('');
    setCreationDiscord('');
    
    addToast('🚀 تم تقديم طلب الإنشاء والتصميم الخاص بك! سيتم مراجعته من الإدارة فورا.');
  };

  const getStatusBadge = (status: CreationRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black">
            <Clock className="w-3 h-3 animate-spin" /> قيد المراجعة
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[10px] font-black">
            <Activity className="w-3 h-3 animate-pulse" /> جاري العمل عليه
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black">
            <CheckCircle className="w-3 h-3" /> تم اعتماده
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black">
            <Award className="w-3 h-3" /> تم تسليمه بنجاح
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black">
            <XCircle className="w-3 h-3" /> مرفوض أو مسترجع
          </span>
        );
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold">
            انتظار التحقق
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold">
            جاري التوصيل
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
            تم التوصيل 🎉
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">
            فشل الطلب
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto font-sans" dir="rtl">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: NOT LOGGED IN - LOGIN & REGISTER CONTAINER */}
        {!currentUser ? (
          <motion.div
            key="logged-out-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-[#1e1f22]/90 border border-discord-purple/20 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-6">
              
              {/* Backglow element */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-discord-purple/5 rounded-full filter blur-3xl"></div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-discord-purple/10 border border-discord-purple/20 flex items-center justify-center mx-auto text-discord-purple">
                <User className="w-7 h-7" />
              </div>

              {/* Title Header */}
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isRegister ? 'إنشاء حساب مستخدم جديد' : 'أهلاً بك في متجر Doo'}
                </h2>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  {isRegister 
                    ? 'سجل حسابك لتتمكن من تقديم طلبات الإنشاء والتصميم المخصصة ومتابعة مشترياتك.' 
                    : 'قم بتسجيل الدخول للاستفادة من استوديو التصاميم والمشاريع وتتبع أكواد التفعيل الخاصة بك.'}
                </p>
              </div>

              {/* TAB SWITCH BUTTONS */}
              <div className="grid grid-cols-2 gap-2 bg-discord-dark p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    !isRegister 
                      ? 'bg-discord-purple text-white font-black shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  تسجيل الدخول 🔑
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    isRegister 
                      ? 'bg-discord-purple text-white font-black shadow' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  إنشاء حساب جديد ✨
                </button>
              </div>

              {/* LOGIN FORM */}
              {!isRegister ? (
                <form onSubmit={handleLogin} className="space-y-4 text-right">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">اسم المستخدم أو البريد الإلكتروني:</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="أدخل بريدك أو اسم حسابك..."
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all"
                      />
                      <Mail className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">كلمة المرور الخاصة بحسابك:</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all text-left"
                        dir="ltr"
                      />
                      <Lock className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg glow-purple pt-3 pb-3"
                  >
                    تسجيل الدخول والوصول للمتجر 🚀
                  </button>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} className="space-y-4 text-right">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">اسم المستخدم (المستعار بالمتجر):</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="الاسم بالكامل أو اسمك المستعار..."
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all"
                      />
                      <User className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">البريد الإلكتروني:</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all text-left"
                        dir="ltr"
                      />
                      <Mail className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">اسم حساب ديسكورد (Discord Username):</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regDiscordId}
                        onChange={(e) => setRegDiscordId(e.target.value)}
                        placeholder="مثال: user_940y"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all text-left"
                        dir="ltr"
                      />
                      <Hash className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block pr-1">كلمة المرور:</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-discord-dark border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white outline-none focus:border-discord-purple transition-all text-left"
                        dir="ltr"
                      />
                      <Lock className="w-4 h-4 text-gray-500 absolute top-3.5 right-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-lg glow-purple"
                  >
                    تأكيد وإنشاء الحساب الآن 👑
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        ) : (
          
          /* VIEW 2: LOGGED IN - USER DASHBOARD */
          <motion.div
            key="logged-in-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header profile welcome banner */}
            <div className="bg-[#1e1f22]/95 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-discord-purple/5 rounded-full filter blur-3xl"></div>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right relative z-10">
                {/* Simulated Avatar with vibrant purple gradient background */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-discord-purple to-discord-fuchsia flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {currentUser.username.slice(0, 1).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>مرحباً بك، {currentUser.username}</span>
                    <Sparkles className="w-5 h-5 text-discord-fuchsia animate-pulse" />
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">📧 {currentUser.email}</span>
                    <span className="text-white/20 hidden sm:inline">|</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">🎮 @{currentUser.discordId}</span>
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

            {/* Grid statistics row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-discord-dark border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">عدد طلباتك المكتملة</p>
                  <p className="text-2xl font-black text-white mt-1">{userOrders.length} طلبات</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-discord-purple/10 border border-discord-purple/20 flex items-center justify-center text-discord-purple">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-discord-dark border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">مشاريعك والإنشاءات المخصصة</p>
                  <p className="text-2xl font-black text-white mt-1">{userCreations.length} إنشاءات</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-discord-fuchsia/10 border border-discord-fuchsia/20 flex items-center justify-center text-discord-fuchsia">
                  <PenTool className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-discord-dark border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">تاريخ انضمامك بالمتجر</p>
                  <p className="text-lg font-black text-white mt-1.5 font-mono">{currentUser.joinedDate}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-discord-green/10 border border-discord-green/20 flex items-center justify-center text-discord-green">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Dashboard content splitter: Left is Creations request area, Right is Orders history */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* LEFT COLUMN: CREATIONS STUDIO REQUESTS (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5.5 h-5.5 text-discord-fuchsia" />
                    <h3 className="font-extrabold text-white text-base">استوديو طلبات التصاميم والإنشاءات مخصصة</h3>
                  </div>
                  <button
                    onClick={() => setShowCreationForm(!showCreationForm)}
                    className="px-4 py-2 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-all"
                  >
                    {showCreationForm ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{showCreationForm ? 'إلغاء الطلب' : 'إنشاء طلب تصميم مخصص 🎨'}</span>
                  </button>
                </div>

                {/* CREATION STUDIO FORM */}
                {showCreationForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 rounded-2xl bg-discord-darker border border-discord-purple/30 text-right space-y-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs sm:text-sm">تقديم طلب إنشاء مخصص من الإدارة 🚀</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        اكتب تفاصيل ما تريد إنشائه بالكامل وسيقوم فريق مطوري ديسكورد وجرافيك متجر Doo بمراجعته وإعطائك الموافقة والبدء الفوري.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitCreation} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-gray-300 font-bold block">عنوان المشروع / الطلب:</label>
                          <input
                            type="text"
                            required
                            value={creationTitle}
                            onChange={(e) => setCreationTitle(e.target.value)}
                            placeholder="مثال: إنشاء سيرفر ألعاب متكامل مع حماية"
                            className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-discord-purple"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-gray-300 font-bold block">نوع الخدمة المطلوبة:</label>
                          <select
                            value={creationCategory}
                            onChange={(e: any) => setCreationCategory(e.target.value)}
                            className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-discord-purple"
                          >
                            <option value="server_setup">تجهيز سيرفر ديسكورد بالكامل</option>
                            <option value="graphic_design">تصميم جرافيك ولوحات بنر</option>
                            <option value="custom_bot">برمجة بوت مخصص متكامل</option>
                            <option value="effects_design">تصميم زينة وتأثيرات حساب مخصصة</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-gray-300 font-bold block">الميزانية المقترحة بالريال (اختياري):</label>
                          <input
                            type="text"
                            required
                            value={creationBudget}
                            onChange={(e) => setCreationBudget(e.target.value)}
                            placeholder="مثال: 150 ريال سعودي"
                            className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-discord-purple"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-gray-300 font-bold block">حساب ديسكورد للتواصل السريع:</label>
                          <input
                            type="text"
                            value={creationDiscord}
                            onChange={(e) => setCreationDiscord(e.target.value)}
                            placeholder={`إفتراضي: ${currentUser.discordId}`}
                            className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-discord-purple text-left font-mono"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-300 font-bold block">وصف وتفاصيل طلبك الإنشائي والمواصفات بالكامل:</label>
                        <textarea
                          required
                          rows={4}
                          value={creationDescription}
                          onChange={(e) => setCreationDescription(e.target.value)}
                          placeholder="الرجاء توضيح متطلبات الروم والوظائف المطلوبة بالكامل ليتم تسعيرها والعمل عليها فوراً من قبل الإدارة..."
                          className="w-full bg-discord-dark border border-white/10 rounded-xl py-2.5 px-3.5 text-white outline-none focus:border-discord-purple text-right text-xs leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-discord-purple hover:bg-[#4752c4] text-white text-xs font-black rounded-xl shadow-lg transition-all text-center flex items-center justify-center gap-1"
                      >
                        <Send className="w-4 h-4 shrink-0" />
                        <span>إرسال طلب الإنشاء والتصميم المخصص 🎨</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* USER CREATIONS LIST */}
                <div className="space-y-4">
                  {userCreations.length === 0 ? (
                    <div className="text-center py-12 bg-discord-dark/20 border border-white/5 rounded-2xl space-y-3">
                      <Compass className="w-12 h-12 text-gray-600 mx-auto animate-pulse" />
                      <h4 className="font-bold text-gray-400 text-sm">ليس لديك أي طلبات إنشاء وتصاميم بعد!</h4>
                      <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                        اضغط على زر (إنشاء طلب تصميم مخصص) في الأعلى لإرسال متطلباتك وسيقوم فريقنا ببرمجة بوتك أو سيرفرك بأعلى جودة.
                      </p>
                    </div>
                  ) : (
                    userCreations.map((creation) => (
                      <div 
                        key={creation.id} 
                        className="bg-discord-dark border border-white/5 p-5 rounded-2xl text-right space-y-4 hover:border-discord-fuchsia/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-white">{creation.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span>📁 الفئة: {creation.categoryAr}</span>
                              <span>•</span>
                              <span>📅 {creation.date}</span>
                            </div>
                          </div>
                          {getStatusBadge(creation.status)}
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed bg-[#1e1f22]/50 p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap">
                          {creation.description}
                        </p>

                        <div className="flex items-center justify-between gap-4 text-[11px] bg-discord-black/40 p-2.5 rounded-lg border border-white/5">
                          <span className="text-gray-400">
                            💰 الميزانية المقترحة: <span className="font-bold text-discord-fuchsia font-sans">{creation.budget}</span>
                          </span>
                          <span className="text-gray-400 font-mono text-[10px]" dir="ltr">
                            🆔 ID: {creation.id}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: ORDERS AND DELIVERIES (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShoppingBag className="w-5.5 h-5.5 text-discord-purple" />
                  <h3 className="font-extrabold text-white text-base">تاريخ المشتريات والطلبات</h3>
                </div>

                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 bg-discord-dark/20 border border-white/5 rounded-2xl space-y-3">
                      <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                      <h4 className="font-bold text-gray-400 text-sm">لا توجد مشتريات مسجلة!</h4>
                      <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                        عندما تشتري ديسكورد نيترو أو بوستات وتستخدم نفس بريدك الإلكتروني، ستظهر تفاصيل الأكواد والفواتير هنا فوراً!
                      </p>
                    </div>
                  ) : (
                    userOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="bg-discord-dark border border-white/5 p-4 rounded-xl text-right space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <span className="text-xs font-bold text-white font-mono">{order.id}</span>
                          {getOrderStatusBadge(order.status)}
                        </div>

                        {/* Items in order */}
                        <div className="space-y-1.5 text-xs text-gray-300">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/20 px-2.5 py-1.5 rounded border border-white/5">
                              <span>{item.product.nameAr}</span>
                              <span className="font-bold text-discord-purple">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-gray-400">📅 {order.date}</span>
                          <span className="text-white font-extrabold text-xs">{order.total} ريال سعودي</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
