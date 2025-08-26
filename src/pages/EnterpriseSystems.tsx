import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Users, Building2, Zap, Target, Shield, Database, BarChart3, Settings, Cloud, TrendingUp, ArrowLeft, Star, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const EnterpriseSystems = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = parseInt(entry.target.getAttribute('data-section') || '0');
            setVisibleSections(prev => new Set(prev).add(sectionIndex));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const systemTypes = [
    {
      id: 1,
      title: "إدارة الموارد البشرية",
      titleEn: "Human Resources Management",
      description: "نظام شامل لإدارة الموظفين، الرواتب، الحضور والانصراف، التقييمات، والتدريب",
      icon: Users,
      color: "from-blue-600 to-indigo-700",
      features: ["إدارة بيانات الموظفين", "نظام الرواتب والمكافآت", "تتبع الحضور والغياب", "إدارة الإجازات", "تقييم الأداء", "التدريب والتطوير"],
      benefits: ["تقليل الأخطاء الإدارية", "توفير الوقت والجهد", "تحسين تجربة الموظفين", "تقارير تحليلية شاملة"]
    },
    {
      id: 2,
      title: "أنظمة المحاسبة والمالية",
      titleEn: "Financial & Accounting Systems",
      description: "حلول محاسبية متطورة تشمل إدارة الحسابات، الفواتير، المخزون، والتقارير المالية",
      icon: BarChart3,
      color: "from-emerald-600 to-teal-700",
      features: ["إدارة الحسابات العامة", "نظام الفواتير الإلكترونية", "إدارة المخزون", "تتبع المدفوعات", "التقارير المالية", "التكامل البنكي"],
      benefits: ["دقة محاسبية عالية", "توافق مع المعايير المحلية", "تقارير فورية ودقيقة", "تبسيط العمليات المالية"]
    },
    {
      id: 3,
      title: "إدارة المشاريع",
      titleEn: "Project Management",
      description: "منصة متكاملة لتخطيط وتنفيذ ومتابعة المشاريع بكفاءة عالية وتعاون فعال",
      icon: Target,
      color: "from-purple-600 to-violet-700",
      features: ["تخطيط المهام والمواعيد", "تتبع التقدم المحرز", "إدارة الفرق والموارد", "تقارير الأداء", "التعاون الجماعي", "إدارة المخاطر"],
      benefits: ["تحسين الإنتاجية", "تقليل زمن التسليم", "تحسين التعاون", "رقابة فعالة على الميزانية"]
    },
    {
      id: 4,
      title: "إدارة علاقات العملاء",
      titleEn: "Customer Relationship Management",
      description: "نظام شامل لإدارة العملاء، المبيعات، والخدمات لتحسين رضا العملاء وزيادة الإيرادات",
      icon: Building2,
      color: "from-orange-600 to-red-700",
      features: ["قاعدة بيانات العملاء", "تتبع المبيعات", "إدارة الفرص التجارية", "خدمة العملاء", "التسويق الرقمي", "التحليلات والتقارير"],
      benefits: ["زيادة المبيعات", "تحسين خدمة العملاء", "فهم أفضل للعملاء", "أتمتة العمليات التسويقية"]
    },
    {
      id: 5,
      title: "إدارة المخزون والمستودعات",
      titleEn: "Inventory & Warehouse Management",
      description: "حلول ذكية لإدارة المخزون، تتبع البضائع، وتحسين عمليات المستودعات",
      icon: Database,
      color: "from-cyan-600 to-blue-700",
      features: ["تتبع المخزون الفوري", "إدارة المستودعات", "تحسين المشتريات", "تتبع انتهاء الصلاحية", "تقارير المخزون", "التكامل مع نقاط البيع"],
      benefits: ["تقليل الفاقد", "تحسين دوران المخزون", "توفير في التكاليف", "دقة في البيانات"]
    },
    {
      id: 6,
      title: "أنظمة الأمان والمراقبة",
      titleEn: "Security & Monitoring Systems",
      description: "حلول أمنية متطورة لحماية البيانات والأصول الرقمية مع مراقبة شاملة للأنظمة",
      icon: Shield,
      color: "from-red-600 to-pink-700",
      features: ["مراقبة الأمان المستمرة", "إدارة الصلاحيات", "تشفير البيانات", "النسخ الاحتياطي", "مراقبة الأداء", "التنبيهات الفورية"],
      benefits: ["حماية عالية للبيانات", "امتثال للمعايير الأمنية", "منع التسريبات", "استمرارية العمل"]
    }
  ];

  const keyFeatures = [
    {
      icon: Cloud,
      title: "حلول سحابية متقدمة",
      description: "إمكانية الوصول من أي مكان وفي أي وقت مع ضمان الأمان والسرعة"
    },
    {
      icon: Settings,
      title: "تخصيص كامل",
      description: "نظم قابلة للتخصيص بالكامل لتناسب احتياجات شركتك الفريدة"
    },
    {
      icon: TrendingUp,
      title: "تحليلات ذكية",
      description: "تقارير وتحليلات متطورة تساعد في اتخاذ قرارات مدروسة"
    },
    {
      icon: Zap,
      title: "أداء فائق",
      description: "سرعة عالية واستجابة فورية حتى مع أكبر كميات البيانات"
    }
  ];

  const successStories = [
    {
      company: "مجموعة الراجحي التجارية",
      industry: "التجارة والتوزيع",
      challenge: "إدارة معقدة للمخزون عبر 50+ فرع",
      solution: "نظام إدارة مخزون متكامل مع تتبع فوري",
      results: ["تقليل الفاقد بنسبة 40%", "زيادة الكفاءة بنسبة 60%", "توفير 2 مليون ريال سنوياً"],
      logo: "/src/assets/alrajhi-bank-logo.png"
    },
    {
      company: "شركة تسهيل للتمويل",
      industry: "الخدمات المالية",
      challenge: "إدارة معقدة لطلبات التمويل والعمليات المالية",
      solution: "نظام إدارة مالي شامل مع أتمتة العمليات",
      results: ["تسريع معالجة الطلبات بنسبة 70%", "تقليل الأخطاء إلى 0.1%", "رضا العملاء 98%"],
      logo: "/src/assets/tasaheel-logo.png"
    }
  ];

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      nameEn: "Basic Plan",
      price: "2,999",
      period: "شهرياً",
      description: "مناسبة للشركات الناشئة والصغيرة",
      features: ["حتى 50 مستخدم", "3 أنظمة أساسية", "دعم فني 24/7", "تقارير أساسية", "تدريب مجاني"],
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "الباقة المتقدمة",
      nameEn: "Professional Plan",
      price: "5,999",
      period: "شهرياً",
      description: "الأمثل للشركات المتوسطة والمتنامية",
      features: ["حتى 200 مستخدم", "جميع الأنظمة", "تحليلات متقدمة", "تكامل مع API", "تخصيص محدود", "تدريب شامل"],
      popular: true,
      color: "from-blue-600 to-indigo-700"
    },
    {
      name: "الباقة المؤسسية",
      nameEn: "Enterprise Plan",
      price: "حسب الطلب",
      period: "",
      description: "حلول مخصصة للمؤسسات الكبيرة",
      features: ["مستخدمين غير محدودين", "تخصيص كامل", "تكامل متقدم", "دعم مخصص", "SLA مضمون", "استشارات مجانية"],
      popular: false,
      color: "from-purple-600 to-violet-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % keyFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO 
        title="أنظمة الشركات | حلول رقمية متطورة لإدارة الأعمال"
        description="اكتشف مجموعة شاملة من أنظمة الشركات المتطورة: إدارة الموارد البشرية، المحاسبة، إدارة المشاريع، وأكثر. حلول مخصصة لتحسين كفاءة شركتك."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden" data-section="0">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-blue-600 font-medium">أنظمة الشركات</span>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={cn(
                "space-y-8 animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-lg shadow-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300 font-cairo">
                    أنظمة مؤسسية متطورة
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight font-cairo">
                    <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                      أنظمة الشركات
                    </span>
                  </h1>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                    Enterprise Systems Solutions
                  </p>
                </div>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium font-cairo">
                  حلول رقمية متطورة ومتكاملة لإدارة جميع جوانب أعمالك. من إدارة الموارد البشرية إلى الأنظمة المالية، 
                  نوفر لك منصة شاملة تعزز الكفاءة وتبسط العمليات.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo">
                    احصل على استشارة مجانية
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-cairo">
                    عرض توضيحي مباشر
                  </Button>
                </div>
                
                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-3xl font-black text-blue-600 mb-2">500+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">شركة تثق بنا</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-emerald-600 mb-2">98%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">رضا العملاء</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-600 mb-2">24/7</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">دعم تقني</div>
                  </div>
                </div>
              </div>
              
              {/* Hero Image */}
              <div className={cn(
                "relative animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )} style={{ animationDelay: "0.3s" }}>
                <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                  {/* Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">لوحة القيادة الرئيسية</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">إدارة شاملة لجميع الأنظمة</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {systemTypes.slice(0, 4).map((system, index) => {
                        const IconComponent = system.icon;
                        return (
                          <div key={system.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className={cn(
                              "w-8 h-8 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-r",
                              system.color
                            )}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white mb-1">{system.title}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{system.titleEn}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-20 animate-float"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20 animate-float-delayed"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Systems Overview */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="1">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  أنظمتنا المتخصصة
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium font-cairo">
                مجموعة شاملة من الأنظمة المصممة لتلبية جميع احتياجات شركتك الرقمية
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {systemTypes.map((system, index) => {
                const IconComponent = system.icon;
                return (
                  <Card key={system.id} className={cn(
                    "group relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 animate-fade-in",
                    visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )} style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Gradient border */}
                    <div className={cn(
                      "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-r blur-sm",
                      system.color
                    )}></div>
                    
                    <CardContent className="relative z-10 p-8">
                      {/* Icon */}
                      <div className="mb-6 relative">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r shadow-lg",
                          system.color
                        )}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4 mb-6">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white font-cairo">
                          {system.title}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-poppins">
                          {system.titleEn}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-cairo">
                          {system.description}
                        </p>
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm font-cairo">المميزات الرئيسية:</h4>
                        <div className="space-y-2">
                          {system.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="text-xs text-slate-600 dark:text-slate-300 font-cairo">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <Link to={
                        system.id === 1 ? "/hr-management-system" :
                        system.id === 2 ? "/financial-system" :
                        system.id === 3 ? "/project-management-system" :
                        "#"
                      }>
                        <Button className={cn(
                          "w-full bg-gradient-to-r text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo",
                          system.color
                        )}>
                          تفاصيل أكثر
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20" data-section="2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  لماذا تختار أنظمتنا؟
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium font-cairo">
                مميزات تقنية متطورة تجعل أنظمتنا الخيار الأمثل لشركتك
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                const isActive = activeFeature === index;
                return (
                  <Card key={index} className={cn(
                    "group text-center p-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 rounded-2xl shadow-lg transition-all duration-700 animate-fade-in",
                    isActive ? "border-blue-400/80 shadow-2xl scale-105" : "border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400/60",
                    visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )} style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center transition-all duration-500",
                      isActive ? "scale-110 shadow-lg" : "group-hover:scale-105"
                    )}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 font-cairo">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-cairo">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white" data-section="3">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                قصص النجاح
              </h2>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto font-medium font-cairo">
                شركات رائدة حققت نمواً استثنائياً باستخدام أنظمتنا
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {successStories.map((story, index) => (
                <Card key={index} className={cn(
                  "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 animate-fade-in",
                  visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )} style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                      <img src={story.logo} alt={story.company} className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-2 font-cairo">{story.company}</h3>
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-200 border-blue-400/30">
                        {story.industry}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-orange-300 mb-2 font-cairo">التحدي:</h4>
                      <p className="text-white/80 font-cairo">{story.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-emerald-300 mb-2 font-cairo">الحل:</h4>
                      <p className="text-white/80 font-cairo">{story.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-blue-300 mb-3 font-cairo">النتائج:</h4>
                      <div className="space-y-2">
                        {story.results.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <span className="text-white/90 font-cairo">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="4">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  باقات الأسعار
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium font-cairo">
                اختر الباقة المناسبة لحجم شركتك واحتياجاتك
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={cn(
                  "relative overflow-hidden bg-white dark:bg-slate-800 border-2 rounded-2xl shadow-lg transition-all duration-700 animate-fade-in",
                  plan.popular ? "border-blue-400 shadow-2xl scale-105" : "border-slate-200 dark:border-slate-700 hover:border-blue-400/60",
                  visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )} style={{ animationDelay: `${index * 0.1}s` }}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-full font-bold">
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center p-8">
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r flex items-center justify-center",
                      plan.color
                    )}>
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-800 dark:text-white mb-2 font-cairo">
                      {plan.name}
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-poppins">
                      {plan.nameEn}
                    </p>
                    <div className="mt-6">
                      <span className="text-4xl font-black text-slate-800 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-slate-600 dark:text-slate-400 font-cairo"> {plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 font-cairo">
                      {plan.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-8 pt-0">
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-slate-600 dark:text-slate-300 font-cairo">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className={cn(
                      "w-full text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo",
                      plan.popular 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800" 
                        : `bg-gradient-to-r ${plan.color} hover:opacity-90`
                    )}>
                      ابدأ الآن
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden" data-section="5">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
            <div className={cn(
              "animate-fade-in",
              visibleSections.has(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                ابدأ رحلة التحول الرقمي
              </h2>
              <p className="text-xl text-blue-100 mb-8 font-medium font-cairo">
                انضم إلى أكثر من 500 شركة تثق في حلولنا المتطورة لإدارة أعمالها
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo">
                  احجز استشارة مجانية
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-12 py-4 rounded-xl transition-all duration-300 font-cairo">
                  تحدث مع خبير
                </Button>
              </div>
              
              <div className="mt-12 flex justify-center items-center gap-8 text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-cairo">تجربة مجانية 30 يوم</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-cairo">دعم فني 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-cairo">ضمان استرداد المال</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default EnterpriseSystems;