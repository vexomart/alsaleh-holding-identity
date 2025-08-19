import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Star, Zap, Gift, ArrowRight, Timer, CheckCircle, Phone, Send, Sparkles, TrendingUp, Target } from "lucide-react";
import OfferRequestForm from "./OfferRequestForm";
import { CountdownTimer } from "./CountdownTimer";

import { currentOffers } from "@/data/offers";

const ModernOffersSection = () => {
  const whatsappNumber = "966555812567";
  
  // تاريخ انتهاء العروض (25 يوم من الآن)
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 25);

  const openWhatsApp = (offerTitle: string, price: string, originalPrice: string, discount: string, timeLeft: string, features: string[]) => {
    const message = `🌟 مرحبا بك في ASH HOLDING

🎯 طلب عرض خاص محدود الوقت
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

💡 اريد الحصول على هذا العرض قبل انتهاء المدة!

شكرا لكم 🙏`;
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-blue-900/50 dark:to-indigo-900/50">
      {/* Modern Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-indigo-100/30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg animate-pulse">
              <Timer className="w-8 h-8 text-white" />
            </div>
            <Badge variant="destructive" className="text-lg px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg animate-bounce text-white border-0 rounded-full">
              عروض محدودة - 25 يوم فقط ⏰
            </Badge>
          </div>
          <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 tracking-tight">
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

        {/* Modern Compact Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {currentOffers.map((offer, index) => {
            const IconComponent = offer.icon;
            return (
              <Card 
                key={offer.id} 
                className="relative overflow-hidden group hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-orange-500/20 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Top Badge & Timer */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start">
                  <Badge className={`bg-gradient-to-r ${offer.color} text-white px-3 py-1.5 text-xs font-bold shadow-lg transform rotate-1 group-hover:rotate-0 transition-transform duration-300`}>
                    {offer.badge}
                  </Badge>
                  <CountdownTimer targetDate={offerEndDate} size="sm" />
                </div>

                <CardHeader className="pt-16 pb-4 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${offer.color} cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg`}
                      onClick={() => openWhatsApp(offer.title, offer.currentPriceSAR.toLocaleString(), offer.originalPriceSAR.toLocaleString(), offer.discount, offer.timeLeft, offer.features)}
                      title="تواصل عبر الواتساب"
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 text-right text-foreground leading-tight">{offer.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {offer.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10 pb-6">
                  {/* Compact Pricing */}
                  <div className="text-center bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {offer.currentPriceSAR.toLocaleString()} ر.س
                      </span>
                      <Badge variant="destructive" className="text-xs px-2 py-0.5 animate-pulse">
                        {offer.discount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground line-through">
                        {offer.originalPriceSAR.toLocaleString()} ر.س
                      </span>
                      <span className="text-green-600 font-semibold">
                        وفر {(offer.originalPriceSAR - offer.currentPriceSAR).toLocaleString()} ر.س
                      </span>
                    </div>
                  </div>

                  {/* Compact Features */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-center text-primary flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      أهم المميزات
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto">
                      {offer.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs leading-relaxed">{feature}</span>
                        </div>
                      ))}
                      {offer.features.length > 4 && (
                        <div className="text-center text-xs text-muted-foreground">
                          +{offer.features.length - 4} مميزات أخرى
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact CTA */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => openWhatsApp(offer.title, offer.currentPriceSAR.toLocaleString(), offer.originalPriceSAR.toLocaleString(), offer.discount, offer.timeLeft, offer.features)}
                      className={`w-full group/btn hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm py-5 font-bold bg-gradient-to-r ${offer.color} border-0`}
                      size="sm"
                    >
                      <Phone className="w-4 h-4 ml-2" />
                      احصل على العرض الآن
                      <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    
                    <OfferRequestForm
                      offer={{
                        ...offer,
                        currentPrice: offer.currentPriceSAR.toLocaleString(),
                        originalPrice: offer.originalPriceSAR.toLocaleString(),
                      }}
                      trigger={
                        <Button 
                          variant="outline"
                          className="w-full text-xs py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                          size="sm"
                        >
                          <Send className="w-3 h-3 ml-1" />
                          معلومات أكثر
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-2xl border border-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                ⚡ العروض تنتهي خلال 25 يوم فقط!
              </h3>
            </div>
            <p className="text-lg md:text-xl mb-6 text-slate-300 font-medium">
              لا تفوت الفرصة - احجز عرضك الآن واحصل على خصومات حصرية تصل إلى 99%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحبا بك في ASH HOLDING\n\n🛍️ طلب عرض شامل محدود الوقت\n═══════════════════\n\n📌 تفاصيل الطلب:\n🎯 اريد الاطلاع على جميع العروض\n💰 اريد مقارنة الاسعار\n⚡ اريد الاستفادة من العروض قبل انتهاء المدة\n\n🤔 معلومات احتاجها:\n• مدة تنفيذ كل مشروع\n• طرق الدفع المتاحة\n• تفاصيل الدعم الفني\n• نماذج من الاعمال\n\n💡 اريد استشارة شاملة!\n\nشكرا لكم 🙏')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-6 text-lg font-bold hover:scale-105 transition-all duration-300 shadow-xl border-0 rounded-2xl"
                >
                  <Phone className="w-5 h-5 ml-3" />
                  احصل على جميع العروض
                  <ArrowRight className="w-5 h-5 mr-3" />
                </Button>
              </a>
              <div className="text-slate-400 text-base font-medium">
                أو اتصل الآن: {whatsappNumber.replace('966', '0')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernOffersSection;