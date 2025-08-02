import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Palette, 
  Globe, 
  Building2, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Smartphone,
  Database,
  Shield,
  Zap,
  Monitor,
  Layers,
  Star,
  Clock,
  Mail,
  Phone,
  Rocket,
  Award,
  Target
} from "lucide-react";

const Development = () => {
  const developmentServices = [
    {
      title: "تطوير البرمجيات المخصصة",
      description: "نطور برمجيات مخصصة تلبي احتياجات عملك الفريدة باستخدام أحدث التقنيات والممارسات",
      icon: Code,
      features: ["تطبيقات سطح المكتب", "أنظمة إدارة قواعد البيانات", "برمجيات الأتمتة", "تطبيقات المؤسسات"],
      technologies: ["Java", "Python", "C#", ".NET"],
      projects: "200+ برنامج"
    },
    {
      title: "التصميم الإبداعي والهوية البصرية",
      description: "نصمم هويات بصرية مميزة وتصاميم إبداعية تعكس شخصية علامتك التجارية",
      icon: Palette,
      features: ["تصميم الشعارات", "الهوية البصرية الكاملة", "تصميم المطبوعات", "تصميم واجهات المستخدم"],
      technologies: ["Adobe Creative Suite", "Figma", "Sketch", "Canva"],
      projects: "500+ تصميم"
    },
    {
      title: "تطوير المواقع الإلكترونية",
      description: "نبني مواقع إلكترونية متطورة ومتجاوبة تقدم تجربة مستخدم استثنائية",
      icon: Globe,
      features: ["مواقع الشركات", "المتاجر الإلكترونية", "المدونات والمجلات", "البوابات الإلكترونية"],
      technologies: ["React", "Next.js", "WordPress", "Shopify"],
      projects: "300+ موقع"
    },
    {
      title: "الاستشارات التطويرية للشركات",
      description: "نقدم استشارات تقنية متخصصة لمساعدة الشركات على التحول الرقمي وتطوير أعمالها",
      icon: Building2,
      features: ["التحول الرقمي", "تحليل الأنظمة", "الاستراتيجية التقنية", "إدارة المشاريع التقنية"],
      technologies: ["Cloud Computing", "DevOps", "Agile", "Scrum"],
      projects: "150+ استشارة"
    }
  ];

  const portfolio = [
    {
      name: "نظام إدارة المستشفيات المتكامل",
      description: "نظام شامل لإدارة جميع عمليات المستشفى من الحجوزات إلى الفواتير",
      category: "برمجيات طبية",
      duration: "24 شهر",
      image: "🏥"
    },
    {
      name: "هوية بصرية لشركة تقنية ناشئة",
      description: "تصميم هوية بصرية كاملة تشمل الشعار والمواد التسويقية",
      category: "تصميم وهوية",
      duration: "3 شهور",
      image: "🎨"
    },
    {
      name: "منصة التجارة الإلكترونية للأزياء",
      description: "موقع تجارة إلكترونية متكامل مع نظام إدارة المخزون والمدفوعات",
      category: "مواقع إلكترونية",
      duration: "6 شهور",
      image: "🛍️"
    },
    {
      name: "استشارات التحول الرقمي لمجموعة تجارية",
      description: "خطة شاملة للتحول الرقمي وتطوير الأنظمة الداخلية",
      category: "استشارات",
      duration: "12 شهر",
      image: "🏢"
    }
  ];

  const technologies = [
    { name: "React & Next.js", icon: Code, level: 95 },
    { name: "Node.js & Express", icon: Database, level: 90 },
    { name: "Python & Django", icon: Code, level: 88 },
    { name: "Adobe Creative Suite", icon: Palette, level: 92 },
    { name: "Cloud Computing", icon: Globe, level: 85 },
    { name: "Mobile Development", icon: Smartphone, level: 87 }
  ];

  const benefits = [
    {
      title: "فريق متعدد التخصصات",
      description: "مطورين ومصممين وخبراء استشارات تحت سقف واحد",
      icon: Users
    },
    {
      title: "أحدث التقنيات",
      description: "نستخدم أحدث الأدوات والتقنيات في السوق",
      icon: Rocket
    },
    {
      title: "ضمان الجودة",
      description: "اختبارات شاملة وضمان جودة في كل مرحلة",
      icon: Shield
    },
    {
      title: "دعم مستمر",
      description: "دعم فني وصيانة مستمرة بعد التسليم",
      icon: Award
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
              التطوير والابتكار المتقدم
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              نحول أفكارك إلى 
              <span className="text-secondary block mt-2">واقع رقمي مبهر</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              شركة علي صالح الشهري القابضة - رائدة في تطوير البرمجيات والتصميم والمواقع الإلكترونية 
              والاستشارات التقنية للشركات في المملكة العربية السعودية
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ مشروعك الآن
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Award className="w-5 h-5 mr-2" />
                استكشف أعمالنا
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
              <div className="text-4xl font-bold text-primary mb-2">1200+</div>
              <div className="text-muted-foreground">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">300+</div>
              <div className="text-muted-foreground">عميل سعيد</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">سنة خبرة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">خبير متخصص</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              خدماتنا المتخصصة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              حلول تطويرية شاملة ومتكاملة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التطويرية التي تغطي جميع احتياجات عملك الرقمي
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {developmentServices.map((service, index) => {
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
                        <h4 className="font-semibold text-foreground mb-3">التقنيات المستخدمة:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
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

      {/* Technologies Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              خبراتنا التقنية
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              التقنيات التي نتقنها
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نعمل مع أحدث التقنيات والأدوات لضمان تقديم حلول متطورة وفعالة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{tech.name}</h3>
                        <p className="text-sm text-muted-foreground">{tech.level}% إتقان</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${tech.level}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              معرض أعمالنا
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              مشاريع نفخر بإنجازها
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نماذج من أعمالنا المتميزة في مختلف المجالات التطويرية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolio.map((project, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4 text-center">{project.image}</div>
                  <Badge className="self-start bg-green-500/10 text-green-600 border-green-500/20 mb-2">
                    {project.category}
                  </Badge>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">مدة التطوير</span>
                    <span className="font-semibold text-primary">{project.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              مزايا العمل معنا
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              لماذا نحن الخيار الأمثل؟
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
              هل أنت مستعد لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              تواصل معنا اليوم واحصل على استشارة مجانية حول مشروعك القادم
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
                <h4 className="text-lg font-bold text-primary-foreground mb-2">استجابة سريعة</h4>
                <p className="text-primary-foreground/70">نرد على جميع الاستفسارات خلال 24 ساعة</p>
              </div>
              <div>
                <Target className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">حلول مخصصة</h4>
                <p className="text-primary-foreground/70">نصمم الحلول خصيصاً لتناسب احتياجاتك</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h4 className="text-lg font-bold text-primary-foreground mb-2">ضمان الجودة</h4>
                <p className="text-primary-foreground/70">ضمان جودة وتسليم في الموعد المحدد</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Development;