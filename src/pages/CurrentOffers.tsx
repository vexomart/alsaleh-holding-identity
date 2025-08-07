import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Clock, ArrowLeft, Code, Palette, Megaphone, Smartphone, Globe, Award, CreditCard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PaymentDialog from "@/components/ui/payment-dialog";
import { useState, useEffect } from "react";

const CurrentOffers = () => {
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category');
    if (category) {
      setActiveTab(category);
    }
  }, [location]);

  const offers = {
    development: [
      {
        id: 1,
        title: "تطوير موقع إلكتروني متكامل",
        originalPrice: "15,000",
        discountedPrice: "8,250",
        discount: "45%",
        description: "موقع إلكتروني احترافي مع لوحة تحكم ونظام إدارة محتوى",
        features: ["تصميم متجاوب", "لوحة تحكم", "نظام إدارة محتوى", "تحسين محركات البحث", "استضافة مجانية لسنة"],
        timeLeft: "15 يوم",
        isPopular: true,
        category: "development",
        icon: "🌐"
      },
      {
        id: 2,
        title: "تطوير تطبيق ويب متقدم",
        originalPrice: "25,000",
        discountedPrice: "15,000",
        discount: "40%",
        description: "تطبيق ويب متقدم بتقنيات حديثة وواجهة تفاعلية",
        features: ["React/Vue.js", "قاعدة بيانات", "API متكامل", "حماية متقدمة", "تطبيق إدارة"],
        timeLeft: "12 يوم",
        isPopular: false,
        category: "development",
        icon: "💻"
      },
      {
        id: 3,
        title: "متجر إلكتروني احترافي",
        originalPrice: "20,000",
        discountedPrice: "11,000",
        discount: "45%",
        description: "متجر إلكتروني متكامل مع بوابات دفع متعددة",
        features: ["نظام إدارة المنتجات", "بوابات دفع", "تقارير مبيعات", "لوحة تحكم", "تطبيق جوال"],
        timeLeft: "18 يوم",
        isPopular: true,
        category: "development",
        icon: "🛒"
      }
    ],
    design: [
      {
        id: 4,
        title: "تصميم هوية بصرية متكاملة",
        originalPrice: "8,000",
        discountedPrice: "4,800",
        discount: "40%",
        description: "هوية بصرية شاملة للشركات والمؤسسات",
        features: ["شعار احترافي", "دليل الهوية", "قوالب مطبوعات", "ملفات متعددة الصيغ", "بطاقات تجارية"],
        timeLeft: "20 يوم",
        isPopular: true,
        category: "design",
        icon: "🎨"
      },
      {
        id: 5,
        title: "تصميم موقع إلكتروني UI/UX",
        originalPrice: "12,000",
        discountedPrice: "7,800",
        discount: "35%",
        description: "تصميم واجهات مستخدم احترافية ومتجاوبة",
        features: ["تصميم متجاوب", "تجربة مستخدم محسنة", "نماذج أولية", "دليل التصميم", "أيقونات مخصصة"],
        timeLeft: "18 يوم",
        isPopular: false,
        category: "design",
        icon: "🖌️"
      }
    ],
    marketing: [
      {
        id: 6,
        title: "حملة تسويق رقمي شاملة",
        originalPrice: "10,000",
        discountedPrice: "6,500",
        discount: "35%",
        description: "حملة تسويقية متكاملة عبر منصات التواصل الاجتماعي",
        features: ["إدارة منصات التواصل", "إعلانات مدفوعة", "تحليل النتائج", "تقارير شهرية", "استراتيجية تسويق"],
        timeLeft: "10 يوم",
        isPopular: true,
        category: "marketing",
        icon: "📢"
      }
    ],
    applications: [
      {
        id: 7,
        title: "تطبيق جوال iOS & Android",
        originalPrice: "30,000",
        discountedPrice: "15,000",
        discount: "50%",
        description: "تطبيق جوال احترافي لمنصتي iOS و Android",
        features: ["تصميم أصلي", "متوافق مع المنصتين", "إشعارات push", "ربط مع API", "نشر في المتاجر"],
        timeLeft: "8 يوم",
        isPopular: true,
        category: "applications",
        icon: "📱"
      }
    ],
    hosting: [
      {
        id: 8,
        title: "استضافة مواقع سنوية + دومين",
        originalPrice: "1,200",
        discountedPrice: "840",
        discount: "30%",
        description: "استضافة عالية الأداء مع دومين مجاني لسنة كاملة",
        features: ["مساحة تخزين 50GB", "عرض نقل غير محدود", "شهادة SSL مجانية", "دعم فني 24/7", "نسخ احتياطية"],
        timeLeft: "30 يوم",
        isPopular: true,
        category: "hosting",
        icon: "🌐"
      }
    ]
  };

  const allOffers = [...offers.development, ...offers.design, ...offers.marketing, ...offers.applications, ...offers.hosting];

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]" dir="rtl" style={{ direction: 'rtl', textAlign: 'right', fontFamily: 'Noto Sans Arabic, sans-serif' }}>
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12" style={{ direction: 'rtl', textAlign: 'right' }}>
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12" style={{ textAlign: 'center' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
            <Gift className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
            <span className="text-orange-600 font-medium text-sm sm:text-base">عروض محدودة الوقت</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            عروضنا الحالية المميزة
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
            اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بأسعار استثنائية
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
          <div className="overflow-x-auto mb-6 sm:mb-8">
            <TabsList className="inline-flex h-auto p-1 bg-muted rounded-lg w-full justify-center">
              <div className="flex gap-1 justify-center w-full flex-wrap">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  جميع العروض
                </TabsTrigger>
                <TabsTrigger value="development" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  البرمجة والتطوير
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  التصميم
                </TabsTrigger>
                <TabsTrigger value="marketing" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  التسويق
                </TabsTrigger>
                <TabsTrigger value="applications" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  التطبيقات
                </TabsTrigger>
                <TabsTrigger value="hosting" className="text-xs sm:text-sm px-3 py-2 whitespace-nowrap">
                  الاستضافة
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* All Offers */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl" style={{ direction: 'rtl' }}>
              {allOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </TabsContent>

          {/* Category Offers */}
          {Object.entries(offers).map(([category, categoryOffers]) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl" style={{ direction: 'rtl' }}>
                {categoryOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

const OfferCard = ({ offer }: { offer: any }) => (
  <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col" dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
    {offer.isPopular && (
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <Star className="w-4 h-4 mr-1" />
          الأكثر طلباً
        </Badge>
      </div>
    )}
    
    <div className="absolute top-4 left-4 z-10">
      <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
        خصم {offer.discount}
      </Badge>
    </div>

    <CardHeader className="relative pb-4" style={{ textAlign: 'right' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      
      <div className="relative mb-4" style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right', direction: 'rtl' }}>
        <div className="text-3xl order-1">{offer.icon}</div>
        <div className="flex-1 order-2" style={{ textAlign: 'right' }}>
          <CardTitle className="text-xl mb-2" style={{ textAlign: 'right' }}>{offer.title}</CardTitle>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-orange-600 font-medium">متبقي {offer.timeLeft}</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
        </div>
      </div>
      
      <div className="relative mb-4" style={{ textAlign: 'right' }}>
        <div className="flex items-center gap-3 mb-2 justify-end" style={{ direction: 'rtl' }}>
          <span className="text-lg text-gray-500 line-through order-2">{offer.originalPrice} ريال</span>
          <span className="text-3xl font-bold text-green-600 order-1">{offer.discountedPrice} ريال</span>
        </div>
        <div className="text-sm text-green-600 font-medium" style={{ textAlign: 'right' }}>
          توفير {parseInt(offer.originalPrice.replace(/,/g, '')) - parseInt(offer.discountedPrice.replace(/,/g, ''))} ريال
        </div>
      </div>
      
      <p className="relative text-muted-foreground text-sm" style={{ textAlign: 'right' }}>{offer.description}</p>
    </CardHeader>

    <CardContent className="pt-0 flex-1 flex flex-col" style={{ textAlign: 'right' }}>
      <div className="space-y-4 flex-1">
        <div className="flex-1">
          <h4 className="font-semibold mb-3" style={{ textAlign: 'right' }}>ما يشمله العرض:</h4>
          <ul className="space-y-2">
            {offer.features.map((feature: string, index: number) => (
              <li key={index} className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right', direction: 'rtl' }}>
                <span className="order-2" style={{ textAlign: 'right', flex: 1 }}>{feature}</span>
                <Star className="w-4 h-4 text-green-500 order-1" style={{ flexShrink: 0 }} />
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <PaymentDialog
            offer={offer}
            trigger={
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3" style={{ direction: 'rtl' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CreditCard className="w-4 h-4" />
                  ادفع الآن - {offer.discountedPrice} ريال
                </span>
              </Button>
            }
          />
          
          <Link to="/contact">
            <Button variant="outline" className="w-full" style={{ direction: 'rtl' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ArrowLeft className="w-4 h-4" />
                استفسر عن العرض
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default CurrentOffers;