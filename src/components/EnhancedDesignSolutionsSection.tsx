import { Palette, Sparkles, ChevronRight, CheckCircle, PenTool, Megaphone, Share2, Printer, MonitorSmartphone, Layers, Clock, TrendingUp, Users, Award, Eye, Heart, Zap, Target, Lightbulb, Brush, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const categories = [
  {
    slug: "brand-identity",
    title: "تصاميم الهوية البصرية",
    description: "تعكس هوية مشروعك بأسلوب احترافي يرسخ في أذهان العملاء.",
    accent: "from-success to-success/80",
    preview: ["شعار احترافي", "هوية كاملة", "دليل الهوية", "نظام الألوان والخطوط"],
    delivery: "3–7 أيام عمل",
    Icon: PenTool,
    stats: { projects: "500+", satisfaction: "95%", avgTime: "48h" },
    popular: true,
    priceFrom: 249
  },
  {
    slug: "marketing-designs",
    title: "التصاميم التسويقية",
    description: "أدوات تسويقية مبتكرة لجذب العملاء وزيادة المبيعات.",
    accent: "from-success to-success/80",
    preview: ["بروشور", "فلاير", "بوسترات", "مطويات"],
    delivery: "2–4 أيام عمل",
    Icon: Megaphone,
    stats: { projects: "800+", satisfaction: "92%", avgTime: "24h" },
    priceFrom: 149
  },
  {
    slug: "social-media",
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على جميع المنصات.",
    accent: "from-success to-success/80",
    preview: ["منشورات", "قصص", "أغلفة الصفحات", "قوالب ثابتة ومتحركة"],
    delivery: "1–3 أيام عمل",
    Icon: Share2,
    stats: { projects: "1200+", satisfaction: "98%", avgTime: "12h" },
    trending: true,
    priceFrom: 119
  },
  {
    slug: "print-ads",
    title: "التصاميم الإعلانية المطبوعة",
    description: "قوة الإعلان التقليدي بتصميم حديث.",
    accent: "from-success to-success/80",
    preview: ["لوحات طرقية", "رول أب", "إعلانات مطبوعة", "بطاقات أعمال"],
    delivery: "4–7 أيام عمل",
    Icon: Printer,
    stats: { projects: "400+", satisfaction: "90%", avgTime: "5d" },
    priceFrom: 299
  },
  {
    slug: "digital-designs",
    title: "التصاميم الرقمية",
    description: "حلول رقمية مبتكرة تناسب جميع الأجهزة والمنصات.",
    accent: "from-success to-success/80",
    preview: ["واجهات مواقع", "واجهات تطبيقات", "عروض تقديمية", "بانرات تفاعلية"],
    delivery: "3–5 أيام عمل",
    Icon: MonitorSmartphone,
    stats: { projects: "200+", satisfaction: "99%", avgTime: "7d" },
    premium: true,
    priceFrom: 1699
  },
  {
    slug: "custom-designs",
    title: "التصاميم الخاصة",
    description: "أعمال مخصصة تلبي احتياجاتك الفردية.",
    accent: "from-success to-success/80",
    preview: ["مطبوعات دعائية", "تغليف منتجات", "هدايا دعائية", "طلبات خاصة"],
    delivery: "حسب الطلب",
    Icon: Layers,
    stats: { projects: "300+", satisfaction: "100%", avgTime: "5d" },
    priceFrom: 999
  },
] as const;

const whatsappNumber = "966555812567";

const EnhancedDesignSolutionsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="design-solutions" 
      className="relative py-24 bg-gradient-to-br from-success/5 via-success/5 to-success/10 dark:from-success/10 dark:via-background dark:to-muted/10 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-muted/30 border-border shadow-lg backdrop-blur-sm">
            <Palette className="w-6 h-6 text-success animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-sm font-medium text-foreground">حلول التصميم الاحترافية</span>
            <Sparkles className="w-5 h-5 text-success animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                إبداع
              </span>
              <span className="text-foreground"> لا حدود له</span>
              <br />
              <span className="text-foreground text-3xl md:text-4xl">في عالم التصميم</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              اختر القسم المناسب واستكشف عالماً من الإبداع والتميز في التصميم.
              من الهوية البصرية إلى التصاميم الرقمية، نحقق رؤيتك بأعلى معايير الجودة.
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <div className="text-center space-y-2 animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                3000+
              </div>
              <div className="text-sm text-muted-foreground">تصميم منجز</div>
            </div>
            <div className="text-center space-y-2 animate-on-scroll" style={{ animationDelay: '400ms' }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-sm text-muted-foreground">رضا العملاء</div>
            </div>
            <div className="text-center space-y-2 animate-on-scroll" style={{ animationDelay: '600ms' }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">دعم فني</div>
            </div>
            <div className="text-center space-y-2 animate-on-scroll" style={{ animationDelay: '800ms' }}>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                48H
              </div>
              <div className="text-sm text-muted-foreground">متوسط التسليم</div>
            </div>
          </div>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, index) => {
            const IconComp = cat.Icon as any;
            return (
              <Card 
                key={cat.slug} 
                className="group relative overflow-hidden rounded-3xl border-2 border-success/10 hover:border-success/30 transition-all duration-500 hover:shadow-2xl hover:scale-105 bg-card/50 backdrop-blur-sm animate-on-scroll"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Category badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  {(cat as any).popular && (
                    <Badge className="bg-yellow-500 text-black text-xs">
                      <TrendingUp className="w-3 h-3 ml-1" />
                      الأكثر طلباً
                    </Badge>
                  )}
                  {(cat as any).trending && (
                    <Badge className="bg-green-500 text-white text-xs">
                      <Zap className="w-3 h-3 ml-1" />
                      رائج
                    </Badge>
                  )}
                  {(cat as any).premium && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      <Award className="w-3 h-3 ml-1" />
                      متميز
                    </Badge>
                  )}
                </div>

                {/* Animated background effects */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -top-8 -end-8 w-36 h-36 rounded-full bg-gradient-to-br ${cat.accent} opacity-20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-30`} />
                  <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl transition-all duration-700 group-hover:scale-125" />
                </div>

                {/* Icon bubble with enhanced effects */}
                <div className="absolute top-4 start-4 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-success to-success/80 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/90 border border-border shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6 text-success animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-16 space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${cat.accent} text-white text-xs font-medium shadow`}>
                      <Brush className="w-3 h-3" />
                      قسم تصميم
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight group-hover:text-success transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Stats mini-dashboard */}
                  <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{cat.stats.projects}</div>
                      <div className="text-xs text-muted-foreground">مشروع</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{cat.stats.satisfaction}</div>
                      <div className="text-xs text-muted-foreground">رضا</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{cat.stats.avgTime}</div>
                      <div className="text-xs text-muted-foreground">متوسط</div>
                    </div>
                  </div>

                  {/* Services preview */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">الخدمات المتاحة:</h3>
                    <ul className="space-y-2">
                      {cat.preview.slice(0, 3).map((service, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success animate-pulse" />
                          <span>{service}</span>
                        </li>
                      ))}
                      {cat.preview.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{cat.preview.length - 3} خدمة إضافية...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Delivery time and pricing */}
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-xl border border-success/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-success" />
                      <span className="text-muted-foreground">{cat.delivery}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">من </span>
                      <span className="font-bold text-success">{cat.priceFrom} ر.س</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-2">
                    <Button asChild className="w-full group">
                      <Link to={`/design-solutions/${cat.slug}`} aria-label={`استكشاف قسم ${cat.title}`}>
                        <Eye className="w-4 h-4 ml-2" />
                        استكشف القسم
                        <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-4 animate-on-scroll">
            <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">دقة في التنفيذ</h3>
            <p className="text-muted-foreground">نحرص على تنفيذ كل تفصيلة بدقة عالية لضمان النتائج المثلى</p>
          </div>
          <div className="text-center space-y-4 animate-on-scroll" style={{ animationDelay: '200ms' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">إبداع لا محدود</h3>
            <p className="text-muted-foreground">أفكار مبتكرة وحلول إبداعية تميز علامتك التجارية</p>
          </div>
          <div className="text-center space-y-4 animate-on-scroll" style={{ animationDelay: '400ms' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold">تسليم سريع</h3>
            <p className="text-muted-foreground">التزام بالمواعيد وتسليم في الوقت المحدد</p>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center space-y-8 p-12 bg-gradient-to-r from-success/10 via-success/5 to-success/10 rounded-3xl border border-success/20 animate-on-scroll">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                جاهز لبدء مشروعك؟
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              تواصل معنا اليوم واحصل على استشارة مجانية وعرض سعر مخصص لمشروعك
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن حلول التصميم.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="px-8 group">
                <Heart className="w-5 h-5 ml-2 animate-pulse" />
                تواصل عبر واتساب
                <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <Button asChild size="lg" variant="outline" className="px-8 group">
              <Link to="/book-consultation">
                <Users className="w-5 h-5 ml-2" />
                احجز استشارة مجانية
                <ChevronRight className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              ضمان الجودة
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              تعديلات مجانية
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              دعم مستمر
            </div>
          </div>
        </div>

        {/* Final note */}
        <div className="mt-12 text-center animate-on-scroll">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-success animate-spin" style={{ animationDuration: '5s' }} />
            <span>كل قسم يحتوي على منتجاته وخدماته مع وصف وأسعار واضحة بالريال السعودي</span>
            <Sparkles className="w-4 h-4 text-success animate-spin" style={{ animationDuration: '5s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedDesignSolutionsSection;