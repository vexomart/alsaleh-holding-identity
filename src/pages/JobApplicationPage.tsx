import Navigation from "@/components/Navigation";
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
import { useToast } from "@/hooks/use-toast";
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
  DollarSign,
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
  Handshake
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
  const { toast } = useToast();

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
        toast({
          title: "نوع ملف غير مدعوم",
          description: "يرجى رفع ملف PDF أو Word فقط",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "حجم الملف كبير",
          description: "يرجى رفع ملف أقل من 5 ميجابايت",
          variant: "destructive"
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
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "خطأ في البريد الإلكتروني",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive"
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

      // Send to edge function with HR email
      const response = await fetch(
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/job-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            cvUrl,
            cvFileName,
            jobNumber,
            message: formData.coverLetter,
            hrEmail: "hr@masteredupath.com" // Official HR email
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "تم إرسال الطلب بنجاح!",
          description: `رقم الطلب: ${jobNumber} - سيتم التواصل معك خلال 10 أيام عمل`,
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
        
      } else {
        throw new Error(result.error || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch (error) {
      console.error("Job application error:", error);
      toast({
        title: "خطأ في إرسال الطلب",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
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
      salary: "8,000 - 15,000 ريال",
      commission: "عمولة تسويقية 5%",
      requirements: ["خبرة 3+ سنوات", "React/Next.js", "Node.js", "قواعد البيانات"],
      benefits: ["تأمين طبي", "إجازات مرنة", "تدريب مستمر"]
    },
    { 
      id: "JOB002", 
      title: "مطور تطبيقات محمولة", 
      type: "دوام كامل", 
      location: "عن بُعد",
      salary: "9,000 - 16,000 ريال",
      commission: "عمولة تسويقية 7%",
      requirements: ["خبرة 2+ سنوات", "React Native/Flutter", "iOS/Android", "API Integration"],
      benefits: ["تأمين طبي", "مكافآت أداء", "دورات تطوير"]
    },
    { 
      id: "JOB003", 
      title: "مصمم UI/UX", 
      type: "دوام جزئي", 
      location: "عن بُعد",
      salary: "5,000 - 10,000 ريال",
      commission: "عمولة تسويقية 4%",
      requirements: ["خبرة 2+ سنوات", "Figma/Adobe XD", "تصميم متجاوب", "User Research"],
      benefits: ["مرونة في العمل", "أدوات التصميم", "ورش عمل"]
    },
    { 
      id: "JOB004", 
      title: "أخصائي تسويق رقمي", 
      type: "دوام كامل", 
      location: "الرياض/عن بُعد",
      salary: "6,000 - 12,000 ريال",
      commission: "عمولة تسويقية 10%",
      requirements: ["خبرة 2+ سنوات", "Google Ads", "Social Media", "SEO/SEM"],
      benefits: ["عمولات عالية", "برامج تدريبية", "سيارة شركة"]
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
    { icon: DollarSign, title: "راتب تنافسي", description: "رواتب متميزة مع عمولات تسويقية مجزية" },
    { icon: TrendingUp, title: "نمو مهني سريع", description: "فرص ترقية وتطوير مستمرة" },
    { icon: Heart, title: "بيئة عمل صحية", description: "فريق داعم وبيئة عمل إيجابية" },
    { icon: Coffee, title: "ساعات مرنة", description: "توازن مثالي بين العمل والحياة" },
    { icon: Award, title: "تدريب مستمر", description: "دورات ومؤتمرات تطوير مهني" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <PageHeader 
        title="انضم إلى فريق العمل"
        description="كن جزءاً من رحلتنا في تشكيل مستقبل التكنولوجيا"
        showBackButton={true}
        backButtonFallback="/"
      />

      <div className="container mx-auto px-6 py-16 space-y-20">
        
        {/* Company Benefits */}
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">لماذا تنضم إلينا؟</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نوفر بيئة عمل مثالية تجمع بين التطور المهني والاستقرار المالي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg w-12 h-12 flex items-center justify-center ml-4">
                        <IconComponent className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Available Positions */}
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">الوظائف المتاحة</h2>
            <p className="text-xl text-muted-foreground">اختر الوظيفة التي تناسب خبراتك ومهاراتك</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {positions.map((position) => (
              <Card key={position.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-accent/5">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-foreground">{position.title}</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {position.id}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {position.type}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {position.salary}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">المتطلبات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {position.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">المزايا:</h4>
                    <div className="flex flex-wrap gap-1">
                      {position.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      {position.commission}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Process */}
        <section className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">عملية التوظيف</h2>
            <p className="text-xl text-muted-foreground">خطوات واضحة ومحددة للوصول إلى فريق العمل</p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-primary/30 hidden lg:block"></div>
            
            <div className="space-y-8">
              {applicationProcess.map((process, index) => (
                <div key={process.step} className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`${process.color} rounded-full w-12 h-12 flex items-center justify-center text-white font-bold`}>
                            {process.step}
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{process.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{process.description}</p>
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
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-blue-900">معلومات مهمة للمتقدمين</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-blue-600" />
                      <span>سيتم التواصل معك خلال <strong>10 أيام عمل</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <span>فريق الموارد البشرية سيتولى المتابعة</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>المقابلة الشخصية ستكون بعد المقابلة التقنية</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>جميع التحديثات ستصلك عبر البريد الإلكتروني</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Application Form */}
        <section className="animate-fade-in">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-card to-accent/5">
            <CardHeader className="text-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                <FileText className="w-8 h-8" />
                نموذج طلب التوظيف
              </CardTitle>
              <p className="text-primary-foreground/90 mt-2">
                املأ البيانات بدقة وسيتم التواصل معك من قبل فريق الموارد البشرية خلال 10 أيام عمل
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Personal Information */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    البيانات الشخصية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground font-medium">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="border-border focus:border-primary"
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
                        className="border-border focus:border-primary"
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
                        className="border-border focus:border-primary"
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
                        className="border-border focus:border-primary"
                        placeholder="مدينة الإقامة"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    البيانات المهنية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-foreground font-medium">الوظيفة المطلوبة *</Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger className="border-border focus:border-primary">
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
                        <SelectTrigger className="border-border focus:border-primary">
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
                        <SelectTrigger className="border-border focus:border-primary">
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
                        className="border-border focus:border-primary"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    رفع السيرة الذاتية والمرفقات
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cv-file" className="text-foreground font-medium">السيرة الذاتية (PDF أو Word)</Label>
                      <Input
                        id="cv-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="border-border focus:border-primary"
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
                        className="border-border focus:border-primary"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
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
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-12 py-4 text-lg font-semibold"
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