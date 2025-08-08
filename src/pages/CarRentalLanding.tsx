import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/ui/back-button";
import { useToast } from "@/hooks/use-toast";
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
  Heart,
  Share2,
  MessageCircle,
  Navigation,
  Zap,
  Sparkles,
  MapPin as LocationIcon,
  Timer,
  Target,
  BookOpen,
  Bookmark,
  Send,
  ChevronDown,
  Wifi,
  Battery,
  Bluetooth,
  Camera,
  Video
} from "lucide-react";

const CarRentalLanding = () => {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState('all');

  // الصور المتطورة مع سلايدر ديناميكي
  const heroSlides = [
    {
      id: 1,
      title: "تأجير السيارات الذكي",
      subtitle: "تكنولوجيا متقدمة وخدمة استثنائية",
      description: "احجز • اقود • استمتع",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      cta: "ابدأ الآن",
      badge: "الأحدث"
    },
    {
      id: 2,
      title: "سيارات فاخرة لكل مناسبة",
      subtitle: "تجربة قيادة استثنائية مع أحدث السيارات الفاخرة",
      description: "مرسيدس • BMW • أودي وأكثر",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      cta: "استكشف الأسطول",
      badge: "الأكثر شعبية"
    },
    {
      id: 3,
      title: "رحلات آمنة ومريحة",
      subtitle: "مع تأمين شامل وخدمة عملاء 24/7",
      description: "تأمين • صيانة • دعم فني",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      cta: "احجز بثقة",
      badge: "موثوق"
    }
  ];

  const featuredCars = [
    {
      id: 1,
      name: "مرسيدس E-Class 2024",
      category: "فاخرة",
      price: "350",
      originalPrice: "450",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["تلقائي", "5 مقاعد", "GPS", "تكييف"],
      rating: 4.9,
      reviews: 128,
      available: true,
      badge: "الأكثر طلباً"
    },
    {
      id: 2,
      name: "تويوتا كامري 2024",
      category: "اقتصادية",
      price: "180",
      originalPrice: "220",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["تلقائي", "5 مقاعد", "بلوتوث", "تكييف"],
      rating: 4.7,
      reviews: 89,
      available: true,
      badge: "صفقة اليوم"
    },
    {
      id: 3,
      name: "BMW X5 2024",
      category: "رياضية",
      price: "500",
      originalPrice: "600",
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: ["تلقائي", "7 مقاعد", "4WD", "جلد"],
      rating: 4.8,
      reviews: 156,
      available: true,
      badge: "جديد"
    }
  ];

  const services = [
    {
      icon: Shield,
      title: "تأمين شامل",
      description: "تأمين كامل على جميع السيارات مع تغطية شاملة",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "خدمة 24/7",
      description: "دعم فني ومساعدة على مدار الساعة طوال أيام الأسبوع",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "التوصيل للمنزل",
      description: "خدمة توصيل السيارة لأي مكان تريده في المملكة",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: CreditCard,
      title: "دفع آمن",
      description: "طرق دفع متعددة وآمنة مع حماية كاملة للبيانات",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      icon: Smartphone,
      title: "تطبيق ذكي",
      description: "احجز وأدير حجزك بسهولة من خلال التطبيق الذكي",
      color: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      icon: Award,
      title: "جودة معتمدة",
      description: "شهادات جودة دولية وخدمة حائزة على جوائز",
      color: "bg-gradient-to-br from-teal-500 to-teal-600"
    }
  ];

  const stats = [
    { number: "25,000+", label: "عميل راضٍ", icon: Users, color: "from-blue-500 to-blue-600", growth: "+12%" },
    { number: "1,200+", label: "سيارة متاحة", icon: Car, color: "from-green-500 to-green-600", growth: "+25%" },
    { number: "50+", label: "مدينة نخدمها", icon: MapPin, color: "from-purple-500 to-purple-600", growth: "+8%" },
    { number: "12", label: "سنوات خبرة", icon: Award, color: "from-orange-500 to-orange-600", growth: "مستمر" },
    { number: "4.9/5", label: "تقييم العملاء", icon: Star, color: "from-yellow-500 to-yellow-600", growth: "+0.2" },
    { number: "24/7", label: "دعم فني", icon: Clock, color: "from-red-500 to-red-600", growth: "دائم" }
  ];

  // آراء العملاء المتقدمة
  const testimonials = [
    {
      id: 1,
      name: "أحمد السعيد",
      title: "رجل أعمال",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "خدمة ممتازة وسيارات نظيفة ومريحة. الحجز كان سهل والتعامل احترافي جداً.",
      date: "منذ أسبوع",
      verified: true,
      helpful: 45
    },
    {
      id: 2, 
      name: "فاطمة النور",
      title: "طبيبة",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "استخدمت الخدمة لرحلة عائلية وكانت تجربة رائعة. السيارة كانت حديثة ومجهزة بكل شيء.",
      date: "منذ 3 أيام",
      verified: true,
      helpful: 32
    },
    {
      id: 3,
      name: "محمد العلي",
      title: "مهندس",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "أفضل شركة تأجير سيارات جربتها. السعر معقول والخدمة ممتازة.",
      date: "منذ يومين",
      verified: true,
      helpful: 28
    }
  ];

  // مواقع متقدمة
  const locations = [
    { 
      name: "الرياض", 
      branches: 8, 
      popular: true,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    },
    { 
      name: "جدة", 
      branches: 6, 
      popular: true,
      image: "https://images.unsplash.com/photo-1564639883071-b3b6bb6e4498?w=300&h=200&fit=crop"
    },
    { 
      name: "الدمام", 
      branches: 4, 
      popular: false,
      image: "https://images.unsplash.com/photo-1512733596533-7b00ccf8ebaf?w=300&h=200&fit=crop"
    },
    { 
      name: "مكة المكرمة", 
      branches: 3, 
      popular: true,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // السلايدر التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: "الرئيسية", href: "/car-rental-landing", active: true },
    { name: "أسطول السيارات", href: "/car-fleet" },
    { name: "احجز الآن", href: "/car-booking" },
    { name: "من نحن", href: "#about" },
    { name: "تواصل معنا", href: "#contact" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <BackButton />
      
      {/* شريط التحذير */}
      <div className="bg-yellow-400 text-black py-2 text-center text-sm font-medium relative z-50">
        <div className="container mx-auto px-4">
          ⚠️ هذا موقع تجريبي فقط - جميع المعلومات والأسعار غير صحيحة ولأغراض العرض فقط
        </div>
      </div>
      {/* شريط علوي */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                0555812567
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                info@alialshehriholding.com
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span>خصم 20% على الحجز الأول</span>
              <span className="bg-white/20 px-2 py-1 rounded text-xs">كود: FIRST20</span>
            </div>
          </div>
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">كار رنت برو</h1>
                <p className="text-xs text-slate-500">Car Rent Pro</p>
              </div>
            </div>

            {/* القائمة الرئيسية */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue-600 relative ${
                    item.active ? 'text-blue-600' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                  {item.active && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </a>
              ))}
            </div>

            {/* أزرار الإجراء */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Phone className="w-4 h-4 ml-1" />
                اتصل بنا
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform shadow-lg" asChild>
                <a href="/car-booking">
                  <Calendar className="w-4 h-4 ml-1" />
                  احجز الآن
                </a>
              </Button>
            </div>

            {/* زر القائمة المحمولة */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* القائمة المحمولة */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-slate-700 hover:text-blue-600 transition-colors border-b border-slate-100 last:border-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <Button variant="outline" className="border-blue-600 text-blue-600">
                  اتصل بنا
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                  <a href="/car-booking">احجز الآن</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* السلايدر الرئيسي */}
      <section className="relative h-[90vh] overflow-hidden">
        {/* الخلفيات */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img 
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>
          ))}
        </div>

        {/* المحتوى */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl animate-fade-in">
              <div className="text-white space-y-6">
                <Badge className="bg-blue-600/90 text-white border-0 mb-4">
                  سيارات فاخرة
                </Badge>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                
                <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-200 font-medium">
                  {heroSlides[currentSlide].subtitle}
                </h2>
                
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                  {heroSlides[currentSlide].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all text-lg px-8 py-6 shadow-2xl"
                    asChild
                  >
                    <a href="/car-booking">
                      <Car className="w-6 h-6 ml-2" />
                      {heroSlides[currentSlide].cta}
                    </a>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white/80 text-white hover:bg-white hover:text-slate-900 transition-all text-lg px-8 py-6 backdrop-blur-sm"
                  >
                    <Play className="w-6 h-6 ml-2" />
                    شاهد الفيديو
                  </Button>
                </div>

                {/* شريط البحث السريع */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-8 border border-white/20">
                  <h3 className="text-lg font-semibold mb-4">ابحث عن سيارتك المثالية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm mb-2">مكان الاستلام</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="اختر المدينة"
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-10 py-3 text-white placeholder-gray-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">تاريخ الاستلام</label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-10 py-3 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">تاريخ الإرجاع</label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input 
                          type="date" 
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-10 py-3 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                        <Search className="w-5 h-5 ml-2" />
                        ابحث
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التنقل */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* مؤشرات السلايدر */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              أرقام تتحدث عن نفسها
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              نفخر بثقة عملائنا وإنجازاتنا المتميزة في قطاع تأجير السيارات
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center group hover:scale-110 transition-all duration-300"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-3xl transition-all`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* السيارات المميزة */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-4">السيارات المميزة</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              اختر من أفضل السيارات
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              مجموعة مختارة من أفضل السيارات المتاحة مع عروض خاصة وخصومات حصرية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                <div className="relative">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {car.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant={car.available ? "default" : "secondary"} className="bg-green-500 text-white">
                      {car.available ? "متاح" : "غير متاح"}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{car.name}</h3>
                      <p className="text-slate-500 text-sm">{car.category}</p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{car.rating}</span>
                        <span className="text-xs text-slate-500">({car.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900">{car.price} ر.س</span>
                      <span className="text-sm text-slate-500 line-through">{car.originalPrice} ر.س</span>
                    </div>
                    <span className="text-sm text-slate-500">/ يوم</span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform" asChild>
                      <a href="/car-booking">
                        احجز الآن
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-3" 
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/car-rental?car=${car.name}`;
                        const shareText = `تحقق من هذه السيارة الرائعة: ${car.name} - ${car.price} ر.س/يوم`;
                        
                        if (navigator.share) {
                          navigator.share({
                            title: `${car.name} - كار رنت برو`,
                            text: shareText,
                            url: shareUrl,
                          }).catch((error) => {
                            console.log('Error sharing:', error);
                            // Fallback to copy to clipboard
                            navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                              toast({
                                title: "تم النسخ!",
                                description: "تم نسخ رابط السيارة إلى الحافظة",
                              });
                            });
                          });
                        } else {
                          // Fallback to copy to clipboard
                          navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                            toast({
                              title: "تم النسخ!",
                              description: "تم نسخ رابط السيارة إلى الحافظة",
                            });
                          }).catch(() => {
                            toast({
                              title: "خطأ",
                              description: "لم يتم نسخ الرابط، حاول مرة أخرى",
                              variant: "destructive",
                            });
                          });
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50" asChild>
              <a href="/car-fleet">
                عرض جميع السيارات
                <ChevronRight className="w-5 h-5 mr-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* الخدمات */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 mb-4">خدماتنا المتميزة</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              لماذا تختار كار رنت برو؟
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم أفضل الخدمات والمميزات لضمان تجربة تأجير استثنائية ومريحة لجميع عملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم التوظيف */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              انضم إلى فريقنا
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              كن جزءاً من فريق عمل متميز في شركة رائدة في مجال تأجير السيارات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* وظيفة مندوب مبيعات */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">مندوب مبيعات</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                مطلوب مندوب مبيعات متحمس للانضمام إلى فريقنا وتقديم أفضل خدمة للعملاء
              </p>
              <ul className="space-y-2 mb-6 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  خبرة في المبيعات
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  مهارات تواصل ممتازة
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  رخصة قيادة سارية
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                <a href="/car-rental/careers#application">
                  تقدم للوظيفة
                </a>
              </Button>
            </div>

            {/* وظيفة فني صيانة */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">فني صيانة</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                نبحث عن فني صيانة مهني للحفاظ على أسطولنا من السيارات في أفضل حالة
              </p>
              <ul className="space-y-2 mb-6 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  خبرة في صيانة السيارات
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  شهادة فني معتمد
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  القدرة على العمل بفريق
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" asChild>
                <a href="/car-rental/careers#application">
                  تقدم للوظيفة
                </a>
              </Button>
            </div>

            {/* وظيفة خدمة عملاء */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">موظف خدمة عملاء</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                انضم إلى فريق خدمة العملاء لتقديم الدعم والمساعدة للعملاء على مدار الساعة
              </p>
              <ul className="space-y-2 mb-6 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  إتقان اللغة العربية والإنجليزية
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  مهارات حل المشاكل
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  خبرة في خدمة العملاء
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                <a href="/car-rental/careers#application">
                  تقدم للوظيفة
                </a>
              </Button>
            </div>
          </div>

          {/* مزايا العمل معنا */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">
              لماذا تختار العمل معنا؟
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">راتب تنافسي</h4>
                <p className="text-slate-600">نقدم رواتب ومكافآت تنافسية في السوق</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">نمو مهني</h4>
                <p className="text-slate-600">فرص تطوير وتدريب مستمرة لتحقيق النجاح</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">تأمين صحي</h4>
                <p className="text-slate-600">تأمين صحي شامل لك ولعائلتك</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-2">مرونة في العمل</h4>
                <p className="text-slate-600">ساعات عمل مرنة وبيئة عمل إيجابية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              جاهز لبدء رحلتك؟
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              احجز سيارتك الآن واستمتع بتجربة قيادة استثنائية في جميع أنحاء المملكة العربية السعودية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all text-lg px-12 py-6 shadow-2xl font-semibold"
                asChild
              >
                <a href="/car-booking">
                  <Calendar className="w-6 h-6 ml-2" />
                  احجز سيارتك الآن
                </a>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all text-lg px-12 py-6 backdrop-blur-sm"
              >
                <Phone className="w-6 h-6 ml-2" />
                تواصل معنا
              </Button>
            </div>

            <div className="text-white/80 text-sm">
              أو اتصل بنا على <span className="font-semibold">+966 11 123 4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* معلومات الشركة */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">كار رنت برو</h3>
                  <p className="text-xs text-slate-400">Car Rent Pro</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                شركة رائدة في تأجير السيارات بالمملكة العربية السعودية، نقدم خدمات متميزة وأسطول حديث لضمان راحة وأمان عملائنا.
              </p>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            {/* الخدمات */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">خدماتنا</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  تأجير يومي
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  تأجير شهري
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  سيارات الأعراس
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  النقل التنفيذي
                </a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  رحلات المطار
                </a></li>
              </ul>
            </div>
            
            {/* معلومات مهمة */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">معلومات مهمة</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="/car-rental/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  شروط الإيجار
                </a></li>
                <li><a href="/car-rental/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  سياسة الخصوصية
                </a></li>
                <li><a href="/car-rental/faq" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  أسئلة شائعة
                </a></li>
                <li><a href="/car-rental/guide" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  دليل العميل
                </a></li>
                <li><a href="/car-rental/insurance" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  سياسة التأمين
                </a></li>
              </ul>
            </div>
            
            {/* التوظيف والصفحات */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">الشركة</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="/car-rental/about" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  من نحن
                </a></li>
                <li><a href="/car-rental/careers" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  فرص العمل
                </a></li>
                <li><a href="/car-rental/news" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  أخبار الشركة
                </a></li>
                <li><a href="/car-rental/partners" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  شركاؤنا
                </a></li>
              </ul>
            </div>
            
            {/* تواصل معنا */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">تواصل معنا</h4>
              <div className="space-y-4 text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">اتصل بنا</p>
                    <p className="font-medium">0555812567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">راسلنا</p>
                    <p className="font-medium">info@alialshehriholding.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">العنوان</p>
                    <p className="font-medium">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">ساعات العمل</p>
                    <p className="font-medium">متاح 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2024 كار رنت برو. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="/car-rental/terms" className="hover:text-blue-400 transition-colors">الشروط والأحكام</a>
              <a href="/car-rental/privacy" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</a>
              <a href="/car-rental/contact" className="hover:text-blue-400 transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarRentalLanding;