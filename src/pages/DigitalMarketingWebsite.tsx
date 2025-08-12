import { useState } from "react";
import { TrendingUp, BarChart3, Target, Users, Mail, Phone, MapPin, Calendar, CheckCircle2, ArrowRight, Star, Globe, Zap, Shield, Award, Eye, MousePointer, Search, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DigitalMarketingWebsite = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "الرئيسية", icon: TrendingUp },
    { id: "services", label: "خدماتنا", icon: Target },
    { id: "portfolio", label: "أعمالنا", icon: BarChart3 },
    { id: "about", label: "من نحن", icon: Users },
    { id: "contact", label: "تواصل معنا", icon: Phone }
  ];

  const services = [
    {
      icon: Search,
      title: "تحسين محركات البحث (SEO)",
      description: "تصدر نتائج البحث وزيادة الزيارات العضوية لموقعك مع استراتيجيات SEO المتقدمة",
      features: ["تحليل الكلمات المفتاحية", "تحسين المحتوى", "بناء الروابط", "تقارير شهرية"]
    },
    {
      icon: MousePointer,
      title: "إعلانات جوجل المدفوعة (PPC)",
      description: "حملات إعلانية مستهدفة ومربحة على جوجل ومحركات البحث الأخرى",
      features: ["إدارة الحملات", "تحسين التكلفة", "تتبع التحويلات", "تقارير يومية"]
    },
    {
      icon: MessageSquare,
      title: "التسويق عبر وسائل التواصل",
      description: "بناء حضور قوي ومؤثر على منصات التواصل الاجتماعي وزيادة التفاعل",
      features: ["إدارة المحتوى", "تصميم المنشورات", "تفاعل مع الجمهور", "تحليل الأداء"]
    },
    {
      icon: Mail,
      title: "التسويق عبر البريد الإلكتروني",
      description: "حملات بريد إلكتروني احترافية تزيد من معدلات التحويل والمبيعات",
      features: ["تصميم القوالب", "أتمتة الحملات", "تقسيم الجمهور", "تتبع النتائج"]
    },
    {
      icon: BarChart3,
      title: "تحليل البيانات والتقارير",
      description: "تحليل شامل لأداء حملاتك التسويقية مع تقارير مفصلة وقابلة للتنفيذ",
      features: ["تحليل الجمهور", "قياس ROI", "تقارير مخصصة", "توصيات للتحسين"]
    },
    {
      icon: Globe,
      title: "تطوير المواقع الإلكترونية",
      description: "تصميم وتطوير مواقع إلكترونية احترافية محسنة لمحركات البحث والتحويلات",
      features: ["تصميم متجاوب", "تحسين السرعة", "UX/UI محترف", "تكامل التحليلات"]
    }
  ];

  const stats = [
    { number: "500+", label: "عميل راضي", icon: Users },
    { number: "300%", label: "زيادة متوسط في المبيعات", icon: TrendingUp },
    { number: "95%", label: "معدل رضا العملاء", icon: Star },
    { number: "24/7", label: "دعم فني متواصل", icon: Shield }
  ];

  const portfolioItems = [
    {
      title: "متجر الأزياء الراقية",
      description: "زيادة المبيعات بنسبة 400% خلال 6 شهور",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      results: ["400% زيادة في المبيعات", "250% زيادة في الزيارات", "65% تحسن في معدل التحويل"],
      category: "تجارة إلكترونية"
    },
    {
      title: "شركة الخدمات المالية",
      description: "تحسين ترتيب محركات البحث والوصول للصفحة الأولى",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      results: ["صفحة أولى في جوجل", "300% زيادة في العملاء المحتملين", "150% زيادة في الزيارات"],
      category: "خدمات مالية"
    },
    {
      title: "مطعم الوجبات السريعة",
      description: "نمو قاعدة العملاء عبر وسائل التواصل الاجتماعي",
      image: "https://images.unsplash.com/photo-1552566859-2e6d65d3b6ca?auto=format&fit=crop&w=800&q=80",
      results: ["100K متابع جديد", "500% زيادة في الطلبات", "85% تحسن في التفاعل"],
      category: "مطاعم"
    }
  ];

  const renderPage = () => {
    switch(currentPage) {
      case "services":
        return <ServicesPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "about":
        return <AboutPage />;
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
            backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-pink-900/90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30 px-6 py-2 text-lg">
              🚀 نمّي أعمالك رقمياً
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent leading-tight">
              سوّق بذكاء
              <span className="block bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">واربح أكثر</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed text-purple-100">
              نحول عملك إلى نجاح رقمي بحلول تسويقية مبتكرة ومثبتة النجاح. زيادة مضمونة في المبيعات والأرباح
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-10 py-6 text-xl shadow-2xl shadow-pink-500/25 hover-scale">
                🎯 ابدأ رحلة النجاح
                <ArrowRight className="mr-2 h-6 w-6" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 px-10 py-6 text-xl backdrop-blur-sm">
                📊 استشارة مجانية
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="animate-fade-in text-center" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className="text-4xl md:text-5xl font-bold text-pink-400 mb-2">{stat.number}</div>
                  <div className="text-purple-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-purple-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">🎯 خدماتنا المتخصصة</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">
              حلول تسويقية شاملة لنجاحك
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover-scale group bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl group-hover:shadow-purple-500/25 transition-all duration-500">
                    <service.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">{service.description}</p>
                  <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                    اعرف المزيد
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-20 bg-gradient-to-b from-purple-50/30 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-800">🏆 قصص نجاح</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-pink-700 bg-clip-text text-transparent">
              نتائج حقيقية لعملاء حقيقيين
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover-scale group border-0">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-pink-500">{item.category}</Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-pink-200">{item.description}</p>
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-r from-white to-purple-50/50">
                  <div className="space-y-2">
                    {item.results.map((result, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                        <span className="text-slate-600">{result}</span>
                      </div>
                    ))}
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
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">خدماتنا التسويقية</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">حلول تسويقية متكاملة لنمو أعمالك</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
              <service.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button>احصل على عرض سعر</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const PortfolioPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">أعمالنا</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">قصص نجاح حقيقية مع عملائنا</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <img src={item.image} alt={item.title} className="w-full h-64 object-cover" />
              <CardContent className="p-6">
                <Badge className="mb-4">{item.category}</Badge>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="space-y-2">
                  {item.results.map((result, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
                      <span>{result}</span>
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
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">خبراء في التسويق الرقمي</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">رؤيتنا</h2>
            <p className="text-lg leading-relaxed">أن نكون الشريك الأول للشركات في رحلتها نحو النجاح الرقمي</p>
          </Card>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">تواصل معنا</h1>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center">
                <Phone className="h-6 w-6 ml-3 text-primary" />
                <span className="text-lg">+966 11 234 5678</span>
              </div>
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
          🚧 هذا موقع تجريبي للمعاينة فقط
        </AlertDescription>
      </Alert>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-gradient-to-br from-purple-600 to-pink-700 p-3 rounded-xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  التسويق الذكي
                </h1>
                <p className="text-sm text-slate-500">نمّي أعمالك رقمياً</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8 space-x-reverse">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' 
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="hidden lg:flex">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg">
                استشارة مجانية
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl mr-3">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">التسويق الذكي</span>
                  <p className="text-purple-300 text-sm">نمّي أعمالك رقمياً</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-300">خدماتنا</h4>
              <ul className="space-y-3 text-purple-200">
                <li>تحسين محركات البحث</li>
                <li>إعلانات جوجل</li>
                <li>التسويق عبر السوشال ميديا</li>
                <li>تحليل البيانات</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-12 pt-8 text-center">
            <p className="text-purple-300">&copy; 2024 التسويق الذكي. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DigitalMarketingWebsite;