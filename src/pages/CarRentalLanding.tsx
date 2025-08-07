import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Heart
} from "lucide-react";

const CarRentalLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // صور السيارات الحقيقية (ستحتاج لإضافة صور حقيقية لاحقاً)
  const heroImages = [
    "https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  ];

  const carCategories = [
    {
      id: 1,
      name: "السيارات الاقتصادية",
      description: "مثالية للاستخدام اليومي والرحلات القصيرة",
      price: "120",
      features: ["توفير في الوقود", "سهولة القيادة", "مواقف مريحة"],
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      models: ["هيونداي إلنترا", "نيسان سنترا", "تويوتا كورولا"]
    },
    {
      id: 2,
      name: "السيارات الفاخرة",
      description: "لتجربة قيادة استثنائية ومناسبات خاصة",
      price: "350",
      features: ["راحة فائقة", "تقنيات متقدمة", "تصميم أنيق"],
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      models: ["مرسيدس E-Class", "BMW 5 Series", "أودي A6"]
    },
    {
      id: 3,
      name: "السيارات العائلية",
      description: "واسعة ومريحة للعائلات والرحلات الطويلة",
      price: "200",
      features: ["مساحة واسعة", "أمان عالي", "راحة العائلة"],
      image: "https://images.unsplash.com/photo-1594736797933-d0ce6979bd84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      models: ["تويوتا هايلاندر", "هوندا بايلوت", "نيسان باثفايندر"]
    },
    {
      id: 4,
      name: "السيارات الرياضية",
      description: "للمحبين السرعة والتميز",
      price: "500",
      features: ["أداء عالي", "تصميم رياضي", "تجربة مثيرة"],
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      models: ["BMW M3", "مرسيدس AMG", "أودي RS"]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "تأمين شامل",
      description: "تأمين كامل على جميع السيارات لضمان راحة البال",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "خدمة 24/7",
      description: "دعم فني ومساعدة على مدار الساعة",
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "مواقع متعددة",
      description: "فروع في جميع أنحاء المملكة لسهولة الوصول",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: CreditCard,
      title: "دفع آمن",
      description: "طرق دفع متعددة وآمنة لراحتك",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Smartphone,
      title: "تطبيق ذكي",
      description: "احجز وأدير حجزك من خلال التطبيق",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Award,
      title: "جودة معتمدة",
      description: "شهادات جودة دولية وخدمة ممتازة",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "عميل راضٍ", icon: Users },
    { number: "500+", label: "سيارة متاحة", icon: Car },
    { number: "25+", label: "مدينة نخدمها", icon: MapPin },
    { number: "5", label: "سنوات خبرة", icon: Award }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تغيير الصور تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: "الرئيسية", href: "#home" },
    { name: "السيارات", href: "#cars" },
    { name: "الحجز", href: "#booking" },
    { name: "من نحن", href: "#about" },
    { name: "تواصل معنا", href: "#contact" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-2xl font-bold transition-colors ${
                isScrolled ? 'text-slate-900' : 'text-white'
              }`}>
                كار رنت برو
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isScrolled ? 'text-slate-700' : 'text-white'
                  }`}
                >
                  {item.name}
                </a>
              ))}
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform" asChild>
                <a href="/car-booking">احجز الآن</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                <a href="/car-booking">احجز الآن</a>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              اكتشف المملكة مع
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                كار رنت برو
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
              أفضل خدمات تأجير السيارات في المملكة العربية السعودية
              <br />
              سيارات حديثة • أسعار تنافسية • خدمة استثنائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform text-lg px-8 py-6 shadow-2xl"
                asChild
              >
                <a href="/car-booking">
                  <Car className="w-6 h-6 ml-2" />
                  احجز سيارتك الآن
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-all text-lg px-8 py-6"
              >
                <Phone className="w-6 h-6 ml-2" />
                اتصل بنا
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              لماذا تختار كار رنت برو؟
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم أفضل الخدمات والمميزات لضمان تجربة تأجير استثنائية لا تُنسى
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white hover:-translate-y-2"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Car Categories Section */}
      <section id="cars" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              أسطولنا من السيارات
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر من مجموعة واسعة من السيارات الحديثة التي تناسب جميع احتياجاتك
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {carCategories.map((category, index) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-slate-900">
                      من {category.price} ر.س/يوم
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{category.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{category.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {category.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm font-medium text-slate-900 mb-2">نماذج متاحة:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.models.map((model, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform" asChild>
                    <a href="/car-booking">
                      احجز الآن
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v20h40V20H20z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            جاهز لبدء رحلتك؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            احجز سيارتك الآن واستمتع بتجربة قيادة استثنائية في جميع أنحاء المملكة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform text-lg px-12 py-6"
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
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-all text-lg px-12 py-6"
            >
              <Phone className="w-6 h-6 ml-2" />
              تواصل معنا
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Car className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">كار رنت برو</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                شركة رائدة في تأجير السيارات بالمملكة العربية السعودية، نقدم خدمات متميزة وأسطول حديث لضمان راحتكم.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">تأجير يومي</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">تأجير شهري</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">سيارات الأعراس</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">النقل التنفيذي</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">رحلات المطار</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات مهمة</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">شروط الإيجار</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">سياسة التأمين</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">أسئلة شائعة</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">دليل العميل</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+966 11 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>info@carrentpro.sa</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>متاح 24/7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 كار رنت برو. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarRentalLanding;