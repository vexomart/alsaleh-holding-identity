import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Workflow,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  Settings,
  Cog,
  Clock,
  Award,
  Zap,
  Cpu,
  Bot,
  Globe,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const SmartAutomation = () => {
  const features = [
    {
      title: "أتمتة العمليات",
      description: "أتمتة المهام المتكررة والعمليات التجارية لزيادة الكفاءة",
      icon: Cog,
      benefits: ["توفير الوقت", "تقليل الأخطاء", "زيادة الإنتاجية"]
    },
    {
      title: "سير العمل الذكي",
      description: "تصميم وإدارة مسارات عمل ذكية تتكيف مع متطلبات العمل",
      icon: Workflow,
      benefits: ["مرونة عالية", "إدارة ذكية", "تحسين مستمر"]
    },
    {
      title: "التحسين التلقائي",
      description: "تحسين الأداء والعمليات تلقائياً باستخدام الذكاء الاصطناعي",
      icon: TrendingUp,
      benefits: ["تحسن مستمر", "أداء محسن", "كفاءة عالية"]
    },
    {
      title: "الكفاءة المتقدمة",
      description: "تحقيق أقصى استفادة من الموارد والوقت المتاح",
      icon: Zap,
      benefits: ["استغلال أمثل", "نتائج أفضل", "عائد أكبر"]
    }
  ];

  const automationTypes = [
    {
      name: "أتمتة الموارد البشرية",
      description: "أتمتة عمليات التوظيف والرواتب والتقييمات",
      icon: Users,
      processes: ["فرز السير الذاتية", "جدولة المقابلات", "حساب الرواتب", "تقييم الأداء"]
    },
    {
      name: "أتمتة المبيعات",
      description: "أتمتة عمليات البيع ومتابعة العملاء",
      icon: Target,
      processes: ["تأهيل العملاء المحتملين", "متابعة الفرص", "إرسال العروض", "معالجة الطلبات"]
    },
    {
      title: "أتمتة التسويق",
      description: "أتمتة الحملات التسويقية والتواصل مع العملاء",
      icon: Globe,
      processes: ["إرسال الإيميلات", "إدارة وسائل التواصل", "تتبع الحملات", "تقسيم الجمهور"]
    },
    {
      name: "أتمتة المالية",
      description: "أتمتة العمليات المالية والمحاسبية",
      icon: Award,
      processes: ["معالجة الفواتير", "التسوية البنكية", "التقارير المالية", "إدارة المصروفات"]
    }
  ];

  const benefits = [
    {
      metric: "75%",
      description: "توفير في الوقت",
      icon: Clock
    },
    {
      metric: "90%",
      description: "تقليل الأخطاء",
      icon: Shield
    },
    {
      metric: "50%",
      description: "زيادة الإنتاجية",
      icon: TrendingUp
    },
    {
      metric: "24/7",
      description: "عمل مستمر",
      icon: Activity
    }
  ];

  const tools = [
    {
      name: "RPA - أتمتة العمليات الروبوتية",
      description: "روبوتات برمجية تحاكي المهام البشرية",
      features: ["محاكاة الإجراءات", "التكامل مع الأنظمة", "تنفيذ مجدول", "مراقبة الأداء"]
    },
    {
      name: "AI Workflows - مسارات العمل الذكية",
      description: "مسارات عمل تتخذ قرارات ذكية",
      features: ["اتخاذ القرار", "التعلم التكيفي", "المعالجة الذكية", "التحسين المستمر"]
    },
    {
      name: "Integration APIs - واجهات التكامل",
      description: "ربط الأنظمة المختلفة بسلاسة",
      features: ["تكامل سلس", "مزامنة البيانات", "أمان عالي", "مراقبة مستمرة"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/20 mb-8">
              <Workflow className="w-6 h-6 text-indigo-600" />
              <span className="text-lg font-bold text-slate-800">الأتمتة الذكية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">أتمتة ذكية</span>
              <br />
              <span className="text-slate-800">كفاءة استثنائية</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              حلول أتمتة متطورة تحول العمليات اليدوية إلى مهام تلقائية ذكية، مما يحرر فريقك للتركيز على المهام الإستراتيجية
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              قوة الأتمتة الذكية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              تقنيات متقدمة لأتمتة العمليات وتحسين الكفاءة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">الفوائد:</h4>
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

      {/* Automation Types Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-indigo-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              مجالات الأتمتة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              أتمتة شاملة لمختلف أقسام وعمليات الشركة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {automationTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/70 border-slate-200/50 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
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
                      <h4 className="font-semibold text-slate-900 text-sm">العمليات المؤتمتة:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {type.processes.map((process, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-slate-600">{process}</span>
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              النتائج المحققة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              تحسينات ملموسة في الأداء والكفاءة
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 hover:border-indigo-300/50 transition-all duration-300 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{benefit.metric}</div>
                  <div className="text-slate-600">{benefit.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-indigo-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              أدوات الأتمتة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              تقنيات متطورة لبناء حلول أتمتة شاملة ومتقدمة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className="bg-white/70 border-slate-200/50 hover:border-indigo-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-3 text-center">
                    {tool.name}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed text-center">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
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

      {/* Implementation Process */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              عملية التطبيق
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              منهجية واضحة لضمان نجاح مشروع الأتمتة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "التحليل", description: "تحليل العمليات الحالية وتحديد فرص الأتمتة" },
              { step: "2", title: "التصميم", description: "تصميم حلول الأتمتة المناسبة للاحتياجات" },
              { step: "3", title: "التطوير", description: "تطوير وتنفيذ حلول الأتمتة والاختبار" },
              { step: "4", title: "التشغيل", description: "نشر الحلول والتدريب والدعم المستمر" }
            ].map((phase, index) => (
              <div 
                key={index} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{phase.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{phase.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل أنت مستعد لثورة الأتمتة؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              دعنا نساعدك في تحويل عملياتك وتحسين كفاءتك من خلال حلول الأتمتة الذكية المتقدمة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-slate-100 border-0"
                asChild
              >
                <Link to="/automation-system">
                  <Workflow className="w-5 h-5 mr-2" />
                  ابدأ رحلة الأتمتة
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
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default SmartAutomation;