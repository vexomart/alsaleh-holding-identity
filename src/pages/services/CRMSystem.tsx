import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Settings,
  Users,
  Database,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Send,
  Monitor,
  ArrowLeft,
  LineChart,
  PieChart,
  UserCheck,
  Bell,
  Calendar,
  FileText,
  TrendingUp,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const CRMSystem = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    companySize: "",
    industry: "",
    timeline: "",
    description: "",
    requiredFeatures: [] as string[],
    currentSystem: "",
    budget: ""
  });

  useEffect(() => {
    document.title = "نظام إدارة العملاء CRM | ASH HOLDING";
    const desc = "نظام CRM متطور لإدارة علاقات العملاء وتحسين المبيعات وزيادة الإنتاجية";
    
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const crmFeatures = [
    "إدارة جهات الاتصال",
    "تتبع العملاء المحتملين",
    "إدارة الصفقات والمبيعات",
    "أتمتة التسويق",
    "تقارير وتحليلات متقدمة",
    "إدارة المهام والأنشطة",
    "التكامل مع الأنظمة الأخرى",
    "تطبيق جوال متكامل",
    "دعم متعدد اللغات",
    "أمان وخصوصية البيانات"
  ];

  const modules = [
    { name: "إدارة العملاء", icon: Users, description: "قاعدة بيانات مركزية لجميع العملاء" },
    { name: "تتبع المبيعات", icon: TrendingUp, description: "متابعة الصفقات من البداية للنهاية" },
    { name: "التقارير", icon: BarChart3, description: "تحليلات ولوحات تحكم تفاعلية" },
    { name: "الأتمتة", icon: Zap, description: "أتمتة المهام المتكررة" }
  ];

  const features = [
    {
      title: "إدارة ذكية للعملاء",
      description: "تنظيم وتتبع جميع تفاعلات العملاء في مكان واحد",
      icon: UserCheck,
      color: "from-violet-500 to-purple-500"
    },
    {
      title: "تحليلات متقدمة",
      description: "رؤى عميقة حول أداء المبيعات والعملاء",
      icon: PieChart,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "أتمتة العمليات",
      description: "توفير الوقت عبر أتمتة المهام المتكررة",
      icon: Settings,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "أمان متقدم",
      description: "حماية بيانات العملاء بأعلى معايير الأمان",
      icon: Shield,
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "40%", label: "زيادة في المبيعات", icon: TrendingUp },
    { value: "60%", label: "توفير في الوقت", icon: Zap },
    { value: "90%", label: "رضا العملاء", icon: Star },
    { value: "100+", label: "شركة تستخدمه", icon: Users }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      toast({
        title: "تم إرسال طلبك بنجاح!",
        description: "سنتواصل معك خلال 24 ساعة",
      });
      setFormData({
        name: "", email: "", phone: "", company: "", companySize: "",
        industry: "", timeline: "", description: "", requiredFeatures: [],
        currentSystem: "", budget: ""
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-gradient-to-l from-violet-500 to-purple-600 text-white px-4 py-1.5 text-sm font-bold mb-6">
              <Settings className="w-4 h-4 ml-2" />
              نظام متكامل
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-to-l from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                نظام إدارة
              </span>
              <br />
              <span className="bg-gradient-to-l from-violet-500 to-purple-600 bg-clip-text text-transparent">
                العملاء CRM
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              نظام متطور لإدارة علاقات العملاء يساعدك على تنظيم بياناتك وزيادة مبيعاتك وتحسين خدمة العملاء
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-l from-violet-500 to-purple-600 text-white rounded-full px-8">
                  <Zap className="w-5 h-5 ml-2" />
                  جرب مجاناً
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  شاهد العرض التوضيحي
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-violet-400" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">وحدات النظام</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نظام متكامل يغطي جميع احتياجات إدارة علاقات العملاء
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {modules.map((module, index) => (
              <motion.div key={module.name} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{module.name}</h3>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">مميزات النظام</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-14 h-14 rounded-xl bg-gradient-to-br mb-4 flex items-center justify-center",
                      feature.color
                    )}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 mb-4">
              لوحة التحكم
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">واجهة سهلة الاستخدام</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video max-w-4xl mx-auto bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-xl shadow-inner p-4">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-2">
                    <div className="h-8 bg-violet-100 dark:bg-violet-900/30 rounded" />
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded" />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-lg" />
                      <div className="h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg" />
                      <div className="h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg" />
                    </div>
                    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-6">اطلب نظام CRM</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>الاسم الكامل</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>البريد الإلكتروني</Label>
                        <Input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>رقم الهاتف</Label>
                        <Input 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>اسم الشركة</Label>
                        <Input 
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>حجم الشركة</Label>
                        <Select value={formData.companySize} onValueChange={(v) => setFormData({...formData, companySize: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحجم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 موظفين</SelectItem>
                            <SelectItem value="11-50">11-50 موظف</SelectItem>
                            <SelectItem value="51-200">51-200 موظف</SelectItem>
                            <SelectItem value="200+">أكثر من 200</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>القطاع</Label>
                        <Select value={formData.industry} onValueChange={(v) => setFormData({...formData, industry: v})}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر القطاع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retail">تجارة التجزئة</SelectItem>
                            <SelectItem value="services">خدمات</SelectItem>
                            <SelectItem value="tech">تقنية</SelectItem>
                            <SelectItem value="healthcare">صحة</SelectItem>
                            <SelectItem value="education">تعليم</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>وصف الاحتياجات</Label>
                      <Textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        placeholder="اشرح احتياجاتك من نظام CRM..."
                      />
                    </div>

                    <div>
                      <Label className="mb-3 block">الميزات المطلوبة</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {crmFeatures.slice(0, 6).map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Checkbox 
                              id={feature}
                              checked={formData.requiredFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({...formData, requiredFeatures: [...formData.requiredFeatures, feature]});
                                } else {
                                  setFormData({...formData, requiredFeatures: formData.requiredFeatures.filter(f => f !== feature)});
                                }
                              }}
                            />
                            <Label htmlFor={feature} className="text-sm">{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-l from-violet-500 to-purple-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                      <Send className="w-5 h-5 mr-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features List */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">مميزات النظام الكاملة</h3>
              <div className="space-y-4">
                {crmFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm"
                  >
                    <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-l from-violet-500 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              جاهز لتحسين إدارة عملائك؟
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              احصل على عرض توضيحي مجاني واكتشف كيف يمكن لنظام CRM مساعدتك
            </p>
            <Link to="/consultation">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                احصل على عرض مجاني
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CRMSystem;
