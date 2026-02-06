import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap,
  Brain,
  Bot,
  Eye,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  Mic,
  Image,
  BarChart3,
  Workflow,
  Camera,
  FileText,
  Search,
  Cpu,
  Settings,
  Sparkles,
  Rocket,
  Globe,
  Clock,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const AISolutions = () => {
  const aiServices = [
    {
      id: 1,
      title: "معالجة اللغات الطبيعية",
      description: "تطوير حلول ذكية لفهم وتحليل النصوص والمحادثات باللغة العربية والإنجليزية",
      features: ["تحليل المشاعر", "الترجمة الآلية", "الملخصات الذكية", "المحادثات التفاعلية"],
      icon: MessageSquare,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "الرؤية الحاسوبية",
      description: "تقنيات متقدمة لتحليل ومعالجة الصور والفيديوهات لأغراض مختلفة",
      features: ["التعرف على الوجوه", "تصنيف الصور", "رصد الأنماط", "التحليل المرئي"],
      icon: Eye,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      title: "التعلم الآلي المتقدم",
      description: "خوارزميات ذكية لتحليل البيانات والتنبؤ بالاتجاهات المستقبلية",
      features: ["التنبؤ بالبيانات", "التصنيف الذكي", "الكشف عن الأنماط", "التحليل التنبؤي"],
      icon: Brain,
      color: "purple",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 4,
      title: "المساعدات الذكية",
      description: "روبوتات محادثة ومساعدات رقمية ذكية لتحسين تجربة العملاء",
      features: ["الدردشة الذكية", "المساعدة التلقائية", "الإجابة الفورية", "التعلم المستمر"],
      icon: Bot,
      color: "orange",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      title: "التحليلات الذكية",
      description: "أدوات تحليل متقدمة لاستخراج رؤى قيمة من البيانات الضخمة",
      features: ["تحليل البيانات", "الرؤى التجارية", "التقارير الذكية", "التوصيات المخصصة"],
      icon: BarChart3,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      id: 6,
      title: "الأتمتة الذكية",
      description: "حلول أتمتة المهام والعمليات باستخدام الذكاء الاصطناعي",
      features: ["أتمتة العمليات", "سير العمل الذكي", "التحسين التلقائي", "الكفاءة المتقدمة"],
      icon: Workflow,
      color: "indigo",
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  const useCases = [
    {
      title: "التجارة الإلكترونية",
      description: "تحسين تجربة التسوق عبر التوصيات الذكية وتحليل سلوك العملاء",
      icon: Target,
      benefits: ["زيادة المبيعات", "تحسين الاستهداف", "خفض التكاليف"]
    },
    {
      title: "الرعاية الصحية",
      description: "مساعدة في التشخيص وتحليل البيانات الطبية وإدارة المرضى",
      icon: Shield,
      benefits: ["دقة التشخيص", "سرعة الاستجابة", "تحسين الرعاية"]
    },
    {
      title: "التعليم والتدريب",
      description: "منصات تعلم ذكية تتكيف مع احتياجات كل طالب",
      icon: Brain,
      benefits: ["التعلم المخصص", "متابعة التقدم", "محتوى تفاعلي"]
    },
    {
      title: "الخدمات المالية",
      description: "اكتشاف الاحتيال وتحليل المخاطر وخدمات العملاء الآلية",
      icon: TrendingUp,
      benefits: ["الأمان المتقدم", "إدارة المخاطر", "خدمة فورية"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
              <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
              <span className="text-lg font-bold text-slate-800">حلول الذكاء الاصطناعي</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">المستقبل الذكي</span>
              <br />
              <span className="text-slate-800">يبدأ هنا</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              نطور حلول الذكاء الاصطناعي المتقدمة لتحويل أعمالكم وتحسين كفاءتها باستخدام أحدث التقنيات والخوارزميات الذكية
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                asChild
              >
                <Link to="/contact">
                  <Sparkles className="w-5 h-5 mr-2" />
                  ابدأ مشروعك الذكي
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-slate-300 hover:border-blue-400 hover:text-blue-600"
              >
                <Eye className="w-5 h-5 mr-2" />
                استكشف الحلول
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              خدماتنا في الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من حلول الذكاء الاصطناعي المصممة خصيصاً لتلبية احتياجات عملكم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="group bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 border-0"
                      asChild
                    >
                      <Link 
                        to={
                          service.id === 1 ? "/nlp-solutions" :
                          service.id === 2 ? "/computer-vision" :
                          service.id === 3 ? "/machine-learning" :
                          service.id === 4 ? "/smart-assistants" :
                          service.id === 5 ? "/smart-analytics" :
                          service.id === 6 ? "/smart-automation" :
                          "#"
                        }
                      >
                        تعرف على المزيد
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              مجالات التطبيق
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              حلولنا الذكية تخدم مختلف القطاعات والصناعات لتحقيق النمو والتطور
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      {useCase.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {useCase.description}
                    </p>
                    
                    <div className="space-y-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-slate-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                لماذا تختار حلولنا في الذكاء الاصطناعي؟
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">تقنيات متطورة</h3>
                    <p className="text-slate-600">نستخدم أحدث خوارزميات التعلم الآلي والذكاء الاصطناعي</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">حلول مخصصة</h3>
                    <p className="text-slate-600">نطور حلول مصممة خصيصاً لتناسب احتياجات عملكم الفريدة</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">تنفيذ سريع</h3>
                    <p className="text-slate-600">نضمن تسليم المشاريع في الوقت المحدد مع أعلى معايير الجودة</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">فريق خبير</h3>
                    <p className="text-slate-600">فريق من الخبراء المتخصصين في مجال الذكاء الاصطناعي</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-blue-500/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                    <div className="text-sm text-slate-600">دقة النتائج</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">50+</div>
                    <div className="text-sm text-slate-600">مشروع مكتمل</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-slate-600">دعم مستمر</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
                    <div className="text-sm text-slate-600">رضا العملاء</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                هل أنت مستعد لدخول عصر الذكاء الاصطناعي؟
              </h2>
              <p className="text-xl mb-8 opacity-90">
                تواصل معنا اليوم لاستكشاف كيف يمكن لحلول الذكاء الاصطناعي أن تحول أعمالكم وتحقق نتائج استثنائية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 border-0"
                  asChild
                >
                  <Link to="/contact">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    احجز استشارة مجانية
                  </Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 border-2"
                  asChild
                >
                  <Link to="/ready-projects">
                    <Code className="w-5 h-5 mr-2" />
                    استكشف مشاريعنا
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
          <ArrowRight className="w-4 h-4" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default AISolutions;