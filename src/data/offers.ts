import { Gift, Star, Zap } from "lucide-react";

export type CurrentOffer = {
  id: number;
  title: string;
  description: string;
  originalPriceSAR: number;
  currentPriceSAR: number;
  discount: string;
  timeLeft: string;
  features: string[];
  badge: string;
  icon: typeof Zap;
  color: string; // tailwind gradient classes
  bgGradient: string; // tailwind gradient classes
};

export const currentOffers: CurrentOffer[] = [
  {
    id: 1,
    title: "باقة المواقع الكاملة",
    description: "موقع إلكتروني احترافي مع لوحة تحكم ونظام إدارة محتوى متكامل",
    originalPriceSAR: 15000,
    currentPriceSAR: 50,
    discount: "99%",
    timeLeft: "25 يوم",
    features: [
      "تصميم مخصص احترافي",
      "استضافة مجانية لسنة كاملة",
      "دعم فني 24/7",
      "تحسين محركات البحث SEO",
      "إدارة ومتابعة لمدة 6 شهور",
      "دعم فني شامل",
    ],
    badge: "الأكثر طلباً",
    icon: Zap,
    color: "from-blue-500 to-purple-600",
    bgGradient: "from-blue-50 to-purple-50",
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي",
    description: "خطة تسويقية شاملة لوسائل التواصل الاجتماعي مع إدارة احترافية",
    originalPriceSAR: 8000,
    currentPriceSAR: 5999,
    discount: "25%",
    timeLeft: "25 يوم",
    features: [
      "إدارة 5 منصات اجتماعية",
      "محتوى إبداعي شهري",
      "تقارير أداء تفصيلية",
      "استشارة تسويقية مجانية",
      "إدارة ومتابعة لمدة 6 شهور",
      "دعم فني متواصل",
    ],
    badge: "عرض محدود",
    icon: Star,
    color: "from-pink-500 to-red-600",
    bgGradient: "from-pink-50 to-red-50",
  },
  {
    id: 3,
    title: "كلمات مفتاحية قوية لموقعك SEO",
    description: "تحليل شامل وإعداد كلمات مفتاحية قوية لتحسين ظهور موقعك في محركات البحث",
    originalPriceSAR: 999,
    currentPriceSAR: 499,
    discount: "50%",
    timeLeft: "25 يوم",
    features: [
      "تحليل شامل للمنافسين",
      "بحث متقدم عن الكلمات المفتاحية",
      "تقرير مفصل بأفضل الكلمات",
      "استراتيجية SEO & SEM متكاملة",
      "تنفيذ من 4-6 أيام",
      "دعم فني لمدة شهر",
    ],
    badge: "متخصص",
    icon: Star,
    color: "from-orange-500 to-yellow-600",
    bgGradient: "from-orange-50 to-yellow-50",
  },
];
