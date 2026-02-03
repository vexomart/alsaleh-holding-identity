import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Settings,
  Headphones,
  CheckCircle,
  Star,
  Calendar,
  Award,
  Globe,
  Target,
  Heart,
  Zap,
  ArrowRight,
  Download,
  Briefcase,
  GraduationCap,
  Building,
  Sparkles,
  Rocket,
  Coffee,
  Laptop
} from "lucide-react";

const CareersPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    education: '',
    skills: '',
    motivation: '',
    cv: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { toast } = await import('sonner');
      
      const { error } = await supabase.functions.invoke('job-application', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          experience: formData.experience,
          education: formData.education,
          skills: formData.skills,
          motivation: formData.motivation,
          source: 'careers-page'
        }
      });

      if (error) throw error;
      
      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        education: '',
        skills: '',
        motivation: '',
        cv: null
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      const { toast } = await import('sonner');
      toast.error('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "راتب تنافسي",
      description: "رواتب ومكافآت تنافسية في السوق",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "نمو مهني",
      description: "فرص تطوير وتدريب مستمرة",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "تأمين صحي",
      description: "تأمين صحي شامل لك ولعائلتك",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Clock,
      title: "مرونة في العمل",
      description: "ساعات عمل مرنة وبيئة إيجابية",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Award,
      title: "مكافآت الأداء",
      description: "نظام مكافآت قائم على الأداء",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "فريق متميز",
      description: "العمل مع فريق محترف ومتعاون",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const cultureValues = [
    {
      icon: Target,
      title: "التميز",
      description: "نسعى للتميز في كل ما نقوم به",
      color: "from-blue-600 to-indigo-700"
    },
    {
      icon: Heart,
      title: "الاهتمام بالعملاء",
      description: "العميل في المقدمة دائماً",
      color: "from-pink-600 to-rose-700"
    },
    {
      icon: Zap,
      title: "الابتكار",
      description: "نبتكر حلولاً جديدة ومبدعة",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Users,
      title: "العمل الجماعي",
      description: "قوة الفريق تحقق النجاح",
      color: "from-green-600 to-emerald-700"
    }
  ];

  const jobPositions = [
    {
      title: "مندوب مبيعات",
      department: "المبيعات",
      type: "دوام كامل",
      location: "الرياض",
      salary: "5,000 - 8,000 ريال",
      requirements: ["خبرة في المبيعات", "مهارات تواصل ممتازة", "رخصة قيادة سارية"],
      icon: Users,
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "فني صيانة",
      department: "الصيانة التقنية",
      type: "دوام كامل",
      location: "جدة",
      salary: "4,500 - 7,000 ريال",
      requirements: ["خبرة في صيانة السيارات", "شهادة فني معتمد", "القدرة على العمل بفريق"],
      icon: Settings,
      color: "from-green-600 to-blue-600"
    },
    {
      title: "موظف خدمة عملاء",
      department: "خدمة العملاء",
      type: "دوام كامل",
      location: "الدمام",
      salary: "3,500 - 6,000 ريال",
      requirements: ["إتقان اللغة العربية والإنجليزية", "مهارات حل المشاكل", "خبرة في خدمة العملاء"],
      icon: Headphones,
      color: "from-purple-600 to-pink-600"
    }
  ];

  const upcomingPositions = [
    {
      title: "مطور تطبيقات الجوال",
      department: "تقنية المعلومات",
      type: "دوام كامل",
      location: "الرياض",
      icon: Laptop
    },
    {
      title: "مدير التسويق الرقمي",
      department: "التسويق",
      type: "دوام كامل",
      location: "جدة",
      icon: TrendingUp
    },
    {
      title: "محاسب قانوني",
      department: "المالية",
      type: "دوام كامل",
      location: "الدمام",
      icon: DollarSign
    },
    {
      title: "مصمم جرافيك",
      department: "التصميم",
      type: "دوام جزئي",
      location: "عن بُعد",
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* خلفية متحركة */}
      <div className="fixed inset-0 overflow-hidden">
        {/* شبكة متحركة */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        
        {/* دوائر متحركة */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* جزيئات متحركة */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* المحتوى */}
      <div className="relative z-10">
        {/* شريط التحذير */}
        <div className="bg-yellow-400 text-black py-2 text-center text-sm font-medium relative z-50">
          <div className="container mx-auto px-4">
            ⚠️ هذا موقع تجريبي فقط - جميع المعلومات والأسعار غير صحيحة ولأغراض العرض فقط
          </div>
        </div>

        {/* الهيدر المحسن */}
        <div className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-sm font-medium">نحن نوظف الآن</span>
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                انضم إلى فريقنا المتميز
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                كن جزءاً من شركة رائدة في مجال تأجير السيارات وساهم في تشكيل مستقبل النقل في المملكة العربية السعودية
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-2xl hover:scale-105 transition-all duration-300 border-0"
                  onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Rocket className="w-6 h-6 ml-2" />
                  ابدأ رحلتك معنا
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-6 hover:scale-105 transition-all duration-300"
                >
                  <Coffee className="w-6 h-6 ml-2" />
                  تعرف على ثقافتنا
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* الوظائف المتاحة */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-blue-500/30">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">فرص مثيرة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                الوظائف المتاحة الآن
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                اختر الوظيفة التي تناسب مهاراتك وطموحاتك
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {jobPositions.map((job, index) => (
                <Card key={index} className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${job.color}`} />
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-r ${job.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <job.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{job.title}</h3>
                        <p className="text-blue-300 text-sm">{job.department}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">{job.salary}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3">المتطلبات:</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${job.color} hover:scale-105 transition-all duration-300 border-0 shadow-lg`}
                      asChild
                    >
                      <a href="/car-rental/careers#application">
                        <ArrowRight className="w-5 h-5 ml-2" />
                        تقدم الآن
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* فورم التقديم المحسن */}
        <section id="application" className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-purple-500/30">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">ابدأ التقديم</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                تقدم للوظيفة الآن
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-blue-500/10 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3 text-white">
                    <Briefcase className="w-8 h-8" />
                    نموذج التقديم للوظيفة
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* المعلومات الشخصية */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-400" />
                          الاسم الكامل *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-400" />
                          البريد الإلكتروني *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-400" />
                          رقم الهاتف *
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+966 50 123 4567"
                          required
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-blue-400" />
                          الوظيفة المرغوبة *
                        </label>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          required
                          className="h-12 w-full rounded-md px-3 bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        >
                          <option value="" className="bg-slate-800">اختر الوظيفة</option>
                          <option value="sales" className="bg-slate-800">مندوب مبيعات</option>
                          <option value="maintenance" className="bg-slate-800">فني صيانة</option>
                          <option value="customer-service" className="bg-slate-800">خدمة عملاء</option>
                          <option value="driver" className="bg-slate-800">سائق</option>
                          <option value="manager" className="bg-slate-800">مدير فرع</option>
                          <option value="other" className="bg-slate-800">أخرى</option>
                        </select>
                      </div>
                    </div>

                    {/* التعليم والخبرة */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-400" />
                          المؤهل التعليمي
                        </label>
                        <Input
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          placeholder="بكالوريوس، دبلوم، ثانوية عامة..."
                          className="h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-400" />
                          سنوات الخبرة
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="h-12 w-full rounded-md px-3 bg-white/10 border border-white/20 text-white focus:border-blue-400 focus:bg-white/15 transition-all duration-300"
                        >
                          <option value="" className="bg-slate-800">اختر سنوات الخبرة</option>
                          <option value="0-1" className="bg-slate-800">أقل من سنة</option>
                          <option value="1-3" className="bg-slate-800">1-3 سنوات</option>
                          <option value="3-5" className="bg-slate-800">3-5 سنوات</option>
                          <option value="5-10" className="bg-slate-800">5-10 سنوات</option>
                          <option value="10+" className="bg-slate-800">أكثر من 10 سنوات</option>
                        </select>
                      </div>
                    </div>

                    {/* المهارات */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <Star className="w-4 h-4 text-blue-400" />
                        المهارات الرئيسية
                      </label>
                      <Textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="اذكر أهم مهاراتك المتعلقة بالوظيفة..."
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* الدافع */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-400" />
                        لماذا تريد العمل معنا؟
                      </label>
                      <Textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        placeholder="أخبرنا عن دافعك للانضمام إلى فريقنا..."
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* رفع السيرة الذاتية */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-400" />
                        السيرة الذاتية (PDF)
                      </label>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-white/5 transition-all duration-300 group">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="cv-upload"
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4 transition-colors" />
                          <p className="text-gray-300 mb-2 font-medium">اضغط لرفع السيرة الذاتية</p>
                          <p className="text-sm text-gray-400">PDF, DOC, DOCX (حد أقصى 5 ميجابايت)</p>
                        </label>
                        {formData.cv && (
                          <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                            <p className="text-sm text-green-300 flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              تم رفع الملف: {formData.cv.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* زر الإرسال */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/25 border-0"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          جاري الإرسال...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Rocket className="w-6 h-6" />
                          إرسال الطلب
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* مزايا العمل معنا المحسنة */}
        <section id="benefits" className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-green-500/30">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-300">مزايا استثنائية</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                مزايا العمل معنا
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                نوفر بيئة عمل متميزة ومزايا استثنائية لفريقنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`w-20 h-20 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{benefit.title}</h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ثقافة الشركة المحسنة */}
        <section id="culture" className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-orange-500/30">
                <Heart className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-medium text-orange-300">قيمنا ومبادئنا</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ثقافة شركتنا
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                قيمنا ومبادئنا التي توجه عملنا اليومي وتشكل هويتنا
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cultureValues.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-28 h-28 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <value.icon className="w-14 h-14 text-white relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* الوظائف القادمة المحسنة */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-yellow-500/30">
                <Rocket className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">فرص قادمة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                وظائف قادمة قريباً
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                ترقب المزيد من الفرص الوظيفية المثيرة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingPositions.map((position, index) => (
                <Card key={index} className="group bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden relative">
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-black px-4 py-2 text-sm font-bold rounded-bl-lg">
                    قريباً
                  </div>
                  <CardContent className="p-6 pt-12">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <position.icon className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{position.title}</h3>
                    <div className="space-y-2 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {position.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 transition-colors">
                      إشعرني عند التوفر
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* دعوة للعمل المحسنة */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                ابدأ مسيرتك المهنية معنا
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                انضم إلى فريق متميز في شركة رائدة واصنع مستقبلك المهني
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6 shadow-2xl hover:scale-105 transition-all duration-300 border-0"
                  onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Briefcase className="w-6 h-6 ml-2" />
                  تقدم الآن
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-12 py-6 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-6 h-6 ml-2" />
                  تحميل دليل الموظف
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* الفوتر المحسن */}
        <footer className="bg-slate-900/50 backdrop-blur-xl border-t border-white/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">كار رنت برو</h3>
                <p className="text-sm text-gray-400">فرص التوظيف</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              نحن دائماً نبحث عن المواهب المتميزة للانضمام إلى فريقنا
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href="/car-rental">العودة لموقع تأجير السيارات</a>
              </Button>
              <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                <Mail className="w-4 h-4 ml-2" />
                careers@carrentpro.sa
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CareersPage;