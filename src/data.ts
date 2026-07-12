import { Product, Review, FAQ } from './types';
// Official, clean, high-quality flat graphic images that match professional, standard stores!

export const PRODUCTS: Product[] = [
  {
    id: 'nitro_monthly',
    name: 'Discord Nitro - 1 Month',
    nameAr: 'ديسكورد نيترو - شهر كامل',
    description: 'Get Discord Nitro premium features for a whole month with full warranty and fast activation.',
    descriptionAr: 'احصل على كامل مميزات ديسكورد نيترو القيّمة لمدة شهر كامل مع ضمان كامل وتفعيل سريع.',
    price: 19,
    originalPrice: 29,
    category: 'nitro',
    image: 'https://media.discordapp.net/attachments/956974533263376434/1525567095222436054/WhatsApبp_Image_2026-07-11_at_8.50.37_PM.jpeg?ex=6a548353&is=6a5331d3&hm=d0daed6c2bc2bb251018ed4df121f10450c9b55fc7c436cb59d10279af8a318d&=&format=webp&width=562&height=562',
    benefits: [
      'Custom emojis and stickers anywhere',
      'HD Streaming (1080p 60fps)',
      '500MB upload file size limit',
      '2 Free Server Boosts included',
      'Animated profile avatars and banners',
      'Custom profiles colors and themes'
    ],
    benefitsAr: [
      'إيموجي وملصقات مخصصة متحركة في كل مكان',
      'بث ألعاب وفيديو بدقة عالية 1080p 60fps',
      'زيادة حجم رفع الملفات إلى 500 ميجابايت',
      'الحصول على 2 بوست مجاني وتخفيض 30% على الباقي',
      'وضع صورة رمزية (Avatar) وغلاف متحرك للبروفايل',
      'تخصيص كامل لألوان بروفايلك والتايتل الخاص بك'
    ],
    stock: 84,
    rating: 4.9,
    reviewsCount: 312
  },
  {
    id: 'discord_boost',
    name: 'Discord Server Boost',
    nameAr: 'بوست سيرفر ديسكورد',
    description: 'Boost your Discord server instantly with high stability and full warranty.',
    descriptionAr: 'قم بترقية سيرفرك الخاص من خلال البوستات بشكل فوري ومستقر مع ضمان كامل لتتمتع بكل مميزات الترقية.',
    price: 15,
    originalPrice: 30,
    category: 'boosts',
    image: 'https://media.discordapp.net/attachments/956974533263376434/1525567095549722684/WhatsApp_Image_2026-07-11_at_8.50.37_PM_1.jpeg?ex=6a548353&is=6a5331d3&hm=0ea39781348557e513b77fcdc732cac0e41472fa740ebd2613fcbc2c55fbf561&=&format=webp&width=562&height=562',
    benefits: [
      'Unlock special Server features instantly',
      'High stability and fast activation',
      'No account credentials needed',
      'Guaranteed stability for 30 days'
    ],
    benefitsAr: [
      'تفعيل ميزات سيرفر الديسكورد فورياً',
      'تفعيل فوري وآمن وسريع جداً للبوستات',
      'ضمان واستقرار كامل للبوستات طوال المدة',
      'لا نحتاج إلى أي بيانات دخول لحسابك'
    ],
    stock: 99,
    rating: 4.8,
    reviewsCount: 120
  },
{
  id: 'discord_effects',
  name: 'Discord Profile Effects',
  nameAr: 'تأثيرات الملف الشخصي والبروفايل',
  description: 'Unique visual decorations for your Discord avatar and profile.',
  descriptionAr: 'تأثيرات وزخارف بصرية مذهلة لتزيين حسابك وإعطائه مظهراً فريداً وخاطفاً للأنظار.',
  price: 7,
  originalPrice: 18,
  category: 'effects',
  image: 'https://cdn.discordapp.com/attachments/956974533263376434/1525572540217426102/WhatsApp_Image_2026-07-11_at_9.40.21_PM.jpeg?ex=6a548865&is=6a5336e5&hm=062df72745aab37286a0c73faa12e68800584434e31934c010a26f793775ab0e&',
  benefits: [
    'Exclusive profile decorations',
    'Unique profile effects',
    'Instant activation',
    'Safe on your account'
  ],
  benefitsAr: [
    'زخارف وتأثيرات حصرية ومميزة لصورة بروفايلك',
    'تأثيرات خلفيات البروفايل الجاذبة للانتباه',
    'قبول طلبات التصاميم والزخارف المخصصة',
    'تسليم وتفعيل فوري على حسابك بكل سهولة وبأمان'
  ],
  stock: 999,
  rating: 4.7,
  reviewsCount: 78
},
  {
    id: 'old_creations',
    name: 'Classic/Old Discord Creations',
    nameAr: 'إنشاءات قديمة',
    description: 'Get vintage Discord servers, pre-configured structures, and classic server setups with full ownership.',
    descriptionAr: 'امتلك سيرفرات ديسكورد قديمة ومنشأة سابقاً، مهيأة بالكامل مع هيكلة كلاسيكية ونقل كامل للملكية والأمان.',
    price: 99,
    originalPrice: 199,
    category: 'creations_custom',
    image: 'https://cdn.discordapp.com/attachments/956974533263376434/1525594116518445258/3240899B-C365-4F98-B20F-3BEE3423F2CF.png?ex=6a549c7d&is=6a534afd&hm=21aa7ba7ae400e782bb3a1a05118707975be4cfd40e09b117f7b36adca4f1105&',
    benefits: [
      'Vintage creation server',
      'Fully structured roles and permissions',
      'Classic channels setup',
      'Instant ownership transfer'
    ],
    benefitsAr: [
      'تاريخ إنشاء قديم ومميز للسيرفر',
      'رتب وصلاحيات مهيكلة بالكامل',
      'رومات وتصنيفات كلاسيكية جاهزة',
      'نقل كامل وسريع للملكية وآمن ١٠٠٪'
    ],
    stock: 5,
    rating: 4.9,
    reviewsCount: 12
  },
  {
    id: 'old_accounts_creation',
    name: 'Old Discord Accounts Creation',
    nameAr: 'Old accounts',
    description: 'Creation of old Discord accounts from years 2015 to 2020 with full email access and high trust score.',
    descriptionAr: 'إنشاء حسابات ديسكورد قديمة (سنوات 2015 إلى 2020) مجهزة بالكامل مع بريد إلكتروني أساسي ونسبة ثقة عالية.',
    price: 4,
    originalPrice: 10,
    category: 'old_accounts',
    image: '',
    benefits: [
      'Vintage creation date (2015-2018)',
      'Full original email access included',
      'No previous bans or warnings',
      'Highly secure and immediate delivery'
    ],
    benefitsAr: [
      'تاريخ إنشاء قديم ومميز (2015 إلى 2018)',
      'تسليم مع الإيميل الأساسي للحساب بالكامل',
      'خالي من أي بلاغات أو مخالفات سابقة',
      'آمن جداً ومحمي بضمان المتجر الفوري'
    ],
    stock: 12,
    rating: 4.9,
    reviewsCount: 45
  },
  {
    id: 'bot_programming',
    name: 'Custom Discord Bot Programming',
    nameAr: 'برمجة بوتات مخصصة',
    description: 'Professional custom Discord bot development tailored to your server requirements.',
    descriptionAr: 'تصميم وبرمجة بوتات ديسكورد متكاملة ومخصصة بالكامل (حماية، ألعاب، رتب، إدارة، ترحيب) حسب رغبتك.',
    price: 0,
    originalPrice: 0,
    priceOnRequest: true,
    category: 'creations_custom',
    image: 'https://cdn.discordapp.com/attachments/956974533263376434/1525594325235536104/51AE3E65-8B09-43BB-9398-BB3EF3D0D098.png?ex=6a549caf&is=6a534b2f&hm=25bcedf1caeba469d94134f581738c21fb01c7d68e9729cc6c44bfb1112a7c2a&',
    benefits: [
      'Custom features & modules',
      'High performance & uptime',
      'Web dashboard integration',
      'Free hosting support'
    ],
    benefitsAr: [
      'ميزات مخصصة متكاملة حسب طلبك',
      'أداء عالي وثبات ٢٤ ساعة دون انقطاع',
      'إمكانية الربط بلوحة تحكم ويب',
      'دعم الاستضافة المجانية للبوت'
    ],
    stock: 99,
    rating: 4.8,
    reviewsCount: 25
  },
  {
    id: 'server_editing',
    name: 'Discord Server Setup & Editing',
    nameAr: 'تعديل سيرفرات ديسكورد',
    description: 'Full decoration, structuring, and security implementation for new or existing Discord servers.',
    descriptionAr: 'تنسيق وتصميم كامل وتعديل سيرفرات ديسكورد (سيرفرات ألعاب، مجتمعات، متاجر) من رتب ورومات وحماية أسطورية.',
    price: 0,
    originalPrice: 0,
    priceOnRequest: true,
    category: 'creations_custom',
    image: 'https://cdn.discordapp.com/attachments/956974533263376434/1525573290221899938/A0F8AC86-D20C-4C40-906F-5619D890D82C.png?ex=6a548918&is=6a533798&hm=fb47b39d34e85086770a9accd8151c18715f3ae1e248ee9466e7e6aaae1bf502&',
    benefits: [
      'Complete roles & channels setup',
      'Advanced auto-moderation systems',
      'Professional widgets & aesthetics',
      'Full technical support'
    ],
    benefitsAr: [
      'تجهيز وتنسيق الرومات والرتب بالكامل',
      'تفعيل أنظمة الحماية التلقائية المتقدمة',
      'تصميم مظهري ولوحة ترحيب احترافية',
      'دعم فني وتدريب على الإدارة مجاني'
    ],
    stock: 99,
    rating: 4.9,
    reviewsCount: 37
  },
  {
    id: 'user_cool_940',
    name: 'Premium Discord Username @940y',
    nameAr: 'sold out',
    description: 'Ultra-rare premium 3-character Discord username available for immediate transfer.',
    descriptionAr: '',
    price: 150,
    originalPrice: 300,
    category: 'users_premium',
    image: 'https://cdn.discordapp.com/attachments/956974533263376434/1525602049977487510/EEDA174D-3FAB-44A0-B14D-1F95B4B9BA1A.png?ex=6a54a3e1&is=6a535261&hm=8f85d1eb2985f6da80bc9298cf0154eebc5937d0458a269a51440bd697f65b51&',
    benefits: [
      'Rare 4-letter/3-character tag',
      'Safe transfer with no risk',
      'Immediate delivery',
      'Full guarantee'
    ],
    benefitsAr: [
      'يوزر ثلاثي مميز وحصري جداً',
      'نقل آمن تماماً بدون أي نسبة خطر',
      'تسليم فوري خلال دقائق',
      'ضمان شامل لملكية اليوزر مدى الحياة'
    ],
    stock: 1,
    rating: 5.0,
    reviewsCount: 8
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    username: 'عبدالرحمن الشهري',
    rating: 5,
    comment: 'متجر Doo فعلاً الأسرع! اشتريت نيترو وتم التفعيل تلقائياً في أقل من دقيقة. السعر خيالي والدعم متعاون جداً.',
    date: '2026-07-09',
    verifiedPurchase: true,
    likes: 42,
    productName: 'ديسكورد نيترو - شهر كامل'
  },
  {
    id: 'rev_2',
    username: 'سلطان الحربي',
    rating: 5,
    comment: 'البوستات سريعة جداً، شريت 14 بوست لسيرفري وتفعل ليفل 3 فوراً وبدون أي مشاكل. يستاهل كل ريال!',
    date: '2026-07-08',
    verifiedPurchase: true,
    likes: 27,
    productName: '14 بوست سيرفر - 3 أشهر (ليفل 3)'
  },
  {
    id: 'rev_3',
    username: 'خالد العنزي',
    rating: 5,
    comment: 'الخصوصية والأمان عالي، والدفع سريع جداً بمدى. يعجبني توضيح شروط الضمان وتصوير الفيديو عشان المصداقية.',
    date: '2026-07-06',
    verifiedPurchase: true,
    likes: 19,
    productName: 'ديسكورد نيترو - شهر كامل'
  },
  {
    id: 'rev_4',
    username: 'سارة القحطاني',
    rating: 4,
    comment: 'تأثيرات البروفايل تجنن والخدمة سريعة حسب الطلب. تواصلت مع الدعم بالديسكورد وكان الرد سريع جداً.',
    date: '2026-07-05',
    verifiedPurchase: true,
    likes: 8,
    productName: 'تأثيرات الملف الشخصي والبروفايل'
  },
  {
    id: 'rev_5',
    username: 'فيصل العتيبي',
    rating: 5,
    comment: 'أفضل متجر لخدمات ديسكورد بالشرق الأوسط بلا منازع. أكثر من 5000 عميل وأنا واحد منهم ودايماً اشتري من عندهم.',
    date: '2026-07-03',
    verifiedPurchase: true,
    likes: 35,
    productName: 'ديسكورد نيترو - شهر كامل'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq_1',
    question: 'ما هو وقت التسليم المتوقع للخدمات؟',
    answer: 'جميع خدماتنا من نيترو وبوستات يتم تسليمها وتفعيلها بشكل تلقائي وفوري بمجرد إتمام الدفع بنجاح. ستتلقى كود التفعيل أو رابط التسليم في رسالة نصية وبريد إلكتروني فوراً، ويمكنك متابعته أيضاً من سلة المشتريات وحالة الطلب.',
    category: 'التسليم والضمان'
  },
  {
    id: 'faq_2',
    question: 'ما هي شروط الضمان والاسترجاع لخدمات النيترو؟',
    answer: 'لضمان حق العميل وحق المتجر بالكامل، نوفر ضمان تفعيل بنسبة 100%. شرط الضمان الأساسي هو: "يجب على العميل تسجيل مقطع فيديو يبدأ من لحظة استلام الكود وحتى تفعيله، مع ضرورة إظهار اسم المستخدم (Username) بوضوح في المقطع لضمان صحة المطالبة بالاسترجاع". لا يمكن قبول أي شكوى بدون هذا الفيديو.',
    category: 'التسليم والضمان'
  },
  {
    id: 'faq_3',
    question: 'هل أحتاج لإعطائكم بيانات حسابي لتفعيل البوستات أو النيترو؟',
    answer: 'كلا، نحن لا نطلب إطلاقاً اسم المستخدم أو كلمة المرور الخاصة بحسابك في ديسكورد. بالنسبة للنيترو يتم تسليمه كود هدية (Gift link)، وبالنسبة للبوستات يتم إرسال حسابات البوتات تلقائياً لتقوم بالدخول وسيرفرك وعمل البوستات فوراً دون أي خطر على حسابك.',
    category: 'طرق التفعيل'
  },
  {
    id: 'faq_4',
    question: 'ما هي طرق الدفع المتوفرة والمشفرة بالمتجر؟',
    answer: 'نوفر قنوات دفع آمنة ومشفرة بالكامل 100% تشمل: البطاقات البنكية (مدى، فيزا، ماستركارد)، Apple Pay، STC Pay، بالإضافة إلى التحويل البنكي المباشر (مصرف الراجحي أو البنك الأهلي السعودي) مع رفع صورة الإيصال للتحقق السريع.',
    category: 'الدفع والأمان'
  }
];
