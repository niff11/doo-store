import { Product, Review, FAQ } from './types';

// Official, clean, high-quality flat graphic images that match professional, standard stores!
const nitroImg = 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Discord_Nitro_logo.svg/512px-Discord_Nitro_logo.svg.png';
const boostImg = 'https://static.wikia.nocookie.net/discord/images/7/77/Server_Boosting.png';
const effectsImg = 'https://static.wikia.nocookie.net/discord/images/0/05/Avatar_Decorations.png';

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
    image: nitroImg,
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
    image: boostImg,
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
    image: effectsImg,
    benefits: [
      'Exclusive Avatar decorations',
      'Unique profile background effects',
      'Custom design requests accepted',
      'Fast delivery and easy activation'
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
