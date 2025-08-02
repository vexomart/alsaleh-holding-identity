import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Target, 
  Globe, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Shield,
  Code,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Layers,
  Star,
  Clock,
  Mail,
  Phone,
  Rocket,
  Award,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Lightbulb,
  HeadphonesIcon,
  FileText,
  Calendar,
  Puzzle,
  Network,
  Lock
} from "lucide-react";

const IntegratedSolutions = () => {
  const integratedSolutions = [
    {
      title: "الحلول التقنية الشاملة",
      description: "حلول تقنية متكاملة تشمل تطوير البرمجيات والمواقع والتطبيقات مع خدمات الاستضافة والصيانة",
      icon: Code,
      components: ["تطوير البرمجيات المخصصة", "تصميم وتطوير المواقع", "تطبيقات الهاتف المحمول", "خدمات الاستضافة السحابية"],
      benefits: ["حل واحد لجميع احتياجاتك التقنية", "تكامل سلس بين الأنظمة", "دعم فني موحد"],
      duration: "حسب حجم المشروع"
    },
    {
      title: "حلول الأعمال الرقمية",
      description: "منصات رقمية متكاملة لإدارة الأعمال تشمل أنظمة إدارة العملاء والمخزون والمحاسبة",
      icon: Building2,
      components: ["نظام إدارة علاقات العملاء (CRM)", "نظام تخطيط موارد المؤسسة (ERP)", "أنظمة المحاسبة والمالية", "إدارة المخزون والمبيعات"],
      benefits: ["تحسين كفاءة العمليات", "رؤية شاملة للأعمال", "اتخاذ قرارات مدروسة"],
      duration: "12-24 أسبوع"
    },
    {
      title: "الحلول السحابية المتقدمة",
      description: "بنية تحتية سحابية متكاملة مع خدمات الحوسبة والتخزين والأمان وإدارة البيانات",
      icon: Cloud,
      components: ["خدمات الحوسبة السحابية", "حلول التخزين الآمن", "شبكات التوصيل CDN", "أنظمة النسخ الاحتياطي"],
      benefits: ["مرونة في التوسع", "تقليل التكاليف", "أمان عالي للبيانات"],
      duration: "8-16 أسبوع"
    },
    {
      title: "حلول الأمان الشامل",
      description: "أنظمة أمان متكاملة تشمل حماية البيانات والشبكات ومراقبة الأنظمة والامتثال",
      icon: Shield,
      components: ["أنظمة حماية الشبكات", "تشفير البيانات", "مراقبة الأمان 24/7", "إدارة الهوية والوصول"],
      benefits: ["حماية شاملة للأصول الرقمية", "امتثال للمعايير العالمية", "مراقبة مستمرة"],
      duration: "10-20 أسبوع"
    }
  ];

  const integrationProcess = [
    {
      step: "التحليل والتقييم",
      description: "تحليل شامل لاحتياجاتك وتقييم الأنظمة الحالية",
      icon: BarChart3,
      activities: ["دراسة الوضع الحالي", "تحديد الاحتياجات", "تقييم التحديات", "وضع خطة التكامل"]
    },
    {
      step: "التصميم والتخطيط",
      description: "تصميم الحلول المتكاملة ووضع خطة التنفيذ التفصيلية",
      icon: Lightbulb,
      activities: ["تصميم الهيكل العام", "اختيار التقنيات المناسبة", "تخطيط مراحل التنفيذ", "تحديد المؤشرات"]
    },
    {
      step: "التطوير والتنفيذ",
      description: "تطوير وتنفيذ الحلول مع ضمان التكامل السلس",
      icon: Settings,
      activities: ["تطوير المكونات", "اختبار التكامل", "تدريب الفرق", "النشر التدريجي"]
    },
    {
      step: "المتابعة والتحسين",
      description: "دعم مستمر ومتابعة الأداء مع التحسينات المستمرة",
      icon: TrendingUp,
      activities: ["مراقبة الأداء", "الدعم الفني", "التحديثات الدورية", "التحسين المستمر"]
    }
  ];

  const successMetrics = [
    {
      name: "مشاريع متكاملة مكتملة",
      value: "250+",
      description: "حلول شاملة تم تسليمها بنجاح"
    },
    {
      name: "معدل رضا العملاء",
      value: "98%",
      description: "عملاء راضون عن الحلول المتكاملة"
    },
    {
      name: "تحسن في الكفاءة",
      value: "+65%",
      description: "متوسط تحسن الكفاءة التشغيلية"
    },
    {
      name: "وقت التنفيذ",
      value: "-40%",
      description: "تقليل وقت التنفيذ مقارنة بالحلول المنفصلة"
    }
  ];

  const industryExpertise = [
    {
      industry: "القطاع المصرفي والمالي",
      solutions: ["أنظمة الخدمات المصرفية الرقمية", "منصات الدفع الإلكتروني", "حلول إدارة المخاطر"],
      icon: "🏦"
    },
    {
      industry: "التجارة الإلكترونية",
      solutions: ["منصات التجارة الشاملة", "أنظمة إدارة المخزون", "حلول الدفع والشحن"],
      icon: "🛒"
    },
    {
      industry: "القطاع الصحي",
      solutions: ["أنظمة إدارة المستشفيات", "السجلات الطبية الإلكترونية", "منصات التطبيب عن بُعد"],
      icon: "🏥"
    },
    {
      industry: "التعليم والتدريب",
      solutions: ["منصات التعلم الإلكتروني", "أنظمة إدارة التعليم", "حلول التقييم الرقمي"],
      icon: "🎓"
    },
    {
      industry: "القطاع الحكومي",
      solutions: ["منصات الخدمات الحكومية", "أنظمة إدارة الوثائق", "حلول الحكومة الإلكترونية"],
      icon: "🏛️"
    },
    {
      industry: "الصناعة والتصنيع",
      solutions: ["أنظمة إدارة الإنتاج", "حلول إنترنت الأشياء الصناعي", "أنظمة إدارة سلسلة التوريد"],
      icon: "🏭"
    }
  ];

  const technologies = [
    { name: "Frontend Development", progress: 95 },
    { name: "Backend Systems", progress: 92 },
    { name: "Cloud Infrastructure", progress: 90 },
    { name: "Database Management", progress: 88 },
    { name: "Mobile Development", progress: 85 },
    { name: "AI & Machine Learning", progress: 82 }
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
              الحلول المتكاملة المتقدمة
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              حلول شاملة 
              <span className="text-secondary block mt-2">لجميع احتياجاتك</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة تقدم حلولاً متكاملة تجمع بين التقنية والاستراتيجية والتصميم 
              لتوفير تجربة شاملة ومتميزة لعملائنا
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Puzzle className="w-5 h-5 mr-2" />
                اكتشف حلولنا المتكاملة
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Calendar className="w-5 h-5 mr-2" />
                احجز استشارة مجانية
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm font-medium text-foreground mb-1">{metric.name}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Solutions */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              حلولنا المتكاملة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              مجموعة شاملة من الحلول المتكاملة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم حلولاً متكاملة تغطي جميع جوانب عملك الرقمي في حزمة واحدة متناسقة
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {integratedSolutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                        {solution.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">المكونات الأساسية:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {solution.components.map((component, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{component}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">الفوائد الرئيسية:</h4>
                        <div className="space-y-1">
                          {solution.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-muted-foreground">{benefit}</span>
                            </div>
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

      {/* Integration Process */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              عملية التكامل
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              منهجية التكامل الذكي
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نتبع عملية مدروسة لضمان التكامل السلس بين جميع المكونات
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationProcess.map((process, index) => {
              const IconComponent = process.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-center">{process.step}</CardTitle>
                    <CardDescription className="text-muted-foreground text-center">
                      {process.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {process.activities.map((activity, idx) => (
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

      {/* Industry Expertise */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              خبرات قطاعية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              حلول متخصصة لمختلف القطاعات
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نفهم احتياجات كل قطاع ونقدم حلولاً مخصصة تناسب طبيعة العمل
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryExpertise.map((industry, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4 text-center">{industry.icon}</div>
                  <CardTitle className="text-lg text-center">{industry.industry}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {industry.solutions.map((solution, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{solution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              التقنيات المستخدمة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              أحدث التقنيات للحلول المتكاملة
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{tech.name}</h3>
                    <span className="text-sm font-bold text-primary">{tech.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${tech.progress}%` }}
                    />
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
              جاهز لحل متكامل يحول عملك؟
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              تواصل معنا اليوم واحصل على استشارة مجانية حول الحلول المتكاملة المناسبة لعملك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ حلك المتكامل
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <FileText className="w-5 h-5 mr-2" />
                تحميل الكتيب التعريفي
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <HeadphonesIcon className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">استشارة مجانية</h4>
                <p className="text-primary-foreground/70">جلسة استشارية مجانية لتحديد احتياجاتك</p>
              </div>
              <div>
                <Lock className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">أمان وموثوقية</h4>
                <p className="text-primary-foreground/70">حلول آمنة وموثوقة مع ضمان الجودة</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">خبرة مثبتة</h4>
                <p className="text-primary-foreground/70">أكثر من 250 مشروع متكامل منجز بنجاح</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IntegratedSolutions;