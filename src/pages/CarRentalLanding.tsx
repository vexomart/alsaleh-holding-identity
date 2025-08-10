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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState('all');

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
    { number: "25,000+", label: "عميل راضٍ", icon: Users, color: "from-blue-500 to-blue-600", growth: "+12%" },
    { number: "1,200+", label: "سيارة متاحة", icon: Car, color: "from-green-500 to-green-600", growth: "+25%" },
    { number: "50+", label: "مدينة نخدمها", icon: MapPin, color: "from-purple-500 to-purple-600", growth: "+8%" },
    { number: "12", label: "سنوات خبرة", icon: Award, color: "from-orange-500 to-orange-600", growth: "مستمر" },
    { number: "4.9/5", label: "تقييم العملاء", icon: Star, color: "from-yellow-500 to-yellow-600", growth: "+0.2" },
    { number: "24/7", label: "دعم فني", icon: Clock, color: "from-red-500 to-red-600", growth: "دائم" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

                {/* نموذج البحث */}
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-4xl mx-auto">
                  <h3 className="text-gray-800 text-lg font-semibold mb-6 text-center">
                    ابحث عن سيارتك المثالية
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مكان الاستلام
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="اختر المدينة"
                          className="w-full border border-gray-300 rounded-lg px-10 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الاستلام
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg px-10 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الإرجاع
                      </label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded-lg px-10 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
                        <Search className="w-5 h-5 ml-2" />
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
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

          {/* ساعات العمل */}
          <div className="bg-slate-800/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">ساعات العمل</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300">الأحد - الخميس</span>
                <span className="text-white font-medium">8:00 ص - 10:00 م</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300">الجمعة</span>
                <span className="text-white font-medium">2:00 م - 10:00 م</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700">
                <span className="text-slate-300">السبت</span>
                <span className="text-white font-medium">8:00 ص - 10:00 م</span>
              </div>
              <div className="md:col-span-3 text-center">
                <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">خدمة الطوارئ</span>
                  <span className="text-white">24/7 متاح</span>
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
