import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CountdownTimer } from "@/components/CountdownTimer";
import SEO from "@/components/SEO";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  ArrowRight, 
  Star,
  Gift,
  Sparkles,
  Target,
  MessageCircle,
  Phone,
  Timer,
  Rocket,
  Crown,
  Award,
  CreditCard,
  ShoppingBag,
  Palette,
  TrendingUp,
  Globe,
  Users
} from "lucide-react";

const CurrentOffers = () => {
  const { toast } = useToast();
  
  // تاريخ انتهاء العروض (25 يوم من الآن)  
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 25);

  // دالة للدفع عبر TAB
  const handleTabPayment = async (offer: any) => {
    try {
      // عرض رسالة تحضير الدفع
      toast({
        title: "🚀 جاري تحضير رابط الدفع...",
        description: "سيتم توجيهك فوراً إلى TAB لإتمام الدفع الآمن",
        duration: 2000,
      });

      const amount = parseFloat(offer.currentPrice.replace(/,/g, ''));
      
      const payload = {
        amount: amount,
        currency: 'SAR',
        customer_name: 'عميل مميز',
        customer_email: 'customer@example.com',
        customer_phone: '966500000000',
        offer_title: offer.title,
        description: `دفع عرض: ${offer.title} - ${offer.currentPrice} ريال سعودي`,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
        metadata: {
          offer_id: offer.id,
          original_price: offer.originalPrice,
          current_price: offer.currentPrice,
          discount: offer.discount,
          timestamp: new Date().toISOString()
        }
      };

      const { data, error } = await supabase.functions.invoke('tab-payment', {
        body: payload,
      });

      if (error) {
        throw new Error(error.message || 'فشل في الاتصال بالخدمة');
      }

      if (data?.success && data?.payment_url) {
        toast({
          title: "✅ تم إنشاء رابط الدفع بنجاح",
          description: "سيتم توجيهك الآن إلى TAB لإتمام الدفع الآمن",
          duration: 3000,
        });

        // إرسال بريد إلكتروني فوري بمعلومات الدفع
        try {
          await supabase.functions.invoke('send-invoice-email', {
            body: {
              customer_name: 'عميل مميز',
              customer_email: 'customer@example.com',
              amount: amount,
              currency: 'SAR',
              payment_url: data.payment_url,
              transaction_id: data.transaction_id || 'N/A',
              invoice_number: data.invoice_number || 'N/A',
              status: 'pending',
              payment_method: 'TAB',
              offer_title: offer.title,
              offer_description: offer.description,
              original_price: offer.originalPrice,
              current_price: offer.currentPrice,
              discount: offer.discount
            }
          });
        } catch (emailError) {
          console.warn("تحذير: فشل في إرسال البريد الإلكتروني:", emailError);
        }

        // التحويل الفوري إلى TAB
        setTimeout(() => {
          window.location.href = data.payment_url;
        }, 1000);
        
      } else {
        throw new Error(data?.message || 'لم يتم إنشاء رابط الدفع بشكل صحيح');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "❌ خطأ في عملية الدفع",
        description: error.message || "حدث خطأ أثناء إنشاء عملية الدفع. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

const currentOffers = [
  {
    id: "complete-website",
    offerType: 1,
    title: "عرض الموقع الاحترافي الكامل",
    description: "تصميم وتطوير موقع إلكتروني احترافي متكامل مع لوحة تحكم إدارية وتحسين محركات البحث",
    originalPrice: "15000",
    currentPrice: "50",
    discount: "35%",
    timeLeft: "25 يوم",
    features: [
      "تصميم مخصص وفريد احترافي",
      "استضافة مجانية لسنة كاملة",
      "شهادة SSL مجانية للحماية",
      "دعم فني 24/7 متواصل",
      "تحسين محركات البحث SEO",
      "نظام إدارة المحتوى المتقدم",
      "تصميم متجاوب للجوال والتابلت",
      "ربط وسائل التواصل الاجتماعي"
    ],
    badge: "الأكثر طلباً",
    icon: Globe,
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-600",
    accentColor: "text-blue-500",
    bgPattern: "bg-blue-50",
    category: "تطوير الويب"
  },
  {
    id: "ecommerce-store",
    offerType: 2,
    title: "تصميم متجر إلكتروني متكامل",
    description: "متجر إلكتروني احترافي ومتكامل مع نظام إدارة المنتجات والمبيعات وبوابات الدفع المتعددة",
    originalPrice: "7699",
    currentPrice: "2999",
    discount: "61%",
    timeLeft: "25 يوم",
    features: [
      "تصميم عصري ومتجاوب للمتجر",
      "نظام إدارة المنتجات والمخزون",
      "بوابات دفع متعددة (فيزا، ماستركارد، مدى)",
      "نظام إدارة الطلبات والشحن",
      "لوحة تحكم شاملة للإدارة",
      "تقارير مبيعات تفصيلية",
      "نظام خصومات وكوبونات",
      "تكامل مع وسائل التواصل الاجتماعي",
      "دعم فني مجاني لـ 6 أشهر",
      "تدريب مجاني على النظام"
    ],
    badge: "عرض محدود",
    icon: ShoppingBag,
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-500",
    accentColor: "text-orange-500",
    bgPattern: "bg-orange-50",
    category: "التجارة الإلكترونية"
  },
  {
    id: "seo-services",
    offerType: 3,
    title: "كلمات مفتاحية قوية لموقعك SEO",
    description: "تحليل شامل وإعداد كلمات مفتاحية قوية لتحسين ظهور موقعك في محركات البحث",
    originalPrice: "999",
    currentPrice: "499",
    discount: "50%",
    timeLeft: "25 يوم",
    features: [
      "تحليل شامل للمنافسين",
      "بحث متقدم عن الكلمات المفتاحية",
      "تقرير مفصل بأفضل الكلمات",
      "استراتيجية SEO & SEM متكاملة",
      "تنفيذ من 4-6 أيام",
      "دعم فني لمدة شهر"
    ],
    badge: "متخصص",
    icon: Star,
    gradientFrom: "from-orange-500",
    gradientTo: "to-yellow-600",
    accentColor: "text-orange-500",
    bgPattern: "bg-orange-50",
    category: "SEO والتسويق"
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden" dir="rtl">
      <SEO 
        title="العروض الحالية - خصومات حصرية تصل إلى 61%"
        description="اكتشف أفضل العروض الحصرية على خدماتنا الاحترافية. تصميم مواقع، متاجر إلكترونية، تطبيقات جوال بأسعار مميزة ولفترة محدودة."
      />
      <Navigation />
      
      {/* Customer Service Contact Bar */}
      <div className="fixed top-24 left-4 z-50 group">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 animate-bounce hover:animate-none">
          <a href="tel:0555812567" className="flex items-center gap-2 text-white">
            <Phone className="w-5 h-5 animate-pulse" />
            <span className="hidden group-hover:block whitespace-nowrap bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold absolute right-12 top-1/2 transform -translate-y-1/2 shadow-lg animate-fade-in">
              تواصل مع خدمة العملاء
              <span className="block text-xs">0555812567</span>
            </span>
          </a>
        </div>
      </div>
      
      {/* Enhanced Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-40 w-[28rem] h-[28rem] bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-3xl animate-float-delayed" style={{ animationDelay: '6s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-32 right-1/4 text-blue-500/20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-32 left-1/4 text-purple-500/20 animate-float-delayed" style={{ animationDelay: '3s' }}>
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-1/2 left-16 text-emerald-500/20 animate-float" style={{ animationDelay: '5s' }}>
          <Crown className="w-7 h-7" />
        </div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 rounded-full px-8 py-4 mb-8 border border-orange-200/50 animate-fade-in backdrop-blur-sm">
            <Gift className="w-6 h-6 text-orange-600 animate-bounce" />
            <span className="text-orange-600 font-bold text-lg">عروض حصرية ومحدودة - وفر حتى 61%</span>
            <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-scale-in leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              العروض الحالية
            </span>
            <br />
            <span className="text-foreground">المميزة والحصرية</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            اكتشف مجموعة من أفضل عروضنا الحصرية بأسعار استثنائية ولفترة محدودة. خدمات احترافية بجودة عالية وأسعار لا تُقاوم
          </p>

          {/* Global Countdown Timer */}
          <div className="mb-12 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 rounded-2xl px-8 py-4 shadow-xl border border-red-200 backdrop-blur-sm animate-pulse">
              <div className="text-center">
                <CountdownTimer targetDate={offerEndDate} size="lg" />
              </div>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform animate-pulse" />
              <div className="text-lg font-bold text-green-700 dark:text-green-400 mb-1">خصومات تصل إلى 61%</div>
              <div className="text-sm text-green-600 dark:text-green-300">على جميع الخدمات المميزة</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <Timer className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform animate-bounce" />
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-1">عروض محدودة الوقت</div>
              <div className="text-sm text-blue-600 dark:text-blue-300">أسرع قبل انتهاء المدة</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <Crown className="w-8 h-8 text-purple-500 mx-auto mb-3 group-hover:scale-110 transition-transform animate-pulse" />
              <div className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-1">جودة احترافية مضمونة</div>
              <div className="text-sm text-purple-600 dark:text-purple-300">معايير عالمية معتمدة</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 hover:shadow-xl transition-all duration-300 group hover:scale-105">
              <Award className="w-8 h-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform animate-bounce" />
              <div className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-1">دعم فني متواصل</div>
              <div className="text-sm text-orange-600 dark:text-orange-300">24/7 طوال الأسبوع</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-slate-700/50 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-muted-foreground font-medium">عميل راضٍ</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">1000+</div>
                <div className="text-muted-foreground font-medium">مشروع مكتمل</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-muted-foreground font-medium">دعم فني</div>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="inline-flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="w-5 h-5 text-red-500 animate-pulse" />
              <span>العروض محدودة الوقت</span>
            </div>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>ضمان الجودة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Offers Grid */}
      <section className="relative px-3 sm:px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOffers.map((offer, index) => (
              <Card 
                key={offer.id} 
                className="group relative overflow-hidden border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in hover:scale-105 rounded-2xl"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradientFrom}/20 ${offer.gradientTo}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                {/* Timer and Badge */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                  <CountdownTimer targetDate={offerEndDate} size="sm" />
                  <Badge 
                    className={`bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} text-white shadow-lg animate-bounce text-xs px-3 py-2 transform rotate-1 group-hover:rotate-0 transition-transform`}
                  >
                    {offer.badge}
                  </Badge>
                </div>

                <CardHeader className="relative z-10 p-6 pt-20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${offer.gradientFrom} ${offer.gradientTo} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <offer.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-700 rounded-full px-3 py-1 inline-block mb-2">
                        {offer.category}
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                        {offer.title}
                      </CardTitle>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {offer.description}
                  </p>

                  {/* Pricing Section */}
                  <div className={`bg-gradient-to-r ${offer.gradientFrom}/10 ${offer.gradientTo}/10 rounded-xl p-4 mb-6 border border-white/20 shadow-inner`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {offer.currentPrice}
                          </span>
                          <span className="text-lg text-muted-foreground">ر.س</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg text-muted-foreground line-through">
                            {offer.originalPrice} ر.س
                          </span>
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            خصم {offer.discount}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">وفر</div>
                        <div className="text-xl font-bold text-green-600">
                          {(parseFloat(offer.originalPrice.replace(/,/g, '')) - parseFloat(offer.currentPrice.replace(/,/g, ''))).toLocaleString()} ر.س
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      ما يشمله العرض:
                    </h4>
                    <div className="space-y-2">
                      {offer.features.slice(0, 5).map((feature, featureIndex) => (
                        <div 
                          key={featureIndex} 
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${(index * 0.2) + (featureIndex * 0.1)}s` }}
                        >
                          <div className={`w-2 h-2 bg-gradient-to-r ${offer.gradientFrom} ${offer.gradientTo} rounded-full flex-shrink-0 mt-2`}></div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      {offer.features.length > 5 && (
                        <div className="text-sm text-muted-foreground text-center mt-3 opacity-70 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg py-2">
                          +{offer.features.length - 5} مميزة إضافية
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                 <CardContent className="relative z-10 p-6 pt-0">
                  {/* زر الدفع الوحيد */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleTabPayment(offer)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group border-0 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        <CreditCard className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-bold">ادفع الآن</span>
                        <Sparkles className="w-5 h-5 animate-pulse group-hover:animate-spin transition-all duration-300" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* شهادات العملاء والإحصائيات المحسنة */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          
          {/* إحصائيات مفصلة */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              أرقام تتحدث عن نجاحنا
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              إحصائيات حقيقية تعكس ثقة عملائنا وجودة خدماتنا
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in">
            {[
              { icon: Users, value: "500+", label: "عميل راضٍ", gradient: "from-blue-500 to-cyan-500", description: "عميل يثق بخدماتنا" },
              { icon: Award, value: "1200+", label: "مشروع مكتمل", gradient: "from-green-500 to-emerald-500", description: "مشروع ناجح ومميز" },
              { icon: Target, value: "95%", label: "معدل الرضا", gradient: "from-purple-500 to-pink-500", description: "نسبة رضا العملاء" },
              { icon: Rocket, value: "24/7", label: "دعم فني", gradient: "from-orange-500 to-red-500", description: "دعم متواصل دون انقطاع" }
            ].map((stat, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-gradient-to-br from-white/70 to-muted/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2 text-foreground group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-lg font-medium mb-1 text-foreground">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* شهادات العملاء */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              ما يقوله عملاؤنا الكرام
            </h2>
            <p className="text-xl text-muted-foreground">
              آراء حقيقية وتجارب ملهمة من عملائنا الذين حققوا النجاح معنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {[
              {
                name: "أحمد محمد العلي",
                company: "شركة الإبداع التقني",
                text: "تجربة رائعة مع الفريق! حصلنا على موقع احترافي بتصميم عصري وأداء ممتاز. الدعم الفني سريع ومتاح دائماً. أنصح بشدة بالتعامل معهم.",
                rating: 5,
                avatar: "/lovable-uploads/58f1dde7-91b4-4747-92a6-188055f11cee.png",
                project: "موقع إلكتروني احترافي",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                name: "فاطمة سالم الزهراني", 
                company: "متجر الأناقة الرقمي",
                text: "المتجر الإلكتروني الذي طوروه لنا فاق توقعاتي! زادت المبيعات 300% في أول شهر والتصميم جذاب جداً. فريق محترف ومتعاون.",
                rating: 5,
                avatar: "/lovable-uploads/2cc6f009-6ed2-49cd-ac12-04f70b684a4d.png",
                project: "متجر إلكتروني متكامل", 
                gradient: "from-green-500 to-emerald-500"
              },
              {
                name: "سالم عبدالله الغامدي",
                company: "مؤسسة البناء المتطور", 
                text: "عمل احترافي بكل معنى الكلمة. التزام بالمواعيد، جودة عالية، وأسعار معقولة. حصلنا على هوية بصرية مميزة وموقع رائع.",
                rating: 5,
                avatar: "/lovable-uploads/1b40cb28-9cbb-4fdf-9a92-f739dad1a3a7.png",
                project: "هوية بصرية + موقع",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white/80 to-muted/60 backdrop-blur-sm animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`h-2 w-full bg-gradient-to-r ${testimonial.gradient}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center`}>
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      <p className="text-xs text-primary font-medium">{testimonial.project}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic leading-relaxed relative">
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center opacity-20`}>
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    "{testimonial.text}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* مميزات الشركة */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-white/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نحن نقدم حلولاً رقمية متكاملة بأعلى معايير الجودة وأفضل الأسعار في السوق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">سرعة في التسليم</h3>
              <p className="text-muted-foreground leading-relaxed">
                نلتزم بالمواعيد المحددة ونسلم مشاريعك في الوقت المناسب بأعلى جودة ممكنة
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">جودة مضمونة</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق من المحترفين ذوي الخبرة الواسعة يضمن لك أفضل النتائج وأعلى معايير الجودة
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">دعم فني 24/7</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق الدعم الفني متاح على مدار الساعة لحل أي مشكلة أو الإجابة على استفساراتك
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">حلول مخصصة</h3>
              <p className="text-muted-foreground leading-relaxed">
                نقدم حلولاً مخصصة تماماً لاحتياجاتك ومتطلبات عملك لضمان تحقيق أهدافك
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">أسعار تنافسية</h3>
              <p className="text-muted-foreground leading-relaxed">
                نقدم أفضل الأسعار في السوق مع باقات متنوعة تناسب جميع الميزانيات والاحتياجات
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">تصميم إبداعي</h3>
              <p className="text-muted-foreground leading-relaxed">
                فريق إبداعي متخصص في التصميم يضمن لك هوية بصرية مميزة وجذابة لجمهورك المستهدف
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Premium CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-800 dark:via-blue-800 dark:to-purple-800 rounded-3xl p-12 shadow-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-40 -translate-x-40"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full px-6 py-3 mb-6 border border-orange-400/30 animate-pulse">
                <Timer className="w-6 h-6 text-orange-400 animate-bounce" />
                <span className="text-orange-300 font-bold">لا تفوت الفرصة!</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                احصل على خدماتك المفضلة
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  بأسعار استثنائية
                </span>
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                عروض حصرية ومحدودة الوقت على أفضل خدماتنا الرقمية. ابدأ مشروعك اليوم بأفضل الأسعار
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button 
                  onClick={() => {
                    const phone = "966555812567";
                    const message = "مرحباً، أريد الاستفسار عن العروض الحالية المتاحة";
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border-0 group"
                >
                  <MessageCircle className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  تواصل معنا الآن
                </Button>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 animate-pulse" />
                  <span className="font-bold text-lg">0555812567</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>استشارة مجانية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>أسعار تنافسية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>جودة مضمونة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>دعم فني 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CurrentOffers;