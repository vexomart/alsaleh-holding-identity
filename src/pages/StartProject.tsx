import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  Rocket, 
  CheckCircle, 
  Globe, 
  Users, 
  Award, 
  ArrowRight,
  Lightbulb,
  Target,
  Building2,
  Smartphone,
  Code,
  Palette,
  TrendingUp,
  Shield,
  Clock,
  Heart,
  Star
} from "lucide-react";

const StartProject = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    additionalServices: [] as string[]
  });

  const projectTypes = [
    { value: "website", label: "تطوير موقع ويب", icon: Globe },
    { value: "mobile-app", label: "تطبيق جوال", icon: Smartphone },
    { value: "web-app", label: "تطبيق ويب", icon: Code },
    { value: "design", label: "تصميم هوية بصرية", icon: Palette },
    { value: "ai-solution", label: "حلول الذكاء الاصطناعي", icon: Lightbulb },
    { value: "business-system", label: "نظام إدارة أعمال", icon: Building2 },
    { value: "other", label: "أخرى", icon: Target }
  ];

  const budgetRanges = [
    "أقل من 10,000 ريال",
    "10,000 - 25,000 ريال", 
    "25,000 - 50,000 ريال",
    "50,000 - 100,000 ريال",
    "أكثر من 100,000 ريال",
    "أفضل عدم الإفصاح"
  ];

  const timelineOptions = [
    "أقل من شهر",
    "1-3 أشهر",
    "3-6 أشهر", 
    "6-12 شهر",
    "أكثر من سنة",
    "مرن حسب المتطلبات"
  ];

  const additionalServices = [
    "استضافة ودومين",
    "صيانة دورية",
    "تحسين محركات البحث (SEO)",
    "إدارة وسائل التواصل الاجتماعي",
    "تدريب الفريق",
    "دعم فني 24/7"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.projectType) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('project-request', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: "سنتواصل معك قريباً لمناقشة تفاصيل مشروعك",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "",
        budget: "",
        timeline: "",
        description: "",
        additionalServices: []
      });

    } catch (error) {
      console.error('Error submitting project request:', error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 bg-white/80 backdrop-blur-sm">
            <Rocket className="w-4 h-4 mr-2" />
            ابدأ رحلتك التقنية معنا
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            ابدأ مشروعك الآن
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            حوّل أفكارك إلى واقع رقمي متقدم. نحن هنا لمساعدتك في بناء حلول تقنية مبتكرة تواكب طموحاتك
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span>استشارة مجانية</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span>فريق خبير</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span>تسليم في المواعيد</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Project Request Form */}
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                  <Target className="w-6 h-6" />
                  طلب مشروع جديد
                </CardTitle>
                <CardDescription>
                  املأ النموذج أدناه وسنتواصل معك خلال 24 ساعة
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@domain.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+966 5XXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">اسم الشركة/المؤسسة</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="اختياري"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <Label htmlFor="projectType">نوع المشروع *</Label>
                    <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget and Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">الميزانية المتوقعة</Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الميزانية" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeline">الجدول الزمني المطلوب</Label>
                      <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المدة الزمنية" />
                        </SelectTrigger>
                        <SelectContent>
                          {timelineOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <Label htmlFor="description">وصف المشروع والمتطلبات</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="اكتب وصفاً مفصلاً عن مشروعك والميزات المطلوبة..."
                      rows={4}
                    />
                  </div>

                  {/* Additional Services */}
                  <div>
                    <Label>خدمات إضافية (اختياري)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {additionalServices.map((service) => (
                        <Button
                          key={service}
                          type="button"
                          variant={formData.additionalServices.includes(service) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleServiceToggle(service)}
                          className="justify-start text-sm"
                        >
                          {service}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "جاري الإرسال..."
                    ) : (
                      <>
                        إرسال طلب المشروع
                        <ArrowRight className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">
                  لماذا تختار آل الشهري القابضة؟
                </h2>
                
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">خبرة متقدمة</h3>
                          <p className="text-muted-foreground">
                            أكثر من 10 سنوات في تطوير الحلول التقنية المبتكرة مع فريق من أفضل المطورين والمصممين
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">نتائج مضمونة</h3>
                          <p className="text-muted-foreground">
                            نلتزم بتحقيق أهدافك التجارية من خلال حلول تقنية مدروسة ومختبرة تضمن عائد استثمار ممتاز
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-secondary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-secondary/10 rounded-lg">
                          <Shield className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">أمان وجودة</h3>
                          <p className="text-muted-foreground">
                            نتبع أعلى معايير الأمان والجودة في التطوير مع ضمان شامل وصيانة مجانية
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">سرعة في التسليم</h3>
                          <p className="text-muted-foreground">
                            نلتزم بالمواعيد المحددة ونستخدم أحدث التقنيات لضمان التسليم السريع دون التنازل عن الجودة
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Success Stats */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-center mb-6">إنجازاتنا</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">مشروع مكتمل</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">98%</div>
                      <div className="text-sm text-muted-foreground">رضا العملاء</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">24/7</div>
                      <div className="text-sm text-muted-foreground">دعم فني</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">خبير تقني</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartProject;