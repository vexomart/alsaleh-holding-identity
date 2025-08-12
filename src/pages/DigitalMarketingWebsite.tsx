import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, BarChart3, Target, Users, Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Star, Globe, Zap, Shield, Award, Eye, MousePointer, Search, MessageSquare, AlertTriangle, Menu, X, Home, Briefcase, FileText, Building2, ChevronRight, PlayCircle, Rocket, Trophy, Heart, Lightbulb, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DigitalMarketingWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [processingServiceId, setProcessingServiceId] = useState<string | null>(null);

  const navigationItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "services", label: "خدماتنا", icon: Target },
    { id: "solutions", label: "حلولنا", icon: Lightbulb },
    { id: "portfolio", label: "أعمالنا", icon: BarChart3 },
    { id: "about", label: "من نحن", icon: Users },
    { id: "careers", label: "الوظائف", icon: Briefcase },
    { id: "blog", label: "المدونة", icon: FileText },
    { id: "contact", label: "تواصل معنا", icon: Phone }
  ];

  const services = [
    {
      icon: Search,
      title: "تحسين محركات البحث العالمية",
      description: "استراتيجيات SEO متقدمة للوصول لأعلى النتائج في جوجل وبينغ ياهو عالمياً",
      features: ["تحليل الكلمات المفتاحية المتقدم", "تحسين تقني شامل", "بناء روابط عالية الجودة", "تقارير مفصلة أسبوعية"],
      price: "ابتداءً من 2000$",
      bgColor: "from-blue-500 to-cyan-500"
    },
    {
      icon: MousePointer,
      title: "إعلانات رقمية متعددة المنصات",
      description: "حملات إعلانية احترافية على جوجل، فيسبوك، إنستقرام، تيك توك، لينكد إن",
      features: ["إدارة الحملات الذكية", "استهداف دقيق للجمهور", "تحسين معدلات التحويل", "تتبع ROI في الوقت الفعلي"],
      price: "ابتداءً من 3000$",
      bgColor: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "إدارة وسائل التواصل الاجتماعي",
      description: "بناء حضور قوي ومؤثر على جميع منصات التواصل الاجتماعي العالمية",
      features: ["استراتيجية المحتوى", "تصميم إبداعي احترافي", "إدارة المجتمع", "تحليل التفاعل المتقدم"],
      price: "ابتداءً من 1500$",
      bgColor: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "التسويق الذكي عبر البريد الإلكتروني",
      description: "حملات بريد إلكتروني ذكية ومؤتمتة بمعدلات فتح وتحويل عالية",
      features: ["أتمتة متقدمة", "تخصيص ديناميكي", "اختبار A/B", "تقسيم الجمهور الذكي"],
      price: "ابتداءً من 800$",
      bgColor: "from-orange-500 to-red-500"
    },
    {
      icon: BarChart3,
      title: "تحليل البيانات والذكاء الاصطناعي",
      description: "تحليل شامل للبيانات باستخدام الذكاء الاصطناعي وتعلم الآلة",
      features: ["تحليل متقدم بالذكاء الاصطناعي", "توقعات السوق", "تحليل المنافسين", "تقارير تفاعلية"],
      price: "ابتداءً من 2500$",
      bgColor: "from-indigo-500 to-blue-500"
    },
    {
      icon: Globe,
      title: "التطوير الرقمي المتكامل",
      description: "تطوير مواقع ومنصات رقمية متطورة بأحدث التقنيات العالمية",
      features: ["تقنيات حديثة", "تصميم متجاوب", "أمان عالي", "سرعة استثنائية"],
      price: "ابتداءً من 5000$",
      bgColor: "from-violet-500 to-purple-500"
    }
  ];

  // Payment handler
  const handlePayment = async (service: any, context = 'default') => {
    const serviceKey = `${context}-${service.title}`;
    console.log('Payment clicked for service:', serviceKey);
    console.log('Current processingServiceId:', processingServiceId);
    
    if (processingServiceId === serviceKey) return;
    
    setProcessingServiceId(serviceKey);
    console.log('Set processingServiceId to:', serviceKey);
    
    try {
      // Extract numeric value from price string and convert to SAR cents
      const priceMatch = service.price.match(/\$(\d+)/);
      if (!priceMatch) {
        throw new Error('Invalid price format');
      }
      
      const priceInUSD = parseInt(priceMatch[1]);
      const priceInSAR = Math.round(priceInUSD * 3.75); // Convert USD to SAR
      
      const paymentData = {
        amount: priceInSAR,
        currency: 'SAR',
        customer_name: 'عميل',
        customer_email: 'customer@example.com',
        customer_phone: '966500000000',
        offer_title: service.title,
        description: `شراء خدمة: ${service.title}`,
        success_url: window.location.origin
      };

      // Use Paylink as primary payment gateway
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: paymentData
      });

      if (error) {
        throw error;
      }

      if (data.success && data.url) {
        // Redirect to payment page
        window.location.href = data.url;
      } else {
        throw new Error('فشل في إنشاء رابط الدفع');
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert('حدث خطأ في عملية الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      console.log('Clearing processingServiceId');
      setProcessingServiceId(null);
    }
  };

  const globalStats = [
    { number: "2000+", label: "عميل في 50 دولة", icon: Globe },
    { number: "500%", label: "متوسط نمو المبيعات", icon: TrendingUp },
    { number: "98%", label: "معدل رضا العملاء", icon: Star },
    { number: "24/7", label: "دعم فني عالمي", icon: Shield }
  ];

  const portfolioItems = [
    {
      title: "منصة التجارة الإلكترونية العالمية - أمازون الشرق الأوسط",
      description: "زيادة المبيعات بنسبة 800% وتوسع في 15 دولة خلال سنة واحدة",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80",
      results: ["800% زيادة في المبيعات", "15 دولة جديدة", "50M$ إيرادات إضافية", "85% تحسن في معدل التحويل"],
      category: "تجارة إلكترونية عالمية",
      client: "Fortune 500 Company",
      duration: "12 شهر",
      investment: "$250,000"
    },
    {
      title: "البنك الرقمي الأول - بنك الراجحي الرقمي",
      description: "إطلاق أول بنك رقمي بالكامل في الشرق الأوسط مع 2M مستخدم في 6 أشهر",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      results: ["2M مستخدم جديد", "صفر فروع فيزيائية", "90% توفير في التكاليف", "95% رضا العملاء"],
      category: "خدمات مصرفية رقمية",
      client: "Al Rajhi Bank",
      duration: "18 شهر",
      investment: "$500,000"
    },
    {
      title: "منصة توصيل الطعام - طلبات عالمي",
      description: "توسع عالمي لمنصة توصيل الطعام لتشمل 25 دولة مع 10M طلب شهرياً",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
      results: ["25 دولة تشغيل", "10M طلب شهرياً", "50,000 مطعم شريك", "150% نمو ربع سنوي"],
      category: "منصات التوصيل",
      client: "Talabat International",
      duration: "24 شهر",
      investment: "$750,000"
    },
    {
      title: "منصة التعليم الإلكتروني - أكاديمية المستقبل",
      description: "إطلاق أكبر منصة تعليم إلكتروني في المنطقة مع 5M طالب و50,000 مدرس",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      results: ["5M طالب مسجل", "50K مدرس معتمد", "200 دولة وصول", "4.8/5 تقييم التطبيق"],
      category: "تكنولوجيا التعليم",
      client: "Future Academy",
      duration: "15 شهر",
      investment: "$400,000"
    },
    {
      title: "شركة الطيران الذكية - الخطوط السعودية الرقمية",
      description: "تحويل رقمي شامل لشركة طيران مع نظام حجز ذكي وخدمة عملاء بالذكاء الاصطناعي",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      results: ["60% تحسن في تجربة العملاء", "40% توفير في التكاليف", "24/7 خدمة ذكية", "30% زيادة في الحجوزات"],
      category: "قطاع الطيران",
      client: "Saudi Airlines",
      duration: "20 شهر",
      investment: "$1,000,000"
    },
    {
      title: "منصة الصحة الرقمية - تطبيب عالمي",
      description: "منصة طبية شاملة تربط 100,000 طبيب مع 5M مريض حول العالم",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80",
      results: ["100K طبيب معتمد", "5M مريض", "35 دولة تشغيل", "99.9% وقت تشغيل"],
      category: "تكنولوجيا الصحة",
      client: "Vezeeta Global",
      duration: "30 شهر",
      investment: "$1,500,000"
    }
  ];

  const globalOffices = [
    { city: "الرياض", country: "السعودية", address: "برج المملكة، الطابق 45", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
    { city: "دبي", country: "الإمارات", address: "برج خليفة، الطابق 80", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80" },
    { city: "لندن", country: "بريطانيا", address: "Canary Wharf, Tower 42", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80" },
    { city: "نيويورك", country: "أمريكا", address: "Empire State Building, Floor 85", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
    { city: "سنغافورة", country: "سنغافورة", address: "Marina Bay Financial Centre", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80" },
    { city: "طوكيو", country: "اليابان", address: "Tokyo Skytree, Level 70", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80" }
  ];

  const teamMembers = [
    {
      name: "د. أحمد العبدالله",
      position: "الرئيس التنفيذي العالمي",
      experience: "20+ سنة خبرة في التسويق الرقمي",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      specialization: "استراتيجية التسويق العالمي",
      achievements: "قاد نمو 500+ شركة عالمية"
    },
    {
      name: "سارة جونسون",
      position: "مديرة التسويق الرقمي العالمي",
      experience: "15+ سنة خبرة دولية",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?auto=format&fit=crop&w=800&q=80",
      specialization: "حملات متعددة المنصات",
      achievements: "أدارت حملات بقيمة 100M$"
    },
    {
      name: "د. ماركو روسي",
      position: "رئيس قسم الذكاء الاصطناعي",
      experience: "18+ سنة في الذكاء الاصطناعي",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
      specialization: "تحليل البيانات بالذكاء الاصطناعي",
      achievements: "طور 50+ نموذج ذكي"
    },
    {
      name: "فاطمة الزهراني",
      position: "مديرة الإبداع والتصميم",
      experience: "12+ سنة في التصميم الإبداعي",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
      specialization: "تصميم تجربة المستخدم",
      achievements: "فازت بـ 25 جائزة دولية"
    }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case "services":
        return <ServicesPage />;
      case "solutions":
        return <SolutionsPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "about":
        return <AboutPage />;
      case "careers":
        return <CareersPage />;
      case "blog":
        return <BlogPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-blue-900/90 to-cyan-900/95"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white">
          <div className="animate-fade-in max-w-7xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30 px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-xl">
              🌟 شركة التسويق الرقمي الرائدة عالمياً
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent leading-tight">
              نقود التحول الرقمي
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">حول العالم</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed text-cyan-100 px-4">
              نحن الشريك الاستراتيجي لأكبر الشركات العالمية في رحلة التحول الرقمي، مع حضور في 50+ دولة وخبرة تمتد لأكثر من عقدين
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center mb-12 sm:mb-16 px-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 sm:px-12 py-4 sm:py-8 text-lg sm:text-2xl shadow-2xl shadow-cyan-500/25 hover-scale w-full sm:w-auto">
                🚀 ابدأ رحلتك الرقمية
                <ArrowRight className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-6 sm:px-12 py-4 sm:py-8 text-lg sm:text-2xl backdrop-blur-sm w-full sm:w-auto">
                🎥 شاهد قصص النجاح
                <PlayCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" />
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 max-w-6xl mx-auto px-4">
              {globalStats.map((stat, index) => (
                <div key={index} className="animate-fade-in text-center" style={{animationDelay: `${index * 0.3}s`}}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 hover-scale">
                    <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cyan-400 mb-2 sm:mb-3">{stat.number}</div>
                    <div className="text-cyan-200 text-sm sm:text-lg md:text-xl">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-purple-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-purple-100 text-purple-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">🎯 خدماتنا العالمية</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">
              حلول تسويقية متطورة للعالم الرقمي
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto px-4">
              نقدم خدمات تسويقية متكاملة باستخدام أحدث التقنيات والذكاء الاصطناعي
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-700 hover-scale group bg-white border-0 shadow-xl">
                <div className={`h-1 sm:h-2 bg-gradient-to-r ${service.bgColor}`}></div>
                <CardContent className="p-6 sm:p-8 lg:p-10">
                  <div className={`bg-gradient-to-br ${service.bgColor} w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-xl transition-all duration-500`}>
                    <service.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-slate-800">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">{service.description}</p>
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 ml-2 sm:ml-3 flex-shrink-0" />
                        <span className="text-slate-600 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">{service.price}</span>
                     <Button 
                       className={`bg-gradient-to-r ${service.bgColor} hover:shadow-lg w-full sm:w-auto text-sm sm:text-base`}
                       onClick={() => {
                         console.log('HOME BUTTON CLICKED for:', service.title);
                         handlePayment(service, 'home');
                       }}
                       disabled={processingServiceId === `home-${service.title}`}
                     >
                       {(() => {
                         const isProcessing = processingServiceId === `home-${service.title}`;
                         console.log('HOME BUTTON RENDER:', service.title, 'isProcessing:', isProcessing, 'processingServiceId:', processingServiceId);
                         return isProcessing ? "جاري المعالجة..." : "ادفع الآن";
                       })()}
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-purple-50/30 to-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-blue-100 text-blue-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">🌍 حضور عالمي</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              مكاتبنا حول العالم
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto px-4">
              شبكة عالمية من المكاتب لخدمة عملائنا على مدار الساعة في جميع أنحاء العالم
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {globalOffices.map((office, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={office.image} 
                    alt={office.city}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">{office.city}</h3>
                    <p className="text-blue-200 mb-1 text-sm sm:text-base">{office.country}</p>
                    <p className="text-xs sm:text-sm text-gray-300">{office.address}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-100 to-purple-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-amber-100 text-amber-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">🏆 قصص نجاح عالمية</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-amber-700 bg-clip-text text-transparent">
              إنجازات تغير الصناعات
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {portfolioItems.slice(0, 4).map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group border-0">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                    <Badge className="bg-amber-500 text-white text-xs sm:text-sm">{item.category}</Badge>
                  </div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">{item.title}</h3>
                    <p className="text-amber-200 leading-relaxed text-sm sm:text-base">{item.description}</p>
                  </div>
                </div>
                <CardContent className="p-6 sm:p-8 bg-gradient-to-r from-white to-amber-50/50">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 sm:mb-2 text-sm sm:text-base">العميل</h4>
                      <p className="text-slate-600 text-sm sm:text-base">{item.client}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 sm:mb-2 text-sm sm:text-base">الاستثمار</h4>
                      <p className="text-slate-600 text-sm sm:text-base">{item.investment}</p>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {item.results.slice(0, 2).map((result, idx) => (
                      <div key={idx} className="flex items-center">
                        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 ml-2 sm:ml-3 flex-shrink-0" />
                        <span className="text-slate-600 font-medium text-sm sm:text-base">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Button 
              size="lg" 
              onClick={() => setCurrentPage("portfolio")}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl"
            >
              عرض جميع قصص النجاح
              <ChevronRight className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-purple-50/30 to-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">👨‍💼 فريق النخبة العالمي</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-green-700 bg-clip-text text-transparent">
              خبراء من أرقى الجامعات العالمية
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-green-200 text-sm mb-1 sm:mb-2">{member.position}</p>
                    <p className="text-xs text-gray-300">{member.specialization}</p>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center">
                    <p className="text-sm text-primary font-medium mb-2">{member.experience}</p>
                    <p className="text-slate-600 text-xs sm:text-sm">{member.achievements}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const ServicesPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">خدماتنا التسويقية العالمية</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">حلول متكاملة تلبي احتياجات الشركات العالمية</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <Card key={index} className="p-10 hover:shadow-2xl transition-all duration-500 hover-scale">
              <div className={`bg-gradient-to-br ${service.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                <service.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-slate-800">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">{service.description}</p>
              <div className="space-y-4 mb-8">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 ml-3" />
                    <span className="text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">{service.price}</span>
                 <Button 
                   size="lg" 
                   className={`bg-gradient-to-r ${service.bgColor}`}
                   onClick={() => {
                     console.log('SERVICES PAGE BUTTON CLICKED for:', service.title);
                     handlePayment(service, 'services');
                   }}
                   disabled={processingServiceId === `services-${service.title}`}
                 >
                   {(() => {
                     const isProcessing = processingServiceId === `services-${service.title}`;
                     console.log('SERVICES PAGE BUTTON RENDER:', service.title, 'isProcessing:', isProcessing, 'processingServiceId:', processingServiceId);
                     return isProcessing ? "جاري المعالجة..." : "ادفع الآن";
                   })()}
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const SolutionsPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">حلولنا المتخصصة</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">حلول مخصصة لكل صناعة وقطاع</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "حلول التجارة الإلكترونية",
              description: "منصات تجارة إلكترونية متكاملة مع أنظمة دفع متطورة",
              icon: DollarSign,
              features: ["متاجر متعددة اللغات", "أنظمة دفع آمنة", "إدارة المخزون", "تحليلات متقدمة"]
            },
            {
              title: "حلول التعليم الإلكتروني",
              description: "منصات تعليمية تفاعلية مع أحدث تقنيات التعلم",
              icon: Award,
              features: ["فصول افتراضية", "اختبارات ذكية", "تتبع التقدم", "شهادات معتمدة"]
            },
            {
              title: "حلول الرعاية الصحية",
              description: "أنظمة طبية رقمية آمنة ومتوافقة مع المعايير الدولية",
              icon: Heart,
              features: ["سجلات طبية رقمية", "استشارات عن بُعد", "إدارة المواعيد", "صيدلية إلكترونية"]
            }
          ].map((solution, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
              <solution.icon className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
              <p className="text-muted-foreground mb-6">{solution.description}</p>
              <div className="space-y-3">
                {solution.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const PortfolioPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">أعمالنا العالمية</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">مشاريع نفخر بها حول العالم</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {portfolioItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale">
              <div className="aspect-video relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute top-6 right-6">
                  <Badge className="bg-amber-500">{item.category}</Badge>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-amber-200">{item.description}</p>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div>
                    <span className="font-semibold text-slate-600">العميل:</span>
                    <p className="text-slate-800">{item.client}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">المدة:</span>
                    <p className="text-slate-800">{item.duration}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-600">الاستثمار:</span>
                    <p className="text-slate-800">{item.investment}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {item.results.map((result, idx) => (
                    <div key={idx} className="flex items-center">
                      <Trophy className="h-4 w-4 text-amber-500 ml-2" />
                      <span className="text-slate-600">{result}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">من نحن</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">رواد التسويق الرقمي عالمياً</p>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-16">
          <Card className="p-12">
            <h2 className="text-4xl font-bold mb-6 text-center">رؤيتنا</h2>
            <p className="text-xl leading-relaxed text-center">
              أن نكون الشركة الرائدة عالمياً في تقديم حلول التسويق الرقمي المبتكرة، ونساعد الشركات على تحقيق نمو استثنائي في العصر الرقمي
            </p>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">الابتكار</h3>
              <p className="text-muted-foreground">نستخدم أحدث التقنيات والذكاء الاصطناعي</p>
            </Card>
            <Card className="p-8 text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">التميز</h3>
              <p className="text-muted-foreground">نسعى للتميز في كل مشروع نعمل عليه</p>
            </Card>
            <Card className="p-8 text-center">
              <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">الشراكة</h3>
              <p className="text-muted-foreground">نبني علاقات طويلة الأمد مع عملائنا</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const CareersPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">انضم لفريقنا العالمي</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">فرص وظيفية مثيرة في بيئة عمل عالمية</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "مدير تسويق رقمي", location: "الرياض", type: "دوام كامل" },
            { title: "مطور محتوى", location: "دبي", type: "دوام كامل" },
            { title: "محلل بيانات", location: "لندن", type: "دوام كامل" },
            { title: "مصمم UX/UI", location: "نيويورك", type: "دوام جزئي" },
            { title: "مدير حسابات", location: "سنغافورة", type: "دوام كامل" },
            { title: "أخصائي SEO", location: "طوكيو", type: "دوام كامل" }
          ].map((job, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">{job.title}</h3>
              <div className="space-y-2 mb-6">
                <p className="text-muted-foreground">📍 {job.location}</p>
                <p className="text-muted-foreground">⏰ {job.type}</p>
                <p className="text-muted-foreground">💰 راتب تنافسي</p>
              </div>
              <Button className="w-full">قدم الآن</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const BlogPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">مدونة التسويق الرقمي</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">آخر الاتجاهات والإرشادات في عالم التسويق الرقمي</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              title: "مستقبل الذكاء الاصطناعي في التسويق",
              excerpt: "كيف يغير الذكاء الاصطناعي طريقة التسويق الرقمي",
              image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
              date: "15 نوفمبر 2024"
            },
            {
              title: "استراتيجيات SEO الجديدة لعام 2024",
              excerpt: "أحدث التقنيات لتصدر نتائج البحث",
              image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80",
              date: "12 نوفمبر 2024"
            },
            {
              title: "التسويق عبر وسائل التواصل الاجتماعي",
              excerpt: "كيفية بناء حضور قوي على المنصات الاجتماعية",
              image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
              date: "10 نوفمبر 2024"
            }
          ].map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{article.date}</p>
                <h3 className="text-xl font-bold mb-4">{article.title}</h3>
                <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                <Button variant="outline">اقرأ المزيد</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8">تواصل معنا</h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">نحن هنا لمساعدتك في تحقيق أهدافك الرقمية</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-8">معلومات التواصل</h2>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="bg-blue-100 p-4 rounded-full ml-6">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">الهاتف</h4>
                  <p className="text-muted-foreground text-lg">+966 11 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-green-100 p-4 rounded-full ml-6">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">البريد الإلكتروني</h4>
                  <p className="text-muted-foreground text-lg">info@digitalmarketing.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-purple-100 p-4 rounded-full ml-6">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-xl">العنوان الرئيسي</h4>
                  <p className="text-muted-foreground text-lg">برج المملكة، الرياض، السعودية</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="p-10">
            <h3 className="text-3xl font-bold mb-8">احصل على استشارة مجانية</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3">الاسم الكامل</label>
                <input 
                  type="text" 
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-3">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-3">رقم الهاتف</label>
                <input 
                  type="tel" 
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-3">تفاصيل المشروع</label>
                <textarea 
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg text-lg resize-none"
                  placeholder="اكتب تفاصيل مشروعك..."
                ></textarea>
              </div>
              <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-xl py-6">
                <Calendar className="ml-3 h-6 w-6" />
                احجز استشارتك المجانية
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Site Alert */}
      <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 border-b rounded-none">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 font-medium text-center">
          🚧 هذا موقع تجريبي للمعاينة فقط - تم تطويره بواسطة شركة علي صالح الشهري القابضة
        </AlertDescription>
      </Alert>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <div className="bg-gradient-to-br from-purple-600 to-cyan-700 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-xl">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-800 to-cyan-800 bg-clip-text text-transparent">
                  ديجيتال ماركتنج جلوبال
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden md:block">الشركة الرائدة عالمياً في التسويق الرقمي</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold bg-gradient-to-r from-purple-800 to-cyan-800 bg-clip-text text-transparent">
                  ديجيتال ماركتنج
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-3 space-x-reverse">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-600 text-white shadow-lg scale-105' 
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white shadow-lg px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-lg">
                🎯 استشارة مجانية
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 sm:p-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="xl:hidden py-4 sm:py-6 border-t border-slate-200/50">
              <nav className="space-y-2 sm:space-y-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 ${
                      currentPage === item.id 
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-600 text-white' 
                        : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="font-medium text-base sm:text-lg">{item.label}</span>
                  </button>
                ))}
                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white shadow-lg py-3 text-lg">
                    🎯 استشارة مجانية
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-cyan-600 p-4 rounded-2xl mr-4">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold">ديجيتال ماركتنج جلوبال</span>
                  <p className="text-purple-300 text-sm">الرائدة عالمياً في التسويق الرقمي</p>
                </div>
              </div>
              <p className="text-purple-200 leading-relaxed">
                نحن الشريك الاستراتيجي لأكبر الشركات العالمية في رحلة التحول الرقمي والنمو المستدام
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-8 text-purple-300">خدماتنا</h4>
              <ul className="space-y-4 text-purple-200">
                <li className="hover:text-cyan-300 cursor-pointer transition-colors">تحسين محركات البحث</li>
                <li className="hover:text-cyan-300 cursor-pointer transition-colors">إعلانات جوجل وفيسبوك</li>
                <li className="hover:text-cyan-300 cursor-pointer transition-colors">التسويق عبر السوشال ميديا</li>
                <li className="hover:text-cyan-300 cursor-pointer transition-colors">تحليل البيانات بالذكاء الاصطناعي</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-8 text-purple-300">مكاتبنا العالمية</h4>
              <ul className="space-y-4 text-purple-200">
                <li>🇸🇦 الرياض - المقر الرئيسي</li>
                <li>🇦🇪 دبي - الشرق الأوسط</li>
                <li>🇬🇧 لندن - أوروبا</li>
                <li>🇺🇸 نيويورك - أمريكا</li>
                <li>🇸🇬 سنغافورة - آسيا</li>
                <li>🇯🇵 طوكيو - اليابان</li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-8 text-purple-300">تواصل معنا</h4>
              <div className="space-y-6">
                <div className="flex items-center text-purple-200">
                  <Phone className="h-6 w-6 ml-4 text-cyan-400" />
                  <span className="text-lg">+966 11 234 5678</span>
                </div>
                <div className="flex items-center text-purple-200">
                  <Mail className="h-6 w-6 ml-4 text-cyan-400" />
                  <span className="text-lg">info@digitalmarketing.com</span>
                </div>
                <div className="flex items-center text-purple-200">
                  <MapPin className="h-6 w-6 ml-4 text-cyan-400" />
                  <span className="text-lg">برج المملكة، الرياض</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-16 pt-12 text-center">
            <p className="text-purple-300 text-lg">
              &copy; 2024 ديجيتال ماركتنج جلوبال. جميع الحقوق محفوظة. 
              <span className="text-cyan-400"> | موقع تجريبي بواسطة شركة علي صالح الشهري القابضة</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DigitalMarketingWebsite;