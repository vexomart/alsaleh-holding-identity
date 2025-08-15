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
  User,
  Play,
  Layers,
  Box,
  ExternalLink
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

📋 تفاصيل الطلب:
• البطاقة: ${card.title}
• الفئة: ${card.category}
• السعر: ${card.price}

💳 نوع البطاقة: ${card.cardType}
🏷️ الخصم: ${card.discount}

أرغب في إتمام عملية الشراء الآن. شكراً لكم.`;

    const whatsappUrl = `https://wa.me/966555000123?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم إرسال طلبك!",
      description: "سيتم التواصل معك عبر الواتساب لإتمام عملية الشراء",
      duration: 3000,
    });
  };

  const handleAddToFavorites = (cardId: number) => {
    setFavorites(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
    
    toast({
      title: favorites.includes(cardId) ? "تم إزالة البطاقة من المفضلة" : "تم إضافة البطاقة للمفضلة",
      duration: 2000,
    });
  };

  const handleAddToCart = (cardId: number) => {
    setCart(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
    
    toast({
      title: "تم إضافة البطاقة للسلة",
      duration: 2000,
    });
  };

  // Enhanced Cards data with more products and real images
  const cards = [
    {
      id: 1,
      title: "بطاقة نتفلكس بريميوم - شهر واحد",
      price: "58 ريال",
      originalPrice: "75 ريال",
      discount: "23% خصم",
      category: "ترفيه",
      cardType: "نتفلكس",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop",
      rating: 4.9,
      reviews: 3847,
      description: "استمتع بجودة 4K وأربع شاشات متزامنة مع خطة نتفلكس بريميوم",
      features: ["تفعيل فوري خلال دقائق", "يعمل في جميع البلدان العربية", "ضمان استرداد 30 يوم", "دعم فني 24/7"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 2,
      title: "بطاقة PlayStation Store - 200 ريال",
      price: "190 ريال",
      originalPrice: "200 ريال",
      discount: "5% خصم",
      category: "ألعاب",
      cardType: "PlayStation",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop",
      rating: 4.8,
      reviews: 2923,
      description: "بطاقة شحن PlayStation Store بقيمة 200 ريال للحسابات السعودية",
      features: ["تفعيل فوري", "للحسابات السعودية فقط", "صالحة لجميع الألعاب والمحتوى", "لا تنتهي الصلاحية"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 3,
      title: "بطاقة Amazon Prime Gaming",
      price: "285 ريال",
      originalPrice: "320 ريال",
      discount: "11% خصم",
      category: "تسوق",
      cardType: "Amazon",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      rating: 4.7,
      reviews: 1856,
      description: "اشتراك أمازون برايم مع ميزات الألعاب المجانية والشحن السريع",
      features: ["شحن مجاني سريع", "ألعاب مجانية شهرية", "مسلسلات وأفلام حصرية", "تخزين صور لامحدود"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 4,
      title: "بطاقة Google Play - 150 ريال",
      price: "142 ريال",
      originalPrice: "150 ريال",
      discount: "5% خصم",
      category: "تطبيقات",
      cardType: "Google Play",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      rating: 4.8,
      reviews: 4134,
      description: "بطاقة شحن Google Play للتطبيقات والألعاب والاشتراكات",
      features: ["للتطبيقات والألعاب", "اشتراكات المواقع", "الكتب والأفلام", "محتوى رقمي متنوع"],
      isHot: false,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 5,
      title: "بطاقة Steam Wallet - 50 دولار",
      price: "188 ريال",
      originalPrice: "200 ريال",
      discount: "6% خصم",
      category: "ألعاب",
      cardType: "Steam",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
      rating: 4.9,
      reviews: 5421,
      description: "بطاقة Steam للألعاب الرقمية مع أكبر مكتبة ألعاب في العالم",
      features: ["أكثر من 50,000 لعبة", "تخفيضات موسمية", "مجتمع لاعبين عالمي", "إنجازات وجوائز"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 6,
      title: "بطاقة Apple iTunes - 100 دولار",
      price: "375 ريال",
      originalPrice: "400 ريال",
      discount: "6% خصم",
      category: "تطبيقات",
      cardType: "Apple iTunes",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=250&fit=crop",
      rating: 4.7,
      reviews: 2876,
      description: "بطاقة Apple للتطبيقات والموسيقى والأفلام على جميع أجهزة Apple",
      features: ["App Store و iTunes", "Apple Music", "iCloud Storage", "Apple Arcade"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 7,
      title: "بطاقة Spotify Premium - 3 أشهر",
      price: "89 ريال",
      originalPrice: "99 ريال",
      discount: "10% خصم",
      category: "موسيقى",
      cardType: "Spotify",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      rating: 4.6,
      reviews: 1987,
      description: "استمع لملايين الأغاني بدون إعلانات مع Spotify Premium",
      features: ["بدون إعلانات", "جودة عالية", "تحميل أوفلاين", "تشغيل عشوائي غير محدود"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 8,
      title: "بطاقة Xbox Game Pass Ultimate",
      price: "67 ريال",
      originalPrice: "75 ريال",
      discount: "11% خصم",
      category: "ألعاب",
      cardType: "Xbox",
      image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=250&fit=crop",
      rating: 4.8,
      reviews: 3254,
      description: "اشتراك شهري يشمل مئات الألعاب و Xbox Live Gold",
      features: ["مئات الألعاب", "Xbox Live Gold", "PC Gaming", "ألعاب اليوم الأول"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 9,
      title: "بطاقة Discord Nitro - شهر واحد",
      price: "38 ريال",
      originalPrice: "45 ريال",
      discount: "16% خصم",
      category: "اجتماعي",
      cardType: "Discord",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      rating: 4.5,
      reviews: 1543,
      description: "ميزات Discord المتطورة للاعبين ومجتمعات الإنترنت",
      features: ["رفع ملفات أكبر", "جودة صوت عالية", "ايموجي مخصص", "شارات حصرية"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 10,
      title: "بطاقة Fortnite V-Bucks - 2800 نقطة",
      price: "78 ريال",
      originalPrice: "85 ريال",
      discount: "8% خصم",
      category: "ألعاب",
      cardType: "Fortnite",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
      rating: 4.7,
      reviews: 4892,
      description: "V-Bucks للحصول على الأزياء والرقصات الحصرية في Fortnite",
      features: ["أزياء حصرية", "رقصات جديدة", "معدات Battle Pass", "هدايا للأصدقاء"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 11,
      title: "بطاقة Adobe Creative Cloud",
      price: "195 ريال",
      originalPrice: "220 ريال",
      discount: "11% خصم",
      category: "إبداعي",
      cardType: "Adobe",
      image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=250&fit=crop",
      rating: 4.6,
      reviews: 1876,
      description: "اشتراك شهري في مجموعة Adobe الكاملة للمبدعين",
      features: ["Photoshop & Illustrator", "Premiere & After Effects", "مساحة تخزين سحابية", "خطوط حصرية"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 12,
      title: "بطاقة Netflix + Disney Bundle",
      price: "125 ريال",
      originalPrice: "140 ريال",
      discount: "11% خصم",
      category: "ترفيه",
      cardType: "Bundle",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop",
      rating: 4.9,
      reviews: 2567,
      description: "باقة مدمجة تشمل Netflix و Disney Plus لشهر كامل",
      features: ["أفلام Disney الحصرية", "محتوى Marvel و Star Wars", "أفلام وثائقية National Geographic", "مناسب للعائلة"],
      isHot: true,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    }
  ];

  // Enhanced Categories
  const categories = [
    { name: "جميع البطاقات", icon: Globe, count: 156, color: "bg-gradient-to-r from-purple-500 to-blue-500", description: "جميع أنواع البطاقات" },
    { name: "ترفيه", icon: Play, count: 48, color: "bg-gradient-to-r from-red-500 to-pink-500", description: "نتفلكس، يوتيوب، سبوتيفاي" },
    { name: "ألعاب", icon: Gamepad2, count: 73, color: "bg-gradient-to-r from-blue-500 to-cyan-500", description: "Steam، PlayStation، Xbox" },
    { name: "تسوق", icon: ShoppingBag, count: 28, color: "bg-gradient-to-r from-green-500 to-emerald-500", description: "أمازون، eBay، Ali Express" },
    { name: "تطبيقات", icon: Smartphone, count: 41, color: "bg-gradient-to-r from-orange-500 to-yellow-500", description: "Google Play، App Store" },
    { name: "موسيقى", icon: Music, count: 15, color: "bg-gradient-to-r from-purple-500 to-indigo-500", description: "Spotify، Apple Music، Anghami" },
    { name: "إبداعي", icon: Layers, count: 12, color: "bg-gradient-to-r from-teal-500 to-blue-500", description: "Adobe، Canva، Figma" },
    { name: "اجتماعي", icon: Users, count: 8, color: "bg-gradient-to-r from-pink-500 to-red-500", description: "Discord، Telegram Premium" }
  ];

  // Filter cards based on search and category
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "جميع البطاقات" || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort cards
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseInt(a.price) - parseInt(b.price);
      case "price-high":
        return parseInt(b.price) - parseInt(a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return b.rating - a.rating;
    }
  });

  // Navigation items
  const navItems = [
    { name: "الرئيسية", href: "#home" },
    { name: "الفئات", href: "#categories" },
    { name: "ابحث عن البطاقات", href: "#search" },
    { name: "اتصل بنا", href: "#contact" }
  ];

  // Animation variants
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800" dir="rtl">
      {/* Top Banner */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-4 px-4 text-center relative overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-yellow-300 rounded-full blur-xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center gap-3 text-sm md:text-lg font-bold">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </motion.div>
          <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
            🎉 عرض محدود | خصم 25% على جميع البطاقات + توصيل مجاني - كود: MEGA25
          </span>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.header 
        className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">!</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  متجر البطاقات
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Digital Cards Store</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {/* WhatsApp Button */}
              <Button
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">واتساب</span>
              </Button>

              {/* Phone Button */}
              <Button
                onClick={() => window.open('tel:+966555000123', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden lg:inline">اتصل بنا</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 overflow-hidden"
              >
                <div className="space-y-3">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="flex gap-3 px-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => {
                        window.open('https://wa.me/966555000123', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      واتساب
                    </Button>
                    <Button
                      onClick={() => {
                        window.open('tel:+966555000123', '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      اتصل
                    </Button>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 lg:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="text-center text-white"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-2 text-sm font-medium">
                ✨ أفضل أسعار البطاقات الرقمية في المملكة
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                عروض حصرية على
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  البطاقات الرقمية
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                خصم يصل إلى 50% على مجموعة مختارة من البطاقات الرقمية
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                تسوق الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                تواصل معنا
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center text-white/70">
                <span className="text-sm mb-2">اكتشف المزيد</span>
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Indicator Dots */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse">
          <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
          <div className="w-3 h-3 bg-white/40 rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">دعم العملاء</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">30s</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">تسليم فوري</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">99.9%</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">معدل الأمان</p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">+50K</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">عميل راضي</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section id="categories" ref={categoriesRef} className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-4">
                فئات متنوعة
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                اكتشف فئات البطاقات المختلفة
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                نوفر مجموعة واسعة من البطاقات الرقمية لتلبية جميع احتياجاتك
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12"
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 text-center ${
                    selectedCategory === category.name ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} بطاقة
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="search" className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن البطاقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-3 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="popular">الأكثر شيوعاً</option>
                <option value="price-low">السعر من الأقل للأعلى</option>
                <option value="price-high">السعر من الأعلى للأقل</option>
                <option value="rating">أعلى تقييم</option>
                <option value="newest">الأحدث</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="px-4 py-3 rounded-xl"
              >
                {viewMode === "grid" ? <Layers className="h-5 w-5" /> : <Box className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section ref={cardsRef} className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            className={`grid ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            } gap-8`}
          >
            {sortedCards.map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`group relative ${viewMode === "list" ? "md:flex md:gap-6" : ""}`}
                layout
              >
                <Card className="overflow-hidden bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300 border-0 group-hover:border-purple-200 dark:group-hover:border-purple-800">
                  {/* Card Badges */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {card.isHot && (
                      <Badge className="bg-red-500 text-white border-0 shadow-lg">
                        <Flame className="h-3 w-3 mr-1" />
                        مطلوب
                      </Badge>
                    )}
                    {card.isNew && (
                      <Badge className="bg-green-500 text-white border-0 shadow-lg">
                        <Star className="h-3 w-3 mr-1" />
                        جديد
                      </Badge>
                    )}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                      <Percent className="h-3 w-3 mr-1" />
                      {card.discount}
                    </Badge>
                  </div>

                  {/* Card Image */}
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "md:w-48 md:h-32" : "h-48"}`}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Favorite Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg"
                      onClick={() => handleAddToFavorites(card.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(card.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    {/* Card Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(card.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {card.rating}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({card.reviews} تقييم)
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {card.category}
                      </Badge>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">المميزات:</h4>
                      <div className="flex flex-wrap gap-1">
                        {card.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full"
                          >
                            <CheckCircle className="h-3 w-3" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {card.price}
                          </span>
                          {card.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">
                              {card.originalPrice}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          السعر شامل الضريبة
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToCart(card.id)}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(card)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          شراء الآن
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {sortedCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-xl border-2 border-purple-300 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                عرض المزيد من البطاقات
                <TrendingUp className="mr-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              هل تحتاج مساعدة في اختيار البطاقة المناسبة؟
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              تواصل مع فريق الدعم المتخصص لدينا للحصول على استشارة مجانية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                تواصل عبر الواتساب
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                onClick={() => window.open('tel:+966555000123', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                اتصل بنا مباشرة
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Home Link */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link to="/">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group"
            size="sm"
          >
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </Link>
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => window.open('https://wa.me/966555000123', '_blank')}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="relative py-16 lg:py-20">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Store Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Store className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      متجر البطاقات الذكي
                    </h3>
                    <p className="text-sm text-gray-400">Digital Cards Store</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  وجهتك الأولى للحصول على أفضل البطاقات الرقمية بأسعار منافسة وجودة عالية. نوفر خدمة التفعيل الفوري مع ضمان الجودة.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-300"
                    onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    واتساب
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300"
                    onClick={() => window.open('tel:+966555000123', '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    اتصل بنا
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">روابط سريعة</h4>
                <div className="space-y-3">
                  {[
                    { name: "الصفحة الرئيسية", href: "#home" },
                    { name: "جميع الفئات", href: "#categories" },
                    { name: "العروض الخاصة", href: "#offers" },
                    { name: "البحث المتقدم", href: "#search" },
                    { name: "المفضلة", href: "#favorites" },
                    { name: "سلة التسوق", href: "#cart" }
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block text-gray-300 hover:text-purple-400 transition-colors duration-200 hover:translate-x-1 transform"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">الفئات الشائعة</h4>
                <div className="space-y-3">
                  {[
                    { name: "بطاقات الألعاب", count: "73", icon: Gamepad2 },
                    { name: "بطاقات الترفيه", count: "48", icon: Play },
                    { name: "بطاقات التطبيقات", count: "41", icon: Smartphone },
                    { name: "بطاقات التسوق", count: "28", icon: ShoppingBag },
                    { name: "بطاقات الموسيقى", count: "15", icon: Music },
                    { name: "البطاقات الإبداعية", count: "12", icon: Layers }
                  ].map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div 
                        key={category.name}
                        className="flex items-center gap-3 text-gray-300 hover:text-purple-400 cursor-pointer transition-colors duration-200 group"
                        onClick={() => setSelectedCategory(category.name.replace('بطاقات ', ''))}
                      >
                        <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                        <span className="flex-1">{category.name}</span>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">تواصل معنا</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">واتساب</p>
                      <p className="text-white font-medium">+966 555 000 123</p>
                      <p className="text-gray-400 text-xs">متاح 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">هاتف</p>
                      <p className="text-white font-medium">+966 555 000 123</p>
                      <p className="text-gray-400 text-xs">9:00 ص - 11:00 م</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">ايميل</p>
                      <p className="text-white font-medium">info@cards-store.sa</p>
                      <p className="text-gray-400 text-xs">نرد خلال ساعة</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">ساعات العمل</p>
                      <p className="text-white font-medium">24/7 أون لاين</p>
                      <p className="text-gray-400 text-xs">خدمة متواصلة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 pt-12 border-t border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-bold text-white mb-1">تفعيل فوري</h5>
                  <p className="text-xs text-gray-400">خلال 30 ثانية</p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-bold text-white mb-1">آمان تام</h5>
                  <p className="text-xs text-gray-400">حماية SSL</p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-bold text-white mb-1">ضمان الجودة</h5>
                  <p className="text-xs text-gray-400">استرداد مضمون</p>
                </div>

                <div className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-bold text-white mb-1">دعم 24/7</h5>
                  <p className="text-xs text-gray-400">خدمة العملاء</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link to="/cards-store/privacy" className="hover:text-purple-400 transition-colors duration-200">
                  سياسة الخصوصية
                </Link>
                <Link to="/cards-store/terms" className="hover:text-purple-400 transition-colors duration-200">
                  الشروط والأحكام
                </Link>
                <Link to="/cards-store/faq" className="hover:text-purple-400 transition-colors duration-200">
                  الأسئلة الشائعة
                </Link>
                <Link to="/cards-store/about" className="hover:text-purple-400 transition-colors duration-200">
                  عن المتجر
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-400">
                  © 2024 متجر البطاقات الذكي. جميع الحقوق محفوظة.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">طُوِّر بواسطة</span>
                  <Link 
                    to="/" 
                    className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-bold hover:from-purple-300 hover:to-blue-300 transition-all duration-200"
                  >
                    شركة ASH holding القابضة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="fixed bottom-24 left-6 z-40">
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group opacity-75 hover:opacity-100"
            size="sm"
          >
            <ArrowRight className="h-4 w-4 rotate-[-90deg] group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicCardsStore;