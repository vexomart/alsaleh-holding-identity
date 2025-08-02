import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Zap, Gift, ArrowRight, Timer } from "lucide-react";

const currentOffers = [
  {
    id: 1,
    title: "باقة المواقع الكاملة",
    description: "موقع إلكتروني احترافي مع لوحة تحكم ونظام إدارة محتوى",
    originalPrice: "15,000",
    currentPrice: "9,999",
    discount: "35%",
    timeLeft: "15 يوم",
    features: ["تصميم مخصص", "استضافة مجانية لسنة", "دعم فني 24/7", "تحسين محركات البحث", "إدارة ومتابعة لمدة 6 شهور", "دعم فني شامل"],
    badge: "الأكثر طلباً",
    icon: Zap,
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي",
    description: "خطة تسويقية شاملة لوسائل التواصل الاجتماعي",
    originalPrice: "8,000",
    currentPrice: "5,999",
    discount: "25%",
    timeLeft: "10 أيام",
    features: ["إدارة 5 منصات", "محتوى شهري", "تقارير أداء", "استشارة مجانية", "إدارة ومتابعة لمدة 6 شهور", "دعم فني متواصل"],
    badge: "عرض محدود",
    icon: Star,
    color: "from-pink-500 to-red-600"
  },
  {
    id: 3,
    title: "متجر إلكتروني متكامل",
    description: "متجر إلكتروني بأحدث التقنيات وأنظمة الدفع",
    originalPrice: "25,000",
    currentPrice: "18,999",
    discount: "24%",
    timeLeft: "20 يوم",
    features: ["تطبيق جوال", "أنظمة دفع متعددة", "إدارة مخزون", "تقارير مبيعات", "إدارة ومتابعة لمدة 6 شهور", "دعم فني كامل"],
    badge: "جديد",
    icon: Gift,
    color: "from-green-500 to-teal-600"
  }
];

const CurrentOffersSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-8 h-8 text-primary animate-pulse" />
            <Badge variant="secondary" className="text-lg px-4 py-2">
              عروض محدودة الوقت
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            العروض الحالية
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            استفد من عروضنا الحصرية واحصل على أفضل الخدمات بأسعار مميزة
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentOffers.map((offer) => {
            const IconComponent = offer.icon;
            return (
              <Card key={offer.id} className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {offer.badge}
                  </Badge>
                </div>

                {/* Time Left */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    <Clock className="w-3 h-3" />
                    {offer.timeLeft}
                  </div>
                </div>

                <CardHeader className="pt-16">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${offer.color} cursor-pointer hover:scale-110 transition-transform`}
                      onClick={(e) => {
                        e.preventDefault();
                        const message = "مرحباً، أريد الاستفسار عن عروضكم الحالية والحصول على تفاصيل أكثر";
                        const phoneNumber = "966555812567";
                        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      title="تواصل عبر الواتساب"
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{offer.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {offer.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">
                        {offer.currentPrice} ر.س
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        -{offer.discount}
                      </Badge>
                    </div>
                    <span className="text-lg text-muted-foreground line-through">
                      {offer.originalPrice} ر.س
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {offer.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className="w-full group/btn" 
                    size="lg"
                    type="button"
                    onClick={() => {
                      try {
                        const message = "مرحباً، أريد الاستفسار عن العروض الحالية";
                        const url = `https://wa.me/966555812567?text=${encodeURIComponent(message)}`;
                        window.location.href = url;
                      } catch (error) {
                        console.error('خطأ في فتح الواتساب:', error);
                        alert('حدث خطأ، يرجى المحاولة مرة أخرى');
                      }
                    }}
                  >
                    احصل على العرض الآن
                    <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            العروض محدودة الوقت - لا تفوت الفرصة!
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8"
            onClick={() => {
              const offersSection = document.getElementById('offers');
              offersSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            عرض جميع العروض
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CurrentOffersSection;