import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Monitor,
  Smartphone,
  Globe,
  Zap,
  Shield,
  Search,
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Code,
  Palette,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const Websites = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const websiteTypes = [
    {
      title: "مواقع الشركات",
      description: "مواقع احترافية تعكس هوية شركتك وتجذب العملاء",
      icon: Monitor,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500/10",
      features: ["تصميم احترافي", "إدارة محتوى", "تحسين SEO", "نماذج تواصل"]
    },
    {
      title: "متاجر إلكترونية",
      description: "منصات تجارة إلكترونية متكاملة مع أنظمة دفع آمنة",
      icon: Globe,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-500/10",
      features: ["عربة التسوق", "بوابات الدفع", "إدارة المخزون", "تقارير المبيعات"]
    },
    {
      title: "مواقع شخصية",
      description: "مواقع شخصية ومدونات تعبر عن شخصيتك وأفكارك",
      icon: Users,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-500/10",
      features: ["تصميم مخصص", "مدونة", "معرض أعمال", "وسائل التواصل"]
    },
    {
      title: "تطبيقات الويب",
      description: "تطبيقات ويب تفاعلية لإدارة أعمالك وخدماتك",
      icon: Code,
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-500/10",
      features: ["واجهة تفاعلية", "قواعد بيانات", "API متقدم", "أمان عالي"]
    }
  ];

  const features = [
    {
      title: "تصميم متجاوب",
      description: "مواقع تعمل بشكل مثالي على جميع الأجهزة والشاشات",
      icon: Smartphone
    },
    {
      title: "سرعة فائقة",
      description: "تحسين الأداء لضمان سرعة تحميل استثنائية",
      icon: Zap
    },
    {
      title: "أمان متقدم",
      description: "حماية شاملة ضد التهديدات الأمنية",
      icon: Shield
    },
    {
      title: "تحسين محركات البحث",
      description: "تحسين SEO لظهور أفضل في نتائج البحث",
      icon: Search
    }
  ];

  const process = [
    {
      step: 1,
      title: "التخطيط والتحليل",
      description: "دراسة المتطلبات وتحليل احتياجات المشروع",
      icon: Settings
    },
    {
      step: 2,
      title: "التصميم والنماذج",
      description: "إنشاء التصاميم والنماذج التفاعلية",
      icon: Palette
    },
    {
      step: 3,
      title: "التطوير والبرمجة",
      description: "تطوير الموقع باستخدام أحدث التقنيات",
      icon: Code
    },
    {
      step: 4,
      title: "الاختبار والنشر",
      description: "اختبار شامل ونشر الموقع على الخوادم",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="تطوير المواقع الإلكترونية - حلول ويب احترافية"
        description="خدمات تطوير المواقع الإلكترونية الاحترافية - مواقع الشركات، المتاجر الإلكترونية، والتطبيقات التفاعلية"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Monitor className="w-4 h-4 mr-2" />
              تطوير المواقع الإلكترونية
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground via-primary/80 to-secondary/60 bg-clip-text text-transparent">
              مواقع إلكترونية احترافية
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نطور مواقع إلكترونية حديثة ومتجاوبة تعكس هوية علامتك التجارية وتحقق أهدافك التسويقية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/contact">
                <Button size="lg" className="group px-8">
                  ابدأ مشروعك الآن
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/our-works">
                <Button variant="outline" size="lg" className="px-8">
                  اطلع على أعمالنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Website Types */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">أنواع المواقع التي نطورها</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم حلول متنوعة تناسب جميع أنواع الأعمال والمتطلبات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {websiteTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card key={index} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${type.bgColor} backdrop-blur-sm`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${type.bgColor} border-2 border-primary/20 flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="space-y-2">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span>{feature}</span>
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

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">المميزات الأساسية</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نضمن أن جميع مواقعنا تتمتع بأعلى معايير الجودة والأداء
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">عملية التطوير</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نتبع منهجية واضحة ومنظمة لضمان تسليم مشروعك في الوقت المحدد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {process.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] bg-card/80 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start gap-6">
                      {/* Step Number Circle */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300 transform group-hover:scale-110">
                          <span className="text-white font-bold text-xl">{step.step}</span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 text-right">
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Connecting Line for Desktop */}
                  {index < process.length - 1 && index % 2 === 0 && (
                    <div className="hidden md:block absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"></div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-12 text-center backdrop-blur-sm border border-primary/20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              جاهز لبناء موقعك الإلكتروني؟
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              تواصل معنا اليوم واحصل على استشارة مجانية لمناقشة متطلبات مشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="group px-8">
                  تواصل معنا الآن
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/book-consultation">
                <Button variant="outline" size="lg" className="px-8">
                  احجز استشارة مجانية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Websites;