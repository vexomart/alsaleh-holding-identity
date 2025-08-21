import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
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
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const SecuritySolutions = () => {
  const securityServices = [
    {
      icon: Shield,
      title: "حماية الشبكات",
      description: "حماية شاملة للشبكات من الاختراقات والتهديدات الخارجية",
      features: [
        "جدران حماية متقدمة",
        "كشف التسلل IDS/IPS",
        "مراقبة الشبكة 24/7",
        "حماية من DDoS"
      ],
      price: "من 2,500 ريال"
    },
    {
      icon: Database,
      title: "أمان البيانات",
      description: "حماية وتشفير البيانات الحساسة والمعلومات السرية",
      features: [
        "تشفير البيانات المتقدم",
        "النسخ الاحتياطي الآمن",
        "إدارة الوصول للبيانات",
        "مراقبة استخدام البيانات"
      ],
      price: "من 3,000 ريال"
    },
    {
      icon: UserCheck,
      title: "إدارة الهوية",
      description: "أنظمة متقدمة لإدارة الهوية والتحقق من المستخدمين",
      features: [
        "المصادقة الثنائية",
        "إدارة الصلاحيات",
        "Single Sign-On (SSO)",
        "التحقق البيومتري"
      ],
      price: "من 2,000 ريال"
    },
    {
      icon: Bug,
      title: "اختبار الاختراق",
      description: "اختبار أمان النظام واكتشاف الثغرات الأمنية",
      features: [
        "فحص الثغرات الأمنية",
        "اختبار الاختراق الأخلاقي",
        "تقارير أمنية مفصلة",
        "توصيات الحماية"
      ],
      price: "من 5,000 ريال"
    },
    {
      icon: Activity,
      title: "مراقبة الأمان",
      description: "مراقبة مستمرة للأنظمة والتنبيه من التهديدات",
      features: [
        "مراقبة 24/7",
        "تنبيهات فورية",
        "تحليل السلوك الشاذ",
        "تقارير دورية"
      ],
      price: "من 4,000 ريال"
    },
    {
      icon: Smartphone,
      title: "أمان الأجهزة المحمولة",
      description: "حماية الهواتف الذكية والأجهزة اللوحية في بيئة العمل",
      features: [
        "إدارة الأجهزة المحمولة MDM",
        "تشفير الأجهزة",
        "حماية التطبيقات",
        "المسح عن بُعد"
      ],
      price: "من 1,500 ريال"
    }
  ];

  const securityFeatures = [
    {
      title: "الذكاء الاصطناعي في الأمان",
      description: "استخدام تقنيات الذكاء الاصطناعي لكشف التهديدات المتقدمة",
      icon: Lightbulb,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "الاستجابة السريعة",
      description: "فرق متخصصة للاستجابة السريعة للحوادث الأمنية",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "الامتثال للمعايير",
      description: "التوافق مع معايير الأمان الدولية وأنظمة المملكة",
      icon: FileCheck,
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "التدريب الأمني",
      description: "برامج تدريبية شاملة لرفع الوعي الأمني للموظفين",
      icon: Users,
      gradient: "from-red-500 to-pink-600"
    }
  ];

  const stats = [
    { label: "عميل محمي", value: "500+", icon: Shield },
    { label: "تهديد محجوب", value: "50K+", icon: ShieldCheck },
    { label: "ساعة مراقبة", value: "24/7", icon: Clock },
    { label: "نسبة الحماية", value: "99.9%", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <SEO 
        title="حلول الأمن السيبراني - شركة علي الشهري القابضة"
        description="حلول أمن سيبراني شاملة لحماية أعمالكم من التهديدات الرقمية. خدمات حماية الشبكات، أمان البيانات، إدارة الهوية واختبار الاختراق."
        canonicalUrl="https://alialshehriholding.com/security-solutions"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-600/5 to-yellow-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-500/20 mb-8">
              <Shield className="w-6 h-6 text-red-600" />
              <span className="text-lg font-bold text-slate-800">حلول الأمن السيبراني</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                حماية شاملة
              </span>
              <br />
              لأنظمتكم الرقمية
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              نوفر حلول أمن سيبراني متقدمة لحماية أعمالكم من التهديدات الرقمية المتطورة مع مراقبة مستمرة ودعم فني متخصص
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg">
                احصل على استشارة مجانية
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg">
                تصفح خدماتنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">خدمات الأمن السيبراني</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              مجموعة شاملة من خدمات الأمن السيبراني لحماية أعمالكم من جميع أنواع التهديدات الرقمية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border border-slate-200/50 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-slate-900">{service.title}</CardTitle>
                    <CardDescription className="text-slate-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">{service.price}</span>
                      <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                        اطلب الخدمة
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">لماذا تختار حلولنا الأمنية؟</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              نجمع بين أحدث التقنيات والخبرات المتخصصة لتوفير حماية شاملة ومتقدمة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex gap-6 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              هل تحتاج لحماية أنظمتك؟
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              احصل على استشارة مجانية من خبرائنا في الأمن السيبراني
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 justify-center">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="text-slate-700">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-slate-700">security@alialshehri.com</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-slate-700">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-4 text-lg">
              احجز استشارة مجانية الآن
            </Button>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default SecuritySolutions;