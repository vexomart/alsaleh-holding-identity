import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Star, Clock, ArrowRight, Code, Palette, Megaphone, Smartphone, Globe, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const CurrentOffers = () => {
  const [showForm, setShowForm] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");

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
      },
      {
        id: 6,
        title: "تصميم مواد تسويقية",
        originalPrice: "5,000",
        discountedPrice: "3,250",
        discount: "35%",
        description: "تصميم شامل للمواد التسويقية والإعلانية",
        features: ["بروشورات", "منشورات وسائل التواصل", "لافتات إعلانية", "كتالوجات", "عروض تقديمية"],
        timeLeft: "25 يوم",
        isPopular: false,
        category: "design",
        icon: "📱"
      }
    ],
    marketing: [
      {
        id: 7,
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
      },
      {
        id: 8,
        title: "تحسين محركات البحث SEO",
        originalPrice: "6,000",
        discountedPrice: "4,200",
        discount: "30%",
        description: "تحسين موقعك ليظهر في أول نتائج البحث",
        features: ["تحليل الكلمات المفتاحية", "تحسين المحتوى", "بناء الروابط", "تقارير مفصلة", "متابعة شهرية"],
        timeLeft: "25 يوم",
        isPopular: false,
        category: "marketing",
        icon: "🔍"
      },
      {
        id: 9,
        title: "إدارة وسائل التواصل الاجتماعي",
        originalPrice: "4,000",
        discountedPrice: "2,800",
        discount: "30%",
        description: "إدارة احترافية لحساباتك على منصات التواصل",
        features: ["محتوى يومي", "تفاعل مع الجمهور", "إعلانات مدفوعة", "تحليل الأداء", "تقارير شهرية"],
        timeLeft: "30 يوم",
        isPopular: false,
        category: "marketing",
        icon: "📱"
      }
    ],
    applications: [
      {
        id: 10,
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
      },
      {
        id: 11,
        title: "تطبيق إدارة أعمال",
        originalPrice: "20,000",
        discountedPrice: "12,000",
        discount: "40%",
        description: "تطبيق شامل لإدارة العمليات التجارية",
        features: ["إدارة العملاء", "تتبع المبيعات", "تقارير مالية", "نظام مخزون", "فواتير إلكترونية"],
        timeLeft: "14 يوم",
        isPopular: false,
        category: "applications",
        icon: "💼"
      },
      {
        id: 12,
        title: "تطبيق متجر إلكتروني",
        originalPrice: "25,000",
        discountedPrice: "13,750",
        discount: "45%",
        description: "تطبيق متجر إلكتروني متكامل للجوال",
        features: ["كتالوج منتجات", "سلة مشتريات", "دفع آمن", "تتبع الطلبات", "إشعارات العروض"],
        timeLeft: "16 يوم",
        isPopular: true,
        category: "applications",
        icon: "🛍️"
      }
    ],
    hosting: [
      {
        id: 13,
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
      },
      {
        id: 14,
        title: "خدمة بريد إلكتروني احترافي",
        originalPrice: "800",
        discountedPrice: "560",
        discount: "30%",
        description: "بريد إلكتروني باسم نطاقك مع مساحة تخزين كبيرة",
        features: ["50 حساب بريد", "مساحة 100GB", "حماية من البريد المزعج", "واجهة ويب حديثة", "تزامن مع الجوال"],
        timeLeft: "22 يوم",
        isPopular: false,
        category: "hosting",
        icon: "📧"
      },
      {
        id: 15,
        title: "خادم افتراضي خاص VPS",
        originalPrice: "3,600",
        discountedPrice: "2,520",
        discount: "30%",
        description: "خادم افتراضي بموارد مخصصة لأداء عالي",
        features: ["4 أنوية معالج", "8GB ذاكرة RAM", "200GB تخزين SSD", "عرض نقل 5TB", "إدارة كاملة"],
        timeLeft: "28 يوم",
        isPopular: false,
        category: "hosting",
        icon: "🖥️"
      }
    ]
  };

  const allOffers = [...offers.development, ...offers.design, ...offers.marketing, ...offers.applications, ...offers.hosting];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'development': return <Code className="w-6 h-6" />;
      case 'design': return <Palette className="w-6 h-6" />;
      case 'marketing': return <Megaphone className="w-6 h-6" />;
      case 'applications': return <Smartphone className="w-6 h-6" />;
      case 'hosting': return <Globe className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'development': return 'البرمجة والتطوير';
      case 'design': return 'التصميم';
      case 'marketing': return 'التسويق';
      case 'applications': return 'التطبيقات';
      case 'hosting': return 'النطاقات والاستضافة';
      default: return 'جميع العروض';
    }
  };

  const getCategoryOffers = (category: string) => {
    switch (category) {
      case 'development': return offers.development;
      case 'design': return offers.design;
      case 'marketing': return offers.marketing;
      case 'applications': return offers.applications;
      case 'hosting': return offers.hosting;
      default: return allOffers;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-6 py-2 mb-6">
            <Gift className="w-5 h-5 text-orange-600" />
            <span className="text-orange-600 font-medium">عروض محدودة الوقت</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
            عروضنا الحالية المميزة
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بأسعار استثنائية
          </p>
        </div>

        {/* Categories Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8 h-auto p-1">
            <TabsTrigger value="all" className="text-sm flex items-center gap-2 py-3">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">جميع العروض</span>
              <span className="sm:hidden">الكل</span>
            </TabsTrigger>
            <TabsTrigger value="development" className="text-sm flex items-center gap-2 py-3">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">البرمجة</span>
              <span className="sm:hidden">برمجة</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="text-sm flex items-center gap-2 py-3">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">التصميم</span>
              <span className="sm:hidden">تصميم</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-sm flex items-center gap-2 py-3">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">التسويق</span>
              <span className="sm:hidden">تسويق</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-sm flex items-center gap-2 py-3">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">التطبيقات</span>
              <span className="sm:hidden">تطبيقات</span>
            </TabsTrigger>
            <TabsTrigger value="hosting" className="text-sm flex items-center gap-2 py-3">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">الاستضافة</span>
              <span className="sm:hidden">استضافة</span>
            </TabsTrigger>
          </TabsList>

          {/* All Offers Tab */}
          <TabsContent value="all">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Gift className="w-8 h-8 text-orange-600" />
                جميع العروض الحالية
              </h2>
              <p className="text-muted-foreground text-lg">
                استعرض جميع عروضنا المميزة بخصومات تصل إلى 50%
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} setShowForm={setShowForm} />
              ))}
            </div>
          </TabsContent>

          {/* Category-specific Tabs */}
          {Object.entries(offers).map(([category, categoryOffers]) => (
            <TabsContent key={category} value={category}>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryIcon(category)}
                  <h2 className="text-3xl font-bold">{getCategoryName(category)}</h2>
                </div>
                <p className="text-muted-foreground text-lg mb-6">
                  اكتشف عروضنا المميزة في {getCategoryName(category)} بخصومات تصل إلى 50%
                </p>
                
                {/* Category Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-bold text-blue-800">جودة عالية</div>
                      <div className="text-sm text-blue-600">معايير احترافية</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="font-bold text-green-800">تسليم سريع</div>
                      <div className="text-sm text-green-600">في الوقت المحدد</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <Gift className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="font-bold text-orange-800">أسعار مميزة</div>
                      <div className="text-sm text-orange-600">عروض حصرية</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} setShowForm={setShowForm} />
                ))}
              </div>
              
              {/* View More Button */}
              <div className="text-center mt-12">
                <Link to="/professional-services">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    <span className="ml-2">استعرض جميع خدمات {getCategoryName(category)}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16 mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
            <h3 className="text-2xl font-bold mb-4 text-orange-800">لم تجد ما تبحث عنه؟</h3>
            <p className="text-orange-600 mb-6">
              تحدث معنا مباشرة وسنقوم بتصميم عرض خاص يناسب احتياجاتك
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                تواصل معنا الآن
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const OfferCard = ({ offer, setShowForm }: { offer: any; setShowForm: (show: boolean) => void }) => (
  <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200">
    {offer.isPopular && (
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
          <Star className="w-4 h-4 mr-1" />
          الأكثر طلباً
        </Badge>
      </div>
    )}
    
    <div className="absolute top-4 left-4 z-10">
      <Badge variant="destructive" className="bg-red-500 text-white animate-pulse font-bold">
        خصم {offer.discount}
      </Badge>
    </div>

    <CardHeader className="relative pb-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      
      <div className="relative flex items-center gap-3 mb-4">
        <div className="text-3xl">{offer.icon}</div>
        <div>
          <CardTitle className="text-xl leading-tight">{offer.title}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-600 font-medium">متبقي {offer.timeLeft}</span>
          </div>
        </div>
      </div>
      
      <div className="relative mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-green-600">{offer.discountedPrice} ريال</span>
          <span className="text-lg text-gray-500 line-through">{offer.originalPrice} ريال</span>
        </div>
        <div className="text-sm text-green-600 font-medium mt-1">
          توفير {parseInt(offer.originalPrice.replace(/,/g, '')) - parseInt(offer.discountedPrice.replace(/,/g, ''))} ريال
        </div>
      </div>
      
      <p className="relative text-muted-foreground text-sm leading-relaxed">{offer.description}</p>
    </CardHeader>

    <CardContent className="pt-0">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-3 text-gray-800">ما يشمله العرض:</h4>
          <ul className="space-y-2">
            {offer.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link to="/contact">
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            اطلب العرض الآن
            <ArrowRight className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default CurrentOffers;