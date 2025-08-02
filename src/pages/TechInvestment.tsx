import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Building2, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Lightbulb,
  Globe,
  Shield,
  DollarSign,
  BarChart3,
  Rocket,
  Star,
  Clock,
  Mail,
  Phone
} from "lucide-react";

const TechInvestment = () => {
  const techServices = [
    {
      title: "تطوير الذكاء الاصطناعي",
      description: "نطور حلول الذكاء الاصطناعي المتقدمة والأنظمة الذكية للشركات والمؤسسات",
      icon: Lightbulb,
      features: ["التعلم الآلي", "معالجة اللغات الطبيعية", "الرؤية الحاسوبية", "التحليل التنبؤي"],
      projects: "120+ مشروع منجز"
    },
    {
      title: "تطوير الحلول السحابية",
      description: "نقدم خدمات تطوير التطبيقات السحابية والبنية التحتية المتقدمة",
      icon: Globe,
      features: ["تطبيقات ويب متقدمة", "منصات التطوير", "الأمان السيبراني", "الحلول المتكاملة"],
      projects: "200+ تطبيق مطور"
    },
    {
      title: "تطوير إنترنت الأشياء (IoT)",
      description: "نصمم ونطور حلول إنترنت الأشياء للمدن الذكية والصناعات المتقدمة",
      icon: Zap,
      features: ["أجهزة الاستشعار الذكية", "تطبيقات المراقبة", "الأتمتة الصناعية", "أنظمة إدارة البيانات"],
      projects: "80+ نظام IoT"
    },
    {
      title: "تطوير المتاجر الإلكترونية",
      description: "نصمم ونطور منصات التجارة الإلكترونية المتطورة والحلول التجارية الرقمية",
      icon: Building2,
      features: ["منصات التجارة الإلكترونية", "أنظمة الدفع المتكاملة", "إدارة المخزون", "تطبيقات الهاتف المحمول"],
      projects: "150+ متجر إلكتروني"
    },
    {
      title: "تطوير المواقع الإلكترونية",
      description: "نقدم خدمات تطوير المواقع الإلكترونية المتقدمة والمنصات الرقمية المبتكرة",
      icon: Globe,
      features: ["تصميم الواجهات التفاعلية", "تحسين محركات البحث", "التصميم المتجاوب", "أنظمة إدارة المحتوى"],
      projects: "300+ موقع مطور"
    }
  ];

  const portfolio = [
    {
      name: "منصة الذكاء الاصطناعي للبنوك",
      description: "نظام ذكي متطور لتحليل البيانات المصرفية والتنبؤ بالمخاطر",
      completion: "مكتمل 100%",
      duration: "18 شهر"
    },
    {
      name: "متجر إلكتروني متكامل للأزياء",
      description: "منصة تجارة إلكترونية شاملة مع تطبيق الهاتف المحمول",
      completion: "مكتمل 100%",
      duration: "12 شهر"
    },
    {
      name: "نظام الأمان السيبراني المتقدم",
      description: "حلول حماية شاملة للبيانات والأنظمة الحساسة",
      completion: "مكتمل 100%",
      duration: "24 شهر"
    },
    {
      name: "تطبيق الواقع المعزز التعليمي",
      description: "منصة تعليمية تفاعلية باستخدام تقنيات الواقع المعزز",
      completion: "مكتمل 100%",
      duration: "15 شهر"
    }
  ];

  const benefits = [
    {
      title: "جودة تطوير عالية",
      description: "نطبق أعلى معايير الجودة في التطوير والبرمجة",
      icon: TrendingUp
    },
    {
      title: "فريق مطورين متخصص",
      description: "فريق من أفضل المطورين والمبرمجين في المنطقة",
      icon: Users
    },
    {
      title: "شراكات تقنية قوية",
      description: "شراكات مع أكبر الشركات التقنية لتقديم أفضل الحلول",
      icon: Building2
    },
    {
      title: "تقنيات حديثة ومتطورة",
      description: "نستخدم أحدث التقنيات والأدوات في التطوير",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-4 py-2">
              التطوير التقني المتقدم
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              نطور مستقبل 
              <span className="text-secondary block mt-2">التقنية والبرمجيات</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة تطور أحدث التقنيات والحلول البرمجية المبتكرة لبناء مستقبل رقمي متطور 
              يساهم في تحقيق رؤية المملكة 2030 والتحول الرقمي الشامل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ مشروعك معنا
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Award className="w-5 h-5 mr-2" />
                اطلع على أعمالنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">850+</div>
              <div className="text-muted-foreground">مشروع مطور</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">120+</div>
              <div className="text-muted-foreground">عميل راضي</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">معدل نجاح المشاريع</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">12</div>
              <div className="text-muted-foreground">سنة خبرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Services */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              خدماتنا التقنية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              خدماتنا التقنية المتطورة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم حلول تقنية متكاملة في البرمجة والتطوير لمختلف القطاعات باستخدام أحدث التقنيات
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {techServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                        {service.projects}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">التقنيات المستخدمة:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
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

      {/* Portfolio Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              أعمالنا المميزة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              مشاريع نفخر بإنجازها
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              مشاريع تقنية رائدة طورناها وسلمناها بنجاح لعملائنا في مختلف القطاعات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((company, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      {company.completion}
                    </Badge>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">مدة التطوير</span>
                    <span className="font-bold text-primary">{company.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              مزايا العمل معنا
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لماذا تختار شركة الشهري للتطوير؟
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              ابدأ مشروعك التقني معنا
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              تواصل معنا اليوم وابدأ رحلة تطوير مشروعك التقني بأحدث التقنيات وأفضل الممارسات
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Mail className="w-5 h-5 mr-2" />
                ابدأ مشروعك الآن
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-5 h-5 mr-2" />
                استشارة مجانية
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">دعم فني متواصل</h4>
                <p className="text-primary-foreground/70">دعم فني على مدار الساعة بعد التسليم</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">خبرة تقنية عميقة</h4>
                <p className="text-primary-foreground/70">أكثر من 12 سنة في التطوير التقني</p>
              </div>
              <div>
                <Target className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">ضمان الجودة</h4>
                <p className="text-primary-foreground/70">ضمان جودة التطوير وتسليم في الموعد</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechInvestment;