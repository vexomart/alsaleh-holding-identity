import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Clock,
  ArrowRight,
  Send,
  Target,
  Settings,
  Database,
  PieChart
} from "lucide-react";

const BusinessSolutions = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectBudget: "",
    projectTimeline: "",
    description: "",
    requiredFeatures: [] as string[],
    currentSystems: "",
    integrationNeeds: "",
    securityRequirements: "",
    scalabilityNeeds: ""
  });

  useEffect(() => {
    document.title = "حلول الأعمال الرقمية | ASH HOLDING";
    const desc = "منصات رقمية متكاملة لإدارة الأعمال تشمل أنظمة إدارة العملاء والمخزون والمحاسبة";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const businessFeatures = [
    "نظام إدارة علاقات العملاء (CRM)",
    "نظام تخطيط موارد المؤسسة (ERP)",
    "أنظمة المحاسبة والمالية المتقدمة",
    "إدارة المخزون والمبيعات",
    "أنظمة إدارة الموارد البشرية",
    "منصات خدمة العملاء والدعم الفني",
    "أنظمة إدارة المشاريع والمهام",
    "حلول التجارة الإلكترونية B2B",
    "أنظمة إدارة سلسلة التوريد",
    "حلول التحليلات والذكاء التجاري"
  ];

  const businessModules = [
    { name: "إدارة العملاء (CRM)", icon: Users, progress: 98 },
    { name: "المحاسبة والمالية", icon: DollarSign, progress: 95 },
    { name: "إدارة المخزون", icon: Package, progress: 92 },
    { name: "التحليلات والتقارير", icon: BarChart3, progress: 90 },
    { name: "إدارة الموارد البشرية", icon: Building2, progress: 88 },
    { name: "إدارة المشاريع", icon: Target, progress: 85 }
  ];

  const implementationSteps = [
    {
      title: "تحليل العمليات التجارية",
      description: "دراسة شاملة لسير العمل والعمليات الحالية",
      icon: BarChart3,
      duration: "2-3 أسابيع"
    },
    {
      title: "تصميم النظام",
      description: "تصميم النظام ليناسب احتياجات عملك",
      icon: Settings,
      duration: "3-4 أسابيع"
    },
    {
      title: "التطوير والتخصيص",
      description: "تطوير النظام وتخصيصه حسب متطلباتك",
      icon: Building2,
      duration: "8-12 أسبوع"
    },
    {
      title: "التدريب والتشغيل",
      description: "تدريب الفريق ونقل النظام للإنتاج",
      icon: Users,
      duration: "2-3 أسابيع"
    }
  ];

  const businessBenefits = [
    {
      title: "شركة تجارية كبرى",
      description: "تطبيق نظام ERP شامل لـ 15 فرع",
      results: "تحسين الكفاءة بنسبة 85%",
      metrics: "توفير 40% من وقت المعاملات"
    },
    {
      title: "مؤسسة خدمية رائدة",
      description: "نظام CRM متطور لإدارة 50,000 عميل",
      results: "زيادة رضا العملاء بنسبة 70%",
      metrics: "تحسين سرعة الاستجابة 60%"
    },
    {
      title: "شركة تصنيع متوسطة",
      description: "نظام إدارة المخزون والإنتاج",
      results: "تقليل التكاليف بنسبة 35%",
      metrics: "تحسين دقة المخزون 95%"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredFeatures: checked 
        ? [...prev.requiredFeatures, feature]
        : prev.requiredFeatures.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('integrated-service-request', {
        body: {
          serviceType: 'business-solutions',
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لمناقشة حلول أعمالك الرقمية",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectBudget: "",
        projectTimeline: "",
        description: "",
        requiredFeatures: [],
        currentSystems: "",
        integrationNeeds: "",
        securityRequirements: "",
        scalabilityNeeds: ""
      });

    } catch (error) {
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-purple-400/20 text-purple-100 border-purple-300/30 text-lg px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              حلول الأعمال الرقمية
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              أعمال ذكية
              <span className="text-purple-200 block mt-2">ونتائج استثنائية</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              منصات رقمية متكاملة لإدارة الأعمال تشمل أنظمة إدارة العملاء والمخزون والمحاسبة
              لتحويل عملك إلى مؤسسة رقمية متطورة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
                <TrendingUp className="w-5 h-5 mr-2" />
                احصل على نظامك الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <MessageSquare className="w-5 h-5 mr-2" />
                استشارة مجانية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Modules */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              وحدات النظام الأساسية
            </h2>
            <p className="text-xl text-muted-foreground">حلول شاملة لجميع أقسام عملك</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{module.name}</h3>
                          <div className="text-sm text-muted-foreground">{module.progress}% اكتمال</div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${module.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              منهجية التنفيذ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              رحلة تحويل أعمالك رقمياً
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتبع منهجية مدروسة لضمان نجاح التحول الرقمي لأعمالك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {implementationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 text-center relative">
                    <CardHeader>
                      <motion.div 
                        className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Benefits & Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
              قصص النجاح
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              نتائج حقيقية لشركات حقيقية
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {businessBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold text-sm">{benefit.results}</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-blue-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-semibold text-sm">{benefit.metrics}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              احصل على حلولك الآن
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              طلب حل أعمال رقمي متكامل
            </h2>
            <p className="text-xl text-muted-foreground">
              أخبرنا عن احتياجاتك وسنصمم الحل المثالي لعملك
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl border-border/50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="text-right"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="text-right"
                        placeholder="+966 5X XXX XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">اسم الشركة *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        required
                        className="text-right"
                        placeholder="اسم شركتك أو مؤسستك"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">الميزانية المتوقعة *</Label>
                      <Select onValueChange={(value) => handleInputChange('projectBudget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الميزانية المناسبة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100000-200000">100,000 - 200,000 ريال</SelectItem>
                          <SelectItem value="200000-500000">200,000 - 500,000 ريال</SelectItem>
                          <SelectItem value="500000-1000000">500,000 - 1,000,000 ريال</SelectItem>
                          <SelectItem value="1000000-2000000">1,000,000 - 2,000,000 ريال</SelectItem>
                          <SelectItem value="2000000+">أكثر من 2,000,000 ريال</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">الجدولة الزمنية المطلوبة *</Label>
                      <Select onValueChange={(value) => handleInputChange('projectTimeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-6 months">3-6 أشهر</SelectItem>
                          <SelectItem value="6-12 months">6-12 شهر</SelectItem>
                          <SelectItem value="12-18 months">12-18 شهر</SelectItem>
                          <SelectItem value="18+ months">أكثر من 18 شهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف احتياجات عملك *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      className="min-h-[120px] text-right"
                      placeholder="اشرح لنا طبيعة عملك والتحديات التي تواجهها..."
                    />
                  </div>

                  {/* Required Features */}
                  <div className="space-y-4">
                    <Label>الوحدات المطلوبة (اختر ما يناسب عملك):</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {businessFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`feature-${index}`}
                            checked={formData.requiredFeatures.includes(feature)}
                            onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                          />
                          <Label 
                            htmlFor={`feature-${index}`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business Requirements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentSystems">الأنظمة التجارية الحالية</Label>
                      <Textarea
                        id="currentSystems"
                        value={formData.currentSystems}
                        onChange={(e) => handleInputChange('currentSystems', e.target.value)}
                        className="text-right"
                        placeholder="اذكر الأنظمة التي تستخدمها حالياً في إدارة أعمالك..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="integrationNeeds">احتياجات الربط والتكامل</Label>
                      <Textarea
                        id="integrationNeeds"
                        value={formData.integrationNeeds}
                        onChange={(e) => handleInputChange('integrationNeeds', e.target.value)}
                        className="text-right"
                        placeholder="هل تحتاج لربط النظام بأنظمة مالية أو محاسبية أخرى؟"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="securityRequirements">متطلبات الأمان والخصوصية</Label>
                      <Textarea
                        id="securityRequirements"
                        value={formData.securityRequirements}
                        onChange={(e) => handleInputChange('securityRequirements', e.target.value)}
                        className="text-right"
                        placeholder="ما هي متطلبات الأمان الخاصة ببيانات عملك؟"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scalabilityNeeds">خطط النمو والتوسع</Label>
                      <Textarea
                        id="scalabilityNeeds"
                        value={formData.scalabilityNeeds}
                        onChange={(e) => handleInputChange('scalabilityNeeds', e.target.value)}
                        className="text-right"
                        placeholder="ما هي خططك للنمو وزيادة حجم العمليات؟"
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال طلب الحل التجاري
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessSolutions;