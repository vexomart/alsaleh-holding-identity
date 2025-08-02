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
  const investmentServices = [
    {
      title: "الاستثمار في الذكاء الاصطناعي",
      description: "نستثمر في تطوير حلول الذكاء الاصطناعي المتقدمة التي تحول الصناعات وتحسن كفاءة الأعمال",
      icon: Lightbulb,
      features: ["التعلم الآلي", "معالجة اللغات الطبيعية", "الرؤية الحاسوبية", "التحليل التنبؤي"],
      investment: "150M+ ريال سعودي"
    },
    {
      title: "الحوسبة السحابية",
      description: "استثمارات استراتيجية في البنية التحتية السحابية وخدمات الحوسبة المتقدمة",
      icon: Globe,
      features: ["البنية التحتية كخدمة", "منصات التطوير", "الأمان السيبراني", "التوسع التلقائي"],
      investment: "200M+ ريال سعودي"
    },
    {
      title: "إنترنت الأشياء (IoT)",
      description: "تطوير وتمويل حلول إنترنت الأشياء للمدن الذكية والصناعات المتقدمة",
      icon: Zap,
      features: ["أجهزة الاستشعار الذكية", "تحليل البيانات", "الأتمتة الصناعية", "المراقبة عن بُعد"],
      investment: "100M+ ريال سعودي"
    },
    {
      title: "الاستثمار في المتاجر الإلكترونية",
      description: "تطوير وتمويل منصات التجارة الإلكترونية المتطورة والحلول التجارية الرقمية",
      icon: Building2,
      features: ["منصات التجارة الإلكترونية", "أنظمة الدفع الرقمي", "إدارة المخزون الذكي", "تحليل سلوك المستهلكين"],
      investment: "120M+ ريال سعودي"
    },
    {
      title: "الاستثمار في المواقع الإلكترونية",
      description: "تطوير وتمويل المواقع الإلكترونية المتقدمة والمنصات الرقمية المبتكرة",
      icon: Globe,
      features: ["تطوير الواجهات التفاعلية", "تحسين محركات البحث", "التصميم المتجاوب", "الأمان والحماية"],
      investment: "90M+ ريال سعودي"
    }
  ];

  const portfolio = [
    {
      name: "شركة الذكاء الاصطناعي المتقدم",
      description: "متخصصة في حلول الذكاء الاصطناعي للقطاع المصرفي",
      growth: "+245%",
      valuation: "500M ريال"
    },
    {
      name: "منصة التجارة الإلكترونية الذكية",
      description: "منصة متكاملة للتجارة الإلكترونية مدعومة بالذكاء الاصطناعي",
      growth: "+180%",
      valuation: "350M ريال"
    },
    {
      name: "حلول الأمان السيبراني",
      description: "شركة رائدة في حماية البيانات والأمان السيبراني",
      growth: "+320%",
      valuation: "750M ريال"
    },
    {
      name: "تطبيقات الواقع المعزز",
      description: "تطوير تطبيقات الواقع المعزز للتعليم والترفيه",
      growth: "+150%",
      valuation: "200M ريال"
    }
  ];

  const benefits = [
    {
      title: "عوائد استثمارية عالية",
      description: "نحقق عوائد استثمارية تتجاوز 25% سنوياً في المتوسط",
      icon: TrendingUp
    },
    {
      title: "فريق خبراء متخصص",
      description: "فريق من أفضل الخبراء في مجال الاستثمار التقني عالمياً",
      icon: Users
    },
    {
      title: "شراكات استراتيجية",
      description: "شراكات مع أكبر الشركات التقنية العالمية",
      icon: Building2
    },
    {
      title: "تقنيات متطورة",
      description: "استخدام أحدث التقنيات في التحليل والاستثمار",
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
              الاستثمار التقني المتقدم
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              نقود مستقبل 
              <span className="text-secondary block mt-2">الاستثمار التقني</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة تستثمر في أحدث التقنيات والابتكارات لبناء مستقبل رقمي متطور 
              يساهم في تحقيق رؤية المملكة 2030 والتحول الرقمي الشامل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <DollarSign className="w-5 h-5 mr-2" />
                ابدأ الاستثمار معنا
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                اطلع على محفظتنا
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
              <div className="text-4xl font-bold text-primary mb-2">530M+</div>
              <div className="text-muted-foreground">ريال سعودي مستثمر</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">45+</div>
              <div className="text-muted-foreground">شركة في المحفظة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">28%</div>
              <div className="text-muted-foreground">متوسط العائد السنوي</div>
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
              مجالات الاستثمار
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              خدماتنا الاستثمارية المتقدمة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نستثمر في أحدث التقنيات والقطاعات الناشئة التي تشكل مستقبل الاقتصاد الرقمي
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {investmentServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        {service.investment}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">المجالات المتخصصة:</h4>
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
              محفظة الاستثمار
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              قصص نجاح ملهمة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              شركات رائدة في محفظتنا الاستثمارية حققت نمواً استثنائياً ونجاحات باهرة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((company, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      {company.growth}
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
                    <span className="text-sm text-muted-foreground">التقييم الحالي</span>
                    <span className="font-bold text-primary">{company.valuation}</span>
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
              مزايا الاستثمار معنا
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لماذا تختار الشهري القابضة؟
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
              ابدأ رحلة الاستثمار التقني معنا
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              انضم إلى شركاء النجاح واستفد من خبرتنا الواسعة في الاستثمار التقني
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Mail className="w-5 h-5 mr-2" />
                تواصل معنا الآن
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-5 h-5 mr-2" />
                احجز استشارة مجانية
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Clock className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">استجابة سريعة</h4>
                <p className="text-primary-foreground/70">نرد على استفساراتكم خلال 24 ساعة</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">خبرة موثوقة</h4>
                <p className="text-primary-foreground/70">أكثر من 12 سنة في الاستثمار التقني</p>
              </div>
              <div>
                <Target className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">نتائج مضمونة</h4>
                <p className="text-primary-foreground/70">سجل حافل من النجاحات والعوائد العالية</p>
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