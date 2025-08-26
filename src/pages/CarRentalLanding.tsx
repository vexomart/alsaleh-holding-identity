import React, { useState, useEffect, useRef } from "react";
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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState('all');
  const [counters, setCounters] = useState({});
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkingHours, setIsWorkingHours] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState('');
  const [timeUntilOpen, setTimeUntilOpen] = useState('');
  const statsRef = useRef(null);
  const servicesRef = useRef(null);

  // دالة لتشغيل أنيميشن العداد
  const animateCounter = (start, end, duration, key) => {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    const updateCounter = () => {
      const now = Date.now();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * (end - start)));
      
      setCounters(prev => ({
        ...prev,
        [key]: value
      }));
      
      if (remaining > 0) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  // الصورة الرئيسية
  const heroSlide = {
    title: "تأجير السيارات الذكي",
    subtitle: "تكنولوجيا متقدمة وخدمة استثنائية",
    description: "احجز • اقود • استمتع",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cta: "ابدأ الآن",
    badge: "الأحدث"
  };

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
    { 
      number: "25000", 
      displayNumber: "25,000+", 
      label: "عميل راضٍ", 
      icon: Users, 
      color: "from-blue-500 to-blue-600", 
      growth: "+12%",
      description: "عميل سعيد بخدماتنا"
    },
    { 
      number: "1200", 
      displayNumber: "1,200+", 
      label: "سيارة متاحة", 
      icon: Car, 
      color: "from-green-500 to-green-600", 
      growth: "+25%",
      description: "سيارة حديثة ومتنوعة"
    },
    { 
      number: "50", 
      displayNumber: "50+", 
      label: "مدينة نخدمها", 
      icon: MapPin, 
      color: "from-purple-500 to-purple-600", 
      growth: "+8%",
      description: "مدينة في المملكة"
    },
    { 
      number: "12", 
      displayNumber: "12", 
      label: "سنوات خبرة", 
      icon: Award, 
      color: "from-orange-500 to-orange-600", 
      growth: "مستمر",
      description: "عام من التميز"
    },
    { 
      number: "49", 
      displayNumber: "4.9/5", 
      label: "تقييم العملاء", 
      icon: Star, 
      color: "from-yellow-500 to-yellow-600", 
      growth: "+0.2",
      description: "تقييم ممتاز"
    },
    { 
      number: "24", 
      displayNumber: "24/7", 
      label: "دعم فني", 
      icon: Clock, 
      color: "from-red-500 to-red-600", 
      growth: "دائم",
      description: "خدمة مستمرة"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // مراقب الإحصائيات لتشغيل الأنيميشن
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStatsVisible) {
            setIsStatsVisible(true);
            
            // تشغيل أنيميشن العدادات
            stats.forEach((stat, index) => {
              const numericValue = parseInt(stat.number);
              if (!isNaN(numericValue)) {
                setTimeout(() => {
                  animateCounter(0, numericValue, 2000, index);
                }, index * 100);
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isStatsVisible]);

  // مراقب الخدمات لتشغيل الأنيميشن
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isServicesVisible) {
            setIsServicesVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, [isServicesVisible]);

  // تحديث الوقت وحساب ساعات العمل
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;
      
      // ساعات العمل: الأحد-الخميس 8:00-22:00، الجمعة 14:00-22:00، السبت 8:00-12:00
      let isOpen = false;
      let nextOpen = '';
      
      if (day >= 0 && day <= 4) { // الأحد إلى الخميس
        isOpen = currentMinutes >= 480 && currentMinutes < 1320; // 8:00 AM to 10:00 PM
        if (!isOpen && currentMinutes < 480) {
          nextOpen = 'اليوم في 8:00 صباحاً';
        } else if (!isOpen) {
          nextOpen = 'غداً في 8:00 صباحاً';
        }
      } else if (day === 5) { // الجمعة
        isOpen = currentMinutes >= 840 && currentMinutes < 1320; // 2:00 PM to 10:00 PM
        if (!isOpen && currentMinutes < 840) {
          nextOpen = 'اليوم في 2:00 مساءً';
        } else if (!isOpen) {
          nextOpen = 'الأحد في 8:00 صباحاً';
        }
      } else { // السبت
        isOpen = currentMinutes >= 480 && currentMinutes < 720; // 8:00 AM to 12:00 PM
        if (!isOpen && currentMinutes < 480) {
          nextOpen = 'اليوم في 8:00 صباحاً';
        } else if (!isOpen) {
          nextOpen = 'الأحد في 8:00 صباحاً';
        }
      }
      
      setIsWorkingHours(isOpen);
      setNextOpenTime(nextOpen);
      
      // حساب الوقت المتبقي
      if (!isOpen && nextOpen.includes('اليوم')) {
        const targetHour = nextOpen.includes('8:00 صباحاً') ? 8 : 14;
        const targetMinutes = targetHour * 60;
        const timeLeft = targetMinutes - currentMinutes;
        
        if (timeLeft > 0) {
          const hoursLeft = Math.floor(timeLeft / 60);
          const minutesLeft = timeLeft % 60;
          setTimeUntilOpen(`${hoursLeft} ساعة و ${minutesLeft} دقيقة`);
        }
      } else {
        setTimeUntilOpen('');
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000); // تحديث كل دقيقة
    
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { name: "الرئيسية", href: "/car-rental-landing", active: true },
    { name: "أسطول السيارات", href: "/car-fleet" },
    { name: "خدماتنا", href: "/car-rental/services" },
    { name: "احجز الآن", href: "/car-booking" },
    { name: "من نحن", href: "/car-rental/about" },
    { name: "تواصل معنا", href: "/car-rental/contact" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <BackButton />
      
      {/* شريط التحذير */}
      <div className="bg-yellow-400 text-black py-2 text-center text-sm font-medium relative z-50">
        <div className="container mx-auto px-4">
          ⚠️ هذا موقع تجريبي فقط - جميع المعلومات والأسعار غير صحيحة ولأغراض العرض فقط
        </div>
      </div>

      {/* الهيدر الرئيسي */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* الشعار */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">كار رنت برو</h1>
                <p className="text-xs text-blue-200">Car Rent Pro</p>
              </div>
            </div>

            {/* القائمة الرئيسية */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-blue-200 ${
                    item.active ? 'text-white border-b-2 border-white pb-1' : 'text-blue-100'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* أزرار الإجراء */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-blue-600">
                تواصل معنا
              </Button>
              <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <a href="/car-booking">احجز الآن</a>
              </Button>
            </div>

            {/* زر القائمة المحمولة */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-blue-200 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* القائمة المحمولة */}
        {isMenuOpen && (
          <div className="lg:hidden bg-blue-700 border-t border-blue-500">
            <div className="container mx-auto px-4 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-blue-100 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-blue-500">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  تواصل معنا
                </Button>
                <Button className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                  <a href="/car-booking">احجز الآن</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* القسم الرئيسي */}
      <section className="relative bg-gray-900">
        <div className="relative h-[70vh] min-h-[500px] w-full">
          {/* صورة الخلفية */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroSlide.image})` }}
          />
          
          {/* طبقة التدرج */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent" />

          {/* المحتوى */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-4xl mx-auto text-white">
                
                {/* الشارة */}
                <Badge className="bg-blue-600 text-white border-0 mb-6 px-4 py-2">
                  {heroSlide.badge}
                </Badge>
                
                {/* العنوان الرئيسي */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {heroSlide.title}
                </h1>
                
                {/* العنوان الفرعي */}
                <p className="text-lg sm:text-xl md:text-2xl mb-4 text-blue-100">
                  {heroSlide.subtitle}
                </p>
                
                {/* الوصف */}
                <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90">
                  {heroSlide.description}
                </p>

                {/* الأزرار */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4" asChild>
                    <a href="/car-booking">{heroSlide.cta}</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
                    <Play className="w-5 h-5 ml-2" />
                    شاهد الفيديو
                  </Button>
                </div>

                {/* نموذج البحث المتجاوب */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-2xl max-w-5xl mx-auto">
                  <h3 className="text-gray-800 text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center">
                    ابحث عن سيارتك المثالية
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">
                        مكان الاستلام
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="اختر المدينة"
                          className="w-full border border-gray-300 rounded-lg px-9 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">
                        تاريخ الاستلام
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg px-9 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">
                        تاريخ الإرجاع
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg px-9 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end sm:col-span-2 lg:col-span-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all">
                        <Search className="w-4 h-4 ml-2" />
                        ابحث الآن
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الإحصائيات المطورة */}
      <section ref={statsRef} className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* الخلفية المتحركة */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* العنوان المطور */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block">
              <Badge className="bg-white/10 text-white border-white/20 mb-4 sm:mb-6 px-4 py-2 backdrop-blur-sm">
                إنجازاتنا المتميزة
              </Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              أرقام تتحدث عن نفسها
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              نفخر بثقة عملائنا وإنجازاتنا المتميزة في قطاع تأجير السيارات
            </p>
          </div>
          
          {/* شبكة الإحصائيات المطورة */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const animatedValue = counters[index] || 0;
              
              return (
                <div 
                  key={index} 
                  className={`group text-center transform transition-all duration-500 hover:scale-110 ${
                    isStatsVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* أيقونة مطورة */}
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300 animate-glow`} />
                    <div className="absolute inset-1 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    {/* مؤشر النمو */}
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                      {stat.growth}
                    </div>
                  </div>
                  
                  {/* الرقم المتحرك */}
                  <div className="mb-2 sm:mb-3">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                      {isStatsVisible ? (
                        stat.displayNumber.includes('/') || stat.displayNumber.includes('+') || isNaN(parseInt(stat.number)) 
                          ? stat.displayNumber 
                          : `${animatedValue.toLocaleString()}${stat.displayNumber.includes('+') ? '+' : ''}`
                      ) : '0'}
                    </div>
                  </div>
                  
                  {/* الوصف */}
                  <div>
                    <div className="text-white/90 font-medium text-sm sm:text-base lg:text-lg mb-1">
                      {stat.label}
                    </div>
                    <div className="text-white/70 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {stat.description}
                    </div>
                  </div>
                  
                  {/* خط الزخرفة */}
                  <div className="w-8 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
          
          {/* شريط التقدم العام */}
          <div className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-2000"
                style={{ 
                  width: isStatsVisible ? '100%' : '0%',
                  transition: 'width 3s ease-out'
                }}
              />
            </div>
            <p className="text-center text-white/80 text-sm mt-3">
              مستوى رضا العملاء والجودة
            </p>
          </div>
        </div>
      </section>

      {/* السيارات المميزة المحسنة */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 mb-4 px-4 py-2 text-sm sm:text-base">
              السيارات المميزة
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              اختر من أفضل السيارات
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              مجموعة مختارة من أفضل السيارات المتاحة مع عروض خاصة وخصومات حصرية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredCars.map((car, index) => (
              <Card 
                key={car.id} 
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-48 sm:h-52 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* الشارات المحسنة */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg text-xs sm:text-sm">
                      {car.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <Badge 
                      variant={car.available ? "default" : "secondary"} 
                      className={`${car.available ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg text-xs sm:text-sm`}
                    >
                      {car.available ? "متاح" : "غير متاح"}
                    </Badge>
                  </div>
                  
                  {/* طبقة التدرج المحسنة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* أيقونة القلب */}
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 line-clamp-1">{car.name}</h3>
                      <p className="text-slate-500 text-sm">{car.category}</p>
                    </div>
                    <div className="text-left ml-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{car.rating}</span>
                        <span className="text-xs text-slate-500 hidden sm:inline">({car.reviews})</span>
                      </div>
                    </div>
                  </div>

                  {/* المميزات المحسنة */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    {car.features.slice(0, 4).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700 px-2 py-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* السعر المحسن */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">{car.price} ر.س</span>
                      <span className="text-sm text-slate-500 line-through">{car.originalPrice} ر.س</span>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">/ يوم</span>
                  </div>

                  {/* الأزرار المحسنة */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base" 
                      asChild
                    >
                      <a href="/car-booking">
                        احجز الآن
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="px-2 sm:px-3 hover:scale-105 transition-transform">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 sm:px-3 hover:scale-105 transition-transform"
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

      {/* الخدمات المطورة */}
      <section ref={servicesRef} className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
        {/* الخلفية التفاعلية */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-bounce-gentle" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* العنوان المطور */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block">
              <Badge className={`bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 mb-4 sm:mb-6 px-4 py-2 backdrop-blur-sm transition-all duration-700 ${
                isServicesVisible ? 'animate-fade-in scale-100' : 'scale-95 opacity-0'
              }`}>
                خدماتنا المتميزة
              </Badge>
            </div>
            
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight transition-all duration-700 delay-200 ${
              isServicesVisible ? 'animate-fade-in translate-y-0' : 'translate-y-8 opacity-0'
            }`}>
              لماذا تختار كار رنت برو؟
            </h2>
            
            <p className={`text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${
              isServicesVisible ? 'animate-fade-in translate-y-0' : 'translate-y-8 opacity-0'
            }`}>
              نقدم أفضل الخدمات والمميزات لضمان تجربة تأجير استثنائية ومريحة لجميع عملائنا
            </p>
          </div>

          {/* شبكة الخدمات المطورة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-blue-200/50 hover:-translate-y-4 transform ${
                    isServicesVisible ? 'animate-fade-in translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ 
                    animationDelay: `${600 + index * 150}ms`,
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  {/* تأثير الخلفية المتحرك */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* الزخرفة العلوية */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                  </div>
                  
                  <div className="relative z-10 text-center">
                    {/* الأيقونة المطورة */}
                    <div className="relative mb-6 sm:mb-8">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${service.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden`}>
                        {/* تأثير اللمعان */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        
                        {/* نبضة الخلفية */}
                        <div className="absolute inset-0 bg-white/20 rounded-2xl sm:rounded-3xl animate-ping opacity-0 group-hover:opacity-75" />
                      </div>
                      
                      {/* الدوائر المتحركة */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-2 border-blue-200/30 rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '3s' }} />
                        <div className="absolute w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border border-purple-200/30 rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                      </div>
                    </div>
                    
                    {/* النص المطور */}
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base group-hover:text-slate-700 transition-colors duration-300">
                      {service.description}
                    </p>
                    
                    {/* خط الزخرفة */}
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 sm:mt-6 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                    
                    {/* زر التفاعل الخفي */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* تأثير الإضاءة الجانبية */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                </div>
              );
            })}
          </div>
          
          {/* قسم إضافي للتميز */}
          <div className={`mt-12 sm:mt-16 lg:mt-20 text-center transition-all duration-700 delay-1000 ${
            isServicesVisible ? 'animate-fade-in translate-y-0' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-10 text-white max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  استعد لتجربة تأجير لا تُنسى
                </h3>
                <p className="text-lg sm:text-xl text-blue-100 mb-6">
                  انضم إلى آلاف العملاء الراضين واستمتع بخدمة متميزة
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  ابدأ رحلتك الآن
                  <ChevronRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
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

      {/* الفوتر المطور */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          {/* الإحصائيات العلوية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-center">
            <div className="group">
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-2">+15</div>
                <div className="text-slate-400">جائزة</div>
                <div className="text-xs text-slate-500 mt-1">جوائز التميز</div>
              </div>
            </div>
            <div className="group">
              <div className="flex flex-col items-center">
                <Star className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-slate-400">تقييم العملاء</div>
                <div className="text-xs text-slate-500 mt-1">تقييم العملاء</div>
              </div>
            </div>
            <div className="group">
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-2">+10,000</div>
                <div className="text-slate-400">عميل</div>
                <div className="text-xs text-slate-500 mt-1">عميل راضٍ</div>
              </div>
            </div>
            <div className="group">
              <div className="flex flex-col items-center">
                <Car className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-white mb-2">+500</div>
                <div className="text-slate-400">سيارة</div>
                <div className="text-xs text-slate-500 mt-1">أسطول متنوع</div>
              </div>
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* الدعم والمساعدة */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">الدعم والمساعدة</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/car-rental/guide" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    دليل العميل
                  </a>
                </li>
                <li>
                  <a href="/car-rental/faq" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    الأسئلة الشائعة
                  </a>
                </li>
                <li>
                  <a href="/car-rental/insurance" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    سياسة التأمين
                  </a>
                </li>
                <li>
                  <a href="/car-rental/terms" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    الشروط والأحكام
                  </a>
                </li>
              </ul>
            </div>

            {/* خدماتنا */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">خدماتنا</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/car-rental/services" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تأجير يومي
                  </a>
                </li>
                <li>
                  <a href="/car-rental/services" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تأجير شهري
                  </a>
                </li>
                <li>
                  <a href="/car-rental/services/luxury" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    سيارات فاخرة
                  </a>
                </li>
                <li>
                  <a href="/car-rental/services/economy" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    سيارات اقتصادية
                  </a>
                </li>
                <li>
                  <a href="/car-rental/services" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    خدمة التوصيل
                  </a>
                </li>
                <li>
                  <a href="/car-rental/services" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    سائق خاص
                  </a>
                </li>
              </ul>
            </div>

            {/* روابط سريعة */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">روابط سريعة</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/car-rental" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a href="/car-fleet" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    أسطول السيارات
                  </a>
                </li>
                <li>
                  <a href="/car-booking" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    احجز الآن
                  </a>
                </li>
                <li>
                  <a href="/car-rental/about" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    العروض الحالية
                  </a>
                </li>
                <li>
                  <a href="/car-rental/about" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="/car-rental/contact" className="text-slate-300 hover:text-blue-400 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            {/* تأجير السيارات - معلومات الاتصال */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">تأجير السيارات</h3>
              <div className="text-xs text-slate-400 mb-4">على الشهادة الذهبية</div>
              
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                نوفر خدمات تأجير السيارات بأعلى معايير الجودة والأمان، مع أسطول حديث ومتنوع يلبي جميع احتياجاتك.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">0555812567</div>
                    <div className="text-xs text-slate-400">هاتف</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">rental@alialshehriholding.com</div>
                    <div className="text-xs text-slate-400">بريد إلكتروني</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">الرياض، حي الملز، شارع الأمير محمد بن عبدالعزيز</div>
                    <div className="text-xs text-slate-400">عنوان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ساعات العمل المطورة */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 mb-8 border border-slate-700/50 backdrop-blur-sm relative overflow-hidden">
            {/* خلفية متحركة */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative z-10">
              {/* العنوان مع الحالة الحالية */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                    isWorkingHours 
                      ? 'bg-green-500/20 animate-pulse' 
                      : 'bg-red-500/20'
                  }`}>
                    <Clock className={`w-6 h-6 ${
                      isWorkingHours ? 'text-green-400' : 'text-red-400'
                    }`} />
                    {isWorkingHours && (
                      <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">ساعات العمل</h3>
                    <p className="text-sm text-slate-400">
                      {currentTime.toLocaleTimeString('ar-SA', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
                
                {/* مؤشر الحالة */}
                <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  isWorkingHours 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isWorkingHours ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`} />
                  {isWorkingHours ? 'مفتوح الآن' : 'مغلق'}
                </div>
              </div>

              {/* العد التنازلي */}
              {!isWorkingHours && timeUntilOpen && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Timer className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-orange-400 font-medium">سنفتح خلال</p>
                      <p className="text-white text-sm">{timeUntilOpen}</p>
                    </div>
                  </div>
                </div>
              )}

              {nextOpenTime && !isWorkingHours && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-blue-400 font-medium">الافتتاح التالي</p>
                      <p className="text-white text-sm">{nextOpenTime}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* جدول الأوقات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { day: 'الأحد - الخميس', time: '8:00 ص - 10:00 م', current: [0,1,2,3,4].includes(currentTime.getDay()) },
                  { day: 'الجمعة', time: '2:00 م - 10:00 م', current: currentTime.getDay() === 5 },
                  { day: 'السبت', time: '8:00 ص - 12:00 م', current: currentTime.getDay() === 6 }
                ].map((schedule, index) => (
                  <div 
                    key={index}
                    className={`group p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      schedule.current
                        ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm mb-1 ${
                          schedule.current ? 'text-blue-400' : 'text-slate-300'
                        }`}>
                          {schedule.day}
                        </p>
                        <p className="text-white font-bold">
                          {schedule.time}
                        </p>
                      </div>
                      {schedule.current && (
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    {/* شريط تقدم اليوم */}
                    {schedule.current && isWorkingHours && (
                      <div className="mt-3">
                        <div className="w-full bg-slate-600/30 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${((currentTime.getHours() - 8) / 14) * 100}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">تقدم ساعات العمل</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* خدمة الطوارئ */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 px-6 py-3 rounded-xl border border-red-500/30 backdrop-blur-sm">
                  <div className="relative">
                    <Phone className="w-5 h-5" />
                    <div className="absolute inset-0 animate-ping">
                      <Phone className="w-5 h-5 text-red-400/50" />
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-white">خدمة الطوارئ</span>
                    <div className="text-sm">24/7 متاح طوال الأسبوع</div>
                  </div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>استقبال السيارات حتى 30 دقيقة قبل الإغلاق</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>خدمة التوصيل متاحة في جميع الأوقات</span>
                </div>
              </div>
            </div>
          </div>

          {/* أسفل الصفحة */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                &copy; 2024 كار رنت برو. جميع الحقوق محفوظة.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="/car-rental/terms" className="text-slate-400 hover:text-blue-400 transition-colors">الشروط والأحكام</a>
                <a href="/car-rental/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">سياسة الخصوصية</a>
                <a href="/car-rental/contact" className="text-slate-400 hover:text-blue-400 transition-colors">اتصل بنا</a>
              </div>
            </div>
          </div>
        </div>

        {/* زر الاتصال الثابت */}
        <div className="fixed bottom-8 left-8 z-50">
          <a 
            href="tel:0555812567"
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
          >
            <Phone className="w-8 h-8 text-white" />
          </a>
        </div>
      </footer>

      {/* زر الاتصال العائم */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 shadow-2xl animate-bounce"
          asChild
        >
          <a href="tel:+966500000000" className="flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default CarRentalLanding;
