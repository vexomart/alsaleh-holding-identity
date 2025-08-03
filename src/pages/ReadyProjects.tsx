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
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const ReadyProjects = () => {
  const projects = [
    {
      id: 1,
      title: "منصة إمكان التقنية",
      description: "منصة متكاملة لإدارة المشاريع التقنية والتطوير مع أدوات متقدمة للتعاون والإنتاجية",
      features: ["إدارة المشاريع", "التعاون الجماعي", "تتبع الأداء", "التقارير المتقدمة"],
      status: "جاهز للنشر",
      category: "منصات إدارية",
      icon: Code,
      color: "blue",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "نظام إدارة المحتوى المتقدم",
      description: "نظام شامل لإدارة المحتوى الرقمي مع إمكانيات الذكاء الاصطناعي ونشر متعدد القنوات",
      features: ["إدارة المحتوى", "الذكاء الاصطناعي", "النشر التلقائي", "التحليلات"],
      status: "جاهز للنشر",
      category: "أنظمة المحتوى",
      icon: FileText,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      title: "تطبيق التجارة الإلكترونية الذكي",
      description: "منصة تجارة إلكترونية شاملة مع تكامل طرق الدفع المحلية والعالمية ونظام إدارة المخزون",
      features: ["متجر إلكتروني", "طرق دفع متعددة", "إدارة المخزون", "تحليلات المبيعات"],
      status: "جاهز للنشر",
      category: "التجارة الإلكترونية",
      icon: Building2,
      color: "orange",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "منصة التعلم الذكي",
      description: "منصة تعليمية تفاعلية تستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم لكل طالب",
      features: ["التعلم التكيفي", "محتوى تفاعلي", "تتبع التقدم", "شهادات معتمدة"],
      status: "جاهز للنشر",
      category: "التعليم التقني",
      icon: GraduationCap,
      color: "purple",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 5,
      title: "نظام إدارة علاقات العملاء المتطور",
      description: "نظام CRM شامل لإدارة العملاء والمبيعات مع تكامل الذكاء الاصطناعي للتنبؤ بسلوك العملاء",
      features: ["إدارة العملاء", "أتمتة المبيعات", "التحليلات الذكية", "التكامل مع الأنظمة"],
      status: "قيد التطوير",
      category: "أنظمة إدارية",
      icon: Users,
      color: "indigo",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      title: "تطبيق إدارة الموارد البشرية",
      description: "نظام شامل لإدارة الموارد البشرية يشمل التوظيف والرواتب وتقييم الأداء",
      features: ["إدارة الموظفين", "نظام الرواتب", "تقييم الأداء", "إدارة الإجازات"],
      status: "جاهز للنشر",
      category: "الموارد البشرية",
      icon: Award,
      color: "teal",
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  const getStatusColor = (status: string) => {
    return status === "جاهز للنشر" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

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

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const IconComponent = project.icon;
              return (
                <Card key={project.id} className="group bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm">
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
                    
                    <Badge variant="outline" className="w-fit text-slate-600 border-slate-300">
                      {project.category}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {project.description}
                    </CardDescription>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-900 text-sm">المميزات الرئيسية:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-slate-300 hover:border-blue-400 hover:text-blue-600"
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

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              إنجازاتنا في أرقام
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              نفخر بما حققناه من نجاحات في تطوير الحلول التقنية المبتكرة
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-slate-600">مشروع مكتمل</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
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

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
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
                <Link to="/services">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  خدماتنا
                </Link>
              </Button>
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