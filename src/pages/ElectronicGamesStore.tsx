import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Star, 
  Play, 
  Download, 
  Sparkles, 
  Zap, 
  Target,
  Sword,
  Crown,
  Shield,
  Search,
  Filter,
  ArrowRight,
  MessageCircle,
  Phone,
  Menu,
  X,
  Store,
  ChevronDown,
  Timer,
  Globe,
  Headphones,
  MonitorSpeaker
} from 'lucide-react';

const ElectronicGamesStore = () => {
  const [selectedCategory, setSelectedCategory] = useState("جميع الألعاب");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const gamesRef = useRef(null);
  const featuresRef = useRef(null);

  // InView hooks
  const heroInView = useInView(heroRef, { once: true });
  const categoriesInView = useInView(categoriesRef, { once: true });
  const gamesInView = useInView(gamesRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });

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
    { name: "الألعاب", href: "#games" },
    { name: "المميزات", href: "#features" },
    { name: "تواصل معنا", href: "#contact" }
  ];

  // Game Categories
  const gameCategories = [
    {
      name: "جميع الألعاب",
      icon: Globe,
      count: 450,
      color: "bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600",
      description: "مجموعة شاملة من الألعاب الإلكترونية",
      trending: true,
      gradient: "from-violet-500/20 to-purple-500/20",
      shadowColor: "shadow-violet-500/30",
      borderColor: "border-violet-500/30"
    },
    {
      name: "ألعاب القتال",
      icon: Sword,
      count: 85,
      color: "bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600",
      description: "ألعاب الأكشن والقتال المثيرة",
      trending: true,
      gradient: "from-red-500/20 to-orange-500/20",
      shadowColor: "shadow-red-500/30",
      borderColor: "border-red-500/30"
    },
    {
      name: "ألعاب الاستراتيجية",
      icon: Target,
      count: 120,
      color: "bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600",
      description: "ألعاب الذكاء والتخطيط الاستراتيجي",
      trending: false,
      gradient: "from-blue-500/20 to-cyan-500/20",
      shadowColor: "shadow-blue-500/30",
      borderColor: "border-blue-500/30"
    },
    {
      name: "ألعاب المغامرات",
      icon: Crown,
      count: 95,
      color: "bg-gradient-to-br from-emerald-600 via-green-600 to-lime-600",
      description: "مغامرات شيقة وعوالم خيالية",
      trending: true,
      gradient: "from-emerald-500/20 to-green-500/20",
      shadowColor: "shadow-emerald-500/30",
      borderColor: "border-emerald-500/30"
    },
    {
      name: "ألعاب الرياضة",
      icon: Trophy,
      count: 65,
      color: "bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600",
      description: "كرة القدم، السباقات، والرياضات المتنوعة",
      trending: false,
      gradient: "from-orange-500/20 to-amber-500/20",
      shadowColor: "shadow-orange-500/30",
      borderColor: "border-orange-500/30"
    },
    {
      name: "ألعاب المحاكاة",
      icon: MonitorSpeaker,
      count: 85,
      color: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
      description: "محاكاة الواقع وبناء العوالم",
      trending: true,
      gradient: "from-indigo-500/20 to-purple-500/20",
      shadowColor: "shadow-indigo-500/30",
      borderColor: "border-indigo-500/30"
    }
  ];

  // Featured Games
  const featuredGames = [
    {
      id: 1,
      title: "Call of Duty: Modern Warfare III",
      price: "299 ريال",
      originalPrice: "349 ريال",
      discount: "14% خصم",
      category: "ألعاب القتال",
      platform: ["PC", "PlayStation", "Xbox"],
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 12540,
      description: "أحدث إصدار من سلسلة Call of Duty مع جرافيك مذهل وطور لعب متعدد اللاعبين",
      features: ["طور القصة الجديد", "معارك 64 لاعب", "جرافيك 4K", "دعم Ray Tracing"],
      isHot: true,
      isNew: false,
      ageRating: "18+",
      size: "125 GB",
      releaseDate: "2023"
    },
    {
      id: 2,
      title: "FIFA 24",
      price: "249 ريال",
      originalPrice: "299 ريال",
      discount: "17% خصم",
      category: "ألعاب الرياضة",
      platform: ["PC", "PlayStation", "Xbox"],
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 8965,
      description: "الإصدار الأحدث من لعبة كرة القدم الأكثر شعبية في العالم",
      features: ["HyperMotion V", "أوضاع لعب جديدة", "Career Mode محسن", "Ultimate Team"],
      isHot: false,
      isNew: true,
      ageRating: "3+",
      size: "45 GB",
      releaseDate: "2023"
    },
    {
      id: 3,
      title: "Assassin's Creed Mirage",
      price: "199 ريال",
      originalPrice: "259 ريال",
      discount: "23% خصم",
      category: "ألعاب المغامرات",
      platform: ["PC", "PlayStation", "Xbox"],
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 7832,
      description: "رحلة ملحمية في بغداد العصر الذهبي مع قصة مشوقة ومغامرات لا تُنسى",
      features: ["عالم مفتوح", "قصة 40 ساعة", "جرافيك خلاب", "نظام قتال محسن"],
      isHot: true,
      isNew: false,
      ageRating: "17+",
      size: "85 GB",
      releaseDate: "2023"
    },
    {
      id: 4,
      title: "Cities: Skylines II",
      price: "179 ريال",
      originalPrice: "219 ريال",
      discount: "18% خصم",
      category: "ألعاب المحاكاة",
      platform: ["PC", "PlayStation", "Xbox"],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 5643,
      description: "ابن مدينتك المثالية واحكم ملايين السكان في أفضل لعبة محاكاة مدن",
      features: ["محاكاة واقعية", "مدن ضخمة", "أدوات البناء المتقدمة", "تحديات متنوعة"],
      isHot: false,
      isNew: true,
      ageRating: "3+",
      size: "65 GB",
      releaseDate: "2023"
    },
    {
      id: 5,
      title: "Baldur's Gate 3",
      price: "229 ريال",
      originalPrice: "279 ريال",
      discount: "18% خصم",
      category: "ألعاب الاستراتيجية",
      platform: ["PC", "PlayStation"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 15842,
      description: "لعبة RPG ملحمية مع قصة تفاعلية وخيارات لا محدودة",
      features: ["200+ ساعة لعب", "قصة تفاعلية", "تعاون 4 لاعبين", "رسوميات مذهلة"],
      isHot: true,
      isNew: false,
      ageRating: "17+",
      size: "95 GB",
      releaseDate: "2023"
    },
    {
      id: 6,
      title: "Forza Motorsport",
      price: "269 ريال",
      originalPrice: "319 ريال",
      discount: "16% خصم",
      category: "ألعاب الرياضة",
      platform: ["PC", "Xbox"],
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 9876,
      description: "أفضل لعبة سباقات مع سيارات واقعية وحلبات من جميع أنحاء العالم",
      features: ["500+ سيارة", "حلبات واقعية", "طقس ديناميكي", "سباقات أونلاين"],
      isHot: false,
      isNew: true,
      ageRating: "3+",
      size: "75 GB",
      releaseDate: "2023"
    }
  ];

  // Filter games based on search and category
  const filteredGames = featuredGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "جميع الألعاب" || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden" dir="rtl">
      {/* Demo Alert */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 text-center text-sm font-medium">
        🎮 هذا الموقع تجريبي وجميع الألعاب كمثال فقط - تم تطويره من شركة ASH HOLDING القابضة
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
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">🎮</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  متجر الألعاب الإلكترونية
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Electronic Games Store</p>
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
              <Button
                onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">واتساب</span>
              </Button>

              <Button
                onClick={() => window.open('tel:+966555000123', '_blank')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hidden sm:flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden lg:inline">اتصل بنا</span>
              </Button>

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
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20 lg:py-32">
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
                🎮 أحدث الألعاب الإلكترونية بأفضل الأسعار
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                عالم الألعاب
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  الإلكترونية المثير
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                اكتشف مجموعة ضخمة من أفضل الألعاب الإلكترونية مع خصومات تصل إلى 40%
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
              >
                تسوق الألعاب
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
          </motion.div>
        </div>
      </section>

      {/* Game Categories Section */}
      <motion.section
        id="categories"
        ref={categoriesRef}
        initial="hidden"
        animate={categoriesInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 mb-6 px-6 py-3 text-lg font-semibold border-2 border-purple-200 dark:border-purple-700">
              🎮 فئات الألعاب المتنوعة
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                اختر نوع لعبتك المفضلة
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              من ألعاب الأكشن المثيرة إلى ألعاب المحاكاة الواقعية، اكتشف مجموعة متنوعة من الألعاب الإلكترونية
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {gameCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  variants={{
                    hidden: { opacity: 0, y: 60, scale: 0.8 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      scale: 1
                    }
                  }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-700 ${
                    selectedCategory === category.name 
                      ? `ring-4 ring-purple-500 shadow-2xl ${category.shadowColor} scale-105` 
                      : `hover:shadow-2xl ${category.shadowColor} hover:ring-2 ${category.borderColor}`
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-4 sm:p-6 h-full min-h-[180px]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700 rounded-3xl`}></div>
                    
                    {category.trending && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: -12 }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20"
                      >
                        🔥 ترند
                      </motion.div>
                    )}
                    
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">لعبة</span>
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
                placeholder="ابحث عن الألعاب..."
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

      {/* Featured Games Section */}
      <motion.section
        id="games"
        ref={gamesRef}
        initial="hidden"
        animate={gamesInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 mb-6 px-6 py-3 text-lg font-semibold">
              🏆 الألعاب المميزة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              أفضل الألعاب الإلكترونية
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              مجموعة مختارة من أحدث وأفضل الألعاب الإلكترونية مع خصومات حصرية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                variants={itemVariants}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {game.isHot && (
                        <Badge className="bg-red-500 text-white">🔥 Hot</Badge>
                      )}
                      {game.isNew && (
                        <Badge className="bg-green-500 text-white">✨ جديد</Badge>
                      )}
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white font-bold">
                        {game.discount}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {game.rating}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {game.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {game.ageRating}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {game.price}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        {game.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {game.reviews.toLocaleString()} تقييم
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {game.size}
                      </div>
                    </div>

                    <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {game.description}
                    </CardDescription>

                    {/* Platform Icons */}
                    <div className="flex gap-2 mb-3">
                      {game.platform.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Features */}
                      <div className="space-y-1">
                        {game.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                          onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          اشتري الآن
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="px-3"
                        >
                          <Play className="h-4 w-4" />
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

      {/* Features Section */}
      <motion.section
        id="features"
        ref={featuresRef}
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-blue-900/30 dark:text-purple-300 mb-6 px-6 py-3 text-lg font-semibold">
              ⚡ المميزات الحصرية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              لماذا نحن الخيار الأفضل؟
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              نقدم أفضل تجربة شراء للألعاب الإلكترونية مع خدمات متميزة ودعم فني ممتاز
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: "تحديث فوري",
                description: "احصل على الألعاب فور صدورها مع التحديثات التلقائية",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "أمان مضمون",
                description: "جميع الألعاب أصلية ومرخصة مع ضمان الجودة والأمان",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Headphones,
                title: "دعم فني 24/7",
                description: "فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Crown,
                title: "عضوية VIP",
                description: "خصومات حصرية وعروض مبكرة للألعاب الجديدة",
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
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
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">متجر الألعاب الإلكترونية</h3>
                  <p className="text-gray-400">Electronic Games Store</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                وجهتك الأولى لأفضل الألعاب الإلكترونية بأسعار منافسة وخدمة عملاء ممتازة. استمتع بتجربة ألعاب لا تُنسى!
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Button
                  onClick={() => window.open('https://wa.me/966555000123', '_blank')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  واتساب
                </Button>
                <Button
                  onClick={() => window.open('tel:+966555000123', '_blank')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  اتصل بنا
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">الفئات</a></li>
                <li><a href="#games" className="hover:text-white transition-colors">الألعاب</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">المميزات</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 966555000123+</li>
                <li>📧 games@ash-holding.com</li>
                <li>📍 الرياض، المملكة العربية السعودية</li>
                <li>🕒 24/7 خدمة العملاء</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 متجر الألعاب الإلكترونية. جميع الحقوق محفوظة. طُوِّر بواسطة 
              <span className="text-purple-400 font-semibold mr-1">شركة ASH HOLDING القابضة</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicGamesStore;