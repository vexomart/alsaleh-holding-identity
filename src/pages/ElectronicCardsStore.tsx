import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Gift,
  ShoppingCart,
  Star,
  CreditCard,
  MessageCircle,
  Sparkles,
  Award,
  CheckCircle,
  Clock,
  Heart,
  Share2,
  Play,
  Banknote,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Package,
  TrendingUp,
  Crown,
  Gamepad2,
  Music,
  Smartphone,
  Coffee,
  ShoppingBag,
  Wallet,
  Globe,
  Building,
  Phone,
  Menu,
  X,
  ChevronDown,
  Shield,
  Headphones,
  Info,
  HelpCircle,
  Mail,
  ArrowDown,
  ExternalLink,
  Users,
  ThumbsUp,
  RefreshCw,
  Eye,
  Home,
  Percent,
  CircleCheck,
  Flame,
  Diamond,
  Store,
  ShoppingBasket,
  Box,
  Layers,
  Download
} from "lucide-react";

const ElectronicCardsStore = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("جميع البطاقات");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const categoriesInView = useInView(categoriesRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = (card: any) => {
    const whatsappMessage = `🛍️ طلب شراء بطاقة إلكترونية

🎫 اسم البطاقة: ${card.name}
💰 السعر: ${card.price}
🏷️ السعر الأصلي: ${card.originalPrice || 'غير محدد'}
🎉 نسبة الخصم: ${card.discount || '0%'}
📂 الفئة: ${card.category}
⭐ التقييم: ${card.rating}/5 (${card.reviews} تقييم)
🚀 وقت التوصيل: ${card.deliveryTime}

🛒 أرغب في شراء هذه البطاقة الآن!
📱 متجر البطاقات الإلكترونية الذكي`;
    
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تم اختيار البطاقة!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  const handleShare = (card: any) => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `اكتشف ${card.name} بسعر خاص ${card.price} - متجر البطاقات الإلكترونية`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${card.name} - ${card.price} - ${window.location.href}`);
      toast({
        title: "📋 تم نسخ الرابط!",
        description: "تم نسخ تفاصيل البطاقة إلى الحافظة",
      });
    }
  };

  const toggleFavorite = (cardId: number) => {
    setFavorites(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
    toast({
      title: favorites.includes(cardId) ? "💔 تم الإزالة من المفضلة" : "❤️ تم الإضافة للمفضلة",
      description: favorites.includes(cardId) ? "تم إزالة البطاقة من قائمة المفضلة" : "تم حفظ البطاقة في المفضلة",
    });
  };

  const addToCart = (cardId: number) => {
    if (!cart.includes(cardId)) {
      setCart(prev => [...prev, cardId]);
      toast({
        title: "🛒 تم الإضافة للسلة!",
        description: "تم إضافة البطاقة إلى سلة التسوق",
      });
    }
  };

  const cards = [
    {
      id: 1,
      name: "بطاقة PlayStation Store",
      description: "بطاقة شحن متجر بلايستيشن للألعاب والمحتوى الرقمي الحصري مع أحدث الألعاب",
      category: "الألعاب",
      icon: Gamepad2,
      price: "50 ريال",
      originalPrice: "65 ريال",
      rating: 4.9,
      reviews: 342,
      image: "🎮",
      gradient: "from-blue-600 via-purple-600 to-indigo-800",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "23%",
      availability: "متوفر فوراً",
      tags: ["ألعاب", "بلايستيشن", "ترفيه", "حصري"],
      deliveryTime: "فوري",
      savings: "15 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 2,
      name: "بطاقة Apple Store & iTunes",
      description: "بطاقة هدايا متجر آبل للتطبيقات والموسيقى والأفلام والكتب والاشتراكات",
      category: "التطبيقات",
      icon: Smartphone,
      price: "100 ريال",
      originalPrice: "125 ريال",
      rating: 4.8,
      reviews: 289,
      image: "🍎",
      gradient: "from-gray-700 via-slate-800 to-black",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "20%",
      availability: "متوفر فوراً",
      tags: ["آبل", "تطبيقات", "موسيقى", "أفلام"],
      deliveryTime: "فوري",
      savings: "25 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 3,
      name: "بطاقة Spotify Premium",
      description: "اشتراك سبوتيفاي بريميوم للاستماع للموسيقى بدون إعلانات وبجودة عالية",
      category: "الموسيقى",
      icon: Music,
      price: "35 ريال",
      originalPrice: "45 ريال",
      rating: 4.7,
      reviews: 234,
      image: "🎵",
      gradient: "from-green-600 via-emerald-600 to-teal-700",
      isPopular: false,
      isFeatured: true,
      isNew: true,
      discount: "22%",
      availability: "متوفر فوراً",
      tags: ["موسيقى", "بريميوم", "سبوتيفاي", "بدون إعلانات"],
      deliveryTime: "فوري",
      savings: "10 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 4,
      name: "بطاقة Amazon Gift Card",
      description: "بطاقة هدايا أمازون للتسوق الإلكتروني من جميع أنحاء العالم مع شحن مجاني",
      category: "التسوق",
      icon: ShoppingBag,
      price: "200 ريال",
      originalPrice: "260 ريال",
      rating: 4.9,
      reviews: 456,
      image: "🛒",
      gradient: "from-orange-600 via-amber-600 to-yellow-700",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "23%",
      availability: "متوفر فوراً",
      tags: ["تسوق", "أمازون", "عالمي", "شحن مجاني"],
      deliveryTime: "فوري",
      savings: "60 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 5,
      name: "بطاقة Starbucks Coffee",
      description: "بطاقة هدايا ستاربكس للقهوة والمشروبات اللذيذة والحلويات الشهية",
      category: "المقاهي",
      icon: Coffee,
      price: "75 ريال",
      originalPrice: "95 ريال",
      rating: 4.6,
      reviews: 187,
      image: "☕",
      gradient: "from-green-800 via-emerald-900 to-teal-900",
      isPopular: false,
      isFeatured: false,
      isNew: false,
      discount: "21%",
      availability: "متوفر فوراً",
      tags: ["قهوة", "ستاربكس", "مشروبات", "حلويات"],
      deliveryTime: "فوري",
      savings: "20 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 6,
      name: "بطاقة Visa مدفوعة مسبقاً",
      description: "بطاقة فيزا مدفوعة مسبقاً للتسوق الآمن عبر الإنترنت مع حماية متقدمة",
      category: "البطاقات المصرفية",
      icon: CreditCard,
      price: "500 ريال",
      originalPrice: "530 ريال",
      rating: 4.8,
      reviews: 267,
      image: "💳",
      gradient: "from-purple-700 via-violet-800 to-indigo-900",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "6%",
      availability: "متوفر فوراً",
      tags: ["فيزا", "مصرفية", "آمنة", "حماية"],
      deliveryTime: "خلال ساعة",
      savings: "30 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 7,
      name: "بطاقة Netflix Premium",
      description: "اشتراك نتفليكس لمشاهدة الأفلام والمسلسلات عالية الجودة 4K بدون حدود",
      category: "الترفيه",
      icon: Play,
      price: "55 ريال",
      originalPrice: "70 ريال",
      rating: 4.9,
      reviews: 398,
      image: "🎬",
      gradient: "from-red-600 via-rose-700 to-pink-800",
      isPopular: true,
      isFeatured: true,
      isNew: false,
      discount: "21%",
      availability: "متوفر فوراً",
      tags: ["نتفليكس", "أفلام", "مسلسلات", "4K"],
      deliveryTime: "فوري",
      savings: "15 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 8,
      name: "بطاقة Google Play",
      description: "بطاقة جوجل بلاي للتطبيقات والألعاب والاشتراكات والكتب الرقمية",
      category: "التطبيقات",
      icon: Smartphone,
      price: "85 ريال",
      originalPrice: "105 ريال",
      rating: 4.7,
      reviews: 312,
      image: "📱",
      gradient: "from-green-600 via-blue-600 to-purple-700",
      isPopular: false,
      isFeatured: true,
      isNew: true,
      discount: "19%",
      availability: "متوفر فوراً",
      tags: ["جوجل", "تطبيقات", "ألعاب", "كتب"],
      deliveryTime: "فوري",
      savings: "20 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 9,
      name: "بطاقة Steam Wallet",
      description: "بطاقة ستيم للألعاب الرقمية والمحتوى الإضافي والعروض الخاصة",
      category: "الألعاب",
      icon: Gamepad2,
      price: "120 ريال",
      originalPrice: "145 ريال",
      rating: 4.8,
      reviews: 425,
      image: "🎮",
      gradient: "from-blue-800 via-indigo-800 to-purple-900",
      isPopular: true,
      isFeatured: false,
      isNew: false,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["ستيم", "ألعاب", "PC", "محتوى"],
      deliveryTime: "فوري",
      savings: "25 ريال",
      validUntil: "31/12/2024"
    },
    {
      id: 10,
      name: "بطاقة هدايا عامة مميزة",
      description: "بطاقة هدايا متعددة الاستخدامات لجميع المناسبات والأعياد الخاصة",
      category: "الهدايا",
      icon: Gift,
      price: "150 ريال",
      originalPrice: "185 ريال",
      rating: 4.6,
      reviews: 198,
      image: "🎁",
      gradient: "from-pink-600 via-rose-700 to-red-800",
      isPopular: false,
      isFeatured: false,
      isNew: false,
      discount: "19%",
      availability: "متوفر فوراً",
      tags: ["هدايا", "مناسبات", "عامة", "أعياد"],
      deliveryTime: "فوري",
      savings: "35 ريال",
      validUntil: "31/12/2024"
    }
  ];

  const categories = [
    { 
      name: "جميع البطاقات", 
      emoji: "🛍️", 
      count: cards.length,
      gradient: "from-primary via-blue-600 to-indigo-700",
      description: "جميع البطاقات المتاحة",
      icon: Store
    },
    { 
      name: "الألعاب", 
      emoji: "🎮", 
      count: cards.filter(c => c.category === "الألعاب").length,
      gradient: "from-blue-600 via-indigo-600 to-purple-700",
      description: "بطاقات الألعاب والمنصات",
      icon: Gamepad2
    },
    { 
      name: "التطبيقات", 
      emoji: "📱", 
      count: cards.filter(c => c.category === "التطبيقات").length,
      gradient: "from-purple-600 via-violet-600 to-fuchsia-700",
      description: "متاجر التطبيقات والبرامج",
      icon: Smartphone
    },
    { 
      name: "الموسيقى", 
      emoji: "🎵", 
      count: cards.filter(c => c.category === "الموسيقى").length,
      gradient: "from-green-600 via-emerald-600 to-teal-700",
      description: "منصات الموسيقى والاشتراكات",
      icon: Music
    },
    { 
      name: "التسوق", 
      emoji: "🛒", 
      count: cards.filter(c => c.category === "التسوق").length,
      gradient: "from-orange-600 via-amber-600 to-yellow-700",
      description: "متاجر التسوق الإلكتروني",
      icon: ShoppingBag
    },
    { 
      name: "المقاهي", 
      emoji: "☕", 
      count: cards.filter(c => c.category === "المقاهي").length,
      gradient: "from-amber-700 via-orange-800 to-brown-900",
      description: "سلاسل المقاهي والمشروبات",
      icon: Coffee
    },
    { 
      name: "البطاقات المصرفية", 
      emoji: "💳", 
      count: cards.filter(c => c.category === "البطاقات المصرفية").length,
      gradient: "from-slate-700 via-gray-800 to-zinc-900",
      description: "البطاقات المصرفية المدفوعة",
      icon: CreditCard
    },
    { 
      name: "الترفيه", 
      emoji: "🎬", 
      count: cards.filter(c => c.category === "الترفيه").length,
      gradient: "from-red-600 via-rose-700 to-pink-800",
      description: "منصات الفيديو والترفيه",
      icon: Play
    },
    { 
      name: "الهدايا", 
      emoji: "🎁", 
      count: cards.filter(c => c.category === "الهدايا").length,
      gradient: "from-pink-600 via-rose-700 to-red-800",
      description: "بطاقات الهدايا العامة",
      icon: Gift
    }
  ];

  const stats = [
    {
      title: "إجمالي البطاقات",
      value: `${cards.length}+`,
      icon: Package,
      gradient: "from-blue-600 to-indigo-700",
      emoji: "📦",
      description: "نوع مختلف من البطاقات",
      change: "+5 هذا الشهر"
    },
    {
      title: "العملاء السعداء",
      value: "25K+",
      icon: Users,
      gradient: "from-green-600 to-emerald-700",
      emoji: "👥",
      description: "عميل راضي عن خدماتنا",
      change: "+2.3K هذا الشهر"
    },
    {
      title: "متوسط التوفير",
      value: "22%",
      icon: TrendingUp,
      gradient: "from-purple-600 to-violet-700",
      emoji: "💎",
      description: "خصم على جميع البطاقات",
      change: "+4% تحسن"
    },
    {
      title: "التقييم العام",
      value: "4.8★",
      icon: Star,
      gradient: "from-orange-600 to-amber-700",
      emoji: "⭐",
      description: "من أصل 5 نجوم",
      change: "+0.2 هذا الشهر"
    }
  ];

  const features = [
    {
      title: "توصيل فوري مضمون",
      description: "احصل على بطاقتك خلال ثوان من الشراء مع ضمان الاستلام",
      icon: Zap,
      gradient: "from-yellow-600 to-orange-700",
      emoji: "⚡",
      benefits: ["توصيل خلال ثوان", "ضمان الاستلام", "بدون انتظار"]
    },
    {
      title: "أمان وحماية كاملة",
      description: "جميع البطاقات أصلية ومضمونة 100% مع تشفير متقدم",
      icon: Shield,
      gradient: "from-green-600 to-emerald-700",
      emoji: "🛡️",
      benefits: ["بطاقات أصلية", "تشفير متقدم", "ضمان شامل"]
    },
    {
      title: "دعم متواصل 24/7",
      description: "فريق الدعم المحترف متاح لمساعدتك في أي وقت على مدار الساعة",
      icon: Headphones,
      gradient: "from-blue-600 to-indigo-700",
      emoji: "🎧",
      benefits: ["دعم مباشر", "فريق محترف", "استجابة سريعة"]
    },
    {
      title: "أسعار لا تقاوم",
      description: "أفضل الأسعار في السوق مع ضمان فرق السعر واسترداد الأموال",
      icon: TrendingUp,
      gradient: "from-purple-600 to-violet-700",
      emoji: "💰",
      benefits: ["أفضل الأسعار", "ضمان فرق السعر", "عروض حصرية"]
    }
  ];

  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === "جميع البطاقات" || card.category === selectedCategory;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.reviews - a.reviews;
      case "price-low":
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      case "price-high":
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return a.isNew ? -1 : 1;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Header with Navigation */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-200/50 dark:border-slate-700/50" 
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Developer Attribution */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-2 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02]"></div>
          <div className="container mx-auto text-center relative">
            <motion.p 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs md:text-sm font-medium flex items-center justify-center gap-2"
            >
              <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
              🏢 تم تطوير هذا المتجر بواسطة{" "}
              <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-full hover:bg-blue-400/20 transition-colors">
                شركة علي صالح الشهري القابضة
              </span>
              <Crown className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 animate-bounce" />
            </motion.p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cards-store")}
            >
              <div className="relative">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  🛍️ متجر البطاقات الذكي
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  أفضل العروض والأسعار
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { name: "الرئيسية", href: "/", icon: Home },
                { name: "عن المتجر", href: "/cards-store/about", icon: Info },
                { name: "تواصل معنا", href: "/cards-store/contact", icon: Mail },
                { name: "الأسئلة الشائعة", href: "/cards-store/faq", icon: HelpCircle }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors font-medium group"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => document.getElementById('search-input')?.focus()}
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </motion.button>

              {/* WhatsApp */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                className="p-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.button>

              {/* Phone */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.open('tel:+966500000000', '_self')}
                className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
              >
                <Phone className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative py-20 md:py-32 overflow-hidden"
        variants={heroVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full opacity-20 animate-bounce-gentle"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Main Headline */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  متجر البطاقات الإلكترونية
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-slate-700 dark:text-slate-300">
                  الذكي والمتطور 🚀
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                اكتشف أكبر مجموعة من البطاقات الإلكترونية بأفضل الأسعار وأعلى جودة. توصيل فوري، أمان مضمون، ودعم على مدار الساعة
              </motion.p>
            </motion.div>

            {/* Hero Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                onClick={() => document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingCart className="w-5 h-5" />
                تسوق الآن
                <Sparkles className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 border border-slate-200 dark:border-slate-700"
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
              >
                <MessageCircle className="w-5 h-5" />
                تواصل معنا
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-20 relative"
        variants={containerVariants}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                لماذا نحن الأفضل؟ 🏆
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              نقدم لك تجربة تسوق استثنائية مع أحدث التقنيات وأفضل الخدمات
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/20 dark:border-slate-700/50 h-full hover:shadow-2xl transition-all duration-500">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        ref={categoriesRef}
        className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-100/50 dark:from-slate-800/50 dark:to-slate-900/50"
        variants={containerVariants}
        initial="hidden"
        animate={categoriesInView ? "visible" : "hidden"}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                تصفح الفئات 📂
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              اختر من مجموعة متنوعة من فئات البطاقات الإلكترونية
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer group ${selectedCategory === category.name ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/50 text-center hover:shadow-xl transition-all duration-300">
                  
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm md:text-base">
                    {category.name}
                  </h3>
                  
                  {/* Count Badge */}
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.count} بطاقة
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <motion.section className="py-8 sticky top-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="search-input"
                type="text"
                placeholder="ابحث عن البطاقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50"
              >
                <option value="popular">الأكثر شعبية</option>
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"} transition-colors`}
                >
                  <Layers className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"} transition-colors`}
                >
                  <Box className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "جميع البطاقات" || searchTerm) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">الفلاتر النشطة:</span>
              
              {selectedCategory !== "جميع البطاقات" && (
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setSelectedCategory("جميع البطاقات")}
                >
                  {selectedCategory} ✕
                </Badge>
              )}
              
              {searchTerm && (
                <Badge 
                  variant="outline"
                  className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setSearchTerm("")}
                >
                  "{searchTerm}" ✕
                </Badge>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* Cards Section */}
      <motion.section 
        id="cards-section"
        ref={cardsRef}
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        animate={cardsInView ? "visible" : "hidden"}
      >
        <div className="container mx-auto px-4">
          
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                البطاقات المتاحة 🎯
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {filteredCards.length > 0 
                ? `عرض ${filteredCards.length} من ${cards.length} بطاقة`
                : "لا توجد بطاقات تطابق البحث"
              }
            </p>
          </motion.div>

          {/* Cards Grid */}
          <AnimatePresence mode="wait">
            {filteredCards.length > 0 ? (
              <motion.div 
                key="cards-grid"
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
                }
                variants={containerVariants}
              >
                {sortedCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`group relative ${viewMode === "list" ? "md:flex md:gap-6" : ""}`}
                    layout
                  >
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-3xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden h-full group-hover:shadow-2xl transition-all duration-500">
                      
                      {/* Card Header */}
                      <div className={`relative bg-gradient-to-r ${card.gradient} p-6 text-white overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {card.isNew && (
                            <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-1">
                              <Sparkles className="w-3 h-3 mr-1" />
                              جديد
                            </Badge>
                          )}
                          {card.isPopular && (
                            <Badge className="bg-red-500 text-white border-0 text-xs px-2 py-1">
                              <Flame className="w-3 h-3 mr-1" />
                              شائع
                            </Badge>
                          )}
                          {card.isFeatured && (
                            <Badge className="bg-yellow-500 text-white border-0 text-xs px-2 py-1">
                              <Crown className="w-3 h-3 mr-1" />
                              مميز
                            </Badge>
                          )}
                        </div>

                        {/* Favorite & Share */}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(card.id)}
                            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(card.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShare(card)}
                            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            <Share2 className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>

                        {/* Card Icon & Category */}
                        <div className="relative z-10 text-center">
                          <div className="text-4xl mb-3">{card.image}</div>
                          <h3 className="font-bold text-xl mb-2 line-clamp-2">{card.name}</h3>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0">
                            {card.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                          {card.description}
                        </p>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(card.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {card.rating} ({card.reviews} تقييم)
                          </span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              {card.price}
                            </span>
                            {card.originalPrice && (
                              <span className="text-lg text-slate-400 line-through">
                                {card.originalPrice}
                              </span>
                            )}
                            {card.discount && (
                              <Badge className="bg-red-500 text-white">
                                -{card.discount}
                              </Badge>
                            )}
                          </div>
                          
                          {card.savings && (
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              💰 توفير {card.savings}
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Zap className="w-4 h-4 text-green-500" />
                            {card.deliveryTime}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Shield className="w-4 h-4 text-blue-500" />
                            {card.availability}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Clock className="w-4 h-4 text-orange-500" />
                            صالح حتى {card.validUntil}
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-6">
                          {card.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePurchase(card)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            شراء الآن
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addToCart(card.id)}
                            className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <ShoppingBasket className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                variants={itemVariants}
                className="text-center py-20"
              >
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  لم نجد أي بطاقات
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  جرب تغيير كلمات البحث أو الفئة المختارة
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("جميع البطاقات");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  مسح الفلاتر
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              إحصائيات مذهلة 📊
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              أرقام تتحدث عن نفسها وتؤكد ريادتنا في السوق
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center group"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500">
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                  <p className="text-blue-100 text-sm mb-3">{stat.description}</p>
                  
                  {stat.change && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.1]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              جاهز للبدء؟ 🚀
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء السعداء واحصل على أفضل البطاقات الإلكترونية بأسعار لا تقاوم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/966500000000', '_blank')}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر الواتساب
                <ExternalLink className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('tel:+966500000000')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                اتصل بنا مباشرة
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Links Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-blue-400">صفحات سريعة</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-slate-300 hover:text-white transition-colors">الرئيسية</Link>
                <Link to="/cards-store/about" className="block text-slate-300 hover:text-white transition-colors">عن المتجر</Link>
                <Link to="/cards-store/contact" className="block text-slate-300 hover:text-white transition-colors">تواصل معنا</Link>
                <Link to="/cards-store/faq" className="block text-slate-300 hover:text-white transition-colors">الأسئلة الشائعة</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-green-400">فئات البطاقات</h3>
              <div className="space-y-2">
                <button onClick={() => setSelectedCategory("الألعاب")} className="block text-slate-300 hover:text-white transition-colors text-left">الألعاب</button>
                <button onClick={() => setSelectedCategory("التطبيقات")} className="block text-slate-300 hover:text-white transition-colors text-left">التطبيقات</button>
                <button onClick={() => setSelectedCategory("الموسيقى")} className="block text-slate-300 hover:text-white transition-colors text-left">الموسيقى</button>
                <button onClick={() => setSelectedCategory("التسوق")} className="block text-slate-300 hover:text-white transition-colors text-left">التسوق</button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-purple-400">خدمات إضافية</h3>
              <div className="space-y-2">
                <Link to="/cards-store/terms" className="block text-slate-300 hover:text-white transition-colors">الشروط والأحكام</Link>
                <Link to="/cards-store/privacy" className="block text-slate-300 hover:text-white transition-colors">سياسة الخصوصية</Link>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">سياسة الاسترداد</a>
                <a href="#" className="block text-slate-300 hover:text-white transition-colors">ضمان الجودة</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-orange-400">تواصل معنا</h3>
              <div className="space-y-2 text-slate-300">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +966 50 000 0000
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@cards-store.com
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  دعم على مدار الساعة
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400 mb-4">
              © 2024 متجر البطاقات الإلكترونية الذكي. جميع الحقوق محفوظة.
            </p>
            <p className="text-sm text-slate-500">
              تم التطوير بواسطة شركة علي صالح الشهري القابضة 🏢
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicCardsStore;