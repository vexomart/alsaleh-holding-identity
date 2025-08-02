import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Heart, 
  Trophy, 
  Globe, 
  Zap, 
  Shield, 
  Star,
  TrendingUp,
  Award,
  CheckCircle,
  Lightbulb,
  Building2,
  Clock,
  MapPin,
  Calendar,
  Crown,
  Sparkles,
  ArrowRight,
  Quote,
  Eye,
  Compass,
  Rocket
} from "lucide-react";

const About = () => {
  const companyValues = [
    {
      icon: Heart,
      title: "الشغف والالتزام",
      description: "نؤمن بقوة الشغف في تحقيق التميز وتقديم أفضل الحلول لعملائنا",
      color: "from-red-500 to-pink-500",
      bgEffect: "from-red-500/10 to-pink-500/10"
    },
    {
      icon: Shield,
      title: "الثقة والشفافية",
      description: "نبني علاقاتنا على أساس الثقة المتبادلة والشفافية في جميع تعاملاتنا",
      color: "from-blue-500 to-cyan-500",
      bgEffect: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Lightbulb,
      title: "الابتكار والإبداع",
      description: "نسعى دائماً لاستكشاف آفاق جديدة وتطوير حلول مبتكرة تلبي احتياجات المستقبل",
      color: "from-yellow-500 to-orange-500",
      bgEffect: "from-yellow-500/10 to-orange-500/10"
    },
    {
      icon: Trophy,
      title: "التميز والجودة",
      description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ونسعى للتميز في كل ما نقوم به",
      color: "from-purple-500 to-indigo-500",
      bgEffect: "from-purple-500/10 to-indigo-500/10"
    }
  ];

  const milestones = [
    {
      year: "2016",
      title: "بداية الرحلة",
      description: "تأسيس الشركة برؤية طموحة لتكون رائدة في مجال الاستثمار التقني",
      achievement: "تأسيس الشركة",
      icon: Building2,
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2018",
      title: "التوسع الأول",
      description: "إطلاق أول استثمار تقني كبير وبناء فريق عمل متخصص",
      achievement: "10 مشاريع ناجحة",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: "2020",
      title: "الريادة الرقمية",
      description: "تطوير منصات رقمية متقدمة والدخول في شراكات استراتيجية عالمية",
      achievement: "50+ شراكة عالمية",
      icon: Globe,
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2022",
      title: "التوسع العالمي",
      description: "افتتاح مكاتب إقليمية وتحقيق نمو استثنائي في الاستثمارات",
      achievement: "500M+ استثمارات",
      icon: Crown,
      color: "from-yellow-500 to-orange-500"
    },
    {
      year: "2024",
      title: "مستقبل التقنية",
      description: "قيادة الابتكار في الذكاء الاصطناعي والتقنيات الناشئة",
      achievement: "رائد في الذكاء الاصطناعي",
      icon: Rocket,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { number: "8+", label: "سنوات من التميز", sublabel: "Years of Excellence" },
    { number: "200+", label: "مشروع ناجح", sublabel: "Successful Projects" },
    { number: "50+", label: "شراكة عالمية", sublabel: "Global Partnerships" },
    { number: "1000+", label: "عميل راضي", sublabel: "Satisfied Clients" },
    { number: "98%", label: "معدل النجاح", sublabel: "Success Rate" }
  ];

  const leadership = [
    {
      name: "علي صالح الشهري",
      position: "المؤسس والرئيس التنفيذي",
      experience: "15+ سنة خبرة في الاستثمار والتقنية",
      quote: "نؤمن بأن التقنية هي مفتاح مستقبل أفضل للجميع",
      achievements: ["قائد 100+ مشروع عالمي", "خبير في الاستثمار التقني", "رائد في الابتكار"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Users className="w-6 h-6 text-white animate-pulse" />
                <span className="text-sm font-medium text-white/90">قصتنا • رحلتنا • مستقبلنا</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                من <span className="text-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">نحن</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                شركة علي صالح الشهري القابضة - رحلة التميز والابتكار منذ 2016
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group hover:bg-white/15 transition-all duration-300 border border-white/20">
                    <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-white/90 mb-1">{stat.label}</div>
                    <div className="text-xs text-white/70">{stat.sublabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Compass className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">قصة نجاح • رحلة إلهام</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                قصة <span className="text-gradient-primary">النجاح</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                بدأت رحلتنا برؤية بسيطة: تمكين الشركات من خلال التقنية والابتكار
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div className="animate-fade-in">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-8 h-8 text-primary" />
                    <h3 className="text-3xl font-bold text-primary">رؤيتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    أن نكون الشركة القابضة الرائدة في المنطقة، نساهم في بناء مستقبل تقني مستدام 
                    ومبتكر يخدم المجتمع ويحقق التنمية الاقتصادية.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">الريادة</Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">الاستدامة</Badge>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">الابتكار</Badge>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-secondary" />
                    <h3 className="text-3xl font-bold text-primary">مهمتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    تمكين الشركات والمؤسسات من تحقيق أهدافها من خلال حلول تقنية متطورة 
                    واستثمارات ذكية تساهم في النمو الاقتصادي المستدام.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">التمكين</Badge>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">النمو</Badge>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">التطوير</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Star className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">قيمنا • مبادئنا</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                قيمنا <span className="text-gradient-primary">الأساسية</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                القيم التي تقود كل قرار نتخذه وكل خطوة نخطوها نحو المستقبل
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {companyValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card 
                    key={index}
                    className="group premium-card hover:shadow-glow transition-all duration-700 border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardContent className="p-8 relative h-full">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.bgEffect} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                      
                      <div className="relative z-10">
                        <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-gradient-primary transition-all duration-300">
                          {value.title}
                        </h3>
                        
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {value.description}
                        </p>
                      </div>

                      <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-b-xl`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-gradient-subtle relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Clock className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">رحلة الزمن • معالم التاريخ</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                رحلة <span className="text-gradient-primary">التطور</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                معالم مهمة في رحلتنا نحو التميز والريادة في عالم الاستثمار التقني
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-secondary to-primary opacity-30 hidden lg:block" />
              
              <div className="space-y-16">
                {milestones.map((milestone, index) => {
                  const IconComponent = milestone.icon;
                  const isEven = index % 2 === 0;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} animate-fade-in`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Content */}
                      <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                        <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl group hover:shadow-glow transition-all duration-500">
                          <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge className={`bg-gradient-to-r ${milestone.color} text-white font-bold text-lg px-4 py-2`}>
                                {milestone.year}
                              </Badge>
                              <div className={`w-12 h-12 bg-gradient-to-br ${milestone.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-gradient-primary transition-all duration-300">
                              {milestone.title}
                            </h3>
                            
                            <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                              {milestone.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-sm font-medium text-green-600">{milestone.achievement}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Timeline Node */}
                      <div className="hidden lg:block relative">
                        <div className={`w-6 h-6 bg-gradient-to-br ${milestone.color} rounded-full border-4 border-white shadow-lg z-10 relative group-hover:scale-125 transition-transform duration-300`} />
                        <div className={`absolute inset-0 w-6 h-6 bg-gradient-to-br ${milestone.color} rounded-full animate-pulse opacity-50`} />
                      </div>

                      {/* Spacer for even layout */}
                      <div className="flex-1 hidden lg:block" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Crown className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">القيادة • الرؤية</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                القيادة <span className="text-gradient-primary">الملهمة</span>
              </h2>
            </div>

            {leadership.map((leader, index) => (
              <div key={index} className="max-w-6xl mx-auto animate-fade-in">
                <Card className="premium-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                  <CardContent className="p-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                          <Crown className="w-12 h-12 text-white" />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-primary mb-2">{leader.name}</h3>
                        <p className="text-xl text-secondary mb-4 font-medium">{leader.position}</p>
                        <p className="text-muted-foreground mb-6 text-lg">{leader.experience}</p>
                        
                        <div className="space-y-2 mb-8">
                          {leader.achievements.map((achievement, achievementIndex) => (
                            <div key={achievementIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-muted-foreground">{achievement}</span>
                            </div>
                          ))}
                        </div>

                        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          تعرف على المزيد
                        </Button>
                      </div>

                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 border border-primary/20">
                        <div className="flex items-start gap-4 mb-6">
                          <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                          <blockquote className="text-xl font-medium text-primary leading-relaxed italic">
                            "{leader.quote}"
                          </blockquote>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">قائد ملهم ورائد في الابتكار</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
                <span className="text-sm font-medium text-white/90">انضم إلينا • ابدأ رحلتك</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
                ابدأ رحلتك <span className="text-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">معنا</span>
              </h2>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
                انضم إلى شركة رائدة في الاستثمار التقني وكن جزءاً من قصة نجاح استثنائية
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  تواصل معنا
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2" />
                  انضم لفريقنا
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;