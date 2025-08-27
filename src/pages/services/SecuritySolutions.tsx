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
  Shield,
  Lock,
  Eye,
  Network,
  AlertTriangle,
  Key,
  Fingerprint,
  Server,
  CheckCircle,
  Star,
  Clock,
  Send,
  Monitor,
  Settings,
  BarChart3,
  TrendingUp,
  Layers,
  Users,
  Bell,
  Search
} from "lucide-react";

const SecuritySolutions = () => {
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
    document.title = "حلول الأمان الشامل | ASH HOLDING";
    const desc = "أنظمة أمان متكاملة تشمل حماية البيانات والشبكات ومراقبة الأنظمة والامتثال";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const securityFeatures = [
    "أنظمة حماية الشبكات المتقدمة",
    "تشفير البيانات والاتصالات",
    "مراقبة الأمان على مدار الساعة",
    "إدارة الهوية والوصول",
    "حماية من التهديدات السيبرانية",
    "أنظمة كشف التسلل والاختراق",
    "حلول النسخ الاحتياطي الآمن",
    "إدارة الثغرات الأمنية",
    "التدقيق الأمني والامتثال",
    "تدريب فرق الأمان السيبراني"
  ];

  const securityServices = [
    { name: "حماية الشبكات", icon: Network, level: "عالي" },
    { name: "تشفير البيانات", icon: Lock, level: "عسكري" },
    { name: "المراقبة المستمرة", icon: Eye, level: "24/7" },
    { name: "إدارة الهوية", icon: Fingerprint, level: "متقدم" },
    { name: "كشف التهديدات", icon: Search, level: "ذكي" },
    { name: "الاستجابة للحوادث", icon: Bell, level: "فوري" }
  ];

  const securitySteps = [
    {
      title: "التقييم الأمني الشامل",
      description: "تحليل شامل للثغرات والمخاطر الأمنية",
      icon: Monitor,
      duration: "1-2 أسابيع"
    },
    {
      title: "تصميم الحلول الأمنية",
      description: "وضع استراتيجية أمنية متكاملة",
      icon: Layers,
      duration: "2-3 أسابيع"
    },
    {
      title: "التنفيذ والتطبيق",
      description: "تطبيق الحلول الأمنية المتقدمة",
      icon: Settings,
      duration: "4-10 أسابيع"
    },
    {
      title: "المراقبة والتحسين",
      description: "مراقبة مستمرة وتحديث الحماية",
      icon: TrendingUp,
      duration: "مستمر"
    }
  ];

  const securityBenefits = [
    {
      title: "بنك تجاري رائد",
      description: "حماية أمنية شاملة لـ 2 مليون عميل",
      results: "صفر اختراقات أمنية",
      metrics: "امتثال 100% للمعايير المصرفية"
    },
    {
      title: "مستشفى متخصص",
      description: "حماية بيانات المرضى والسجلات الطبية",
      results: "تأمين 500,000 سجل طبي",
      metrics: "امتثال كامل لمعايير HIPAA"
    },
    {
      title: "شركة تقنية كبرى",
      description: "حماية الملكية الفكرية والبيانات",
      results: "منع 99.9% من التهديدات",
      metrics: "توفير 80% من وقت الاستجابة"
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
          serviceType: 'security-solutions',
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لمناقشة حلولك الأمنية",
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
      <section className="pt-24 pb-16 bg-gradient-to-br from-red-600 via-red-700 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-red-300/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 5, 
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
            <Badge className="mb-6 bg-orange-400/20 text-orange-100 border-orange-300/30 text-lg px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              حلول الأمان الشامل
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              حماية لا تقهر
              <span className="text-orange-200 block mt-2">لأعمال آمنة تماماً</span>
            </h1>
            
            <p className="text-xl text-red-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              أنظمة أمان متكاملة تشمل حماية البيانات والشبكات ومراقبة الأنظمة والامتثال
              لضمان أقصى مستويات الحماية لأعمالك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Lock className="w-5 h-5 mr-2" />
                احم أعمالك الآن
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <AlertTriangle className="w-5 h-5 mr-2" />
                تقييم أمني مجاني
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Services */}
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
              خدمات الأمان المتقدمة
            </h2>
            <p className="text-xl text-muted-foreground">حماية شاملة بأعلى المعايير العالمية</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityServices.map((service, index) => {
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
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{service.name}</h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs text-red-600 border-red-200"
                          >
                            {service.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-red-500 to-orange-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
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

      {/* Security Implementation Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
              منهجية الحماية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              نهج شامل للأمان الرقمي
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نطبق أفضل الممارسات العالمية لضمان أقصى حماية لأصولك الرقمية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securitySteps.map((step, index) => {
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
                        className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/20 transition-colors"
                        whileHover={{ scale: 1.1, rotateY: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <IconComponent className="w-8 h-8 text-red-600" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-xs border-red-200">
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

      {/* Security Benefits & Case Studies */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
              أمان مُثبت
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              حماية نالت ثقة الكبار
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {securityBenefits.map((benefit, index) => (
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
                      <Badge className="bg-green-100 text-green-700 text-xs">محمي تماماً</Badge>
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Shield className="w-4 h-4" />
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
            <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
              احم أعمالك الآن
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              طلب حل أمني شامل
            </h2>
            <p className="text-xl text-muted-foreground">
              احصل على أقوى الحلول الأمنية لحماية أصولك الرقمية
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
                          <SelectItem value="100000-300000">100,000 - 300,000 ريال</SelectItem>
                          <SelectItem value="300000-600000">300,000 - 600,000 ريال</SelectItem>
                          <SelectItem value="600000-1000000">600,000 - 1,000,000 ريال</SelectItem>
                          <SelectItem value="1000000-2000000">1,000,000 - 2,000,000 ريال</SelectItem>
                          <SelectItem value="2000000+">أكثر من 2,000,000 ريال</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">جدولة التنفيذ *</Label>
                      <Select onValueChange={(value) => handleInputChange('projectTimeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت المناسب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">عاجل - خلال شهر</SelectItem>
                          <SelectItem value="2-4 months">2-4 أشهر</SelectItem>
                          <SelectItem value="4-8 months">4-8 أشهر</SelectItem>
                          <SelectItem value="8+ months">أكثر من 8 أشهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف التحديات الأمنية الحالية *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      className="min-h-[120px] text-right"
                      placeholder="اشرح لنا التحديات الأمنية التي تواجهها ومستوى الحماية المطلوب..."
                    />
                  </div>

                  {/* Required Features */}
                  <div className="space-y-4">
                    <Label>الحلول الأمنية المطلوبة:</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {securityFeatures.map((feature, index) => (
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

                  {/* Security Requirements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentSystems">الأنظمة الأمنية الحالية</Label>
                      <Textarea
                        id="currentSystems"
                        value={formData.currentSystems}
                        onChange={(e) => handleInputChange('currentSystems', e.target.value)}
                        className="text-right"
                        placeholder="اذكر الحلول الأمنية التي تستخدمها حالياً..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="integrationNeeds">احتياجات التكامل الأمني</Label>
                      <Textarea
                        id="integrationNeeds"
                        value={formData.integrationNeeds}
                        onChange={(e) => handleInputChange('integrationNeeds', e.target.value)}
                        className="text-right"
                        placeholder="هل تحتاج لربط الحلول الأمنية بأنظمة موجودة؟"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="securityRequirements">معايير الامتثال المطلوبة</Label>
                      <Textarea
                        id="securityRequirements"
                        value={formData.securityRequirements}
                        onChange={(e) => handleInputChange('securityRequirements', e.target.value)}
                        className="text-right"
                        placeholder="هل تحتاج للامتثال لمعايير محددة مثل ISO 27001؟"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scalabilityNeeds">خطط النمو الأمني</Label>
                      <Textarea
                        id="scalabilityNeeds"
                        value={formData.scalabilityNeeds}
                        onChange={(e) => handleInputChange('scalabilityNeeds', e.target.value)}
                        className="text-right"
                        placeholder="ما هي خططك لتوسيع الحماية الأمنية مستقبلاً؟"
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
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال طلب الحل الأمني
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

export default SecuritySolutions;