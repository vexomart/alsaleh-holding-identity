import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Download,
  Play,
  MessageCircle,
  ExternalLink,
  Shield,
  Globe,
  Zap,
  Code,
  FileText,
  Building2,
  GraduationCap,
  Award,
  TrendingUp,
  Activity,
  Smartphone,
  Database,
  Cloud,
  Settings,
  Target,
  Layers
} from "lucide-react";

const ProjectDetails = () => {
  const { projectId } = useParams();
  
  // بيانات المشاريع (نفس البيانات من ReadyProjects)
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
      support: "دعم فني متقدم",
      fullFeatures: [
        "محرر نصوص متقدم بتقنية WYSIWYG",
        "إدارة الوسائط والصور بسهولة",
        "نظام تصنيف المحتوى الذكي",
        "النشر التلقائي على منصات متعددة",
        "تحليلات الأداء المتقدمة",
        "تحسين SEO تلقائي",
        "إدارة المستخدمين والصلاحيات",
        "نظام التعليقات والمراجعة",
        "البحث المتقدم في المحتوى",
        "التكامل مع وسائل التواصل الاجتماعي"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
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
      support: "دعم تجاري متخصص",
      fullFeatures: [
        "واجهة متجر حديثة ومتجاوبة",
        "نظام إدارة المنتجات الشامل",
        "عربة تسوق ذكية",
        "طرق دفع متعددة (مدى، فيزا، ماستركارد)",
        "تكامل مع تابي وتمارا للدفع بالتقسيط",
        "نظام إدارة المخزون التلقائي",
        "تحليلات المبيعات المتقدمة",
        "نظام العروض والخصومات",
        "إدارة الطلبات والشحن",
        "تطبيق موبايل متكامل",
        "دعم متعدد اللغات",
        "نظام تقييم المنتجات"
      ],
      screenshots: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
      ]
    }
    // يمكن إضافة باقي المشاريع هنا
  ];

  const project = projects.find(p => p.id === parseInt(projectId || "0"));

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">المشروع غير موجود</h1>
          <p className="text-xl text-slate-600 mb-8">لم نتمكن من العثور على هذا المشروع</p>
          <Button asChild>
            <Link to="/ready-projects">العودة إلى المشاريع</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent = project.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-slate-600">
              <Link to="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/ready-projects" className="hover:text-blue-600 transition-colors">المشاريع الجاهزة</Link>
              <span>/</span>
              <span className="text-slate-900">{project.title}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${project.gradient} rounded-2xl flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <Badge className={`mb-2`} variant="outline">
                      {project.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-bold text-slate-900">{project.rating}</span>
                      <span className="text-slate-600">({project.clients} عميل)</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {project.title}
                </h1>
                
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  {project.detailedDescription}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-white/70 rounded-xl border border-slate-200/50">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{project.price}</div>
                    <div className="text-sm text-slate-600">السعر الشامل</div>
                  </div>
                  <div className="text-center p-4 bg-white/70 rounded-xl border border-slate-200/50">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{project.duration}</div>
                    <div className="text-sm text-slate-600">مدة التنفيذ</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                    asChild
                  >
                    <a href={`https://wa.me/966555812567?text=مرحباً، أريد الاستفسار عن ${project.title}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      طلب عرض سعر
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-slate-300 hover:border-blue-400 hover:text-blue-600"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    تحميل المواصفات
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={project.screenshots[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/90 text-slate-900 border-0">
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              المميزات والخصائص
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              تعرف على جميع المميزات والخصائص المتقدمة التي يوفرها هذا المشروع
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.fullFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/70 rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
              التقنيات المستخدمة
            </h2>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto">
              مبني بأحدث التقنيات والأدوات المتطورة لضمان الأداء العالي والموثوقية
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.technologies.map((tech, index) => (
                <div key={index} className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">{tech}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support & Updates Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">الدعم الفني</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{project.support}</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">التحديثات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{project.updates}</p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 bg-white/70 border-slate-200/50">
                <CardHeader className="pb-4">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-900">العملاء</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">تم تنفيذه بنجاح لأكثر من {project.clients} عميل</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  هل أنت مستعد لبدء مشروعك؟
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  تواصل معنا الآن لطلب عرض سعر مخصص أو للحصول على استشارة مجانية
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-slate-100 border-0"
                    asChild
                  >
                    <a href={`https://wa.me/966555812567?text=مرحباً، أريد طلب عرض سعر لـ ${project.title}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      طلب عرض سعر
                    </a>
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 border-2"
                    asChild
                  >
                    <Link to="/contact">
                      <Users className="w-5 h-5 mr-2" />
                      استشارة مجانية
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="container mx-auto px-6 py-8">
        <Link 
          to="/ready-projects" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة إلى المشاريع الجاهزة
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectDetails;