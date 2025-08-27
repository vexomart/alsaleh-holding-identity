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
  Globe,
  Server,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Clock,
  Send,
  Monitor,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Database,
  Cloud,
  HardDrive
} from "lucide-react";

const HostingServices = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    websiteType: "",
    expectedTraffic: "",
    hostingType: "",
    timeline: "",
    description: "",
    requiredFeatures: [] as string[],
    currentHosting: "",
    domainName: "",
    specialRequirements: "",
    budget: ""
  });

  useEffect(() => {
    document.title = "استضافة المواقع الإلكترونية | ASH HOLDING";
    const desc = "خدمات استضافة احترافية وموثوقة مع أعلى معايير الأداء والأمان";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const hostingFeatures = [
    "استضافة مشتركة عالية الأداء",
    "خوادم افتراضية خاصة (VPS)",
    "خوادم مخصصة كاملة",
    "استضافة السحابة المرنة",
    "شهادات SSL مجانية",
    "نسخ احتياطي يومي تلقائي",
    "دعم فني على مدار الساعة",
    "لوحة تحكم cPanel سهلة الاستخدام",
    "حماية DDoS متقدمة",
    "ضمان وقت تشغيل 99.9%"
  ];

  const hostingTypes = [
    { name: "الاستضافة المشتركة", icon: Users, uptime: "99.9%" },
    { name: "الخوادم الافتراضية VPS", icon: Server, uptime: "99.95%" },
    { name: "الخوادم المخصصة", icon: Database, uptime: "99.98%" },
    { name: "الاستضافة السحابية", icon: Cloud, uptime: "99.99%" }
  ];

  const features = [
    {
      title: "أداء فائق السرعة",
      description: "خوادم SSD عالية السرعة مع CDN عالمي",
      icon: Zap,
      benefits: ["سرعة تحميل أقل من ثانية واحدة", "تحسين أداء محركات البحث"]
    },
    {
      title: "أمان متقدم",
      description: "حماية شاملة ضد جميع التهديدات السيبرانية",
      icon: Shield,
      benefits: ["مراقبة أمنية 24/7", "جدار حماية متطور"]
    },
    {
      title: "دعم فني ممتاز",
      description: "فريق دعم متخصص يعمل على مدار الساعة",
      icon: Users,
      benefits: ["استجابة خلال دقائق", "حلول شخصية لكل مشكلة"]
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
          serviceType: 'hosting-services',
          ...formData
        }
      });

      if (error) throw error;

      toast({
        title: "تم إرسال طلبك بنجاح! ✅",
        description: "سيتم التواصل معك خلال 24 ساعة لمناقشة خدمات الاستضافة",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        websiteType: "",
        expectedTraffic: "",
        hostingType: "",
        timeline: "",
        description: "",
        requiredFeatures: [],
        currentHosting: "",
        domainName: "",
        specialRequirements: "",
        budget: ""
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
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-teal-300/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 6, 
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
              <Globe className="w-4 h-4 mr-2" />
              استضافة المواقع الإلكترونية
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              استضافة موثوقة
              <span className="text-cyan-200 block mt-2">لموقع يعمل دائماً</span>
            </h1>
            
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              خدمات استضافة احترافية وموثوقة مع أعلى معايير الأداء والأمان
              لضمان عمل موقعك بأفضل حالاته على مدار الساعة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Server className="w-5 h-5 mr-2" />
                اختر خطة الاستضافة
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Monitor className="w-5 h-5 mr-2" />
                استشارة مجانية
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hosting Types */}
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
              أنواع الاستضافة المتاحة
            </h2>
            <p className="text-xl text-muted-foreground">اختر ما يناسب احتياجات موقعك</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hostingTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{type.name}</h3>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {type.uptime} وقت تشغيل
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
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
              مميزات خاصة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لماذا تختار استضافتنا؟
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader>
                      <motion.div 
                        className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </motion.div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              اطلب خدمتك الآن
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              طلب خدمة استضافة
            </h2>
            <p className="text-xl text-muted-foreground">
              احصل على أفضل حلول الاستضافة لموقعك
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

                  {/* Website Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="websiteType">نوع الموقع *</Label>
                      <Select onValueChange={(value) => handleInputChange('websiteType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الموقع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">موقع تجاري</SelectItem>
                          <SelectItem value="ecommerce">متجر إلكتروني</SelectItem>
                          <SelectItem value="portfolio">معرض أعمال</SelectItem>
                          <SelectItem value="blog">مدونة</SelectItem>
                          <SelectItem value="news">موقع إخباري</SelectItem>
                          <SelectItem value="educational">موقع تعليمي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedTraffic">حركة الزوار المتوقعة *</Label>
                      <Select onValueChange={(value) => handleInputChange('expectedTraffic', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر عدد الزوار المتوقع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">أقل من 1000 زائر شهرياً</SelectItem>
                          <SelectItem value="medium">1000 - 10000 زائر شهرياً</SelectItem>
                          <SelectItem value="high">10000 - 100000 زائر شهرياً</SelectItem>
                          <SelectItem value="very-high">أكثر من 100000 زائر شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hostingType">نوع الاستضافة المطلوب *</Label>
                      <Select onValueChange={(value) => handleInputChange('hostingType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الاستضافة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shared">استضافة مشتركة</SelectItem>
                          <SelectItem value="vps">خادم افتراضي VPS</SelectItem>
                          <SelectItem value="dedicated">خادم مخصص</SelectItem>
                          <SelectItem value="cloud">استضافة سحابية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">الميزانية الشهرية *</Label>
                      <Select onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الميزانية المناسبة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100-300">100 - 300 ريال شهرياً</SelectItem>
                          <SelectItem value="300-500">300 - 500 ريال شهرياً</SelectItem>
                          <SelectItem value="500-1000">500 - 1000 ريال شهرياً</SelectItem>
                          <SelectItem value="1000+">أكثر من 1000 ريال شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الموقع والمتطلبات *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      className="min-h-[120px] text-right"
                      placeholder="اشرح لنا طبيعة موقعك ومتطلباته..."
                    />
                  </div>

                  {/* Required Features */}
                  <div className="space-y-4">
                    <Label>الخدمات الإضافية المطلوبة:</Label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {hostingFeatures.map((feature, index) => (
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

                  {/* Additional Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentHosting">الاستضافة الحالية (إن وجدت)</Label>
                      <Textarea
                        id="currentHosting"
                        value={formData.currentHosting}
                        onChange={(e) => handleInputChange('currentHosting', e.target.value)}
                        className="text-right"
                        placeholder="اذكر مزود الاستضافة الحالي والمشاكل التي تواجهها..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domainName">اسم النطاق</Label>
                      <Input
                        id="domainName"
                        value={formData.domainName}
                        onChange={(e) => handleInputChange('domainName', e.target.value)}
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">متطلبات خاصة</Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      className="text-right"
                      placeholder="أي متطلبات تقنية خاصة أو إعدادات معينة..."
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "جاري الإرسال..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          إرسال طلب الاستضافة
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

export default HostingServices;