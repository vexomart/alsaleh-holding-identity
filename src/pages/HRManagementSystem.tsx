import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Users, Clock, Award, TrendingUp, Shield, Calendar, FileText, BarChart3, Star, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const HRManagementSystem = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [activeModule, setActiveModule] = useState(0);

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

  const hrModules = [
    {
      id: 1,
      title: "إدارة بيانات الموظفين",
      titleEn: "Employee Data Management",
      description: "نظام شامل لإدارة جميع بيانات الموظفين الشخصية والوظيفية",
      icon: Users,
      color: "from-blue-600 to-indigo-700",
      features: ["الملفات الشخصية الشاملة", "تتبع المؤهلات والشهادات", "إدارة العقود", "تاريخ العمل والترقيات", "إدارة الوثائق"],
      benefits: ["سهولة الوصول للمعلومات", "تحديث فوري للبيانات", "أمان عالي للمعلومات", "تقارير تفصيلية"]
    },
    {
      id: 2,
      title: "نظام الرواتب والمكافآت",
      titleEn: "Payroll & Compensation",
      description: "حلول متطورة لإدارة الرواتب، المكافآت، والحوافز بدقة وشفافية",
      icon: Award,
      color: "from-emerald-600 to-teal-700",
      features: ["حساب الرواتب الآلي", "إدارة المكافآت والحوافز", "التكامل مع البنوك", "تقارير الرواتب", "إدارة القروض والسلف"],
      benefits: ["دقة في الحسابات", "توفير الوقت", "شفافية كاملة", "امتثال للقوانين"]
    },
    {
      id: 3,
      title: "تتبع الحضور والغياب",
      titleEn: "Attendance Tracking",
      description: "نظام ذكي لمراقبة حضور الموظفين وإدارة أوقات العمل",
      icon: Clock,
      color: "from-purple-600 to-violet-700",
      features: ["بصمة إلكترونية", "تتبع GPS للعمل الميداني", "إدارة الورديات", "تقارير الحضور", "تنبيهات الغياب"],
      benefits: ["دقة في تسجيل الحضور", "تقليل الغش", "تحليل أنماط الحضور", "تحسين الإنتاجية"]
    },
    {
      id: 4,
      title: "إدارة الإجازات",
      titleEn: "Leave Management",
      description: "منصة متكاملة لإدارة طلبات الإجازات والموافقات الإلكترونية",
      icon: Calendar,
      color: "from-orange-600 to-red-700",
      features: ["طلبات الإجازة الإلكترونية", "نظام الموافقات المتدرجة", "تتبع رصيد الإجازات", "التقويم التفاعلي", "تقارير الإجازات"],
      benefits: ["تبسيط العمليات", "تتبع دقيق للرصيد", "شفافية في القرارات", "تقليل الأعمال الورقية"]
    },
    {
      id: 5,
      title: "تقييم الأداء",
      titleEn: "Performance Evaluation",
      description: "نظام شامل لتقييم أداء الموظفين وتطوير قدراتهم",
      icon: TrendingUp,
      color: "from-cyan-600 to-blue-700",
      features: ["نماذج تقييم متنوعة", "تقييم 360 درجة", "تحديد الأهداف", "تتبع التطور", "تقارير الأداء"],
      benefits: ["تحسين الأداء", "تحفيز الموظفين", "تحديد الاحتياجات التدريبية", "اتخاذ قرارات مدروسة"]
    },
    {
      id: 6,
      title: "التدريب والتطوير",
      titleEn: "Training & Development",
      description: "منصة تعليمية متطورة لتطوير مهارات الموظفين",
      icon: FileText,
      color: "from-red-600 to-pink-700",
      features: ["مكتبة المحتوى التدريبي", "التدريب الإلكتروني", "تتبع التقدم", "شهادات إنجاز", "تقييم فعالية التدريب"],
      benefits: ["تطوير مستمر للمهارات", "مرونة في التعلم", "تقليل التكاليف", "قياس العائد على الاستثمار"]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "أمان عالي المستوى",
      description: "حماية متقدمة لبيانات الموظفين مع التشفير والنسخ الاحتياطي"
    },
    {
      icon: BarChart3,
      title: "تقارير تحليلية شاملة",
      description: "رؤى عميقة ومؤشرات أداء لاتخاذ قرارات استراتيجية مدروسة"
    },
    {
      icon: TrendingUp,
      title: "تحسين الإنتاجية",
      description: "أتمتة العمليات وتبسيط المهام لزيادة كفاءة قسم الموارد البشرية"
    },
    {
      icon: Users,
      title: "تجربة موظف متميزة",
      description: "واجهات سهلة الاستخدام وخدمات ذاتية شاملة للموظفين"
    }
  ];

  const pricingPlans = [
    {
      name: "الباقة الأساسية",
      price: "1,499",
      period: "شهرياً",
      description: "مناسبة للشركات الصغيرة (حتى 50 موظف)",
      features: ["إدارة بيانات الموظفين", "نظام الحضور والغياب", "إدارة الإجازات الأساسية", "تقارير أساسية", "دعم فني"],
      popular: false,
      color: "from-gray-600 to-gray-700"
    },
    {
      name: "الباقة المتقدمة",
      price: "2,999",
      period: "شهرياً",
      description: "الأمثل للشركات المتوسطة (حتى 200 موظف)",
      features: ["جميع ميزات الباقة الأساسية", "نظام الرواتب الكامل", "تقييم الأداء", "التدريب الإلكتروني", "تقارير متقدمة", "تكامل مع البنوك"],
      popular: true,
      color: "from-blue-600 to-indigo-700"
    },
    {
      name: "الباقة المؤسسية",
      price: "حسب الطلب",
      period: "",
      description: "حلول مخصصة للمؤسسات الكبيرة",
      features: ["موظفين غير محدودين", "تخصيص كامل", "تكامل مع الأنظمة الأخرى", "دعم مخصص", "تدريب شامل", "استشارات HR"],
      popular: false,
      color: "from-purple-600 to-violet-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % hrModules.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO 
        title="نظام إدارة الموارد البشرية | حلول HR متطورة"
        description="نظام شامل لإدارة الموارد البشرية يشمل إدارة الموظفين، الرواتب، الحضور، الإجازات، تقييم الأداء والتدريب. حلول HR رقمية متطورة."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden" data-section="0">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-500/15 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <ArrowLeft className="w-4 h-4" />
              <Link to="/enterprise-systems" className="hover:text-blue-600 transition-colors">أنظمة الشركات</Link>
              <ArrowLeft className="w-4 h-4" />
              <span className="text-blue-600 font-medium">إدارة الموارد البشرية</span>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={cn(
                "space-y-8 animate-fade-in",
                visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}>
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-lg shadow-lg">
                  <Users className="w-5 h-5 text-blue-600 animate-pulse" />
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300 font-cairo">
                    نظام HR متطور
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-black leading-tight font-cairo">
                    <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                      إدارة الموارد البشرية
                    </span>
                  </h1>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                    Human Resources Management System
                  </p>
                </div>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium font-cairo">
                  نظام شامل ومتطور لإدارة جميع جوانب الموارد البشرية في شركتك. من إدارة بيانات الموظفين إلى الرواتب والتطوير، 
                  كل ما تحتاجه في منصة واحدة متكاملة.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo">
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
                <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-800 dark:text-white">لوحة HR الرئيسية</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">إدارة شاملة للموظفين</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {hrModules.slice(0, 4).map((module, index) => {
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
                            <div className="text-xs text-slate-600 dark:text-slate-400">{module.titleEn}</div>
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

        {/* HR Modules */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="1">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  وحدات النظام
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                مجموعة شاملة من الوحدات المتخصصة لتغطية جميع احتياجات إدارة الموارد البشرية
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {hrModules.map((module, index) => {
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
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium font-poppins">
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
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-section="2">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  لماذا تختار نظامنا؟
                </span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
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
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
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

        {/* Pricing */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="3">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  خطط الأسعار
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                اختر الباقة التي تناسب حجم شركتك واحتياجاتك
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card 
                  key={index}
                  className={cn(
                    "relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border shadow-lg hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden",
                    plan.popular ? "border-blue-500/50 shadow-blue-500/20 scale-105" : "border-slate-200/50 dark:border-slate-700/50",
                    visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-2 text-sm font-bold">
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
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl" 
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
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white" data-section="4">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className={cn(
              "animate-fade-in",
              visibleSections.has(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                ابدأ رحلة التحول الرقمي لقسم HR
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-medium">
                احصل على استشارة مجانية واكتشف كيف يمكن لنظامنا تحسين كفاءة إدارة الموارد البشرية في شركتك
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
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

export default HRManagementSystem;