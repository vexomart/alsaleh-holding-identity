import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import { Star, ShoppingCart, Eye, CheckCircle, Ruler, CreditCard, Smartphone, QrCode, Palette, Sparkles, Loader2, Banknote, Wallet, ArrowRight } from "lucide-react";
import businessCardsHeroImg from "@/assets/printing/business-cards-hero-bg.jpg";
import businessCardsProductImg from "@/assets/printing/business-cards-category.jpg";
import ledBusinessCardsImg from "@/assets/printing/led-business-cards.jpg";
import spotUvBusinessCardsImg from "@/assets/printing/spot-uv-business-cards.jpg";
import goldFoilBusinessCardsImg from "@/assets/printing/gold-foil-business-cards.jpg";
import silverFoilBusinessCardsImg from "@/assets/printing/silver-foil-business-cards.jpg";
import texturedFabricBusinessCardsImg from "@/assets/printing/textured-fabric-business-cards.jpg";
import threeDEffectBusinessCardsImg from "@/assets/printing/3d-effect-business-cards.jpg";

const BusinessCards = () => {
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // نظام الدفع المبسط باستخدام TAP
  const handlePaymentMethod = async (product: any) => {
    const productId = product.title; // استخدام العنوان كمعرف فريد
    setLoadingProducts(prev => new Set([...prev, productId]));
    
    // فتح النافذة فوراً لتجنب حظر المتصفح
    const paymentWindow = window.open('about:blank', '_blank');
    
    toast({
      title: "جاري معالجة طلب الدفع...",
      description: "يرجى الانتظار قليلاً"
    });
    
    try {
      // استخراج السعر من النص بطريقة صحيحة
      const priceMatch = product.price.match(/(\d+)/);
      const amount = priceMatch ? parseFloat(priceMatch[1]) : 199;
      
      console.log('معلومات المنتج:', { title: product.title, price: product.price, amount });
      
      const payload = {
        amount: amount,
        currency: 'SAR',
        customer_name: 'عميل كروت شخصية',
        customer_email: 'customer@businesscards.com',
        customer_phone: '966500000000',
        offer_title: product.title,
        description: `طلب ${product.title} - ${product.description}`,
        product_details: {
          product_id: Math.random(),
          product_name: product.title,
          product_version: "V 1.0",
          category: product.category,
          features: product.features.join(', ')
        }
      };

      console.log('إرسال بيانات الدفع:', payload);

      const { data, error } = await supabase.functions.invoke('tap-payment', {
        body: payload
      });

      console.log('استجابة الدفع:', { data, error });

      if (error) {
        console.error('خطأ في الطلب:', error);
        paymentWindow?.close();
        throw new Error(error.message || 'فشل في إنشاء رابط الدفع');
      }

      if (data?.success && data?.payment_url) {
        toast({
          title: "تم إنشاء رابط الدفع بنجاح",
          description: "سيتم توجيهك إلى صفحة الدفع"
        });
        
        paymentWindow!.location.href = data.payment_url;
      } else {
        paymentWindow?.close();
        throw new Error(data?.error || 'لم يتم إرجاع رابط الدفع');
      }
    } catch (error) {
      console.error('خطأ في الدفع:', error);
      paymentWindow?.close();
      
      let errorMessage = "حدث خطأ أثناء عملية الدفع";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في الدفع",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const showSTCPayInstructions = (data: any) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="this.remove()">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in" dir="rtl" onclick="event.stopPropagation()">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-2">تعليمات الدفع - STC Pay</h3>
            <p class="text-orange-100">معاملة آمنة ومحمية</p>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-purple-50 rounded-xl p-4">
              <h4 class="font-bold text-purple-800 mb-2">المبلغ المطلوب:</h4>
              <div class="text-center bg-white rounded-lg p-4">
                <div class="text-3xl font-bold text-purple-600">${data.amount} ${data.currency}</div>
                <div class="text-xl font-bold text-gray-800 mt-2">${data.merchant_number || data.merchantNumber}</div>
              </div>
            </div>
          </div>
          <div class="p-6 bg-gray-50">
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl">إغلاق</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };
  const products = [
    {
      title: "كروت شخصية أساسية ورقمية",
      description: "كروت شخصية عصرية تجمع بين الأناقة الكلاسيكية والتقنيات الذكية",
      price: "من 199 ريال",
      originalPrice: "349 ريال",
      image: businessCardsProductImg,
      rating: 4.9,
      reviews: 430,
      features: ["تصميم كلاسيكي أنيق", "ورق مقوى فاخر 350 جرام", "دعم تقنية NFC الذكية", "كود QR مخصص"],
      category: "متميز",
      icon: CreditCard,
      gradient: "from-blue-600 via-purple-600 to-pink-600"
    },
    {
      title: "كروت شخصية ليد",
      description: "كروت شخصية مضيئة بتقنية LED المتقدمة لانطباع لا يُنسى",
      price: "من 399 ريال",
      originalPrice: "599 ريال",
      image: ledBusinessCardsImg,
      rating: 4.8,
      reviews: 185,
      features: ["إضاءة LED متقدمة", "بطارية قابلة للشحن", "تحكم في الألوان", "مقاومة للماء"],
      category: "مبتكر",
      icon: Smartphone,
      gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    {
      title: "كروت شخصية سبوت يوفي",
      description: "كروت شخصية بطلاء سبوت UV اللامع للحصول على ملمس فاخر",
      price: "من 299 ريال",
      originalPrice: "449 ريال",
      image: spotUvBusinessCardsImg,
      rating: 4.7,
      reviews: 298,
      features: ["طلاء سبوت UV عالي اللمعان", "ملمس ناعم وفاخر", "مقاومة للخدوش", "تأثير بصري متميز"],
      category: "فاخر",
      icon: Sparkles,
      gradient: "from-purple-500 via-indigo-500 to-blue-500"
    },
    {
      title: "كروت شخصية مع ختم ذهبي",
      description: "كروت شخصية بختم ذهبي فاخر يضفي لمسة من الأناقة والرقي",
      price: "من 349 ريال",
      originalPrice: "499 ريال",
      image: goldFoilBusinessCardsImg,
      rating: 4.9,
      reviews: 342,
      features: ["ختم ذهبي حقيقي 24 قيراط", "تصميم مخصص للختم", "ورق فاخر عالي الجودة", "مظهر راقي ومميز"],
      category: "ملكي",
      icon: Star,
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600"
    },
    {
      title: "كروت شخصية مع ختم فضي",
      description: "كروت شخصية بختم فضي أنيق يعطي لمسة عصرية راقية",
      price: "من 319 ريال",
      originalPrice: "459 ريال",
      image: silverFoilBusinessCardsImg,
      rating: 4.8,
      reviews: 267,
      features: ["ختم فضي عالي الجودة", "تشطيب معدني لامع", "تصميم أنيق وعصري", "مقاومة للتآكل"],
      category: "أنيق",
      icon: Star,
      gradient: "from-gray-400 via-gray-500 to-gray-600"
    },
    {
      title: "كروت شخصية مقمشة",
      description: "كروت شخصية بملمس قماشي فاخر يضفي طابعاً مميزاً وأنيقاً",
      price: "من 279 ريال",
      originalPrice: "389 ريال",
      image: texturedFabricBusinessCardsImg,
      rating: 4.6,
      reviews: 221,
      features: ["ملمس قماشي فاخر", "نسيج طبيعي ناعم", "مقاومة للبهتان", "تصميم راقي ومميز"],
      category: "مميز",
      icon: Palette,
      gradient: "from-teal-500 via-cyan-500 to-blue-500"
    },
    {
      title: "كروت شخصية تأثير ثلاثي الأبعاد",
      description: "كروت شخصية بتأثير ثلاثي الأبعاد لإطلالة مبتكرة وعصرية",
      price: "من 429 ريال",
      originalPrice: "599 ريال",
      image: threeDEffectBusinessCardsImg,
      rating: 4.9,
      reviews: 156,
      features: ["تأثير ثلاثي الأبعاد", "طباعة متعددة الطبقات", "عمق بصري مذهل", "تقنية حديثة"],
      category: "عصري",
      icon: QrCode,
      gradient: "from-pink-500 via-rose-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: Palette,
      title: "تصميمات متنوعة",
      description: "أكثر من 100 تصميم جاهز أو تصميم مخصص حسب طلبك"
    },
    {
      icon: CheckCircle,
      title: "جودة عالية",
      description: "خامات فاخرة وطباعة عالية الدقة تضمن النتيجة المثالية"
    },
    {
      icon: QrCode,
      title: "تقنيات حديثة",
      description: "دعم للتقنيات الذكية مثل NFC وQR Code"
    },
    {
      icon: Sparkles,
      title: "خدمة شاملة",
      description: "من التصميم إلى الطباعة والتسليم في 24 ساعة"
    }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="كروت شخصية"
        description="كروت شخصية احترافية بتصميمات فاخرة وخامات عالية الجودة"
        showBackButton
        backButtonFallback="/printing/business-stationery"
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Enhanced Hero Section */}
        <div className="relative h-96 rounded-3xl overflow-hidden mb-16 group shadow-2xl">
          <img 
            src={businessCardsHeroImg} 
            alt="كروت شخصية احترافية"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-purple-600/90 to-pink-600/85"></div>
          <div className="absolute inset-0 backdrop-blur-[1px]"></div>
          
          {/* Floating Animation Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce animation-delay-1000"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-12 h-12 bg-pink-400/20 rounded-full animate-spin animation-delay-3000"></div>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="animate-fade-in max-w-4xl mx-auto px-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse mr-4">
                  <CreditCard className="w-10 h-10 text-yellow-300" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  كروت شخصية
                  <span className="block text-3xl md:text-4xl text-yellow-300 mt-2">أساسية ورقمية</span>
                </h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 animate-pulse ml-4">
                  <Smartphone className="w-10 h-10 text-yellow-300" />
                </div>
              </div>
              <p className="text-2xl text-white/95 mb-8 leading-relaxed">اجمع بين الأناقة التقليدية والتقنيات الذكية</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 px-6 py-3 text-lg font-bold hover-scale">
                  ✨ تصميم مجاني
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-3 text-lg hover-scale">
                  🚀 تسليم سريع
                </Badge>
                <Badge className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-0 px-6 py-3 text-lg font-bold hover-scale">
                  💎 جودة عالمية
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index} 
                className="group text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm hover-scale animate-fade-in border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="space-y-12 mb-16">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              منتجاتنا المتميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              اختر من مجموعة متنوعة من الكروت الشخصية المتطورة التي تناسب جميع الأذواق والمتطلبات
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              return (
                <Card 
                  key={index} 
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover-scale overflow-hidden bg-white/90 backdrop-blur-sm animate-fade-in hover:bg-white"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    transform: 'translateY(0px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) rotateY(5deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px) rotateY(0deg)';
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-75 group-hover:opacity-85 transition-opacity duration-300`}></div>
                    
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 text-xs font-bold shadow-lg">
                        وفر {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="absolute top-2 left-2">
                      <Badge className={`bg-gradient-to-r ${product.gradient} text-white px-2 py-1 text-xs font-bold shadow-lg`}>
                        {product.category}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-white font-bold bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2 p-4">
                    <CardTitle className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 p-4 pt-0">
                    {/* Features - Compact */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">المميزات:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {product.features.slice(0, 3).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-1 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 truncate">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 3 && (
                          <div className="text-xs text-blue-600 font-medium">
                            +{product.features.length - 3} مميزات إضافية
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-green-600">{product.price}</span>
                        <span className="text-xs text-gray-400 line-through mr-1">{product.originalPrice}</span>
                      </div>
                    </div>
                    
                    {/* زر الدفع بالبطاقة الائتمانية فقط */}
                    <div className="space-y-2">
                      <Button
                        onClick={() => handlePaymentMethod(product)}
                        disabled={loadingProducts.has(product.title)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm py-3 font-bold hover-scale shadow-lg transition-all duration-300"
                      >
                        {loadingProducts.has(product.title) ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 mr-2" />
                        )}
                        ادفع الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-100 text-center overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/30 rounded-full animate-pulse animation-delay-1000"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-400/30 rounded-full animate-bounce animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              احصل على استشارة مجانية
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              فريقنا من خبراء التصميم جاهز لمساعدتك في اختيار التصميم المثالي وتقديم النصائح المهنية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg hover-scale shadow-xl hover:shadow-2xl transition-all duration-300">
                احجز استشارة الآن
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg hover-scale hover:border-blue-400 transition-all duration-300">
                عرض التصميمات
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BusinessCards;