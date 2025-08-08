import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import brandIdentityImg from "@/assets/brand-identity-portfolio.jpg";
import marketingDesignsImg from "@/assets/marketing-portfolio.jpg";
import socialMediaImg from "@/assets/social-media-portfolio.jpg";
import printAdsImg from "@/assets/print-ads-portfolio.jpg";
import digitalDesignsImg from "@/assets/digital-designs-portfolio.jpg";
import customDesignsImg from "@/assets/custom-designs-portfolio.jpg";
import logoDesignImg from "@/assets/services/logo-design.jpg";
import brandPackageImg from "@/assets/services/brand-package.jpg";
import brochureDesignImg from "@/assets/services/brochure-design.jpg";
import {
  Sparkles, CreditCard, Loader2, Lock, Calendar, Clock, ArrowRight, CheckCircle,
  Palette, Megaphone, MessageCircle, Printer, MonitorSmartphone, Wrench, Crown,
  IdCard, FileText, BookOpen, Package, Shirt, Gift, Edit3, Layout, Image, Layers,
  BadgeCheck, BarChart3, Mail, Star, Users, Zap, TrendingUp, Eye, Heart, Award,
  Download, Share2, Play, ChevronRight, ChevronDown, Filter, Search, Grid3X3,
  List, Shield, Target, Lightbulb, Brush, Rocket, Globe, Tablet, Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Enhanced catalog with more details, features, and testimonials
const enhancedCatalog = {
  "brand-identity": {
    title: "تصاميم الهوية البصرية",
    subtitle: "بناء هوية قوية ومتسقة ترسخ علامتك في أذهان عملائك",
    description: "نصمم هويات بصرية متكاملة تعكس شخصية علامتك التجارية وتميزها عن المنافسين. من الشعار إلى دليل الاستخدام الكامل.",
    hero: {
      stats: [
        { number: "500+", label: "هوية تم تصميمها" },
        { number: "95%", label: "رضا العملاء" },
        { number: "48", label: "ساعة متوسط التسليم" }
      ],
      features: [
        "تصميم فريد ومبتكر",
        "ملفات احترافية عالية الجودة",
        "دعم فني مجاني لمدة شهر",
        "تعديلات غير محدودة"
      ]
    },
    accent: {
      headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800",
      chip: "from-success to-success/80",
    },
    services: [
      { 
        name: "تصميم الشعار الاحترافي", 
        desc: "شعار فريد يعكس شخصية علامتك التجارية ويترك انطباعاً لا يُنسى",
        price: 1499, 
        originalPrice: 2000,
        delivery: "4-7 أيام", 
        complexity: "متوسط",
        image: logoDesignImg,
        features: [
          "3 مقترحات أولية مختلفة", 
          "تعديلات غير محدودة حتى الاعتماد",
          "ملفات مفتوحة ومتجهية (AI, EPS, SVG)",
          "نسخ بدقة عالية للطباعة والويب",
          "دليل استخدام مبسط"
        ],
        includes: ["PNG", "SVG", "AI", "EPS", "PDF"],
        popular: true,
        rating: 4.9,
        reviews: 127
      },
      { 
        name: "حزمة الهوية البصرية المتكاملة", 
        desc: "حل شامل لجميع احتياجات الهوية البصرية لشركتك أو مشروعك",
        price: 6999, 
        originalPrice: 9500,
        delivery: "2-3 أسابيع",
        complexity: "متقدم",
        features: [
          "تصميم شعار احترافي",
          "هوية مطبوعة ورقمية كاملة", 
          "دليل استخدام الهوية التفصيلي",
          "قوالب المراسلات والأوراق الرسمية",
          "تصميم بطاقات العمل",
          "أغلفة وسائل التواصل الاجتماعي"
        ],
        includes: ["كل الملفات المصدر", "دليل الهوية", "قوالب جاهزة"],
        premium: true,
        rating: 5.0,
        reviews: 89
      },
      { 
        name: "بطاقات الأعمال الأنيقة", 
        desc: "بطاقات أعمال تترك انطباعاً احترافياً وتعزز صورة علامتك التجارية",
        price: 249, 
        originalPrice: 350,
        delivery: "1-2 يوم",
        complexity: "بسيط",
        features: [
          "تصميمين مختلفين للاختيار", 
          "جاهز للطباعة بدقة عالية",
          "صياغة احترافية للمحتوى",
          "مقاسات عالمية ومحلية"
        ],
        includes: ["PDF للطباعة", "ملفات مصدر"],
        rating: 4.8,
        reviews: 234
      },
      { 
        name: "هوية المراسلات الرسمية", 
        desc: "تصميم أوراق رسمية ومغلفات تعزز الثقة والمصداقية",
        price: 449, 
        originalPrice: 600,
        delivery: "2-3 أيام", 
        complexity: "بسيط",
        features: [
          "تصميم خطابات رسمية", 
          "مغلفات بأحجام مختلفة",
          "إصدار رقمي جاهز للطباعة",
          "تنسيق احترافي"
        ],
        includes: ["PDF", "DOC", "ملفات الطباعة"],
        rating: 4.7,
        reviews: 156
      },
      { 
        name: "دليل الهوية البصرية", 
        desc: "دليل شامل لاستخدام الهوية البصرية بالطريقة الصحيحة",
        price: 2399, 
        originalPrice: 3200,
        delivery: "5-7 أيام",
        complexity: "متقدم",
        features: [
          "تحديد الألوان والخطوط الرسمية", 
          "الاستخدامات الصحيحة والخاطئة",
          "أمثلة تطبيقية متنوعة",
          "إرشادات للوسائط المختلفة"
        ],
        includes: ["PDF تفاعلي", "ملفات الألوان"],
        rating: 4.9,
        reviews: 67
      },
    ],
    testimonials: [
      {
        name: "أحمد المالكي",
        company: "شركة الابتكار التقني",
        text: "تصميم رائع ومتميز، الفريق محترف جداً وسريع في التنفيذ",
        rating: 5,
        avatar: "👨‍💼"
      },
      {
        name: "فاطمة العتيبي", 
        company: "مؤسسة النور التجارية",
        text: "أفضل استثمار لهوية شركتي، النتيجة فاقت التوقعات",
        rating: 5,
        avatar: "👩‍💼"
      }
    ],
    process: [
      { step: 1, title: "التشاور والفهم", desc: "نستمع لرؤيتك ونفهم احتياجاتك" },
      { step: 2, title: "البحث والإلهام", desc: "ندرس السوق ونجمع الإلهام" },
      { step: 3, title: "التصميم الأولي", desc: "ننشئ مقترحات متنوعة" },
      { step: 4, title: "التطوير والتحسين", desc: "نطور التصميم المختار" },
      { step: 5, title: "التسليم النهائي", desc: "نسلم جميع الملفات والمواد" }
    ]
  },
  "marketing-designs": {
    title: "التصاميم التسويقية",
    subtitle: "مواد تسويقية مؤثرة لرفع الوعي وزيادة التحويلات",
    description: "نصمم مواد تسويقية جذابة ومؤثرة تساعدك في الوصول لجمهورك المستهدف وتحقيق أهدافك التسويقية.",
    hero: {
      stats: [
        { number: "800+", label: "مادة تسويقية" },
        { number: "65%", label: "زيادة في التفاعل" },
        { number: "24", label: "ساعة متوسط التسليم" }
      ],
      features: [
        "تصاميم تفاعلية وجذابة",
        "محتوى مدروس ومؤثر",
        "تحسين للمنصات المختلفة",
        "تحليل أداء التصميم"
      ]
    },
    accent: { 
      headerBg: "bg-gradient-to-br from-rose-50 via-amber-50 to-primary/10 dark:from-slate-900 dark:via-slate-800 dark:to-primary/10", 
      chip: "from-success to-success/80" 
    },
    services: [
      { 
        name: "البروشور التفاعلي", 
        desc: "تعريف احترافي وشامل بخدماتك ومنتجاتك يجذب العملاء المحتملين",
        price: 749, 
        originalPrice: 1000,
        delivery: "3-5 أيام",
        complexity: "متوسط",
        features: [
          "تصميم احترافي متعدد الصفحات", 
          "محتوى مدروس ومنظم",
          "صور عالية الجودة", 
          "جاهز للطباعة والمشاركة الرقمية"
        ],
        includes: ["PDF عالي الدقة", "ملف المصدر", "نسخة ويب"],
        popular: true,
        rating: 4.8,
        reviews: 189
      },
      { 
        name: "تصميم الإعلانات الرقمية", 
        desc: "إعلانات جذابة لمنصات التواصل الاجتماعي ومحركات البحث",
        price: 499, 
        originalPrice: 700,
        delivery: "2-4 أيام",
        complexity: "بسيط",
        features: [
          "تصميمات متوافقة مع متطلبات المنصات",
          "رسائل تسويقية واضحة",
          "تنسيقات متعددة",
          "تحسين لزيادة التفاعل"
        ],
        includes: ["JPEG", "PNG", "ملفات المصدر"],
        rating: 4.7,
        reviews: 142
      },
      { 
        name: "تصميم اللافتات والبانرات", 
        desc: "تصاميم لافتات وبانرات إعلانية تلفت الانتباه",
        price: 899, 
        originalPrice: 1200,
        delivery: "5-7 أيام",
        complexity: "متقدم",
        features: [
          "تصميمات مخصصة حسب المكان والحجم",
          "استخدام ألوان جذابة",
          "توافق مع الطباعة الرقمية",
          "تعديلات حتى الرضا"
        ],
        includes: ["PDF للطباعة", "ملفات المصدر"],
        premium: true,
        rating: 4.9,
        reviews: 78
      }
    ],
    testimonials: [
      {
        name: "سعيد الحربي",
        company: "شركة النجاح للتسويق",
        text: "التصاميم ساعدتنا في زيادة المبيعات بشكل ملحوظ",
        rating: 5,
        avatar: "👨‍💼"
      },
      {
        name: "نورة القحطاني", 
        company: "مؤسسة الرؤية الحديثة",
        text: "فريق محترف وفهم عميق لاحتياجاتنا التسويقية",
        rating: 5,
        avatar: "👩‍💼"
      }
    ],
    process: [
      { step: 1, title: "فهم الهدف التسويقي", desc: "نحدد أهداف الحملة والجمهور المستهدف" },
      { step: 2, title: "تصميم المحتوى", desc: "ننشئ محتوى بصري ونصي جذاب" },
      { step: 3, title: "مراجعة وتعديل", desc: "نراجع التصميم مع العميل ونعدل حسب الملاحظات" },
      { step: 4, title: "التسليم والدعم", desc: "نسلم الملفات وندعم في الاستخدام الأمثل" }
    ]
  },
  // Add other categories with similar enhancement
  "social-media": {
    title: "تصاميم وسائل التواصل الاجتماعي",
    subtitle: "تواجد قوي وجذاب على كافة المنصات",
    description: "نصمم محتوى بصري متميز لوسائل التواصل الاجتماعي يزيد من تفاعل جمهورك ويعزز حضورك الرقمي.",
    hero: {
      stats: [
        { number: "1200+", label: "منشور مصمم" },
        { number: "80%", label: "زيادة في التفاعل" },
        { number: "12", label: "ساعة متوسط التسليم" }
      ],
      features: [
        "تصاميم تفاعلية مبتكرة",
        "محتوى مدروس لكل منصة",
        "قوالب قابلة للتعديل",
        "دعم جميع أحجام المنصات"
      ]
    },
    accent: { 
      headerBg: "bg-gradient-to-br from-violet-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", 
      chip: "from-success to-success/80" 
    },
    services: [
      { 
        name: "تصميم المنشورات", 
        desc: "قوالب جذابة ومتناسقة لجميع منصات التواصل الاجتماعي", 
        price: 149, 
        originalPrice: 200,
        delivery: "24-48 ساعة", 
        complexity: "بسيط",
        features: [
          "قوالب متعددة للاختيار", 
          "أبعاد جميع المنصات", 
          "ملفات قابلة للتعديل",
          "محتوى جذاب ومدروس"
        ],
        includes: ["PNG", "JPG", "PSD"],
        popular: true,
        rating: 4.8,
        reviews: 342
      }
    ],
    testimonials: [
      {
        name: "خالد العمري",
        company: "متجر الإلكترونيات الذكية",
        text: "تفاعل متابعينا زاد 200% بعد استخدام تصاميمهم",
        rating: 5,
        avatar: "👨‍💼"
      }
    ],
    process: [
      { step: 1, title: "تحليل المنصة", desc: "ندرس خصائص كل منصة ومتطلباتها" },
      { step: 2, title: "تصميم المحتوى", desc: "ننشئ تصاميم جذابة تناسب كل منصة" },
      { step: 3, title: "التسليم", desc: "نسلم الملفات بجميع الأحجام المطلوبة" }
    ]
  },
  "print-ads": {
    title: "التصاميم الإعلانية المطبوعة",
    subtitle: "تصاميم مطبوعة عالية الجودة للتأثير التقليدي الحديث",
    description: "نصمم إعلانات مطبوعة مؤثرة وجذابة تحقق الهدف التسويقي وتترك انطباعاً قوياً لدى الجمهور.",
    hero: {
      stats: [
        { number: "400+", label: "إعلان مطبوع" },
        { number: "90%", label: "جودة الطباعة" },
        { number: "5", label: "أيام متوسط التسليم" }
      ],
      features: [
        "دقة عالية للطباعة",
        "ألوان احترافية",
        "تصاميم مؤثرة",
        "مقاسات متعددة"
      ]
    },
    accent: { 
      headerBg: "bg-gradient-to-br from-amber-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", 
      chip: "from-success to-success/80" 
    },
    services: [
      { 
        name: "اللوحات الطرقية", 
        desc: "رسائل قوية على نطاق واسع تجذب الانتباه", 
        price: 1899, 
        originalPrice: 2500,
        delivery: "1-2 أسبوع", 
        complexity: "متقدم",
        features: [
          "أحجام متعددة", 
          "موك أب واقعي", 
          "ملفات جاهزة للطباعة",
          "تصميم يجذب الانتباه"
        ],
        includes: ["PDF", "AI", "تصميم ثلاثي الأبعاد"],
        rating: 4.9,
        reviews: 67
      }
    ],
    testimonials: [
      {
        name: "محمد الزهراني",
        company: "شركة البناء المتقدم",
        text: "لوحاتنا الإعلانية أصبحت تجذب عملاء أكثر",
        rating: 5,
        avatar: "👨‍💼"
      }
    ],
    process: [
      { step: 1, title: "دراسة الموقع", desc: "ندرس مكان وضع الإعلان" },
      { step: 2, title: "التصميم", desc: "ننشئ تصميماً يناسب المساحة" },
      { step: 3, title: "التسليم", desc: "نسلم ملفات جاهزة للطباعة" }
    ]
  },
  "digital-designs": {
    title: "التصاميم الرقمية",
    subtitle: "حلول رقمية متوافقة مع جميع الأجهزة والمنصات",
    description: "نصمم واجهات وتجارب رقمية استثنائية تجمع بين الجمال والوظائف العملية.",
    hero: {
      stats: [
        { number: "200+", label: "واجهة مصممة" },
        { number: "99%", label: "توافق الأجهزة" },
        { number: "7", label: "أيام متوسط التسليم" }
      ],
      features: [
        "تصميم متجاوب",
        "تجربة مستخدم ممتازة",
        "تحسين للأداء",
        "تصميم حديث"
      ]
    },
    accent: { 
      headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800", 
      chip: "from-success to-success/80" 
    },
    services: [
      { 
        name: "واجهات المواقع", 
        desc: "واجهات احترافية وسريعة تحقق أهدافك", 
        price: 3299, 
        originalPrice: 4500,
        delivery: "1-2 أسبوع", 
        complexity: "متقدم",
        features: [
          "تصميم صفحات رئيسية", 
          "نمط مكونات UI", 
          "توافق مع الجوال",
          "تحسين الأداء"
        ],
        includes: ["Figma", "HTML/CSS", "React Components"],
        premium: true,
        rating: 4.9,
        reviews: 89
      }
    ],
    testimonials: [
      {
        name: "عبدالله الشمري",
        company: "متجر إلكتروني",
        text: "الواجهة الجديدة زادت مبيعاتنا بنسبة 150%",
        rating: 5,
        avatar: "👨‍💼"
      }
    ],
    process: [
      { step: 1, title: "تحليل المتطلبات", desc: "نفهم احتياجاتك بدقة" },
      { step: 2, title: "التصميم", desc: "ننشئ تصميماً متجاوباً" },
      { step: 3, title: "التطوير", desc: "نحول التصميم لكود فعال" }
    ]
  },
  "custom-designs": {
    title: "التصاميم الخاصة",
    subtitle: "حلول مخصصة تلبي احتياجاتك الفردية بكفاءة",
    description: "نقدم حلول تصميم مخصصة وإبداعية لجميع احتياجاتك الخاصة.",
    hero: {
      stats: [
        { number: "300+", label: "تصميم مخصص" },
        { number: "100%", label: "حلول فريدة" },
        { number: "5", label: "أيام متوسط التسليم" }
      ],
      features: [
        "تصاميم فريدة",
        "حلول إبداعية",
        "جودة عالية",
        "أسعار تنافسية"
      ]
    },
    accent: { 
      headerBg: "bg-gradient-to-br from-teal-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", 
      chip: "from-success to-success/80" 
    },
    services: [
      { 
        name: "تصميم المنتجات والعلب", 
        desc: "تغليف يزيد جاذبية المنتج ويميزه", 
        price: 1999, 
        originalPrice: 2800,
        delivery: "1-2 أسبوع", 
        complexity: "متقدم",
        features: [
          "تصميم ثلاثي الأبعاد", 
          "مقترحات مواد", 
          "ملفات جاهزة للطباعة",
          "موك أب احترافي"
        ],
        includes: ["3D Design", "AI", "PDF"],
        rating: 4.8,
        reviews: 123
      }
    ],
    testimonials: [
      {
        name: "فاطمة الدوسري",
        company: "منتجات العناية الطبيعية",
        text: "التصميم الجديد للعبوات زاد إقبال العملاء بشكل كبير",
        rating: 5,
        avatar: "👩‍💼"
      }
    ],
    process: [
      { step: 1, title: "الاستشارة", desc: "نفهم رؤيتك الخاصة" },
      { step: 2, title: "التصميم المخصص", desc: "ننشئ حلولاً فريدة" },
      { step: 3, title: "التسليم", desc: "نسلم مع ضمان الجودة" }
    ]
  }
} as const;

type CatalogKey = keyof typeof enhancedCatalog;

const whatsappNumber = "966555812567";

export default function EnhancedDesignCategory() {
  const { slug } = useParams<{ slug: CatalogKey }>();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ name: string; price: number } | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'basic' | 'premium'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const heroRef = useRef<HTMLElement>(null);

  // Appointment dialog state
  const [apptOpen, setApptOpen] = useState(false);
  const [appt, setAppt] = useState({ date: "", time: "", note: "" });

  const data = enhancedCatalog[(slug as CatalogKey) || "brand-identity"];

  const serviceImages = {
    "brand-identity": brandIdentityImg,
    "marketing-designs": marketingDesignsImg,
    "social-media": socialMediaImg,
    "print-ads": printAdsImg,
    "digital-designs": digitalDesignsImg,
    "custom-designs": customDesignsImg,
  } as const;
  
  const currentImage = serviceImages[(slug as CatalogKey) || "brand-identity"];

  const iconMap = {
    "brand-identity": Palette,
    "marketing-designs": Megaphone,
    "social-media": MessageCircle,
    "print-ads": Printer,
    "digital-designs": MonitorSmartphone,
    "custom-designs": Wrench,
  } as const;
  const CatIcon: any = (iconMap as any)[(slug as CatalogKey) || "brand-identity"] || Sparkles;

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Filter services
  const filteredServices = data.services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'premium' && (service as any).premium) ||
                         (filterType === 'basic' && !(service as any).premium);
    return matchesSearch && matchesFilter;
  }) || [];

  // SEO
  useEffect(() => {
    const title = `${data.title} | حلول التصميم الاحترافية`;
    document.title = title;

    const desc = `${data.description} — خدمات تصميم احترافية بأسعار تنافسية وجودة عالية.`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + `/design-solutions/${slug}`;
  }, [slug, data.title, data.description]);

  const startPayment = async () => {
    if (!selected) return;
    if (!customer.name || !customer.email) {
      toast({ 
        title: "البيانات مطلوبة", 
        description: "يرجى إدخال الاسم والبريد الإلكتروني.", 
        variant: "destructive" 
      });
      return;
    }

    setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("paylink-payment", {
        body: {
          amount: selected.price,
          currency: "SAR",
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          offer_title: selected.name,
          description: `${data.title} - ${selected.name}`,
          success_url: window.location.origin,
        },
      });

      if (error) throw error;
      if (!resp?.payment_url) throw new Error("تعذر إنشاء رابط الدفع");

      toast({ 
        title: "إعادة التوجيه للدفع", 
        description: "سيتم فتح صفحة Paylink لإتمام العملية." 
      });
      window.open(resp.payment_url, "_blank");
      setOpen(false);
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: "فشل الدفع", 
        description: e.message || "حدث خطأ غير متوقع", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = () => {
    if (!appt.date || !appt.time) {
      toast({ 
        title: "أدخل الموعد", 
        description: "يرجى اختيار التاريخ والوقت", 
        variant: "destructive" 
      });
      return;
    }
    const msg = `مرحباً، أود حجز موعد لخدمة: ${selected?.name || data.title}\nالتاريخ: ${appt.date}\nالوقت: ${appt.time}\nملاحظات: ${appt.note || "-"}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setAppt({ date: "", time: "", note: "" });
    setApptOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Enhanced Hero Section */}
      <header 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-success/10 via-success/5 to-background dark:from-success/20 dark:via-slate-900 dark:to-slate-900"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-success/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${data.accent.chip} text-white text-sm font-medium shadow-lg`}>
                  <CatIcon className="w-4 h-4" />
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {data.title}
                </span>
                
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                    {data.title.split(' ')[0]}
                  </span>
                  <br />
                  <span className="text-foreground">
                    {data.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg">
                  {data.subtitle}
                </p>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-3 gap-6">
                {data.hero?.stats.map((stat, idx) => (
                  <div key={idx} className="text-center animate-on-scroll" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Hero Features */}
              <div className="space-y-3">
                {data.hero?.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-on-scroll" style={{ animationDelay: `${idx * 100}ms` }}>
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  <Eye className="w-5 h-5 ml-2" />
                  استعرض الخدمات
                  <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تحدث مع خبير
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in delay-300">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <AspectRatio ratio={4/3}>
                  <img
                    src={currentImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                
                {/* Floating elements */}
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-bounce">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9/5</span>
                  </div>
                  <div className="text-xs text-muted-foreground">تقييم العملاء</div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-success/90 text-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">+200%</span>
                  </div>
                  <div className="text-xs opacity-90">زيادة في الطلبات</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                الخدمات
              </TabsTrigger>
              <TabsTrigger value="process" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                العملية
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                التقييمات
              </TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-8">
              {/* Filters and Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between" dir="rtl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="ابحث في الخدمات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                      dir="rtl"
                    />
                  </div>
                  
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-4 py-2 rounded-lg border bg-background"
                  >
                    <option value="all">جميع الخدمات</option>
                    <option value="basic">الخدمات الأساسية</option>
                    <option value="premium">الخدمات المتميزة</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Services Grid/List */}
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredServices.map((service, idx) => (
                  <Card key={service.name} className={`group relative overflow-hidden border-2 border-success/10 hover:border-success/30 transition-all duration-500 hover:shadow-2xl animate-on-scroll ${
                    viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                  }`} style={{ animationDelay: `${idx * 100}ms` }}>
                    
                    {/* Service badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      {(service as any).popular && (
                        <Badge className="bg-yellow-500 text-black">
                          <Star className="w-3 h-3 ml-1" />
                          الأكثر طلباً
                        </Badge>
                      )}
                      {(service as any).premium && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Crown className="w-3 h-3 ml-1" />
                          متميز
                        </Badge>
                      )}
                    </div>

                    {/* Animated background elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-r from-success/10 to-primary/10 blur-2xl transition-all duration-700 group-hover:scale-150" />
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl transition-all duration-700 group-hover:scale-150" />
                    </div>

                    <div className={`relative ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                      {/* Image section */}
                      <AspectRatio ratio={16/9} className="relative overflow-hidden">
                        <img
                          src={(service as any).image || currentImage}
                          alt={service.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Price overlay */}
                        <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            {service.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {service.originalPrice} ر.س
                              </span>
                            )}
                            <span className="text-xl font-bold text-success">
                              {service.price} ر.س
                            </span>
                          </div>
                          {service.originalPrice && (
                            <div className="text-xs text-green-600">
                              وفر {service.originalPrice - service.price} ر.س
                            </div>
                          )}
                        </div>
                      </AspectRatio>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold group-hover:text-success transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.desc}
                            </p>
                          </div>
                        </div>

                        {/* Rating and reviews */}
                        {service.rating && (
                          <div className="flex items-center gap-2" dir="rtl">
                            <span className="text-sm text-muted-foreground">
                              ({service.reviews} تقييم) {service.rating}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${
                                    i < Math.floor(service.rating!) 
                                      ? 'text-yellow-500 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-success" />
                            {service.delivery}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-success" />
                            {service.complexity}
                          </div>
                        </div>

                        {/* Features list */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">المتضمن:</h4>
                          <ul className="space-y-1">
                            {service.features.slice(0, viewMode === 'list' ? service.features.length : 3).map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {viewMode === 'grid' && service.features.length > 3 && (
                              <li className="text-xs text-muted-foreground">
                                +{service.features.length - 3} المزيد...
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* File types */}
                        <div className="flex flex-wrap gap-1">
                          {service.includes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-4">
                          <Dialog open={open && selected?.name === service.name} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                className="flex-1 group"
                                onClick={() => setSelected({ name: service.name, price: service.price })}
                              >
                                <CreditCard className="w-4 h-4 ml-2" />
                                اطلب الآن
                                <ArrowRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>إتمام الطلب - {service.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="flex justify-between items-center">
                                    <span>السعر:</span>
                                    <span className="font-bold text-success">{service.price} ر.س</span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor="name">الاسم الكامل *</Label>
                                    <Input
                                      id="name"
                                      value={customer.name}
                                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={customer.email}
                                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input
                                      id="phone"
                                      value={customer.phone}
                                      onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                <Button 
                                  onClick={startPayment} 
                                  disabled={loading}
                                  className="w-full"
                                >
                                  {loading ? (
                                    <>
                                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                      جاري المعالجة...
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4 ml-2" />
                                      ادفع بأمان {service.price} ر.س
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={apptOpen && selected?.name === service.name} onOpenChange={setApptOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                onClick={() => setSelected({ name: service.name, price: service.price })}
                              >
                                <Calendar className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>حجز موعد استشارة</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="date">التاريخ</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={appt.date}
                                    onChange={(e) => setAppt(prev => ({ ...prev, date: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="time">الوقت</Label>
                                  <Input
                                    id="time"
                                    type="time"
                                    value={appt.time}
                                    onChange={(e) => setAppt(prev => ({ ...prev, time: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="note">ملاحظات إضافية</Label>
                                  <Input
                                    id="note"
                                    value={appt.note}
                                    onChange={(e) => setAppt(prev => ({ ...prev, note: e.target.value }))}
                                  />
                                </div>
                                <Button onClick={bookAppointment} className="w-full">
                                  <MessageCircle className="w-4 h-4 ml-2" />
                                  احجز عبر واتساب
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">كيف نعمل؟</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  نتبع منهجية مجربة ومطورة لضمان تحقيق أفضل النتائج لمشروعك
                </p>
              </div>

              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-success to-success/20 rounded-full hidden lg:block"></div>

                <div className="space-y-12">
                  {data.process?.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} animate-on-scroll`} style={{ animationDelay: `${idx * 200}ms` }}>
                      {/* Step content */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{step.title}</h3>
                          <p className="text-muted-foreground">{step.desc}</p>
                        </div>
                      </div>

                      {/* Step number */}
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {step.step}
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="flex-1 hidden lg:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">ماذا يقول عملاؤنا؟</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  شهادات حقيقية من عملاء راضين عن خدماتنا
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {data.testimonials?.map((testimonial, idx) => (
                  <Card key={idx} className="p-8 animate-on-scroll" style={{ animationDelay: `${idx * 200}ms` }}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-1" dir="rtl">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg italic">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center text-white text-xl">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-16 text-center space-y-8 animate-on-scroll">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">جاهز لبدء مشروعك؟</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                تواصل معنا اليوم واحصل على استشارة مجانية لمشروعك
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن ${data.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="px-8">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل عبر واتساب
                </Button>
              </a>
              <Button asChild size="lg" variant="outline" className="px-8">
                <Link to="/book-consultation">
                  <Calendar className="w-5 h-5 ml-2" />
                  احجز استشارة مجانية
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <Link 
                to="/design-solutions" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-success transition-colors story-link"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                العودة إلى جميع أقسام حلول التصميم
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
