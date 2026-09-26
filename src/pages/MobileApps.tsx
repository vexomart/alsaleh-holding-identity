import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Smartphone,
  Apple,
  Monitor,
  Cloud,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Code,
  Palette,
  Settings,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

const MobileApps = () => {
  const [activeTab, setActiveTab] = useState("ios");

  const appTypes = [
    {
      title: "تطبيقات iOS",
      description: "تطبيقات أصلية للآيفون والآيباد بأعلى معايير آبل",
      icon: Apple,
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gray-500/10",
      features: ["Swift & SwiftUI", "App Store Connect", "TestFlight", "Push Notifications"]
    },
    {
      title: "تطبيقات Android",
      description: "تطبيقات أندرويد محسّنة لجميع الأجهزة والإصدارات",
      icon: Smartphone,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-500/10",
      features: ["Kotlin & Java", "Google Play Console", "Material Design", "Firebase Integration"]
    },
    {
      title: "التطبيقات المختلطة",
      description: "تطبيقات تعمل على جميع المنصات بكود واحد",
      icon: Monitor,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-500/10",
      features: ["React Native", "Flutter", "Cross-Platform", "Native Performance"]
    },
    {
      title: "تطبيقات الويب التقدمية",
      description: "تطبيقات ويب تعمل مثل التطبيقات الأصلية",
      icon: Cloud,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-500/10",
      features: ["PWA Technology", "Offline Mode", "App-like Experience", "Easy Installation"]
    }
  ];

  const features = [
    {
      title: "واجهة مستخدم مبتكرة",
      description: "تصميم عصري وسهل الاستخدام يحبه المستخدمون",
      icon: Palette
    },
    {
      title: "أداء سريع",
      description: "تحسين الأداء لضمان سرعة استجابة استثنائية",
      icon: Zap
    },
    {
      title: "أمان متقدم",
      description: "حماية البيانات والخصوصية بأعلى المعايير",
      icon: Shield
    },
    {
      title: "ربط سحابي",
      description: "مزامنة البيانات عبر جميع الأجهزة",
      icon: Cloud
    }
  ];

  const developmentProcess = [
    {
      step: 1,
      title: "دراسة الفكرة",
      description: "تحليل المتطلبات ودراسة السوق المستهدف",
      icon: Settings
    },
    {
      step: 2,
      title: "التصميم والنماذج",
      description: "إنشاء النماذج والتصاميم التفاعلية",
      icon: Palette
    },
    {
      step: 3,
      title: "التطوير والبرمجة",
      description: "كتابة الكود وتطوير المميزات",
      icon: Code
    },
    {
      step: 4,
      title: "الاختبار والنشر",
      description: "اختبار شامل ونشر في المتاجر",
      icon: TrendingUp
    }
  ];

  const technologies = [
    { name: "React Native", level: 95 },
    { name: "Flutter", level: 90 },
    { name: "Swift/iOS", level: 88 },
    { name: "Kotlin/Android", level: 92 },
    { name: "Firebase", level: 85 },
    { name: "API Integration", level: 90 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="تطوير التطبيقات الذكية - iOS و Android"
        description="خدمات تطوير التطبيقات الذكية للهواتف والأجهزة اللوحية - تطبيقات iOS وAndroid وحلول متعددة المنصات"
      />
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Smartphone className="w-4 h-4 mr-2" />
              تطوير التطبيقات الذكية
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-foreground via-primary/80 to-secondary/60 bg-clip-text text-transparent">
              تطبيقات ذكية مبتكرة
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نطور تطبيقات ذكية عالية الجودة للهواتف والأجهزة اللوحية تحقق أهدافك وتوفر تجربة استخدام استثنائية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/contact">
                <Button size="lg" className="group px-8">
                  ابدأ تطبيقك الآن
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

      {/* App Types */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">أنواع التطبيقات التي نطورها</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم حلول متنوعة لجميع المنصات والمتطلبات التقنية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {appTypes.map((type, index) => {
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">مميزات تطبيقاتنا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نضمن أن جميع تطبيقاتنا تتمتع بأعلى معايير الجودة والأداء
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

      {/* Technologies */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">التقنيات التي نستخدمها</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نعتمد على أحدث التقنيات والأدوات في تطوير التطبيقات
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {technologies.map((tech, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{tech.name}</span>
                  <span className="text-primary font-bold">{tech.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${tech.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-24 bg-muted/30" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">عملية التطوير</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نتبع منهجية احترافية واضحة لضمان تسليم مشروعك بأعلى جودة وفي الوقت المحدد
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {developmentProcess.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={index} 
                  className="relative opacity-0 animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Step Connection Line */}
                  {index < developmentProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-20 -left-4 w-8 h-px bg-gradient-to-r from-primary/50 to-primary/20 z-10"></div>
                  )}
                  
                  <Card className="group relative h-full bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                    
                    <CardContent className="p-8 relative z-10 text-center">
                      {/* Step Number */}
                      <div className="relative mx-auto mb-6 w-16 h-16">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300 transform group-hover:scale-110">
                          <span className="text-white font-bold text-xl">{step.step}</span>
                        </div>
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-100"></div>
                      </div>
                      
                      {/* Icon */}
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-all duration-300 transform group-hover:scale-110">
                        <IconComponent className="w-6 h-6 text-primary group-hover:scale-125 transition-transform duration-300" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {step.description}
                      </p>
                      
                      {/* Step Progress Bar */}
                      <div className="mt-6 w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${((index + 1) / developmentProcess.length) * 100}%`,
                            transitionDelay: `${index * 200 + 500}ms`
                          }}
                        ></div>
                      </div>
                      
                      {/* Completion Badge */}
                      <div className="mt-4 inline-flex items-center gap-2 text-xs text-primary font-medium">
                        <CheckCircle className="w-4 h-4" />
                        المرحلة {index + 1}
                      </div>
                    </CardContent>
                    
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-secondary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-ping"></div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Process Summary */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '1000ms', animationFillMode: 'forwards', opacity: '0' }}>
            <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-8 border border-primary/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                ضمان الجودة والتسليم في الوقت المحدد
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نلتزم بتطبيق أعلى معايير الجودة في كل مرحلة من مراحل التطوير، مع متابعة دورية وتحديثات مستمرة لضمان رضاكم التام
              </p>
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">معدل الرضا</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">الدعم الفني</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">التسليم في الموعد</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-12 text-center backdrop-blur-sm border border-primary/20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              جاهز لتطوير تطبيقك الذكي؟
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              تواصل معنا اليوم واحصل على استشارة مجانية لتحويل فكرتك إلى تطبيق ناجح
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="group px-8">
                  ابدأ مشروعك الآن
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

export default MobileApps;