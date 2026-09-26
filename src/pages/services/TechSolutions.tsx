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
  Code,
  Smartphone,
  Monitor,
  Database,
  Cloud,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Users,
  Clock,
  ArrowRight,
  Send,
  Lightbulb,
  Layers,
  Globe,
  Server
} from "lucide-react";

const TechSolutions = () => {
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
    document.title = "الحلول التقنية الشاملة | ASH HOLDING";
    const desc = "حلول تقنية متكاملة تشمل تطوير البرمجيات والمواقع والتطبيقات مع خدمات الاستضافة والصيانة";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const techFeatures = [
    "تطوير تطبيقات الويب المتقدمة",
    "تطوير تطبيقات الهاتف المحمول",
    "أنظمة إدارة قواعد البيانات",
    "حلول التكامل مع واجهات برمجة التطبيقات",
    "أنظمة الدفع الإلكتروني",
    "حلول الذكاء الاصطناعي والتعلم الآلي",
    "أنظمة إدارة المحتوى المخصصة",
    "حلول التجارة الإلكترونية المتقدمة",
    "أنظمة إدارة علاقات العملاء",
    "حلول التحليلات والتقارير المتقدمة"
  ];

  const techStack = [
    { name: "React & Next.js", icon: Code, progress: 98 },
    { name: "Node.js & Python", icon: Server, progress: 95 },
    { name: "Mobile Development", icon: Smartphone, progress: 92 },
    { name: "Cloud Solutions", icon: Cloud, progress: 90 },
    { name: "Database Design", icon: Database, progress: 88 },
    { name: "AI & Machine Learning", icon: Lightbulb, progress: 85 }
  ];

  const processSteps = [
    {
      title: "تحليل المتطلبات",
      description: "دراسة شاملة لاحتياجاتك التقنية",
      icon: Layers,
      duration: "1-2 أسابيع"
    },
    {
      title: "التصميم والتخطيط",
      description: "تصميم النظام والواجهات التفاعلية",
      icon: Monitor,
      duration: "2-3 أسابيع"
    },
    {
      title: "التطوير والبرمجة",
      description: "تطوير النظام باستخدام أحدث التقنيات",
      icon: Code,
      duration: "4-8 أسابيع"
    },
    {
      title: "الاختبار والنشر",
      description: "اختبار شامل ونشر آمن للنظام",
      icon: Shield,
      duration: "1-2 أسابيع"
    }
  ];

  const successStories = [
    {
      title: "منصة التجارة الإلكترونية المتقدمة",
      description: "تطوير منصة متكاملة مع أكثر من 50,000 منتج",
      results: "زيادة المبيعات بنسبة 300%"
    },
    {
      title: "نظام إدارة المستشفيات",
      description: "نظام شامل لإدارة العمليات الطبية",
      results: "تحسين الكفاءة بنسبة 250%"
    },
    {
      title: "تطبيق الخدمات المصرفية",
      description: "تطبيق آمن للخدمات المصرفية الرقمية",
      results: "أكثر من 100,000 مستخدم نشط"
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
          serviceType: 'tech-solutions',
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لمناقشة تفاصيل مشروعك التقني",
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
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"
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
          className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl"
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
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-4 py-2">
              <Code className="w-4 h-4 mr-2" />
              الحلول التقنية الشاملة
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              تقنيات متقدمة
              <span className="text-secondary block mt-2">لمستقبل رقمي مبهر</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              حلول تقنية متكاملة تشمل تطوير البرمجيات والمواقع والتطبيقات مع خدمات الاستضافة والصيانة
              لتحويل أفكارك إلى واقع رقمي متميز
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Zap className="w-5 h-5 mr-2" />
                ابدأ مشروعك الآن
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Users className="w-5 h-5 mr-2" />
                تحدث مع خبير تقني
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
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
              التقنيات التي نتقنها
            </h2>
            <p className="text-xl text-muted-foreground">أحدث التقنيات لحلول متطورة</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
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
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{tech.name}</h3>
                          <div className="text-sm text-muted-foreground">{tech.progress}% إتقان</div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.progress}%` }}
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

      {/* Process Steps */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              منهجية العمل
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              رحلة تطوير مشروعك التقني
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتبع منهجية علمية مدروسة لضمان نجاح مشروعك
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 text-center">
                    <CardHeader>
                      <motion.div 
                        className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-primary" />
                      </motion.div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm">
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

      {/* Success Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              قصص النجاح
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              مشاريع غيرت قواعد اللعبة
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
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
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <CardDescription>{story.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-semibold text-sm">{story.results}</span>
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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              ابدأ مشروعك الآن
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              طلب حل تقني متكامل
            </h2>
            <p className="text-xl text-muted-foreground">
              أخبرنا عن مشروعك وسنقدم لك أفضل الحلول التقنية
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
                      <Label htmlFor="company">اسم الشركة</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
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
                          <SelectItem value="50000-100000">50,000 - 100,000 ريال</SelectItem>
                          <SelectItem value="100000-250000">100,000 - 250,000 ريال</SelectItem>
                          <SelectItem value="250000-500000">250,000 - 500,000 ريال</SelectItem>
                          <SelectItem value="500000-1000000">500,000 - 1,000,000 ريال</SelectItem>
                          <SelectItem value="1000000+">أكثر من 1,000,000 ريال</SelectItem>
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
                          <SelectItem value="1-3 months">1-3 أشهر</SelectItem>
                          <SelectItem value="3-6 months">3-6 أشهر</SelectItem>
                          <SelectItem value="6-12 months">6-12 شهر</SelectItem>
                          <SelectItem value="12+ months">أكثر من 12 شهر</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف المشروع والأهداف *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      className="min-h-[120px] text-right"
                      placeholder="اشرح لنا فكرة مشروعك والأهداف المرجوة منه..."
                    />
                  </div>

                  {/* Required Features */}
                  <div className="space-y-4">
                    <Label>الميزات المطلوبة (اختر ما يناسبك):</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {techFeatures.map((feature, index) => (
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

                  {/* Technical Requirements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentSystems">الأنظمة الحالية (إن وجدت)</Label>
                      <Textarea
                        id="currentSystems"
                        value={formData.currentSystems}
                        onChange={(e) => handleInputChange('currentSystems', e.target.value)}
                        className="text-right"
                        placeholder="اذكر الأنظمة التي تستخدمها حالياً..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="integrationNeeds">احتياجات التكامل</Label>
                      <Textarea
                        id="integrationNeeds"
                        value={formData.integrationNeeds}
                        onChange={(e) => handleInputChange('integrationNeeds', e.target.value)}
                        className="text-right"
                        placeholder="هل تحتاج لربط النظام بأنظمة أخرى؟"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="securityRequirements">متطلبات الأمان</Label>
                      <Textarea
                        id="securityRequirements"
                        value={formData.securityRequirements}
                        onChange={(e) => handleInputChange('securityRequirements', e.target.value)}
                        className="text-right"
                        placeholder="ما هي متطلبات الأمان الخاصة بك؟"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scalabilityNeeds">احتياجات التوسع المستقبلي</Label>
                      <Textarea
                        id="scalabilityNeeds"
                        value={formData.scalabilityNeeds}
                        onChange={(e) => handleInputChange('scalabilityNeeds', e.target.value)}
                        className="text-right"
                        placeholder="هل تخطط لتوسيع النظام مستقبلاً؟"
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
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال طلب الحل التقني
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

export default TechSolutions;