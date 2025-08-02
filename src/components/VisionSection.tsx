import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, TrendingUp, Users, Globe, Zap, Award, Rocket, Eye, Heart, Brain, Shield, Star, Compass, Layers, Network } from "lucide-react";

const VisionSection = () => {
  const globalVisionPillars = [
    { 
      icon: Brain, 
      title: "الذكاء الاصطناعي والابتكار", 
      description: "نقود مستقبل التقنية بحلول الذكاء الاصطناعي المتطورة والابتكارات الرقمية التي تخدم البشرية",
      color: "from-blue-500 to-indigo-600",
      stats: "250+ مشروع AI"
    },
    { 
      icon: Globe, 
      title: "التوسع العالمي الاستراتيجي", 
      description: "نمتد عبر القارات بشراكات استراتيجية ومكاتب في أهم العواصم التقنية حول العالم",
      color: "from-emerald-500 to-teal-600",
      stats: "68+ دولة"
    },
    { 
      icon: Shield, 
      title: "الأمن السيبراني والحماية", 
      description: "نحمي البيانات والأنظمة بأحدث تقنيات الأمن السيبراني والبلوك تشين المتقدمة",
      color: "from-orange-500 to-red-600",
      stats: "99.9% أمان"
    },
    { 
      icon: Network, 
      title: "الشبكات الذكية والاتصال", 
      description: "نربط العالم بشبكات ذكية متطورة تدعم إنترنت الأشياء والجيل الخامس",
      color: "from-purple-500 to-pink-600",
      stats: "5G+ تقنيات"
    }
  ];

  const globalGoals = [
    { 
      icon: Rocket, 
      title: "قيادة التحول الرقمي", 
      description: "نساعد الحكومات والشركات في تحقيق التحول الرقمي الشامل بحلول مبتكرة ومخصصة",
      color: "from-blue-600 to-cyan-500"
    },
    { 
      icon: Star, 
      title: "التميز في الخدمات", 
      description: "نقدم خدمات بمعايير عالمية تفوق توقعات العملاء وتحقق أهدافهم الاستراتيجية",
      color: "from-emerald-600 to-green-500"
    },
    { 
      icon: Compass, 
      title: "الاستدامة والمسؤولية", 
      description: "نلتزم بالممارسات المستدامة والمسؤولية المجتمعية في جميع عملياتنا العالمية",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: Layers, 
      title: "التكامل والشراكة", 
      description: "نبني نظاماً متكاملاً من الشراكات العالمية التي تخدم رؤيتنا المشتركة للمستقبل",
      color: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <Eye className="w-6 h-6 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">رؤية عالمية 2030+ • مستقبل رقمي</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold text-primary mb-8 leading-tight">
            رؤيتنا <span className="text-gradient-primary">العالمية</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
            نقود مستقبل التقنية عالمياً من خلال الابتكار المستمر والشراكات الاستراتيجية، 
            نحو عالم رقمي متصل ومستدام يخدم البشرية جمعاء
          </p>
        </div>

        {/* Main Vision & Mission Cards */}
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
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gradient-primary">2030+</div>
                    <div className="text-sm text-muted-foreground">رؤية مستقبلية</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gradient-primary">العالم</div>
                    <div className="text-sm text-muted-foreground">نطاق التأثير</div>
                  </div>
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
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gradient-primary">الإنسان</div>
                    <div className="text-sm text-muted-foreground">محور اهتمامنا</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-gradient-primary">التقنية</div>
                    <div className="text-sm text-muted-foreground">أداة التطوير</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <Globe className="w-5 h-5 animate-spin-slow" />
                  <span className="font-semibold">Technology • Humanity • Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Vision Pillars */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              أركان <span className="text-gradient-primary">رؤيتنا العالمية</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقوم رؤيتنا على أربعة أركان أساسية تحدد مسارنا نحو المستقبل الرقمي
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {globalVisionPillars.map((pillar, index) => (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-10 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`icon-container w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center icon-bg-gradient icon-scale group-hover:rotate-6 transition-all duration-500 shadow-glow animate-bounce-in stagger-${index + 1}`}>
                        <pillar.icon className="w-10 h-10 text-white icon-glow" />
                      </div>
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-primary font-semibold animate-slide-in-up stagger-${index + 2}">
                        {pillar.stats}
                      </Badge>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                      {pillar.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategic Goals */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              أهدافنا <span className="text-gradient-primary">الاستراتيجية</span>
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {globalGoals.map((goal, index) => (
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
                    <h4 className="text-xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                      {goal.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm">{goal.description}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Global Impact Stats */}
        <div className="text-center bg-white/5 backdrop-blur-md rounded-3xl p-12 animate-fade-in">
          <h3 className="text-4xl font-bold text-primary mb-12">تأثيرنا العالمي</h3>
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
  );
};

export default VisionSection;