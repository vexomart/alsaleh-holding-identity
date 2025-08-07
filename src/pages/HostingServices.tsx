import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { 
  Server, 
  Globe, 
  Shield, 
  Zap, 
  CheckCircle, 
  Monitor,
  Database,
  Cloud,
  Settings,
  Lock
} from "lucide-react";

const hostingServices = [
  {
    id: "domain-registration",
    title: "حجز النطاقات",
    description: "خدمة حجز النطاقات العالمية المميزة مع أفضل الأسعار والدعم الفني المتميز",
    icon: Globe,
    features: [
      "حجز النطاقات العالمية",
      "أسعار تنافسية",
      "دعم فني 24/7",
      "إدارة سهلة للنطاقات"
    ],
    image: "https://share.net.sa/storage/uploads/services/IMG_26820_415130110_1711403076.png"
  },
  {
    id: "saudi-hosting",
    title: "استضافة المواقع السعودية",
    description: "حلول استضافة مواقع متقدمة في المملكة العربية السعودية بأعلى معايير الأمان والسرعة",
    icon: Server,
    features: [
      "خوادم محلية في السعودية",
      "سرعة تحميل فائقة",
      "حماية متقدمة",
      "نسخ احتياطية يومية"
    ],
    image: "https://share.net.sa/storage/uploads/services/IMG_29215_569019812_1711403103.png"
  },
  {
    id: "server-management",
    title: "إدارة الخوادم",
    description: "خدمات إدارة الخوادم الاحترافية لضمان استقرار وأمان البنية التحتية لعملك الرقمي",
    icon: Monitor,
    features: [
      "مراقبة الخوادم 24/7",
      "صيانة وتحديثات دورية",
      "تحسين الأداء",
      "دعم فني متخصص"
    ],
    image: "https://share.net.sa/storage/uploads/services/IMG_95840_439732808_1711403127.png"
  },
  {
    id: "saudi-domains",
    title: "حجز النطاقات السعودية",
    description: "تخصص في حجز وإدارة النطاقات السعودية .SA التابعة للجهات الحكومية",
    icon: Shield,
    features: [
      "نطاقات .SA رسمية",
      "إجراءات معتمدة حكومياً",
      "موثوقية عالية",
      "دعم محلي متخصص"
    ],
    image: "https://share.net.sa/storage/uploads/services/IMG_56404_339153262_1645459138.png"
  },
  {
    id: "web-hosting",
    title: "استضافة المواقع",
    description: "حلول استضافة شاملة للمواقع الإلكترونية مع خوادم متقدمة وأداء استثنائي",
    icon: Cloud,
    features: [
      "استضافة مشتركة ومخصصة",
      "شهادات SSL مجانية",
      "لوحة تحكم سهلة",
      "دعم جميع التقنيات"
    ],
    image: "https://share.net.sa/storage/uploads/services/IMG_75491_860598184_1645459825.png"
  }
];

const features = [
  {
    icon: Zap,
    title: "أداء سريع",
    description: "خوادم عالية الأداء تضمن سرعة تحميل فائقة"
  },
  {
    icon: Shield,
    title: "أمان متقدم", 
    description: "حماية شاملة ضد التهديدات الإلكترونية"
  },
  {
    icon: Settings,
    title: "إدارة سهلة",
    description: "لوحات تحكم بديهية لإدارة الخدمات بسهولة"
  },
  {
    icon: Lock,
    title: "نسخ احتياطية",
    description: "نسخ احتياطية يومية وأسبوعية لحماية بياناتك"
  }
];

export default function HostingServices() {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    navigate(`/hosting/${serviceId}`);
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <PageHeader 
        title="الاستضافات و الخوادم"
        description="نقدم أحدث خدمات تكنولوجيا المعلومات لعملائنا بأعلى معايير الجودة والأمان"
      >
        <BackButton className="absolute top-4 right-4" />
      </PageHeader>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              استمتع بخدمات استضافة المواقع وحجز النطاقات مع مجموعة علي الشهري! 
              نحن نقدم مجموعة متنوعة من الخوادم التي تلبي احتياجات عالم الإنترنت بشكل شامل. 
              يمكنك الاختيار بين خوادم تعمل بأنظمة التشغيل ويندوز ولينكس والتمتع بأفضل الأداء والموثوقية.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">لماذا تختار خدماتنا؟</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">خدماتنا</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hostingServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-t-lg flex items-center justify-center">
                    <Icon className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-success ml-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      اطلب الخدمة
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">هل تحتاج استشارة مخصصة؟</h3>
          <p className="text-lg mb-6 opacity-90">
            فريق الخبراء لدينا جاهز لمساعدتك في اختيار الحل الأمثل لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleContactUs}
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              تواصل معنا الآن
            </Button>
            <Button 
              onClick={() => navigate("/book-consultation")}
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              احجز استشارة مجانية
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}