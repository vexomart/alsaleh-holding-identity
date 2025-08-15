import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Store, 
  CreditCard, 
  Smartphone, 
  Music, 
  ShoppingBag, 
  Crown, 
  Sparkles, 
  TrendingUp,
  Search,
  Filter,
  Star,
  ArrowRight,
  MessageCircle,
  Phone,
  Menu,
  X,
  Zap,
  Shield,
  Gamepad2,
  Gift
} from 'lucide-react';

const ElectronicCardsStore = () => {
  const [selectedCategory, setSelectedCategory] = useState("جميع البطاقات");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef(null);

  // InView hooks
  const heroInView = useInView(heroRef, { once: true });
  const categoriesInView = useInView(categoriesRef, { once: true });
  const cardsInView = useInView(cardsRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  // Navigation items
  const navItems = [
    { name: "الرئيسية", href: "#home" },
    { name: "الفئات", href: "#categories" },
    { name: "البطاقات", href: "#cards" },
    { name: "العروض", href: "#offers" },
    { name: "تواصل معنا", href: "#contact" }
  ];

  // Sample featured cards
  const featuredCards = [
    {
      id: 1,
      title: "بطاقة Netflix - 3 أشهر",
      price: "89 ريال",
      originalPrice: "120 ريال",
      discount: "26% خصم",
      category: "ترفيه",
      cardType: "Netflix",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=250&fit=crop",
      rating: 4.8,
      reviews: 3254,
      description: "استمتع بأفضل الأفلام والمسلسلات مع اشتراك Netflix لمدة 3 أشهر",
      features: ["أفلام ومسلسلات حصرية", "جودة 4K", "عرض على أجهزة متعددة", "بدون إعلانات"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 2,
      title: "بطاقة Amazon - 100 ريال",
      price: "94 ريال",
      originalPrice: "100 ريال",
      discount: "6% خصم",
      category: "تسوق إلكتروني",
      cardType: "Amazon",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
      rating: 4.9,
      reviews: 8765,
      description: "تسوق من أكبر متجر إلكتروني في العالم مع بطاقة Amazon",
      features: ["شحن مجاني", "ملايين المنتجات", "خدمة عملاء ممتازة", "إرجاع مجاني"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 3,
      title: "بطاقة PlayStation Store - 200 ريال",
      price: "185 ريال",
      originalPrice: "200 ريال",
      discount: "8% خصم",
      category: "ألعاب",
      cardType: "PlayStation",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=250&fit=crop",
      rating: 4.7,
      reviews: 5421,
      description: "اشتري أحدث الألعاب والمحتوى الإضافي لجهاز PlayStation",
      features: ["أحدث الألعاب", "محتوى إضافي حصري", "خصومات حصرية", "ألعاب PlayStation Plus"],
      isHot: true,
      isNew: false,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    },
    {
      id: 4,
      title: "بطاقة iTunes - 50 دولار",
      price: "188 ريال",
      originalPrice: "200 ريال",
      discount: "6% خصم",
      category: "تطبيقات موبايل",
      cardType: "iTunes",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      rating: 4.6,
      reviews: 2876,
      description: "اشتري التطبيقات والألعاب والموسيقى من Apple Store",
      features: ["App Store و iTunes", "Apple Music", "iCloud Storage", "Apple Arcade"],
      isHot: false,
      isNew: true,
      stockStatus: "متوفر",
      deliveryTime: "فوري"
    }
  ];

  // Categories
  const categories = [
    { 
      name: "جميع البطاقات", 
      icon: Store, 
      count: 256, 
      color: "bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600",
      description: "جميع أنواع البطاقات الرقمية"
    },
    { 
      name: "ترفيه", 
      icon: Crown, 
      count: 78, 
      color: "bg-gradient-to-br from-red-500 via-pink-500 to-rose-600",
      description: "نتفلكس، يوتيوب، ديزني بلس"
    },
    { 
      name: "ألعاب", 
      icon: Gamepad2, 
      count: 134, 
      color: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600",
      description: "Steam، PlayStation، Xbox"
    },
    { 
      name: "تسوق إلكتروني", 
      icon: ShoppingBag, 
      count: 45, 
      color: "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600",
      description: "أمازون، نون، شي إن"
    },
    { 
      name: "تطبيقات موبايل", 
      icon: Smartphone, 
      count: 67, 
      color: "bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600",
      description: "Google Play، App Store"
    },
    { 
      name: "موسيقى", 
      icon: Music, 
      count: 23, 
      color: "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600",
      description: "Spotify، Apple Music، Anghami"
    }
  ];

  // Filter cards based on search and category
  const filteredCards = featuredCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "جميع البطاقات" || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden" dir="rtl">
      {/* Demo Alert */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 text-center text-sm font-medium">
        🛍️ هذا الموقع تجريبي وجميع المنتجات كمثال فقط - تطوير بحب شركة علي صالح الشهري القابضة
      </div>

      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-lg"
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
              {/* Games Store Button */}
              <Button
                onClick={() => window.location.href = '/electronic-games-store'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <Gamepad2 className="h-4 w-4" />
                <span className="hidden lg:inline">متجر الألعاب</span>
              </Button>

              {/* Smart Cards Contact Button */}
              <Button
                onClick={() => {
                  const message = "مرحباً! أريد الاستفسار عن خدمات متجر البطاقات الإلكترونية الذكي وأحدث العروض المتاحة.";
                  const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">واتساب</span>
              </Button>

              {/* Phone Button */}
              <Button
                onClick={() => window.open('tel:+9660555812567', '_blank')}
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
                        window.location.href = '/electronic-games-store';
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    >
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      ألعاب
                    </Button>
                    <Button
                      onClick={() => {
                        const message = "مرحباً! أريد الاستفسار عن خدمات متجر البطاقات الإلكترونية الذكي وأحدث العروض المتاحة.";
                        const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      واتساب
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
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
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
                onClick={() => {
                  const message = "مرحباً! أريد الاستفسار عن خدمات متجر البطاقات الإلكترونية الذكي والعروض الحصرية المتاحة.";
                  const whatsappUrl = `https://wa.me/9660555812567?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                تواصل معنا
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <motion.section
        id="categories"
        ref={categoriesRef}
        initial="hidden"
        animate={categoriesInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-4 px-4 py-2">
              ✨ الأقسام المميزة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              اكتشف فئات البطاقات المختلفة
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              اكتشف مجموعتنا الحصرية من البطاقات الرقمية المتنوعة بأعلى معايير الجودة والأمان
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-500 ${
                    selectedCategory === category.name 
                      ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/25' 
                      : 'hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/5'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-4 sm:p-6 h-full min-h-[180px]">
                    <div className="relative z-10 text-center space-y-3 h-full flex flex-col justify-center">
                      <div className="relative mx-auto">
                        <motion.div 
                          className={`w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-700`}
                          whileHover={{ rotate: [0, -8, 8, -4, 0] }}
                        >
                          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-all duration-500 text-xs sm:text-sm leading-tight">
                          {category.name}
                        </h3>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {category.count}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">بطاقة</span>
                          </div>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 px-1">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
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

            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="popular">الأكثر شعبية</option>
                <option value="newest">الأحدث</option>
                <option value="price-low">الأرخص أولاً</option>
                <option value="price-high">الأغلى أولاً</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      <motion.section
        id="cards"
        ref={cardsRef}
        initial="hidden"
        animate={cardsInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 mb-6 px-6 py-3 text-lg font-semibold">
              🏆 البطاقات المميزة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              أفضل البطاقات الرقمية
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              مجموعة مختارة من أحدث وأفضل البطاقات الرقمية مع خصومات حصرية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {card.isHot && (
                        <Badge className="bg-red-500 text-white">🔥 Hot</Badge>
                      )}
                      {card.isNew && (
                        <Badge className="bg-green-500 text-white">✨ جديد</Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white font-bold">
                        {card.discount}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {card.rating}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {card.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {card.price}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {card.originalPrice}
                      </span>
                    </div>

                    <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {card.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Features */}
                      <div className="space-y-1">
                        {card.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link to={`/cards-store/product/${card.id}`} className="flex-1">
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                          >
                            <Gift className="h-4 w-4 mr-2" />
                            عرض التفاصيل
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="px-3"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">متجر البطاقات الرقمية</h3>
                  <p className="text-gray-400">Digital Cards Store</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                وجهتك الأولى لأفضل البطاقات الرقمية بأسعار منافسة وخدمة عملاء ممتازة. استمتع بتسوق آمن وسريع!
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Button
                  onClick={() => window.open('https://wa.me/966555812567', '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  واتساب
                </Button>
                <Button
                  onClick={() => window.location.href = '/electronic-games-store'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  متجر الألعاب
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">الفئات</a></li>
                <li><a href="#cards" className="hover:text-white transition-colors">البطاقات</a></li>
                <li><a href="/electronic-games-store" className="hover:text-white transition-colors">متجر الألعاب</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 966555812567+</li>
                <li>📧 cards@ash-holding.com</li>
                <li>📍 الرياض، المملكة العربية السعودية</li>
                <li>🕒 24/7 خدمة العملاء</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 متجر البطاقات الرقمية. جميع الحقوق محفوظة. طُوِّر بواسطة 
              <span className="text-purple-400 font-semibold mr-1">شركة علي صالح الشهري القابضة</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicCardsStore;