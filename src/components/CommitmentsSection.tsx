import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Lightbulb, Target, Users, Globe, Star, ArrowRight, CheckCircle, Sparkles, Award, Zap } from "lucide-react";

const CommitmentsSection = () => {
  const commitments = [
    {
      icon: Shield,
      title: "الجودة والموثوقية المطلقة",
      titleEn: "Absolute Quality & Reliability",
      description: "نلتزم بتقديم أعلى معايير الجودة في جميع خدماتنا ومنتجاتنا مع ضمان الموثوقية الكاملة لكل عميل",
      features: ["ضمان الجودة 100%", "معايير ISO المعتمدة", "فحص دقيق متعدد المراحل"],
      color: "from-blue-600 to-cyan-600",
      bgEffect: "from-blue-500/10 to-cyan-500/10",
      priority: "عالية جداً"
    },
    {
      icon: Heart,
      title: "المسؤولية المجتمعية الشاملة",
      titleEn: "Comprehensive Social Responsibility",
      description: "نساهم بفعالية في التنمية المستدامة ودعم المجتمع المحلي من خلال برامج متخصصة ومبادرات هادفة",
      features: ["برامج التنمية المستدامة", "دعم المؤسسات الخيرية", "مبادرات بيئية متقدمة"],
      color: "from-green-600 to-emerald-600",
      bgEffect: "from-green-500/10 to-emerald-500/10",
      priority: "أساسية"
    },
    {
      icon: Lightbulb,
      title: "الابتكار والتطوير المستمر",
      titleEn: "Continuous Innovation & Development",
      description: "نستثمر بقوة في البحث والتطوير لتقديم حلول مبتكرة ومتطورة تواكب أحدث التقنيات العالمية",
      features: ["مختبرات الابتكار المتطورة", "شراكات تقنية عالمية", "فرق بحث متخصصة"],
      color: "from-orange-600 to-yellow-600",
      bgEffect: "from-orange-500/10 to-yellow-500/10",
      priority: "استراتيجية"
    },
    {
      icon: Target,
      title: "تحقيق الأهداف بتفوق",
      titleEn: "Achieving Excellence in Goals",
      description: "نعمل بشغف ومثابرة لتحقيق أهداف عملائنا وتجاوز توقعاتهم من خلال خطط مدروسة ومتابعة دقيقة",
      features: ["خطط تنفيذية محكمة", "متابعة مستمرة للتقدم", "تحليل النتائج بدقة"],
      color: "from-purple-600 to-pink-600",
      bgEffect: "from-purple-500/10 to-pink-500/10",
      priority: "حرجة"
    },
    {
      icon: Users,
      title: "تطوير الكوادر البشرية",
      titleEn: "Human Capital Development",
      description: "نستثمر في موظفينا ونطور قدراتهم باستمرار من خلال برامج تدريبية متطورة ومسارات مهنية واضحة",
      features: ["برامج تدريب متقدمة", "مسارات مهنية واضحة", "بيئة عمل محفزة"],
      color: "from-indigo-600 to-blue-600",
      bgEffect: "from-indigo-500/10 to-blue-500/10",
      priority: "أولوية قصوى"
    },
    {
      icon: Globe,
      title: "التوسع العالمي المدروس",
      titleEn: "Strategic Global Expansion",
      description: "نسعى للوصول إلى الأسواق العالمية بمعايير محلية عالية وخطط توسع مدروسة تحافظ على هويتنا وقيمنا",
      features: ["خطط توسع استراتيجية", "شراكات دولية قوية", "معايير عالمية محلية"],
      color: "from-teal-600 to-green-600",
      bgEffect: "from-teal-500/10 to-green-500/10",
      priority: "طويلة المدى"
    }
  ];

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-purple-100/40"></div>
      <div className="absolute top-1/4 right-10 w-24 h-24 bg-violet-400/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-10 w-20 h-20 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-violet-300/5 to-purple-300/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4 p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">التزاماتنا • رؤيتنا للمستقبل</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
            التزاماتنا <span className="text-gradient-primary">الراسخة</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            مجموعة من القيم والمبادئ الأساسية التي توجه مسيرتنا وتحدد علاقتنا مع عملائنا وشركائنا حول العالم
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {commitments.map((commitment, index) => {
            const IconComponent = commitment.icon;
            
            return (
              <Card 
                key={index} 
                className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in hover:transform hover:scale-105 hover:-translate-y-3"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 relative h-full">
                  {/* Dynamic background overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${commitment.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float top-4 right-4" />
                    <div className="absolute w-1 h-1 bg-secondary/30 rounded-full animate-float-delayed top-8 right-8" />
                    <div className="absolute w-1.5 h-1.5 bg-primary/15 rounded-full animate-float bottom-8 left-6" />
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Enhanced Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`relative w-20 h-20 bg-gradient-to-br ${commitment.color} rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-2xl group-hover:shadow-glow`}>
                        <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <IconComponent className="w-10 h-10 text-white group-hover:animate-pulse relative z-10" />
                        {/* Icon glow effect */}
                        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${commitment.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-700`} />
                      </div>
                      
                      {/* Priority Badge */}
                      <Badge className={`bg-gradient-to-r ${commitment.color} text-white border-0 font-bold text-xs px-3 py-1 group-hover:scale-110 transition-transform duration-300`}>
                        {commitment.priority}
                      </Badge>
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="mb-6 flex-grow">
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-gradient-primary transition-all duration-500 group-hover:scale-105 transform-gpu leading-tight">
                        {commitment.title}
                      </h3>
                      <p className="text-sm text-secondary/80 font-medium mb-4 group-hover:text-secondary transition-colors duration-300">
                        {commitment.titleEn}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">
                        {commitment.description}
                      </p>
                    </div>

                    {/* Enhanced Features List */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                        <CheckCircle className="w-4 h-4 animate-pulse" />
                        <span>المميزات الأساسية</span>
                      </h4>
                      <div className="space-y-2">
                        {commitment.features.map((feature, featureIndex) => (
                          <div 
                            key={featureIndex} 
                            className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2 group-hover:bg-white/10 transition-all duration-300"
                            style={{ animationDelay: `${featureIndex * 0.1}s` }}
                          >
                            <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          معتمد ومطبق
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Enhanced Bottom Accent */}
                    <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${commitment.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${commitment.color} opacity-50 animate-pulse`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Summary Section */}
        <div className="text-center bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-8 animate-fade-in border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
            <h3 className="text-4xl font-bold text-primary">التزام شامل • نتائج استثنائية</h3>
            <Award className="w-8 h-8 text-secondary animate-bounce" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-xl font-semibold text-primary mb-1">معدل الالتزام</div>
              <div className="text-sm text-muted-foreground">Commitment Rate</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-xl font-semibold text-primary mb-1">مراقبة مستمرة</div>
              <div className="text-sm text-muted-foreground">Continuous Monitoring</div>
            </div>
            
            <div className="group relative bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-xl font-semibold text-primary mb-1">رضا العملاء</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🏆 معايير الجودة العالمية
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🌟 شهادات الامتياز المعتمدة
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 text-sm font-bold hover:scale-105 transition-transform duration-200">
              🚀 التطوير المستمر
            </Badge>
          </div>

          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <p className="text-lg text-primary font-semibold mb-2">
              التزاماتنا ليست مجرد كلمات، بل منهج عمل نطبقه يومياً لضمان تحقيق التميز والريادة
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>نعمل بشفافية ومصداقية لبناء الثقة والشراكات طويلة المدى</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitmentsSection;