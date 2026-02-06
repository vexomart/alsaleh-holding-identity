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
  Layers,
  Timer,
  Calendar,
  Sparkles,
  Eye,
  Heart,
  ArrowRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ReadyProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 2,
      title: "نظام إدارة المحتوى المتقدم",
      description: "نظام شامل لإدارة المحتوى الرقمي مع قدرات الذكاء الاصطناعي ونشر متعدد القنوات",
      detailedDescription: "نظام إدارة محتوى متطور يدعم النشر على منصات متعددة مع قدرات الذكاء الاصطناعي لتحسين المحتوى وتحليل الأداء. يشمل محرر نصوص متقدم، إدارة الوسائط، وأدوات SEO قوية.",
      features: ["إدارة المحتوى", "الذكاء الاصطناعي", "النشر التلقائي", "التحليلات", "محرر متقدم", "تحسين SEO"],
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "AI APIs", "AWS"],
      price: "7,999 ريال",
      duration: "3-4 أسابيع للتنفيذ",
      status: "جاهز للنشر",
      category: "أنظمة المحتوى",
      icon: FileText,
      color: "emerald",
      gradient: "from-emerald-600 to-green-600", // أخضر للمحتوى والكتابة
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
      gradient: "from-orange-600 to-amber-600", // برتقالي للتجارة والمبيعات
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
      gradient: "from-purple-600 to-violet-600", // بنفسجي للتعليم والتطوير
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
      gradient: "from-blue-600 to-indigo-600", // أزرق للأنظمة الإدارية
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
      gradient: "from-teal-600 to-cyan-600", // فيروزي للموارد البشرية
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
      gradient: "from-pink-600 to-rose-600", // وردي للتسويق والإبداع
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
      gradient: "from-red-600 to-rose-600", // أحمر للطب والصحة
      rating: "4.8",
      clients: "12+",
      updates: "تحديثات مجانية لسنتين",
      support: "دعم طبي متخصص 24/7"
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === "جاهز للنشر") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status === "قيد التطوير النهائي") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const categories = [
    { name: "الكل", count: projects.length },
    { name: "أنظمة المحتوى", count: projects.filter(p => p.category.includes("أنظمة المحتوى")).length },
    { name: "التجارة الإلكترونية", count: projects.filter(p => p.category.includes("التجارة")).length },
    { name: "التعليم التقني", count: projects.filter(p => p.category.includes("التعليم")).length },
    { name: "أنظمة إدارية", count: projects.filter(p => p.category.includes("إدارية")).length },
    { name: "الموارد البشرية", count: projects.filter(p => p.category.includes("البشرية")).length },
    { name: "التسويق الرقمي", count: projects.filter(p => p.category.includes("التسويق")).length },
    { name: "الأنظمة الطبية", count: projects.filter(p => p.category.includes("الطبية")).length }
  ];

  const filteredProjects = selectedCategory === "الكل" 
    ? projects 
    : projects.filter(project => 
        project.category === selectedCategory || 
        project.category.includes(selectedCategory)
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      {/* Hero Section with Modern Design */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">منتجاتنا الرقمية المبتكرة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              منتجاتنا <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">المتطورة</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              اكتشف مجموعتنا المتنوعة من الحلول الرقمية الجاهزة، مصممة بأحدث التقنيات لتلبي احتياجات عملك وتساعدك على النمو
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>جاهزة للنشر فوراً</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>تقنيات متطورة</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>دعم فني شامل</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.name
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-primary/10 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category.name}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedCategory === category.name
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const IconComponent = project.icon;
              return (
                <div
                  key={project.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary/30 overflow-hidden">
                    {/* Duration Banner - moved to bottom */}
                    
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${project.gradient} shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <Badge 
                            variant="outline" 
                            className={`mb-2 ${getStatusColor(project.status)}`}
                          >
                            {project.status}
                          </Badge>
                          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">المميزات الرئيسية:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.features.slice(0, 4).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {feature}
                            </Badge>
                          ))}
                          {project.features.length > 4 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                              +{project.features.length - 4} المزيد
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Technologies Used */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">التقنيات المستخدمة:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                              +{project.technologies.length - 3} تقنية
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Timer className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{project.duration.split(' ')[0]}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">مدة التنفيذ</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Shield className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{project.updates.split(' ')[0]}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">تحديثات مجانية</p>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-primary">{project.price}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">يشمل التركيب والتدريب</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {hoveredProject === project.id && (
                              <Button size="sm" variant="outline" className="animate-fade-in">
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              className={`bg-gradient-to-r ${project.gradient} hover:opacity-90 transition-all duration-300 group`}
                              asChild
                            >
                              <Link to={`/project/${project.id}`}>
                                <span>عرض التفاصيل</span>
                                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hover Effect Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg -z-10`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            لم تجد ما تبحث عنه؟
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            نحن نطور حلولاً مخصصة تناسب احتياجاتك الفريدة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90" asChild>
              <Link to="/contact">
                <MessageCircle className="w-5 h-5 ml-2" />
                طلب حل مخصص
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">
                <Info className="w-5 h-5 ml-2" />
                تعرف على خدماتنا
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReadyProjects;