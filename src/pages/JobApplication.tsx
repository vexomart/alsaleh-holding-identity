import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, User, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const JobApplication = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    experience: "",
    education: "",
    coverLetter: "",
    cv: null as File | null
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
      toast({
        title: "خطأ في الإرسال",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        position: formData.position,
        experience: formData.experience,
        education: formData.education,
        coverLetter: formData.coverLetter,
        cvFileName: formData.cv?.name,
        cvFileSize: formData.cv?.size,
      };

      // Submit to Supabase edge function
      const response = await fetch(
        "https://ibfcgweykqkzdodrfmci.supabase.co/functions/v1/job-application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم إرسال الطلب بنجاح",
          description: "سيتم التواصل معك خلال 3-5 أيام عمل",
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
          cv: null
        });

        // Reset file input
        const fileInput = document.getElementById('cv') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(result.error || "حدث خطأ أثناء الإرسال");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "خطأ في الإرسال",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-primary">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              انضم إلى فريقنا
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              نحن نبحث عن المواهب المتميزة للانضمام إلى فريق عملنا وتحقيق النجاح معاً
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => navigate('/')}
              className="mt-6"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-elegant border-0 bg-card">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl font-bold text-primary mb-4">
                    طلب توظيف
                  </CardTitle>
                  <p className="text-muted-foreground">
                    يرجى ملء النموذج التالي للتقديم على إحدى الوظائف المتاحة
                  </p>
                </CardHeader>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-primary font-semibold flex items-center">
                          <User className="w-4 h-4 ml-2" />
                          الاسم الكامل *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-primary font-semibold flex items-center">
                          <Mail className="w-4 h-4 ml-2" />
                          البريد الإلكتروني *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-primary font-semibold flex items-center">
                          <Phone className="w-4 h-4 ml-2" />
                          رقم الجوال *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="05xxxxxxxx"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-primary font-semibold flex items-center">
                          <MapPin className="w-4 h-4 ml-2" />
                          المدينة
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="أدخل مدينتك"
                        />
                      </div>
                    </div>

                    {/* Job Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="position" className="text-primary font-semibold">
                          الوظيفة المرغوبة *
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('position', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الوظيفة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developer">مطور برمجيات</SelectItem>
                            <SelectItem value="designer">مصمم جرافيك</SelectItem>
                            <SelectItem value="marketing">متخصص تسويق</SelectItem>
                            <SelectItem value="content">كاتب محتوى</SelectItem>
                            <SelectItem value="data">محلل بيانات</SelectItem>
                            <SelectItem value="translator">مترجم</SelectItem>
                            <SelectItem value="researcher">باحث أكاديمي</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-primary font-semibold">
                          سنوات الخبرة
                        </Label>
                        <Select onValueChange={(value) => handleInputChange('experience', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر سنوات الخبرة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fresh">حديث التخرج</SelectItem>
                            <SelectItem value="1-2">1-2 سنة</SelectItem>
                            <SelectItem value="3-5">3-5 سنوات</SelectItem>
                            <SelectItem value="6-10">6-10 سنوات</SelectItem>
                            <SelectItem value="10+">أكثر من 10 سنوات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-primary font-semibold">
                        المؤهل العلمي
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('education', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المؤهل العلمي" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high-school">ثانوية عامة</SelectItem>
                          <SelectItem value="diploma">دبلوم</SelectItem>
                          <SelectItem value="bachelor">بكالوريوس</SelectItem>
                          <SelectItem value="master">ماجستير</SelectItem>
                          <SelectItem value="phd">دكتوراه</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="cv" className="text-primary font-semibold flex items-center">
                        <Upload className="w-4 h-4 ml-2" />
                        رفع السيرة الذاتية
                      </Label>
                      <Input
                        id="cv"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="file:ml-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                      />
                      <p className="text-sm text-muted-foreground">
                        يُفضل ملفات PDF أو Word (حد أقصى 5MB)
                      </p>
                    </div>

                    {/* Cover Letter */}
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter" className="text-primary font-semibold">
                        رسالة تعريفية
                      </Label>
                      <Textarea
                        id="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                        placeholder="اكتب نبذة مختصرة عن خبراتك ومهاراتك..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg disabled:opacity-50"
                    >
                      {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobApplication;