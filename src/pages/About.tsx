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

منذ بداية مسيرتنا في عام 2016، كان هدفنا الأساسي هو تقديم حلول تقنية متطورة تساهم في تطوير الأعمال ودعم رؤية المملكة العربية السعودية 2030.

إن رحلتنا مبنية على الثقة والشراكة الحقيقية مع عملائنا، وعلى فريق عمل متخصص يضع الجودة والإبداع في مقدمة أولوياته.

شكراً لثقتكم الغالية، ونتطلع لشراكة مثمرة معكم.`,
    achievements: [
      "رائد في الاستثمار التقني والحلول الرقمية",
      "خبير في إدارة الشركات والتسويق الإلكتروني",
      "شراكات مع أفضل الشركات العالمية",
      "خبرة متقدمة في تطوير البرمجيات"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
          
          {/* Animated Background Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-8 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                <Building2 className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-primary font-semibold">شركة علي صالح الشهري القابضة</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-primary">من </span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">نحن</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                شركة استثمارية رائدة تضم مجموعة من الشركات المتخصصة في التقنية والإعلام والتعليم
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <a href="#services">
                    اكتشف خدماتنا
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg font-semibold"
                  asChild
                >
                  <a href="/contact">
                    تواصل معنا
                  </a>
                </Button>
              </div>
            </div>

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
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
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
          </div>
        </section>

        {/* Company Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
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
          </div>
        </section>

        {/* Services Overview */}
        <section id="services" className="py-20 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="container mx-auto px-4 lg:px-6">
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
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200/30 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-indigo-100/20" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full backdrop-blur-sm border border-blue-200/30">
                <Quote className="w-6 h-6 text-blue-600 animate-pulse" />
                <span className="text-blue-700 font-semibold">رسالة من القيادة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                كلمة <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">الرئيس التنفيذي</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                    
                    <div className="relative z-10">
                      <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                          <span className="text-4xl font-bold text-blue-600">علي</span>
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

                  {/* Message Content */}
                  <div className="p-8 md:p-12">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 md:p-10 border border-blue-100/50 shadow-inner relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent" />
                      
                      {/* Quote Icons */}
                      <div className="absolute top-6 right-6 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="absolute bottom-6 left-6 w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center rotate-180">
                        <Quote className="w-6 h-6 text-blue-500" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-lg md:text-xl leading-relaxed text-slate-700 whitespace-pre-line text-justify mb-8 font-medium">
                          {leadership.message}
                        </div>
                        
                        {/* Signature */}
                        <div className="border-t border-blue-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-center md:text-right">
                            <div className="text-2xl font-bold text-slate-800 mb-1">{leadership.name}</div>
                            <div className="text-blue-600 font-semibold mb-1">{leadership.position}</div>
                            <div className="text-slate-500 text-sm">شركة علي صالح الشهري القابضة</div>
                          </div>
                          
                          <div className="text-center">
                            <img 
                              src="/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png" 
                              alt="شعار الشركة" 
                              className="w-20 h-20 object-contain mx-auto mb-3 opacity-90 hover:opacity-100 transition-opacity duration-300"
                            />
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mt-10">
                      <h4 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        المؤهلات والخبرات
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {leadership.achievements.map((achievement, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-slate-700 font-medium leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-10 text-center">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6">
                        <p className="text-white font-semibold mb-4">
                          نتطلع للتواصل معكم وبناء شراكات استراتيجية مثمرة
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button 
                            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2"
                            asChild
                          >
                            <a href="/contact">
                              تواصل معنا
                              <ArrowRight className="w-4 h-4 mr-2" />
                            </a>
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 font-semibold px-6 py-2"
                            asChild
                          >
                            <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                              واتساب مباشر
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="text-center animate-fade-in">
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
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;