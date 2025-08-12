import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, BarChart3, Target, Users, Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Star, Globe, Zap, Shield, Award, Eye, MousePointer, Search, MessageSquare, AlertTriangle, Menu, X, Home, Briefcase, FileText, Building2, ChevronRight, PlayCircle, Rocket, Trophy, Heart, Lightbulb, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const DigitalMarketingWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [processingHomeService, setProcessingHomeService] = useState<number | null>(null);
  const [processingServicesService, setProcessingServicesService] = useState<number | null>(null);

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
      icon: BarChart3,
      title: "التحليل والذكاء التجاري",
      description: "حلول تحليلية متطورة لفهم سلوك العملاء وتحسين الأداء التسويقي",
      features: ["تحليل البيانات المتقدم", "لوحات تحكم تفاعلية", "تقارير أداء شاملة", "تحليل المنافسين"],
      price: "ابتداءً من 2500$",
      bgColor: "from-orange-500 to-red-500"
    }
  ];

  // Payment handlers for each section
  const handleHomePayment = async (service: any, index: number) => {
    if (processingHomeService === index) return;
    
    setProcessingHomeService(index);
    
    try {
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: parseInt(service.price.replace(/[^\d]/g, '')),
          currency: 'SAR',
          customer_name: 'عميل',
          customer_email: 'customer@example.com',
          customer_phone: '966500000000',
          offer_title: service.title,
          description: `شراء منتج: ${service.title}`,
          success_url: window.location.origin
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('حدث خطأ في عملية الدفع');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('تم توجيهك لصفحة الدفع');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('حدث خطأ في عملية الدفع');
    } finally {
      setProcessingHomeService(null);
    }
  };

  const handleServicesPayment = async (service: any, index: number) => {
    if (processingServicesService === index) return;
    
    setProcessingServicesService(index);
    
    try {
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: parseInt(service.price.replace(/[^\d]/g, '')),
          currency: 'SAR',
          customer_name: 'عميل',
          customer_email: 'customer@example.com',
          customer_phone: '966500000000',
          offer_title: service.title,
          description: `شراء منتج: ${service.title}`,
          success_url: window.location.origin
        }
      });

      if (error) {
        console.error('Payment error:', error);
        toast.error('حدث خطأ في عملية الدفع');
        return;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('تم توجيهك لصفحة الدفع');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('حدث خطأ في عملية الدفع');
    } finally {
      setProcessingServicesService(null);
    }
  };

  const stats = [
    { number: "500+", label: "مشروع مكتمل", icon: Trophy },
    { number: "200+", label: "عميل سعيد", icon: Heart },
    { number: "50+", label: "جائزة دولية", icon: Award },
    { number: "24/7", label: "دعم فني", icon: Shield }
  ];

  const solutions = [
    {
      icon: Globe,
      title: "الحضور الرقمي العالمي",
      description: "بناء هوية رقمية قوية تتخطى الحدود الجغرافية وتصل لأسواق عالمية جديدة",
      features: ["تطوير استراتيجية عالمية", "تحليل الأسواق المستهدفة", "تكييف المحتوى محلياً", "حملات متعددة لغات"]
    },
    {
      icon: Zap,
      title: "التحول الرقمي المتسارع",
      description: "نساعد الشركات على التحول من الطرق التقليدية إلى حلول رقمية مبتكرة ومتطورة",
      features: ["تقييم النضج الرقمي", "خارطة طريق التحول", "تطبيق التقنيات الحديثة", "تدريب الفرق"]
    },
    {
      icon: Target,
      title: "استراتيجية التسويق المتكاملة",
      description: "نصمم استراتيجيات تسويقية شاملة تربط بين جميع القنوات الرقمية والتقليدية",
      features: ["تحليل السوق والمنافسين", "تحديد الجمهور المستهدف", "رحلة العميل المتكاملة", "قياس الأداء المستمر"]
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      company: "مجموعة الفلاح التجارية",
      review: "فريق احترافي حقق لنا نتائج مذهلة في تطوير حضورنا الرقمي وزيادة المبيعات بنسبة 300%",
      rating: 5,
      image: "/lovable-uploads/2f45c50e-e8b3-44e1-97f1-5923f0084b17.png"
    },
    {
      name: "فاطمة العلي",
      company: "شركة النور للتكنولوجيا",
      review: "خدمة متميزة وفريق يفهم احتياجاتنا. حققوا أهدافنا التسويقية بشكل يفوق التوقعات",
      rating: 5,
      image: "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png"
    },
    {
      name: "خالد الرشيد",
      company: "مؤسسة الابتكار الطبي",
      review: "شراكة استراتيجية حقيقية ساعدتنا في الوصول لأسواق جديدة وتحقيق نمو مستدام",
      rating: 5,
      image: "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png"
    }
  ];

  const portfolio = [
    {
      title: "حملة التسويق الرقمي لمجموعة الفطيم",
      description: "زيادة المبيعات بنسبة 400% خلال 6 أشهر",
      category: "تسويق رقمي",
      image: "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png",
      results: ["400% زيادة في المبيعات", "250% نمو في حركة الموقع", "60% تحسن في معدل التحويل"]
    },
    {
      title: "تطوير منصة التجارة الإلكترونية لسوق دبي",
      description: "بناء منصة متطورة بتقنيات الذكاء الاصطناعي",
      category: "تطوير ويب",
      image: "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png",
      results: ["منصة بـ 5 لغات", "تكامل مع 20 بوابة دفع", "مليون مستخدم نشط"]
    },
    {
      title: "استراتيجية المحتوى لشركة إعمار",
      description: "بناء حضور رقمي قوي على جميع المنصات",
      category: "استراتيجية محتوى",
      image: "/lovable-uploads/11949ba3-ce73-4843-be21-760250e11b50.png",
      results: ["10 مليون مشاهدة", "500% نمو في المتابعين", "85% معدل تفاعل"]
    }
  ];

  const team = [
    {
      name: "د. سارة أحمد",
      role: "مديرة التسويق الرقمي",
      experience: "15+ سنة خبرة",
      speciality: "استراتيجيات التسويق العالمية",
      image: "/lovable-uploads/2f45c50e-e8b3-44e1-97f1-5923f0084b17.png"
    },
    {
      name: "محمد الزهراني",
      role: "مطور تقنيات الويب",
      experience: "12+ سنة خبرة",
      speciality: "تطوير المنصات الرقمية",
      image: "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png"
    },
    {
      name: "لينا المنصوري",
      role: "مصممة تجربة المستخدم",
      experience: "10+ سنة خبرة",
      speciality: "تصميم واجهات المستخدم",
      image: "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png"
    }
  ];

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-lg sm:text-xl px-6 sm:px-8 py-2 sm:py-3 border-0">
              🚀 وكالة التسويق الرقمي الرائدة عالمياً
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent leading-tight">
              نحول أحلامكم الرقمية 
              <span className="block text-blue-600">إلى واقع مذهل</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto">
              شريككم الاستراتيجي في رحلة التحول الرقمي وبناء حضور مؤثر يحقق نتائج استثنائية في الأسواق العالمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1">
                <Rocket className="ml-2 h-6 w-6" />
                ابدأ رحلتك معنا
              </Button>
              <Button variant="outline" size="lg" className="px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl border-2 hover:bg-slate-50">
                <PlayCircle className="ml-2 h-6 w-6" />
                شاهد أعمالنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-white/20 transition-all duration-300">
                  <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{stat.number}</h3>
                <p className="text-blue-200 text-lg sm:text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-purple-100 text-purple-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">✨ خدماتنا المتميزة</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
              حلول رقمية شاملة
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto px-4">
              نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتحقيق أهدافكم التسويقية
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
                      <div key={idx} className="flex items-center gap-2 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">{service.price}</span>
                     <Button 
                       className={`bg-gradient-to-r ${service.bgColor} hover:shadow-lg w-full sm:w-auto text-sm sm:text-base`}
                       onClick={() => handleHomePayment(service, index)}
                       disabled={processingHomeService === index}
                     >
                       {processingHomeService === index ? "جاري المعالجة..." : "ادفع الآن"}
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
              شبكة عالمية من المكاتب تخدم عملاءنا في أكثر من 50 دولة
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { city: "دبي", country: "الإمارات", clients: "150+ عميل", icon: Building2 },
              { city: "الرياض", country: "السعودية", clients: "200+ عميل", icon: Building2 },
              { city: "لندن", country: "المملكة المتحدة", clients: "100+ عميل", icon: Building2 }
            ].map((office, index) => (
              <Card key={index} className="p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <office.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-800">{office.city}</h3>
                <p className="text-muted-foreground mb-2 sm:mb-4 text-base sm:text-lg">{office.country}</p>
                <Badge variant="secondary" className="text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2">{office.clients}</Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Preview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-white/10 text-white text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">💡 حلولنا المبتكرة</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              نبني المستقبل الرقمي
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              حلول متطورة تواكب أحدث التطورات التقنية وتلبي تطلعات العصر الرقمي
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 sm:p-8">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <solution.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">{solution.title}</h3>
                  <p className="text-blue-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{solution.description}</p>
                  <div className="space-y-2 sm:space-y-3">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                        <span className="text-blue-100 text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-yellow-100 text-yellow-800 text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">⭐ آراء عملائنا</Badge>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 to-yellow-600 bg-clip-text text-transparent">
              قصص نجاح ملهمة
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-purple-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm sm:text-base">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{testimonial.review}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            هل أنت مستعد للتميز؟
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 sm:mb-12 max-w-3xl mx-auto">
            انضم إلى مئات الشركات التي حققت نجاحاً باهراً معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold shadow-xl">
              <Calendar className="ml-2 h-6 w-6" />
              احجز استشارة مجانية
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl">
              <Phone className="ml-2 h-6 w-6" />
              تواصل معنا
            </Button>
          </div>
        </div>
      </section>
    </div>
  );

  const renderServicesPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Services Hero */}
      <section className="py-20 sm:py-32 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-pink-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-lg sm:text-xl px-6 sm:px-8 py-2 sm:py-3 border-0">
              🎯 خدماتنا الاحترافية
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent leading-tight">
              خدمات تسويق رقمي
              <span className="block text-purple-600">عالمية المستوى</span>
            </h1>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">حلول متكاملة تلبي احتياجات الشركات العالمية</p>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
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
                    onClick={() => handleServicesPayment(service, index)}
                    disabled={processingServicesService === index}
                  >
                    {processingServicesService === index ? "جاري المعالجة..." : "ادفع الآن"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderSolutionsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              حلولنا المبتكرة
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              نقدم حلولاً رقمية متطورة تواكب احدث التطورات التقنية
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {solutions.map((solution, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                  <solution.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-800">{solution.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{solution.description}</p>
                <div className="space-y-3">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderPortfolioPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-green-700 bg-clip-text text-transparent">
              معرض أعمالنا
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              اكتشف مشاريعنا الناجحة والنتائج المحققة
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-12">
            {portfolio.map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6 sm:p-8">
                  <Badge className="mb-4 bg-green-100 text-green-800">{project.category}</Badge>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800">{project.title}</h3>
                  <p className="text-muted-foreground mb-6">{project.description}</p>
                  <div className="space-y-2">
                    {project.results.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-700">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderAboutPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-orange-700 bg-clip-text text-transparent">
              من نحن
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              فريق من الخبراء المتخصصين في التسويق الرقمي والتكنولوجيا
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-20">
            {team.map((member, index) => (
              <Card key={index} className="p-6 sm:p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-6 object-cover border-4 border-orange-200"
                />
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-800">{member.name}</h3>
                <p className="text-orange-600 font-semibold mb-2">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.experience}</p>
                <Badge variant="secondary">{member.speciality}</Badge>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="p-8 sm:p-12 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">رؤيتنا</h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                نسعى لأن نكون الشريك الأول للشركات في رحلة التحول الرقمي، من خلال تقديم حلول مبتكرة 
                وخدمات عالية الجودة تساعد عملاءنا على تحقيق أهدافهم وبناء حضور رقمي قوي ومؤثر
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCareersPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">
              انضم لفريقنا
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              فرص وظيفية مميزة في بيئة عمل إبداعية ومحفزة
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {[
              {
                title: "مطور واجهات أمامية",
                department: "التطوير",
                type: "دوام كامل",
                location: "دبي",
                requirements: ["خبرة 3+ سنوات في React", "إتقان TypeScript", "خبرة في التصميم المتجاوب"]
              },
              {
                title: "أخصائي تسويق رقمي",
                department: "التسويق",
                type: "دوام كامل", 
                location: "الرياض",
                requirements: ["خبرة في إدارة الحملات", "إتقان أدوات التحليل", "مهارات كتابة إبداعية"]
              },
              {
                title: "مصمم تجربة مستخدم",
                department: "التصميم",
                type: "دوام كامل",
                location: "لندن",
                requirements: ["إتقان أدوات التصميم", "فهم مبادئ UX/UI", "معرفة بأحدث الاتجاهات"]
              },
              {
                title: "محلل بيانات",
                department: "التحليل",
                type: "دوام جزئي",
                location: "عن بُعد",
                requirements: ["خبرة في SQL وPython", "معرفة بأدوات التصور", "مهارات تحليلية قوية"]
              }
            ].map((job, index) => (
              <Card key={index} className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">{job.title}</h3>
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">{job.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-slate-700">المتطلبات:</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  تقدم للوظيفة
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderBlogPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-transparent">
              مدونتنا
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              أحدث الأخبار والمقالات في عالم التسويق الرقمي
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                title: "مستقبل التسويق الرقمي في 2024",
                excerpt: "اكتشف أحدث الاتجاهات والتقنيات التي ستشكل مستقبل التسويق الرقمي",
                date: "15 ديسمبر 2023",
                readTime: "5 دقائق قراءة",
                category: "اتجاهات"
              },
              {
                title: "كيفية بناء استراتيجية محتوى فعالة",
                excerpt: "دليل شامل لإنشاء استراتيجية محتوى تجذب الجمهور وتحقق الأهداف",
                date: "10 ديسمبر 2023", 
                readTime: "7 دقائق قراءة",
                category: "استراتيجية"
              },
              {
                title: "أهمية تحسين محركات البحث للشركات",
                excerpt: "تعرف على كيفية تحسين موقعك للظهور في أعلى نتائج البحث",
                date: "5 ديسمبر 2023",
                readTime: "6 دقائق قراءة", 
                category: "SEO"
              }
            ].map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100"></div>
                <CardContent className="p-6 sm:p-8">
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-teal-100 text-teal-800">{article.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-800">{article.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{article.date}</span>
                    <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                      اقرأ المزيد <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderContactPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <section className="py-20 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent">
              تواصل معنا
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto">
              نحن هنا لمساعدتك في تحقيق أهدافك الرقمية
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Card className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-slate-800">أرسل لنا رسالة</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">الاسم الأول</label>
                    <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">اسم العائلة</label>
                    <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
                  <input type="email" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">رقم الهاتف</label>
                  <input type="tel" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">الرسالة</label>
                  <textarea rows={6} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                </div>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 text-lg">
                  أرسل الرسالة
                </Button>
              </form>
            </Card>
            
            <div className="space-y-8">
              <Card className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">اتصل بنا</h3>
                    <p className="text-muted-foreground">+971 4 123 4567</p>
                    <p className="text-muted-foreground">+966 11 987 6543</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">راسلنا</h3>
                    <p className="text-muted-foreground">info@digitalmarketing.com</p>
                    <p className="text-muted-foreground">support@digitalmarketing.com</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">مكاتبنا</h3>
                    <p className="text-muted-foreground mb-2">دبي: برج خليفة، الطابق 50</p>
                    <p className="text-muted-foreground mb-2">الرياض: برج المملكة، الطابق 30</p>
                    <p className="text-muted-foreground">لندن: Canary Wharf, Floor 25</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return renderHomePage();
      case 'services': return renderServicesPage();
      case 'solutions': return renderSolutionsPage();
      case 'portfolio': return renderPortfolioPage();
      case 'about': return renderAboutPage();
      case 'careers': return renderCareersPage();
      case 'blog': return renderBlogPage();
      case 'contact': return renderContactPage();
      default: return renderHomePage();
    }
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ماركتنغ برو
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 text-right ${
                      currentPage === item.id
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ماركتنغ برو</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                شريككم الاستراتيجي في رحلة التحول الرقمي وبناء حضور مؤثر في الأسواق العالمية
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">خدماتنا</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">تحسين محركات البحث</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الإعلانات الرقمية</a></li>
                <li><a href="#" className="hover:text-white transition-colors">إدارة المحتوى</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التحليل والتقارير</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">الشركة</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors">فريق العمل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الوظائف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">تواصل معنا</h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  <span>+971 4 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span>info@marketingpro.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  <span>دبي، برج خليفة</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2023 ماركتنغ برو. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DigitalMarketingWebsite;
