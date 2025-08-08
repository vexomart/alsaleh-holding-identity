import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/back-button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

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
  Rocket,
  BarChart3,
  UserCheck,
  Handshake,
  Briefcase
} from "lucide-react";

const About = () => {
  const stats = [
    { 
      number: "14,883", 
      label: "مشروع منجز", 
      sublabel: "Completed Projects",
      icon: Trophy,
      color: "from-blue-600 to-cyan-600"
    },
    { 
      number: "9,512", 
      label: "عميل راضٍ", 
      sublabel: "Satisfied Clients",
      icon: Users,
      color: "from-green-600 to-emerald-600"
    },
    { 
      number: "2016", 
      label: "سنة التأسيس", 
      sublabel: "Foundation Year",
      icon: Building2,
      color: "from-purple-600 to-pink-600"
    },
    { 
      number: "99.8%", 
      label: "معدل الرضا", 
      sublabel: "Satisfaction Rate",
      icon: Star,
      color: "from-yellow-600 to-orange-600"
    }
  ];

  const companyValues = [
    {
      icon: Heart,
      title: "الشغف والالتزام",
      description: "نؤمن بقوة الشغف في تحقيق التميز وتقديم أفضل الحلول التقنية المبتكرة",
      color: "from-red-500 to-pink-500",
      features: ["التميز في الخدمة", "الالتزام بالمواعيد", "جودة عالية"]
    },
    {
      icon: Shield,
      title: "الثقة والشفافية",
      description: "نبني علاقاتنا على أساس الثقة المتبادلة والشفافية في جميع تعاملاتنا",
      color: "from-blue-500 to-cyan-500",
      features: ["شفافية كاملة", "أمان البيانات", "ثقة متبادلة"]
    },
    {
      icon: Lightbulb,
      title: "الابتكار والإبداع",
      description: "نسعى دائماً لاستكشاف آفاق جديدة وتطوير حلول مبتكرة تلبي احتياجات المستقبل",
      color: "from-yellow-500 to-orange-500",
      features: ["تقنيات حديثة", "حلول مبتكرة", "رؤية مستقبلية"]
    },
    {
      icon: Trophy,
      title: "التميز والجودة",
      description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ونسعى للتميز في كل ما نقوم به",
      color: "from-purple-500 to-indigo-500",
      features: ["معايير عالمية", "جودة مضمونة", "أداء متميز"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-[48px] lg:pt-[112px]">
        <PageContainer showNavigation={false} showFooter={false} showWhatsAppButton={false}>
          <BackButton />
          
          <PageHeader
            title="من نحن"
            description="نبني مستقبل التكنولوجيا بحلول مبتكرة ومتقدمة"
          />

          <div className="space-y-20">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card 
                    key={index} 
                    className="bg-white/80 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-500 group hover:scale-105"
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                      <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Vision & Mission */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative rounded-3xl">
              <div className="grid lg:grid-cols-2 gap-12 items-center p-8">
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">رؤيتنا</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    أن نكون الشركة القابضة الرائدة في المنطقة، نساهم في بناء مستقبل تقني مستدام 
                    ومبتكر يخدم المجتمع ويحقق التنمية الاقتصادية المستدامة.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2">الريادة التقنية</Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">الاستدامة</Badge>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">الابتكار</Badge>
                  </div>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-secondary" />
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">مهمتنا</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    تمكين الشركات والمؤسسات من تحقيق أهدافها من خلال حلول تقنية متطورة 
                    واستثمارات ذكية تساهم في النمو الاقتصادي وتحقيق رؤية المملكة 2030.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">تمكين الأعمال</Badge>
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2">النمو المستدام</Badge>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2">رؤية 2030</Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Values */}
            <section>
              <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-full">
                  <Star className="w-6 h-6 text-primary animate-pulse" />
                  <span className="text-primary font-semibold">قيمنا الأساسية</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                  القيم التي تقودنا
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  المبادئ الأساسية التي تحكم كل قرار نتخذه وكل خطوة نخطوها
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {companyValues.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <Card 
                      key={index}
                      className="group bg-white/80 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-8 relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
                        
                        <div className="relative">
                          <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          
                          <h3 className="text-2xl font-bold text-primary mb-4">
                            {value.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            {value.description}
                          </p>

                          <div className="space-y-2">
                            {value.features.map((feature, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-all duration-500`} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden rounded-3xl">
              <div className="text-center animate-fade-in p-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  ابدأ رحلتك معنا اليوم
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  انضم إلى آلاف العملاء الذين يثقون بخبرتنا وخدماتنا المتميزة
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold"
                    asChild
                  >
                    <a href="/contact">
                      تواصل معنا الآن
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
                    asChild
                  >
                    <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                      واتساب مباشر
                    </a>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </PageContainer>
      </div>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;