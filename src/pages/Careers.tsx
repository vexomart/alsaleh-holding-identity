import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  Star, 
  Clock, 
  MapPin, 
  Heart,
  Coffee,
  Laptop,
  Globe,
  DollarSign,
  TrendingUp,
  Award,
  Shield,
  CheckCircle,
  Upload,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Rocket,
  Target,
  Lightbulb,
  Zap,
  Building2,
  Calendar,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Careers = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    experience: "",
    education: "",
    coverLetter: ""
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

      // Send to edge function
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
            message: formData.coverLetter
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "تم إرسال الطلب بنجاح!",
          description: "سنتواصل معك قريباً للمتابعة",
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
          coverLetter: ""
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

  const benefits = [
    { icon: Globe, title: "عمل عن بُعد", description: "مرونة العمل من أي مكان" },
    { icon: DollarSign, title: "راتب تنافسي", description: "رواتب متميزة مع عمولات تسويقية" },
    { icon: TrendingUp, title: "نمو مهني", description: "فرص تطوير وترقية مستمرة" },
    { icon: Heart, title: "بيئة عمل إيجابية", description: "فريق عمل متعاون ومتفهم" },
    { icon: Coffee, title: "استراحات مرنة", description: "أوقات راحة حسب الحاجة" },
    { icon: Award, title: "تدريب مستمر", description: "دورات تدريبية متخصصة" }
  ];

  const positions = [
    { title: "مطور ويب", type: "دوام كامل", commission: "عمولة تسويقية 5%", remote: true },
    { title: "مطور تطبيقات", type: "دوام كامل", commission: "عمولة تسويقية 7%", remote: true },
    { title: "مصمم جرافيك", type: "دوام جزئي", commission: "عمولة تسويقية 4%", remote: true },
    { title: "مسؤول تسويق", type: "دوام كامل", commission: "عمولة تسويقية 10%", remote: true },
    { title: "محاسب", type: "دوام كامل", commission: "بونص سنوي", remote: false },
    { title: "مدير مشروع", type: "دوام كامل", commission: "عمولة تسويقية 8%", remote: true }
  ];

  const workCulture = [
    { icon: Rocket, title: "الابتكار", description: "نشجع الأفكار الإبداعية والحلول المبتكرة" },
    { icon: Target, title: "التميز", description: "نسعى للوصول لأعلى معايير الجودة" },
    { icon: Users, title: "التعاون", description: "نؤمن بقوة العمل الجماعي" },
    { icon: Lightbulb, title: "التعلم", description: "نوفر بيئة تعلم مستمر وتطوير" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <Briefcase className="w-16 h-16 mx-auto mb-6 text-yellow-300 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              انضم إلى فريقنا
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              كن جزءاً من رحلتنا في تشكيل مستقبل التكنولوجيا مع فرص عمل مرنة وعمولات تسويقية مجزية
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge className="bg-green-500/20 text-green-200 border-green-400/30 px-4 py-2 text-sm">
                <Globe className="w-4 h-4 mr-2" />
                عمل عن بُعد 100%
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 px-4 py-2 text-sm">
                <DollarSign className="w-4 h-4 mr-2" />
                عمولات تسويقية
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 px-4 py-2 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                نمو مهني سريع
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Company Culture */}
        <section className="mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">ثقافة العمل لدينا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نؤمن ببناء بيئة عمل تشجع على الإبداع والتطور المستمر
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workCulture.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50">
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">المزايا والحوافز</h2>
            <p className="text-xl text-gray-600">اكتشف ما نقدمه لفريق العمل</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Available Positions */}
        <section className="mb-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">الوظائف المتاحة قريباً</h2>
            <p className="text-xl text-gray-600">تابع معنا لمعرفة آخر الفرص الوظيفية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {positions.map((position, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-purple-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{position.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {position.type}
                        </div>
                        {position.remote && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            عن بُعد
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                      {position.commission}
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-purple-500/30 text-purple-600 hover:bg-purple-50"
                    onClick={() => window.location.href = '/job-application'}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    التقديم الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="animate-fade-in">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
                <FileText className="w-8 h-8" />
                طلب توظيف
              </CardTitle>
              <p className="text-blue-100 mt-2">املأ البيانات التالية وسنتواصل معك قريباً</p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    البيانات الشخصية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="05xxxxxxxx"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700 font-medium">المدينة</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="الرياض، جدة، الدمام..."
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    المعلومات المهنية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-700 font-medium">المنصب المطلوب *</Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="اختر المنصب المطلوب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مطور ويب">مطور ويب</SelectItem>
                          <SelectItem value="مطور تطبيقات">مطور تطبيقات</SelectItem>
                          <SelectItem value="مصمم جرافيك">مصمم جرافيك</SelectItem>
                          <SelectItem value="مسؤول تسويق">مسؤول تسويق</SelectItem>
                          <SelectItem value="محاسب">محاسب</SelectItem>
                          <SelectItem value="مدير مشروع">مدير مشروع</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-gray-700 font-medium">سنوات الخبرة</Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="اختر سنوات الخبرة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 سنة</SelectItem>
                          <SelectItem value="2-3">2-3 سنوات</SelectItem>
                          <SelectItem value="4-5">4-5 سنوات</SelectItem>
                          <SelectItem value="6-10">6-10 سنوات</SelectItem>
                          <SelectItem value="أكثر من 10">أكثر من 10 سنوات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="education" className="text-gray-700 font-medium">المؤهل التعليمي</Label>
                      <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="اختر المؤهل التعليمي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ثانوية عامة">ثانوية عامة</SelectItem>
                          <SelectItem value="دبلوم">دبلوم</SelectItem>
                          <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                          <SelectItem value="ماجستير">ماجستير</SelectItem>
                          <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                    رفع السيرة الذاتية
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <Label htmlFor="cv-file" className="cursor-pointer">
                        <span className="text-purple-600 font-medium hover:text-purple-700">
                          اختر ملف السيرة الذاتية
                        </span>
                        <p className="text-sm text-gray-500 mt-2">PDF أو Word (أقل من 5 ميجابايت)</p>
                      </Label>
                      <Input
                        id="cv-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    
                    {cvFile && (
                      <div className="flex items-center gap-3 p-3 bg-green-100 rounded-lg border border-green-200">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 font-medium">{cvFile.name}</span>
                        <CheckCircle className="w-5 h-5 text-green-600 mr-auto" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    رسالة تعريفية
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="text-gray-700 font-medium">أخبرنا عن نفسك</Label>
                    <Textarea
                      id="coverLetter"
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[120px]"
                      placeholder="اكتب نبذة عن خبراتك ومهاراتك وسبب اهتمامك بالعمل معنا..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        إرسال الطلب
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    سنقوم بمراجعة طلبك والتواصل معك خلال 3-5 أيام عمل
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mt-16 text-center animate-fade-in">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-gradient-to-r from-gray-50 to-blue-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">تواصل معنا</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium text-gray-800">info@fekrahtech.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-medium text-gray-800">+966 11 234 5678</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default Careers;