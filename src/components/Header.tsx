import React from 'react';
import { ShoppingCart, Search, Menu, X, ShieldAlert, Sparkles, HelpCircle, MessageSquare, Terminal, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
  toggleAdmin: () => void;
  isAdminMode: boolean;
  categoryNames?: { nitro: string; boosts: string; effects: string; users_premium?: string; creations_custom?: string; old_accounts?: string };
}

export default function Header({
  cartItems,
  searchQuery,
  onSearchChange,
  onNavigate,
  currentView,
  toggleAdmin,
  isAdminMode,
  categoryNames
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'الرئيسية', view: 'home' },
    { label: 'المتجر 🛒', view: 'shop' },
    { label: categoryNames?.nitro || 'ديسكورد نيترو', view: 'nitro' },
    { label: categoryNames?.boosts || 'بوستات السيرفر', view: 'boosts' },
    { label: categoryNames?.effects || 'تأثيرات الملف', view: 'effects' },
    { label: categoryNames?.users_premium || 'يوزرات مميزة', view: 'users_premium' },
    { label: categoryNames?.creations_custom || 'إنشاءات', view: 'creations_custom' },
    { label: categoryNames?.old_accounts || 'حسابات قديمة ⏱️', view: 'old_accounts' },
    { label: 'طلباتي 📦', view: 'my_orders' },
    { label: 'الأسئلة الشائعة', view: 'faq' },
    { label: 'شروط الخدمة', view: 'terms' },
    { label: 'تواصل معنا', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-discord-black/85 backdrop-blur-md border-b border-white/5 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-discord-purple flex items-center justify-center text-white glow-purple transform rotate-3 hover:rotate-0 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse text-discord-fuchsia" />
            </div>
            <span className="text-xl sm:text-2xl font-black font-display text-white tracking-wider">
              متجر <span className="text-discord-purple">Doo</span>
            </span>
          </button>
        </div>

        {/* Center: Search & Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center max-w-2xl">
          {/* Advanced Search */}
          <div className="relative w-48 xl:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن منتجك المفضل..."
              className="w-full bg-discord-dark border border-white/5 hover:border-white/10 focus:border-discord-purple rounded-xl py-2 pr-9 pl-3 text-xs text-white placeholder-gray-500 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-500 absolute top-2.5 right-3" />
          </div>

          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentView === link.view
                    ? 'bg-discord-purple/20 text-discord-purple font-black'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Side: Cart, Admin Panel Icon, Hamburger Menu */}
        <div className="flex items-center gap-3">
          {/* Admin Panel Icon */}
          <button
            onClick={toggleAdmin}
            className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
              isAdminMode
                ? 'bg-discord-fuchsia/10 border-discord-fuchsia text-discord-fuchsia'
                : 'bg-discord-dark/50 border-white/5 text-gray-400 hover:text-white hover:border-discord-purple/40'
            }`}
            title="لوحة التحكم لإدارة المتجر"
          >
            <Terminal className="w-4.5 h-4.5" />
          </button>

          {/* User Profile Button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`p-2.5 rounded-xl cursor-pointer transition-all border relative ${
              currentView === 'profile'
                ? 'bg-discord-purple/20 border-discord-purple text-discord-purple'
                : 'bg-discord-dark/50 border-white/5 text-gray-400 hover:text-white hover:border-discord-purple/40'
            }`}
            title="حسابي والإنشاءات المخصصة"
          >
            <User className="w-4.5 h-4.5" />
          </button>

          {/* Cart Status Indicator */}
          <button
            onClick={() => onNavigate('cart')}
            className={`p-2.5 rounded-xl cursor-pointer transition-all border relative ${
              currentView === 'cart'
                ? 'bg-discord-purple/20 border-discord-purple text-discord-purple'
                : 'bg-discord-dark/50 border-white/5 text-gray-400 hover:text-white hover:border-discord-purple/40'
            }`}
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -left-1.5 bg-discord-fuchsia text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-discord-black">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-discord-dark/50 border border-white/5 text-gray-400 hover:text-white lg:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-discord-dark border-b border-white/5 px-4 py-4 space-y-4"
          >
            {/* Search Input on Mobile */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث عن ديسكورد نيترو، بوستات..."
                className="w-full bg-discord-darker border border-white/10 rounded-xl py-3 pr-10 pl-4 text-xs text-white placeholder-gray-500 outline-none"
              />
              <Search className="w-4.5 h-4.5 text-gray-500 absolute top-3.5 right-4.5" />
            </div>

            {/* Navigation links list */}
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => {
                    onNavigate(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl text-right text-xs font-bold transition-all cursor-pointer ${
                    currentView === link.view
                      ? 'bg-discord-purple text-white font-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
