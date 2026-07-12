import React, { useRef, useState } from 'react';
import { Order } from '../types';
import { Printer, ShieldCheck, Calendar, Hash, Tag, Coins, User, Check, Hourglass, Settings, AlertTriangle } from 'lucide-react';

interface OrderReceiptProps {
  order: Order;
  onClose: () => void;
}

export default function OrderReceipt({ order, onClose }: OrderReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const handlePrint = () => {
    // Hide everything except the receipt during print using temporary styles
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body {
            background: white !important;
            color: black !important;
            direction: rtl !important;
            font-family: sans-serif !important;
            padding: 20px !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-container {
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .thermal-dashed {
            border-color: #000000 !important;
          }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return {
          label: 'مكتمل ومفعل ✅',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          text: 'text-emerald-500'
        };
      case 'processing':
        return {
          label: 'قيد المعالجة والتنفيذ ⚙️',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          text: 'text-blue-500'
        };
      case 'failed':
        return {
          label: 'ملغي أو مرفوض ❌',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          text: 'text-rose-500'
        };
      case 'pending':
      default:
        return {
          label: 'قيد الانتظار والمراجعة ⏳',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          text: 'text-amber-500'
        };
    }
  };

  const statusStyle = getStatusBadge(order.status);
  const subtotal = order.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="max-w-md w-full my-8 bg-[#1e1f22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
        
        {/* Modal Controls */}
        <div className="p-4 bg-black/25 border-b border-white/5 flex items-center justify-between no-print">
          <h3 className="text-white font-extrabold text-xs sm:text-sm">إيصال وفاتورة الطلب 📄</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-discord-purple hover:bg-[#4752c4] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 text-right select-text receipt-container text-xs text-gray-300 font-sans" dir="rtl">
          
          {/* Header Receipt Style */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-full bg-discord-purple/10 border border-discord-purple/20 items-center justify-center text-discord-purple mb-1">
              <ShieldCheck className="w-6 h-6 text-discord-fuchsia animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-white">متجر DOO المعتمد</h2>
            <p className="text-[10px] text-gray-400 leading-relaxed">لخدمات ديسكورد والإنشاءات واليوزرات النادرة</p>
            <p className="text-[9px] text-gray-500 font-mono">https://discord.gg/h7a46w6bh3</p>
          </div>

          {/* Scissor Cutline */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-dashed border-white/10 thermal-dashed"></div>
            </div>
            <span className="relative px-3 text-[10px] text-gray-500 bg-[#1e1f22] font-mono no-print">✂----------------------------</span>
          </div>

          {/* Meta Grid */}
          <div className="bg-black/25 p-4 rounded-2xl border border-white/5 space-y-2.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-400 font-medium">رقم الفاتورة:</span>
              <span className="text-white font-mono font-bold tracking-wider select-all">{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-400 font-medium">تاريخ تقديم الطلب:</span>
              <span className="text-white font-mono font-semibold" dir="ltr">{order.date}</span>
            </div>
            {order.timestamp && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-400 font-medium">وقت وتاريخ الطلب بالضبط:</span>
                <span className="text-discord-fuchsia font-mono font-bold" dir="ltr">{order.timestamp}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-400 font-medium">حالة الطلب الحالية:</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${statusStyle.bg}`}>
                {statusStyle.label}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-[11px] border-r-4 border-discord-purple pr-2">معلومات العميل والمستلم:</h4>
            <div className="bg-black/15 p-3.5 rounded-xl border border-white/5 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-400">الاسم:</span>
                <span className="text-white font-semibold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">البريد الإلكتروني:</span>
                <span className="text-white font-mono break-all">{order.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ديسكورد المستلم:</span>
                <span className="text-discord-purple font-mono" dir="ltr">@{order.discordUsername}</span>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-[11px] border-r-4 border-discord-purple pr-2">الخدمات والمنتجات المطلوبة:</h4>
            <div className="divide-y divide-white/5 bg-black/10 rounded-xl border border-white/5 overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white text-[11px]">{item.product.nameAr}</p>
                    {item.selectedOption && (
                      <p className="text-[9px] text-discord-purple font-semibold font-sans">{item.selectedOption}</p>
                    )}
                    {item.serverLink && (
                      <p className="text-[9px] text-gray-400 font-mono" dir="ltr">رابط: {item.serverLink}</p>
                    )}
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-white font-bold font-sans">{item.product.price} ريال</p>
                    <p className="text-[10px] text-gray-500 font-sans">الكمية: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing totals */}
          <div className="border-t border-dashed border-white/10 thermal-dashed pt-4 space-y-2">
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>المجموع الفرعي:</span>
              <span className="font-semibold text-white font-sans">{subtotal} ريال</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>رسوم دعم وتوصيل تلقائي (5%):</span>
              <span className="font-semibold text-white font-sans">{tax} ريال</span>
            </div>
            <div className="flex justify-between items-center text-sm font-black text-white pt-2 border-t border-white/5">
              <span>الإجمالي النهائي:</span>
              <span className="text-discord-fuchsia font-sans text-base">{order.total} ريال سعودي</span>
            </div>
          </div>

          {/* Payment Method details */}
          <div className="p-3.5 bg-discord-dark rounded-xl border border-white/5 space-y-1">
            <p className="text-[10px] text-gray-400">طريقة الدفع المعتمدة:</p>
            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-white font-extrabold font-sans">
                {order.paymentMethod === 'apple_pay' ? 'Apple Pay ' :
                 order.paymentMethod === 'stc_pay' ? 'STC Pay 📱' :
                 order.paymentMethod === 'credit_card' ? 'بطاقة مدى/ائتمان 💳' : 'تحويل بنكي 🏦'}
              </span>
              {order.paymentDetails?.referenceNumber && (
                <span className="text-discord-purple font-mono font-bold">مرجع: #{order.paymentDetails.referenceNumber}</span>
              )}
            </div>

            {order.paymentDetails?.receiptUrl && (
              <div className="pt-2.5 mt-2 border-t border-white/5 space-y-1.5 no-print">
                <span className="text-[10px] text-gray-400 block font-bold">صورة إيصال السداد المرفقة:</span>
                <div className="relative group overflow-hidden rounded-lg border border-white/10 bg-black/35 flex items-center justify-center p-1.5">
                  <img
                    src={order.paymentDetails.receiptUrl}
                    alt="إيصال السداد"
                    className="max-h-28 object-contain rounded cursor-pointer hover:scale-105 transition-all duration-300"
                    onClick={() => setModalImageUrl(order.paymentDetails?.receiptUrl || null)}
                    referrerPolicy="no-referrer"
                  />
                  <div 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-none animate-fade-in"
                  >
                    <span className="text-[9px] text-white bg-black/75 px-2 py-1 rounded font-bold">تكبير الصورة 🔍</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Receipt Footer Message */}
          <div className="text-center space-y-3 pt-4 border-t border-dashed border-white/10 thermal-dashed">
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              شكرًا لتعاملك وتسوقك مع متجر Doo! 🤝
            </p>
            <div className="inline-block p-2 bg-white rounded-lg">
              {/* Simple simulated QR box */}
              <div className="w-16 h-16 bg-black flex items-center justify-center text-[6px] text-white text-center font-mono font-black select-none leading-none">
                DOO<br/>STORE<br/>SECURE<br/>SSL
              </div>
            </div>
            <p className="text-[8px] text-gray-500">تم إنتاج الفاتورة تلقائياً وهي معتمدة لضمان حقوقك واسترجاع أموالك.</p>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-black/25 border-t border-white/5 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/5"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>

      {/* Full Screen Image Modal */}
      {modalImageUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm no-print">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setModalImageUrl(null)}
              className="absolute -top-12 right-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer z-50"
            >
              إغلاق ✕
            </button>
            <img
              src={modalImageUrl}
              alt="إيصال السداد بالحجم الكامل"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
