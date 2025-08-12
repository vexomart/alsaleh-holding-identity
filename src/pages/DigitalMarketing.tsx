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
  Loader2
} from "lucide-react";

const DigitalMarketing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const title = "التسويق الرقمي | شركة علي الشهري القابضة";
  const description = "خدمات التسويق الرقمي الاحترافية - بناء خطط تسويقية متكاملة وحلول رقمية مبتكرة لنمو أعمالك";
  const canonical = `${window.location.origin}/digital-marketing`;

  const handlePayment = async (service: any) => {
    setIsLoading(true);
    console.log('بدء عملية الدفع للخدمة:', service.title);
    
    try {
      console.log('إرسال طلب الدفع إلى Paylink...');
      
      const { data, error } = await supabase.functions.invoke('paylink-payment', {
        body: {
          amount: 1499,
          currency: 'SAR',
          customerName: 'عميل محتمل',
          customerEmail: 'customer@example.com',
          customerPhone: '966500000000',
          offerTitle: service.title,
          offerDescription: service.description
        }
      });

      console.log('استجابة Paylink:', { data, error });

      if (error) {
        console.error('خطأ في استدعاء دالة الدفع:', error);
        throw error;
      }

      if (data && data.success && data.paymentUrl) {
        console.log('تم إنشاء رابط الدفع بنجاح:', data.paymentUrl);
        // فتح صفحة الدفع في تبويب جديد
        window.open(data.paymentUrl, '_blank');
        toast({
          title: "تم توجيهك لصفحة الدفع",
          description: "يرجى إكمال عملية الدفع في التبويب الجديد",
        });
      } else {
        console.error('فشل في إنشاء رابط الدفع:', data);
        throw new Error('فشل في إنشاء رابط الدفع');
      }
    } catch (error) {
      console.error('خطأ في عملية الدفع:', error);
      toast({
        title: "خطأ في الدفع",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء توجيهك لصفحة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('انتهت عملية الدفع');
    }
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

      {/* Offset for fixed header */}
      <div className="pt-[48px] lg:pt-[112px]" />

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
      <section className="container-fluid py-20 -mt-10 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">خدماتنا المتاحة</h2>
            <p className="text-lg text-muted-foreground">اختر الخدمة المناسبة لاحتياجاتك</p>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className={`group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in ${
                  service.featured ? 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20' : 'bg-white dark:bg-gray-900'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Featured Badge */}
                {service.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                      {service.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                      
                      <CardDescription className="text-base text-muted-foreground mb-4">
                        {service.description}
                      </CardDescription>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {service.price}
                          </div>
                          <div className="text-sm text-muted-foreground">{service.currency}</div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>مدة التسليم: {service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      ما يشمله العرض:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      يشمل ضمان المراجعة والتعديل
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                        asChild
                      >
                        <a href="/start-with-us">
                          <ArrowRight className="w-4 h-4 ml-2" />
                          استشارة مجانية
                        </a>
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                        onClick={() => handlePayment(service)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 ml-2" />
                        )}
                        {isLoading ? 'جاري التحويل...' : 'ادفع الآن'}
                      </Button>
                    </div>
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