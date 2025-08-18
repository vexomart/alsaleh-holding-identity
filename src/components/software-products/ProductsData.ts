import { 
  Car,
  Building,
  Megaphone,
  ShoppingCart,
  Palette,
  BarChart,
  Crown
} from "lucide-react";

export const products = [
  {
    id: 1,
    name: "🚗 موقع تأجير السيارات الذكي",
    description: "موقع تعريفي متكامل لشركة تأجير سيارات مع نظام حجز ذكي وواجهة مستخدم احترافية وتصميم حصري",
    category: "المواقع التعريفية",
    icon: Car,
    features: [
      "🎨 تصميم احترافي متجاوب ومتحرك",
      "📱 نظام حجز ذكي وتفاعلي",
      "🚙 عرض أسطول السيارات بتقنية ثلاثية الأبعاد",
      "👥 إدارة العملاء والحجوزات",
      "🔒 نظام دفع آمن متكامل",
      "📊 تقارير مالية تفصيلية"
    ],
    price: "50 ريال",
    rating: 4.9,
    downloads: "145",
    status: "متاح الآن",
    color: "from-blue-500 to-cyan-500",
    demoUrl: "/car-rental-landing",
    tags: ["React", "TypeScript", "Responsive", "AI-Powered"],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    emoji: "🚗",
    estimatedDelivery: "فوري",
    version: "V 1.0"
  },
  {
    id: 2,
    name: "🏗️ موقع شركة المقاولات العالمية",
    description: "موقع تعريفي متكامل لشركة مقاولات عالمية مع عرض احترافي للمشاريع والخدمات وأنيميشن متطور حصري",
    category: "المواقع التعريفية",
    icon: Building,
    features: [
      "🌍 تصميم عالمي احترافي متعدد اللغات",
      "🎞️ عرض المشاريع التفاعلي والمتحرك",
      "✨ أنيميشن متطور وحصري",
      "🗣️ نظام متعدد اللغات (عربي/إنجليزي)",
      "📋 نظام إدارة المحتوى المتقدم",
      "🖼️ معرض أعمال ديناميكي ثلاثي الأبعاد"
    ],
    price: "3599 ريال",
    rating: 5.0,
    downloads: "89",
    status: "متاح الآن",
    color: "from-emerald-500 to-teal-500",
    demoUrl: "/construction-website",
    tags: ["Global", "Construction", "Animated", "3D", "AI-Enhanced"],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    emoji: "🏗️",
    estimatedDelivery: "فوري",
    version: "V 1.0"
  },
  {
    id: 3,
    name: "📈 منصة التسويق الإلكتروني الذكية",
    description: "موقع متخصص في التسويق الإلكتروني والتجارة الرقمية مع أدوات تحليل متقدمة وذكاء اصطناعي",
    category: "التسويق الرقمي",
    icon: Megaphone,
    features: [
      "🤖 أدوات تحليل بالذكاء الاصطناعي",
      "📊 إدارة الحملات الإعلانية الذكية",
      "📱 التسويق عبر وسائل التواصل",
      "🔍 تحليل المنافسين المتقدم",
      "📈 تقارير مفصلة وتفاعلية",
      "💬 دعم فني متخصص على مدار الساعة"
    ],
    price: "3000 ريال",
    rating: 4.9,
    downloads: "234",
    status: "متاح الآن",
    color: "from-purple-500 to-pink-500",
    demoUrl: "/digital-marketing-website",
    tags: ["AI-Powered", "Marketing", "Analytics", "Social Media"],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    emoji: "📈",
    estimatedDelivery: "فوري",
    version: "V 1.0"
  },
  {
    id: 4,
    name: "🛍️ متجر البطاقات الإلكترونية الذكي",
    description: "متجر إلكتروني متطور لبيع البطاقات الرقمية مع نظام تحويل للواتساب وتصميم متجاوب وأنيميشن احترافي",
    category: "التجارة الإلكترونية",
    icon: ShoppingCart,
    features: [
      "🎮 مجموعة متنوعة من البطاقات الرقمية",
      "💬 تحويل تلقائي لواتساب للطلبات",
      "📱 تصميم متجاوب 100% مع جميع الأجهزة",
      "✨ أنيميشن وحركات احترافية متطورة",
      "🔍 نظام بحث وفلترة ذكي",
      "📊 إحصائيات تفاعلية ولوحة معلومات"
    ],
    price: "1799 ريال",
    rating: 4.9,
    downloads: "89",
    status: "متاح الآن",
    color: "from-green-500 to-emerald-500",
    demoUrl: "/electronic-cards-store",
    tags: ["E-commerce", "Cards", "WhatsApp", "Responsive"],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    emoji: "🛍️",
    estimatedDelivery: "فوري",
    version: "V 1.0"
  },
  {
    id: 5,
    name: "👑 متجر عبايتي",
    description: "متجر إلكتروني فاخر ومتكامل للعبايات العصرية مع تصميم عالمي مميز وتكامل مع الواتساب وتجربة تسوق استثنائية",
    category: "التجارة الإلكترونية",
    icon: Crown,
    features: [
      "👑 تصميم فاخر وعالمي حصري",
      "👗 أقسام متنوعة للعبايات العصرية",
      "💬 تكامل مع الواتساب للطلبات",
      "📱 تجربة تسوق متجاوبة 100%",
      "✨ أنيميشن وتأثيرات بصرية متطورة",
      "🏪 إدارة متكاملة للمخزون والطلبات"
    ],
    price: "3999 ريال",
    rating: 5.0,
    downloads: "12",
    status: "متاح الآن",
    color: "from-rose-500 to-pink-600",
    demoUrl: "/abayati-store",
    tags: ["Fashion", "E-commerce", "WhatsApp", "Luxury", "Abaya"],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    emoji: "👑",
    estimatedDelivery: "فوري",
    version: "V 1.0"
  }
];

export const categories = [
  { name: "جميع المنتجات", emoji: "🛍️", count: products.length },
  { name: "المواقع التعريفية", emoji: "🌐", count: 2 },
  { name: "التجارة الإلكترونية", emoji: "🛒", count: 2 },
  { name: "التسويق الرقمي", emoji: "📈", count: 1 }
];