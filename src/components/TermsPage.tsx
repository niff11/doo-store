import React from 'react';
import { ShieldCheck, Info, FileText, Video, Key, HelpCircle, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto font-sans text-right" dir="rtl" id="terms-page-container">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-discord-purple/10 border border-discord-purple/30 text-discord-purple text-xs font-semibold mb-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ShieldCheck className="w-4 h-4 text-discord-fuchsia" />
          <span>الاتفاقية القانونية للعملاء</span>
        </motion.div>
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          شروط الخدمة و <span className="text-discord-purple">سياسات الاسترجاع</span>
        </motion.h1>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto text-xs md:text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          مرحباً بك في متجر Doo. يُرجى قراءة شروط الاستخدام وسياسات الاسترجاع والخصوصية بعناية لضمان تجربة شرائية آمنة وسلسة.
        </motion.p>
      </div>

      {/* Grid of Terms */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Section 1: Introduction */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-discord-dark/40 border border-white/5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-discord-purple/15 text-discord-purple"><Info className="w-4 h-4" /></span>
            المقدمة والقبول بالاتفاقية
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            بمجرد زيارتك لمتجر Doo أو الشراء من خدماتنا، فإنك توافق التزاماً تاماً على الشروط والقوانين المنصوص عليها في هذه الصفحة. نحن نوفر خدمات تفعيل النيترو، وبوستات الديسكورد، وتأثيرات البروفايل بأعلى جودة وقنوات تسليم آمنة وتلقائية بالكامل.
          </p>
        </motion.div>

        {/* Section 2: Account Security */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-discord-dark/40 border border-white/5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-discord-purple/15 text-discord-purple"><Key className="w-4 h-4" /></span>
            أمان الحساب والخصوصية المشفرة
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            الخصوصية هي أولويتنا القصوى. نحن لا نطلب أي كلمات مرور لحسابات الديسكورد الخاصة بكم. يتم تسليم النيترو عبر هدايا رسمية مشفرة، والبوستات تتم عبر بوتات مرخصة ومؤمنة بالكامل. جميع عمليات الدفع وتخزين بيانات العملاء تتم عبر خوادم آمنة ومشفرة تماماً SSL 256-bit لمنع أي اختراق أو كشف للبيانات.
          </p>
        </motion.div>

        {/* Section 3: Delivery Warranty */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-discord-dark/40 border border-white/5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-discord-purple/15 text-discord-purple"><HeartHandshake className="w-4 h-4" /></span>
            الضمان والتسليم الفوري
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            نحن نلتزم بتقديم ضمان كامل طوال فترة الاشتراك (سواء شهر أو ثلاثة أشهر) لجميع أنواع النيترو والبوستات. التسليم سريع وتلقائي بالكامل بمجرد إتمام الدفع. في حال حدوث أي خلل فني نادر في الخدمة، يتم استبدالها فوراً عبر التواصل مع الدعم الفني.
          </p>
        </motion.div>

        {/* Section 4: Refund Condition (CRITICAL VIDEO CONDITION) */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-discord-purple/10 border border-discord-purple/30 space-y-4 glow-purple">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-discord-purple text-white animate-pulse">
              <Video className="w-5 h-5 text-discord-fuchsia" />
            </span>
            <h3 className="text-lg font-extrabold text-white">
              شرط الفيديو الإلزامي والضمان (هام جداً)
            </h3>
          </div>
          <div className="space-y-2.5 text-xs md:text-sm text-gray-200 leading-relaxed">
            <p className="font-bold text-discord-yellow">
              ⚠️ لضمان المصداقية التامة ومنعاً لأي سوء استخدام أو ادعاءات غير صحيحة، يرجى الالتزام التام بالشرط التالي:
            </p>
            <p className="bg-black/35 p-4 rounded-xl border border-white/10 font-black text-white text-sm leading-relaxed">
              "من شروط الضمان الأساسية يجب ان يكون لديك مقطع فيديو كامل وواضح عند استلام طلبك و تفعيله مع اظهار اسم مستخدم ديسكورد بوضوح وبدون أي تعديل أو انقطاع في الفيديو."
            </p>
            <p>
              لن يتم قبول أو النظر في أي شكوى أو مطالبة باسترجاع أو تعويض عن كود معطل أو مستخدم مسبقاً إذا لم يرفق العميل مقطع الفيديو المستمر بالضوابط المذكورة أعلاه. هذا الشرط يحمي حقوق المتجر القانونية وحقوق العميل الملتزم على حد سواء.
            </p>
          </div>
        </motion.div>

        {/* Section 5: Prohibited Activities */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-discord-dark/40 border border-white/5 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-discord-purple/15 text-discord-purple"><FileText className="w-4 h-4" /></span>
            الأنشطة المحظورة
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            يُحظر تماماً محاولة التلاعب ببوابات الدفع، أو إرسال وصولات دفع وهمية أو تحويلات ملغاة للتحقق اليدوي، أو محاولة قرصنة المتجر أو التشهير به دون التواصل مع الدعم وحل المشكلة. أي محاولة من هذا القبيل ستؤدي لحظر حساب العميل من المتجر وسحب كافة تراخيص التفعيل القانونية فوراً وطلب ملاحقته قانونياً.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer Support section */}
      <motion.div
        className="mt-12 p-8 rounded-2xl bg-discord-darker/60 border border-white/5 text-center space-y-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <HelpCircle className="w-10 h-10 text-discord-purple mx-auto animate-pulse" />
        <h4 className="text-base md:text-lg font-bold text-white">لديك استفسار قانوني أو تجاري؟</h4>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          إذا كان لديك أي سؤال يخص شروط الاستخدام أو واجهت مشكلة معقدة بالطلب، يرجى التوجه فوراً لفتح تذكرة بالدعم الفني بالديسكورد أو مراسلتنا عبر البريد الإلكتروني المعتمد.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
          <a
            href="https://discord.gg/h7a46w6bh3"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-xs font-bold text-white rounded-xl cursor-pointer transition-all w-full sm:w-auto text-center"
          >
            سيرفر الدعم (ديسكورد)
          </a>
          <a
            href="mailto:Ahmed.amk208@gmail.com"
            className="px-5 py-2.5 bg-discord-dark border border-white/10 hover:border-discord-purple text-xs font-bold text-white rounded-xl cursor-pointer transition-all w-full sm:w-auto text-center"
          >
            البريد المعتمد للأعمال
          </a>
        </div>
      </motion.div>
    </div>
  );
}
