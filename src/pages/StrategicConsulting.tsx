import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  Shield,
  Zap,
  Globe,
  Award,
  Star,
  Clock,
  Mail,
  Phone,
  Rocket,
  Eye,
  BrainCircuit,
  LineChart,
  PieChart,
  Settings,
  FileText,
  MessageSquare,
  Calendar,
  HandHeart
} from "lucide-react";

const StrategicConsulting = () => {
  const consultingServices = [
    {
      title: "التخطيط الاستراتيجي",
      description: "نساعدك في وضع خطط استراتيجية شاملة تحقق أهدافك طويلة المدى وتعزز من موقعك التنافسي",
      icon: Target,
      features: ["تحليل الوضع الحالي", "وضع الرؤية والأهداف", "تطوير الاستراتيجيات", "خطط التنفيذ"],
      deliverables: ["تقرير التحليل الاستراتيجي", "الخطة الاستراتيجية", "مؤشرات الأداء"],
      duration: "8-12 أسبوع"
    },
    {
      title: "التحول الرقمي",
      description: "نقود عملية التحول الرقمي لشركتك من خلال استراتيجيات مبتكرة وتقنيات متطورة",
      icon: Zap,
      features: ["تقييم النضج الرقمي", "خارطة طريق التحول", "تطوير القدرات", "إدارة التغيير"],
      deliverables: ["تقرير التقييم الرقمي", "استراتيجية التحول", "خطة التنفيذ"],
      duration: "12-16 أسبوع"
    },
    {
      title: "تحسين العمليات",
      description: "نحلل ونحسن العمليات التشغيلية لزيادة الكفاءة وتقليل التكاليف وتحسين الجودة",
      icon: Settings,
      features: ["تحليل العمليات الحالية", "تحديد نقاط التحسين", "إعادة تصميم العمليات", "تطبيق الحلول"],
      deliverables: ["تقرير تحليل العمليات", "مخططات العمليات المحسنة", "دليل التنفيذ"],
      duration: "6-10 أسابيع"
    },
    {
      title: "إدارة المخاطر والامتثال",
      description: "نساعدك في تحديد وإدارة المخاطر وضمان الامتثال للمعايير واللوائح",
      icon: Shield,
      features: ["تحليل المخاطر", "وضع استراتيجيات التخفيف", "أنظمة الامتثال", "المراقبة والتقييم"],
      deliverables: ["سجل المخاطر", "خطة إدارة المخاطر", "دليل الامتثال"],
      duration: "8-12 أسبوع"
    }
  ];

  const methodology = [
    {
      phase: "التشخيص والتحليل",
      description: "تحليل شامل للوضع الحالي وتحديد التحديات والفرص",
      icon: Eye,
      activities: ["جمع البيانات", "المقابلات مع أصحاب المصلحة", "تحليل السوق", "تقييم القدرات الداخلية"]
    },
    {
      phase: "التصميم والتخطيط",
      description: "تطوير الاستراتيجيات والحلول المخصصة لاحتياجاتك",
      icon: BrainCircuit,
      activities: ["وضع الاستراتيجيات", "تصميم الحلول", "تطوير خطط العمل", "تحديد المؤشرات"]
    },
    {
      phase: "التنفيذ والمتابعة",
      description: "دعم التنفيذ ومتابعة النتائج وتقديم التحسينات المستمرة",
      icon: Rocket,
      activities: ["إدارة التنفيذ", "التدريب والتطوير", "مراقبة الأداء", "التحسين المستمر"]
    }
  ];

  const successStories = [
    {
      company: "مجموعة تجارية كبيرة",
      challenge: "تحسين العمليات وزيادة الكفاءة التشغيلية",
      solution: "إعادة هندسة العمليات وتطبيق تقنيات الأتمتة",
      results: ["تحسن الكفاءة بنسبة 40%", "تقليل التكاليف بنسبة 25%", "تحسين رضا العملاء"],
      icon: "🏢"
    },
    {
      company: "شركة تقنية ناشئة",
      challenge: "وضع استراتيجية نمو وتوسع في الأسواق الجديدة",
      solution: "تطوير خطة استراتيجية شاملة للنمو والتوسع",
      results: ["زيادة الإيرادات بنسبة 300%", "دخول 5 أسواق جديدة", "زيادة فريق العمل 200%"],
      icon: "🚀"
    },
    {
      company: "مؤسسة حكومية",
      challenge: "التحول الرقمي وتحسين الخدمات العامة",
      solution: "استراتيجية التحول الرقمي وتطوير الخدمات الإلكترونية",
      results: ["تحسين الخدمات بنسبة 60%", "تقليل أوقات الانتظار 70%", "زيادة رضا المواطنين"],
      icon: "🏛️"
    }
  ];

  const expertiseAreas = [
    { area: "الاستراتيجية التنافسية", percentage: 95 },
    { area: "التحول الرقمي", percentage: 92 },
    { area: "تحسين العمليات", percentage: 98 },
    { area: "إدارة التغيير", percentage: 90 },
    { area: "التحليل المالي", percentage: 88 },
    { area: "إدارة المخاطر", percentage: 93 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-4 py-2">
              الاستشارات الاستراتيجية المتخصصة
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              نرسم مستقبل 
              <span className="text-secondary block mt-2">نجاح شركتك</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة تقدم استشارات استراتيجية متخصصة تساعد الشركات 
              على تحقيق أهدافها وتعزيز موقعها التنافسي في السوق
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <MessageSquare className="w-5 h-5 mr-2" />
                احجز استشارة مجانية
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <FileText className="w-5 h-5 mr-2" />
                تحميل النشرة التعريفية
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
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">مشروع استشاري</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">شركة استفادت</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">معدل نجاح المشاريع</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">18+</div>
              <div className="text-muted-foreground">سنة خبرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              خدماتنا الاستشارية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              حلول استراتيجية شاملة ومبتكرة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم مجموعة متكاملة من الاستشارات الاستراتيجية التي تغطي جميع جوانب عملك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {consultingServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                        {service.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">الخدمات المتضمنة:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">المخرجات:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.deliverables.map((deliverable, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              منهجية العمل
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              منهجية مجربة ومضمونة النجاح
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتبع منهجية علمية مدروسة تضمن تحقيق أفضل النتائج لعملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {methodology.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-center">{phase.phase}</CardTitle>
                    <CardDescription className="text-muted-foreground text-center">
                      {phase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {phase.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm text-muted-foreground">{activity}</span>
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

      {/* Expertise Areas */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              مجالات الخبرة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              خبرات متعمقة في مختلف المجالات
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((area, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{area.area}</h3>
                    <span className="text-sm font-bold text-primary">{area.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${area.percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              قصص النجاح
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              نجاحات حققناها مع عملائنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              أمثلة حقيقية على التأثير الإيجابي لاستشاراتنا على أعمال عملائنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4 text-center">{story.icon}</div>
                  <CardTitle className="text-lg text-center">{story.company}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    <strong>التحدي:</strong> {story.challenge}
                  </CardDescription>
                  <CardDescription className="text-muted-foreground">
                    <strong>الحل:</strong> {story.solution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">النتائج المحققة:</h4>
                    <div className="space-y-2">
                      {story.results.map((result, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              ابدأ رحلة التميز الاستراتيجي
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              احجز استشارة مجانية اليوم ودعنا نساعدك في تطوير استراتيجية نجاح شركتك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Calendar className="w-5 h-5 mr-2" />
                احجز استشارة مجانية
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Phone className="w-5 h-5 mr-2" />
                تواصل معنا الآن
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <HandHeart className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">مقابلة مجانية</h4>
                <p className="text-primary-foreground/70">استشارة أولية مجانية لمدة ساعة</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">خبرة مثبتة</h4>
                <p className="text-primary-foreground/70">أكثر من 18 سنة من الخبرة والنجاح</p>
              </div>
              <div>
                <Target className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">نتائج مضمونة</h4>
                <p className="text-primary-foreground/70">التزام بتحقيق النتائج المطلوبة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StrategicConsulting;