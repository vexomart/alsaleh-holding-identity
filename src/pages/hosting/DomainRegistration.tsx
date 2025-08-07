import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  CheckCircle, 
  Shield, 
  Zap, 
  HeadphonesIcon,
  Star,
  Search,
  Settings
} from "lucide-react";

const domainExtensions = [
  { extension: ".com", price: "15 ريال", description: "الأكثر شعبية للمواقع التجارية" },
  { extension: ".net", price: "18 ريال", description: "مناسب للشبكات والتقنية" },
  { extension: ".org", price: "20 ريال", description: "للمنظمات غير الربحية" },
  { extension: ".info", price: "12 ريال", description: "للمواقع المعلوماتية" },
  { extension: ".biz", price: "22 ريال", description: "للأعمال التجارية" },
  { extension: ".me", price: "25 ريال", description: "للمواقع الشخصية" }
];

const features = [
  {
    icon: Search,
    title: "بحث سريع",
    description: "بحث فوري عن توفر النطاقات"
  },
  {
    icon: Shield,
    title: "حماية مجانية",
    description: "حماية خصوصية البيانات مجاناً"
  },
  {
    icon: Settings,
    title: "إدارة سهلة",
    description: "لوحة تحكم بديهية لإدارة النطاقات"
  },
  {
    icon: HeadphonesIcon,
    title: "دعم فني",
    description: "دعم فني متخصص 24/7"
  }
];

export default function DomainRegistration() {
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
        title="حجز النطاقات"
        description="خدمة حجز النطاقات العالمية المميزة مع أفضل الأسعار والدعم الفني المتميز"
      >
        <BackButton className="absolute top-4 right-4" />
      </PageHeader>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              تقدم مجموعة علي الشهري خدمة استثنائية في حجز النطاقات العالمية، وهي الخطوة الأولى والأساسية 
              لبناء هوية رقمية قوية لعملك أو مشروعك الشخصي. نحن نفهم أن اختيار النطاق المناسب يمكن أن يؤثر 
              بشكل كبير على نجاح موقعك الإلكتروني ووصولك للجمهور المستهدف.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">مميزات خدمة حجز النطاقات</h2>
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

        {/* Domain Extensions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">امتدادات النطاقات المتاحة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainExtensions.map((domain, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Globe className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl font-bold text-primary">
                      {domain.extension}
                    </CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {domain.price}
                    <span className="text-sm text-muted-foreground">/سنوياً</span>
                  </div>
                  <CardDescription className="text-sm">
                    {domain.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success ml-2" />
                      تجديد تلقائي
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success ml-2" />
                      حماية الخصوصية
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success ml-2" />
                      إدارة DNS مجانية
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-success ml-2" />
                      دعم فني مجاني
                    </li>
                  </ul>
                  <Button className="w-full">
                    احجز الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Benefits */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">لماذا تختار خدمتنا؟</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 ml-2" />
                    سهولة الاستخدام
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• واجهة بسيطة ومفهومة للجميع</li>
                    <li>• عملية حجز سريعة في دقائق معدودة</li>
                    <li>• إرشادات واضحة في كل خطوة</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-blue-500 ml-2" />
                    خدمة احترافية
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• فريق متخصص في إدارة النطاقات</li>
                    <li>• استجابة سريعة للطلبات والاستفسارات</li>
                    <li>• ضمان الجودة والموثوقية</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">جاهز لحجز نطاقك؟</h3>
          <p className="text-lg mb-6 opacity-90">
            ابدأ رحلتك الرقمية اليوم مع أفضل خدمة حجز نطاقات في المملكة
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