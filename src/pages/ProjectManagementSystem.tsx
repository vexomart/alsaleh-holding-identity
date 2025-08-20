import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Target, Calendar, Users, Clock, TrendingUp, BarChart3, Shield, Zap, Star, Sparkles, ArrowLeft, ChevronRight, Kanban, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const ProjectManagementSystem = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [activeFeature, setActiveFeature] = useState(0);

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

  const projectModules = [
    {
      id: 1,
      title: "تخطيط المهام والمواعيد",
      titleEn: "Task & Timeline Planning",
      description: "أدوات متقدمة لتخطيط المشاريع وتنظيم المهام مع الجدولة الذكية",
      icon: Calendar,
      color: "from-purple-600 to-violet-700",
      features: ["مخططات جانت التفاعلية", "جدولة المهام الذكية", "تحديد التبعيات", "التخطيط الزمني المرن", "تنبيهات المواعيد"],
      benefits: ["تخطيط دقيق للمشاريع", "تجنب تضارب المواعيد", "رؤية شاملة للجدول الزمني", "تحسين إدارة الوقت"]
    },
    {
      id: 2,
      title: "تتبع التقدم المحرز",
      titleEn: "Progress Tracking",
      description: "مراقبة مستمرة لتقدم المشاريع مع تقارير مرئية ومؤشرات الأداء",
      icon: BarChart3,
      color: "from-blue-600 to-indigo-700",
      features: ["لوحات تحكم مرئية", "مؤشرات أداء المشروع", "تتبع الإنجازات", "تقارير التقدم الآلية", "تحليل الانحرافات"],
      benefits: ["رؤية فورية للتقدم", "اكتشاف المشاكل مبكراً", "تحسين اتخاذ القرارات", "شفافية كاملة"]
    },
    {
      id: 3,
      title: "إدارة الفرق والموارد",
      titleEn: "Team & Resource Management",
      description: "تنظيم الفرق وتوزيع المهام مع إدارة ذكية للموارد والقدرات",
      icon: Users,
      color: "from-emerald-600 to-teal-700",
      features: ["توزيع المهام الذكي", "إدارة قدرات الفريق", "تتبع ساعات العمل", "تحليل الأعباء", "تقييم الأداء الفردي"],
      benefits: ["استغلال أمثل للموارد", "توازن أعباء العمل", "تحسين إنتاجية الفريق", "تطوير المهارات"]
    },
    {
      id: 4,
      title: "تقارير الأداء المتقدمة",
      titleEn: "Advanced Performance Reports",
      description: "تقارير شاملة وتحليلات عميقة لأداء المشاريع والفرق",
      icon: TrendingUp,
      color: "from-orange-600 to-red-700",
      features: ["تقارير مخصصة", "تحليلات متقدمة", "مقارنة الأداء", "توقعات ذكية", "تصدير متعدد الصيغ"],
      benefits: ["فهم عميق للأداء", "تحسين مستمر للعمليات", "اتخاذ قرارات مدروسة", "تحليل العائد على الاستثمار"]
    },
    {
      id: 5,
      title: "التعاون الجماعي",
      titleEn: "Team Collaboration",
      description: "منصة تعاون متطورة تجمع الفريق في مساحة عمل واحدة",
      icon: Target,
      color: "from-cyan-600 to-blue-700",
      features: ["مساحات عمل مشتركة", "تعليقات ومناقشات", "مشاركة الملفات", "إشعارات فورية", "تكامل مع التطبيقات"],
      benefits: ["تحسين التواصل", "سرعة في اتخاذ القرارات", "شفافية في العمل", "تقليل الاجتماعات"]
    },
    {
      id: 6,
      title: "إدارة المخاطر والجودة",
      titleEn: "Risk & Quality Management",
      description: "أدوات متخصصة لتحديد المخاطر وضمان جودة التسليم",
      icon: Shield,
      color: "from-red-600 to-pink-700",
      features: ["سجل المخاطر", "خطط الطوارئ", "معايير الجودة", "مراجعات دورية", "إدارة التغييرات"],
      benefits: ["تقليل المخاطر", "ضمان الجودة", "استباق المشاكل", "تحسين التسليم"]
    }
  ];

  const keyFeatures = [
    {
      icon: Zap,
      title: "أداء فائق السرعة",
      description: "واجهات سريعة الاستجابة حتى مع أكبر المشاريع والفرق"
    },
    {
      icon: Kanban,
      title: "إدارة مرنة",
      description: "دعم لمنهجيات Agile وScrum وWaterfall حسب احتياجاتك"
    },
    {
      icon: FileText,
      title: "وثائق ذكية",
      description: "إدارة المستندات والوثائق مع إصدارات متعددة وتتبع التغييرات"
    },
    {
      icon: Clock,
      title: "تتبع الوقت الدقيق",
      description: "تسجيل دقيق لساعات العمل مع تحليل الإنتاجية والكفاءة"
    }
  ];

  const successMetrics = [
    { label: "زيادة الإنتاجية", value: "45%", color: "text-emerald-600" },
    { label: "تقليل التأخير", value: "60%", color: "text-blue-600" },
    { label: "رضا العملاء", value: "95%", color: "text-purple-600" },
    { label: "توفير التكاليف", value: "30%", color: "text-orange-600" }
  ];

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "999",
      period: "شهرياً",
      description: "مناسبة للفرق الصغيرة (حتى 25 عضو)",
      features: ["إدارة المشاريع الأساسية", "تتبع المهام", "تقارير أساسية", "تعاون الفريق", "دعم فني"],
      popular: false,
      color: "from-gray-600 to-gray-700",
      maxUsers: "25 مستخدم"
    },
    {
      name: "الباقة المتقدمة",
      price: "2,499",
      period: "شهرياً",
      description: "الأمثل للفرق المتوسطة (حتى 100 عضو)",
      features: ["جميع ميزات الباقة الأساسية", "مخططات جانت المتقدمة", "إدارة الموارد", "تقارير متقدمة", "تكامل مع التطبيقات", "تحليلات الأداء"],
      popular: true,
      color: "from-purple-600 to-violet-700",
      maxUsers: "100 مستخدم"
    },
    {
      name: "الباقة المؤسسية",
      price: "حسب الطلب",
      period: "",
      description: "حلول مخصصة للمؤسسات الكبيرة",
      features: ["مستخدمين غير محدودين", "تخصيص كامل", "تكامل متقدم", "دعم مخصص", "تدريب شامل", "استشارات إدارة المشاريع"],
      popular: false,
      color: "from-blue-600 to-indigo-700",
      maxUsers: "غير محدود"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % keyFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO 
        title="نظام إدارة المشاريع | حلول إدارة مشاريع متطورة"
        description="نظام شامل لإدارة المشاريع يشمل التخطيط، تتبع التقدم، إدارة الفرق، التعاون الجماعي وإدارة المخاطر. حلول إدارة مشاريع رقمية متطورة."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden" data-section="0">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-violet-600/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-indigo-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/" className="hover:text-purple-600 transition-colors">الرئيسية</Link>
              <ArrowLeft className="w-4 h-4" />
              <Link to="/enterprise-systems" className="hover:text-purple-600 transition-colors">أنظمة الشركات</Link>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-purple-600 font-medium">إدارة المشاريع</span>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={cn(
                "space-y-8 animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/10 via-violet-600/10 to-blue-600/10 border border-purple-500/20 backdrop-blur-lg shadow-lg">
                  <Target className="w-5 h-5 text-purple-600 animate-pulse" />
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300 font-cairo">
                    إدارة مشاريع ذكية
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight font-cairo">
                    <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                      إدارة المشاريع
                    </span>
                  </h1>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-poppins">
                    Project Management System
                  </p>
                </div>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium font-cairo">
                  منصة متكاملة لتخطيط وتنفيذ ومتابعة المشاريع بكفاءة عالية. من التخطيط الأولي إلى التسليم النهائي، 
                  كل ما تحتاجه لنجاح مشاريعك في مكان واحد.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo">
                    جرب النظام مجاناً
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-cairo">
                    عرض توضيحي
                  </Button>
                </div>
                
                {/* Success Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                  {successMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className={cn("text-2xl font-black mb-2", metric.color)}>{metric.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hero Visual */}
              <div className={cn(
                "relative animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )} style={{ animationDelay: "0.3s" }}>
                <div className="relative bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-700 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">لوحة إدارة المشاريع</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">مراقبة شاملة للمشاريع</div>
                      </div>
                    </div>
                    
                    {/* Project Progress Mockup */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-slate-800 dark:text-white">مشروع التطوير الجديد</div>
                        <div className="text-lg font-bold text-purple-600">73%</div>
                      </div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <div className="font-bold text-emerald-600">24</div>
                          <div className="text-slate-600 dark:text-slate-400">مكتملة</div>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="font-bold text-orange-600">8</div>
                          <div className="text-slate-600 dark:text-slate-400">قيد التنفيذ</div>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="font-bold text-blue-600">3</div>
                          <div className="text-slate-600 dark:text-slate-400">متأخرة</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {projectModules.slice(0, 4).map((module, index) => {
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

        {/* Project Modules */}
        <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-violet-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="1">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                  وحدات إدارة المشاريع
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                مجموعة شاملة من الأدوات المتخصصة لإدارة جميع جوانب المشاريع بكفاءة عالية
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projectModules.map((module, index) => {
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
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium font-poppins">
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
                              <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
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

        {/* Key Features */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-section="2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                  ميزات متقدمة
                </span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={index}
                    className={cn(
                      "text-center group animate-fade-in",
                      visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 font-cairo">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 bg-gradient-to-br from-white via-purple-50/30 to-violet-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="3">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-purple-800 to-violet-900 dark:from-white dark:via-purple-200 dark:to-violet-200 bg-clip-text text-transparent">
                  خطط الأسعار
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                اختر الباقة التي تناسب حجم فريقك ومتطلبات مشاريعك
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden",
                    plan.popular ? "border-purple-500/50 shadow-purple-500/20 scale-105" : "border-slate-200/50 dark:border-slate-700/50",
                    visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-violet-700 text-white text-center py-2 text-sm font-bold">
                      الأكثر شعبية
                    </div>
                  )}
                  
                  <CardContent className={cn("p-8", plan.popular ? "pt-12" : "")}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 font-cairo">
                        {plan.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">
                        {plan.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-6">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">{plan.maxUsers}</span>
                      </div>
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
                          <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={cn(
                        "w-full font-bold py-3 rounded-xl transition-all duration-300",
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white shadow-lg hover:shadow-xl" 
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
        <section className="py-20 bg-gradient-to-br from-purple-600 via-violet-700 to-blue-800 text-white" data-section="4">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className={cn(
              "animate-fade-in",
              visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                ابدأ رحلة إدارة المشاريع الاحترافية
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-medium">
                احصل على استشارة مجانية واكتشف كيف يمكن لنظامنا تحسين كفاءة مشاريعك وزيادة نجاحها
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
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

export default ProjectManagementSystem;