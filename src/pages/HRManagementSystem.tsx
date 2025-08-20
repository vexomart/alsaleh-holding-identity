import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Users, Clock, Award, TrendingUp, Shield, Calendar, FileText, BarChart3, Star, Sparkles, ArrowLeft, ChevronRight, Send, Phone, Mail, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const HRManagementSystem = () => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [activeModule, setActiveModule] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    message: '',
    selectedModules: [] as string[]
  });
  const { toast } = useToast();

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

  const handleModuleToggle = (moduleTitle: string) => {
    setFormData(prev => ({
      ...prev,
      selectedModules: prev.selectedModules.includes(moduleTitle)
        ? prev.selectedModules.filter(m => m !== moduleTitle)
        : [...prev.selectedModules, moduleTitle]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('hr-system-request', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتواصل معك فريقنا خلال 24 ساعة",
      });

      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        employeeCount: '',
        message: '',
        selectedModules: []
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Request Form Section */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="3">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className={cn(
              "text-center mb-16 animate-fade-in",
              visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <h2 className="text-4xl lg:text-6xl font-black mb-6 font-cairo">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  احصل على نظام HR الخاص بك
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">
                املأ النموذج أدناه وسيتواصل معك فريقنا المختص خلال 24 ساعة لتقديم حل مخصص لشركتك
              </p>
            </div>
            
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company and Contact Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        اسم الشركة *
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                        placeholder="اسم شركتك"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-slate-700 dark:text-slate-300 font-bold">
                        اسم الشخص المسؤول *
                      </Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                        placeholder="اسمك الكامل"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Contact Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        البريد الإلكتروني *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-slate-300 dark:border-slate-600 focus:border-blue-500"
                        placeholder="+966 50 123 4567"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Employee Count */}
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount" className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      عدد الموظفين في الشركة
                    </Label>
                    <select
                      id="employeeCount"
                      name="employeeCount"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">اختر العدد</option>
                      <option value="1-10">1-10 موظفين</option>
                      <option value="11-50">11-50 موظف</option>
                      <option value="51-200">51-200 موظف</option>
                      <option value="201-500">201-500 موظف</option>
                      <option value="500+">أكثر من 500 موظف</option>
                    </select>
                  </div>
                  
                  {/* Modules Selection */}
                  <div className="space-y-4">
                    <Label className="text-slate-700 dark:text-slate-300 font-bold">
                      الوحدات المطلوبة (اختياري)
                    </Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {hrModules.map((module) => (
                        <div key={module.id} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`module-${module.id}`}
                            checked={formData.selectedModules.includes(module.title)}
                            onCheckedChange={() => handleModuleToggle(module.title)}
                            className="border-slate-300 dark:border-slate-600"
                          />
                          <Label 
                            htmlFor={`module-${module.id}`} 
                            className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer"
                          >
                            {module.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-bold">
                      رسالة إضافية (اختياري)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="border-slate-300 dark:border-slate-600 focus:border-blue-500 min-h-[100px]"
                      placeholder="أخبرنا المزيد عن احتياجاتك..."
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="text-center pt-6">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-cairo"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                          جارٍ الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال الطلب
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
              
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <div className="flex items-center gap-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-300" />
                  <span>استشارة مجانية خلال 24 ساعة</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-300" />
                  <span>عرض توضيحي مخصص لشركتك</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-300" />
                  <span>حلول مصممة خصيصاً لاحتياجاتك</span>
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

export default HRManagementSystem;