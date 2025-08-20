import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Printer, 
  FileText, 
  Image, 
  BookOpen, 
  CreditCard, 
  Package,
  Palette,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const PrintingServices = () => {
  console.log('PrintingServices component is rendering...');
  const features = [
    {
      title: "جودة عالية",
      description: "طباعة بجودة احترافية عالية الدقة",
      icon: Star
    },
    {
      title: "تسليم سريع",
      description: "خدمة سريعة مع ضمان التسليم في الموعد",
      icon: Clock
    },
    {
      title: "تصميم مخصص",
      description: "تصميمات مخصصة حسب احتياجاتك",
      icon: Palette
    },
    {
      title: "ضمان الجودة",
      description: "ضمان شامل على جودة الطباعة والمواد",
      icon: Shield
    }
  ];

  const services = [
    {
      title: "مستلزمات مكتبية للأعمال",
      description: "كروت شخصية، أوراق مراسلات، فولدرات وجميع المستلزمات المكتبية",
      icon: CreditCard,
      features: ["كروت شخصية فاخرة", "أوراق مراسلات رسمية", "فولدرات مخصصة", "أظرف بتصميمات احترافية"]
    },
    {
      title: "مطبوعات تسويقية",
      description: "بروشورات، فلايرز، كتالوجات وجميع المواد التسويقية",
      icon: FileText,
      features: ["بروشورات ثلاثية الطي", "فلايرز دعائية", "كتالوجات المنتجات", "ملصقات تسويقية"]
    },
    {
      title: "مطبوعات كبيرة الحجم",
      description: "لافتات، بنرات، استاندات وجميع المطبوعات كبيرة الحجم",
      icon: Image,
      features: ["لافتات خارجية", "بنرات إعلانية", "استاندات معارض", "طباعة على القماش"]
    },
    {
      title: "التغليف والصناديق",
      description: "صناديق مخصصة، أكياس هدايا وحلول التغليف الاحترافية",
      icon: Package,
      features: ["صناديق بتصميم مخصص", "أكياس ورقية فاخرة", "تغليف المنتجات", "صناديق الشحن"]
    },
    {
      title: "هدايا دعائية",
      description: "أقلام، دفاتر، أكواب وجميع الهدايا الدعائية المطبوعة",
      icon: Palette,
      features: ["أقلام مطبوعة", "دفاتر مخصصة", "أكواب وكاسات", "فلاشات USB"]
    },
    {
      title: "ملابس وإكسسوارات",
      description: "تيشيرتات، قبعات، حقائب وإكسسوارات مطبوعة",
      icon: Shield,
      features: ["تيشيرتات قطنية", "قبعات مطرزة", "حقائب قماشية", "بادجات وشارات"]
    },
    {
      title: "براند الشركات والفعاليات",
      description: "هوية بصرية متكاملة للشركات والفعاليات",
      icon: BookOpen,
      features: ["شعارات وهويات", "مواد الفعاليات", "لافتات المعارض", "تصميم العلامة التجارية"]
    }
  ];

  const stats = [
    { value: "10000+", label: "مطبوعة منجزة", icon: CheckCircle },
    { value: "500+", label: "عميل راضي", icon: Star },
    { value: "15+", label: "سنة خبرة", icon: Clock },
    { value: "24/7", label: "دعم فني", icon: Shield }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="خدمات الطباعة الاحترافية"
        description="نقدم خدمات طباعة عالية الجودة لجميع احتياجاتك التجارية والشخصية"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Stats Section */}
        <section className="animate-fade-in delay-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="animate-fade-in delay-300">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              مميزات خدماتنا
            </h2>
            <p className="text-xl text-muted-foreground">نتميز بالجودة والسرعة والاحترافية في جميع خدماتنا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
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

        {/* Services Section */}
        <section className="animate-fade-in delay-400">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white">
              خدماتنا المتخصصة
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              خدمات الطباعة
            </h2>
            <p className="text-xl text-muted-foreground">مجموعة شاملة من خدمات الطباعة لتلبية جميع احتياجاتك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-600/5">
                  <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-blue-600/10 w-fit mb-4">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-3xl p-12 animate-fade-in delay-500">
          <div className="max-w-3xl mx-auto">
            <Printer className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              جاهز لطباعة مشروعك؟
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              تواصل معنا الآن للحصول على عرض سعر مخصص ومناقشة تفاصيل مشروعك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-lg px-8 py-3 hover-scale"
                asChild
              >
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  تواصل معنا الآن
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-3 hover-scale"
                asChild
              >
                <a href="mailto:info@alialshehriholding.com">
                  <Mail className="w-5 h-5 mr-2" />
                  أرسل استفسار
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 text-lg px-8 py-3 hover-scale"
                asChild
              >
                <a href="https://wa.me/966555812567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  واتساب
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default PrintingServices;