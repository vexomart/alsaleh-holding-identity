import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { 
  Gift,
  ShoppingCart,
  Star,
  MessageCircle,
  Sparkles,
  Award,
  CheckCircle,
  Share2,
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
  HelpCircle,
  Eye,
  Users,
  Filter,
  ArrowUp,
  Repeat,
  ShieldCheck,
  HeartHandshake,
  Headphones,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const ElectronicCardsWebsite = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("جميع البطاقات");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = (card: any) => {
    const whatsappMessage = `🛍️ مرحباً! أريد شراء البطاقة التالية: 📝 اسم البطاقة: ${card.name} 💰 السعر: ${card.price} 🏷️ التصنيف: ${card.category} شكراً لكم!`;
    const whatsappUrl = `https://wa.me/966500000000?text=${encodeURIComponent(whatsappMessage)}`;
    
    toast({
      title: "🎉 تمت إضافة البطاقة بنجاح!",
      description: "سيتم تحويلك للواتساب لإتمام عملية الشراء الآمنة",
    });
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cards = [
    {
      id: 1,
      name: "بطاقة PlayStation Store",
      description: "بطاقة شحن رسمية لمتجر بلايستيشن - العب أحدث الألعاب واستمتع بالمحتوى الحصري",
      category: "الألعاب",
      icon: Gamepad2,
      price: "50 ريال",
      originalPrice: "60 ريال",
      rating: 4.9,
      reviews: 2847,
      image: "🎮",
      color: "from-blue-500 to-blue-700",
      bgGradient: "from-blue-50 to-indigo-100",
      isPopular: true,
      discount: "17%",
      availability: "متوفر فوراً",
      features: ["توصيل فوري", "ضمان أصلي", "دعم 24/7"]
    },
    {
      id: 2,
      name: "بطاقة Apple Store",
      description: "بطاقة هدايا آبل الرسمية - اشتر التطبيقات والموسيقى والأفلام من متجر آبل",
      category: "التطبيقات",
      icon: Smartphone,
      price: "100 ريال",
      originalPrice: "120 ريال",
      rating: 4.8,
      reviews: 1923,
      image: "🍎",
      color: "from-gray-500 to-slate-700",
      bgGradient: "from-slate-50 to-gray-100",
      isPopular: true,
      discount: "17%",
      availability: "متوفر فوراً",
      features: ["بطاقة أصلية", "استخدام فوري", "دعم فني"]
    },
    {
      id: 3,
      name: "بطاقة Spotify Premium",
      description: "اشتراك سبوتيفاي بريميوم الرسمي - استمع للموسيقى بجودة عالية بدون إعلانات",
      category: "الموسيقى",
      icon: Music,
      price: "30 ريال",
      originalPrice: "40 ريال",
      rating: 4.7,
      reviews: 3156,
      image: "🎵",
      color: "from-green-500 to-emerald-700",
      bgGradient: "from-green-50 to-emerald-100",
      isPopular: false,
      discount: "25%",
      availability: "متوفر فوراً",
      features: ["بدون إعلانات", "جودة عالية", "تشغيل أوفلاين"]
    },
    {
      id: 4,
      name: "بطاقة Amazon",
      description: "بطاقة هدايا أمازون الرسمية - تسوق من أكبر متجر إلكتروني في العالم",
      category: "التسوق",
      icon: ShoppingBag,
      price: "200 ريال",
      originalPrice: "250 ريال",
      rating: 4.9,
      reviews: 4321,
      image: "🛒",
      color: "from-orange-500 to-amber-700",
      bgGradient: "from-orange-50 to-amber-100",
      isPopular: true,
      discount: "20%",
      availability: "متوفر فوراً",
      features: ["شحن مجاني", "منتجات متنوعة", "إرجاع مجاني"]
    },
    {
      id: 5,
      name: "بطاقة Starbucks",
      description: "بطاقة هدايا ستاربكس الرسمية - استمتع بأفضل أنواع القهوة والمشروبات",
      category: "المقاهي",
      icon: Coffee,
      price: "75 ريال",
      originalPrice: "90 ريال",
      rating: 4.6,
      reviews: 1567,
      image: "☕",
      color: "from-green-700 to-emerald-900",
      bgGradient: "from-green-50 to-emerald-100",
      isPopular: false,
      discount: "17%",
      availability: "متوفر فوراً",
      features: ["قهوة عالمية", "مشروبات متنوعة", "خدمة سريعة"]
    },
    {
      id: 6,
      name: "بطاقة Visa مدفوعة مسبقاً",
      description: "بطاقة فيزا مدفوعة مسبقاً آمنة - للتسوق الإلكتروني الآمن حول العالم",
      category: "البطاقات المصرفية",
      icon: CreditCard,
      price: "500 ريال",
      originalPrice: "520 ريال",
      rating: 4.8,
      reviews: 982,
      image: "💳",
      color: "from-purple-500 to-violet-700",
      bgGradient: "from-purple-50 to-violet-100",
      isPopular: true,
      discount: "4%",
      availability: "متوفر فوراً",
      features: ["آمان عالي", "استخدام عالمي", "حماية مضمونة"]
    },
    {
      id: 7,
      name: "بطاقة Netflix",
      description: "اشتراك نتفليكس الرسمي - شاهد آلاف الأفلام والمسلسلات بجودة عالية",
      category: "الترفيه",
      icon: Eye,
      price: "45 ريال",
      originalPrice: "55 ريال",
      rating: 4.9,
      reviews: 5634,
      image: "🎬",
      color: "from-red-500 to-rose-700",
      bgGradient: "from-red-50 to-rose-100",
      isPopular: true,
      discount: "18%",
      availability: "متوفر فوراً",
      features: ["محتوى حصري", "جودة 4K", "مشاهدة أوفلاين"]
    },
    {
      id: 8,
      name: "بطاقة Google Play",
      description: "بطاقة متجر جوجل بلاي الرسمية - اشتر التطبيقات والألعاب والأفلام",
      category: "التطبيقات",
      icon: Smartphone,
      price: "35 ريال",
      originalPrice: "45 ريال",
      rating: 4.7,
      reviews: 3892,
      image: "📱",
      color: "from-emerald-500 to-teal-700",
      bgGradient: "from-emerald-50 to-teal-100",
      isPopular: false,
      discount: "22%",
      availability: "متوفر فوراً",
      features: ["ألعاب مجانية", "تطبيقات متنوعة", "تحديثات دورية"]
    },
    {
      id: 9,
      name: "بطاقة Steam",
      description: "بطاقة متجر ستيم الرسمية - اشتر أحدث ألعاب الكمبيوتر بأفضل الأسعار",
      category: "الألعاب",
      icon: Gamepad2,
      price: "80 ريال",
      originalPrice: "100 ريال",
      rating: 4.8,
      reviews: 2156,
      image: "🎯",
      color: "from-indigo-500 to-purple-700",
      bgGradient: "from-indigo-50 to-purple-100",
      isPopular: true,
      discount: "20%",
      availability: "متوفر فوراً",
      features: ["ألعاب PC", "تخفيضات دورية", "مكتبة ضخمة"]
    },
    {
      id: 10,
      name: "بطاقة هدايا عامة",
      description: "بطاقة هدايا متعددة الاستخدامات - مناسبة لجميع المناسبات والأعياد",
      category: "الهدايا",
      icon: Gift,
      price: "150 ريال",
      originalPrice: "180 ريال",
      rating: 4.7,
      reviews: 1234,
      image: "🎁",
      color: "from-pink-500 to-rose-700",
      bgGradient: "from-pink-50 to-rose-100",
      isPopular: false,
      discount: "17%",
      availability: "متوفر فوراً",
      features: ["استخدام متعدد", "صالحة لسنة", "تغليف جميل"]
    }
  ];

  const categories = [
    { name: "جميع البطاقات", emoji: "🛍️", count: cards.length, color: "from-slate-500 to-gray-600" },
    { name: "الألعاب", emoji: "🎮", count: cards.filter(c => c.category === "الألعاب").length, color: "from-blue-500 to-blue-600" },
    { name: "التطبيقات", emoji: "📱", count: cards.filter(c => c.category === "التطبيقات").length, color: "from-green-500 to-green-600" },
    { name: "الموسيقى", emoji: "🎵", count: cards.filter(c => c.category === "الموسيقى").length, color: "from-purple-500 to-purple-600" },
    { name: "التسوق", emoji: "🛒", count: cards.filter(c => c.category === "التسوق").length, color: "from-orange-500 to-orange-600" },
    { name: "المقاهي", emoji: "☕", count: cards.filter(c => c.category === "المقاهي").length, color: "from-amber-500 to-amber-600" },
    { name: "البطاقات المصرفية", emoji: "💳", count: cards.filter(c => c.category === "البطاقات المصرفية").length, color: "from-indigo-500 to-indigo-600" },
    { name: "الترفيه", emoji: "🎬", count: cards.filter(c => c.category === "الترفيه").length, color: "from-red-500 to-red-600" },
    { name: "الهدايا", emoji: "🎁", count: cards.filter(c => c.category === "الهدايا").length, color: "from-pink-500 to-pink-600" }
  ];

  const stats = [
    {
      title: "إجمالي البطاقات",
      value: `${cards.length}+`,
      icon: Package,
      color: "from-blue-500 to-blue-600",
      emoji: "📦",
      description: "بطاقة متنوعة"
    },
    {
      title: "عملاء راضون",
      value: "15K+",
      icon: Users,
      color: "from-green-500 to-green-600",
      emoji: "👥",
      description: "عميل سعيد"
    },
    {
      title: "متوسط التوفير",
      value: "18%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      emoji: "💎",
      description: "توفير مضمون"
    },
    {
      title: "متوسط التقييم",
      value: "4.8⭐",
      icon: Star,
      color: "from-orange-500 to-orange-600",
      emoji: "⭐",
      description: "تقييم عالي"
    }
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "ضمان الأصالة",
      description: "جميع بطاقاتنا أصلية 100% ومضمونة من المصدر الرسمي",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Zap,
      title: "توصيل فوري",
      description: "احصل على بطاقتك فوراً بعد الدفع مباشرة",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      description: "فريق دعم متاح على مدار الساعة لمساعدتك",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: HeartHandshake,
      title: "ضمان الاسترداد",
      description: "ضمان استرداد المال خلال 7 أيام في حالة وجود مشكلة",
      color: "from-orange-500 to-amber-600"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      rating: 5,
      comment: "خدمة ممتازة وسريعة، حصلت على البطاقة فوراً وبسعر رائع!",
      image: "👨",
      verified: true
    },
    {
      name: "فاطمة علي",
      rating: 5,
      comment: "أفضل متجر للبطاقات الإلكترونية، أنصح الجميع بالتعامل معهم",
      image: "👩",
      verified: true
    },
    {
      name: "خالد السعود",
      rating: 5,
      comment: "دعم عملاء رائع وأسعار منافسة، سأتعامل معهم دائماً",
      image: "👱‍♂️",
      verified: true
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        <div className="container mx-auto text-center relative">
          <p className="text-xs md:text-sm font-medium flex items-center justify-center gap-2 animate-fade-in">
            <Building className="w-3 md:w-4 h-3 md:h-4 animate-pulse text-blue-400" />
            🏢 تم تطوير هذا المتجر بواسطة <span className="text-blue-400 font-bold">شركة علي صالح الشهري القابضة</span>
            <Crown className="w-3 md:w-4 h-3 md:h-4 text-yellow-500 animate-bounce" />
          </p>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/cards-store" className="flex items-center gap-3 group">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <ShoppingCart className="w-5 md:w-6 h-5 md:h-6 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  🛍️ متجر البطاقات الإلكترونية
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">المتجر الأول والأكثر ثقة</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {item.name}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                onClick={() => {
                  const whatsappUrl = "https://wa.me/966500000000?text=🛍️ مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <MessageCircle className="w-4 h-4 ml-2 animate-pulse relative z-10" />
                <span className="relative z-10">💬 واتساب</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden hover:scale-110 transition-transform"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-slide-in-right">
              <nav className="space-y-2">
                {navigationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-all duration-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-4 px-4">
                  <Button 
                    onClick={() => {
                      const whatsappUrl = "https://wa.me/966500000000?text=🛍️ مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
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
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-medium mb-6 md:mb-8 animate-fade-in border border-primary/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 animate-spin" />
            🏆 المتجر الأول والأكثر ثقة للبطاقات الإلكترونية في المملكة
            <Award className="w-4 md:w-5 h-4 md:h-5 animate-bounce" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 animate-fade-in [animation-delay:200ms]">
            🛍️ متجر البطاقات{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse relative">
              الإلكترونية الحصري
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms] mb-8 md:mb-10">
            🎯 اكتشف أكبر مجموعة من البطاقات الإلكترونية والرقمية الأصلية للألعاب والتطبيقات والخدمات 
            <br className="hidden md:block" />
            <span className="text-primary font-semibold">بأسعار لا تُقاوم وضمان أصلي 100%</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms] mb-12">
            <Button 
              size="lg" 
              onClick={() => {
                const cardsSection = document.getElementById('cards-section');
                if (cardsSection) {
                  cardsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-purple-600/90 shadow-2xl text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10">🛒 تصفح البطاقات الآن</span>
              <ArrowRight className="w-5 h-5 mr-2 animate-pulse relative z-10" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => {
                const whatsappUrl = "https://wa.me/966500000000?text=🛍️ مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                window.open(whatsappUrl, '_blank');
              }}
              className="border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-blue-500/5 text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <MessageCircle className="w-5 h-5 ml-2 animate-bounce relative z-10" />
              <span className="relative z-10">💬 تواصل معنا</span>
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-in [animation-delay:800ms]">
            {[
              { label: "عميل راضي", value: "15K+", icon: "👥" },
              { label: "بطاقة متاحة", value: "100+", icon: "🎫" },
              { label: "دولة مدعومة", value: "50+", icon: "🌍" },
              { label: "تقييم العملاء", value: "4.9⭐", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              ✨ لماذا نحن الأفضل؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              نقدم أفضل تجربة شراء للبطاقات الإلكترونية مع ضمانات لا تُضاهى
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-sm animate-fade-in group cursor-pointer"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📊 إحصائيات المتجر
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              أرقام تتحدث عن جودة خدماتنا وثقة عملائنا
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              return (
                <Card 
                  key={index}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-sm animate-fade-in bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 group cursor-pointer relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <CardContent className="p-4 md:p-6 relative z-10">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 md:w-14 h-12 md:h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-3 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl md:text-3xl">{stat.emoji}</span>
                      </div>
                      <p className="text-xs md:text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                      <p className="text-xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              🔍 ابحث واستكشف
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              اختر التصنيف المناسب أو ابحث عن البطاقة التي تريدها
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن البطاقة التي تريدها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm focus:border-primary focus:outline-none transition-all text-center"
              />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category, index) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  relative overflow-hidden group transition-all duration-300 hover:scale-105
                  ${selectedCategory === category.name 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                    : 'hover:bg-primary/5 border-2 hover:border-primary/30'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">{category.emoji}</span>
                  {category.name}
                  <Badge 
                    variant="secondary" 
                    className={`
                      text-xs relative z-10
                      ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}
                    `}
                  >
                    {category.count}
                  </Badge>
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="cards-section" className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              🎫 البطاقات المتاحة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {filteredCards.length === 0 
                ? "لم يتم العثور على بطاقات مطابقة لبحثك" 
                : `تم العثور على ${filteredCards.length} بطاقة`
              }
            </p>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                لم يتم العثور على نتائج
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                جرب البحث بكلمات مختلفة أو اختر تصنيف آخر
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("جميع البطاقات");
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Repeat className="w-4 h-4 ml-2" />
                إعادة تعيين البحث
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card, index) => (
                <Card 
                  key={card.id}
                  className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-sm animate-fade-in group cursor-pointer relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Background Pattern */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  
                  {/* Popular Badge */}
                  {card.isPopular && (
                    <div className="absolute top-3 left-3 z-20">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-pulse">
                        <Crown className="w-3 h-3 ml-1" />
                        الأكثر طلباً
                      </Badge>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {card.discount && (
                    <div className="absolute top-3 right-3 z-20">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 animate-bounce">
                        -{card.discount}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl">{card.image}</span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-orange-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold">{card.rating}</span>
                          <span className="text-slate-500">({card.reviews})</span>
                        </div>
                        <Badge variant="outline" className="text-xs mt-1 border-green-500 text-green-600">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          {card.availability}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {card.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    <CardDescription className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {card.description}
                    </CardDescription>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {card.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">{card.price}</span>
                          {card.originalPrice && (
                            <span className="text-sm text-slate-500 line-through">{card.originalPrice}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">شامل الضريبة</p>
                      </div>
                      <Badge className={`bg-gradient-to-r ${card.color} text-white`}>
                        {card.category}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handlePurchase(card)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                        <ShoppingCart className="w-4 h-4 ml-2 relative z-10" />
                        <span className="relative z-10">اشتري الآن</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const shareText = `🎫 اكتشف هذه البطاقة الرائعة: ${card.name} بسعر ${card.price} فقط! 

🛍️ متجر البطاقات الإلكترونية 
${window.location.href}`;
                          if (navigator.share) {
                            navigator.share({ text: shareText });
                          } else {
                            navigator.clipboard.writeText(shareText);
                            toast({
                              title: "تم النسخ!",
                              description: "تم نسخ رابط البطاقة",
                            });
                          }
                        }}
                        className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-110"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              💬 آراء عملائنا
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              اقرأ تجارب عملائنا الحقيقية معنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-2 backdrop-blur-sm animate-fade-in group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xl">{testimonial.image}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                      {testimonial.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs">عميل موثق</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              📞 تواصل معنا
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              فريق الدعم متاح 24/7 لمساعدتك
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">واتساب</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">تواصل معنا عبر الواتساب</p>
                  <Button 
                    onClick={() => {
                      const whatsappUrl = "https://wa.me/966500000000?text=🛍️ مرحباً! أريد الاستفسار عن البطاقات الإلكترونية";
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white w-full"
                  >
                    <MessageCircle className="w-4 h-4 ml-2" />
                    محادثة واتساب
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">مكالمة هاتفية</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">تحدث معنا مباشرة</p>
                  <Button 
                    onClick={() => window.open('tel:+966500000000', '_blank')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white w-full"
                  >
                    <Phone className="w-4 h-4 ml-2" />
                    اتصل الآن
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">متجر البطاقات</h3>
                  <p className="text-sm text-slate-400">الإلكترونية</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                أول متجر متخصص في البطاقات الإلكترونية بالمملكة العربية السعودية
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href} 
                      className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-lg mb-4">التصنيفات</h4>
              <ul className="space-y-2">
                {categories.slice(1, 6).map((category) => (
                  <li key={category.name}>
                    <button 
                      onClick={() => {
                        setSelectedCategory(category.name);
                        document.getElementById('cards-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
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
              <h4 className="font-bold text-lg mb-4">معلومات التواصل</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-slate-400">+966 50 000 0000</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-slate-400">info@cards-store.com</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span className="text-slate-400">المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-400 text-sm">
              © 2024 متجر البطاقات الإلكترونية. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/cards-store/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                سياسة الخصوصية
              </Link>
              <Link to="/cards-store/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                الشروط والأحكام
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-2xl animate-bounce"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default ElectronicCardsWebsite;