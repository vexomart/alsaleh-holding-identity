import SEO from "@/components/SEO";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  Megaphone, 
  ArrowRight,
  CheckCircle,
  Star,
  Clock,
  Users,
  TrendingUp,
  Target,
  BarChart3,
  Lightbulb,
  CreditCard,
  Loader2,
  Smartphone,
  Banknote,
  Wallet
} from "lucide-react";

const DigitalMarketing = () => {
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const { toast } = useToast();
  
  const title = "التسويق الرقمي | شركة ASH HOLDING";
  const description = "خدمات التسويق الرقمي الاحترافية - بناء خطط تسويقية متكاملة وحلول رقمية مبتكرة لنمو أعمالك";
  const canonical = `${window.location.origin}/digital-marketing`;

  const handlePaymentMethod = async (service: any, method: 'paylink' | 'stc-pay' | 'tamara') => {
    setLoadingMethod(method);
    
    // إشعار فوري للمستخدم
    toast({
      title: "جاري معالجة طلب الدفع...",
      description: "يرجى الانتظار قليلاً"
    });
    
    try {
      const amount = 1499;
      let functionName = '';
      let payload: any = {
        amount: amount,
        currency: 'SAR',
        customer_name: 'عميل محتمل',
        customer_email: 'customer@example.com',
        customer_phone: '966500000000',
        offer_title: service.title,
        description: `دفع خدمة: ${service.title}`
      };

      switch (method) {
        case 'paylink':
          functionName = 'paylink-payment';
          payload.success_url = window.location.origin;
          break;
        case 'stc-pay':
          functionName = 'stc-pay';
          break;
        case 'tamara':
          functionName = 'tamara-payment';
          break;
      }

      console.log(`استدعاء ${functionName} مع البيانات:`, payload);

      // تحسين استدعاء Edge Function مع retry logic
      let data, error;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        attempts++;
        console.log(`محاولة ${attempts} من ${maxAttempts}`);
        
        try {
          const result: any = await Promise.race([
            supabase.functions.invoke(functionName, {
              body: payload,
              headers: {
                'Content-Type': 'application/json'
              }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('انتهت مهلة الاتصال')), 30000)
            )
          ]);
          
          data = result.data;
          error = result.error;
          
          if (!error && data) {
            console.log(`نجحت المحاولة ${attempts}:`, data);
            break;
          }
          
          if (attempts < maxAttempts) {
            console.log(`فشلت المحاولة ${attempts}، سيتم إعادة المحاولة...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (attemptError) {
          console.error(`خطأ في المحاولة ${attempts}:`, attemptError);
          if (attempts === maxAttempts) {
            throw attemptError;
          }
        }
      }

      if (error) {
        console.error(`${method} error after ${attempts} attempts:`, error);
        throw new Error(error.message || 'فشل في الاتصال بالخدمة بعد عدة محاولات');
      }

      console.log(`${functionName} response:`, data);

      if (data?.success || data?.url || data?.payment_url) {
        toast({
          title: "تم إنشاء رابط الدفع بنجاح",
          description: "سيتم توجيهك إلى صفحة الدفع"
        });

        if (method === 'stc-pay') {
          // عرض تعليمات STC Pay
          showSTCPayInstructions(data);
        } else if (data.url || data.paymentUrl || data.payment_url) {
          // استخدام الرابط المناسب - تحقق من جميع الأشكال المحتملة
          const paymentUrl = data.url || data.paymentUrl || data.payment_url;
          
          setTimeout(() => {
            if (method === 'paylink') {
              // فتح Paylink في نفس التبويب
              window.location.href = paymentUrl;
            } else {
              // فتح باقي الطرق في تبويب جديد
              window.open(paymentUrl, '_blank');
              toast({
                title: "تم توجيهك لصفحة الدفع",
                description: "يرجى إكمال عملية الدفع في التبويب الجديد",
              });
            }
          }, 500);
        } else {
          console.log("البيانات المرجعة من الخدمة:", data);
          throw new Error('لم يتم إرجاع رابط الدفع من الخدمة');
        }
      } else {
        const errorMsg = data?.error || data?.message || 'فشل في إنشاء رابط الدفع';
        console.error('خطأ في البيانات المرجعة:', data);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error(`خطأ نهائي في ${method}:`, error);
      
      let errorMessage = "حدث خطأ أثناء عملية الدفع";
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('انتهت مهلة')) {
          errorMessage = "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى";
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMessage = "مشكلة في الاتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "خطأ في الدفع",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingMethod(null);
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
          <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div class="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
              <h4 class="font-bold text-blue-800 mb-2">1. افتح تطبيق STC Pay</h4>
            </div>
            <div class="bg-green-50 rounded-xl p-4 border-2 border-green-100">
              <h4 class="font-bold text-green-800 mb-2">2. اختر "إرسال أموال"</h4>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
              <h4 class="font-bold text-purple-800 mb-2">3. أرسل المبلغ:</h4>
              <div class="bg-white rounded-lg p-4 border-2 border-purple-200 text-center">
                <div class="text-3xl font-bold text-purple-600">${data.amount}</div>
                <div class="text-lg text-purple-500">${data.currency}</div>
                <div class="mt-2 text-sm text-gray-600">إلى الرقم</div>
                <div class="text-xl font-bold text-gray-800 mt-2 font-mono bg-gray-50 rounded p-2">${data.merchant_number || data.merchantNumber}</div>
              </div>
            </div>
            <div class="bg-orange-50 rounded-xl p-4 border-2 border-orange-100">
              <h4 class="font-bold text-orange-800 mb-2">4. استخدم المرجع:</h4>
              <div class="bg-white rounded-lg p-3 border-2 border-orange-200 text-center">
                <div class="text-lg font-bold text-gray-800 font-mono bg-gray-50 rounded p-2">${data.reference || data.paymentReference}</div>
                <button onclick="navigator.clipboard.writeText('${data.reference || data.paymentReference}'); this.innerHTML='✓ تم النسخ!'" 
                        class="mt-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium py-2 px-4 rounded-lg">
                  نسخ المرجع
                </button>
              </div>
            </div>
          </div>
          <div class="p-6 bg-gray-50 border-t">
            <button onclick="this.closest('.fixed').remove()" 
                    class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "التسويق الرقمي",
    description,
    url: canonical,
    provider: {
      "@type": "Organization",
      name: "شركة علي صالح الشهري القابضة",
    },
  };

  const services = [
    {
      id: 1,
      title: "بناء خطة تسويقية متكاملة احترافية",
      description: "خطة تسويقية شاملة ومدروسة لتحقيق أهدافك التجارية في عالم التسويق الرقمي",
      price: "١٤٩٩",
      currency: "ريال",
      duration: "٢-٣ أسابيع",
      features: [
        "تحليل السوق والمنافسين",
        "تحديد الجمهور المستهدف",
        "وضع الأهداف والاستراتيجيات",
        "خطة المحتوى والحملات",
        "جدولة زمنية للتنفيذ",
        "مؤشرات الأداء KPIs"
      ],
      badge: "الأكثر طلباً",
      featured: true
    },
    {
      id: 5,
      title: "أقوي كلمات مفتاحية لموقعك SEO & SEM Keywords",
      description: "تحليل شامل وإعداد كلمات مفتاحية قوية لتحسين ظهور موقعك في محركات البحث",
      price: "٤٩٩",
      currency: "ريال",
      duration: "٤-٦ أيام",
      features: [
        "تحليل شامل للمنافسين",
        "بحث متقدم عن الكلمات المفتاحية",
        "تقرير مفصل بأفضل الكلمات",
        "استراتيجية SEO & SEM متكاملة",
        "تنفيذ من 4-6 أيام",
        "دعم فني لمدة شهر"
      ],
      badge: "متخصص",
      featured: false
    },
    {
      id: 6,
      title: "دراسة منافسين وتحليل SWOT",
      description: "دراسة شاملة للمنافسين وتحليل نقاط القوة والضعف والفرص والتهديدات لعملك",
      price: "٧٩٩",
      currency: "ريال",
      duration: "١-٢ أسبوع",
      features: [
        "تحليل شامل للمنافسين المباشرين",
        "دراسة استراتيجيات المنافسين",
        "تحليل SWOT مفصل لعملك",
        "تحديد الفجوات في السوق",
        "توصيات استراتيجية عملية",
        "تقرير تفصيلي بالنتائج والتوصيات"
      ],
      badge: "تحليل احترافي",
      featured: false
    },
    {
      id: 7,
      title: "خدمة سيو كاملة لموقعك لتصدر نتائج محركات البحث",
      description: "خدمة سيو شاملة ومتكاملة لتحسين ترتيب موقعك والوصول للصفحة الأولى في محركات البحث",
      price: "٣٩٩",
      currency: "ريال",
      duration: "٣-١٥ يوم",
      features: [
        "تحسين السيو الداخلي والخارجي",
        "تحسين سرعة الموقع والأداء",
        "إعداد الكلمات المفتاحية المستهدفة",
        "تحسين المحتوى والعناوين",
        "بناء باك لينكس عالية الجودة",
        "تقرير شامل بالتحسينات والنتائج"
      ],
      badge: "عرض مميز",
      featured: false
    },
    {
      id: 8,
      title: "إضافة نشاط تجاري على خرائط جوجل Google My Business",
      description: "إنشاء وتحسين ملف نشاطك التجاري على خرائط جوجل لزيادة الظهور المحلي والوصول لعملاء جدد",
      price: "٤٩٩",
      currency: "ريال",
      duration: "٧ أيام",
      features: [
        "إنشاء ملف Google My Business احترافي",
        "تحسين المعلومات والصور",
        "إضافة الخدمات والمنتجات",
        "تحسين الظهور في البحث المحلي",
        "إعداد التقييمات والمراجعات",
        "دليل كامل لإدارة الملف"
      ],
      badge: "ضروري للأعمال",
      featured: false
    },
    {
      id: 10,
      title: "نشر موقعك في أقوى محركات البحث",
      description: "تسجيل وإرسال موقعك إلى أهم محركات البحث العالمية والمحلية لضمان الفهرسة السريعة والظهور",
      price: "٢٥٠",
      currency: "ريال",
      duration: "أيام",
      features: [
        "تسجيل في Google Search Console",
        "إرسال إلى Bing Webmaster Tools",
        "تسجيل في محركات البحث المحلية",
        "إنشاء وإرسال خريطة الموقع XML",
        "تحسين إعدادات الفهرسة",
        "تقرير بحالة التسجيل في كل محرك"
      ],
      badge: "أساسي",
      featured: false
    },
    {
      id: 9,
      title: "رفع الدومين اثورتي Domain Authority +50",
      description: "تحسين قوة الدومين اثورتي لموقعك لتصل إلى +50 من خلال استراتيجيات متقدمة وآمنة",
      price: "٣٥٠",
      currency: "ريال",
      duration: "٥-١٠ أيام عمل",
      features: [
        "تحسين Domain Authority إلى +50",
        "استراتيجيات آمنة ومعتمدة",
        "تحسين الروابط الداخلية والخارجية",
        "تحسين جودة المحتوى والهيكل",
        "مراقبة مستمرة للنتائج",
        "تقرير مفصل بالتحسينات"
      ],
      badge: "نتائج مضمونة",
      featured: false
    },
    {
      id: 2,
      title: "رفع الدومين اثورتي MOZ بأقوي 100 باك لينكس",
      description: "100 باك لينك يدوية وآمنة من مواقع عالية الجودة لرفع قوة الدومين اثورتي",
      price: "٧٩٩",
      currency: "ريال",
      duration: "٣-٤ أسابيع",
      features: [
        "100 باك لينك يدوية 100%",
        "من مواقع عالية الجودة DA 50+",
        "روابط آمنة ومتنوعة",
        "تقرير مفصل بالروابط",
        "ضمان عدم الانخفاض",
        "متابعة شهرية للنتائج"
      ],
      badge: "جديد",
      featured: false
    },
    {
      id: 3,
      title: "احصل على باك لينك عالي الجودة على مواقع Web 2.0",
      description: "باك لينكات عالية الجودة من مواقع Web 2.0 المعتمدة لتحسين ترتيب موقعك",
      price: "٣٠٠",
      currency: "ريال",
      duration: "١-٢ أسبوع",
      features: [
        "باك لينكات من مواقع Web 2.0 معتمدة",
        "محتوى عالي الجودة ومتوافق مع السيو",
        "روابط دائمة وآمنة",
        "تقرير مفصل بالمواقع المستخدمة",
        "ضمان عدم الحذف",
        "دعم فني مجاني"
      ],
      badge: "عرض خاص",
      featured: false
    },
    {
      id: 4,
      title: "فحص شامل لموقعك لكشف كل أخطاء السيو SEO",
      description: "تحليل شامل ومفصل لموقعك لاكتشاف جميع مشاكل السيو وتقديم حلول عملية",
      price: "٦٠٠",
      currency: "ريال",
      duration: "٣-٥ أيام",
      features: [
        "فحص السيو التقني الشامل",
        "تحليل الكلمات المفتاحية",
        "فحص سرعة الموقع والأداء",
        "تقرير مفصل بالأخطاء والحلول",
        "توصيات عملية للتحسين",
        "استشارة مجانية لمدة شهر"
      ],
      badge: "الأكثر فائدة",
      featured: false
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "زيادة المبيعات",
      description: "نمو ملحوظ في المبيعات والإيرادات"
    },
    {
      icon: Users,
      title: "توسيع قاعدة العملاء",
      description: "الوصول لعملاء جدد وبناء ولائهم"
    },
    {
      icon: Target,
      title: "استهداف دقيق",
      description: "الوصول للجمهور المناسب في الوقت المناسب"
    },
    {
      icon: BarChart3,
      title: "قياس النتائج",
      description: "تتبع وتحليل الأداء بدقة"
    }
  ];

  return (
    <PageContainer showNavigation showFooter>
      <SEO title={title} description={description} canonicalUrl={canonical} jsonLd={jsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="container-fluid relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Megaphone className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm">حلول تسويقية احترافية</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            خدمات <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">التسويق الرقمي</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in">
            نساعدك في بناء استراتيجية تسويقية قوية وفعالة تحقق أهدافك التجارية وتعزز نمو أعمالك
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Star className="w-4 h-4 ml-2" />
              خبرة ١٠+ سنوات
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="w-4 h-4 ml-2" />
              ١٠٠+ عميل راضي
            </Badge>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 -mt-10 z-20 overflow-hidden">
        {/* Marketing Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container-fluid relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">خدماتنا المتاحة</h2>
            <p className="text-lg text-muted-foreground">اختر الخدمة المناسبة لاحتياجاتك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:-translate-y-2 animate-fade-in ${
                  service.featured 
                    ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-red-900/20 ring-2 ring-pink-200 dark:ring-pink-800' 
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20'
                }`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-current to-transparent rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-current to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Featured Badge */}
                {service.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg animate-pulse">
                      <Star className="w-3 h-3 ml-1" />
                      {service.badge}
                    </Badge>
                  </div>
                )}

                {!service.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                      <Lightbulb className="w-3 h-3 ml-1" />
                      {service.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative z-10 pb-4">
                  <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  
                  <CardDescription className="text-base text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </CardDescription>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {service.price}
                      </div>
                      <div className="text-sm text-muted-foreground">{service.currency}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      مميزات الخدمة:
                    </h4>
                    <div className="space-y-2">
                      {service.features.slice(0, 4).map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-center gap-2 text-sm p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 4 && (
                        <div className="text-xs text-muted-foreground text-center mt-2">
                          +{service.features.length - 4} مميزات إضافية
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Single Payment Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        const serviceParams = new URLSearchParams({
                          service: service.id.toString(),
                          title: service.title,
                          price: service.price,
                          currency: service.currency,
                          duration: service.duration,
                          features: service.features.join('|')
                        });
                        window.location.href = `/enhanced-payment?${serviceParams}`;
                      }}
                      className={`w-full group relative overflow-hidden bg-gradient-to-r ${
                        service.featured 
                          ? 'from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600' 
                          : 'from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600'
                      } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105`}
                      size="lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <CreditCard className="w-4 h-4 ml-2" />
                      ادفع الآن بكل سهولة
                      <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container-fluid py-16 bg-gradient-to-r from-gray-50 to-pink-50 dark:from-gray-900 dark:to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">فوائد التسويق الرقمي</h2>
            <p className="text-lg text-muted-foreground">كيف ستساعدك خدماتنا في تحقيق النجاح</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-fluid py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-red-600 text-white">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                جاهز لبدء مشروعك التسويقي؟
              </h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                تواصل معنا الآن للحصول على استشارة مجانية وابدأ رحلتك نحو النجاح الرقمي
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  variant="secondary" 
                  className="bg-white text-pink-600 hover:bg-gray-100" 
                  asChild
                >
                  <a href="/start-with-us">
                    ابدأ مشروعك الآن
                  </a>
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10" 
                  asChild
                >
                  <a href="/contact">
                    تواصل معنا
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageContainer>
  );
};

export default DigitalMarketing;