import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  FileText, 
  Building2, 
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Shield,
  Smartphone,
  Database,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Rocket,
  Target,
  Settings,
  Download,
  Play,
  BookOpen,
  MessageCircle,
  Activity,
  BarChart3,
  Cloud,
  Lock,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const ReadyProjects = () => {
  const projects = [
    {
      id: 2,
      title: "نظام إدارة المحتوى المتقدم",
      description: "نظام شامل لإدارة المحتوى الرقمي مع إمكانيات الذكاء الاصطناعي ونشر متعدد القنوات",
      detailedDescription: "نظام إدارة محتوى متطور يدعم النشر على منصات متعددة مع إمكانيات الذكاء الاصطناعي لتحسين المحتوى وتحليل الأداء. يشمل محرر نصوص متقدم، إدارة الوسائط، وأدوات SEO قوية.",
      features: ["إدارة المحتوى", "الذكاء الاصطناعي", "النشر التلقائي", "التحليلات", "محرر متقدم", "تحسين SEO"],
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "AI APIs", "AWS"],
      price: "7,999 ريال",
      duration: "3-4 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "أنظمة المحتوى",
      icon: FileText,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
      rating: "4.8",
      clients: "18+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني متقدم"
    },
    {
      id: 3,
      title: "تطبيق التجارة الإلكترونية الذكي",
      description: "منصة تجارة إلكترونية شاملة مع تكامل طرق الدفع المحلية والعالمية ونظام إدارة المخزون",
      detailedDescription: "منصة تجارة إلكترونية متكاملة مع نظام دفع آمن يدعم جميع الطرق المحلية (مدى، STC Pay، تابي، تمارا) والعالمية. تشمل إدارة المخزون الذكية، نظام العروض، وتحليلات المبيعات المتقدمة.",
      features: ["متجر إلكتروني", "طرق دفع متعددة", "إدارة المخزون", "تحليلات المبيعات", "نظام العروض", "تطبيق موبايل"],
      technologies: ["Next.js", "Stripe", "PayPal", "MySQL", "PWA", "Firebase"],
      price: "10,000 ريال",
      duration: "4-6 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التجارة الإلكترونية",
      icon: Building2,
      color: "orange",
      gradient: "from-orange-500 to-red-600",
      rating: "4.7",
      clients: "32+",
      updates: "تحديثات مجانية لسنتين",
      support: "دعم تجاري متخصص"
    },
    {
      id: 4,
      title: "منصة التعلم الذكي",
      description: "منصة تعليمية تفاعلية تستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم لكل طالب",
      detailedDescription: "منصة تعليمية متطورة تستخدم الذكاء الاصطناعي لتحليل أسلوب تعلم كل طالب وتقديم مسار تعليمي مخصص. تحتوي على مكتبة ضخمة من المحتوى التفاعلي، أدوات التقييم، ونظام شهادات معتمد.",
      features: ["التعلم التكيفي", "محتوى تفاعلي", "تتبع التقدم", "شهادات معتمدة", "تحليل الأداء", "مسارات مخصصة"],
      technologies: ["React", "Python", "TensorFlow", "PostgreSQL", "WebRTC", "Docker"],
      price: "17,000 ريال",
      duration: "5-7 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التعليم التقني",
      icon: GraduationCap,
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      rating: "4.9",
      clients: "15+",
      updates: "تحديثات المحتوى دورية",
      support: "دعم تعليمي متخصص"
    },
    {
      id: 5,
      title: "نظام إدارة علاقات العملاء المتطور",
      description: "نظام CRM شامل لإدارة العملاء والمبيعات مع تكامل الذكاء الاصطناعي للتنبؤ بسلوك العملاء",
      detailedDescription: "نظام CRM متقدم يجمع بين إدارة العملاء التقليدية والذكاء الاصطناعي للتنبؤ بسلوك العملاء وتحسين المبيعات. يشمل أتمتة العمليات، تحليل البيانات، وتكامل مع أنظمة المحاسبة.",
      features: ["إدارة العملاء", "أتمتة المبيعات", "التحليلات الذكية", "التكامل مع الأنظمة", "تنبؤات AI", "تقارير متقدمة"],
      technologies: ["Angular", "NestJS", "PostgreSQL", "Redis", "ML Models", "GraphQL"],
      price: "25,000 ريال",
      duration: "4-5 أسابيع للتنفيذ",
      status: "قيد التطوير النهائي",
      category: "أنظمة إدارية",
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600",
      rating: "قريباً",
      clients: "في الاختبار",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني شامل"
    },
    {
      id: 6,
      title: "تطبيق إدارة الموارد البشرية",
      description: "نظام شامل لإدارة الموارد البشرية يشمل التوظيف والرواتب وتقييم الأداء",
      detailedDescription: "نظام متكامل لإدارة الموارد البشرية يغطي جميع احتياجات الشركات من التوظيف والتدريب إلى إدارة الأداء والرواتب. مع واجهات منفصلة للموظفين والإدارة وتقارير تحليلية شاملة.",
      features: ["إدارة الموظفين", "نظام الرواتب", "تقييم الأداء", "إدارة الإجازات", "التوظيف الذكي", "تدريب الموظفين"],
      technologies: ["React Native", "Express.js", "MongoDB", "JWT", "Push Notifications", "Charts.js"],
      price: "10,000 ريال",
      duration: "3-4 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "الموارد البشرية",
      icon: Award,
      color: "teal",
      gradient: "from-teal-500 to-cyan-600",
      rating: "4.8",
      clients: "22+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني 24/7"
    },
    {
      id: 7,
      title: "منصة التسويق الرقمي المتكاملة",
      description: "منصة شاملة لإدارة الحملات التسويقية الرقمية عبر جميع القنوات مع تحليلات متقدمة",
      detailedDescription: "منصة متطورة تجمع جميع أدوات التسويق الرقمي في مكان واحد. إدارة حملات Google Ads، Facebook، Instagram، LinkedIn مع تحليلات موحدة وأتمتة الحملات بالذكاء الاصطناعي.",
      features: ["إدارة الحملات", "تحليلات متقدمة", "أتمتة التسويق", "تكامل المنصات", "تتبع ROI", "تقارير ذكية"],
      technologies: ["React", "Python", "APIs Integration", "MongoDB", "Machine Learning", "D3.js"],
      price: "25,000 ريال",
      duration: "5-6 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "التسويق الرقمي",
      icon: TrendingUp,
      color: "pink",
      gradient: "from-pink-500 to-rose-600",
      rating: "4.9",
      clients: "28+",
      updates: "تحديثات شهرية",
      support: "دعم تسويقي متخصص"
    },
    {
      id: 8,
      title: "نظام إدارة المستشفيات الذكي",
      description: "نظام شامل لإدارة المستشفيات والعيادات مع إدارة المواعيد والسجلات الطبية الإلكترونية",
      detailedDescription: "نظام طبي متكامل يشمل إدارة المرضى، المواعيد، السجلات الطبية، الصيدلية، والفواتير. مع تكامل مع أجهزة طبية وأنظمة المعامل ودعم للتطبيب عن بعد.",
      features: ["إدارة المرضى", "السجلات الطبية", "نظام المواعيد", "إدارة الصيدلية", "التطبيب عن بعد", "تقارير طبية"],
      technologies: ["Vue.js", "Laravel", "MySQL", "WebRTC", "HL7 Integration", "Security"],
      price: "48,000 ريال",
      duration: "8-10 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "الأنظمة الطبية",
      icon: Activity,
      color: "red",
      gradient: "from-red-500 to-pink-600",
      rating: "4.8",
      clients: "12+",
      updates: "تحديثات مجانية لسنتين",
      support: "دعم طبي متخصص 24/7"
    },
    {
      id: 9,
      title: "نظام تأجير السيارات الذكي",
      description: "منصة شاملة لإدارة تأجير السيارات مع نظام حجز متقدم وإدارة الأسطول والدفع الإلكتروني",
      detailedDescription: "نظام متكامل لإدارة شركات تأجير السيارات يشمل إدارة الأسطول، نظام الحجز الذكي، تتبع GPS للمركبات، إدارة العملاء والسائقين، والدفع الإلكتروني. مع واجهة ويب للإدارة وتطبيق موبايل للعملاء ونظام تقارير شامل.",
      features: ["إدارة الأسطول", "نظام الحجز الذكي", "تتبع GPS", "الدفع الإلكتروني", "إدارة العملاء", "تطبيق موبايل"],
      technologies: ["React", "Node.js", "MongoDB", "GPS Tracking", "Payment Gateway", "Mobile App"],
      price: "35,000 ريال",
      duration: "6-8 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "إدارة الأعمال",
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      rating: "4.7",
      clients: "20+",
      updates: "تحديثات مجانية لسنة ونصف",
      support: "دعم فني متخصص 24/7"
    },
    {
      id: 10,
      title: "منصة الخدمات المصغرة المتكاملة",
      description: "منصة شاملة للخدمات المصغرة مثل خمسات وفايفر مع نظام مدفوعات آمن وإدارة المشاريع",
      detailedDescription: "منصة متكاملة تربط مقدمي الخدمات المصغرة بالعملاء، تشمل نظام عرض الخدمات، إدارة الطلبات، المدفوعات الآمنة، تقييم الخدمات، ونظام رسائل متقدم. مع لوحات تحكم منفصلة للبائعين والمشترين والإدارة.",
      features: ["عرض الخدمات", "نظام الطلبات", "المدفوعات الآمنة", "تقييم الخدمات", "نظام الرسائل", "لوحة تحكم شاملة"],
      technologies: ["React", "Laravel", "MySQL", "Payment Gateway", "Real-time Chat", "File Upload"],
      price: "15,000 ريال",
      duration: "5-7 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "منصات الخدمات",
      icon: Users,
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      rating: "4.8",
      clients: "35+",
      updates: "تحديثات مجانية لسنة",
      support: "دعم فني وتجاري متخصص"
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === "جاهز للنشر") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === "قيد التطوير النهائي") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const categories = [
    { name: "الكل", count: projects.length },
    { name: "منصات إدارية", count: projects.filter(p => p.category.includes("إدارية")).length },
    { name: "التجارة الإلكترونية", count: projects.filter(p => p.category.includes("التجارة")).length },
    { name: "التعليم التقني", count: projects.filter(p => p.category.includes("التعليم")).length },
    { name: "الأنظمة الطبية", count: projects.filter(p => p.category.includes("الطبية")).length },
    { name: "إدارة الأعمال", count: projects.filter(p => p.category.includes("إدارة الأعمال")).length },
    { name: "منصات الخدمات", count: projects.filter(p => p.category.includes("منصات الخدمات")).length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
              <Code className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-800">مشاريعنا الجاهزة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">حلول تقنية</span>
              <br />
              <span className="text-slate-800">جاهزة للتنفيذ</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              مجموعة من المشاريع التقنية المتقدمة والجاهزة للنشر، مصممة لتلبية احتياجات الأعمال الحديثة
              مع أحدث التقنيات والمعايير العالمية
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category, index) => (
              <Badge 
                key={index}
                className="px-6 py-3 text-sm font-medium bg-white/70 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <Card key={project.id} className="group bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${project.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={`${getStatusColor(project.status)} border`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="w-fit text-slate-600 border-slate-300">
                        {project.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-slate-600">{project.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                    
                    {/* Price and Duration */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50 rounded-lg">
                      <div className="text-center">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">{project.price}</div>
                        <div className="text-xs text-slate-600">السعر الشامل</div>
                      </div>
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-slate-900">{project.duration}</div>
                        <div className="text-xs text-slate-600">مدة التنفيذ</div>
                      </div>
                    </div>
                    
                    {/* Key Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">العملاء:</span>
                        <span className="font-medium text-slate-900">{project.clients}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">التحديثات:</span>
                        <span className="font-medium text-slate-900">{project.updates}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">الدعم:</span>
                        <span className="font-medium text-slate-900">{project.support}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        المميزات الرئيسية:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-xs text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      {project.features.length > 4 && (
                        <div className="text-xs text-center text-slate-500">
                          +{project.features.length - 4} مميزات أخرى
                        </div>
                      )}
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                        <Code className="w-4 h-4 text-purple-500" />
                        التقنيات المستخدمة:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} className="text-xs bg-slate-100 text-slate-700 border-slate-300">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge className="text-xs bg-slate-100 text-slate-700 border-slate-300">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                        asChild
                      >
                        <Link to={`/project/${project.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          عرض التفاصيل
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-slate-300 hover:border-blue-400 hover:text-blue-600"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-slate-300 hover:border-yellow-400 hover:text-yellow-600"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              لماذا تختار مشاريعنا الجاهزة؟
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              مشاريع مطورة بعناية وخبرة واسعة لضمان أفضل النتائج
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">إطلاق سريع</h3>
              <p className="text-slate-600 text-sm">جاهز للنشر خلال أسابيع قليلة</p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">أمان عالي</h3>
              <p className="text-slate-600 text-sm">حماية متقدمة وتشفير البيانات</p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">دعم متعدد اللغات</h3>
              <p className="text-slate-600 text-sm">واجهات عربية وإنجليزية</p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <MessageCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">دعم فني شامل</h3>
              <p className="text-slate-600 text-sm">دعم 24/7 لضمان استمرارية العمل</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">70+</div>
              <div className="text-slate-600">مشروع مكتمل</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">300+</div>
              <div className="text-slate-600">عميل راضي</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
              <div className="text-slate-600">معدل النجاح</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-slate-600">دعم فني</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              كيف نعمل معك؟
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              عملية بسيطة وواضحة لضمان حصولك على المشروع المناسب
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. استشارة مجانية</h3>
              <p className="text-slate-600 text-sm">نحلل احتياجاتك ونساعدك في اختيار المشروع المناسب</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. تخصيص المشروع</h3>
              <p className="text-slate-600 text-sm">نخصص المشروع حسب متطلباتك وهويتك التجارية</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. التنفيذ والإطلاق</h3>
              <p className="text-slate-600 text-sm">ننفذ المشروع ونطلقه بشكل احترافي</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. الدعم والصيانة</h3>
              <p className="text-slate-600 text-sm">نقدم دعماً فنياً شاملاً وتحديثات دورية</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                هل لديك مشروع في الذهن؟
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                تواصل معنا لمناقشة مشروعك وكيف يمكننا مساعدتك في تحويل فكرتك إلى واقع رقمي
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 border-0"
                  asChild
                >
                  <Link to="/contact">
                    <Users className="w-5 h-5 mr-2" />
                    تواصل معنا
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 border-2"
                  asChild
                >
                  <a href="https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن المشاريع الجاهزة" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    واتساب مباشر
                  </a>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 border-2"
                  asChild
                >
                  <Link to="/services">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    خدماتنا
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default ReadyProjects;