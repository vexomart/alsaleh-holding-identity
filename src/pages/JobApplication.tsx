import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  Upload, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
  Shield,
  Award,
  Target,
  Zap,
  Globe,
  Send,
  Eye,
  ArrowLeft,
  Calendar,
  Building2,
  LogIn
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { JobApplicationSteps } from "@/components/JobApplicationSteps";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";


const JobApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    experience: "",
    education: "",
    coverLetter: "",
    cv: null as File | null,
    skills: "",
    portfolio: "",
    linkedIn: "",
    expectedSalary: "",
    availableDate: "",
    workType: "",
    languages: []
  });
  
  const [formValidation, setFormValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "مطلوب تسجيل الدخول",
          description: "يرجى تسجيل الدخول أولاً للتقدم للوظائف",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      // Pre-fill email from user profile
      setFormData(prev => ({
        ...prev,
        email: session.user.email || ""
      }));
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth');
      } else {
        setUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email || ""
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    validateCurrentStep();
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
      
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
      
      toast({
        title: "تم رفع الملف بنجاح",
        description: `تم رفع ${file.name}`,
      });
    }
  };

  const validateCurrentStep = () => {
    const validation = { ...formValidation };
    
    // Step 1: Personal Information
    validation.step1 = !!(formData.fullName && formData.email && formData.phone);
    
    // Step 2: Job Information
    validation.step2 = !!(formData.position && formData.experience && formData.education);
    
    // Step 3: CV Upload (optional but recommended)
    validation.step3 = true; // CV is optional
    
    // Step 4: Cover Letter
    validation.step4 = !!formData.coverLetter;
    
    // Step 5: Review (all previous steps)
    validation.step5 = validation.step1 && validation.step2 && validation.step4;
    
    setFormValidation(validation);
  };

  useEffect(() => {
    validateCurrentStep();
  }, [formData]);

  const nextStep = () => {
    const currentValidation = formValidation[`step${currentStep}` as keyof typeof formValidation];
    if (currentValidation || currentStep === 3) { // Step 3 (CV) is optional
      setCurrentStep(prev => Math.min(5, prev + 1));
    } else {
      toast({
        title: "يرجى إكمال الحقول المطلوبة",
        description: "تأكد من ملء جميع البيانات المطلوبة قبل المتابعة",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValidation.step5) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let cvUrl = null;
      let cvFileName = null;

      // Upload CV file if provided with enhanced security
      if (formData.cv) {
        // Security: Validate file type and size
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 5 * 1024 * 1024; // 5MB limit

        if (!allowedTypes.includes(formData.cv.type)) {
          throw new Error('نوع الملف غير مدعوم. يرجى استخدام PDF أو Word');
        }

        if (formData.cv.size > maxSize) {
          throw new Error('حجم الملف كبير جداً. الحد الأقصى 5MB');
        }

        // Security: Use user-specific path and sanitized filename
        const fileExt = formData.cv.name.split('.').pop()?.toLowerCase();
        const sanitizedName = formData.cv.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${user.id}/${Date.now()}_${sanitizedName}`;
        
        // Log file upload attempt for security monitoring
        console.log('CV upload attempt:', {
          fileName: sanitizedName,
          fileSize: formData.cv.size,
          fileType: formData.cv.type
        });
        
        const { error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, formData.cv);

        if (uploadError) {
          throw new Error(`خطأ في رفع الملف: ${uploadError.message}`);
        }

        cvUrl = fileName;
        cvFileName = formData.cv.name;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        cvUrl,
        cvFileName,
        languages: Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages,
        message: formData.coverLetter
      };

      // Use proper Supabase client method with authentication
      const { data: result, error } = await supabase.functions.invoke('submit-job-application', {
        body: submitData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "🎉 تم إرسال الطلب بنجاح!",
        description: "سنتواصل معك خلال 3-5 أيام عمل. تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.",
      });

      // Reset form and go back to step 1
      setFormData({
        fullName: "",
        email: user.email || "",
        phone: "",
        city: "",
        position: "",
        experience: "",
        education: "",
        coverLetter: "",
        cv: null,
        skills: "",
        portfolio: "",
        linkedIn: "",
        expectedSalary: "",
        availableDate: "",
        workType: "",
        languages: []
      });
      setCurrentStep(1);

      // Reset file input
      const fileInput = document.getElementById('cv') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Redirect to careers page after 3 seconds
      setTimeout(() => {
        navigate('/careers');
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "خطأ في الإرسال",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إرسال الطلب. يرجى التأكد من تسجيل الدخول والمحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderJobInfo();
      case 3:
        return renderFileUpload();
      case 4:
        return renderCoverLetter();
      case 5:
        return renderReview();
      default:
        return renderPersonalInfo();
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <UserIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">البيانات الشخصية</h3>
        <p className="text-muted-foreground">أدخل بياناتك الشخصية الأساسية</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-primary font-semibold flex items-center">
            <UserIcon className="w-4 h-4 ml-2" />
            الاسم الكامل *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="border-2 focus:border-blue-500 transition-colors"
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
            className="border-2 focus:border-blue-500 transition-colors"
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
            className="border-2 focus:border-blue-500 transition-colors"
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
            className="border-2 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedIn" className="text-primary font-semibold flex items-center">
          <Globe className="w-4 h-4 ml-2" />
          رابط LinkedIn (اختياري)
        </Label>
        <Input
          id="linkedIn"
          value={formData.linkedIn}
          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
          className="border-2 focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );

  const renderJobInfo = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <Briefcase className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">معلومات الوظيفة</h3>
        <p className="text-muted-foreground">حدد المنصب المرغوب ومؤهلاتك</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="position" className="text-primary font-semibold">
            الوظيفة المرغوبة *
          </Label>
          <Select onValueChange={(value) => handleInputChange('position', value)} value={formData.position}>
            <SelectTrigger className="border-2 focus:border-green-500">
              <SelectValue placeholder="اختر الوظيفة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">مطور برمجيات</SelectItem>
              <SelectItem value="frontend">مطور واجهات أمامية</SelectItem>
              <SelectItem value="backend">مطور خلفي</SelectItem>
              <SelectItem value="fullstack">مطور متكامل</SelectItem>
              <SelectItem value="mobile">مطور تطبيقات موبايل</SelectItem>
              <SelectItem value="designer">مصمم جرافيك</SelectItem>
              <SelectItem value="uiux">مصمم واجهات</SelectItem>
              <SelectItem value="marketing">متخصص تسويق رقمي</SelectItem>
              <SelectItem value="content">كاتب محتوى</SelectItem>
              <SelectItem value="seo">متخصص SEO</SelectItem>
              <SelectItem value="data">محلل بيانات</SelectItem>
              <SelectItem value="ai">متخصص ذكاء اصطناعي</SelectItem>
              <SelectItem value="devops">مهندس DevOps</SelectItem>
              <SelectItem value="security">متخصص أمن سيبراني</SelectItem>
              <SelectItem value="pm">مدير مشروع</SelectItem>
              <SelectItem value="qa">اختبار برمجيات</SelectItem>
              <SelectItem value="translator">مترجم</SelectItem>
              <SelectItem value="researcher">باحث أكاديمي</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience" className="text-primary font-semibold">
            سنوات الخبرة *
          </Label>
          <Select onValueChange={(value) => handleInputChange('experience', value)} value={formData.experience}>
            <SelectTrigger className="border-2 focus:border-green-500">
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

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="education" className="text-primary font-semibold flex items-center">
            <GraduationCap className="w-4 h-4 ml-2" />
            المؤهل العلمي *
          </Label>
          <Select onValueChange={(value) => handleInputChange('education', value)} value={formData.education}>
            <SelectTrigger className="border-2 focus:border-green-500">
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

        <div className="space-y-2">
          <Label htmlFor="workType" className="text-primary font-semibold flex items-center">
            <Building2 className="w-4 h-4 ml-2" />
            نوع العمل المفضل
          </Label>
          <Select onValueChange={(value) => handleInputChange('workType', value)} value={formData.workType}>
            <SelectTrigger className="border-2 focus:border-green-500">
              <SelectValue placeholder="اختر نوع العمل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">عمل عن بُعد</SelectItem>
              <SelectItem value="onsite">عمل في الموقع</SelectItem>
              <SelectItem value="hybrid">عمل مختلط</SelectItem>
              <SelectItem value="flexible">مرن</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="expectedSalary" className="text-primary font-semibold">
            الراتب المتوقع (ريال سعودي)
          </Label>
          <Input
            id="expectedSalary"
            value={formData.expectedSalary}
            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
            placeholder="مثال: 8000 - 12000"
            className="border-2 focus:border-green-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableDate" className="text-primary font-semibold flex items-center">
            <Calendar className="w-4 h-4 ml-2" />
            تاريخ الإتاحة للعمل
          </Label>
          <Input
            id="availableDate"
            type="date"
            value={formData.availableDate}
            onChange={(e) => handleInputChange('availableDate', e.target.value)}
            className="border-2 focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" className="text-primary font-semibold flex items-center">
          <Zap className="w-4 h-4 ml-2" />
          المهارات الأساسية
        </Label>
        <Textarea
          id="skills"
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          placeholder="مثال: JavaScript, React, Python, Photoshop, SEO..."
          rows={3}
          className="border-2 focus:border-green-500 transition-colors"
        />
      </div>
    </div>
  );

  const renderFileUpload = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <Upload className="w-16 h-16 mx-auto text-purple-500 mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">السيرة الذاتية والملفات</h3>
        <p className="text-muted-foreground">ارفع سيرتك الذاتية ومعرض أعمالك</p>
      </div>

      <div className="space-y-6">
        {/* CV Upload */}
        <Card className="border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <Label htmlFor="cv" className="text-primary font-semibold text-lg cursor-pointer">
                رفع السيرة الذاتية
              </Label>
              <p className="text-muted-foreground mt-2 mb-4">
                يُفضل ملفات PDF أو Word (حد أقصى 5MB)
              </p>
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file:ml-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              />
              {formData.cv && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>تم رفع: {formData.cv.name}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Link */}
        <div className="space-y-2">
          <Label htmlFor="portfolio" className="text-primary font-semibold flex items-center">
            <Globe className="w-4 h-4 ml-2" />
            رابط معرض الأعمال (اختياري)
          </Label>
          <Input
            id="portfolio"
            value={formData.portfolio}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder="https://yourportfolio.com"
            className="border-2 focus:border-purple-500 transition-colors"
          />
          <p className="text-sm text-muted-foreground">
            رابط موقعك الشخصي، GitHub، Behance، أو أي معرض أعمال آخر
          </p>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label htmlFor="languages" className="text-primary font-semibold">
            اللغات المتقنة
          </Label>
          <Textarea
            id="languages"
            value={Array.isArray(formData.languages) ? formData.languages.join(', ') : formData.languages}
            onChange={(e) => handleInputChange('languages', e.target.value.split(',').map(lang => lang.trim()))}
            placeholder="العربية (متقن)، الإنجليزية (جيد جداً)، الفرنسية (متوسط)..."
            rows={2}
            className="border-2 focus:border-purple-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const renderCoverLetter = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <FileText className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">رسالة تعريفية</h3>
        <p className="text-muted-foreground">اكتب رسالة تعريفية مؤثرة تعبر عنك</p>
      </div>

      <Card className="border-2 border-orange-200 bg-orange-50/30">
        <CardContent className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-orange-700 mb-2">💡 نصائح لكتابة رسالة تعريفية مميزة:</h4>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>• اذكر سبب اهتمامك بالشركة والمنصب</li>
              <li>• أبرز خبراتك ومهاراتك الأكثر صلة</li>
              <li>• أضف أمثلة محددة من إنجازاتك</li>
              <li>• اختتم بما يمكنك تقديمه للشركة</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="coverLetter" className="text-primary font-semibold flex items-center">
          <FileText className="w-4 h-4 ml-2" />
          الرسالة التعريفية *
        </Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => handleInputChange('coverLetter', e.target.value)}
          placeholder="اكتب رسالة تعريفية تعبر عن شخصيتك المهنية وخبراتك..."
          rows={8}
          className="border-2 focus:border-orange-500 transition-colors"
          required
        />
        <p className="text-sm text-muted-foreground">
          الحد الأدنى: 100 كلمة | الحد الأقصى: 500 كلمة
        </p>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <Eye className="w-16 h-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">مراجعة البيانات</h3>
        <p className="text-muted-foreground">تأكد من صحة جميع البيانات قبل الإرسال</p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <UserIcon className="w-5 h-5" />
              البيانات الشخصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>الاسم:</strong> {formData.fullName}</p>
            <p><strong>البريد الإلكتروني:</strong> {formData.email}</p>
            <p><strong>الهاتف:</strong> {formData.phone}</p>
            {formData.city && <p><strong>المدينة:</strong> {formData.city}</p>}
            {formData.linkedIn && <p><strong>LinkedIn:</strong> {formData.linkedIn}</p>}
          </CardContent>
        </Card>

        {/* Job Information */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Briefcase className="w-5 h-5" />
              معلومات الوظيفة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>الوظيفة:</strong> {formData.position}</p>
            <p><strong>الخبرة:</strong> {formData.experience}</p>
            <p><strong>التعليم:</strong> {formData.education}</p>
            {formData.workType && <p><strong>نوع العمل:</strong> {formData.workType}</p>}
            {formData.expectedSalary && <p><strong>الراتب المتوقع:</strong> {formData.expectedSalary}</p>}
            {formData.availableDate && <p><strong>تاريخ الإتاحة:</strong> {formData.availableDate}</p>}
            {formData.skills && <p><strong>المهارات:</strong> {formData.skills}</p>}
          </CardContent>
        </Card>

        {/* Files */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Upload className="w-5 h-5" />
              الملفات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>السيرة الذاتية:</strong> {formData.cv ? formData.cv.name : 'لم يتم رفع ملف'}</p>
            {formData.portfolio && <p><strong>معرض الأعمال:</strong> {formData.portfolio}</p>}
            {formData.languages && Array.isArray(formData.languages) && formData.languages.length > 0 && (
              <p><strong>اللغات:</strong> {formData.languages.join(', ')}</p>
            )}
          </CardContent>
        </Card>

        {/* Cover Letter Preview */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <FileText className="w-5 h-5" />
              الرسالة التعريفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {formData.coverLetter || 'لم تتم كتابة رسالة تعريفية'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Shield className="w-5 h-5" />
          <strong>إقرار وموافقة</strong>
        </div>
        <p className="text-sm text-blue-700">
          بالضغط على "إرسال الطلب"، أؤكد أن جميع المعلومات المقدمة صحيحة ودقيقة، وأوافق على معالجة بياناتي الشخصية وفقاً لسياسة الخصوصية.
        </p>
      </div>
    </div>
  );

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحقق من تسجيل الدخول...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="pt-20">
        {/* Enhanced Header */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-dot-pattern opacity-30" />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="animate-fade-in">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                  <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                انضم إلى فريق النجاح
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
                استخدم نظامنا التفاعلي المتطور لتقديم طلب توظيف احترافي خلال 5 خطوات بسيطة
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Badge className="bg-green-500/20 text-green-200 border-green-400/30 px-6 py-3 text-base font-semibold">
                  <Star className="w-5 h-5 mr-2" />
                  نظام متطور
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 px-6 py-3 text-base font-semibold">
                  <Clock className="w-5 h-5 mr-2" />
                  5 دقائق فقط
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 px-6 py-3 text-base font-semibold">
                  <Award className="w-5 h-5 mr-2" />
                  احترافي
                </Badge>
              </div>
              
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={() => navigate('/careers')}
                className="mt-8 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 px-8 py-4 text-lg font-semibold"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                عرض الوظائف المتاحة
              </Button>
            </div>
          </div>
        </section>

        {/* Application Form with Steps */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              
              {/* Progress Steps */}
              <JobApplicationSteps 
                currentStep={currentStep} 
                onStepChange={setCurrentStep} 
              />
              
              {/* Main Form Card */}
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12">
                  <form onSubmit={handleSubmit}>
                    {renderStepContent()}
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        <ArrowRight className="w-4 h-4" />
                        السابق
                      </Button>
                      
                      <div className="text-center flex-1 mx-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          {formValidation[`step${currentStep}` as keyof typeof formValidation] ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>مكتمل</span>
                            </div>
                          ) : currentStep === 3 ? (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Upload className="w-4 h-4" />
                              <span>اختياري</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-orange-600">
                              <Clock className="w-4 h-4" />
                              <span>غير مكتمل</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {currentStep < 5 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3"
                        >
                          التالي
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || !formValidation.step5}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 text-lg font-semibold disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              إرسال الطلب
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Target className="w-10 h-10 mx-auto text-blue-600 mb-3" />
                    <h3 className="font-bold text-blue-900">تقييم سريع</h3>
                    <p className="text-blue-700 text-sm">نراجع طلبك خلال 24 ساعة</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 mx-auto text-green-600 mb-3" />
                    <h3 className="font-bold text-green-900">أمان البيانات</h3>
                    <p className="text-green-700 text-sm">بياناتك محمية بأعلى معايير الأمان</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-10 h-10 mx-auto text-purple-600 mb-3" />
                    <h3 className="font-bold text-purple-900">استجابة فورية</h3>
                    <p className="text-purple-700 text-sm">تأكيد فوري عند إرسال الطلب</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobApplication;