import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Zap, Gift, ArrowRight, Timer, CheckCircle, Phone } from "lucide-react";

const currentOffers = [
  {
    id: 1,
    title: "باقة المواقع الكاملة",
    description: "موقع إلكتروني احترافي مع لوحة تحكم ونظام إدارة محتوى متكامل",
    originalPrice: "15,000",
    currentPrice: "9,999",
    discount: "35%",
    timeLeft: "15 يوم",
    features: [
      "تصميم مخصص احترافي",
      "استضافة مجانية لسنة كاملة", 
      "دعم فني 24/7",
      "تحسين محركات البحث SEO",
      "إدارة ومتابعة لمدة 6 شهور",
      "دعم فني شامل"
    ],
    badge: "الأكثر طلباً",
    icon: Zap,
    color: "from-blue-500 to-purple-600",
    bgGradient: "from-blue-50 to-purple-50"
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي",
    description: "خطة تسويقية شاملة لوسائل التواصل الاجتماعي مع إدارة احترافية",
    originalPrice: "8,000",
    currentPrice: "5,999",
    discount: "25%",
    timeLeft: "10 أيام",
    features: [
      "إدارة 5 منصات اجتماعية",
      "محتوى إبداعي شهري",
      "تقارير أداء تفصيلية",
      "استشارة تسويقية مجانية",
      "إدارة ومتابعة لمدة 6 شهور",
      "دعم فني متواصل"
    ],
    badge: "عرض محدود",
    icon: Star,
    color: "from-pink-500 to-red-600",
    bgGradient: "from-pink-50 to-red-50"
  },
  {
    id: 3,
    title: "متجر إلكتروني متكامل",
    description: "متجر إلكتروني بأحدث التقنيات وأنظمة الدفع المتطورة",
    originalPrice: "25,000",
    currentPrice: "18,999",
    discount: "24%",
    timeLeft: "20 يوم",
    features: [
      "تطبيق جوال iOS & Android",
      "أنظمة دفع متعددة آمنة",
      "إدارة مخزون ذكية",
      "تقارير مبيعات متقدمة",
      "إدارة ومتابعة لمدة 6 شهور",
      "دعم فني كامل"
    ],
    badge: "جديد",
    icon: Gift,
    color: "from-green-500 to-teal-600",
    bgGradient: "from-green-50 to-teal-50"
  }
];

const CurrentOffersSection = () => {
  const whatsappNumber = "966555812567";
  
  const openWhatsApp = (offerTitle: string, price: string) => {
    const message = `مرحباً، أريد الاستفسار عن عرض ${offerTitle} بسعر ${price} ر.س مع الإدارة والمتابعة لمدة 6 شهور`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse">
              <Timer className="w-8 h-8 text-white" />
            </div>
            <Badge variant="destructive" className="text-lg px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 animate-bounce">
              عروض محدودة الوقت ⏰
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            العروض الحالية
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            استفد من عروضنا الحصرية المحدودة واحصل على أفضل الخدمات التقنية بأسعار لا تُقاوم مع ضمان الجودة والدعم الشامل
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
          {currentOffers.map((offer) => {
            const IconComponent = offer.icon;
            return (
              <Card key={offer.id} className="relative overflow-hidden group hover:scale-105 hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/50 bg-white/95 backdrop-blur-sm">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-0`} />
                
                {/* Floating Badge */}
                <div className="absolute -top-2 -right-2 z-20">
                  <div className="relative">
                    <Badge className={`bg-gradient-to-r ${offer.color} text-white px-4 py-2 text-sm font-bold shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                      {offer.badge}
                    </Badge>
                  </div>
                </div>

                {/* Time Left Indicator */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center gap-2 bg-red-500/90 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span>متبقي {offer.timeLeft}</span>
                  </div>
                </div>

                <CardHeader className="pt-20 pb-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${offer.color} cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg relative z-20`}
                      onClick={() => openWhatsApp(offer.title, offer.currentPrice)}
                      title="تواصل عبر الواتساب"
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 relative z-10">
                      <CardTitle className="text-2xl mb-2 text-right text-foreground group-hover:text-foreground">{offer.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-muted-foreground">
                        {offer.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  {/* Pricing Section */}
                  <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 relative overflow-hidden border border-gray-200/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          {offer.currentPrice} ر.س
                        </span>
                        <Badge variant="destructive" className="text-lg px-3 py-1 animate-bounce">
                          خصم {offer.discount}
                        </Badge>
                      </div>
                      <span className="text-xl text-muted-foreground line-through font-medium">
                        بدلاً من {offer.originalPrice} ر.س
                      </span>
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        وفر {parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg text-center mb-4 text-primary">✨ مميزات العرض</h4>
                    {offer.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 pt-4">
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`مرحباً، أريد الحصول على عرض ${offer.title} بسعر ${offer.currentPrice} ر.س مع جميع المميزات المذكورة`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block"
                    >
                      <Button 
                        className={`w-full group/btn bg-gradient-to-r ${offer.color} hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6`}
                        size="lg"
                      >
                        <Phone className="w-5 h-5 ml-2" />
                        احصل على العرض الآن
                        <ArrowRight className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                    
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`أريد تفاصيل أكثر عن عرض ${offer.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full hover:bg-gray-50 transition-all duration-300"
                        size="lg"
                      >
                        استفسار سريع
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <h3 className="text-3xl font-bold mb-4">⚡ العروض تنتهي قريباً!</h3>
          <p className="text-xl mb-6 opacity-90">
            لا تفوت الفرصة - احجز عرضك الآن واحصل على خصومات حصرية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن جميع العروض الحالية المتاحة')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5 ml-2" />
                عرض جميع العروض
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </a>
            <div className="text-sm opacity-75">
              أو اتصل الآن: {whatsappNumber.replace('966', '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentOffersSection;