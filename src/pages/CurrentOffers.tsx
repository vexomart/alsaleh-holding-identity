import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  MessageCircle, 
  Star,
  Gift,
  Sparkles,
  Target,
  Phone
} from "lucide-react";

const currentOffers = [
  {
    id: 1,
    title: "عرض الموقع الاحترافي الكامل",
    description: "تصميم وتطوير موقع إلكتروني احترافي متكامل مع لوحة تحكم إدارية",
    originalPrice: "15000",
    currentPrice: "8500",
    discount: "43%",
    timeLeft: "14 يوم",
    features: [
      "تصميم مخصص وفريد",
      "استضافة مجانية لسنة كاملة",
      "شهادة SSL مجانية",
      "دعم فني 24/7",
      "تحسين محركات البحث SEO",
      "نظام إدارة المحتوى",
      "تصميم متجاوب للجوال",
      "ربط وسائل التواصل الاجتماعي"
    ],
    badge: "الأكثر طلباً",
    icon: Zap,
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-indigo-50"
  },
  {
    id: 2,
    title: "باقة التسويق الرقمي المتكاملة",
    description: "خطة تسويق رقمي شاملة لزيادة المبيعات والوصول للعملاء المستهدفين",
    originalPrice: "12000",
    currentPrice: "7200",
    discount: "40%",
    timeLeft: "21 يوم",
    features: [
      "استراتيجية تسويق مخصصة",
      "إدارة حسابات التواصل الاجتماعي",
      "حملات إعلانية مدفوعة",
      "تحليل وتقارير مفصلة",
      "تصميم محتوى إبداعي",
      "استهداف دقيق للجمهور",
      "تحسين معدل التحويل",
      "دعم واستشارة مستمرة"
    ],
    badge: "عرض محدود",
    icon: Target,
    color: "text-green-600",
    bgGradient: "from-green-50 to-emerald-50"
  },
  {
    id: 3,
    title: "حزمة الهوية البصرية الشاملة",
    description: "تصميم هوية بصرية متكاملة تعكس قيم وشخصية علامتك التجارية",
    originalPrice: "8000",
    currentPrice: "4800",
    discount: "40%",
    timeLeft: "10 أيام",
    features: [
      "تصميم الشعار الاحترافي",
      "دليل الهوية البصرية",
      "تصميم البطاقات التجارية",
      "تصميم الخطابات الرسمية",
      "قوالب وسائل التواصل",
      "تصميم اللافتات والإعلانات",
      "ملفات بجودة عالية",
      "حقوق الملكية الكاملة"
    ],
    badge: "توفير 40%",
    icon: Sparkles,
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-violet-50"
  }
];

const CurrentOffers = () => {
  const whatsappNumber = "966555812567";

  const openWhatsApp = (offerTitle: string, price: string, originalPrice: string, discount: string, timeLeft: string, features: string[]) => {
    const featuresList = features.join('\n• ');
    const message = `🎯 مرحباً، أريد الاستفسار عن العرض التالي:

📋 العرض: ${offerTitle}
💰 السعر الحالي: ${price} ريال (بدلاً من ${originalPrice} ريال)
🏷️ نسبة الخصم: ${discount}
⏰ الوقت المتبقي: ${timeLeft}

✅ المميزات المشمولة:
• ${featuresList}

🤝 أرغب في معرفة المزيد من التفاصيل والبدء في هذا العرض.

شكراً لكم! 🌟`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 pb-16">
      {/* Header Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full mb-4">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">عروض لفترة محدودة</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            العروض الحالية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اغتنم الفرصة واحصل على أفضل خدماتنا بأسعار مميزة لفترة محدودة
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentOffers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <Card 
                key={offer.id} 
                className={`relative overflow-hidden bg-gradient-to-br ${offer.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white px-3 py-1 text-xs font-bold">
                    {offer.badge}
                  </Badge>
                </div>

                {/* Time Left Indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>متبقي {offer.timeLeft}</span>
                  </div>
                </div>

                <CardHeader className="text-center pt-16 pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-white/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${offer.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {offer.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {offer.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900">{offer.currentPrice} ريال</span>
                      <Badge variant="destructive" className="text-xs">
                        خصم {offer.discount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg text-gray-500 line-through">{offer.originalPrice} ريال</span>
                      <span className="text-green-600 font-semibold text-sm">
                        وفر {parseInt(offer.originalPrice) - parseInt(offer.currentPrice)} ريال
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">ما يشمله العرض:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 text-sm"
                      onClick={() => openWhatsApp(offer.title, offer.currentPrice, offer.originalPrice, offer.discount, offer.timeLeft, offer.features)}
                    >
                      <Gift className="w-4 h-4 ml-2" />
                      احصل على العرض الآن
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 text-sm"
                      onClick={() => openWhatsApp(offer.title, offer.currentPrice, offer.originalPrice, offer.discount, offer.timeLeft, offer.features)}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      استفسار سريع
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Premium CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold">عرض مخصص لك</span>
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              هل تحتاج عرض مخصص لمشروعك؟
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              تواصل معنا الآن واحصل على استشارة مجانية وعرض سعر مخصص يناسب احتياجاتك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أريد الحصول على عرض مخصص لمشروعي')}`, '_blank')}
              >
                <MessageCircle className="w-5 h-5 ml-2" />
                احصل على عرض مخصص
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3"
                asChild
              >
                <a href={`tel:+${whatsappNumber}`}>
                  <Phone className="w-5 h-5 ml-2" />
                  اتصل بنا الآن
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentOffers;