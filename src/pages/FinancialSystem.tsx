import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, BarChart3, DollarSign, FileText, Calculator, TrendingUp, Shield, CreditCard, Building2, Star, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const FinancialSystem = () => {
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

  const financialModules = [
    {
      id: 1,
      title: "إدارة الحسابات العامة",
      titleEn: "General Ledger Management",
      description: "نظام محاسبي شامل لإدارة جميع الحسابات المالية وتتبع المعاملات",
      icon: Calculator,
      color: "from-emerald-600 to-teal-700",
      features: ["دليل الحسابات المرن", "القيود اليومية الآلية", "ميزان المراجعة", "الترحيل الآلي", "التسويات البنكية"],
      benefits: ["دقة محاسبية عالية", "سرعة في الإدخال", "تقليل الأخطاء", "توافق مع المعايير المحاسبية"]
    },
    {
      id: 2,
      title: "نظام الفواتير الإلكترونية",
      titleEn: "E-Invoicing System",
      description: "حلول متطورة لإنشاء وإدارة الفواتير الإلكترونية مع التوافق مع المعايير المحلية",
      icon: FileText,
      color: "from-blue-600 to-indigo-700",
      features: ["فواتير إلكترونية معتمدة", "ختم زمني مشفر", "التكامل مع هيئة الزكاة", "تتبع حالة الفواتير", "قوالب متعددة"],
      benefits: ["امتثال كامل للأنظمة", "تسريع عملية التحصيل", "تقليل التكاليف", "شفافية مالية"]
    },
    {
      id: 3,
      title: "إدارة المخزون المالية",
      titleEn: "Financial Inventory Management",
      description: "تتبع مالي دقيق للمخزون مع تقييم التكاليف والربحية",
      icon: Building2,
      color: "from-purple-600 to-violet-700",
      features: ["تقييم المخزون المتقدم", "حساب تكلفة البضاعة المباعة", "تتبع الأرباح", "تحليل دوران المخزون", "تقارير الربحية"],
      benefits: ["فهم أفضل للربحية", "تحسين إدارة المخزون", "تقليل التكاليف", "اتخاذ قرارات مدروسة"]
    },
    {
      id: 4,
      title: "تتبع المدفوعات والذمم",
      titleEn: "Payments & Receivables Tracking",
      description: "إدارة شاملة للمدفوعات والمقبوضات مع تتبع الذمم المدينة والدائنة",
      icon: CreditCard,
      color: "from-orange-600 to-red-700",
      features: ["تتبع الذمم المدينة", "إدارة الذمم الدائنة", "جدولة المدفوعات", "تنبيهات الاستحقاق", "تحليل التدفق النقدي"],
      benefits: ["تحسين التدفق النقدي", "تقليل الديون المتعثرة", "دقة في المتابعة", "تخطيط مالي أفضل"]
    },
    {
      id: 5,
      title: "التقارير المالية المتقدمة",
      titleEn: "Advanced Financial Reporting",
      description: "مجموعة شاملة من التقارير المالية التفصيلية والتحليلية",
      icon: BarChart3,
      color: "from-cyan-600 to-blue-700",
      features: ["الميزانية العمومية", "قائمة الدخل", "قائمة التدفق النقدي", "تقارير مخصصة", "تحليلات متقدمة"],
      benefits: ["رؤية مالية شاملة", "سهولة اتخاذ القرارات", "امتثال للمعايير", "تحليل الأداء المالي"]
    },
    {
      id: 6,
      title: "التكامل البنكي والمدفوعات",
      titleEn: "Banking Integration & Payments",
      description: "ربط مباشر مع البنوك وأنظمة الدفع المحلية والدولية",
      icon: DollarSign,
      color: "from-red-600 to-pink-700",
      features: ["التكامل مع البنوك السعودية", "مدفوعات إلكترونية", "تحويلات مصرفية", "تسوية آلية", "أنظمة دفع متعددة"],
      benefits: ["توفير الوقت والجهد", "دقة في التسويات", "أمان في المعاملات", "تتبع فوري"]
    }
  ];

  const keyBenefits = [
    {
      icon: Shield,
      title: "أمان مالي متقدم",
      description: "حماية عالية المستوى لجميع البيانات المالية مع التشفير والمراجعة"
    },
    {
      icon: TrendingUp,
      title: "تحليلات ذكية",
      description: "رؤى عميقة ومؤشرات أداء مالية لاتخاذ قرارات استراتيجية"
    },
    {
      icon: CheckCircle,
      title: "امتثال كامل",
      description: "توافق تام مع المعايير المحاسبية المحلية والدولية"
    },
    {
      icon: Calculator,
      title: "أتمتة العمليات",
      description: "تبسيط وأتمتة جميع العمليات المحاسبية والمالية"
    }
  ];

  const successStories = [
    {
      company: "مجموعة الراجحي التجارية",
      challenge: "تعقيد في إدارة الحسابات عبر فروع متعددة",
      solution: "نظام محاسبي موحد مع تقارير مركزية",
      results: ["تقليل وقت إعداد التقارير بنسبة 70%", "دقة محاسبية 99.9%", "توفير 500 ساعة عمل شهرياً"]
    },
    {
      company: "شركة تسهيل للتمويل",
      challenge: "حاجة لنظام فواتير متوافق مع الأنظمة الحكومية",
      solution: "نظام فواتير إلكترونية معتمد",
      results: ["امتثال كامل 100%", "تسريع التحصيل بنسبة 40%", "تقليل الأخطاء إلى 0.1%"]
    }
  ];

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "1,999",
      period: "شهرياً",
      description: "مناسبة للشركات الصغيرة والمتوسطة",
      features: ["الحسابات العامة", "الفواتير الأساسية", "تقارير مالية أساسية", "تكامل بنكي محدود", "دعم فني"],
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "الباقة المتقدمة",
      price: "3,999",
      period: "شهرياً",
      description: "الأمثل للشركات المتنامية",
      features: ["جميع ميزات الباقة الأساسية", "فواتير إلكترونية معتمدة", "إدارة مخزون مالية", "تقارير متقدمة", "تكامل بنكي كامل", "تحليلات ذكية"],
      popular: true,
      color: "from-emerald-600 to-teal-700"
    },
    {
      name: "الباقة المؤسسية",
      price: "حسب الطلب",
      period: "",
      description: "حلول مخصصة للمؤسسات الكبيرة",
      features: ["جميع الميزات", "تخصيص كامل", "تكامل مع أنظمة ERP", "دعم مخصص", "تدريب شامل", "استشارات مالية"],
      popular: false,
      color: "from-purple-600 to-violet-700"
    }
  ];

  return (
    <>
      <SEO 
        title="أنظمة المحاسبة والمالية | حلول محاسبية متطورة"
        description="نظام محاسبي شامل يشمل إدارة الحسابات، الفواتير الإلكترونية، التقارير المالية والتكامل البنكي. حلول مالية رقمية متطورة."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden" data-section="0">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-600/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-indigo-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/" className="hover:text-emerald-600 transition-colors">الرئيسية</Link>
              <ArrowLeft className="w-4 h-4" />
              <Link to="/enterprise-systems" className="hover:text-emerald-600 transition-colors">أنظمة الشركات</Link>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-emerald-600 font-medium">أنظمة المحاسبة والمالية</span>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={cn(
                "space-y-8 animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-blue-600/10 border border-emerald-500/20 backdrop-blur-lg shadow-lg">
                  <Calculator className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-cairo">
                    نظام محاسبي متطور
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight font-cairo">
                    <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                      أنظمة المحاسبة والمالية
                    </span>
                  </h1>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-poppins">
                    Financial & Accounting Systems
                  </p>
                </div>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium font-cairo">
                  حلول محاسبية متطورة وشاملة لإدارة جميع العمليات المالية في شركتك. من الحسابات العامة إلى الفواتير الإلكترونية 
                  والتقارير المالية، كل ما تحتاجه في نظام واحد متكامل.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo">
                    جرب النظام مجاناً
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-cairo">
                    عرض توضيحي
                  </Button>
                </div>
              </div>
              
              {/* Hero Visual */}
              <div className={cn(
                "relative animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )} style={{ animationDelay: "0.3s" }}>
                <div className="relative bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">لوحة التحكم المالية</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">إدارة شاملة للأموال</div>
                      </div>
                    </div>
                    
                    {/* Financial Charts Mockup */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-slate-800 dark:text-white">الإيرادات هذا الشهر</div>
                        <div className="text-lg font-bold text-emerald-600">+15.2%</div>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {financialModules.slice(0, 4).map((module, index) => {
                        const IconComponent = module.icon;
                        return (
                          <div key={module.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            <div className={cn(
                              "w-8 h-8 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-r",
                              module.color
                            )}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white mb-1">{module.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Modules */}
        <section className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="1">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                  وحدات النظام المالي
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                مجموعة شاملة من الأدوات المالية المتخصصة لإدارة جميع احتياجاتك المحاسبية
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {financialModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.id} 
                    className={cn(
                      "group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden",
                      visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r shadow-lg",
                          module.color
                        )}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-slate-800 dark:text-white mb-2 font-cairo">
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium font-poppins">
                            {module.titleEn}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {module.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 font-cairo">الميزات الرئيسية:</h4>
                        <ul className="space-y-2">
                          {module.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 font-cairo">الفوائد:</h4>
                        <ul className="space-y-2">
                          {module.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-section="2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                  لماذا تختار نظامنا المالي؟
                </span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div 
                    key={index}
                    className={cn(
                      "text-center group animate-fade-in",
                      visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 font-cairo">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="3">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                  قصص نجاح عملائنا
                </span>
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {successStories.map((story, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in",
                    visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-cairo">
                          {story.company}
                        </h3>
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium">التحدي:</div>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{story.challenge}</p>
                        
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium">الحل:</div>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{story.solution}</p>
                        
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">النتائج:</div>
                        <ul className="space-y-2">
                          {story.results.map((result, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-section="4">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-900 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                  خطط الأسعار
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                اختر الباقة التي تناسب حجم شركتك واحتياجاتك المالية
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden",
                    plan.popular ? "border-emerald-500/50 shadow-emerald-500/20 scale-105" : "border-slate-200/50 dark:border-slate-700/50",
                    visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center py-2 text-sm font-bold">
                      الأكثر شعبية
                    </div>
                  )}
                  
                  <CardContent className={cn("p-8", plan.popular ? "pt-12" : "")}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-cairo">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {plan.description}
                      </p>
                      <div className="mb-6">
                        {plan.period ? (
                          <>
                            <span className="text-4xl font-black text-slate-800 dark:text-white">{plan.price}</span>
                            <span className="text-slate-600 dark:text-slate-300 mr-2">ريال {plan.period}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-slate-800 dark:text-white">{plan.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={cn(
                        "w-full font-bold py-3 rounded-xl transition-all duration-300",
                        plan.popular 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl" 
                          : "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.period ? "ابدأ الآن" : "تواصل معنا"}
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-700 to-blue-800 text-white" data-section="5">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className={cn(
              "animate-fade-in",
              visibleSections.has(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                ابدأ رحلة التحول المالي الرقمي
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-medium">
                احصل على استشارة مجانية واكتشف كيف يمكن لنظامنا المالي تحسين كفاءة شركتك وزيادة أرباحها
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  احصل على استشارة مجانية
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl backdrop-blur-lg">
                  جرب النظام الآن
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FinancialSystem;