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
      title: "تطوير المواقع والتطبيقات",
      description: "حلول تقنية متقدمة لتطوير المواقع وتطبيقات الجوال",
      icon: Code,
      features: ["مواقع متجاوبة", "تطبيقات الجوال", "واجهات حديثة"],
      badge: "الأكثر طلباً"
    },
    {
      title: "خدمات التصميم",
      description: "تصميم هوية بصرية متميزة لعلامتك التجارية",
      icon: Palette,
      features: ["تصميم الشعارات", "الهوية البصرية", "مواد تسويقية"],
      badge: "إبداعي"
    },
    {
      title: "الحلول السحابية",
      description: "خدمات استضافة وحلول سحابية آمنة وموثوقة",
      icon: Cloud,
      features: ["استضافة آمنة", "نسخ احتياطية", "دعم فني 24/7"],
      badge: "موثوق"
    },
    {
      title: "الأمن السيبراني",
      description: "حماية شاملة لأنظمتك وبياناتك الرقمية",
      icon: Shield,
      features: ["حماية من التهديدات", "مراقبة مستمرة", "تقييم أمني"],
      badge: "حماية متقدمة"
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
      title: "فريق خبير",
      description: "فريق من المطورين والمصممين ذوي الخبرة العالية",
      icon: Users
    },
    {
      title: "تقنيات حديثة",
      description: "نستخدم أحدث التقنيات والأدوات في السوق",
      icon: Code
    },
    {
      title: "دعم مستمر",
      description: "دعم فني متواصل ومتابعة دورية لمشاريعك",
      icon: Shield
    },
    {
      title: "جودة عالية",
      description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا",
      icon: Award
    }
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <PageHeader
        title="شركة الصالح القابضة"
        description="شريكك الموثوق في الحلول التقنية والخدمات الرقمية المتقدمة"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-3 hover-scale"
            onClick={() => navigate('/auth')}
          >
            <Play className="mr-2 h-5 w-5" />
            ابدأ رحلتك معنا
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
              خدماتنا المتميزة
            </h2>
            <p className="text-xl text-muted-foreground">نقدم مجموعة شاملة من الحلول التقنية المتطورة</p>
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
              جاهز لبدء مشروعك؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              انضم إلى أكثر من 500 عميل راضي واكتشف كيف يمكننا مساعدتك في تحقيق أهدافك الرقمية
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