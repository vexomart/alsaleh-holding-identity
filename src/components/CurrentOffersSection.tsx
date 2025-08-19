import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Zap, Gift, ArrowRight, Timer, CheckCircle, Phone, Send, Sparkles, TrendingUp, Target } from "lucide-react";
import OfferRequestForm from "./OfferRequestForm";
import { CountdownTimer } from "./CountdownTimer";
import { currentOffers } from "@/data/offers";


const CurrentOffersSection = () => {
  const whatsappNumber = "966555812567";
  
  // تاريخ انتهاء العروض (25 يوم من الآن)
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 25);
  
  const openWhatsApp = (offerTitle: string, price: string, originalPrice: string, discount: string, timeLeft: string, features: string[]) => {
    const message = `🌟 مرحبا بك في ASH HOLDING

🎯 طلب عرض خاص
═══════════════════

📌 تفاصيل العرض:
🏷️ العرض: ${offerTitle}
💰 السعر الحالي: ${price} ريال
🔥 السعر الاصلي: ${originalPrice} ريال  
🎁 الخصم: ${discount}
⏰ متبقي: ${timeLeft}

✅ مميزات العرض:
${features.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

🎊 مميزات اضافية:
• ادارة ومتابعة 6 شهور
• دعم فني 24/7
• استشارة مجانية
• بداية سريعة

💡 اريد الحصول على هذا العرض!

شكرا لكم 🙏`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-indigo-100/40"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-300/5 to-indigo-300/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg animate-pulse">
              <Timer className="w-10 h-10 text-white" />
            </div>
            <Badge variant="destructive" className="text-xl px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg animate-bounce text-white border-0 rounded-full">
              عروض محدودة الوقت ⏰
            </Badge>
          </div>
          <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 tracking-tight">
            العروض الحالية
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            اكتشف مجموعة من أفضل عروضنا الحصرية بأسعار استثنائية ولفترة محدودة، خدمات احترافية بجودة عالية وأسعار لا تقاوم
          </p>
          
          {/* Global Countdown Timer */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-3">
                <Sparkles className="w-6 h-6 text-orange-500" />
                <span className="text-xl font-bold text-slate-700 dark:text-slate-300">العروض تنتهي خلال:</span>
              </div>
              <CountdownTimer targetDate={offerEndDate} size="lg" />
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {currentOffers.map((offer) => {
            const IconComponent = offer.icon;
            return (
              <Card key={offer.id} className="relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl transition-all duration-700 border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                {/* Modern Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-0`} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent"></div>
                {/* Timer and Badge */}
                <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                  <CountdownTimer targetDate={offerEndDate} size="sm" />
                  <Badge className={`bg-gradient-to-r ${offer.color} text-white px-3 py-1.5 text-xs font-bold shadow-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-300`}>
                    {offer.badge}
                  </Badge>
                </div>

                <CardHeader className="pt-20 pb-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${offer.color} cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg relative z-20`}
                      onClick={() => openWhatsApp(offer.title, offer.currentPriceSAR.toLocaleString(), offer.originalPriceSAR.toLocaleString(), offer.discount, offer.timeLeft, offer.features)}
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
                          {offer.currentPriceSAR.toLocaleString()} ر.س
                        </span>
                        <Badge variant="destructive" className="text-lg px-3 py-1 animate-bounce">
                          خصم {offer.discount}
                        </Badge>
                      </div>
                      <span className="text-xl text-muted-foreground line-through font-medium">
                        بدلاً من {offer.originalPriceSAR.toLocaleString()} ر.س
                      </span>
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        وفر {(offer.originalPriceSAR - offer.currentPriceSAR).toLocaleString()} ريال
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
                  <div className="pt-4 space-y-3">
                    
                    {/* Request Form Button */}
                    <OfferRequestForm
                      offer={{
                        ...offer,
                        currentPrice: offer.currentPriceSAR.toLocaleString(),
                        originalPrice: offer.originalPriceSAR.toLocaleString(),
                      }}
                      trigger={
                        <Button 
                          variant="outline"
                          className={`w-full group/btn hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg py-6 font-bold border-2`}
                          size="lg"
                        >
                          <Send className="w-5 h-5 ml-2" />
                          طلب معلومات أكثر
                          <ArrowRight className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Premium CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-white shadow-2xl border border-slate-700">
          <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">⚡ العروض تنتهي قريباً!</h3>
          <p className="text-2xl mb-8 text-slate-300 font-medium">
            لا تفوت الفرصة - احجز عرضك الآن واحصل على خصومات حصرية تصل إلى 35%
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبا بك في ASH HOLDING\n\n🛍️ طلب عرض شامل\n═══════════════════\n\n📌 تفاصيل الطلب:\n🎯 اريد الاطلاع على جميع العروض\n💰 اريد مقارنة الاسعار\n⚡ اريد الاستفادة من العروض\n\n🤔 معلومات احتاجها:\n• مدة تنفيذ كل مشروع\n• طرق الدفع المتاحة\n• تفاصيل الدعم الفني\n• نماذج من الاعمال\n\n💡 اريد استشارة شاملة!\n\nشكرا لكم 🙏')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl border-0 rounded-2xl"
              >
                <Phone className="w-6 h-6 ml-3" />
                عرض جميع العروض
                <ArrowRight className="w-6 h-6 mr-3" />
              </Button>
            </a>
            <div className="text-slate-400 text-lg font-medium">
              أو اتصل الآن: {whatsappNumber.replace('966', '0')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentOffersSection;