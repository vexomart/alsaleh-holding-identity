import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Palette, 
  Smartphone, 
  Cloud, 
  Shield, 
  BarChart3,
  Users,
  Building,
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Award,
  TrendingUp,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "إدارة طلبات العملاء",
      description: "نظام متطور لإدارة ومتابعة جميع طلبات العملاء بكفاءة عالية",
      icon: Users,
      features: ["تتبع الطلبات", "ردود سريعة", "تقارير مفصلة"],
      badge: "الأساسي"
    },
    {
      title: "الدعم الفني",
      description: "فريق دعم فني متخصص متاح على مدار الساعة لحل مشاكلك",
      icon: Shield,
      features: ["دعم 24/7", "حلول سريعة", "خبراء متخصصون"],
      badge: "متميز"
    },
    {
      title: "إدارة المشاريع",
      description: "متابعة شاملة لجميع مراحل المشاريع من البداية حتى التسليم",
      icon: BarChart3,
      features: ["تتبع التقدم", "تقارير دورية", "جدولة زمنية"],
      badge: "احترافي"
    },
    {
      title: "خدمات استشارية",
      description: "استشارات تقنية وإدارية لتطوير أعمالك وتحسين أدائك",
      icon: TrendingUp,
      features: ["تحليل الأداء", "خطط تطوير", "استراتيجيات نمو"],
      badge: "متقدم"
    }
  ];

  const stats = [
    { value: "500+", label: "عميل راضي", icon: Users },
    { value: "1000+", label: "مشروع مكتمل", icon: CheckCircle },
    { value: "15+", label: "سنة خبرة", icon: Building },
    { value: "50+", label: "دولة حول العالم", icon: Globe }
  ];

  const features = [
    {
      title: "فريق دعم متخصص",
      description: "فريق من خبراء خدمة العملاء متاح على مدار الساعة",
      icon: Users
    },
    {
      title: "نظام إدارة متقدم",
      description: "نظام CRM متطور لإدارة جميع تفاعلات العملاء",
      icon: Code
    },
    {
      title: "أمان وموثوقية",
      description: "حماية عالية لبيانات العملاء ومعلوماتهم الحساسة",
      icon: Shield
    },
    {
      title: "تقارير تفصيلية",
      description: "تقارير شاملة ومفصلة عن أداء الخدمات ورضا العملاء",
      icon: Award
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        title="نظام خدمة العملاء"
        description="شركة علي صالح الشهري القابضة - منصة شاملة لإدارة طلبات العملاء وتقديم الدعم المتكامل"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-3 hover-scale"
            onClick={() => navigate('/auth')}
          >
            <Play className="mr-2 h-5 w-5" />
            دخول النظام
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-3 hover-scale"
            onClick={() => navigate('/dashboard')}
          >
            لوحة التحكم
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Stats Section */}
        <section className="animate-fade-in delay-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl text-muted-foreground">أرقام تتحدث عن تميزنا وجودة خدماتنا</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className={`text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in delay-${(index + 1) * 100}`}>
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="animate-fade-in delay-300">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              خدمات النظام
            </h2>
            <p className="text-xl text-muted-foreground">منصة شاملة لإدارة جميع احتياجات العملاء</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                features={service.features}
                badge={service.badge}
                className={`animate-fade-in delay-${(index + 1) * 100}`}
                onClick={() => navigate('/services')}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="animate-fade-in delay-400">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              لماذا تختارنا؟
            </h2>
            <p className="text-xl text-muted-foreground">نتميز بالجودة والخبرة والالتزام بتحقيق أهدافك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in delay-${(index + 1) * 100}`}>
                <CardHeader>
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 mx-auto w-fit mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-3xl p-12 animate-fade-in delay-500">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              هل تحتاج لدعم فوري؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              فريقنا جاهز لمساعدتك على مدار الساعة - تواصل معنا الآن للحصول على أفضل خدمة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-3 hover-scale"
                onClick={() => navigate('/contact')}
              >
                تواصل معنا الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-3 hover-scale"
                onClick={() => navigate('/about')}
              >
                اعرف المزيد عنا
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;