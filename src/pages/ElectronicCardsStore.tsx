import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
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
  RefreshCw
} from "lucide-react";

const ElectronicCardsStore = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("جميع البطاقات");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const heroControls = useAnimation();

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  const statsControls = useAnimation();

  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible");
    }
  }, [heroInView, heroControls]);

  useEffect(() => {
    if (statsInView) {
      statsControls.start("visible");
    }
  }, [statsInView, statsControls]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = (card: any) => {
    const whatsappMessage = `🎯 طلب شراء بطاقة جديدة!

🎫 اسم البطاقة: ${card.name}
💰 السعر: ${card.price}
🏷️ السعر الأصلي: ${card.originalPrice || 'غير محدد'}
🎁 نسبة الخصم: ${card.discount || '0%'}
📂 الفئة: ${card.category}

🛒 أريد شراء هذه البطاقة الآن!`;
    
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تم اختيار البطاقة بنجاح!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  const handleShare = (card: any) => {
    if (navigator.share) {
      navigator.share({
        title: card.name,
        text: `تحقق من هذه البطاقة الرائعة: ${card.name} بسعر ${card.price}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${card.name} - ${card.price} - ${window.location.href}`);
      toast({
        title: "تم نسخ الرابط!",
        description: "تم نسخ تفاصيل البطاقة إلى الحافظة",
      });
    }
  };

  const cards = [
    {
      id: 1,
      name: "🎮 بطاقة PlayStation Store",
      description: "بطاقة شحن متجر بلايستيشن للألعاب والمحتوى الرقمي الحصري",
      category: "الألعاب",
      icon: Gamepad2,
      price: "50 ريال",
      originalPrice: "60 ريال",
      rating: 4.9,
      reviews: 245,
      image: "🎮",
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      isPopular: true,
      isFeatured: true,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["ألعاب", "بلايستيشن", "ترفيه"],
      deliveryTime: "فوري"
    },
    {
      id: 2,
      name: "🍎 بطاقة Apple Store",
      description: "بطاقة هدايا متجر آبل للتطبيقات والموسيقى والأفلام والكتب",
      category: "التطبيقات",
      icon: Smartphone,
      price: "100 ريال",
      originalPrice: "120 ريال",
      rating: 4.8,
      reviews: 189,
      image: "🍎",
      gradient: "from-gray-600 via-slate-700 to-black",
      isPopular: true,
      isFeatured: false,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["آبل", "تطبيقات", "موسيقى"],
      deliveryTime: "فوري"
    },
    {
      id: 3,
      name: "🎵 بطاقة Spotify Premium",
      description: "اشتراك سبوتيفاي بريميوم للاستماع للموسيقى بدون إعلانات",
      category: "الموسيقى",
      icon: Music,
      price: "30 ريال",
      originalPrice: "40 ريال",
      rating: 4.7,
      reviews: 167,
      image: "🎵",
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      isPopular: false,
      isFeatured: true,
      discount: "25%",
      availability: "متوفر فوراً",
      tags: ["موسيقى", "بريميوم", "سبوتيفاي"],
      deliveryTime: "فوري"
    },
    {
      id: 4,
      name: "🛒 بطاقة Amazon",
      description: "بطاقة هدايا أمازون للتسوق الإلكتروني من جميع أنحاء العالم",
      category: "التسوق",
      icon: ShoppingBag,
      price: "200 ريال",
      originalPrice: "250 ريال",
      rating: 4.9,
      reviews: 312,
      image: "🛒",
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      isPopular: true,
      isFeatured: true,
      discount: "20%",
      availability: "متوفر فوراً",
      tags: ["تسوق", "أمازون", "عالمي"],
      deliveryTime: "فوري"
    },
    {
      id: 5,
      name: "☕ بطاقة Starbucks",
      description: "بطاقة هدايا ستاربكس للقهوة والمشروبات اللذيذة",
      category: "المقاهي",
      icon: Coffee,
      price: "75 ريال",
      originalPrice: "90 ريال",
      rating: 4.6,
      reviews: 98,
      image: "☕",
      gradient: "from-green-700 via-emerald-800 to-teal-900",
      isPopular: false,
      isFeatured: false,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["قهوة", "ستاربكس", "مشروبات"],
      deliveryTime: "فوري"
    },
    {
      id: 6,
      name: "💳 بطاقة Visa مدفوعة مسبقاً",
      description: "بطاقة فيزا مدفوعة مسبقاً للتسوق الآمن عبر الإنترنت",
      category: "البطاقات المصرفية",
      icon: CreditCard,
      price: "500 ريال",
      originalPrice: "520 ريال",
      rating: 4.8,
      reviews: 156,
      image: "💳",
      gradient: "from-purple-500 via-violet-600 to-indigo-700",
      isPopular: true,
      isFeatured: true,
      discount: "4%",
      availability: "متوفر فوراً",
      tags: ["فيزا", "مصرفية", "آمنة"],
      deliveryTime: "خلال ساعة"
    },
    {
      id: 7,
      name: "🎬 بطاقة Netflix",
      description: "اشتراك نتفليكس لمشاهدة الأفلام والمسلسلات عالية الجودة",
      category: "الترفيه",
      icon: Play,
      price: "45 ريال",
      originalPrice: "55 ريال",
      rating: 4.9,
      reviews: 278,
      image: "🎬",
      gradient: "from-red-500 via-rose-600 to-pink-700",
      isPopular: true,
      isFeatured: true,
      discount: "18%",
      availability: "متوفر فوراً",
      tags: ["نتفليكس", "أفلام", "مسلسلات"],
      deliveryTime: "فوري"
    },
    {
      id: 8,
      name: "🎁 بطاقة هدايا عامة",
      description: "بطاقة هدايا متعددة الاستخدامات لجميع المناسبات الخاصة",
      category: "الهدايا",
      icon: Gift,
      price: "150 ريال",
      originalPrice: "180 ريال",
      rating: 4.7,
      reviews: 134,
      image: "🎁",
      gradient: "from-pink-500 via-rose-600 to-red-700",
      isPopular: false,
      isFeatured: false,
      discount: "17%",
      availability: "متوفر فوراً",
      tags: ["هدايا", "مناسبات", "عامة"],
      deliveryTime: "فوري"
    }
  ];

  const categories = [
    { 
      name: "جميع البطاقات", 
      emoji: "🛍️", 
      count: cards.length,
      color: "from-primary to-blue-600",
      description: "تصفح جميع البطاقات المتاحة"
    },
    { 
      name: "الألعاب", 
      emoji: "🎮", 
      count: cards.filter(c => c.category === "الألعاب").length,
      color: "from-blue-500 to-indigo-600",
      description: "بطاقات الألعاب والمنصات"
    },
    { 
      name: "التطبيقات", 
      emoji: "📱", 
      count: cards.filter(c => c.category === "التطبيقات").length,
      color: "from-purple-500 to-violet-600",
      description: "متاجر التطبيقات والبرامج"
    },
    { 
      name: "الموسيقى", 
      emoji: "🎵", 
      count: cards.filter(c => c.category === "الموسيقى").length,
      color: "from-green-500 to-emerald-600",
      description: "منصات الموسيقى والاشتراكات"
    },
    { 
      name: "التسوق", 
      emoji: "🛒", 
      count: cards.filter(c => c.category === "التسوق").length,
      color: "from-orange-500 to-amber-600",
      description: "متاجر التسوق الإلكتروني"
    },
    { 
      name: "المقاهي", 
      emoji: "☕", 
      count: cards.filter(c => c.category === "المقاهي").length,
      color: "from-amber-700 to-orange-800",
      description: "سلاسل المقاهي والمشروبات"
    },
    { 
      name: "البطاقات المصرفية", 
      emoji: "💳", 
      count: cards.filter(c => c.category === "البطاقات المصرفية").length,
      color: "from-slate-600 to-gray-700",
      description: "البطاقات المصرفية المدفوعة"
    },
    { 
      name: "الترفيه", 
      emoji: "🎬", 
      count: cards.filter(c => c.category === "الترفيه").length,
      color: "from-red-500 to-rose-600",
      description: "منصات الفيديو والترفيه"
    },
    { 
      name: "الهدايا", 
      emoji: "🎁", 
      count: cards.filter(c => c.category === "الهدايا").length,
      color: "from-pink-500 to-rose-600",
      description: "بطاقات الهدايا العامة"
    }
  ];

  const stats = [
    {
      title: "إجمالي البطاقات",
      value: `${cards.length}+`,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      emoji: "📦",
      description: "نوع مختلف من البطاقات"
    },
    {
      title: "العملاء السعداء",
      value: "15K+",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      emoji: "👥",
      description: "عميل راضي عن خدماتنا"
    },
    {
      title: "متوسط التوفير",
      value: "18%",
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-600",
      emoji: "💎",
      description: "خصم على جميع البطاقات"
    },
    {
      title: "التقييم العام",
      value: "4.8",
      icon: Star,
      gradient: "from-orange-500 to-amber-600",
      emoji: "⭐",
      description: "من أصل 5 نجوم"
    }
  ];

  const features = [
    {
      title: "توصيل فوري",
      description: "احصل على بطاقتك خلال دقائق من الشراء",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-600",
      delay: 0
    },
    {
      title: "أمان مضمون",
      description: "جميع البطاقات أصلية ومضمونة 100%",
      icon: Shield,
      gradient: "from-green-500 to-emerald-600",
      delay: 0.2
    },
    {
      title: "دعم على مدار الساعة",
      description: "فريق الدعم متاح لمساعدتك في أي وقت",
      icon: Headphones,
      gradient: "from-blue-500 to-indigo-600",
      delay: 0.4
    },
    {
      title: "أسعار تنافسية",
      description: "أفضل الأسعار مع ضمان فرق السعر",
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-600",
      delay: 0.6
    }
  ];

  const navigationItems = [
    { name: "الرئيسية", href: "/cards-store" },
    { name: "عن المتجر", href: "/cards-store/about" },
    { name: "تواصل معنا", href: "/cards-store/contact" },
    { name: "الأسئلة الشائعة", href: "/cards-store/faq" },
    { name: "الشروط والأحكام", href: "/cards-store/terms" },
    { name: "سياسة الخصوصية", href: "/cards-store/privacy" }
  ];

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === "جميع البطاقات" || card.category === selectedCategory;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="container mx-auto text-center relative">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm font-medium flex items-center justify-center gap-2"
          >
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة{" "}
            <span className="text-blue-400 font-bold bg-blue-400/10 px-2 py-1 rounded-full">
              شركة علي صالح الشهري القابضة
            </span>
            <Crown className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 animate-bounce" />
          </motion.p>
        </div>
      </div>

      {/* Navigation Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-200 dark:border-slate-700" 
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cards-store")}
            >
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  🛍️ متجر البطاقات الإلكترونية
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                  المتجر الأول والأكثر ثقة في المملكة
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => {
                    const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  <span className="hidden sm:inline">💬 واتساب</span>
                  <span className="sm:hidden">💬</span>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden py-16 md:py-24"
        initial="hidden"
        animate={heroControls}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-100/30 dark:from-primary/10 dark:via-slate-900 dark:to-slate-800"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        <div className="relative container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium mb-6 md:mb-8 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 animate-pulse" />
            🎯 متجر البطاقات الإلكترونية الأول في المملكة
            <Award className="w-4 md:w-5 h-4 md:h-5 animate-bounce" />
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 leading-tight"
          >
            🛍️ متجر البطاقات{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              الإلكترونية المتطور
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8 md:mb-12"
          >
            🎮 اكتشف أفضل مجموعة من البطاقات الإلكترونية والرقمية للألعاب والتطبيقات والخدمات 
            بأسعار تنافسية وضمان الجودة والأمان
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-2xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
              onClick={() => {
                document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🛒 تصفح البطاقات الآن
              <ArrowDown className="w-4 md:w-5 h-4 md:h-5 mr-2 animate-bounce" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-500/5 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              onClick={() => {
                const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن متجر البطاقات الإلكترونية";
                window.open(whatsappUrl, '_blank');
              }}
            >
              <MessageCircle className="w-4 md:w-5 h-4 md:h-5 ml-2 animate-pulse" />
              💬 تواصل معنا
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={feature.delay}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 lg:px-6 space-y-16">
        {/* Statistics */}
        <motion.section
          ref={statsRef}
          initial="hidden"
          animate={statsControls}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="hover:shadow-2xl transition-all duration-500 border-2 backdrop-blur-sm bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 overflow-hidden">
                  <CardContent className="p-4 md:p-6 relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className="flex flex-col items-center text-center relative">
                      <div className={`w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-3 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl md:text-3xl">{stat.emoji}</span>
                      </div>
                      <p className="text-xs md:text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-primary mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Categories & Search */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl"
        >
          <div className="flex flex-col space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="🔍 ابحث في البطاقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 md:pl-6 pr-12 md:pr-14 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-sm md:text-base font-medium transition-all duration-300"
              />
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative p-4 rounded-2xl text-center transition-all duration-300 overflow-hidden ${
                    selectedCategory === category.name 
                      ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white shadow-2xl scale-105" 
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="text-2xl mb-2">{category.emoji}</div>
                    <div className="text-sm font-bold mb-1">{category.name}</div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        selectedCategory === category.name 
                          ? "bg-white/20 text-white" 
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Cards Section */}
        <motion.section
          id="cards-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                🎴 {selectedCategory === "جميع البطاقات" ? "جميع البطاقات المتاحة" : selectedCategory}
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
                {selectedCategory === "جميع البطاقات" 
                  ? "استكشف مجموعتنا المتنوعة من البطاقات الإلكترونية عالية الجودة"
                  : categories.find(c => c.name === selectedCategory)?.description
                }
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-lg">
              {filteredCards.length} بطاقة متوفرة
            </Badge>
          </div>

          {/* Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {filteredCards.map((card, index) => {
              const IconComponent = card.icon;
              
              return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group cursor-pointer"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-xl relative">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {card.isPopular && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-pulse text-xs">
                          🔥 الأكثر طلباً
                        </Badge>
                      )}
                      {card.isFeatured && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg text-xs">
                          ⭐ مميز
                        </Badge>
                      )}
                    </div>
                    
                    {card.discount && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl font-bold shadow-lg animate-bounce text-xs">
                          💸 خصم {card.discount}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="relative pb-4 text-center">
                      <div className={`w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl mx-auto`}>
                        <span className="text-3xl">{card.image}</span>
                      </div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {card.name}
                      </CardTitle>
                      <CardDescription className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 relative">
                      {/* Price & Rating */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">{card.price}</span>
                            {card.originalPrice && (
                              <span className="text-sm text-slate-500 line-through">{card.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{card.rating}</span>
                            <span className="text-xs text-slate-500">({card.reviews})</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {card.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <Clock className="w-4 h-4" />
                            <span>🚀 {card.deliveryTime}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>{card.availability}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handlePurchase(card)}
                          className={`flex-1 bg-gradient-to-r ${card.gradient} hover:shadow-lg text-white font-bold transition-all duration-300 hover:scale-105`}
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          اشتري الآن
                        </Button>
                        <Button 
                          onClick={() => handleShare(card)}
                          variant="outline" 
                          size="sm"
                          className="px-3 hover:scale-105 transition-transform"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Results */}
          {filteredCards.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                لم نجد أي بطاقات
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                جرب البحث بكلمات مختلفة أو اختر فئة أخرى
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("جميع البطاقات");
                }}
                className="bg-gradient-to-r from-primary to-blue-600"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة تعيين البحث
              </Button>
            </motion.div>
          )}
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              💬 هل تحتاج مساعدة أو لديك استفسار؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              فريقنا المتخصص جاهز لمساعدتك على مدار الساعة للإجابة على جميع أسئلتك وتقديم أفضل الحلول
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-4 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                💬 تواصل عبر واتساب
              </Button>
              <Button 
                size="lg"
                onClick={() => window.open('tel:+966500000000', '_blank')}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5 ml-2" />
                📞 اتصل بنا
              </Button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-slate-900 text-white mt-20 py-16"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">متجر البطاقات الإلكترونية</h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                المتجر الأول والأكثر ثقة في المملكة العربية السعودية لبيع البطاقات الإلكترونية والرقمية.
              </p>
              <div className="flex gap-2">
                {[
                  { name: "واتساب", color: "bg-green-600", url: "https://wa.me/966500000000" },
                  { name: "تويتر", color: "bg-blue-500", url: "#" },
                  { name: "انستغرام", color: "bg-pink-600", url: "#" }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300`}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-bold mb-4">فئات البطاقات</h4>
              <ul className="space-y-2">
                {categories.slice(1, 6).map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => setSelectedCategory(category.name)}
                      className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                      <span>{category.emoji}</span>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4">معلومات التواصل</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-slate-400">+966 50 000 0000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-slate-400">info@cards-store.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-slate-400">دعم 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-slate-400">المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 متجر البطاقات الإلكترونية. جميع الحقوق محفوظة. 
              <span className="text-primary font-bold"> شركة علي صالح الشهري القابضة</span>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ElectronicCardsStore;