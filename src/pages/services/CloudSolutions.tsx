import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Cloud,
  Server,
  Database,
  Shield,
  Zap,
  Globe,
  HardDrive,
  Network,
  CheckCircle,
  Star,
  Clock,
  Send,
  Monitor,
  Settings,
  BarChart3,
  TrendingUp,
  Layers,
  Lock,
  Users,
  ArrowUp
} from "lucide-react";

const CloudSolutions = () => {
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
    document.title = "الحلول السحابية المتقدمة | ASH HOLDING";
    const desc = "بنية تحتية سحابية متكاملة مع خدمات الحوسبة والتخزين والأمان وإدارة البيانات";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const cloudFeatures = [
    "خدمات الحوسبة السحابية المرنة",
    "حلول التخزين الآمن والمشفر",
    "شبكات التوصيل السريع (CDN)",
    "أنظمة النسخ الاحتياطي التلقائي",
    "حلول قواعد البيانات السحابية",
    "أنظمة المراقبة والتنبيهات",
    "خدمات الأمان والحماية المتقدمة",
    "حلول التوسع التلقائي",
    "إدارة الهوية والوصول السحابي",
    "خدمات التطوير والنشر السحابي"
  ];

  const cloudServices = [
    { name: "خدمات الحوسبة", icon: Server, coverage: "99.9%" },
    { name: "التخزين السحابي", icon: HardDrive, coverage: "99.99%" },
    { name: "قواعد البيانات", icon: Database, coverage: "99.9%" },
    { name: "الشبكات والأمان", icon: Shield, coverage: "99.95%" },
    { name: "المراقبة والتحليل", icon: BarChart3, coverage: "99.8%" },
    { name: "خدمات التطوير", icon: Settings, coverage: "99.7%" }
  ];

  const migrationSteps = [
    {
      title: "تقييم البنية التحتية",
      description: "تحليل شامل للأنظمة والبيانات الحالية",
      icon: Monitor,
      duration: "1-2 أسابيع"
    },
    {
      title: "تخطيط الهجرة",
      description: "وضع استراتيجية الانتقال للسحابة",
      icon: Layers,
      duration: "2-3 أسابيع"
    },
    {
      title: "تنفيذ الهجرة",
      description: "نقل البيانات والأنظمة بأمان",
      icon: Cloud,
      duration: "4-8 أسابيع"
    },
    {
      title: "التحسين والمراقبة",
      description: "تحسين الأداء ومراقبة مستمرة",
      icon: TrendingUp,
      duration: "مستمر"
    }
  ];

  const cloudBenefits = [
    {
      title: "شركة تقنية ناشئة",
      description: "هجرة كاملة للحوسبة السحابية",
      results: "توفير 60% من تكاليف IT",
      metrics: "زيادة سرعة التطوير 200%"
    },
    {
      title: "مؤسسة تعليمية كبرى",
      description: "منصة تعليمية سحابية لـ 100,000 طالب",
      results: "تحسين الوصولية 95%",
      metrics: "توفير 40% من التكاليف التشغيلية"
    },
    {
      title: "شركة تجارة إلكترونية",
      description: "بنية تحتية مرنة تدعم النمو السريع",
      results: "تحمل ضغط المبيعات 500%",
      metrics: "صفر توقف في أوقات الذروة"
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
          serviceType: 'cloud-solutions',
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لمناقشة حلولك السحابية",
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
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-300/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 4, 
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
            <Badge className="mb-6 bg-cyan-400/20 text-cyan-100 border-cyan-300/30 text-lg px-4 py-2">
              <Cloud className="w-4 h-4 mr-2" />
              الحلول السحابية المتقدمة
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              السحابة التي
              <span className="text-cyan-200 block mt-2">تحلق بأعمالك عالياً</span>
            </h1>
            
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              بنية تحتية سحابية متكاملة مع خدمات الحوسبة والتخزين والأمان وإدارة البيانات
              لتحويل أعمالك إلى عالم لا حدود له
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <ArrowUp className="w-5 h-5 mr-2" />
                ارتق للسحابة الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Globe className="w-5 h-5 mr-2" />
                استشارة تقنية مجانية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cloud Services */}
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
              خدماتنا السحابية المتقدمة
            </h2>
            <p className="text-xl text-muted-foreground">موثوقية عالية وأداء استثنائي</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudServices.map((service, index) => {
              const IconComponent = service.icon;
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
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          <div className="text-sm text-green-600 font-medium">
                            {service.coverage} وقت التشغيل
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${parseFloat(service.coverage)}%` }}
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

      {/* Migration Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
              رحلة الهجرة السحابية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              انتقال آمن وسلس للسحابة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نضمن انتقالاً سلساً وآمناً لجميع أنظمتك وبياناتك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {migrationSteps.map((step, index) => {
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
                        className="w-16 h-16 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/20 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-cyan-600" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-xs border-cyan-200">
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

      {/* Cloud Benefits & Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              قصص نجاح سحابية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              تحولات رقمية ملهمة
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {cloudBenefits.map((benefit, index) => (
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
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-green-100 text-green-700 text-xs">نجاح باهر</Badge>
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold text-sm">{benefit.results}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3">
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
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
              ابدأ رحلتك السحابية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              طلب حل سحابي متقدم
            </h2>
            <p className="text-xl text-muted-foreground">
              حول أعمالك للسحابة مع أفضل الممارسات والحلول المتقدمة
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
                      <Label htmlFor="budget">الميزانية الشهرية المتوقعة *</Label>
                      <Select onValueChange={(value) => handleInputChange('projectBudget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الميزانية المناسبة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5000-15000">5,000 - 15,000 ريال شهرياً</SelectItem>
                          <SelectItem value="15000-30000">15,000 - 30,000 ريال شهرياً</SelectItem>
                          <SelectItem value="30000-60000">30,000 - 60,000 ريال شهرياً</SelectItem>
                          <SelectItem value="60000-100000">60,000 - 100,000 ريال شهرياً</SelectItem>
                          <SelectItem value="100000+">أكثر من 100,000 ريال شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">جدولة الهجرة السحابية *</Label>
                      <Select onValueChange={(value) => handleInputChange('projectTimeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">فوري - خلال شهر</SelectItem>
                          <SelectItem value="1-3 months">1-3 أشهر</SelectItem>
                          <SelectItem value="3-6 months">3-6 أشهر</SelectItem>
                          <SelectItem value="6+ months">أكثر من 6 أشهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف البنية التحتية الحالية *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      className="min-h-[120px] text-right"
                      placeholder="اشرح لنا البنية التحتية الحالية والتحديات التي تواجهها..."
                    />
                  </div>

                  {/* Required Features */}
                  <div className="space-y-4">
                    <Label>الخدمات السحابية المطلوبة:</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {cloudFeatures.map((feature, index) => (
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

                  {/* Cloud Requirements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentSystems">الأنظمة والتطبيقات الحالية</Label>
                      <Textarea
                        id="currentSystems"
                        value={formData.currentSystems}
                        onChange={(e) => handleInputChange('currentSystems', e.target.value)}
                        className="text-right"
                        placeholder="اذكر الأنظمة والتطبيقات التي تريد نقلها للسحابة..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="integrationNeeds">احتياجات التكامل</Label>
                      <Textarea
                        id="integrationNeeds"
                        value={formData.integrationNeeds}
                        onChange={(e) => handleInputChange('integrationNeeds', e.target.value)}
                        className="text-right"
                        placeholder="هل تحتاج لربط الحلول السحابية بأنظمة محلية؟"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="securityRequirements">متطلبات الأمان والامتثال</Label>
                      <Textarea
                        id="securityRequirements"
                        value={formData.securityRequirements}
                        onChange={(e) => handleInputChange('securityRequirements', e.target.value)}
                        className="text-right"
                        placeholder="ما هي متطلبات الأمان والامتثال للوائح؟"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scalabilityNeeds">احتياجات النمو والتوسع</Label>
                      <Textarea
                        id="scalabilityNeeds"
                        value={formData.scalabilityNeeds}
                        onChange={(e) => handleInputChange('scalabilityNeeds', e.target.value)}
                        className="text-right"
                        placeholder="ما هي توقعاتك لنمو البيانات والمستخدمين؟"
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
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال طلب الحل السحابي
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

export default CloudSolutions;