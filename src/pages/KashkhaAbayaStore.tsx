import { useState, useEffect } from "react";
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
  Crown,
  Shirt,
  Palette,
  Globe,
  TrendingUp,
  Award,
  MessageCircle,
  User,
  Menu,
  X,
  ChevronDown,
  Eye,
  Share2,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  RefreshCw,
  Package,
  Truck,
  HeartHandshake,
  Scissors,
  Ruler,
  Gem
} from "lucide-react";
import { Link } from "react-router-dom";

// Import abaya images
import abayaLuxuryBlack from "@/assets/abaya-luxury-black.jpg";
import abayaCasualBeige from "@/assets/abaya-casual-beige.jpg";
import abayaFormalNavy from "@/assets/abaya-formal-navy.jpg";
import abayaSportsGray from "@/assets/abaya-sports-gray.jpg";
import abayaWeddingWhite from "@/assets/abaya-wedding-white.jpg";
import abayaTraditionalBrown from "@/assets/abaya-traditional-brown.jpg";

const KashkhaAbayaStore = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const categories = [
    { name: "الكل", icon: Globe, count: 50, color: "from-rose-500 to-pink-600" },
    { name: "عبايات فاخرة", icon: Crown, count: 12, color: "from-purple-500 to-indigo-600" },
    { name: "عبايات كاجوال", icon: Shirt, count: 15, color: "from-blue-500 to-cyan-600" },
    { name: "عبايات رسمية", icon: Award, count: 8, color: "from-emerald-500 to-teal-600" },
    { name: "عبايات رياضية", icon: Zap, count: 6, color: "from-orange-500 to-red-600" },
    { name: "عبايات أفراح", icon: Sparkles, count: 9, color: "from-pink-500 to-rose-600" }
  ];

  const abayas = [
    {
      id: 1,
      name: "عباية فاخرة سوداء",
      nameEn: "Luxury Black Abaya",
      price: "450",
      originalPrice: "550",
      currency: "ر.س",
      image: abayaLuxuryBlack,
      category: "عبايات فاخرة",
      rating: 4.9,
      sales: 89,
      discount: 18,
      features: ["تطريز ذهبي", "قماش فاخر", "تفصيل حصري"],
      description: "عباية فاخرة سوداء مع تطريز ذهبي أنيق، مصممة خصيصاً للمناسبات الراقية",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["أسود", "أسود مع ذهبي"]
    },
    {
      id: 2,
      name: "عباية كاجوال بيج",
      nameEn: "Casual Beige Abaya",
      price: "280",
      originalPrice: "320",
      currency: "ر.س",
      image: abayaCasualBeige,
      category: "عبايات كاجوال",
      rating: 4.7,
      sales: 156,
      discount: 13,
      features: ["مريحة", "قماش ناعم", "تصميم عصري"],
      description: "عباية كاجوال بلون البيج الأنيق، مثالية للاستخدام اليومي",
      sizes: ["S", "M", "L", "XL"],
      colors: ["بيج", "كريمي", "رمادي فاتح"]
    },
    {
      id: 3,
      name: "عباية رسمية كحلي",
      nameEn: "Formal Navy Abaya",
      price: "380",
      originalPrice: "420",
      currency: "ر.س",
      image: abayaFormalNavy,
      category: "عبايات رسمية",
      rating: 4.8,
      sales: 67,
      discount: 10,
      features: ["تفاصيل دانتيل", "قماش راقي", "قصة أنيقة"],
      description: "عباية رسمية باللون الكحلي مع تفاصيل دانتيل راقية للمناسبات الرسمية",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["كحلي", "أزرق داكن", "أسود"]
    },
    {
      id: 4,
      name: "عباية رياضية رمادية",
      nameEn: "Sports Gray Abaya",
      price: "220",
      originalPrice: "260",
      currency: "ر.س",
      image: abayaSportsGray,
      category: "عبايات رياضية",
      rating: 4.6,
      sales: 134,
      discount: 15,
      features: ["قماش مرن", "تهوية ممتازة", "مقاومة العرق"],
      description: "عباية رياضية باللون الرمادي، مصممة خصيصاً للأنشطة الرياضية",
      sizes: ["S", "M", "L", "XL"],
      colors: ["رمادي", "أسود", "أزرق داكن"]
    },
    {
      id: 5,
      name: "عباية أفراح بيضاء",
      nameEn: "Wedding White Abaya",
      price: "650",
      originalPrice: "750",
      currency: "ر.س",
      image: abayaWeddingWhite,
      category: "عبايات أفراح",
      rating: 5.0,
      sales: 23,
      discount: 13,
      features: ["تطريز لؤلؤ", "قماش حريري", "تصميم العروس"],
      description: "عباية أفراح بيضاء فاخرة مع تطريز اللؤلؤ، مثالية لحفلات الزفاف",
      sizes: ["S", "M", "L", "XL"],
      colors: ["أبيض", "كريمي", "شامبانيا"]
    },
    {
      id: 6,
      name: "عباية تراثية بنية",
      nameEn: "Traditional Brown Abaya",
      price: "320",
      originalPrice: "380",
      currency: "ر.س",
      image: abayaTraditionalBrown,
      category: "عبايات كاجوال",
      rating: 4.8,
      sales: 98,
      discount: 16,
      features: ["طراز تراثي", "قماش أصيل", "تفصيل تقليدي"],
      description: "عباية تراثية باللون البني، تجمع بين الأصالة والعصرية",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["بني", "بني فاتح", "كاكي"]
    }
  ];

  const bannerSlides = [
    {
      id: 1,
      title: "مجموعة كشخة الجديدة",
      subtitle: "اكتشفي أحدث صيحات العبايات العصرية",
      image: "/api/placeholder/1200/400",
      cta: "تسوقي الآن",
      color: "from-rose-500 to-pink-600"
    },
    {
      id: 2,
      title: "عبايات فاخرة للمناسبات",
      subtitle: "تألقي في كل مناسبة مع تشكيلتنا الراقية",
      image: "/api/placeholder/1200/400",
      cta: "اكتشفي المجموعة",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: 3,
      title: "خصم حتى 30% على المجموعة الصيفية",
      subtitle: "عروض حصرية لفترة محدودة",
      image: "/api/placeholder/1200/400",
      cta: "تسوقي بالخصم",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredAbayas = abayas.filter(abaya => {
    const matchesCategory = selectedCategory === "الكل" || abaya.category === selectedCategory;
    const matchesSearch = abaya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         abaya.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (abaya) => {
    setCartItems(prev => [...prev, abaya]);
  };

  const orderViaWhatsApp = (abaya) => {
    const message = `مرحباً، أريد طلب عباية من متجر كشخة:
    
📦 المنتج: ${abaya.name}
💰 السعر: ${abaya.price} ${abaya.currency}
⭐ التقييم: ${abaya.rating}/5
    
يرجى التواصل معي لتأكيد الطلب وتفاصيل التوصيل.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/966555812567?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white py-2 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            عرض خاص! خصم 30% على جميع العبايات - كود الخصم: KASHKHA30
            <Crown className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-rose-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/kashkha-store" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
                  كشخة
                </h1>
                <p className="text-xs text-muted-foreground">Kashkha Abaya Store</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/kashkha-store" className="text-primary hover:text-rose-600 transition-colors duration-200 font-medium">
                الرئيسية
              </Link>
              <Link to="/kashkha-store/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                من نحن
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors duration-200">
                  المجموعات
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <Link to="/kashkha-store/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                اتصلي بنا
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحثي عن العبايات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 bg-rose-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-rose-500/20 rounded-xl"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs">
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
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-rose-200 dark:border-slate-700 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحثي عن العبايات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <nav className="space-y-2">
                <Link to="/kashkha-store" className="block py-2 text-primary font-medium">الرئيسية</Link>
                <Link to="/kashkha-store/about" className="block py-2 text-muted-foreground">من نحن</Link>
                <Link to="/kashkha-store/contact" className="block py-2 text-muted-foreground">اتصلي بنا</Link>
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
                      className="bg-white text-rose-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in group"
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
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">عميلة راضية</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">تصميم حصري</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-sm text-muted-foreground">توصيل سريع</div>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">ضمان الجودة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              تصفحي <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">مجموعاتنا</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشفي أجمل تشكيلة من العبايات العصرية والأنيقة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.name;
              
              return (
                <Card
                  key={category.name}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-rose-200/50 dark:border-slate-700/50 rounded-2xl ${
                    isSelected 
                      ? 'ring-2 ring-rose-500 shadow-xl transform -translate-y-1 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20' 
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
                      isSelected ? 'text-rose-600' : 'text-primary'
                    }`}>
                      {category.name}
                    </h3>
                    
                    <Badge variant={isSelected ? "default" : "secondary"} className={`text-xs ${
                      isSelected ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white' : ''
                    }`}>
                      {category.count} قطعة
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
              العبايات المميزة
            </h2>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                تصفية
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAbayas.map((abaya) => (
              <Card 
                key={abaya.id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-rose-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl"
              >
                <div className="relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={abaya.image} 
                    alt={abaya.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
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
                  {abaya.discount > 0 && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                      -{abaya.discount}%
                    </Badge>
                  )}

                  {/* Rating */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{abaya.rating}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs mb-2">
                      {abaya.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-rose-600 transition-colors duration-200">
                      {abaya.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{abaya.nameEn}</p>
                    <p className="text-sm text-muted-foreground">{abaya.description}</p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {abaya.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Sizes and Colors */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Ruler className="w-3 h-3" />
                      المقاسات: {abaya.sizes.join(", ")}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Palette className="w-3 h-3" />
                      الألوان: {abaya.colors.join(", ")}
                    </div>
                  </div>

                  {/* Sales Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {abaya.sales} مبيعات
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      توصيل مجاني
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {abaya.price} {abaya.currency}
                        </span>
                        {abaya.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {abaya.originalPrice} {abaya.currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => orderViaWhatsApp(abaya)}
                      className="w-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <MessageSquare className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                      اطلبي عبر الواتساب
                    </Button>
                    
                    <Button 
                      onClick={() => addToCart(abaya)}
                      variant="outline"
                      className="w-full border-rose-500 text-rose-600 hover:bg-rose-50 group"
                    >
                      <ShoppingCart className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-200" />
                      أضيفي للسلة
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
      <section className="py-16 bg-gradient-to-r from-rose-500/10 to-pink-600/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              لماذا تختارين <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">كشخة؟</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Scissors className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">تفصيل حصري</h3>
              <p className="text-muted-foreground">كل قطعة مصممة خصيصاً بعناية فائقة</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Gem className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">خامات فاخرة</h3>
              <p className="text-muted-foreground">أجود الأقمشة والخامات الطبيعية</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">توصيل سريع</h3>
              <p className="text-muted-foreground">توصيل مجاني خلال 24 ساعة داخل الرياض</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <HeartHandshake className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">خدمة مميزة</h3>
              <p className="text-muted-foreground">فريق دعم متخصص لخدمتك على مدار الساعة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-primary mb-8">تواصلي معنا</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">واتساب</h3>
                <p className="text-muted-foreground mb-6">تواصلي معنا مباشرة عبر الواتساب</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن عبايات كشخة', '_blank')}
                >
                  <MessageSquare className="w-4 h-4 ml-2" />
                  راسلينا الآن
                </Button>
              </Card>

              <Card className="p-8 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">اتصال مباشر</h3>
                <p className="text-muted-foreground mb-6">اتصلي بنا مباشرة للحصول على المساعدة</p>
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
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">كشخة</h3>
                  <p className="text-sm text-slate-400">Kashkha Abaya Store</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6">
                متجرك المميز للعبايات العصرية والأنيقة مع تصاميم حصرية وخامات فاخرة
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
                <li><Link to="/kashkha-store" className="text-slate-400 hover:text-white transition-colors duration-200">الرئيسية</Link></li>
                <li><Link to="/kashkha-store/about" className="text-slate-400 hover:text-white transition-colors duration-200">من نحن</Link></li>
                <li><Link to="/kashkha-store/contact" className="text-slate-400 hover:text-white transition-colors duration-200">اتصلي بنا</Link></li>
                <li><Link to="/kashkha-store/faq" className="text-slate-400 hover:text-white transition-colors duration-200">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            {/* Collections */}
            <div>
              <h4 className="text-lg font-semibold mb-6">المجموعات</h4>
              <ul className="space-y-3">
                <li className="text-slate-400">عبايات فاخرة</li>
                <li className="text-slate-400">عبايات كاجوال</li>
                <li className="text-slate-400">عبايات رسمية</li>
                <li className="text-slate-400">عبايات رياضية</li>
                <li className="text-slate-400">عبايات أفراح</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">معلومات التواصل</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  +966 555 812 567
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                  واتساب: +966 555 812 567
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  info@kashkha-store.com
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  الرياض، المملكة العربية السعودية
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 text-center md:text-right">
                © 2024 كشخة. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/kashkha-store/privacy" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
                  سياسة الخصوصية
                </Link>
                <Link to="/kashkha-store/terms" className="text-slate-400 hover:text-white transition-colors duration-200 text-sm">
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

export default KashkhaAbayaStore;