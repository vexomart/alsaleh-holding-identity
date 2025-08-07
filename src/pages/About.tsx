import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
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

  const services = [
    {
      icon: BarChart3,
      title: "الاستثمار التقني",
      description: "نستثمر في الشركات التقنية الناشئة والمتقدمة لتحقيق نمو مستدام"
    },
    {
      icon: Globe,
      title: "الحلول المتكاملة",
      description: "نقدم حلولاً تقنية شاملة تلبي احتياجات الشركات والمؤسسات"
    },
    {
      icon: Rocket,
      title: "الذكاء الاصطناعي",
      description: "نطور حلول الذكاء الاصطناعي المتقدمة للأعمال والمؤسسات"
    },
    {
      icon: Handshake,
      title: "الشراكات الاستراتيجية",
      description: "نبني شراكات قوية مع أفضل الشركات العالمية في مجال التقنية"
    }
  ];

  const leadership = {
    name: "علي صالح الشهري",
    position: "المؤسس والرئيس التنفيذي",
    experience: "خبرة 13+ سنة في الاستثمار والتقنية",
    message: `بسم الله الرحمن الرحيم

أعزائي الشركاء والعملاء الكرام،

يسعدني أن أرحب بكم في شركة علي صالح الشهري القابضة، حيث نؤمن بأن التقنية والابتكار هما أساس بناء مستقبل أفضل للجميع.

إن رؤية المملكة العربية السعودية 2030 ليست مجرد خطة طموحة، بل هي خارطة طريق حقيقية نحو تحول جذري يضع المملكة في مقدمة الدول الرائدة تقنياً واقتصادياً. ونحن في شركة علي صالح الشهري القابضة، نفخر بأن نكون جزءاً لا يتجزأ من هذه الرحلة الاستثنائية.

منذ تأسيس شركتنا في عام 2016، وضعنا نصب أعيننا هدفاً واحداً: المساهمة في تحقيق رؤية 2030 من خلال الاستثمار في التقنيات المتطورة والحلول الذكية التي تخدم الاقتصاد الرقمي الجديد. لقد آمنا بأن المستقبل سيكون للشركات التي تجمع بين الرؤية الاستراتيجية والتنفيذ المتميز.

اليوم، وبعد رحلة حافلة بالإنجازات، نقف بفخر أمام أكثر من 14,883 مشروعاً ناجحاً، و9,512 عميلاً راضياً، ومعدل رضا يبلغ 99.8%. هذه الأرقام ليست مجرد إحصائيات، بل هي شاهد على التزامنا الراسخ بالتميز والجودة.

إننا نؤمن بأن الشراكة الحقيقية تبدأ بالثقة وتنمو بالإنجاز. لذلك، نحن لا نقدم مجرد خدمات، بل نبني جسوراً من الابتكار والنجاح المشترك. نحن شركاؤكم في رحلة التحول الرقمي، ومعكم نشكل مستقبل المملكة التقني.

نتطلع إلى المستقبل بثقة كبيرة، حيث سنواصل الاستثمار في أحدث التقنيات والكوادر المتميزة، لنقدم لكم تجربة استثنائية تفوق التوقعات وترسم معالم النجاح.

شكراً لثقتكم الغالية، ومعاً نبني مستقبلاً أكثر إشراقاً.`,
    achievements: [
      "رائد في الاستثمار التقني والحلول الرقمية",
      "خبير في إدارة الشركات والتسويق الإلكتروني",
      "شراكات مع أفضل الشركات العالمية",
      "خبرة متقدمة في تطوير البرمجيات"
    ]
  };

  return (
    <PageContainer>
      <PageHeader 
        title="من نحن"
        description="شركة استثمارية رائدة تضم مجموعة من الشركات المتخصصة في التقنية والإعلام والتعليم"
      />
      
      <div className="container mx-auto px-4 lg:px-6 space-y-20">
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

        {/* Services Overview */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-3xl">
          <div className="p-8">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-full">
                <Briefcase className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold">خدماتنا المتميزة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                ما نقدمه لكم
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                مجموعة شاملة من الخدمات التقنية والاستثمارية المتطورة
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card 
                    key={index}
                    className="group bg-white/80 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership Message */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden rounded-3xl">
          <div className="p-8">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full backdrop-blur-sm border border-blue-200/30">
                <Quote className="w-6 h-6 text-blue-600 animate-pulse" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold">رسالة من القيادة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                كلمة <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">الرئيس التنفيذي</span>
              </h2>
            </div>

            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <img 
                          src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                          alt="ASH Holdings" 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {leadership.name}
                    </h3>
                    <p className="text-xl text-blue-100 font-semibold mb-4">
                      {leadership.position}
                    </p>
                    <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 text-base font-medium">
                      {leadership.experience}
                    </Badge>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 md:p-10 border border-blue-100/50 dark:border-slate-600 shadow-inner relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line text-justify mb-8 font-medium">
                        {leadership.message}
                      </div>
                      
                      <div className="border-t border-blue-200 dark:border-slate-600 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-right">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{leadership.name}</div>
                          <div className="text-blue-600 dark:text-blue-400 font-semibold mb-1">{leadership.position}</div>
                          <div className="text-slate-500 dark:text-slate-400 text-sm">شركة علي صالح الشهري القابضة</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
                      المؤهلات والخبرات
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {leadership.achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
  );
};

export default About;