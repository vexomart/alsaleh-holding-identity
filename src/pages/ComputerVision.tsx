import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Target,
  Shield,
  Lightbulb,
  Code,
  Camera,
  Image,
  Scan,
  Clock,
  Award,
  FileImage,
  Video,
  Zap,
  Brain
} from "lucide-react";
import { Link } from "react-router-dom";

const ComputerVision = () => {
  const features = [
    {
      title: "التعرف على الوجوه",
      description: "تقنيات متقدمة للتعرف على الوجوه وتحليل التعبيرات",
      icon: Users,
      benefits: ["أمان عالي", "تحكم في الوصول", "تحليل المشاعر"]
    },
    {
      title: "تصنيف الصور",
      description: "تصنيف وتنظيم الصور تلقائياً باستخدام الذكاء الاصطناعي",
      icon: Image,
      benefits: ["تنظيم تلقائي", "بحث ذكي", "توفير الوقت"]
    },
    {
      title: "رصد الأنماط",
      description: "اكتشاف الأنماط والتشوهات في الصور والفيديوهات",
      icon: Scan,
      benefits: ["اكتشاف مبكر", "دقة عالية", "مراقبة مستمرة"]
    },
    {
      title: "التحليل المرئي",
      description: "تحليل شامل للمحتوى المرئي واستخراج المعلومات",
      icon: Target,
      benefits: ["استخراج البيانات", "تحليل شامل", "رؤى قيمة"]
    }
  ];

  const applications = [
    {
      category: "الأمن والمراقبة",
      description: "أنظمة مراقبة ذكية للأمان والحماية",
      features: ["كشف التسلل", "تتبع الحركة", "تحليل السلوك"],
      icon: Shield
    },
    {
      category: "التجارة الإلكترونية",
      description: "تحسين تجربة التسوق من خلال البحث البصري",
      features: ["البحث بالصورة", "توصيات مرئية", "تجربة محسنة"],
      icon: Target
    },
    {
      category: "الرعاية الصحية",
      description: "مساعدة في التشخيص الطبي وتحليل الصور الطبية",
      features: ["تحليل الأشعة", "كشف التشوهات", "دعم التشخيص"],
      icon: Award
    },
    {
      category: "التصنيع الذكي",
      description: "مراقبة جودة المنتجات وأتمتة خطوط الإنتاج",
      features: ["فحص الجودة", "كشف العيوب", "أتمتة العمليات"],
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-blue-600/5 to-purple-600/10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full border border-emerald-500/20 mb-8">
              <Eye className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-bold text-slate-800">الرؤية الحاسوبية</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">رؤية ذكية</span>
              <br />
              <span className="text-slate-800">للمستقبل</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              تقنيات متطورة لتمكين الآلات من "الرؤية" وفهم المحتوى المرئي، مما يفتح آفاقاً جديدة في التطبيقات الذكية
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              قدرات الرؤية الحاسوبية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              حلول متقدمة لتحليل ومعالجة الصور والفيديوهات بدقة عالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group bg-white/70 border-slate-200/50 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
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

      {/* Applications Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100/50 to-emerald-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              تطبيقات عملية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              كيف تعمل الرؤية الحاسوبية على تحسين مختلف القطاعات والصناعات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {applications.map((app, index) => {
              const IconComponent = app.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center bg-white/70 border-slate-200/50 hover:border-emerald-300/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      {app.category}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                      {app.description}
                    </p>
                    
                    <div className="space-y-2">
                      {app.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm justify-center">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-slate-600">{feature}</span>
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

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              التقنيات المستخدمة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نستخدم أحدث التقنيات والخوارزميات في مجال الرؤية الحاسوبية
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "TensorFlow", description: "إطار عمل للتعلم الآلي" },
              { name: "OpenCV", description: "مكتبة الرؤية الحاسوبية" },
              { name: "YOLO", description: "كشف الكائنات السريع" },
              { name: "PyTorch", description: "شبكات عصبية متقدمة" }
            ].map((tech, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white/70 rounded-xl border border-slate-200/50 hover:border-emerald-300/50 transition-all duration-300 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{tech.name}</h3>
                <p className="text-sm text-slate-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl p-12 text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تريد دمج الرؤية الحاسوبية في مشروعك؟
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              تواصل معنا لمناقشة كيف يمكن للرؤية الحاسوبية أن تحسن كفاءة أعمالك وتفتح آفاقاً جديدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-emerald-600 hover:bg-slate-100 border-0"
                asChild
              >
                <Link to="/contact">
                  <Eye className="w-5 h-5 mr-2" />
                  احجز عرض توضيحي
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
        <Link to="/ai-solutions" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          العودة إلى حلول الذكاء الاصطناعي
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default ComputerVision;