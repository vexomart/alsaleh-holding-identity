import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/ui/back-button";
import { 
  Car,
  MapPin,
  Clock,
  Shield,
  Star,
  Users,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  Calendar,
  CreditCard,
  Smartphone,
  Menu,
  X,
  ChevronRight,
  Award,
  Play,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Fuel,
  Settings,
  Eye,
  Headphones,
  DollarSign,
  TrendingUp,
  Zap,
  Crown,
  Sparkles,
  Heart,
  Lock,
  Wifi,
  Navigation,
  Music
} from "lucide-react";

const CarRentalLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('luxury');

  // سلايدر الهيرو الفاخر - سيارات حقيقية بجودة عالية
  const heroSlides = [
    {
      id: 1,
      title: "قُد الفخامة",
      subtitle: "اكتشف مجموعة حصرية من أفخم السيارات",
      description: "مرسيدس S-Class • BMW 7 Series • أودي A8 وأكثر",
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      cta: "استكشف الأسطول الفاخر",
      badge: "حصري"
    },
    {
      id: 2,
      title: "مغامرات لا تُنسى",
      subtitle: "سيارات رياضية متطورة لتجارب استثنائية",
      description: "بورش • فيراري • لامبورغيني • ماكلارين",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      cta: "احجز المغامرة",
      badge: "رياضي"
    },
    {
      id: 3,
      title: "الراحة المطلقة",
      subtitle: "سيارات عائلية فاخرة مع كل وسائل الراحة",
      description: "كاديلاك • لينكولن • جينيسيس • فولفو",
      image: "https://images.unsplash.com/photo-1562141961-4c343a0c2700?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
      cta: "احجز للعائلة",
      badge: "عائلي"
    }
  ];

  // أسطول السيارات المتميز
  const carCategories = {
    luxury: [
      {
        id: 1,
        name: "مرسيدس S-Class 2024",
        category: "سيدان فاخرة",
        price: "800",
        originalPrice: "1200",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["V8 Twin Turbo", "مقاعد مساج", "نظام صوت Burmester", "قيادة ذاتية"],
        rating: 5.0,
        reviews: 247,
        available: true,
        badge: "VIP",
        specs: { seats: 5, transmission: "تلقائي", fuel: "بنزين" }
      },
      {
        id: 2,
        name: "BMW 7 Series 2024",
        category: "سيدان تنفيذية",
        price: "750",
        originalPrice: "1100",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك V8", "شاشة لمس 14.9 بوصة", "تحكم بالإيماءات", "مقاعد تدليك"],
        rating: 4.9,
        reviews: 189,
        available: true,
        badge: "الأكثر طلباً",
        specs: { seats: 5, transmission: "تلقائي", fuel: "بنزين" }
      },
      {
        id: 3,
        name: "أودي A8 L 2024",
        category: "سيدان فاخرة",
        price: "700",
        originalPrice: "1050",
        image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك V6 TFSI", "نظام MMI", "مقاعد جلد طبيعي", "إضاءة Matrix LED"],
        rating: 4.8,
        reviews: 156,
        available: true,
        badge: "جديد",
        specs: { seats: 5, transmission: "تلقائي", fuel: "بنزين" }
      }
    ],
    sport: [
      {
        id: 4,
        name: "بورش 911 Carrera",
        category: "رياضية",
        price: "1200",
        originalPrice: "1800",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك Boxer", "PDK", "نظام الرياضة +", "عادم رياضي"],
        rating: 5.0,
        reviews: 98,
        available: true,
        badge: "حصري",
        specs: { seats: 2, transmission: "تلقائي", fuel: "بنزين" }
      },
      {
        id: 5,
        name: "BMW M4 Competition",
        category: "كوبيه رياضية",
        price: "1000",
        originalPrice: "1500",
        image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك V6 Twin Turbo", "M xDrive", "كربون فايبر", "نظام M"],
        rating: 4.9,
        reviews: 142,
        available: true,
        badge: "رياضي",
        specs: { seats: 4, transmission: "تلقائي", fuel: "بنزين" }
      }
    ],
    family: [
      {
        id: 6,
        name: "كاديلاك Escalade 2024",
        category: "SUV فاخر",
        price: "600",
        originalPrice: "900",
        image: "https://images.unsplash.com/photo-1562141961-4c343a0c2700?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك V8", "7 مقاعد", "نظام ترفيه متقدم", "دفع رباعي"],
        rating: 4.7,
        reviews: 203,
        available: true,
        badge: "عائلي",
        specs: { seats: 7, transmission: "تلقائي", fuel: "بنزين" }
      },
      {
        id: 7,
        name: "جينيسيس GV80",
        category: "SUV متوسط",
        price: "450",
        originalPrice: "650",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        features: ["محرك V6", "5 مقاعد", "نظام صوت Lexicon", "مقاعد جلد"],
        rating: 4.6,
        reviews: 167,
        available: true,
        badge: "متوفر",
        specs: { seats: 5, transmission: "تلقائي", fuel: "بنزين" }
      }
    ]
  };

  // الخدمات المميزة مع أيقونات متقدمة
  const premiumServices = [
    {
      icon: Crown,
      title: "خدمة VIP",
      description: "خدمة شخصية متميزة مع كونسيرج مخصص لكل احتياجاتك",
      color: "from-amber-500 to-yellow-600",
      glow: "shadow-amber-500/50"
    },
    {
      icon: Shield,
      title: "تأمين شامل بلاتيني",
      description: "تغطية كاملة 100% مع حماية شاملة ضد جميع المخاطر",
      color: "from-blue-600 to-indigo-700",
      glow: "shadow-blue-500/50"
    },
    {
      icon: Zap,
      title: "خدمة سريعة 15 دقيقة",
      description: "إجراءات محدودة وتسليم فوري خلال 15 دقيقة فقط",
      color: "from-purple-600 to-pink-600",
      glow: "shadow-purple-500/50"
    },
    {
      icon: MapPin,
      title: "توصيل لأي مكان",
      description: "خدمة توصيل لجميع أنحاء المملكة مع تتبع مباشر",
      color: "from-green-500 to-emerald-600",
      glow: "shadow-green-500/50"
    },
    {
      icon: Headphones,
      title: "دعم 24/7 متقدم",
      description: "فريق دعم متخصص متاح على مدار الساعة بـ 5 لغات",
      color: "from-orange-500 to-red-500",
      glow: "shadow-orange-500/50"
    },
    {
      icon: Smartphone,
      title: "تطبيق ذكي متطور",
      description: "تحكم كامل في السيارة عبر التطبيق مع تقنية AI",
      color: "from-teal-500 to-cyan-600",
      glow: "shadow-teal-500/50"
    }
  ];

  // الإحصائيات المتقدمة
  const stats = [
    { 
      number: "50,000+", 
      label: "عميل سعيد", 
      icon: Heart, 
      color: "from-pink-500 to-rose-600",
      description: "تقييم 4.9/5"
    },
    { 
      number: "2,500+", 
      label: "سيارة فاخرة", 
      icon: Car, 
      color: "from-blue-500 to-indigo-600",
      description: "أحدث الموديلات"
    },
    { 
      number: "85+", 
      label: "مدينة نخدمها", 
      icon: Globe, 
      color: "from-green-500 to-emerald-600",
      description: "في الخليج"
    },
    { 
      number: "15", 
      label: "عام من التميز", 
      icon: Award, 
      color: "from-amber-500 to-orange-600",
      description: "جوائز دولية"
    }
  ];

  // مميزات إضافية
  const features = [
    {
      icon: Lock,
      title: "أمان متقدم",
      description: "تشفير بنكي وحماية متقدمة لبياناتك"
    },
    {
      icon: Wifi,
      title: "واي فاي مجاني",
      description: "إنترنت عالي السرعة في جميع السيارات"
    },
    {
      icon: Navigation,
      title: "GPS متطور",
      description: "نظام ملاحة ذكي مع تحديثات مرورية مباشرة"
    },
    {
      icon: Music,
      title: "نظام صوت premium",
      description: "أنظمة صوت عالية الجودة من أفضل الماركات"
    }
  ];

  // تأثيرات التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // السلايدر التلقائي للهيرو
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // 8 ثواني لكل سلايد
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const navigation = [
    { name: "الرئيسية", href: "/car-rental-landing", active: true },
    { name: "أسطول السيارات", href: "/car-fleet" },
    { name: "احجز الآن", href: "/car-booking" },
    { name: "الخدمات", href: "#services" },
    { name: "عن الشركة", href: "#about" },
    { name: "تواصل معنا", href: "#contact" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BackButton />
      
      {/* شريط التحذير التجريبي */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-900 py-3 text-center text-sm font-semibold relative z-50 shadow-lg">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>⚠️ موقع تجريبي للعرض - جميع المعلومات والأسعار غير صحيحة</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* الشريط العلوي المتميز */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
                +966 11 456 7890
              </span>
              <span className="flex items-center gap-2 hover:text-amber-400 transition-colors cursor-pointer">
                <Mail className="w-4 h-4" />
                luxury@premiumcars.sa
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>عضوية VIP - خصم 30% على الحجز الأول</span>
              </div>
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                كود: VIP30
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* الهيدر المتطور */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-white/95 backdrop-blur-sm shadow-lg'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* الشعار المتطور */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-900 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                  <Car className="w-8 h-8 text-amber-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-slate-900" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  بريميوم كارز
                </h1>
                <p className="text-xs text-slate-600 font-medium">Premium Cars Rental</p>
              </div>
            </div>

            {/* القائمة الرئيسية */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-semibold transition-all duration-300 hover:text-blue-600 group ${
                    item.active ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                  <div className={`absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ${
                    item.active ? 'scale-100' : 'scale-0 group-hover:scale-100'
                  }`} />
                </a>
              ))}
            </div>

            {/* أزرار الإجراء المتميزة */}
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-4 h-4 ml-1" />
                اتصل بنا
              </Button>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 font-bold hover:scale-105 transition-all duration-300 shadow-xl shadow-amber-500/50" 
                asChild
              >
                <a href="/car-booking">
                  <Crown className="w-4 h-4 ml-1" />
                  احجز VIP
                </a>
              </Button>
            </div>

            {/* زر القائمة المحمولة */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-700 hover:text-blue-600 transition-colors p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* القائمة المحمولة المتطورة */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t shadow-2xl animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg px-3 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  اتصل بنا
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold" asChild>
                  <a href="/car-booking">احجز VIP</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* السلايدر الرئيسي الفاخر */}
      <section className="relative h-screen overflow-hidden">
        {/* الخلفيات مع تأثيرات متقدمة */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                index === currentSlide 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-110 blur-sm'
              }`}
            >
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              {/* تأثيرات ضوئية */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          ))}
        </div>

        {/* المحتوى الرئيسي */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl">
              <div className="text-white space-y-8 animate-fade-in">
                {/* الشارة المميزة */}
                <div className="flex items-center gap-4 mb-6">
                  <Badge className={`${
                    heroSlides[currentSlide].badge === 'حصري' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                    heroSlides[currentSlide].badge === 'رياضي' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                    'bg-gradient-to-r from-blue-500 to-indigo-600'
                  } text-white border-0 px-4 py-2 text-sm font-bold shadow-lg`}>
                    <Crown className="w-4 h-4 ml-1" />
                    {heroSlides[currentSlide].badge}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                    <span className="text-amber-400 font-bold mr-2">5.0</span>
                  </div>
                </div>
                
                {/* العنوان الرئيسي */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
                    {heroSlides[currentSlide].title}
                  </span>
                </h1>
                
                {/* العنوان الفرعي */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl text-blue-200 font-bold">
                  {heroSlides[currentSlide].subtitle}
                </h2>
                
                {/* الوصف */}
                <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-medium leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>

                {/* الأزرار المتميزة */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 hover:scale-105 transition-all duration-300 text-xl px-10 py-7 shadow-2xl shadow-amber-500/50 font-black"
                    asChild
                  >
                    <a href="/car-booking" className="flex items-center">
                      <Crown className="w-7 h-7 ml-3" />
                      {heroSlides[currentSlide].cta}
                    </a>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-3 border-white/80 text-white hover:bg-white hover:text-slate-900 transition-all duration-300 text-xl px-10 py-7 backdrop-blur-md bg-white/10 font-bold"
                  >
                    <Play className="w-7 h-7 ml-3" />
                    شاهد الجولة الافتراضية
                  </Button>
                </div>

                {/* شريط البحث المتقدم */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mt-12 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Search className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl font-bold text-white">ابحث عن سيارتك المثالية</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-amber-300">مكان الاستلام</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="اختر المدينة"
                          className="w-full bg-white/20 border-2 border-white/30 rounded-2xl px-12 py-4 text-white placeholder-gray-300 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-amber-300">تاريخ الاستلام</label>
                      <div className="relative">
                        <Calendar className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border-2 border-white/30 rounded-2xl px-12 py-4 text-white font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-amber-300">تاريخ الإرجاع</label>
                      <div className="relative">
                        <Calendar className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border-2 border-white/30 rounded-2xl px-12 py-4 text-white font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-amber-300">فئة السيارة</label>
                      <div className="relative">
                        <Car className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        <select className="w-full bg-white/20 border-2 border-white/30 rounded-2xl px-12 py-4 text-white font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all appearance-none">
                          <option value="" className="text-slate-900">اختر الفئة</option>
                          <option value="luxury" className="text-slate-900">فاخرة</option>
                          <option value="sport" className="text-slate-900">رياضية</option>
                          <option value="family" className="text-slate-900">عائلية</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 py-4 rounded-2xl text-lg font-bold shadow-xl hover:scale-105 transition-all">
                        <Search className="w-6 h-6 ml-2" />
                        ابحث الآن
                      </Button>
                    </div>
                  </div>
                </div>

                {/* مؤشرات الثقة */}
                <div className="flex flex-wrap items-center gap-8 pt-8 opacity-80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-medium">تأمين شامل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">إلغاء مجاني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-medium">معتمد دولياً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium">خدمة 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التنقل المتطورة */}
        <button 
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20"
        >
          <ArrowRight className="w-7 h-7" />
        </button>

        {/* مؤشرات السلايدر المتطورة */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className={`relative transition-all duration-500 ${
                index === currentSlide 
                  ? 'w-12 h-4 bg-white rounded-full' 
                  : 'w-4 h-4 bg-white/50 hover:bg-white/70 rounded-full hover:scale-125'
              }`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* مؤشر التمرير للأسفل */}
        <div className="absolute bottom-8 right-8 z-30 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات المتقدم */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* تأثيرات الخلفية */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_70%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-6 py-3 text-lg font-bold mb-6">
              <TrendingUp className="w-5 h-5 ml-2" />
              إنجازاتنا المذهلة
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              أرقام تحكي قصة 
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent"> نجاحنا</span>
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              خمسة عشر عامًا من التميز في خدمة تأجير السيارات الفاخرة في منطقة الخليج
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="relative group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* التأثير الضوئي */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${stat.color} opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-500 rounded-3xl`}></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-110 hover:-translate-y-2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-center">
                      <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-all duration-300">
                        {stat.number}
                      </div>
                      <div className="text-lg font-bold text-white/90 mb-2">
                        {stat.label}
                      </div>
                      <div className="text-sm text-amber-300 font-medium">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* شريط الثقة */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-xl rounded-2xl px-12 py-6 border border-white/20">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-amber-400 fill-current" />
                <span className="text-white font-bold text-lg">تقييم 4.9/5</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-400" />
                <span className="text-white font-bold text-lg">15+ جائزة دولية</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                <span className="text-white font-bold text-lg">ISO 9001:2015</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم أسطول السيارات المتقدم */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        {/* نمط الشبكة */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_26%,transparent_27%,transparent_74%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05)_76%,transparent_77%)] bg-[length:60px_60px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* العنوان */}
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 text-lg font-bold mb-6">
              <Car className="w-5 h-5 ml-2" />
              أسطول متميز
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
              سيارات 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">استثنائية</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              اختر من مجموعة واسعة من أفخم وأحدث السيارات في العالم
            </p>
          </div>

          {/* تبويبات الفئات */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { key: 'luxury', label: 'فاخرة', icon: Crown },
              { key: 'sport', label: 'رياضية', icon: Zap },
              { key: 'family', label: 'عائلية', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </button>
            ))}
          </div>

          {/* شبكة السيارات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carCategories[activeTab].map((car, index) => (
              <div 
                key={car.id} 
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* التأثير الضوئي */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl"></div>
                
                <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl group-hover:-translate-y-4 transition-all duration-500 bg-white">
                  {/* الصورة مع التأثيرات */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={car.image}
                      alt={car.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    {/* تدرج الصورة */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* الشارة */}
                    <div className="absolute top-4 right-4">
                      <Badge className={`${
                        car.badge === 'VIP' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' :
                        car.badge === 'الأكثر طلباً' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                        car.badge === 'جديد' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        'bg-gradient-to-r from-blue-500 to-indigo-600'
                      } text-white px-3 py-1 text-sm font-bold shadow-lg`}>
                        {car.badge}
                      </Badge>
                    </div>

                    {/* التقييم */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-white font-bold text-sm">{car.rating}</span>
                        <span className="text-white/70 text-xs">({car.reviews})</span>
                      </div>
                    </div>

                    {/* زر العرض */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="sm" className="bg-white/90 text-slate-900 hover:bg-white">
                        <Eye className="w-4 h-4 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* العنوان والفئة */}
                    <div className="mb-4">
                      <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {car.name}
                      </h3>
                      <p className="text-slate-500 font-medium">{car.category}</p>
                    </div>

                    {/* المواصفات */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{car.specs.seats}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{car.specs.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{car.specs.fuel}</span>
                      </div>
                    </div>

                    {/* المميزات */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {car.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                            {feature}
                          </span>
                        ))}
                        {car.features.length > 3 && (
                          <span className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                            +{car.features.length - 3} المزيد
                          </span>
                        )}
                      </div>
                    </div>

                    {/* السعر والحجز */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-black text-slate-900">{car.price}</span>
                          <span className="text-slate-500 font-medium">ريال/يوم</span>
                        </div>
                        {car.originalPrice && (
                          <span className="text-slate-400 line-through text-sm">{car.originalPrice} ريال</span>
                        )}
                      </div>
                      
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-6 py-3 hover:scale-105 transition-all duration-300 shadow-lg"
                        asChild
                      >
                        <a href="/car-booking">
                          <Calendar className="w-4 h-4 ml-1" />
                          احجز الآن
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* زر عرض المزيد */}
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white px-12 py-6 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl"
              asChild
            >
              <a href="/car-fleet">
                <Car className="w-6 h-6 ml-2" />
                عرض جميع السيارات
                <ChevronRight className="w-6 h-6 mr-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* قسم الخدمات المتميزة */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* تأثيرات الخلفية المتقدمة */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* العنوان */}
          <div className="text-center mb-20">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-6 py-3 text-lg font-bold mb-6">
              <Sparkles className="w-5 h-5 ml-2" />
              خدماتنا المميزة
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              تجربة 
              <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">استثنائية</span>
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              نقدم خدمات متكاملة تضمن لك أفضل تجربة لتأجير السيارات الفاخرة
            </p>
          </div>

          {/* شبكة الخدمات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.title}
                  className="group relative animate-fade-in hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* التأثير الضوئي */}
                  <div className={`absolute -inset-4 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-500 rounded-3xl`}></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-2">
                    {/* الأيقونة */}
                    <div className={`w-20 h-20 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl ${service.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* المحتوى */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {service.description}
                    </p>

                    {/* زر تفاعلي */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white hover:text-slate-900">
                        اعرف المزيد
                        <ChevronRight className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* المميزات الإضافية */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-white mb-12">مميزات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.title}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* قسم المراجعات والشهادات */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 text-lg font-bold mb-6">
              <Star className="w-5 h-5 ml-2" />
              آراء عملائنا
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
              شهادات 
              <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">العملاء</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد السعيد",
                role: "رجل أعمال",
                rating: 5,
                comment: "خدمة استثنائية وسيارات فاخرة بحالة ممتازة. التعامل راقي ومهني جداً.",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "فاطمة الزهراء",
                role: "مدير تنفيذي",
                rating: 5,
                comment: "أفضل شركة تأجير سيارات تعاملت معها. الأسعار معقولة والخدمة مذهلة.",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b29d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              },
              {
                name: "محمد العتيبي",
                role: "طبيب",
                rating: 5,
                comment: "تجربة رائعة مع فريق محترف. السيارة كانت نظيفة وحديثة تماماً.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
              }
            ].map((review, index) => (
              <Card key={review.name} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={review.image}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                      <p className="text-slate-500">{review.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-slate-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الاتصال والحجز */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 px-6 py-3 text-lg font-bold mb-8">
              <Crown className="w-5 h-5 ml-2" />
              ابدأ رحلتك الآن
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              جاهز للمغامرة؟
            </h2>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              احجز سيارتك الفاخرة الآن واستمتع بتجربة قيادة لا تُنسى مع أفضل الخدمات
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-slate-900 font-black text-xl px-12 py-7 hover:scale-105 transition-all duration-300 shadow-2xl shadow-amber-500/50"
                asChild
              >
                <a href="/car-booking">
                  <Crown className="w-6 h-6 ml-2" />
                  احجز VIP الآن
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-3 border-white text-white hover:bg-white hover:text-slate-900 text-xl px-12 py-7 font-bold transition-all duration-300"
              >
                <Phone className="w-6 h-6 ml-2" />
                اتصل بنا
              </Button>
            </div>

            {/* معلومات الاتصال */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <Phone className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">اتصل بنا</h3>
                <p className="text-white/80">+966 11 456 7890</p>
              </div>
              <div className="text-center">
                <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">راسلنا</h3>
                <p className="text-white/80">luxury@premiumcars.sa</p>
              </div>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">زر معرضنا</h3>
                <p className="text-white/80">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر المتطور */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* الشعار والوصف */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <Car className="w-7 h-7 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">بريميوم كارز</h3>
                  <p className="text-xs text-slate-400">Premium Cars Rental</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                رائدون في تأجير السيارات الفاخرة في منطقة الخليج مع خدمة متميزة وأسطول حديث.
              </p>
            </div>

            {/* الروابط السريعة */}
            <div>
              <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><a href="/car-fleet" className="text-slate-400 hover:text-white transition-colors">أسطول السيارات</a></li>
                <li><a href="/car-booking" className="text-slate-400 hover:text-white transition-colors">احجز الآن</a></li>
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">الخدمات</a></li>
                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">من نحن</a></li>
              </ul>
            </div>

            {/* الخدمات */}
            <div>
              <h4 className="font-bold text-lg mb-6">خدماتنا</h4>
              <ul className="space-y-3">
                <li><span className="text-slate-400">تأجير قصير المدى</span></li>
                <li><span className="text-slate-400">تأجير طويل المدى</span></li>
                <li><span className="text-slate-400">خدمة VIP</span></li>
                <li><span className="text-slate-400">خدمة الشركات</span></li>
              </ul>
            </div>

            {/* الاتصال */}
            <div>
              <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-400">+966 11 456 7890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-400">info@premiumcars.sa</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-slate-400">الرياض، السعودية</span>
                </div>
              </div>
            </div>
          </div>

          {/* خط الفصل والروابط القانونية */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-slate-400 mb-4 md:mb-0">
                © 2024 بريميوم كارز. جميع الحقوق محفوظة.
              </div>
              <div className="flex gap-6">
                <a href="/car-rental/terms" className="text-slate-400 hover:text-white transition-colors">الشروط والأحكام</a>
                <a href="/car-rental/privacy" className="text-slate-400 hover:text-white transition-colors">سياسة الخصوصية</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarRentalLanding;