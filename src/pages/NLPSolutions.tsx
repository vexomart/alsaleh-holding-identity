import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  Mic,
  FileText,
  Globe,
  Clock,
  Award,
  BookOpen,
  Zap,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";

const NLPSolutions = () => {
  const features = [
    {
      title: "تحليل المشاعر",
      description: "فهم وتحليل المشاعر والآراء في النصوص والتعليقات",
      icon: Target,
      benefits: ["رصد رضا العملاء", "تحليل الآراء", "تحسين الخدمات"]
    },
    {
      title: "الترجمة الآلية",
      description: "ترجمة فورية ودقيقة بين العربية والإنجليزية",
      icon: Globe,
      benefits: ["ترجمة فورية", "دقة عالية", "دعم متعدد اللغات"]
    },
    {
      title: "الملخصات الذكية",
      description: "تلخيص النصوص الطويلة واستخراج النقاط المهمة",
      icon: FileText,
      benefits: ["توفير الوقت", "استخراج المعلومات", "ملخصات دقيقة"]
    },
    {
      title: "المحادثات التفاعلية",
      description: "روبوتات محادثة ذكية تفهم السياق وتتفاعل طبيعياً",
      icon: MessageSquare,
      benefits: ["خدمة 24/7", "فهم السياق", "ردود طبيعية"]
    }
  ];

  const useCases = [
    {
      industry: "خدمة العملاء",
      description: "روبوتات دردشة ذكية للرد على استفسارات العملاء",
      results: ["تقليل وقت الاستجابة بـ 80%", "تحسين رضا العملاء", "خفض التكاليف التشغيلية"]
    },
    {
      industry: "التسويق الرقمي",
      description: "تحليل آراء العملاء ومشاعرهم تجاه المنتجات",
      results: ["فهم أفضل للعملاء", "تحسين استراتيجيات التسويق", "زيادة معدلات التحويل"]
    },
    {
      industry: "الإعلام والمحتوى",
      description: "تلخيص المقالات وتحليل المحتوى تلقائياً",
      results: ["تسريع إنتاج المحتوى", "تحسين جودة المحتوى", "توفير الموارد"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-emerald-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/20 mb-8">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-800">معالجة اللغات الطبيعية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">فهم اللغة</span>
              <br />
              <span className="text-slate-800">بذكاء اصطناعي</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              تقنيات متقدمة لفهم ومعالجة اللغة العربية والإنجليزية، مما يمكن الأنظمة من التفاعل مع البشر بطريقة طبيعية وذكية
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              مميزات معالجة اللغات الطبيعية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              حلول شاملة لفهم ومعالجة النصوص بطريقة ذكية ومتقدمة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
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

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-blue-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              حالات الاستخدام العملية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              كيف تساعد معالجة اللغات الطبيعية في تحسين الأعمال والخدمات
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card 
                key={index} 
                className="bg-white/70 border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {useCase.industry}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-sm">النتائج المحققة:</h4>
                    {useCase.results.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Star className="w-3 h-3 text-yellow-500" />
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تريد تطبيق معالجة اللغات الطبيعية في مشروعك؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              تواصل معنا لمناقشة كيف يمكن لحلول معالجة اللغات الطبيعية أن تحسن تفاعل عملائك مع أنظمتك
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
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default NLPSolutions;