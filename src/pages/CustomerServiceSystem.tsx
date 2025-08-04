import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  Building,
  Globe,
  ArrowRight,
  Play,
  Award,
  Phone,
  Mail,
  MessageSquare,
  Headphones,
  Star,
  Settings,
  FileText,
  UserCheck,
  Zap,
  Target,
  Rocket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CustomerServiceSystem = () => {
  const navigate = useNavigate();

  const quickStats = [
    { value: "500+", label: "عميل راضي", icon: Users, color: "text-green-600" },
    { value: "1000+", label: "مشروع مكتمل", icon: CheckCircle, color: "text-blue-600" },
    { value: "24/7", label: "دعم مستمر", icon: Clock, color: "text-orange-600" },
    { value: "50+", label: "دولة حول العالم", icon: Globe, color: "text-purple-600" }
  ];

  const primaryServices = [
    {
      title: "إدارة طلبات العملاء",
      description: "نظام متطور لإدارة ومتابعة جميع طلبات العملاء بكفاءة عالية مع تتبع شامل لكافة المراحل",
      icon: Users,
      features: ["تتبع الطلبات", "ردود سريعة", "تقارير مفصلة", "إشعارات فورية"],
      badge: "الأساسي",
      color: "bg-blue-500"
    },
    {
      title: "الدعم الفني المتخصص",
      description: "فريق دعم فني متخصص متاح على مدار الساعة لحل جميع المشاكل التقنية والاستفسارات",
      icon: Shield,
      features: ["دعم 24/7", "حلول سريعة", "خبراء متخصصون", "دعم متعدد اللغات"],
      badge: "متميز",
      color: "bg-green-500"
    },
    {
      title: "إدارة المشاريع",
      description: "متابعة شاملة لجميع مراحل المشاريع من البداية حتى التسليم مع ضمان الجودة",
      icon: BarChart3,
      features: ["تتبع التقدم", "تقارير دورية", "جدولة زمنية", "إدارة الموارد"],
      badge: "احترافي",
      color: "bg-purple-500"
    },
    {
      title: "الاستشارات التقنية",
      description: "استشارات تقنية وإدارية متقدمة لتطوير أعمالك وتحسين الأداء والنمو المستدام",
      icon: TrendingUp,
      features: ["تحليل الأداء", "خطط تطوير", "استراتيجيات نمو", "حلول مبتكرة"],
      badge: "متقدم",
      color: "bg-orange-500"
    }
  ];

  const supportChannels = [
    {
      title: "دعم هاتفي فوري",
      description: "خط ساخن متاح 24/7 للدعم العاجل",
      icon: Phone,
      action: "اتصل الآن",
      highlight: true
    },
    {
      title: "دعم عبر البريد الإلكتروني",
      description: "استجابة خلال 30 دقيقة في أوقات العمل",
      icon: Mail,
      action: "أرسل رسالة",
      highlight: false
    },
    {
      title: "محادثة مباشرة",
      description: "تحدث مع أحد متخصصينا فوراً",
      icon: MessageSquare,
      action: "ابدأ محادثة",
      highlight: true
    },
    {
      title: "مركز المساعدة",
      description: "قاعدة معرفية شاملة لحل المشاكل",
      icon: Headphones,
      action: "تصفح المقالات",
      highlight: false
    }
  ];

  const systemFeatures = [
    {
      title: "فريق دعم متخصص",
      description: "فريق من خبراء خدمة العملاء المدربين متاح على مدار الساعة لضمان أفضل تجربة",
      icon: UserCheck,
      stats: "50+ خبير"
    },
    {
      title: "نظام إدارة متقدم",
      description: "نظام CRM متطور مع ذكاء اصطناعي لإدارة جميع تفاعلات العملاء بكفاءة عالية",
      icon: Settings,
      stats: "99.9% وقت تشغيل"
    },
    {
      title: "أمان وموثوقية",
      description: "حماية متقدمة للبيانات وشهادات أمان دولية لضمان حماية معلومات العملاء",
      icon: Shield,
      stats: "ISO 27001"
    },
    {
      title: "تقارير ذكية",
      description: "تقارير تفصيلية وتحليلات متقدمة باستخدام الذكاء الاصطناعي لفهم احتياجات العملاء",
      icon: BarChart3,
      stats: "تحديث لحظي"
    },
    {
      title: "استجابة فورية",
      description: "نظام إشعارات ذكي يضمن الاستجابة السريعة لجميع طلبات العملاء والمتابعة المستمرة",
      icon: Zap,
      stats: "< 5 دقائق"
    },
    {
      title: "رضا العملاء",
      description: "نسبة رضا عالية تفوق 95% مع ضمان جودة الخدمة ومتابعة مستمرة لتحسين التجربة",
      icon: Star,
      stats: "95%+ رضا"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "تسجيل الطلب",
      description: "تسجيل طلبك بسهولة عبر النظام مع تفاصيل شاملة",
      icon: FileText
    },
    {
      step: "02",
      title: "التحليل والتقييم",
      description: "فريقنا يحلل طلبك ويقدم أفضل الحلول المناسبة",
      icon: Target
    },
    {
      step: "03",
      title: "التنفيذ والمتابعة",
      description: "تنفيذ الحل مع متابعة مستمرة حتى اكتمال المشروع",
      icon: Rocket
    },
    {
      step: "04",
      title: "التقييم والتطوير",
      description: "تقييم النتائج والعمل على التطوير المستمر",
      icon: Award
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        title="نظام خدمة العملاء المتكامل"
        description="شركة علي صالح الشهري القابضة - منصة شاملة لإدارة طلبات العملاء وتقديم الدعم المتكامل بأحدث التقنيات"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-3 hover-scale shadow-xl"
            onClick={() => navigate('/auth')}
          >
            <Play className="mr-2 h-5 w-5" />
            دخول النظام
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-3 hover-scale shadow-lg bg-white/80 backdrop-blur-sm"
            onClick={() => navigate('/dashboard')}
          >
            لوحة التحكم
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {quickStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
              <CardContent className="p-4">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-32">
        {/* Primary Services Section */}
        <section className="animate-fade-in delay-200">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm">خدماتنا الأساسية</Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
              خدمات النظام المتكاملة
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              منصة شاملة مصممة خصيصاً لتلبية جميع احتياجات عملائنا مع ضمان أعلى مستويات الجودة والكفاءة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {primaryServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
                badge={service.badge}
                className={`animate-fade-in delay-${(index + 1) * 100} hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}
                onClick={() => navigate('/services')}
              />
            ))}
          </div>
        </section>

        {/* Support Channels Section */}
        <section className="animate-fade-in delay-300">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm bg-green-100 text-green-800">قنوات الدعم</Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              تواصل معنا بالطريقة التي تناسبك
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نوفر لك متعدد قنوات التواصل لضمان حصولك على أفضل دعم في الوقت المناسب
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => (
              <Card 
                key={index} 
                className={`text-center hover:shadow-xl transition-all duration-300 hover-scale cursor-pointer ${
                  channel.highlight ? 'ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-blue-600/5' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className={`p-4 rounded-full mx-auto w-fit mb-4 ${
                    channel.highlight ? 'bg-gradient-to-br from-primary to-blue-600' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    <channel.icon className={`w-8 h-8 ${channel.highlight ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <CardTitle className="text-lg">{channel.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">{channel.description}</CardDescription>
                  <Button 
                    variant={channel.highlight ? "default" : "outline"}
                    size="sm"
                    className={channel.highlight ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" : ""}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps Section */}
        <section className="animate-fade-in delay-400">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm bg-purple-100 text-purple-800">عملية العمل</Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              كيف نعمل معك؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              عملية منظمة ومدروسة لضمان تحقيق أفضل النتائج لمشاريعك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="relative">
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {step.step}
                      </div>
                      <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 mx-auto w-fit mb-4 mt-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
                
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary to-blue-600 transform -translate-y-1/2 z-10">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* System Features Section */}
        <section className="animate-fade-in delay-500">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 text-sm bg-blue-100 text-blue-800">مميزات النظام</Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              لماذا نحن الخيار الأفضل؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نجمع بين الخبرة الطويلة والتقنيات الحديثة لنقدم لك خدمة استثنائية تفوق توقعاتك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover-scale bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 rounded-3xl p-16 animate-fade-in delay-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-4xl mx-auto">
            <Badge className="mb-6 px-6 py-2 text-sm bg-primary text-white">ابدأ معنا اليوم</Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
              جاهز لتجربة خدمة عملاء استثنائية؟
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              انضم إلى آلاف العملاء الراضين واكتشف كيف يمكن لخدماتنا المتميزة أن تحول تجربة عملائك إلى تجربة لا تُنسى
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-10 py-4 hover-scale shadow-xl"
                onClick={() => navigate('/auth')}
              >
                <Play className="mr-2 h-6 w-6" />
                ابدأ رحلتك معنا الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-10 py-4 hover-scale bg-white/80 backdrop-blur-sm shadow-lg"
                onClick={() => navigate('/contact')}
              >
                تحدث مع مستشار
                <ArrowRight className="mr-2 h-6 w-6" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">حماية بيانات معتمدة</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm">دعم 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">تقييم 4.9/5</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">ضمان الجودة</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CustomerServiceSystem;