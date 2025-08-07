import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Wifi, Globe, Users, Shield, Clock, Star, CheckCircle, Building, ArrowRight, Zap, Target, Award, Code, Palette, TrendingUp, HeadphonesIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RemoteWork = () => {
  const remoteStats = [
    {
      icon: Globe,
      number: "88%",
      label: "من الشركات العالمية",
      sublabel: "تعتمد العمل عن بُعد",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Users,
      number: "74%",
      label: "من الموظفين",
      sublabel: "يفضلون العمل المرن",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Star,
      number: "95%",
      label: "رضا العملاء",
      sublabel: "مع فرق العمل عن بُعد",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Shield,
      number: "99.9%",
      label: "موثوقية الخدمة",
      sublabel: "في بيئة العمل الرقمية",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const trustedCompanies = [
    { name: "Microsoft", logo: "🖥️" },
    { name: "Google", logo: "🔍" },
    { name: "Amazon", logo: "📦" },
    { name: "Apple", logo: "🍎" },
    { name: "Meta", logo: "📱" },
    { name: "Tesla", logo: "🚗" },
  ];

  const remoteAdvantages = [
    {
      icon: Clock,
      title: "مرونة في العمل",
      description: "نعمل في المناطق الزمنية المناسبة لعملائنا لضمان التواصل المستمر"
    },
    {
      icon: Globe,
      title: "وصول عالمي",
      description: "نوظف أفضل المواهب من جميع أنحاء العالم لخدمة مشاريعكم"
    },
    {
      icon: Shield,
      title: "أمان وموثوقية",
      description: "بروتوكولات أمان متقدمة وأنظمة حماية للبيانات على أعلى مستوى"
    },
    {
      icon: Users,
      title: "فرق متخصصة",
      description: "فرق عمل مدربة ومعتمدة في أحدث التقنيات والممارسات العالمية"
    },
  ];

  const remoteServices = [
    {
      icon: Zap,
      title: "التطوير والبرمجة",
      description: "فرق تطوير متخصصة تعمل بأحدث التقنيات والأدوات البرمجية",
      features: ["تطوير تطبيقات الويب", "تطبيقات الجوال", "أنظمة إدارة قواعد البيانات", "الذكاء الاصطناعي"]
    },
    {
      icon: Target,
      title: "التسويق الرقمي",
      description: "استراتيجيات تسويقية متكاملة تُدار عن بُعد بكفاءة عالية",
      features: ["إدارة وسائل التواصل", "حملات إعلانية مدفوعة", "تحسين محركات البحث", "تحليل البيانات"]
    },
    {
      icon: Award,
      title: "الاستشارات التقنية",
      description: "خبراء استشاريون متاحون للمساعدة في اتخاذ القرارات التقنية المناسبة",
      features: ["تحليل الأنظمة", "تخطيط البنية التحتية", "أمن المعلومات", "التحول الرقمي"]
    }
  ];

  const relatedPages = [
    {
      title: "فريق العمل",
      description: "تعرف على فريق العمل المتخصص لدينا",
      href: "/team",
      icon: Users,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "الوظائف والمهن",
      description: "انضم لفريقنا واعمل معنا عن بُعد",
      href: "/careers",
      icon: Target,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "خدماتنا الاحترافية",
      description: "اكتشف جميع خدماتنا المتاحة عن بُعد",
      href: "/professional-services",
      icon: Award,
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "حلول التصميم",
      description: "خدمات تصميم إبداعية عن بُعد",
      href: "/design-solutions",
      icon: Palette,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "التطوير والابتكار",
      description: "حلول تطوير متقدمة عن بُعد",
      href: "/development",
      icon: Code,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "الدعم الفني",
      description: "دعم فني متاح 24/7 عن بُعد",
      href: "/support",
      icon: HeadphonesIcon,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pb-24 bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950 dark:via-cyan-950 dark:to-blue-950 overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-purple-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
              <Wifi className="w-10 h-10 text-white" />
            </div>
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              العمل عن بُعد - المستقبل هنا
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              نعمل عن <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">بُعد بثقة</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              نحن رواد في العمل عن بُعد، نقدم خدماتنا بأعلى جودة من خلال فرق متخصصة تعمل بمرونة وكفاءة عالية لتحقيق أهدافكم التجارية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                  ابدأ مشروعك الآن
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link to="/professional-services">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  تعرف على خدماتنا
                </Button>
              </Link>
            </div>
          </div>

          {/* Remote Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {remoteStats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} dark:bg-gray-700 rounded-full mb-4`}>
                    <stat.icon className={`w-7 h-7 ${stat.color} dark:text-gray-300`} />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${stat.color} dark:text-white`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
                    {stat.label}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {stat.sublabel}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trusted Companies */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              الشركات العالمية التي تثق في العمل عن بُعد
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {trustedCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <span className="text-2xl">{company.logo}</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Remote Work Advantages */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              لماذا نتميز في <span className="text-primary">العمل عن بُعد؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم مزايا فريدة تجعل تجربة العمل معنا عن بُعد أكثر فعالية وموثوقية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {remoteAdvantages.map((advantage, index) => (
              <Card
                key={index}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <advantage.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {advantage.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Remote Services */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              خدماتنا <span className="text-primary">عن بُعد</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية والاستشارية عن بُعد بأعلى معايير الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {remoteServices.map((service, index) => (
              <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Building Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
            <Building className="w-16 h-16 mx-auto mb-6 text-blue-100" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              ثقة مبنية على النجاح والشفافية
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              نؤمن بأن العمل عن بُعد ليس مجرد اتجاه، بل مستقبل الأعمال. نقدم لعملائنا تجربة موثوقة وشفافة مع إمكانية تتبع التقدم والتواصل المستمر
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-300 mb-4" />
                <h4 className="text-xl font-semibold mb-2">تواصل مستمر</h4>
                <p className="text-blue-100">متاحون 24/7 لخدمة عملائنا</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-300 mb-4" />
                <h4 className="text-xl font-semibold mb-2">شفافية كاملة</h4>
                <p className="text-blue-100">تقارير مفصلة ومتابعة دورية</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-300 mb-4" />
                <h4 className="text-xl font-semibold mb-2">جودة مضمونة</h4>
                <p className="text-blue-100">معايير عالمية في التسليم</p>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  ابدأ مشروعك معنا
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pages Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              اكتشف المزيد من <span className="text-primary">خدماتنا</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              تصفح صفحاتنا الأخرى لمعرفة المزيد عن خدماتنا وفرص العمل المتاحة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPages.map((page, index) => (
              <Link key={index} to={page.href} className="group">
                <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${page.color} rounded-full mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <page.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {page.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                      <span>اكتشف المزيد</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default RemoteWork;