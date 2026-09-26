import Footer from "@/components/Footer";


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Eye, 
  Heart, 
  Brain, 
  Globe, 
  Shield, 
  Network, 
  Star, 
  Rocket, 
  Compass, 
  Layers, 
  Award, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Zap,
  ArrowRight,
  CheckCircle,
  Calendar,
  Building,
  Briefcase,
  TreePine,
  HandHeart,
  Sparkles,
  Crown,
  Diamond,
  Gem
} from "lucide-react";

const Vision = () => {
  const visionPillars = [
    { 
      icon: Brain, 
      title: "الذكاء الاصطناعي والابتكار", 
      description: "نقود مستقبل التقنية بحلول الذكاء الاصطناعي المتطورة والابتكارات الرقمية التي تخدم البشرية",
      color: "from-blue-500 to-indigo-600",
      features: ["تطوير نماذج AI متقدمة", "أتمتة العمليات الذكية", "الحلول التنبؤية", "التعلم الآلي المتطور"],
      stats: "250+ مشروع AI"
    },
    { 
      icon: Globe, 
      title: "التوسع العالمي الاستراتيجي", 
      description: "نمتد عبر القارات بشراكات استراتيجية ومكاتب في أهم العواصم التقنية حول العالم",
      color: "from-emerald-500 to-teal-600",
      features: ["مكاتب في 68+ دولة", "شراكات دولية", "فرق عمل متعددة الثقافات", "خدمات 24/7"],
      stats: "68+ دولة"
    },
    { 
      icon: Shield, 
      title: "الأمن السيبراني والحماية", 
      description: "نحمي البيانات والأنظمة بأحدث تقنيات الأمن السيبراني والبلوك تشين المتقدمة",
      color: "from-orange-500 to-red-600",
      features: ["حماية متقدمة للبيانات", "تشفير البلوك تشين", "مراقبة أمنية مستمرة", "استجابة فورية للتهديدات"],
      stats: "99.9% أمان"
    },
    { 
      icon: Network, 
      title: "الشبكات الذكية والاتصال", 
      description: "نربط العالم بشبكات ذكية متطورة تدعم إنترنت الأشياء والجيل الخامس",
      color: "from-purple-500 to-pink-600",
      features: ["شبكات 5G متطورة", "إنترنت الأشياء", "اتصال فائق السرعة", "بنية تحتية ذكية"],
      stats: "5G+ تقنيات"
    }
  ];

  const strategicGoals = [
    { 
      icon: Rocket, 
      title: "قيادة التحول الرقمي", 
      description: "نساعد الحكومات والشركات في تحقيق التحول الرقمي الشامل بحلول مبتكرة ومخصصة",
      color: "from-blue-600 to-cyan-500",
      timeline: "2024-2027"
    },
    { 
      icon: Star, 
      title: "التميز في الخدمات", 
      description: "نقدم خدمات بمعايير عالمية تفوق توقعات العملاء وتحقق أهدافهم الاستراتيجية",
      color: "from-emerald-600 to-green-500",
      timeline: "مستمر"
    },
    { 
      icon: Compass, 
      title: "الاستدامة والمسؤولية", 
      description: "نلتزم بالممارسات المستدامة والمسؤولية المجتمعية في جميع عملياتنا العالمية",
      color: "from-amber-500 to-orange-500",
      timeline: "2024-2030"
    },
    { 
      icon: Layers, 
      title: "التكامل والشراكة", 
      description: "نبني نظاماً متكاملاً من الشراكات العالمية التي تخدم رؤيتنا المشتركة للمستقبل",
      color: "from-violet-500 to-purple-500",
      timeline: "2024-2025"
    }
  ];

  const coreValues = [
    {
      icon: Crown,
      title: "التميز والجودة",
      description: "نسعى للتميز في كل ما نقدمه",
      color: "from-yellow-500 to-amber-600"
    },
    {
      icon: HandHeart,
      title: "المسؤولية المجتمعية",
      description: "نساهم في تطوير المجتمع والبيئة",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Sparkles,
      title: "الابتكار المستمر",
      description: "نبتكر حلولاً تقنية متطورة",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Diamond,
      title: "الشفافية والنزاهة",
      description: "نعمل بشفافية ونزاهة كاملة",
      color: "from-blue-500 to-indigo-600"
    }
  ];

  const futureInitiatives = [
    {
      title: "مدن ذكية متكاملة",
      description: "تطوير مشاريع المدن الذكية بتقنيات الذكاء الاصطناعي",
      year: "2025",
      status: "قيد التطوير",
      icon: Building
    },
    {
      title: "منصة التعليم الرقمي",
      description: "إطلاق منصة تعليمية عالمية بتقنيات الواقع الافتراضي",
      year: "2026",
      status: "التخطيط",
      icon: Briefcase
    },
    {
      title: "مبادرة البيئة الخضراء",
      description: "مشاريع تقنية لحماية البيئة والطاقة المتجددة",
      year: "2027",
      status: "البحث والتطوير",
      icon: TreePine
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <Eye className="w-6 h-6 text-primary-foreground animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">رؤية عالمية 2030+ • مستقبل رقمي</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold text-primary-foreground mb-8 leading-tight">
              رؤيتنا <span className="text-gradient-glow">العالمية</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed mb-12">
              نقود مستقبل التقنية عالمياً من خلال الابتكار المستمر والشراكات الاستراتيجية، 
              نحو عالم رقمي متصل ومستدام يخدم البشرية جمعاء
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-4 text-lg">
                اكتشف رؤيتنا التفصيلية
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
              <div className="flex items-center gap-4 text-primary-foreground/80">
                <div className="text-center">
                  <div className="text-2xl font-bold">2030+</div>
                  <div className="text-sm">رؤية مستقبلية</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl font-bold">68+</div>
                  <div className="text-sm">دولة حول العالم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-24 bg-gradient-subtle relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            <Card className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md animate-slide-in-right overflow-hidden">
              <CardContent className="p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                      <Target className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-primary mb-2">رؤيتنا العالمية</h3>
                      <Badge variant="secondary" className="text-sm bg-white/20 border-white/30">Vision 2030+</Badge>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    أن نكون الشركة القابضة الرائدة عالمياً في تقديم الحلول التقنية المبتكرة والخدمات الرقمية المتطورة، 
                    نقود التحول الرقمي الشامل ونساهم في بناء مستقبل تقني مستدام يخدم المجتمعات حول العالم
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {["الريادة العالمية في التقنية", "الابتكار المستمر", "الاستدامة والمسؤولية"].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span className="font-semibold">Innovation • Leadership • Sustainability</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md animate-slide-in-left overflow-hidden">
              <CardContent className="p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mr-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                      <Heart className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-primary mb-2">رسالتنا الإنسانية</h3>
                      <Badge variant="secondary" className="text-sm bg-white/20 border-white/30">Global Mission</Badge>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    نسعى لتطوير وتقديم حلول تقنية مبتكرة تحسن جودة الحياة وتدعم التنمية المستدامة، 
                    من خلال الاستثمار في أحدث التقنيات وبناء شراكات عالمية تساهم في تقدم المجتمع الإنساني
                  </p>

                  <div className="space-y-3 mb-6">
                    {["تحسين جودة الحياة", "دعم التنمية المستدامة", "خدمة المجتمع الإنساني"].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-primary">
                    <Globe className="w-5 h-5 animate-spin-slow" />
                    <span className="font-semibold">Technology • Humanity • Progress</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              قيمنا <span className="text-gradient-primary">الأساسية</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نؤمن بمجموعة من القيم الأساسية التي توجه عملنا وتحدد هويتنا
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group premium-card hover:shadow-glow transition-all duration-500 text-center border-0 bg-white/5 backdrop-blur-md">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow`}>
                      <value.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Pillars */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              أركان <span className="text-gradient-primary">رؤيتنا العالمية</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقوم رؤيتنا على أربعة أركان أساسية تحدد مسارنا نحو المستقبل الرقمي
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {visionPillars.map((pillar, index) => (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-10 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`icon-container w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center icon-bg-gradient icon-scale group-hover:rotate-6 transition-all duration-500 shadow-glow`}>
                        <pillar.icon className="w-10 h-10 text-white icon-glow" />
                      </div>
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-primary font-semibold">
                        {pillar.stats}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {pillar.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary text-sm mb-3">المزايا الرئيسية:</h4>
                      {pillar.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
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

      {/* Strategic Goals */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              أهدافنا <span className="text-gradient-primary">الاستراتيجية</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نسعى لتحقيق مجموعة من الأهداف الاستراتيجية التي تدعم رؤيتنا للمستقبل
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strategicGoals.map((goal, index) => (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 text-center border-0 bg-white/5 backdrop-blur-md animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-20 h-20 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow`}>
                      <goal.icon className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                      {goal.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-4">{goal.description}</p>
                    
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{goal.timeline}</span>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Initiatives */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              مبادرات <span className="text-gradient-primary">المستقبل</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نعمل على مشاريع مستقبلية طموحة تهدف لتشكيل مستقبل أفضل للإنسانية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {futureInitiatives.map((initiative, index) => (
              <Card key={index} className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <initiative.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {initiative.year}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-4">{initiative.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{initiative.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-600 font-medium">{initiative.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-primary mb-12">تأثيرنا العالمي</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "68+", label: "دولة حول العالم", sublabel: "Countries Worldwide", icon: Globe },
                { number: "2.5M+", label: "مستخدم نشط", sublabel: "Active Users", icon: Users },
                { number: "1,200+", label: "شراكة استراتيجية", sublabel: "Strategic Partnerships", icon: Network },
                { number: "150+", label: "جائزة عالمية", sublabel: "Global Awards", icon: Award }
              ].map((stat, index) => (
                <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-primary">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      
    </div>
  );
};

export default Vision;