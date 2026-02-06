import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, Variants, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/ui/back-button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FloatingParticles } from "@/components/customer/hub/FloatingParticles";
import { GlowingOrbs } from "@/components/customer/hub/GlowingOrbs";
import { AnimatedGridPattern } from "@/components/customer/hub/AnimatedGridPattern";
import { 
  Zap, 
  Cpu, 
  Cloud, 
  Shield, 
  CheckCircle, 
  Star,
  MessageCircle,
  Phone,
  Smartphone,
  Database,
  Globe,
  Award,
  Clock,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Settings,
  Users,
  BarChart3,
  Workflow,
  Bot,
  Calendar,
  ArrowRight,
  Rocket,
  Target,
  Layers,
  Code,
  Lock,
  RefreshCw,
  Headphones,
  FileCheck,
  Sparkles
} from "lucide-react";
import BusinessServiceRequestForm from "@/components/BusinessServiceRequestForm";

// Easing constant
const easeOut: Easing = [0.25, 0.1, 0.25, 1];

// Animation variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easeOut }
  }
};

// Memoized animated card component
const AnimatedServiceCard = memo(({ service, index }: { service: any; index: number }) => {
  const IconComponent = service.icon;
  
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-xl overflow-hidden relative">
        {/* Gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ padding: '2px', borderRadius: 'inherit' }}>
          <div className="absolute inset-[2px] bg-white rounded-[inherit]" />
        </div>
        
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
            {service.title}
          </CardTitle>
          <CardDescription className="text-gray-600 leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="space-y-3">
            {service.features.map((feature: string, idx: number) => (
              <motion.div 
                key={idx} 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

AnimatedServiceCard.displayName = 'AnimatedServiceCard';

const DigitalTransformation = () => {
  const navigate = useNavigate();
  const [showServiceForm, setShowServiceForm] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleRequestService = () => {
    setShowServiceForm(true);
  };

  const services = [
    {
      icon: Workflow,
      title: "أتمتة العمليات الذكية",
      description: "تحويل العمليات اليدوية إلى نظم آلية ذكية باستخدام أحدث تقنيات RPA",
      features: ["أتمتة سير العمل المعقد", "تقليل الأخطاء البشرية بنسبة 95%", "تسريع العمليات 10 أضعاف", "توفير التكاليف التشغيلية"],
      color: "from-blue-600 to-cyan-600"
    },
    {
      icon: Database,
      title: "أنظمة ERP المتكاملة",
      description: "حلول ERP مخصصة لإدارة جميع موارد الشركة من مكان واحد",
      features: ["إدارة المخزون الذكية", "المحاسبة والمالية المتقدمة", "إدارة علاقات العملاء CRM", "الموارد البشرية HR"],
      color: "from-purple-600 to-indigo-600"
    },
    {
      icon: Smartphone,
      title: "التطبيقات المخصصة",
      description: "تطوير تطبيقات الويب والجوال المتطورة حسب احتياجاتك",
      features: ["تطبيقات iOS & Android", "منصات الويب التفاعلية", "واجهات مستخدم عصرية", "تطبيقات الأعمال المؤسسية"],
      color: "from-green-600 to-emerald-600"
    },
    {
      icon: Bot,
      title: "الذكاء الاصطناعي",
      description: "تطبيق حلول الذكاء الاصطناعي لتحسين الأداء واتخاذ القرارات",
      features: ["التحليل التنبؤي للبيانات", "معالجة اللغة الطبيعية", "المساعدات الذكية Chatbots", "التشخيص والصيانة التنبؤية"],
      color: "from-orange-600 to-red-600"
    },
    {
      icon: Cloud,
      title: "الحوسبة السحابية",
      description: "ترحيل البنية التحتية إلى السحابة بأمان وكفاءة عالية",
      features: ["ترحيل آمن للبيانات", "بنية تحتية مرنة", "توفير 50% من تكاليف IT", "نسخ احتياطي تلقائي"],
      color: "from-cyan-600 to-blue-600"
    },
    {
      icon: Lock,
      title: "الأمن السيبراني",
      description: "حماية شاملة للبيانات والأنظمة من التهديدات الإلكترونية",
      features: ["جدران حماية متقدمة", "مراقبة 24/7", "اختبار الاختراق", "الامتثال للمعايير الدولية"],
      color: "from-red-600 to-pink-600"
    }
  ];

  const technologies = [
    { name: "React & Node.js", icon: Code, description: "تطوير تطبيقات الويب الحديثة" },
    { name: "Flutter & React Native", icon: Smartphone, description: "تطبيقات الجوال متعددة المنصات" },
    { name: "AWS & Azure & GCP", icon: Cloud, description: "الحوسبة السحابية والبنية التحتية" },
    { name: "AI & Machine Learning", icon: Cpu, description: "حلول الذكاء الاصطناعي المتقدمة" },
    { name: "Blockchain & Web3", icon: Shield, description: "تقنيات البلوك تشين والأمان" },
    { name: "IoT Solutions", icon: Settings, description: "إنترنت الأشياء والأجهزة الذكية" }
  ];

  const benefits = [
    { text: "تحسين الكفاءة التشغيلية بنسبة 60%", icon: TrendingUp },
    { text: "تقليل التكاليف التشغيلية بنسبة 40%", icon: DollarSign },
    { text: "تسريع عمليات الأعمال بنسبة 70%", icon: Zap },
    { text: "تحسين تجربة العملاء ورضاهم", icon: Users },
    { text: "زيادة الإنتاجية والأرباح", icon: BarChart3 },
    { text: "أمان وحماية البيانات 100%", icon: Shield }
  ];

  const process = [
    {
      step: "01",
      title: "التحليل والتقييم",
      description: "دراسة شاملة للأنظمة والعمليات الموجودة وتحديد فرص التحسين",
      duration: "1-2 أسبوع",
      icon: Target
    },
    {
      step: "02",
      title: "التخطيط الاستراتيجي",
      description: "تصميم خارطة طريق التحول الرقمي المناسبة لأهدافك",
      duration: "2-3 أسابيع",
      icon: Lightbulb
    },
    {
      step: "03",
      title: "التطوير والتنفيذ",
      description: "بناء وتطوير الحلول التقنية المطلوبة بأحدث التقنيات",
      duration: "4-12 أسبوع",
      icon: Code
    },
    {
      step: "04",
      title: "الاختبار والتحسين",
      description: "اختبار شامل للحلول وتحسينها لضمان الجودة العالية",
      duration: "2-4 أسابيع",
      icon: FileCheck
    },
    {
      step: "05",
      title: "التدريب والتشغيل",
      description: "تدريب الفرق وضمان التشغيل السلس والانتقال الآمن",
      duration: "2-4 أسابيع",
      icon: Users
    },
    {
      step: "06",
      title: "الدعم المستمر",
      description: "دعم فني متواصل وصيانة دورية لضمان استمرارية العمل",
      duration: "مستمر",
      icon: Headphones
    }
  ];

  const stats = [
    { number: "250+", label: "مشروع تحول رقمي ناجح", icon: Rocket },
    { number: "65%", label: "تحسين في الكفاءة", icon: TrendingUp },
    { number: "45%", label: "توفير في التكاليف", icon: DollarSign },
    { number: "99%", label: "معدل رضا العملاء", icon: Star }
  ];

  const caseStudies = [
    {
      title: "شركة تصنيع كبرى",
      industry: "التصنيع",
      challenge: "عمليات يدوية بطيئة وأخطاء كثيرة",
      solution: "أتمتة خط الإنتاج باستخدام IoT و AI",
      result: "زيادة الإنتاجية 80% وتقليل الأخطاء 95%"
    },
    {
      title: "سلسلة متاجر تجزئة",
      industry: "التجزئة",
      challenge: "إدارة المخزون غير فعالة",
      solution: "نظام ERP متكامل مع تحليلات ذكية",
      result: "تقليل الفاقد 60% وتحسين المبيعات 35%"
    },
    {
      title: "مؤسسة مالية",
      industry: "المالية",
      challenge: "معالجة بطيئة للمعاملات",
      solution: "أتمتة العمليات مع Blockchain",
      result: "تسريع المعاملات 10x وتعزيز الأمان"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/50" dir="rtl">
      <Navigation />
      
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white pt-24 lg:pt-32">
        {/* Animated Background Effects */}
        {!reducedMotion && (
          <>
            <FloatingParticles count={30} className="opacity-40" />
            <GlowingOrbs className="opacity-30" />
            <AnimatedGridPattern className="opacity-20" />
          </>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-6 py-20 lg:py-28">
          <BackButton className="mb-8" />
          
          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 px-6 py-2 text-base">
                <Sparkles className="w-4 h-4 ml-2" />
                رحلة التحول نحو المستقبل
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-7xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                التحول الرقمي
              </span>
              <br />
              <span className="text-3xl lg:text-5xl text-purple-200">
                الشامل لأعمالك
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-purple-100/90 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              حوّل أعمالك إلى منظومة رقمية متطورة تواكب العصر. نقدم حلولاً شاملة للتحول الرقمي باستخدام أحدث التقنيات العالمية
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-10 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={handleRequestService}
              >
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                ابدأ التحول الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-7 rounded-2xl backdrop-blur-sm"
                asChild
              >
                <a href="tel:+966555812567">
                  <Phone className="w-5 h-5 ml-2" />
                  استشارة مجانية
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-slate-50"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Animated Counters */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  variants={staggerItem}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-purple-500/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-gray-600 font-medium text-lg">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section - Premium Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/50 to-white" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-purple-100 text-purple-800 px-6 py-2">
              <Layers className="w-4 h-4 ml-2" />
              حلولنا المتكاملة
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              خدمات التحول الرقمي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نقدم مجموعة متكاملة من الحلول الرقمية المتطورة لتحويل أعمالك
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <AnimatedServiceCard key={index} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section - Timeline */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {!reducedMotion && <FloatingParticles count={20} className="opacity-30" />}
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-white/10 text-white border-white/20 px-6 py-2">
              <Workflow className="w-4 h-4 ml-2" />
              منهجية العمل
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              رحلة التحول الرقمي
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              منهجية مدروسة ومثبتة لضمان نجاح مشروع التحول الرقمي
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {process.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div 
                  key={index} 
                  className="relative"
                  variants={staggerItem}
                >
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white h-full hover:bg-white/20 transition-all duration-500 group">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-purple-300">{step.step}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-200 transition-colors">{step.title}</h3>
                      <p className="text-purple-100/80 leading-relaxed mb-4">{step.description}</p>
                      <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30">
                        <Clock className="w-4 h-4 ml-1" />
                        {step.duration}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-indigo-100 text-indigo-800 px-6 py-2">
              <Cpu className="w-4 h-4 ml-2" />
              التقنيات المستخدمة
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              أحدث التقنيات العالمية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نستخدم أفضل التقنيات والأدوات لضمان جودة الحلول
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <motion.div 
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group"
                >
                  <Card className="border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                      </motion.div>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">{tech.name}</h3>
                      <p className="text-gray-500 text-xs">{tech.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - Side by Side */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-green-100 text-green-800 px-6 py-2">
                <TrendingUp className="w-4 h-4 ml-2" />
                النتائج المضمونة
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                فوائد التحول الرقمي
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                احصل على نتائج حقيقية وملموسة تنعكس مباشرة على أداء أعمالك ونموها
              </p>
              
              <div className="space-y-5">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium text-lg">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl transform rotate-3"></div>
              <Card className="relative bg-white/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
                
                <CardHeader className="text-center pb-4">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <BarChart3 className="w-10 h-10 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    إحصائيات النجاح
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    أرقام حقيقية من مشاريعنا
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">92%</h3>
                    <p className="text-purple-700 font-medium">نجاح المشاريع في الموعد المحدد</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">18 شهر</h3>
                    <p className="text-blue-700 font-medium">متوسط فترة استرداد الاستثمار</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">3x</h3>
                    <p className="text-green-700 font-medium">متوسط النمو بعد التحول</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-orange-100 text-orange-800 px-6 py-2">
              <Award className="w-4 h-4 ml-2" />
              قصص نجاح
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              نماذج من مشاريعنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              شاهد كيف ساعدنا عملاءنا في تحقيق التحول الرقمي
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {caseStudies.map((study, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600" />
                  <CardContent className="p-8">
                    <Badge className="mb-4 bg-purple-100 text-purple-800">
                      {study.industry}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                      {study.title}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-xl">
                        <p className="text-sm font-semibold text-red-700 mb-1">التحدي:</p>
                        <p className="text-red-600">{study.challenge}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm font-semibold text-blue-700 mb-1">الحل:</p>
                        <p className="text-blue-600">{study.solution}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl">
                        <p className="text-sm font-semibold text-green-700 mb-1">النتيجة:</p>
                        <p className="text-green-600 font-medium">{study.result}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
        {!reducedMotion && <FloatingParticles count={15} className="opacity-30" />}
        
        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Rocket className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              ابدأ رحلة التحول اليوم
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              لا تتأخر في مواكبة التطور التقني، ابدأ رحلة التحول الرقمي مع فريق الخبراء واحصل على استشارة مجانية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-white text-purple-700 hover:bg-purple-50 text-lg px-12 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={handleRequestService}
                >
                  <MessageCircle className="w-5 h-5 ml-2" />
                  احجز استشارتك المجانية
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-12 py-7 rounded-2xl backdrop-blur-sm"
                  asChild
                >
                  <a href="tel:+966555812567">
                    <Phone className="w-5 h-5 ml-2" />
                    اتصل الآن
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Request Form Modal */}
      {showServiceForm && (
        <BusinessServiceRequestForm 
          isOpen={showServiceForm}
          onClose={() => setShowServiceForm(false)}
          selectedService="التحول الرقمي"
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DigitalTransformation;
