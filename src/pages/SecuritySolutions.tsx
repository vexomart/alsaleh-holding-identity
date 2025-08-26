import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  FileCheck,
  Users,
  ArrowLeft,
  CheckCircle,
  Star,
  Target,
  Code,
  Lightbulb,
  Zap,
  Server,
  Database,
  Wifi,
  Smartphone,
  Globe,
  Activity,
  ShieldCheck,
  UserCheck,
  Fingerprint,
  Key,
  Scan,
  Bug,
  Phone,
  Mail,
  MapPin,
  Clock,
  Network,
  Brain,
  Radar,
  HardDrive,
  Search,
  Camera,
  Cpu,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const SecuritySolutions = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Floating animation variants for icons
  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1]
    }
  };

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.4, 0, 0.6, 1]
    }
  };

  const securityServices = [
    {
      icon: Shield,
      title: "حماية الشبكات المتقدمة",
      description: "حماية شاملة للشبكات من الاختراقات والتهديدات السيبرانية المتطورة",
      features: [
        "جدران حماية ذكية بالذكاء الاصطناعي",
        "نظام كشف التسلل IDS/IPS",
        "مراقبة الشبكة في الوقت الفعلي 24/7",
        "حماية متقدمة من هجمات DDoS",
        "تحليل حركة المرور الشاذة"
      ],
      gradient: "from-blue-600 to-cyan-500"
    },
    {
      icon: Database,
      title: "أمان البيانات والتشفير",
      description: "حماية وتشفير البيانات الحساسة بأحدث معايير الأمان العالمية",
      features: [
        "تشفير البيانات AES-256",
        "إدارة مفاتيح التشفير المتقدمة",
        "النسخ الاحتياطي المشفر",
        "حماية قواعد البيانات الحساسة",
        "رقابة الوصول للبيانات"
      ],
      gradient: "from-purple-600 to-pink-500"
    },
    {
      icon: UserCheck,
      title: "إدارة الهوية الرقمية",
      description: "أنظمة متقدمة لإدارة الهوية والتحقق الآمن من المستخدمين",
      features: [
        "المصادقة متعددة العوامل MFA",
        "إدارة الصلاحيات المتقدمة",
        "تسجيل الدخول الموحد SSO",
        "التحقق البيومتري",
        "مراقبة سلوك المستخدمين"
      ],
      gradient: "from-green-600 to-emerald-500"
    },
    {
      icon: Bug,
      title: "اختبار الاختراق الأخلاقي",
      description: "فحص شامل للثغرات الأمنية واختبار مقاومة الأنظمة للهجمات",
      features: [
        "فحص الثغرات الأمنية المتقدم",
        "اختبار الاختراق الأبيض",
        "محاكاة هجمات حقيقية",
        "تقارير أمنية مفصلة",
        "خطط معالجة الثغرات"
      ],
      gradient: "from-red-600 to-orange-500"
    },
    {
      icon: Activity,
      title: "مراقبة الأمان الذكية",
      description: "مراقبة مستمرة للأنظمة مع تحليل ذكي للتهديدات",
      features: [
        "مركز عمليات أمني SOC 24/7",
        "تحليل السلوك الشاذ بالذكاء الاصطناعي",
        "تنبيهات فورية للتهديدات",
        "تقارير أمنية تفاعلية",
        "استجابة تلقائية للحوادث"
      ],
      gradient: "from-yellow-600 to-amber-500"
    },
    {
      icon: Smartphone,
      title: "أمان الأجهزة المحمولة",
      description: "حماية شاملة للأجهزة المحمولة وإدارتها في بيئة العمل",
      features: [
        "إدارة الأجهزة المحمولة MDM",
        "تشفير الأجهزة والتطبيقات",
        "VPN آمن للأجهزة المحمولة",
        "المسح الآمن عن بُعد",
        "مراقبة التطبيقات الضارة"
      ],
      gradient: "from-indigo-600 to-blue-500"
    }
  ];

  const cyberFeatures = [
    {
      title: "الذكاء الاصطناعي للأمان",
      description: "تقنيات متقدمة لكشف التهديدات والاستجابة التلقائية",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "الاستجابة السريعة",
      description: "فرق متخصصة للتدخل السريع وحل الحوادث الأمنية",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "الامتثال للمعايير",
      description: "التوافق مع ISO 27001 ومعايير الأمان السعودية",
      icon: FileCheck,
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "التدريب المتخصص",
      description: "برامج تدريبية متقدمة لرفع الوعي الأمني",
      icon: Users,
      gradient: "from-red-500 to-pink-600"
    }
  ];

  const stats = [
    { label: "عميل محمي", value: "1000+", icon: Shield },
    { label: "هجوم محجوب", value: "100K+", icon: ShieldCheck },
    { label: "مراقبة مستمرة", value: "24/7", icon: Radar },
    { label: "نسبة الحماية", value: "99.9%", icon: CheckCircle }
  ];

  // Floating icons background
  const FloatingIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[Shield, Lock, Database, Network, Cpu, Layers].map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute text-red-200/20"
          style={{
            left: `${20 + (index * 15)}%`,
            top: `${10 + (index * 12)}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        >
          <Icon size={48 + index * 8} />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 relative overflow-hidden">
      <SEO 
        title="حلول الأمن السيبراني المتقدمة - شركة علي الشهري القابضة"
        description="حلول أمن سيبراني شاملة ومتقدمة مع تقنيات الذكاء الاصطناعي. حماية الشبكات، أمان البيانات، إدارة الهوية واختبار الاختراق."
        canonicalUrl="https://alialshehriholding.com/security-solutions"
      />
      <Navigation />
      
      <FloatingIcons />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-orange-600/10 to-yellow-600/5" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full border border-red-500/30 mb-8 backdrop-blur-sm"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                animate={{
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Shield className="w-8 h-8 text-red-400" />
              </motion.div>
              <span className="text-xl font-bold text-white">الأمن السيبراني المتقدم</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <motion.span 
                className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                حماية ذكية
              </motion.span>
              <br />
              <span className="text-slate-200">للعصر الرقمي</span>
            </h1>
            
            <p className="text-2xl text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              نوفر حلول أمن سيبراني متطورة مدعومة بالذكاء الاصطناعي لحماية أعمالكم من التهديدات الرقمية المتقدمة
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white px-10 py-4 text-xl font-semibold rounded-xl shadow-2xl">
                  <Lock className="w-6 h-6 ml-2" />
                  احصل على تقييم أمني مجاني
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="border-2 border-red-400 text-red-400 hover:bg-red-400/10 px-10 py-4 text-xl font-semibold rounded-xl backdrop-blur-sm">
                  <Search className="w-6 h-6 ml-2" />
                  استكشف خدماتنا
                </Button>
              </motion.div>
            </div>

            {/* Animated cyber elements */}
            <div className="flex justify-center gap-8 mb-8">
              {[Network, Database, Lock, Shield].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon className="w-10 h-10 text-red-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(239, 68, 68, 0.3)",
                      "0 0 30px rgba(251, 146, 60, 0.4)",
                      "0 0 20px rgba(239, 68, 68, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <div className="text-4xl font-bold text-white mb-3">{stat.value}</div>
                <div className="text-slate-300 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative" ref={ref}>
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-5xl font-bold text-white mb-6"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            >
              خدمات الأمن السيبراني المتقدمة
            </motion.h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              مجموعة شاملة من الحلول الأمنية المدعومة بأحدث التقنيات
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {securityServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(59, 130, 246, 0.3)",
                          "0 0 30px rgba(147, 51, 234, 0.4)",
                          "0 0 20px rgba(59, 130, 246, 0.3)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      whileHover={{ rotate: 10 }}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl text-white mb-3 group-hover:text-red-300 transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-lg leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-slate-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl`}>
                        <Shield className="w-5 h-5 ml-2" />
                        اطلب الخدمة
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-red-900 relative">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-6">لماذا نحن الأفضل؟</h2>
            <p className="text-2xl text-slate-300 max-w-4xl mx-auto">
              نجمع بين الخبرة والتقنيات المتطورة لتوفير حماية لا مثيل لها
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {cyberFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="flex gap-8 p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-500 group"
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-xl`}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  whileHover={{ scale: 1.2 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-8"
            >
              هل أنظمتك محمية بما فيه الكفاية؟
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-slate-300 mb-12"
            >
              احصل على تقييم أمني شامل مجاناً من خبرائنا المعتمدين
            </motion.p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div 
                className="flex items-center gap-4 justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Phone className="w-8 h-8 text-red-400" />
                <span className="text-white text-xl font-semibold">0555812567</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-4 justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Mail className="w-8 h-8 text-red-400" />
                <span className="text-white text-xl font-semibold">security@alialshehri.com</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-4 justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <MapPin className="w-8 h-8 text-red-400" />
                <span className="text-white text-xl font-semibold">الرياض، المملكة العربية السعودية</span>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white px-12 py-5 text-2xl font-bold rounded-2xl shadow-2xl">
                <Camera className="w-8 h-8 ml-3" />
                احجز تقييمك الأمني المجاني
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors text-lg">
          <ArrowLeft className="w-6 h-6" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default SecuritySolutions;