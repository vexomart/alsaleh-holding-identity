import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { 
  Server, 
  CheckCircle, 
  Shield, 
  Zap, 
  HeadphonesIcon,
  HardDrive,
  Wifi,
  Clock,
  Users,
  Award
} from "lucide-react";

const hostingPlans = [
  {
    name: "الباقة الأساسية",
    price: "99 ريال",
    period: "/شهرياً",
    description: "مثالية للمواقع الشخصية والمتاجر الصغيرة",
    features: [
      "10 جيجا مساحة تخزين SSD",
      "باندوث غير محدود",
      "5 حسابات بريد إلكتروني",
      "شهادة SSL مجانية",
      "نسخة احتياطية أسبوعية",
      "دعم فني 24/7"
    ],
    popular: false
  },
  {
    name: "الباقة المتقدمة",
    price: "199 ريال",
    period: "/شهرياً",
    description: "للشركات الصغيرة والمتوسطة",
    features: [
      "50 جيجا مساحة تخزين SSD",
      "باندوث غير محدود",
      "25 حساب بريد إلكتروني",
      "شهادة SSL مجانية",
      "نسخة احتياطية يومية",
      "دعم فني مخصص",
      "إحصائيات متقدمة",
      "حماية من DDoS"
    ],
    popular: true
  },
  {
    name: "الباقة الاحترافية",
    price: "399 ريال",
    period: "/شهرياً",
    description: "للشركات الكبيرة والمواقع عالية الترافيك",
    features: [
      "200 جيجا مساحة تخزين SSD",
      "باندوث غير محدود",
      "حسابات بريد غير محدودة",
      "شهادة SSL متقدمة",
      "نسخة احتياطية يومية + أسبوعية",
      "دعم فني أولوية عالية",
      "CDN مجاني",
      "حماية متقدمة من الهجمات",
      "موارد مخصصة"
    ],
    popular: false
  }
];

const features = [
  {
    icon: Zap,
    title: "سرعة فائقة",
    description: "خوادم SSD عالية الأداء في المملكة"
  },
  {
    icon: Shield,
    title: "أمان متقدم",
    description: "حماية شاملة ضد جميع التهديدات"
  },
  {
    icon: HeadphonesIcon,
    title: "دعم محلي",
    description: "فريق دعم سعودي متخصص 24/7"
  },
  {
    icon: Award,
    title: "جودة معتمدة",
    description: "شهادات جودة دولية ومحلية"
  }
];

export default function SaudiHosting() {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate("/contact");
  };

  const handleBookConsultation = () => {
    navigate("/book-consultation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <PageHeader 
        title="استضافة المواقع السعودية"
        description="حلول استضافة مواقع متقدمة في المملكة العربية السعودية بأعلى معايير الأمان والسرعة"
      >
        <BackButton className="absolute top-4 right-4" />
      </PageHeader>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              في عالم يتسارع فيه التقدم التكنولوجي، تبرز الحاجة الماسة للشركات والمؤسسات في المملكة العربية السعودية 
              إلى حلول استضافة مواقع محلية موثوقة وعالية الجودة. مجموعة علي الشهري تقدم خدمات استضافة مواقع سعودية 
              متطورة تلبي احتياجات السوق المحلي وتواكب أحدث التطورات التقنية العالمية.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">مميزات استضافتنا السعودية</h2>
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

        {/* Hosting Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">باقات الاستضافة</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {hostingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative ${
                  plan.popular ? 'border-primary border-2 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      الأكثر شعبية
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {plan.price}
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-success ml-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    اختر هذه الباقة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">المواصفات التقنية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Server className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">البنية التحتية</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>خوادم Dell PowerEdge</li>
                    <li>معالجات Intel Xeon</li>
                    <li>ذاكرة DDR4 ECC</li>
                  </ul>
                </div>
                <div className="text-center">
                  <HardDrive className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">التخزين</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>أقراص SSD NVMe</li>
                    <li>RAID 10 للحماية</li>
                    <li>نسخ احتياطية متعددة</li>
                  </ul>
                </div>
                <div className="text-center">
                  <Wifi className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">الشبكة</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>شبكة 1 Gbps</li>
                    <li>CDN عالمي</li>
                    <li>حماية DDoS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">ابدأ موقعك اليوم</h3>
          <p className="text-lg mb-6 opacity-90">
            احصل على استضافة موثوقة وسريعة في المملكة العربية السعودية
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
              onClick={handleBookConsultation}
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