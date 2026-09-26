import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  MessageSquare,
  Headphones,
  Clock,
  Award,
  Mic,
  Phone,
  Zap,
  Globe,
  Settings,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";

const SmartAssistants = () => {
  const features = [
    {
      title: "الدردشة الذكية",
      description: "روبوتات محادثة متقدمة تفهم السياق وتقدم إجابات دقيقة",
      icon: MessageSquare,
      benefits: ["فهم السياق", "إجابات دقيقة", "تفاعل طبيعي"]
    },
    {
      title: "المساعدة التلقائية",
      description: "نظام مساعدة آلي يحل المشاكل ويقدم الدعم الفوري",
      icon: Headphones,
      benefits: ["دعم فوري", "حل المشاكل", "خدمة مستمرة"]
    },
    {
      title: "الإجابة الفورية",
      description: "ردود سريعة ومفيدة على جميع الاستفسارات والطلبات",
      icon: Clock,
      benefits: ["استجابة سريعة", "إجابات شاملة", "توفير الوقت"]
    },
    {
      title: "التعلم المستمر",
      description: "تحسين الأداء والفهم باستمرار من خلال التفاعل مع المستخدمين",
      icon: BookOpen,
      benefits: ["تحسن مستمر", "تكيف ذكي", "خبرة متراكمة"]
    }
  ];

  const assistantTypes = [
    {
      name: "مساعد خدمة العملاء",
      description: "للرد على استفسارات العملاء وحل مشاكلهم",
      icon: Users,
      capabilities: ["الرد على الأسئلة الشائعة", "توجيه العملاء", "حل المشاكل البسيطة", "تحويل للدعم البشري"]
    },
    {
      name: "مساعد المبيعات",
      description: "لمساعدة العملاء في عملية الشراء والتوصيات",
      icon: Target,
      capabilities: ["توصيات المنتجات", "مقارنة الأسعار", "معالجة الطلبات", "متابعة العملاء"]
    },
    {
      name: "مساعد تقني",
      description: "لتقديم الدعم التقني وحل المشاكل التقنية",
      icon: Settings,
      capabilities: ["تشخيص المشاكل", "إرشادات الاستخدام", "حلول تقنية", "متابعة التحديثات"]
    },
    {
      name: "مساعد إداري",
      description: "لإدارة المواعيد والمهام والمعلومات",
      icon: Award,
      capabilities: ["إدارة المواعيد", "تنظيم المهام", "البحث في المعلومات", "إرسال التذكيرات"]
    }
  ];

  const integrations = [
    {
      platform: "المواقع الإلكترونية",
      description: "دمج سلس مع مواقع الإنترنت",
      benefits: ["سهولة التركيب", "تصميم مرن", "استجابة سريعة"]
    },
    {
      platform: "تطبيقات الهاتف",
      description: "مساعدات ذكية للتطبيقات المحمولة",
      benefits: ["واجهة بديهية", "أداء محسن", "تفاعل صوتي"]
    },
    {
      platform: "منصات التواصل",
      description: "روبوتات للفيسبوك وواتساب وتيليجرام",
      benefits: ["وصول أوسع", "تفاعل مستمر", "إشعارات ذكية"]
    },
    {
      platform: "أنظمة CRM",
      description: "تكامل مع أنظمة إدارة علاقات العملاء",
      benefits: ["بيانات موحدة", "متابعة شاملة", "تحليلات متقدمة"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-red-600/5 to-pink-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/20 mb-8">
              <Bot className="w-6 h-6 text-orange-600" />
              <span className="text-lg font-bold text-slate-800">المساعدات الذكية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">مساعدك الرقمي</span>
              <br />
              <span className="text-slate-800">متاح دائماً</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              مساعدات ذكية متطورة تعمل على مدار الساعة لتقديم الدعم والمساعدة لعملائك بكفاءة ودقة عالية
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              مميزات المساعدات الذكية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              حلول ذكية للتفاعل مع العملاء وتقديم الدعم المطلوب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 text-sm">المميزات:</h4>
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

      {/* Assistant Types Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-orange-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              أنواع المساعدات الذكية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              مساعدات متخصصة لمختلف المجالات والاحتياجات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {assistantTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/70 border-slate-200/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
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
                      <h4 className="font-semibold text-slate-900 text-sm">القدرات:</h4>
                      {type.capabilities.map((capability, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-slate-600">{capability}</span>
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

      {/* Integrations Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              التكامل مع منصاتك
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              دمج سلس مع جميع منصاتك وأنظمتك الحالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <Card 
                key={index} 
                className="text-center bg-white/70 border-slate-200/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {integration.platform}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {integration.description}
                  </p>
                  
                  <div className="space-y-2">
                    {integration.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm justify-center">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-orange-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              النتائج المحققة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              إحصائيات حقيقية من عملائنا الذين طبقوا المساعدات الذكية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
              <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
              <div className="text-slate-600">تقليل وقت الاستجابة</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
              <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-slate-600">خدمة مستمرة</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
              <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
              <div className="text-slate-600">رضا العملاء</div>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-2xl border border-slate-200/50 backdrop-blur-sm animate-fade-in">
              <div className="text-3xl font-bold text-red-600 mb-2">60%</div>
              <div className="text-slate-600">توفير في التكاليف</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تريد مساعد ذكي لعملك؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              دعنا ننشئ لك مساعد ذكي مخصص يخدم عملائك ويحسن من كفاءة أعمالك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-slate-100 border-0"
                asChild
              >
                <Link to="/contact">
                  <Bot className="w-5 h-5 mr-2" />
                  اطلب مساعدك الذكي
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
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default SmartAssistants;