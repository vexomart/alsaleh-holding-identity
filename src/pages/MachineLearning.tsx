import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  TrendingUp,
  BarChart3,
  Database,
  Clock,
  Award,
  Cpu,
  Activity,
  Zap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const MachineLearning = () => {
  const features = [
    {
      title: "التنبؤ بالبيانات",
      description: "خوارزميات متقدمة للتنبؤ بالاتجاهات والأنماط المستقبلية",
      icon: TrendingUp,
      benefits: ["دقة في التنبؤ", "تحليل الاتجاهات", "اتخاذ قرارات مدروسة"]
    },
    {
      title: "التصنيف الذكي",
      description: "تصنيف البيانات والمحتوى تلقائياً باستخدام خوارزميات التعلم الآلي",
      icon: Target,
      benefits: ["تصنيف دقيق", "أتمتة العمليات", "توفير الوقت"]
    },
    {
      title: "الكشف عن الأنماط",
      description: "اكتشاف الأنماط المخفية في البيانات الضخمة",
      icon: Activity,
      benefits: ["رؤى جديدة", "اكتشاف الفرص", "تحليل متعمق"]
    },
    {
      title: "التحليل التنبؤي",
      description: "تحليل البيانات التاريخية للتنبؤ بالأحداث المستقبلية",
      icon: BarChart3,
      benefits: ["تخطيط أفضل", "إدارة المخاطر", "تحسين الأداء"]
    }
  ];

  const algorithms = [
    {
      name: "التعلم العميق",
      description: "شبكات عصبية متعددة الطبقات للمهام المعقدة",
      icon: Brain,
      applications: ["معالجة الصور", "التعرف على الكلام", "الترجمة الآلية"]
    },
    {
      name: "التعلم المعزز",
      description: "تعلم من خلال التفاعل والمكافآت",
      icon: Award,
      applications: ["الألعاب الذكية", "الروبوتات", "التحكم الآلي"]
    },
    {
      name: "التجميع الذكي",
      description: "تجميع البيانات المتشابهة تلقائياً",
      icon: Users,
      applications: ["تقسيم العملاء", "تحليل السوق", "تخصيص المحتوى"]
    },
    {
      name: "الشبكات العصبية",
      description: "محاكاة طريقة عمل الدماغ البشري",
      icon: Zap,
      applications: ["التشخيص الطبي", "التمويل الذكي", "الأمان السيبراني"]
    }
  ];

  const industries = [
    {
      title: "الخدمات المالية",
      description: "تحليل المخاطر وكشف الاحتيال والاستثمار الذكي",
      results: ["تقليل المخاطر بـ 60%", "كشف الاحتيال بدقة 95%", "تحسين العائد على الاستثمار"]
    },
    {
      title: "التجارة الإلكترونية",
      description: "توصيات المنتجات وتحليل سلوك العملاء",
      results: ["زيادة المبيعات بـ 35%", "تحسين تجربة العملاء", "تخصيص أفضل للعروض"]
    },
    {
      title: "الرعاية الصحية",
      description: "تشخيص ذكي وتطوير الأدوية والطب الشخصي",
      results: ["دقة تشخيص 98%", "تسريع تطوير الأدوية", "علاج مخصص للمرضى"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-blue-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/20 mb-8">
              <Brain className="w-6 h-6 text-purple-600" />
              <span className="text-lg font-bold text-slate-800">التعلم الآلي المتقدم</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ذكاء يتعلم</span>
              <br />
              <span className="text-slate-800">ويتطور</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              خوارزميات التعلم الآلي المتطورة التي تتعلم من البيانات وتتحسن مع الوقت لتقديم رؤى ذكية وحلول مبتكرة
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              قدرات التعلم الآلي
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              حلول ذكية تتعلم من البيانات لتقديم نتائج دقيقة ومفيدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
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

      {/* Algorithms Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-purple-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              خوارزميات متقدمة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نستخدم أحدث خوارزميات التعلم الآلي والذكاء الاصطناعي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {algorithms.map((algorithm, index) => {
              const IconComponent = algorithm.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center bg-white/70 border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      {algorithm.name}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {algorithm.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">التطبيقات:</h4>
                      {algorithm.applications.map((app, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm justify-center">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-slate-600">{app}</span>
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

      {/* Industries Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              النجاحات المحققة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              كيف حقق التعلم الآلي نتائج استثنائية في مختلف القطاعات
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card 
                key={index} 
                className="bg-white/70 border-slate-200/50 hover:border-purple-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {industry.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {industry.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-sm">النتائج:</h4>
                    {industry.results.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">{result}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل أنت مستعد لاستكشاف قوة التعلم الآلي؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              دعنا نساعدك في تطبيق حلول التعلم الآلي المتقدمة لتحسين أعمالك وتحقيق نتائج مذهلة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-slate-100 border-0"
                asChild
              >
                <Link to="/contact">
                  <Brain className="w-5 h-5 mr-2" />
                  ابدأ مشروعك الذكي
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
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default MachineLearning;