import { Card, CardContent } from "@/components/ui/card";
import { Target, Lightbulb, TrendingUp, Users, Globe, Zap, Award, Rocket } from "lucide-react";

const VisionSection = () => {
  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
            <Globe className="w-6 h-6 text-primary animate-spin-slow" />
            <span className="text-sm font-medium text-primary">رؤية عالمية • قيم محلية</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
            رؤيتنا <span className="text-gradient-primary">العالمية</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            نسعى لتحقيق التميز والريادة العالمية في مجال التقنية والإعلام، ونؤمن بقوة الشراكة والابتكار في بناء مستقبل رقمي مستدام
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md animate-slide-in-right">
            <CardContent className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Target className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary">رؤيتنا</h3>
                  <p className="text-secondary font-medium">Vision 2030+</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                أن نكون الشركة القابضة الرائدة عالمياً في تقديم الحلول التقنية المبتكرة، نقود التحول الرقمي 
                ونساهم في تحقيق رؤية السعودية 2030 من خلال الاستثمار في التقنيات المتطورة والشراكات الاستراتيجية العالمية
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Innovation • Excellence • Growth</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group premium-card hover:shadow-glow transition-all duration-500 border-0 bg-white/5 backdrop-blur-md animate-slide-in-left">
            <CardContent className="p-10">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <Lightbulb className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-primary">رسالتنا</h3>
                  <p className="text-secondary font-medium">Global Mission</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نسعى لتقديم حلول مبتكرة ومتطورة عالمياً في مجال التقنية والإعلام، ونعمل على بناء شراكات 
                استراتيجية دولية تساهم في تطوير المجتمع ودعم النمو الاقتصادي المستدام والتحول الرقمي الشامل
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary">
                <Globe className="w-5 h-5 animate-spin-slow" />
                <span className="font-semibold">Technology • Media • Innovation</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { 
              icon: Rocket, 
              title: "الابتكار العالمي", 
              description: "نقود الابتكار بمعايير عالمية ونطور حلولاً تقنية متقدمة",
              color: "from-blue-500 to-purple-600"
            },
            { 
              icon: Award, 
              title: "التميز الدولي", 
              description: "نسعى للوصول لأعلى معايير الجودة العالمية في كل خدماتنا",
              color: "from-emerald-500 to-teal-600"
            },
            { 
              icon: TrendingUp, 
              title: "النمو المستدام", 
              description: "نحقق نمواً مستداماً يواكب التطورات العالمية والتقنية الحديثة",
              color: "from-orange-500 to-red-600"
            },
            { 
              icon: Users, 
              title: "الشراكة الاستراتيجية", 
              description: "نبني شراكات عالمية قوية تدعم النمو والتطوير المشترك",
              color: "from-pink-500 to-rose-600"
            }
          ].map((goal, index) => (
            <Card 
              key={index} 
              className="group premium-card hover:shadow-glow transition-all duration-500 text-center border-0 bg-white/5 backdrop-blur-md animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                     style={{ backgroundImage: `linear-gradient(135deg, var(--primary), var(--secondary))` }} />
                <div className={`w-20 h-20 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow`}>
                  <goal.icon className="w-10 h-10 text-white animate-pulse" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                  {goal.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm">{goal.description}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Stats */}
        <div className="mt-20 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50+", label: "شراكة عالمية", sublabel: "Global Partnerships" },
              { number: "25+", label: "دولة حول العالم", sublabel: "Countries Worldwide" },
              { number: "100+", label: "مشروع دولي", sublabel: "International Projects" }
            ].map((stat, index) => (
              <div key={index} className="group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="text-5xl md:text-6xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">
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