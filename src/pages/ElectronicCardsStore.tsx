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

  // Cards data
  const cards = [
    {
      id: 1,
      title: "بطاقة نتفلكس - شهر واحد",
      price: "58 ريال",
      originalPrice: "65 ريال",
      discount: "11% خصم",
      category: "ترفيه",
      cardType: "نتفلكس",
      image: "/src/assets/netflix-card.jpg",
      rating: 4.9,
      reviews: 2847,
      description: "استمتع بمحتوى نتفلكس اللامحدود لمدة شهر كامل",
      features: ["تفعيل فوري", "يعمل في جميع البلدان", "ضمان لمدة 30 يوم"],
      isHot: true,
      isNew: false
    },
    {
      id: 2,
      title: "بطاقة PlayStation - 100 ريال",
      price: "95 ريال",
      originalPrice: "100 ريال",
      discount: "5% خصم",
      category: "ألعاب",
      cardType: "PlayStation",
      image: "/src/assets/itunes-card.jpg",
      rating: 4.8,
      reviews: 1923,
      description: "بطاقة شحن PlayStation Store بقيمة 100 ريال سعودي",
      features: ["تفعيل فوري", "للحسابات السعودية", "صالحة لجميع الألعاب"],
      isHot: false,
      isNew: true
    },
    {
      id: 3,
      title: "بطاقة Amazon - 50 دولار",
      price: "185 ريال",
      originalPrice: "195 ريال",
      discount: "5% خصم",
      category: "تسوق",
      cardType: "Amazon",
      image: "/src/assets/amazon-card.jpg",
      rating: 4.7,
      reviews: 1456,
      description: "بطاقة هدايا أمازون بقيمة 50 دولار أمريكي",
      features: ["صالحة عالمياً", "لا تنتهي الصلاحية", "تفعيل فوري"],
      isHot: true,
      isNew: false
    },
    {
      id: 4,
      title: "بطاقة Google Play - 100 ريال",
      price: "95 ريال",
      originalPrice: "100 ريال",
      discount: "5% خصم",
      category: "تطبيقات",
      cardType: "Google Play",
      image: "/src/assets/google-play-card.jpg",
      rating: 4.8,
      reviews: 2134,
      description: "بطاقة شحن Google Play بقيمة 100 ريال سعودي",
      features: ["للتطبيقات والألعاب", "تفعيل فوري", "للحسابات السعودية"],
      isHot: false,
      isNew: false
    },
    {
      id: 5,
      title: "بطاقة Steam - 20 دولار",
      price: "75 ريال",
      originalPrice: "80 ريال",
      discount: "6% خصم",
      category: "ألعاب",
      cardType: "Steam",
      image: "/src/assets/steam-card.jpg",
      rating: 4.9,
      reviews: 3421,
      description: "بطاقة Steam Wallet بقيمة 20 دولار أمريكي",
      features: ["للألعاب فقط", "تفعيل فوري", "صالحة عالمياً"],
      isHot: true,
      isNew: false
    },
    {
      id: 6,
      title: "بطاقة فيزا افتراضية - 50 دولار",
      price: "190 ريال",
      originalPrice: "200 ريال",
      discount: "5% خصم",
      category: "بنكية",
      cardType: "Visa Virtual",
      image: "/src/assets/visa-card.jpg",
      rating: 4.6,
      reviews: 1234,
      description: "بطاقة فيزا افتراضية بقيمة 50 دولار للتسوق الإلكتروني",
      features: ["للتسوق الإلكتروني", "تفعيل فوري", "آمنة وموثوقة"],
      isHot: false,
      isNew: true
    }
  ];

  // Categories
  const categories = [
    { name: "جميع البطاقات", icon: Globe, count: 150, color: "bg-purple-500" },
    { name: "ترفيه", icon: Play, count: 45, color: "bg-red-500" },
    { name: "ألعاب", icon: Gamepad2, count: 67, color: "bg-blue-500" },
    { name: "تسوق", icon: ShoppingBag, count: 23, color: "bg-green-500" },
    { name: "تطبيقات", icon: Smartphone, count: 34, color: "bg-orange-500" },
    { name: "بنكية", icon: CreditCard, count: 12, color: "bg-indigo-500" }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Top Banner */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 text-center relative overflow-hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base font-medium">
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          <span>عرض خاص | خصم 20% على جميع البطاقات الرقمية - استخدم كود: SAVE20</span>
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
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
    </div>
  );
};

export default ElectronicCardsStore;