import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  Users, 
  Star, 
  Calendar,
  Smartphone,
  Globe,
  Building2,
  Zap,
  Target,
  UserCheck,
  Phone,
  Mail,
  Send,
  ArrowRight,
  Shield,
  Award
} from "lucide-react";
import { PageLayout } from "@/components/PageLayout";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const consultationServices = [
  {
    id: "business-consulting",
    title: "الاستشارات التجارية",
    icon: Building2,
    description: "استشارات شاملة لتطوير أعمالك وزيادة الأرباح",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "digital-transformation", 
    title: "التحول الرقمي",
    icon: Globe,
    description: "تحويل أعمالك للعالم الرقمي بأحدث التقنيات",
    color: "from-green-500 to-teal-600"
  },
  {
    id: "financial-planning",
    title: "التخطيط المالي", 
    icon: Target,
    description: "خطط مالية محكمة لتحقيق أهدافك الاستثمارية",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "strategic-consulting",
    title: "الاستشارات الاستراتيجية",
    icon: Award,
    description: "استراتيجيات متقدمة للوصول لقمة النجاح",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "risk-management",
    title: "إدارة المخاطر",
    icon: Shield,
    description: "حماية استثماراتك وإدارة المخاطر بكفاءة",
    color: "from-red-500 to-orange-600"
  },
  {
    id: "team-development",
    title: "تطوير الفرق",
    icon: Users,
    description: "بناء فرق عمل قوية ومتطورة لشركتك",
    color: "from-teal-500 to-green-600"
  }
];

const consultationTypes = [
  {
    id: "initial",
    title: "استشارة أولية", 
    subtitle: "مجانية - 30 دقيقة",
    features: ["تقييم أولي للوضع", "توجيهات عامة", "خطة عمل مبدئية"],
    popular: true
  },
  {
    id: "detailed",
    title: "استشارة تفصيلية",
    subtitle: "90 دقيقة - 500 ريال",
    features: ["تحليل شامل ومعمق", "خطة عمل تفصيلية", "متابعة لمدة أسبوع"]
  },
  {
    id: "strategic", 
    title: "جلسة استراتيجية",
    subtitle: "3 ساعات - 1500 ريال",
    features: ["استراتيجية متكاملة", "خطة تنفيذية شاملة", "متابعة لمدة شهر"]
  },
  {
    id: "workshop",
    title: "ورشة عمل جماعية",
    subtitle: "يوم كامل - 3000 ريال",
    features: ["تدريب للفريق", "خطة تطبيقية", "متابعة لمدة 3 أشهر"]
  }
];

const benefits = [
  { icon: UserCheck, title: "خبراء معتمدون", description: "فريق من الخبراء المعتمدين دولياً" },
  { icon: Clock, title: "استجابة سريعة", description: "رد خلال 24 ساعة كحد أقصى" },
  { icon: Shield, title: "سرية تامة", description: "حماية كاملة لبياناتك ومعلوماتك" },
  { icon: Star, title: "جودة مضمونة", description: "ضمان الجودة أو استرداد المبلغ" }
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  consultationType: string;
  message: string;
}

export default function Consultation() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    consultationType: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('consultation-booking', {
        body: {
          ...formData,
          service: selectedService,
          consultationType: selectedType
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح",
        description: "سنتواصل معك خلال 24 ساعة",
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        consultationType: "",
        message: ""
      });
      setSelectedService("");
      setSelectedType("");
      setCurrentStep(1);

    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <PageLayout>
      <SEO 
        title="استشارة مجانية - ASH HOLDING"
        description="احصل على استشارة مجانية من خبراء ASH HOLDING في التجارة والتقنية والتحول الرقمي"
        canonicalUrl="https://alialshehriholding.com/consultation"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 text-lg font-bold rounded-full">
                <MessageCircle className="w-5 h-5 mr-2" />
                استشارة مجانية
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                دعنا نحقق رؤيتك معاً
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
                احصل على استشارة مجانية من فريق الخبراء المتخصص لدينا واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                      <benefit.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Progress Steps */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex justify-center items-center space-x-4 space-x-reverse">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8 space-x-reverse text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}>
              اختر الخدمة
            </span>
            <span className={currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}>
              نوع الاستشارة
            </span>
            <span className={currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}>
              بياناتك
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-20">
          <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl lg:text-3xl flex items-center justify-center gap-3">
                      <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                      ما نوع الخدمة التي تحتاجها؟
                    </CardTitle>
                    <p className="text-muted-foreground">يمكنك اختيار أكثر من خدمة</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {consultationServices.map((service) => (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedService === service.id
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedService(service.id)}
                        >
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
                            <service.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          
                          {selectedService === service.id && (
                            <div className="mt-4 flex items-center text-primary">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">محدد</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Consultation Type */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl lg:text-3xl flex items-center justify-center gap-3">
                      <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                      اختر نوع الاستشارة المناسب
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {consultationTypes.map((type) => (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedType === type.id
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedType(type.id)}
                        >
                          {type.popular && (
                            <Badge className="absolute -top-3 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                              الأكثر طلباً
                            </Badge>
                          )}
                          
                          <div className="mb-4">
                            <h3 className="font-bold text-xl mb-2">{type.title}</h3>
                            <p className="text-primary font-medium">{type.subtitle}</p>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {type.features.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          {selectedType === type.id && (
                            <div className="flex items-center text-primary">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">محدد</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl lg:text-3xl flex items-center justify-center gap-3">
                      <span className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                      بياناتك للتواصل
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف / واتساب *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">الشركة (اختياري)</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="message">تفاصيل إضافية</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="أخبرنا المزيد عن احتياجاتك..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep}
                  className="px-8 py-3"
                >
                  السابق
                </Button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !selectedService) ||
                    (currentStep === 2 && !selectedType)
                  }
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  التالي
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      إرسال طلب الاستشارة
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}