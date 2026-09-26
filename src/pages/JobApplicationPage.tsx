import Footer from "@/components/Footer";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Briefcase, 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle,
  Upload,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Star,
  Award,
  Shield,
  Globe,
  TrendingUp,
  Heart,
  Coffee,
  Laptop,
  Zap,
  Target,
  Lightbulb,
  MessageCircle,
  AlertCircle,
  Timer,
  Handshake,
  Rocket,
  Code,
  Palette,
  BarChart3,
  HeadphonesIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const JobApplicationPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    experience: "",
    education: "",
    coverLetter: "",
    portfolio: "",
    linkedIn: ""
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Using Sonner toast for better notifications

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("نوع ملف غير مدعوم ❌", {
          description: "يرجى رفع ملف PDF أو Word فقط",
          duration: 10000
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الملف كبير ❌", {
          description: "يرجى رفع ملف أقل من 5 ميجابايت",
          duration: 10000
        });
        return;
      }
      
      setCvFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
      toast.error("خطأ في البيانات ❌", {
        description: "يرجى ملء جميع الحقول المطلوبة",
        duration: 10000
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error("خطأ في البريد الإلكتروني ❌", {
        description: "يرجى إدخال بريد إلكتروني صحيح",
        duration: 10000
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let cvUrl = null;
      let cvFileName = null;

      // Upload CV file if provided
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, cvFile);

        if (uploadError) {
          throw new Error(`خطأ في رفع الملف: ${uploadError.message}`);
        }

        cvUrl = fileName;
        cvFileName = cvFile.name;
      }

      // Generate job application number
      const jobNumber = `JOB-${Date.now().toString().slice(-6)}`;

      // Send to edge function
      const { error } = await supabase.functions.invoke('job-application', {
        body: {
          ...formData,
          cvUrl,
          cvFileName,
          jobNumber,
          message: formData.coverLetter,
          hrEmail: "info@ash-holding.sa"
        }
      });

      if (error) throw error;

      toast.success("تم إرسال طلب التوظيف بنجاح! ✅", {
        description: `رقم الطلب: ${jobNumber} - سيتم التواصل معك خلال 10 أيام عمل 📧`,
        duration: 10000,
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        position: "",
        experience: "",
        education: "",
        coverLetter: "",
        portfolio: "",
        linkedIn: ""
      });
      setCvFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('cv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Job application error:", error);
      toast.error("خطأ في إرسال الطلب ❌", {
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        duration: 10000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    { 
      id: "JOB001", 
      title: "مطور ويب متقدم", 
      type: "دوام كامل", 
      location: "عن بُعد",
      icon: Code,
      requirements: ["خبرة 3+ سنوات", "React/Next.js", "Node.js", "قواعد البيانات"],
      benefits: ["تأمين طبي", "إجازات مرنة", "تدريب مستمر"]
    },
    { 
      id: "JOB002", 
      title: "مطور تطبيقات محمولة", 
      type: "دوام كامل", 
      location: "عن بُعد",
      icon: Laptop,
      requirements: ["خبرة 2+ سنوات", "React Native/Flutter", "iOS/Android", "API Integration"],
      benefits: ["تأمين طبي", "مكافآت أداء", "دورات تطوير"]
    },
    { 
      id: "JOB003", 
      title: "مصمم UI/UX", 
      type: "دوام جزئي", 
      location: "عن بُعد",
      icon: Palette,
      requirements: ["خبرة 2+ سنوات", "Figma/Adobe XD", "تصميم متجاوب", "User Research"],
      benefits: ["مرونة في العمل", "أدوات التصميم", "ورش عمل"]
    },
    { 
      id: "JOB004", 
      title: "أخصائي تسويق رقمي", 
      type: "دوام كامل", 
      location: "الرياض/عن بُعد",
      icon: BarChart3,
      requirements: ["خبرة 2+ سنوات", "Google Ads", "Social Media", "SEO/SEM"],
      benefits: ["عمولات تسويقية", "برامج تدريبية", "حوافز الأداء"]
    },
    { 
      id: "JOB005", 
      title: "أخصائي دعم فني", 
      type: "دوام كامل", 
      location: "الرياض",
      icon: HeadphonesIcon,
      requirements: ["خبرة سنة واحدة", "مهارات تواصل", "حل المشكلات", "صبر ومرونة"],
      benefits: ["تدريب شامل", "بيئة داعمة", "فرص ترقية"]
    }
  ];

  const applicationProcess = [
    {
      step: 1,
      title: "إرسال الطلب",
      description: "املأ النموذج وأرفق سيرتك الذاتية",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      step: 2,
      title: "مراجعة أولية",
      description: "سيتم مراجعة طلبك خلال 3 أيام عمل",
      icon: Users,
      color: "bg-yellow-500"
    },
    {
      step: 3,
      title: "المقابلة الأولى",
      description: "مقابلة تقنية عبر الهاتف أو الفيديو",
      icon: Phone,
      color: "bg-purple-500"
    },
    {
      step: 4,
      title: "المقابلة النهائية",
      description: "مقابلة شخصية مع فريق الإدارة",
      icon: Handshake,
      color: "bg-green-500"
    },
    {
      step: 5,
      title: "القرار النهائي",
      description: "ستحصل على الرد خلال 10 أيام عمل",
      icon: CheckCircle,
      color: "bg-emerald-500"
    }
  ];

  const companyBenefits = [
    { icon: Globe, title: "عمل عن بُعد", description: "مرونة كاملة في اختيار مكان العمل" },
    { icon: TrendingUp, title: "نمو مهني سريع", description: "فرص ترقية وتطوير مستمرة" },
    { icon: Heart, title: "بيئة عمل صحية", description: "فريق داعم وبيئة عمل إيجابية" },
    { icon: Coffee, title: "ساعات مرنة", description: "توازن مثالي بين العمل والحياة" },
    { icon: Award, title: "تدريب مستمر", description: "دورات ومؤتمرات تطوير مهني" },
    { icon: Shield, title: "استقرار وظيفي", description: "عقود عمل ثابتة مع ضمانات اجتماعية" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="انضم إلى فريق العمل"
        description="كن جزءاً من رحلتنا في تشكيل مستقبل التكنولوجيا"
        showBackButton={true}
        backButtonFallback="/"
        className="py-12 md:py-16"
      />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 space-y-16 md:space-y-20">
        
        {/* Company Benefits */}
        <section className="animate-fade-in">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">لماذا تنضم إلينا؟</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              نوفر بيئة عمل مثالية تجمع بين التطور المهني والاستقرار الوظيفي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {companyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/20 group">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-r from-primary to-primary/80 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Available Positions */}
        <section className="animate-fade-in">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الوظائف المتاحة</h2>
            <p className="text-lg md:text-xl text-muted-foreground px-4">اختر الوظيفة التي تناسب خبراتك ومهاراتك</p>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-amber-800 font-medium">💼 الراتب والمزايا المالية سيتم توضيحها بعد اجتياز المقابلة بنجاح</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {positions.map((position) => {
              const IconComponent = position.icon;
              return (
                <Card key={position.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-accent/5 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl text-foreground mb-2">{position.title}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-3">
                          {position.id}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        المتطلبات:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {position.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-primary/20 hover:bg-primary/10 transition-colors">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-500" />
                        المزايا:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {position.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Application Process */}
        <section className="animate-fade-in">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">عملية التوظيف</h2>
            <p className="text-lg md:text-xl text-muted-foreground px-4">خطوات واضحة ومحددة للوصول إلى فريق العمل</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Connection Line - Hidden on mobile */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-primary/30 hidden lg:block"></div>
            
            <div className="space-y-6 md:space-y-8">
              {applicationProcess.map((process, index) => (
                <div key={process.step} className={`flex flex-col lg:flex-row items-center gap-6 md:gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 w-full">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/10 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`${process.color} rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg`}>
                            {process.step}
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{process.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="hidden lg:block">
                    <div className={`${process.color} rounded-full w-16 h-16 flex items-center justify-center relative z-10`}>
                      <process.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 lg:block hidden"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="animate-fade-in">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mx-4 md:mx-0">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">معلومات مهمة للمتقدمين</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 text-blue-800">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">سيتم التواصل معك خلال <strong>10 أيام عمل</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">فريق الموارد البشرية سيتولى المتابعة</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">المقابلة الشخصية ستكون بعد المقابلة التقنية</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm md:text-base">جميع التحديثات ستصلك عبر البريد الإلكتروني</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Application Form */}
        <section className="animate-fade-in">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-card to-accent/5 mx-4 md:mx-auto">
            <CardHeader className="text-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg p-6 md:p-8">
              <CardTitle className="text-2xl md:text-3xl font-bold flex flex-col md:flex-row items-center justify-center gap-3">
                <FileText className="w-8 h-8" />
                نموذج طلب التوظيف
              </CardTitle>
              <p className="text-primary-foreground/90 mt-3 text-sm md:text-base leading-relaxed">
                املأ البيانات بدقة وسيتم التواصل معك من قبل فريق الموارد البشرية خلال 10 أيام عمل
              </p>
            </CardHeader>
            
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                
                {/* Personal Information */}
                <div className="bg-muted/30 rounded-lg p-4 md:p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    البيانات الشخصية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground font-medium">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground font-medium">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="05xxxxxxxx"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-foreground font-medium">المدينة</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="مدينة الإقامة"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-muted/30 rounded-lg p-4 md:p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    البيانات المهنية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-foreground font-medium">الوظيفة المطلوبة *</Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger className="border-border focus:border-primary h-11">
                          <SelectValue placeholder="اختر الوظيفة" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.title}>
                              {pos.title} - {pos.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-foreground font-medium">سنوات الخبرة</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="border-border focus:border-primary h-11">
                          <SelectValue placeholder="اختر سنوات الخبرة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fresh">خريج جديد</SelectItem>
                          <SelectItem value="1-2">1-2 سنة</SelectItem>
                          <SelectItem value="3-5">3-5 سنوات</SelectItem>
                          <SelectItem value="6-10">6-10 سنوات</SelectItem>
                          <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-foreground font-medium">المؤهل العلمي</Label>
                      <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                        <SelectTrigger className="border-border focus:border-primary h-11">
                          <SelectValue placeholder="اختر المؤهل العلمي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">ثانوي</SelectItem>
                          <SelectItem value="diploma">دبلوم</SelectItem>
                          <SelectItem value="bachelor">بكالوريوس</SelectItem>
                          <SelectItem value="master">ماجستير</SelectItem>
                          <SelectItem value="phd">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedIn" className="text-foreground font-medium">LinkedIn Profile</Label>
                      <Input
                        id="linkedIn"
                        type="url"
                        value={formData.linkedIn}
                        onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="bg-muted/30 rounded-lg p-4 md:p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    رفع السيرة الذاتية والمرفقات
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cv-file" className="text-foreground font-medium">السيرة الذاتية (PDF أو Word)</Label>
                      <Input
                        id="cv-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="border-border focus:border-primary h-11"
                      />
                      {cvFile && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          تم اختيار الملف: {cvFile.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolio" className="text-foreground font-medium">رابط أعمالك (Portfolio)</Label>
                      <Input
                        id="portfolio"
                        type="url"
                        value={formData.portfolio}
                        onChange={(e) => handleInputChange("portfolio", e.target.value)}
                        className="border-border focus:border-primary h-11"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="bg-muted/30 rounded-lg p-4 md:p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-4 md:mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    خطاب التغطية
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-foreground font-medium">اكتب رسالة تعريفية موجزة عن نفسك</Label>
                    <Textarea
                      id="coverLetter"
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                      className="border-border focus:border-primary min-h-[120px]"
                      placeholder="أخبرنا عن نفسك وعن أهدافك المهنية وسبب رغبتك في الانضمام إلى فريق العمل..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4 md:pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 md:px-12 py-3 md:py-4 text-base md:text-lg font-semibold w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 ml-2" />
                        إرسال طلب التوظيف
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default JobApplicationPage;