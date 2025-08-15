import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      {/* Demo Site Alert */}
      <Alert className="mx-4 mb-0 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-center text-amber-800 dark:text-amber-200">
          <span className="font-bold">موقع تجريبي</span> - جميع المنتجات أمثلة فقط | 
          تم التطوير بواسطة <span className="font-bold text-amber-900 dark:text-amber-100">شركة ASH HOLDING القابضة</span>
        </AlertDescription>
      </Alert>

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
            <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-300" />
          </motion.div>
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            عروض حصرية! خصم يصل إلى 50% على جميع البطاقات 🔥
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
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* Cart & Contact Buttons */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <Button
                variant="outline"
                className="relative"
                onClick={() => toast({ title: "السلة قيد التطوير", duration: 2000 })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                السلة
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              
              <Button
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                واتساب
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
              >
                <div className="space-y-2">
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن البطاقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-3 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 transition-colors"
              >
                <option value="popular">الأكثر شعبية</option>
                <option value="price-low">السعر من الأقل للأعلى</option>
                <option value="price-high">السعر من الأعلى للأقل</option>
                <option value="rating">أعلى تقييم</option>
                <option value="newest">الأحدث</option>
              </select>
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="px-4 py-3"
              >
                {viewMode === "grid" ? <Layers className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="text-gray-600 dark:text-gray-400 mb-6">
            عرض {sortedCards.length} من {cards.length} بطاقة
            {selectedCategory !== "جميع البطاقات" && ` في فئة "${selectedCategory}"`}
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section ref={cardsRef} className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={cardsInView ? "visible" : "hidden"}
            className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {sortedCards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <div className="relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {card.isHot && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                          <Flame className="h-3 w-3 mr-1" />
                          HOT
                        </Badge>
                      )}
                      {card.isNew && (
                        <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                          NEW
                        </Badge>
                      )}
                      {card.discount && (
                        <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
                          {card.discount}
                        </Badge>
                      )}
                    </div>

                    {/* Favorite button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 left-3 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => handleAddToFavorites(card.id)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(card.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {card.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {card.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({card.reviews})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {card.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {card.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {card.price}
                        </span>
                        {card.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {card.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                        <Zap className="h-4 w-4" />
                        {card.deliveryTime}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {card.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePurchase(card)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300"
                      >
                        اشتري الآن
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(card.id)}
                        className="px-3"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {sortedCards.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  لم يتم العثور على نتائج
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  جرب البحث بكلمات مختلفة أو تصفح الفئات المتاحة
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
              تواصل معنا
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              نحن هنا لمساعدتك
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              فريقنا متاح 24/7 للإجابة على استفساراتك ومساعدتك في اختيار البطاقة المناسبة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">واتساب</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">تواصل سريع ومباشر</p>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
              >
                إرسال رسالة
              </Button>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">الهاتف</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">اتصال مباشر</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('tel:+966555000123', '_blank')}
              >
                +966 555 000 123
              </Button>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">البريد الإلكتروني</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">للاستفسارات العامة</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('mailto:support@digitalcards.sa', '_blank')}
              >
                إرسال إيميل
              </Button>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">مركز المساعدة</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">الأسئلة الشائعة</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast({ title: "مركز المساعدة قيد التطوير", duration: 2000 })}
              >
                زيارة المركز
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">متجر البطاقات</h3>
                  <p className="text-gray-400 text-sm">Digital Cards Store</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                أفضل متجر للبطاقات الرقمية في المملكة العربية السعودية. نوفر أفضل الأسعار وأسرع خدمة تسليم.
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  واتساب
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#categories" className="text-gray-400 hover:text-white transition-colors">الفئات</a></li>
                <li><a href="#search" className="text-gray-400 hover:text-white transition-colors">البحث</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">فئات البطاقات</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedCategory("ترفيه")}>ترفيه</span></li>
                <li><span className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedCategory("ألعاب")}>ألعاب</span></li>
                <li><span className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedCategory("تسوق")}>تسوق</span></li>
                <li><span className="text-gray-400 cursor-pointer hover:text-white transition-colors" onClick={() => setSelectedCategory("تطبيقات")}>تطبيقات</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">معلومات التواصل</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">+966 555 000 123</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">support@digitalcards.sa</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">خدمة 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 متجر البطاقات الرقمية. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  تم التطوير بواسطة
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => navigate('/')}
                >
                  شركة ASH HOLDING القابضة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicCardsStore;