import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Users, Clock, Award, TrendingUp, Shield, Calendar, FileText, BarChart3, Star, Sparkles, ArrowLeft, ChevronRight, Send, Phone, Mail, Building, Zap, Target, Rocket, Globe } from "lucide-react";
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
        
        {/* Hero Section - تصميم جديد مع أنيميشن متقدم */}
        <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" data-section="0">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Orbs */}
            <div className="absolute inset-0">
              <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-[spin_25s_linear_infinite_reverse]"></div>
              <div className="absolute top-40 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-float"></div>
            </div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-grid-pattern animate-pulse"></div>
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 max-w-7xl">
            {/* Animated Breadcrumb */}
            <div className="flex items-center gap-2 mb-16 text-sm text-white/70 animate-fade-in">
              <Link to="/" className="hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg">الرئيسية</Link>
              <ArrowLeft className="w-4 h-4 animate-pulse" />
              <Link to="/enterprise-systems" className="hover:text-white transition-all duration-300 hover:scale-110">أنظمة الشركات</Link>
              <ArrowLeft className="w-4 h-4 animate-pulse" />
              <span className="text-white font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">إدارة الموارد البشرية</span>
            </div>
            
            <div className="text-center space-y-10">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl animate-scale-in">
                <div className="relative">
                  <Users className="w-6 h-6 text-white animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-lg font-black text-white font-cairo">
                  نظام HR متطور
                </span>
                <Star className="w-5 h-5 text-yellow-400 animate-spin" />
                <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
              </div>
              
              {/* Main Title with Stagger Animation */}
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-8xl font-black leading-none font-cairo text-white">
                    <span className="inline-block animate-fade-in">ابدأ</span>
                    <span className="inline-block animate-fade-in delay-200"> رحلة</span>
                    <span className="inline-block animate-fade-in delay-300"> التحول</span>
                    <span className="inline-block animate-fade-in delay-400"> الرقمي</span>
                  </h1>
                  <h2 className="text-6xl lg:text-8xl font-black leading-none font-cairo">
                    <span className="inline-block animate-fade-in delay-500">لقسم </span>
                    <span className="inline-block bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent animate-scale-in delay-700 hover:animate-pulse">
                      HR
                    </span>
                  </h2>
                </div>
                
                <p className="text-2xl lg:text-3xl text-white/95 leading-relaxed font-bold font-cairo max-w-4xl mx-auto animate-fade-in delay-1000">
                  احصل على استشارة مجانية واكتشف كيف يمكن لنظامنا 
                  <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent"> تحسين كفاءة </span>
                  إدارة الموارد البشرية في شركتك
                </p>
              </div>
              
              {/* Animated Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 animate-fade-in delay-1200">
                <div className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">99%</div>
                  <div className="text-sm text-white/80">دقة النظام</div>
                </div>
                <div className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center animate-bounce delay-100">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">50%</div>
                  <div className="text-sm text-white/80">توفير في الوقت</div>
                </div>
                <div className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce delay-200">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">24/7</div>
                  <div className="text-sm text-white/80">دعم فني</div>
                </div>
                <div className="text-center group hover:scale-110 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce delay-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">500+</div>
                  <div className="text-sm text-white/80">شركة راضية</div>
                </div>
              </div>
              
              {/* Enhanced Key Benefits */}
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                <div className="group animate-slide-in-right delay-1400">
                  <div className="flex items-center gap-4 text-white bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:scale-105 hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <CheckCircle className="w-8 h-8 text-green-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-lg mb-1">استشارة مجانية</div>
                      <div className="text-sm opacity-80">خلال 24 ساعة</div>
                    </div>
                  </div>
                </div>
                <div className="group animate-slide-in-right delay-1500">
                  <div className="flex items-center gap-4 text-white bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:scale-105 hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <CheckCircle className="w-8 h-8 text-blue-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping delay-200"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-lg mb-1">عرض توضيحي</div>
                      <div className="text-sm opacity-80">مخصص لشركتك</div>
                    </div>
                  </div>
                </div>
                <div className="group animate-slide-in-right delay-1600">
                  <div className="flex items-center gap-4 text-white bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:scale-105 hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <CheckCircle className="w-8 h-8 text-purple-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping delay-400"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-lg mb-1">حلول مخصصة</div>
                      <div className="text-sm opacity-80">لاحتياجاتك تماماً</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
                <Button 
                  size="lg" 
                  className="group relative bg-gradient-to-r from-white to-gray-100 text-blue-700 hover:from-yellow-100 hover:to-orange-100 font-black px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-cairo text-xl animate-scale-in delay-1800 overflow-hidden"
                  onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">احصل على استشارة مجانية</span>
                  <ArrowRight className="w-6 h-6 mr-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition-opacity duration-300"></div>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group relative border-3 border-white/40 text-white hover:bg-white/20 font-black px-12 py-6 rounded-2xl transition-all duration-500 font-cairo text-xl backdrop-blur-lg animate-scale-in delay-2000 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">شاهد عرض توضيحي</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* HR Modules - تصميم محسن مع أنيميشن متقدم */}
        <section className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden" data-section="1">
          {/* Background Animation Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className={cn(
              "text-center mb-20 animate-fade-in",
              visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 mb-8 animate-scale-in">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300 font-cairo">
                  وحدات متطورة ومتكاملة
                </span>
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-black mb-8 font-cairo leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent animate-scale-in delay-200">
                  وحدات النظام
                </span>
              </h2>
              <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto font-bold leading-relaxed animate-fade-in delay-300">
                مجموعة شاملة من الوحدات المتخصصة لتغطية جميع احتياجات إدارة الموارد البشرية
                <span className="block text-lg mt-2 text-blue-600 dark:text-blue-400 font-medium">
                  مع تقنيات الذكاء الاصطناعي والأتمتة المتقدمة
                </span>
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {hrModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.id} 
                    className={cn(
                      "group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-3xl transition-all duration-700 animate-fade-in overflow-hidden rounded-3xl",
                      "hover:scale-[1.02] hover:-translate-y-2",
                      visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                    
                    <CardHeader className="pb-6 relative z-10">
                      <div className="flex items-start gap-5 mb-6">
                        <div className={cn(
                          "relative w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-r shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110",
                          module.color
                        )}>
                          <IconComponent className="w-10 h-10 text-white group-hover:animate-bounce" />
                          
                          {/* Icon Glow Effect */}
                          <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Floating Particles */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-200"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-500"></div>
                        </div>
                        
                        <div className="flex-1">
                          <CardTitle className="text-2xl font-black text-slate-800 dark:text-white mb-3 font-cairo group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                            {module.title}
                          </CardTitle>
                          <p className="text-base text-blue-600 dark:text-blue-400 font-bold font-poppins uppercase tracking-wide">
                            {module.titleEn}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
                        {module.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-8 relative z-10">
                      <div className="space-y-4">
                        <h4 className="font-black text-slate-800 dark:text-white text-lg font-cairo flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                          الميزات الرئيسية:
                        </h4>
                        <ul className="space-y-3">
                          {module.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 group/item hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                              <div className="relative">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover/item:animate-pulse" />
                                <div className="absolute inset-0 rounded-full bg-emerald-400/20 opacity-0 group-hover/item:opacity-100 animate-ping"></div>
                              </div>
                              <span className="font-medium group-hover/item:font-bold transition-all duration-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-black text-slate-800 dark:text-white text-lg font-cairo flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-500 animate-pulse" />
                          الفوائد:
                        </h4>
                        <ul className="space-y-3">
                          {module.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-slate-600 dark:text-slate-300 group/item hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
                              <div className="relative">
                                <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 group-hover/item:animate-spin" />
                                <div className="absolute inset-0 rounded-full bg-yellow-400/20 opacity-0 group-hover/item:opacity-100 animate-ping"></div>
                              </div>
                              <span className="font-medium group-hover/item:font-bold transition-all duration-300">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Interactive Button */}
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="w-full group/btn border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 rounded-2xl py-3 font-bold"
                        >
                          <span className="group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-colors duration-300">
                            تعرف على المزيد
                          </span>
                          <ChevronRight className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300 group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400" />
                        </Button>
                      </div>
                    </CardContent>
                    
                    {/* Background Pattern */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                      <IconComponent className="w-full h-full" />
                    </div>
                  </Card>
                );
              })}
            </div>
            
            {/* Bottom CTA */}
            <div className="text-center mt-16 animate-fade-in delay-1000">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 font-cairo">
                  هل تريد وحدات مخصصة؟
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">
                  يمكننا تطوير وحدات إضافية تناسب احتياجات شركتك الخاصة
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-cairo text-lg group"
                  onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  تواصل معنا للمزيد
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits - تصميم محسن مع أنيميشن متقدم */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden" data-section="2">
          {/* Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className={cn(
              "text-center mb-20 animate-fade-in",
              visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-700/50 mb-8 animate-scale-in">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-cairo">
                  مميزات استثنائية
                </span>
              </div>
              
              <h2 className="text-5xl lg:text-7xl font-black mb-8 font-cairo leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent animate-scale-in delay-200">
                  لماذا تختار نظامنا؟
                </span>
              </h2>
              <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto font-bold leading-relaxed animate-fade-in delay-300">
                نحن نقدم أكثر من مجرد نظام HR - نحن نقدم شريكاً استراتيجياً لنجاح شركتك
                <span className="block text-lg mt-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  مع ضمانات الأمان والجودة والدعم المستمر
                </span>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div 
                    key={index}
                    className={cn(
                      "group text-center animate-fade-in hover:scale-105 transition-all duration-500",
                      visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative mb-8">
                      {/* Main Icon Container */}
                      <div className="relative w-24 h-24 mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                        <IconComponent className="w-12 h-12 text-white group-hover:animate-bounce" />
                        
                        {/* Icon Glow Effect */}
                        <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-100"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-300"></div>
                      
                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-700/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 font-cairo group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {benefit.description}
                    </p>
                    
                    {/* Hover underline effect */}
                    <div className="w-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 mx-auto mt-4 group-hover:w-16 transition-all duration-500 rounded-full"></div>
                  </div>
                );
              })}
            </div>
            
            {/* Bottom Stats */}
            <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200/50 dark:border-blue-700/50 animate-fade-in delay-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-blue-700 dark:text-blue-300 mb-2">500+</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">شركة راضية</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mb-2">99.9%</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">وقت التشغيل</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">24/7</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">دعم فني</div>
                </div>
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2">50%</div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">توفير في التكلفة</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Request Form Section */}
        <section id="order-form" className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" data-section="3">
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