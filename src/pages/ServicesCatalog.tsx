import SEO from "@/components/SEO";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  Zap, 
  Megaphone, 
  Video, 
  Settings, 
  Globe, 
  ArrowRight,
  Sparkles,
  Target,
  Play,
  Code2,
  Smartphone
} from "lucide-react";

const ServicesCatalog = () => {
  const title = "قائمة الخدمات والأسعار | شركة ASH HOLDING";
  const description = "استكشف قائمة الخدمات والأسعار قريباً من شركة علي صالح الشهري القابضة. سيتم تحديث هذه الصفحة بالخدمات والتسعير قريباً.";
  const canonical = `${window.location.origin}/services-catalog`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "قائمة الخدمات والأسعار",
    description,
    url: canonical,
    isPartOf: {
      "@type": "Organization",
      name: "شركة علي صالح الشهري القابضة",
    },
  };

  const serviceCategories = [
    {
      id: 1,
      title: "التسويق الرقمي",
      description: "حلول التسويق الرقمي الشاملة لنمو أعمالك",
      icon: Megaphone,
      gradient: "from-pink-500 to-rose-600",
      services: ["إدارة الحملات الإعلانية", "تحسين محركات البحث", "التسويق عبر وسائل التواصل"],
      badge: "الأكثر طلباً"
    },
    {
      id: 2,
      title: "تصميم الفيديو والأنيميشن",
      description: "إنتاج محتوى بصري احترافي ومقاطع متحركة",
      icon: Video,
      gradient: "from-blue-500 to-cyan-600", 
      services: ["فيديوهات ترويجية", "أنيميشن ثنائي وثلاثي الأبعاد", "مونتاج احترافي"],
      badge: "إبداعي"
    },
    {
      id: 3,
      title: "ربط البرمجيات",
      description: "تكامل الأنظمة وربط التطبيقات",
      icon: Code2,
      gradient: "from-green-500 to-emerald-600",
      services: ["ربط APIs", "تكامل قواعد البيانات", "أتمتة العمليات"],
      badge: "تقني"
    },
    {
      id: 4,
      title: "الخدمات الإلكترونية",
      description: "حلول رقمية متكاملة لأعمالك",
      icon: Smartphone,
      gradient: "from-purple-500 to-indigo-600",
      services: ["تطبيقات الجوال", "المتاجر الإلكترونية", "المنصات الرقمية"],
      badge: "شامل"
    }
  ];

  return (
    <PageContainer showNavigation showFooter>
      <SEO title={title} description={description} canonicalUrl={canonical} jsonLd={jsonLd} />

      {/* Offset for fixed header */}
      <div className="pt-[48px] lg:pt-[112px]" />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="container-fluid relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm">خدمات متكاملة ومبتكرة</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            كتالوج <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">خدماتنا</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in">
            اكتشف مجموعة شاملة من الخدمات الرقمية المصممة لتعزيز نمو أعمالك وتحقيق أهدافك التجارية
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Target className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm">4 أقسام رئيسية</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white/90 text-sm">حلول مبتكرة</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="container-fluid py-20 -mt-10 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in bg-white dark:bg-gray-900"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 shadow-md">
                      {category.badge}
                    </Badge>
                  </div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                    
                    <CardDescription className="text-base text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="space-y-3 mb-6">
                      {category.services.map((service, serviceIndex) => (
                        <div 
                          key={serviceIndex}
                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-white/50 transition-colors duration-300"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient}`} />
                          <span className="text-sm font-medium">{service}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        التفاصيل والأسعار قريباً
                      </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`group-hover:bg-gradient-to-r group-hover:${category.gradient} group-hover:text-white transition-all duration-300`}
                      asChild
                    >
                      <a href={category.id === 1 ? "/digital-marketing" : "#"}>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        استكشف
                      </a>
                    </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="container-fluid py-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Clock className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-primary font-medium">قريباً جداً</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            تفاصيل شاملة لكل خدمة
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            سنقوم بإضافة التفاصيل الكاملة والباقات والأسعار لكل قسم من الخدمات المذكورة أعلاه
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">باقات مفصلة</h3>
              <p className="text-sm text-muted-foreground">خيارات متعددة تناسب جميع الاحتياجات</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">أسعار تنافسية</h3>
              <p className="text-sm text-muted-foreground">عروض خاصة للمشاريع الكبيرة</p>
            </div>
            
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">خدمات مخصصة</h3>
              <p className="text-sm text-muted-foreground">حلول مصممة خصيصاً لك</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-fluid py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ابدأ مشروعك معنا اليوم
              </h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                تواصل معنا الآن للحصول على استشارة مجانية وخطة مخصصة لاحتياجاتك
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-primary hover:bg-gray-100" 
                  asChild
                >
                  <a href="tel:0555812567">
                    <Phone className="w-4 h-4 ml-2" />
                    اتصل الآن
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-white/30 text-white hover:bg-white/10" 
                  asChild
                >
                  <a href="mailto:info@alialshehriholding.com">
                    <Mail className="w-4 h-4 ml-2" />
                    راسلنا
                  </a>
                </Button>
                
                <Button 
                  className="w-full bg-yellow-500 text-black hover:bg-yellow-400" 
                  asChild
                >
                  <a href="/start-with-us">
                    <Zap className="w-4 h-4 ml-2" />
                    ابدأ الآن
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

export default ServicesCatalog;
