import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  TrendingUp,
  Database,
  Clock,
  Award,
  Eye,
  PieChart,
  Zap,
  Globe,
  Search,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const SmartAnalytics = () => {
  const features = [
    {
      title: "تحليل البيانات",
      description: "تحليل شامل ومتقدم للبيانات الضخمة لاستخراج رؤى قيمة",
      icon: Database,
      benefits: ["تحليل شامل", "معالجة سريعة", "دقة عالية"]
    },
    {
      title: "الرؤى التجارية",
      description: "استخراج رؤى تجارية مفيدة لاتخاذ قرارات مدروسة ومربحة",
      icon: Eye,
      benefits: ["رؤى عميقة", "قرارات مدروسة", "نتائج مربحة"]
    },
    {
      title: "التقارير الذكية",
      description: "إنشاء تقارير تفاعلية وذكية تلقائياً مع التحديث المستمر",
      icon: PieChart,
      benefits: ["تقارير تلقائية", "تصميم تفاعلي", "تحديث مستمر"]
    },
    {
      title: "التوصيات المخصصة",
      description: "تقديم توصيات ذكية ومخصصة بناءً على تحليل البيانات",
      icon: Target,
      benefits: ["توصيات ذكية", "تخصيص دقيق", "تحسين النتائج"]
    }
  ];

  const analyticsTypes = [
    {
      name: "تحليلات العملاء",
      description: "فهم سلوك العملاء وتفضيلاتهم",
      icon: Users,
      metrics: ["معدل التحويل", "رضا العملاء", "قيمة العميل", "معدل الاحتفاظ"]
    },
    {
      name: "تحليلات المبيعات",
      description: "تتبع الأداء المالي والمبيعات",
      icon: TrendingUp,
      metrics: ["الإيرادات", "نمو المبيعات", "الربحية", "حصة السوق"]
    },
    {
      name: "تحليلات التسويق",
      description: "قياس فعالية الحملات التسويقية",
      icon: Target,
      metrics: ["ROI الإعلاني", "معدل المشاركة", "التكلفة لكل عميل", "معدل الوصول"]
    },
    {
      name: "تحليلات العمليات",
      description: "تحسين الكفاءة التشغيلية والإنتاجية",
      icon: Award,
      metrics: ["كفاءة العمليات", "وقت التنفيذ", "جودة المنتج", "توفير التكاليف"]
    }
  ];

  const dashboards = [
    {
      title: "لوحة المدير التنفيذي",
      description: "نظرة شاملة على أداء الشركة",
      features: ["مؤشرات الأداء الرئيسية", "تحليل الاتجاهات", "مقارنات زمنية", "توقعات مستقبلية"]
    },
    {
      title: "لوحة المبيعات",
      description: "تتبع تفصيلي لأداء المبيعات",
      features: ["أهداف المبيعات", "أداء الفريق", "تحليل المنتجات", "التنبؤ بالمبيعات"]
    },
    {
      title: "لوحة التسويق",
      description: "مراقبة حملات التسويق الرقمي",
      features: ["أداء الحملات", "تحليل الجمهور", "معدلات التحويل", "عائد الاستثمار"]
    },
    {
      title: "لوحة العمليات",
      description: "مراقبة العمليات والجودة",
      features: ["مراقبة الإنتاج", "إدارة المخزون", "مؤشرات الجودة", "تحليل التكاليف"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-blue-600/5 to-indigo-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-500/20 mb-8">
              <BarChart3 className="w-6 h-6 text-cyan-600" />
              <span className="text-lg font-bold text-slate-800">التحليلات الذكية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">بيانات تتكلم</span>
              <br />
              <span className="text-slate-800">قرارات ذكية</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              حوّل بياناتك إلى رؤى قيمة وقرارات مدروسة باستخدام أدوات التحليل المتقدمة والذكاء الاصطناعي
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              قوة التحليلات الذكية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أدوات متطورة لتحليل البيانات واستخراج الرؤى المفيدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">المزايا:</h4>
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-slate-600">{benefit}</span>
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

      {/* Analytics Types Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-cyan-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              أنواع التحليلات
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              تحليلات متخصصة لمختلف جوانب العمل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {analyticsTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/70 border-slate-200/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {type.name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">المؤشرات الرئيسية:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {type.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-slate-600">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboards Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              لوحات القيادة التفاعلية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              لوحات مخصصة لعرض البيانات بطريقة مرئية وتفاعلية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboards.map((dashboard, index) => (
              <Card 
                key={index} 
                className="text-center bg-white/70 border-slate-200/50 hover:border-cyan-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {dashboard.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {dashboard.description}
                  </p>
                  
                  <div className="space-y-2">
                    {dashboard.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm justify-center">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-cyan-50/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                لماذا التحليلات الذكية؟
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">رؤى عميقة</h3>
                    <p className="text-slate-600">اكتشف أنماط ورؤى مخفية في بياناتك</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">قرارات مدروسة</h3>
                    <p className="text-slate-600">اتخذ قرارات مبنية على بيانات حقيقية</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">توفير الوقت</h3>
                    <p className="text-slate-600">تقارير تلقائية وتحديثات فورية</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">تحسين الأداء</h3>
                    <p className="text-slate-600">حدد نقاط القوة والضعف في أعمالك</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-cyan-500/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-cyan-600 mb-1">250%</div>
                    <div className="text-sm text-slate-600">تحسن في اتخاذ القرارات</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">90%</div>
                    <div className="text-sm text-slate-600">توفير في الوقت</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">40%</div>
                    <div className="text-sm text-slate-600">زيادة في الإيرادات</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">Real-time</div>
                    <div className="text-sm text-slate-600">تحديثات فورية</div>
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
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تريد تحويل بياناتك إلى قوة تنافسية؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              دعنا نساعدك في بناء نظام تحليلات ذكي يحول بياناتك إلى رؤى قيمة تدفع نمو أعمالك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-cyan-600 hover:bg-slate-100 border-0"
                asChild
              >
                <Link to="/contact">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  ابدأ رحلة التحليلات
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 border-2"
                asChild
              >
                <Link to="/ai-solutions">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  عودة لحلول الذكاء الاصطناعي
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Back Navigation */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default SmartAnalytics;