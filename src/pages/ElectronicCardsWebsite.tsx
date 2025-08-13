import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Gift,
  ShoppingCart,
  Star,
  MessageCircle,
  Sparkles,
  Award,
  CheckCircle,
  Heart,
  Share2,
  Banknote,
  Search,
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
  CreditCard,
  Globe,
  Building,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
  Home,
  Info,
  BookOpen,
  HelpCircle,
  Shield,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const ElectronicCardsWebsite = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("جميع البطاقات");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePurchase = (card: any) => {
    const whatsappMessage = `مرحباً! أريد شراء بطاقة: ${card.name} بقيمة ${card.price}`;
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تم اختيار البطاقة بنجاح!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  const cards = [
    {
      id: 1,
      name: "🎮 بطاقة PlayStation Store",
      description: "بطاقة شحن متجر بلايستيشن للألعاب والمحتوى الرقمي",
      category: "الألعاب",
      icon: Gamepad2,
      price: "50 ريال",
      originalPrice: "60 ريال",
      rating: 4.9,
      image: "🎮",
      color: "from-blue-500 to-blue-600",
      isPopular: true,
      discount: "17%",
      availability: "متوفر فوراً"
    },
    {
      id: 2,
      name: "🍎 بطاقة Apple Store",
      description: "بطاقة هدايا متجر آبل للتطبيقات والموسيقى والأفلام",
      category: "التطبيقات",
      icon: Smartphone,
      price: "100 ريال",
      originalPrice: "120 ريال",
      rating: 4.8,
      image: "🍎",
      color: "from-gray-500 to-gray-600",
      isPopular: true,
      discount: "17%",
      availability: "متوفر فوراً"
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
      image: "🎵",
      color: "from-green-500 to-green-600",
      isPopular: false,
      discount: "25%",
      availability: "متوفر فوراً"
    },
    {
      id: 4,
      name: "🛒 بطاقة Amazon",
      description: "بطاقة هدايا أمازون للتسوق الإلكتروني",
      category: "التسوق",
      icon: ShoppingBag,
      price: "200 ريال",
      originalPrice: "250 ريال",
      rating: 4.9,
      image: "🛒",
      color: "from-orange-500 to-orange-600",
      isPopular: true,
      discount: "20%",
      availability: "متوفر فوراً"
    },
    {
      id: 5,
      name: "☕ بطاقة Starbucks",
      description: "بطاقة هدايا ستاربكس للقهوة والمشروبات",
      category: "المقاهي",
      icon: Coffee,
      price: "75 ريال",
      originalPrice: "90 ريال",
      rating: 4.6,
      image: "☕",
      color: "from-green-700 to-green-800",
      isPopular: false,
      discount: "17%",
      availability: "متوفر فوراً"
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
      image: "💳",
      color: "from-purple-500 to-purple-600",
      isPopular: true,
      discount: "4%",
      availability: "متوفر فوراً"
    },
    {
      id: 7,
      name: "🎬 بطاقة Netflix",
      description: "اشتراك نتفليكس لمشاهدة الأفلام والمسلسلات",
      category: "الترفيه",
      icon: Eye,
      price: "45 ريال",
      originalPrice: "55 ريال",
      rating: 4.9,
      image: "🎬",
      color: "from-red-500 to-red-600",
      isPopular: true,
      discount: "18%",
      availability: "متوفر فوراً"
    },
    {
      id: 8,
      name: "🎁 بطاقة هدايا عامة",
      description: "بطاقة هدايا متعددة الاستخدامات لجميع المناسبات",
      category: "الهدايا",
      icon: Gift,
      price: "150 ريال",
      originalPrice: "180 ريال",
      rating: 4.7,
      image: "🎁",
      color: "from-pink-500 to-pink-600",
      isPopular: false,
      discount: "17%",
      availability: "متوفر فوراً"
    }
  ];

  const categories = [
    { name: "جميع البطاقات", emoji: "🛍️", count: cards.length },
    { name: "الألعاب", emoji: "🎮", count: 1 },
    { name: "التطبيقات", emoji: "📱", count: 1 },
    { name: "الموسيقى", emoji: "🎵", count: 1 },
    { name: "التسوق", emoji: "🛒", count: 1 },
    { name: "المقاهي", emoji: "☕", count: 1 },
    { name: "البطاقات المصرفية", emoji: "💳", count: 1 },
    { name: "الترفيه", emoji: "🎬", count: 1 },
    { name: "الهدايا", emoji: "🎁", count: 1 }
  ];

  const stats = [
    {
      title: "إجمالي البطاقات",
      value: `${cards.length}`,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      emoji: "📦"
    },
    {
      title: "البطاقات المتوفرة",
      value: `${cards.length}`,
      icon: Zap,
      color: "from-green-500 to-green-600",
      emoji: "⚡"
    },
    {
      title: "متوسط التوفير",
      value: "18%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      emoji: "💎"
    },
    {
      title: "متوسط التقييم",
      value: "4.8",
      icon: Star,
      color: "from-orange-500 to-orange-600",
      emoji: "⭐"
    }
  ];

  const navigationItems = [
    { name: "الرئيسية", href: "/cards-store", icon: Home },
    { name: "جميع البطاقات", href: "/cards-store/cards", icon: Package },
    { name: "عن المتجر", href: "/cards-store/about", icon: Info },
    { name: "اتصل بنا", href: "/cards-store/contact", icon: Phone },
    { name: "الأسئلة الشائعة", href: "/cards-store/faq", icon: HelpCircle },
  ];

  const filteredCards = cards.filter(card => {
    const matchesCategory = selectedCategory === "جميع البطاقات" || card.category === selectedCategory;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-2 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xs md:text-sm font-medium flex items-center justify-center gap-2">
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse" />
            🏢 تم تطوير هذا المتجر بواسطة شركة علي صالح الشهري القابضة
            <Crown className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 animate-bounce" />
          </p>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">🛍️ متجر البطاقات</h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">الإلكترونية المتطور</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 font-medium"
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4 ml-2" />
                💬 واتساب
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-4 px-4">
                  <Button 
                    onClick={() => {
                      const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                      window.open(whatsappUrl, '_blank');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    💬 تواصل معنا
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="relative container mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium mb-6 md:mb-8 animate-fade-in border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 animate-pulse" />
            🎯 أول متجر إلكتروني متخصص في البطاقات الرقمية بالمملكة
            <Award className="w-4 md:w-5 h-4 md:h-5 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 animate-fade-in [animation-delay:200ms]">
            🛍️ متجر البطاقات{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              الإلكترونية الحصري
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms] mb-8 md:mb-10">
            🎮 اكتشف أفضل مجموعة من البطاقات الإلكترونية والرقمية للألعاب والتطبيقات والخدمات بأسعار لا تُقاوم وضمان أصلي 100%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
            <Button 
              size="lg" 
              onClick={() => document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-2xl text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300"
            >
              🛒 تصفح البطاقات الآن
              <ArrowRight className="w-5 h-5 mr-2 animate-pulse" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => {
                const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                window.open(whatsappUrl, '_blank');
              }}
              className="border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-500/5 text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <MessageCircle className="w-5 h-5 ml-2 animate-bounce" />
              💬 تواصل معنا عبر الواتساب
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-sm animate-fade-in bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 md:w-14 h-12 md:h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-3 shadow-2xl animate-bounce`}>
                      <span className="text-2xl md:text-3xl">{stat.emoji}</span>
                    </div>
                    <p className="text-xs md:text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-primary animate-pulse">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Categories & Search */}
      <section className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center lg:justify-start">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-xl md:rounded-2xl text-sm md:text-base px-3 md:px-6 py-2 md:py-3 font-bold transition-all duration-300 ${selectedCategory === category.name 
                  ? "bg-gradient-to-r from-primary via-blue-600 to-purple-600 shadow-2xl text-white transform scale-105" 
                  : "hover:bg-gradient-to-r hover:from-primary/10 hover:to-blue-500/10 hover:scale-105"
                }`}
              >
                <span className="text-base md:text-lg mr-1 md:mr-2">{category.emoji}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <Badge variant="secondary" className="mr-1 md:mr-2 bg-white/20 text-current text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          <div className="relative w-full lg:w-auto">
            <Search className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 md:w-5 h-4 md:h-5 animate-pulse" />
            <input
              type="text"
              placeholder="🔍 البحث في البطاقات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 md:pl-6 pr-10 md:pr-12 py-3 md:py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-sm md:text-base font-medium w-full lg:min-w-80 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="cards-section" className="container mx-auto px-4 lg:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              🎴 جميع البطاقات المتاحة
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400">
              استكشف مجموعتنا المتنوعة من البطاقات الإلكترونية عالية الجودة
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold">
              {filteredCards.length} بطاقة متوفرة
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCards.map((card, index) => (
            <Card 
              key={card.id} 
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-xl animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {card.isPopular && (
                <div className="absolute top-3 md:top-4 left-3 md:left-4 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl font-bold shadow-lg animate-pulse text-xs md:text-sm">
                    🔥 الأكثر طلباً
                  </Badge>
                </div>
              )}
              
              {card.discount && (
                <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl font-bold shadow-lg animate-bounce text-xs md:text-sm">
                    💸 خصم {card.discount}
                  </Badge>
                </div>
              )}

              <CardHeader className="relative pb-3 md:pb-4">
                <div className={`w-16 md:w-20 h-16 md:h-20 bg-gradient-to-r ${card.color} rounded-2xl md:rounded-3xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl mx-auto animate-bounce`}>
                  <span className="text-2xl md:text-3xl">{card.image}</span>
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-center group-hover:text-primary transition-colors duration-300">
                  {card.name}
                </CardTitle>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 space-y-4 md:space-y-6">
                {/* Price & Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl md:text-2xl font-bold text-primary">{card.price}</span>
                      {card.originalPrice && (
                        <span className="text-base md:text-lg text-slate-400 line-through">{card.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 fill-current animate-pulse" />
                      <span className="text-xs md:text-sm font-medium">{card.rating}</span>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl font-bold animate-pulse text-xs md:text-sm">
                    ✅ {card.availability}
                  </Badge>
                </div>

                {/* Purchase Actions */}
                <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
                  <Button 
                    onClick={() => handlePurchase(card)}
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-2xl text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 py-2 md:py-3 text-sm md:text-base"
                  >
                    <Banknote className="w-3 md:w-4 h-3 md:h-4 ml-1 animate-bounce" />
                    💰 اشتري عبر الواتساب
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "📋 تم نسخ معلومات البطاقة",
                        description: "يمكنك الآن مشاركة هذه البطاقة مع الآخرين",
                      });
                    }}
                    className="w-full rounded-xl font-bold hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 py-2 md:py-3 text-sm md:text-base"
                  >
                    <Share2 className="w-3 md:w-4 h-3 md:h-4 ml-1 animate-pulse" />
                    📤 مشاركة البطاقة
                  </Button>
                </div>

                {/* Features */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-2 md:pt-3 mt-2 md:mt-3">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500 animate-pulse" />
                    ✅ توصيل فوري
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                    💯 ضمان أصلي
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12">
        <div className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 animate-pulse">
            📞 هل تحتاج مساعدة؟
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 max-w-3xl mx-auto">
            💬 فريق خدمة العملاء متاح على مدار الساعة لمساعدتك في اختيار البطاقة المناسبة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => {
                const whatsappUrl = "https://wa.me/966500000000?text=مرحباً! أحتاج مساعدة في اختيار البطاقة المناسبة";
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-white text-primary hover:bg-white/90 shadow-2xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-4 md:w-5 h-4 md:h-5 ml-2 animate-bounce" />
              💬 تواصل عبر الواتساب
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => {
                window.location.href = "tel:+966500000000";
              }}
              className="bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 shadow-2xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Phone className="w-4 md:w-5 h-4 md:h-5 ml-2 animate-pulse" />
              📞 اتصل بنا مباشرة
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">🛍️ متجر البطاقات</h3>
                  <p className="text-sm text-slate-400">الإلكترونية المتطور</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                أول متجر إلكتروني متخصص في البطاقات الرقمية بالمملكة العربية السعودية، نقدم أفضل البطاقات بأسعار تنافسية وضمان أصلي.
              </p>
              <div className="flex gap-4">
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                  <Instagram className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">🔗 روابط سريعة</h4>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">🏷️ فئات البطاقات</h4>
              <ul className="space-y-2">
                {categories.slice(1, 6).map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => setSelectedCategory(category.name)}
                      className="text-slate-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
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
              <h4 className="text-lg font-semibold mb-4 text-white">📞 معلومات التواصل</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+966 50 000 0000</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@cards-store.sa</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>متاح 24/7 عبر الواتساب</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm text-center md:text-right">
                <p>© 2024 متجر البطاقات الإلكترونية. جميع الحقوق محفوظة.</p>
                <p className="mt-1 text-xs">تم تطوير هذا المتجر بواسطة شركة علي صالح الشهري القابضة 🏢</p>
              </div>
              <div className="flex gap-4">
                <Link to="/cards-store/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                  <Shield className="w-4 h-4 inline ml-1" />
                  سياسة الخصوصية
                </Link>
                <Link to="/cards-store/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                  <BookOpen className="w-4 h-4 inline ml-1" />
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