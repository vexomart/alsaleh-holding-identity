import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Zap, 
  Gift, 
  ArrowRight, 
  Users, 
  Shield, 
  Sparkles,
  Gamepad2,
  CreditCard,
  Smartphone,
  Globe,
  TrendingUp,
  Award,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronDown,
  Play,
  Eye,
  Download,
  Share2,
  Clock,
  CheckCircle,
  Percent,
  Crown,
  Target,
  Rocket,
  Headphones,
  MapPin,
  Calendar,
  Package,
  Truck,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";
import { Link } from "react-router-dom";

// Import card images
import googlePlayCard from "@/assets/google-play-card.jpg";
import itunesCard from "@/assets/itunes-card.jpg";
import steamCard from "@/assets/steam-card.jpg";
import netflixCard from "@/assets/netflix-card.jpg";
import visaCard from "@/assets/visa-card.jpg";
import amazonCard from "@/assets/amazon-card.jpg";

const ElectronicCardsWebsite = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { name: "الكل", icon: Globe, count: 150, color: "from-blue-500 to-purple-600" },
    { name: "ألعاب", icon: Gamepad2, count: 45, color: "from-green-500 to-blue-500" },
    { name: "بطاقات دفع", icon: CreditCard, count: 25, color: "from-orange-500 to-red-500" },
    { name: "تطبيقات", icon: Smartphone, count: 35, color: "from-purple-500 to-pink-500" },
    { name: "خدمات رقمية", icon: Zap, count: 20, color: "from-cyan-500 to-blue-500" },
    { name: "اشتراكات", icon: RefreshCw, count: 25, color: "from-indigo-500 to-purple-500" }
  ];

  const products = [
    {
      id: 1,
      name: "بطاقة جوجل بلاي",
      nameEn: "Google Play Card",
      price: "25",
      originalPrice: "30",
      currency: "ر.س",
      image: googlePlayCard,
      category: "تطبيقات",
      rating: 4.8,
      sales: 1250,
      discount: 17,
      features: ["فوري", "آمن", "عالمي"],
      description: "بطاقة جوجل بلاي لشراء التطبيقات والألعاب والمحتوى الرقمي"
    },
    {
      id: 2,
      name: "بطاقة آيتونز",
      nameEn: "iTunes Card",
      price: "50",
      originalPrice: "60",
      currency: "ر.س",
      image: itunesCard,
      category: "تطبيقات",
      rating: 4.9,
      sales: 980,
      discount: 17,
      features: ["أصلي", "فوري", "مضمون"],
      description: "بطاقة آيتونز لمتجر آبل وجميع خدماته الرقمية"
    },
    {
      id: 3,
      name: "ستيم والت",
      nameEn: "Steam Wallet",
      price: "100",
      originalPrice: "120",
      currency: "ر.س",
      image: steamCard,
      category: "ألعاب",
      rating: 4.7,
      sales: 2100,
      discount: 17,
      features: ["عالمي", "فوري", "آمن"],
      description: "بطاقة ستيم لشراء الألعاب والمحتوى من متجر ستيم"
    },
    {
      id: 4,
      name: "بطاقة نتفليكس",
      nameEn: "Netflix Card",
      price: "75",
      originalPrice: "90",
      currency: "ر.س",
      image: netflixCard,
      category: "اشتراكات",
      rating: 4.6,
      sales: 856,
      discount: 17,
      features: ["شهري", "عالمي", "HD"],
      description: "اشتراك نتفليكس لمشاهدة أحدث الأفلام والمسلسلات"
    },
    {
      id: 5,
      name: "فيزا افتراضية",
      nameEn: "Virtual Visa",
      price: "15",
      originalPrice: "20",
      currency: "ر.س",
      image: visaCard,
      category: "بطاقات دفع",
      rating: 4.5,
      sales: 1780,
      discount: 25,
      features: ["آمن", "فوري", "قابل للتجديد"],
      description: "بطاقة فيزا افتراضية للشراء الآمن عبر الإنترنت"
    },
    {
      id: 6,
      name: "بطاقة أمازون",
      nameEn: "Amazon Card",
      price: "200",
      originalPrice: "250",
      currency: "ر.س",
      image: amazonCard,
      category: "خدمات رقمية",
      rating: 4.8,
      sales: 567,
      discount: 20,
      features: ["عالمي", "متعدد الاستخدام", "مضمون"],
      description: "بطاقة أمازون للتسوق من جميع متاجر أمازون العالمية"
    }
  ];

  const bannerSlides = [
    {
      id: 1,
      title: "عروض حصرية على البطاقات الرقمية",
      subtitle: "خصم يصل إلى 50% على مجموعة مختارة",
      image: "/api/placeholder/1200/400",
      cta: "تسوق الآن",
      color: "from-purple-600 to-blue-600"
    },
    {
      id: 2,
      title: "بطاقات ألعاب بأفضل الأسعار",
      subtitle: "اكتشف مجموعة ضخمة من بطاقات الألعاب",
      image: "/api/placeholder/1200/400",
      cta: "اكتشف المزيد",
      color: "from-green-500 to-blue-500"
    },
    {
      id: 3,
      title: "تسليم فوري وآمن",
      subtitle: "احصل على بطاقتك في ثوانٍ معدودة",
      image: "/api/placeholder/1200/400",
      cta: "جرب الآن",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "الكل" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <Gift className="w-4 h-4" />
            عرض خاص! خصم 20% على جميع البطاقات الرقمية - استخدم كود: SAVE20
            <Sparkles className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  متجر البطاقات
                </h1>
                <p className="text-xs text-muted-foreground">Digital Cards Store</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/cards-store" className="text-primary hover:text-purple-600 transition-colors duration-200 font-medium">
                الرئيسية
              </Link>
              <Link to="/cards-store/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                من نحن
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200">
                  الفئات
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <Link to="/cards-store/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                اتصل بنا
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن البطاقات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <Button variant="ghost" size="sm" className="group">
                <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن البطاقات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <nav className="space-y-2">
                <Link to="/cards-store" className="block py-2 text-primary font-medium">الرئيسية</Link>
                <Link to="/cards-store/about" className="block py-2 text-muted-foreground">من نحن</Link>
                <Link to="/cards-store/contact" className="block py-2 text-muted-foreground">اتصل بنا</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-96 md:h-[500px]">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-r ${slide.color} relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 h-full flex items-center">
                  <div className="text-white max-w-2xl relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      {slide.subtitle}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in group"
                      style={{ animationDelay: '0.4s' }}
                    >
                      {slide.cta}
                      <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-40 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">عميل راضي</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">معدل الأمان</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">30s</div>
              <div className="text-sm text-muted-foreground">تسليم فوري</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">دعم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              تصفح <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">الفئات</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف مجموعة واسعة من البطاقات الرقمية المميزة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <Card
                  key={category.name}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-slate-200/50 dark:border-slate-700/50 rounded-2xl ${
                    isSelected 
                      ? 'ring-2 ring-purple-500 shadow-xl transform -translate-y-1 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' 
                      : 'hover:shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                      isSelected ? 'scale-110 shadow-xl' : ''
                    }`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className={`font-bold mb-2 transition-colors duration-200 ${
                      isSelected ? 'text-purple-600' : 'text-primary'
                    }`}>
                      {category.name}
                    </h3>
                    
                    <Badge variant={isSelected ? "default" : "secondary"} className={`text-xs ${
                      isSelected ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''
                    }`}>
                      {category.count} منتج
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Products Grid */}
      <section className="py-16 bg-white/30 dark:bg-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              المنتجات المميزة
            </h2>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                تصفية
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="shadow-lg">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="shadow-lg">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="shadow-lg">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                      -{product.discount}%
                    </Badge>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-purple-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.nameEn}</p>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Sales Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {product.sales} مبيعات
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      تسليم فوري
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {product.price} {product.currency}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} {product.currency}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <ShoppingCart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                      إضافة
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="gap-2 hover:shadow-lg transition-all duration-300">
              تحميل المزيد
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              لماذا نحن <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">الأفضل؟</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">تسليم فوري</h3>
              <p className="text-muted-foreground">احصل على بطاقتك في أقل من 30 ثانية بعد الدفع</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">أمان تام</h3>
              <p className="text-muted-foreground">جميع المعاملات محمية بأعلى معايير الأمان</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">دعم 24/7</h3>
              <p className="text-muted-foreground">فريق دعم متاح على مدار الساعة لمساعدتك</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">أفضل الأسعار</h3>
              <p className="text-muted-foreground">أسعار تنافسية وعروض حصرية للعملاء</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-primary mb-8">تواصل معنا</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">واتساب</h3>
                <p className="text-muted-foreground mb-6">تواصل معنا مباشرة عبر الواتساب</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن البطاقات الرقمية', '_blank')}
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  راسلنا الآن
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">اتصال مباشر</h3>
                <p className="text-muted-foreground mb-6">اتصل بنا مباشرة للحصول على المساعدة</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('tel:+966555812567', '_blank')}
                >
                  <Phone className="w-4 h-4 ml-2" />
                  +966 555 812 567
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">متجر البطاقات</h3>
                  <p className="text-sm text-slate-400">Digital Cards Store</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6">
                متجرك الموثوق للبطاقات الرقمية مع تسليم فوري وأمان تام
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><Link to="/cards-store" className="text-slate-400 hover:text-white transition-colors duration-200">الرئيسية</Link></li>
                <li><Link to="/cards-store/about" className="text-slate-400 hover:text-white transition-colors duration-200">من نحن</Link></li>
                <li><Link to="/cards-store/contact" className="text-slate-400 hover:text-white transition-colors duration-200">اتصل بنا</Link></li>
                <li><Link to="/cards-store/faq" className="text-slate-400 hover:text-white transition-colors duration-200">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-6">خدمة العملاء</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  +966 555 812 567
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  info@cards-store.com
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  جدة، المملكة العربية السعودية
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  متاح 24/7
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6">النشرة الإخبارية</h4>
              <p className="text-slate-400 mb-4">
                اشترك للحصول على أحدث العروض والمنتجات
              </p>
              <div className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="البريد الإلكتروني"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  اشتراك
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 text-center md:text-right">
                © 2024 متجر البطاقات. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/cards-store/privacy" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                  سياسة الخصوصية
                </Link>
                <Link to="/cards-store/terms" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                  الشروط والأحكام
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicCardsWebsite;