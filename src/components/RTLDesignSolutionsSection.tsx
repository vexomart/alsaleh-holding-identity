import React, { useState, useEffect, useRef } from "react";
import { 
  Palette, Sparkles, ChevronLeft, CheckCircle, PenTool, Megaphone, 
  Share2, Printer, MonitorSmartphone, Layers, Clock, TrendingUp, 
  Users, Award, Eye, Heart, Zap, Target, Lightbulb, Brush, Rocket,
  Star, Globe, Building2, Briefcase, Camera, Paintbrush, Smartphone,
  ArrowLeft, Play, Pause, MousePointer2, Wand2, Crown, Gem, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const categories = [
  {
    slug: "brand-identity",
    title: "تصاميم الهوية البصرية",
    description: "حلول الهوية البصرية للشركات العالمية مع التركيز على التميز والاحترافية العالمية",
    accent: "from-primary to-primary-glow",
    preview: ["شعار احترافي عالمي", "هوية كاملة متعددة المنصات", "دليل الهوية الشامل", "نظام الألوان والخطوط العالمي", "تطبيقات العلامة التجارية", "قوالب مؤسسية"],
    delivery: "3–7 أيام عمل",
    Icon: PenTool,
    stats: { projects: "850+", satisfaction: "98%", avgTime: "5 أيام", clients: "120+" },
    popular: true,
    priceFrom: 2499,
    globalFeatures: ["معايير عالمية", "متوافق دولياً", "قابل للتطوير"],
    category: "premium"
  },
  {
    slug: "marketing-designs",
    title: "التصاميم التسويقية العالمية",
    description: "حملات تسويقية احترافية تناسب الأسواق العالمية وتحقق أقصى تأثير ممكن",
    accent: "from-success to-success/80",
    preview: ["بروشورات احترافية", "فلايرز متعددة اللغات", "بوسترات عالمية", "مطويات تفاعلية", "إعلانات رقمية", "حملات متكاملة"],
    delivery: "2–4 أيام عمل",
    Icon: Megaphone,
    stats: { projects: "1200+", satisfaction: "96%", avgTime: "3 أيام", clients: "200+" },
    trending: true,
    priceFrom: 899,
    globalFeatures: ["تصاميم متعددة الثقافات", "محتوى عالمي", "استراتيجية شاملة"],
    category: "business"
  },
  {
    slug: "social-media",
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "محتوى بصري مبتكر لجميع المنصات العالمية مع التركيز على التفاعل والانتشار",
    accent: "from-accent to-accent-light",
    preview: ["منشورات احترافية", "قصص تفاعلية", "أغلفة المنصات", "قوالب متحركة", "فيديوهات قصيرة", "إعلانات مدفوعة"],
    delivery: "1–3 أيام عمل",
    Icon: Share2,
    stats: { projects: "2500+", satisfaction: "99%", avgTime: "2 أيام", clients: "400+" },
    trending: true,
    priceFrom: 599,
    globalFeatures: ["محتوى فيروسي", "تفاعل عالي", "استراتيجية رقمية"],
    category: "digital"
  },
  {
    slug: "print-ads",
    title: "التصاميم الإعلانية المطبوعة",
    description: "إعلانات مطبوعة عالية الجودة تجمع بين التراث والحداثة لتحقيق تأثير قوي",
    accent: "from-secondary to-secondary-dark",
    preview: ["لوحات طرقية عملاقة", "رول أب احترافي", "إعلانات صحفية", "بطاقات أعمال فاخرة", "كتالوجات شركات", "مطبوعات دعائية"],
    delivery: "4–7 أيام عمل",
    Icon: Printer,
    stats: { projects: "650+", satisfaction: "94%", avgTime: "6 أيام", clients: "150+" },
    priceFrom: 1299,
    globalFeatures: ["جودة طباعة عالية", "مواد فاخرة", "تصاميم أنيقة"],
    category: "traditional"
  },
  {
    slug: "digital-designs",
    title: "التصاميم الرقمية المتطورة",
    description: "حلول رقمية متقدمة تواكب أحدث التقنيات العالمية وتوفر تجربة مستخدم استثنائية",
    accent: "from-purple-600 to-pink-600",
    preview: ["واجهات مواقع متطورة", "تطبيقات جوال", "عروض تقديمية تفاعلية", "بانرات رقمية ذكية", "تصاميم AR/VR", "منصات رقمية"],
    delivery: "5–10 أيام عمل",
    Icon: MonitorSmartphone,
    stats: { projects: "450+", satisfaction: "100%", avgTime: "8 أيام", clients: "80+" },
    premium: true,
    priceFrom: 3999,
    globalFeatures: ["تقنيات حديثة", "تجربة مستخدم متقدمة", "حلول ذكية"],
    category: "tech"
  },
  {
    slug: "custom-designs",
    title: "التصاميم المخصصة والفريدة",
    description: "أعمال إبداعية مخصصة بالكامل تلبي احتياجاتك الفريدة وتحقق رؤيتك الخاصة",
    accent: "from-gradient-to-r from-yellow-400 to-orange-500",
    preview: ["تصاميم حسب الطلب", "هدايا دعائية مميزة", "تغليف منتجات فاخر", "معارض وفعاليات", "تصاميم فنية", "مشاريع خاصة"],
    delivery: "حسب الطلب والتعقيد",
    Icon: Layers,
    stats: { projects: "300+", satisfaction: "100%", avgTime: "متغير", clients: "90+" },
    exclusive: true,
    priceFrom: 1999,
    globalFeatures: ["تصاميم حصرية", "إبداع لا محدود", "خدمة شخصية"],
    category: "exclusive"
  }
] as const;

const globalClients = [
  { name: "Microsoft", logo: "🏢", industry: "تكنولوجيا" },
  { name: "Amazon", logo: "📦", industry: "تجارة إلكترونية" },
  { name: "Samsung", logo: "📱", industry: "إلكترونيات" },
  { name: "BMW", logo: "🚗", industry: "سيارات" },
  { name: "Adidas", logo: "👟", industry: "رياضة" },
  { name: "Coca-Cola", logo: "🥤", industry: "مشروبات" }
];

const whatsappNumber = "966555812567";

const RTLDesignSolutionsSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const filters = [
    { id: "all", label: "جميع الأقسام", icon: Globe },
    { id: "premium", label: "المميز", icon: Award },
    { id: "business", label: "الأعمال", icon: Briefcase },
    { id: "digital", label: "الرقمي", icon: Smartphone },
    { id: "traditional", label: "التقليدي", icon: Printer },
    { id: "tech", label: "التقني", icon: MonitorSmartphone },
    { id: "exclusive", label: "الحصري", icon: Star }
  ];

  const filteredCategories = activeFilter === "all" 
    ? categories 
    : categories.filter(cat => (cat as any).category === activeFilter);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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
      className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden"
      dir="rtl"
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-3/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* العنوان الرئيسي المحسن */}
        <div className="text-center mb-16 space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
            <Palette className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-lg font-bold text-foreground">حلول التصميم العالمية</span>
            <Sparkles className="w-6 h-6 text-success animate-pulse" />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                إبداع عالمي
              </span>
              <br />
              <span className="text-foreground text-4xl md:text-5xl">بمعايير دولية</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              نقدم حلول تصميم احترافية تواكب أحدث الاتجاهات العالمية وتلبي احتياجات الشركات الكبرى
              مع ضمان أعلى معايير الجودة والإبداع
            </p>
          </div>

          {/* إحصائيات رئيسية */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12">
            <div className="text-center space-y-3 animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                5000+
              </div>
              <div className="text-sm text-muted-foreground font-medium">مشروع منجز</div>
            </div>
            <div className="text-center space-y-3 animate-on-scroll" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-muted-foreground font-medium">رضا العملاء</div>
            </div>
            <div className="text-center space-y-3 animate-on-scroll" style={{ animationDelay: '600ms' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-sm text-muted-foreground font-medium">دولة</div>
            </div>
            <div className="text-center space-y-3 animate-on-scroll" style={{ animationDelay: '800ms' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-secondary-dark bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground font-medium">دعم مستمر</div>
            </div>
          </div>
        </div>

        {/* فلتر الأقسام */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-on-scroll" dir="rtl">
          {filters.map((filter) => {
            const IconComp = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                dir="rtl"
              >
                <IconComp className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>

        {/* عرض الأقسام بشبكة محسنة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20" dir="rtl">
          {filteredCategories.map((cat, index) => {
            const IconComp = cat.Icon as any;
            return (
              <Card 
                key={cat.slug} 
                className="group relative overflow-hidden rounded-3xl border-2 border-primary/10 hover:border-primary/30 transition-all duration-700 hover:shadow-2xl hover:scale-105 bg-card/60 backdrop-blur-sm animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
                dir="rtl"
              >
                {/* شارات التصنيف */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {(cat as any).popular && (
                    <Badge className="bg-yellow-500 text-black text-xs flex items-center gap-1" dir="rtl">
                      <span>الأكثر طلباً</span>
                      <TrendingUp className="w-3 h-3" />
                    </Badge>
                  )}
                  {(cat as any).trending && (
                    <Badge className="bg-green-500 text-white text-xs flex items-center gap-1" dir="rtl">
                      <span>رائج</span>
                      <Zap className="w-3 h-3" />
                    </Badge>
                  )}
                  {(cat as any).premium && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center gap-1" dir="rtl">
                      <span>مميز</span>
                      <Award className="w-3 h-3" />
                    </Badge>
                  )}
                  {(cat as any).exclusive && (
                    <Badge className="bg-gradient-to-r from-gold-500 to-yellow-600 text-black text-xs flex items-center gap-1" dir="rtl">
                      <span>حصري</span>
                      <Star className="w-3 h-3" />
                    </Badge>
                  )}
                </div>

                {/* تأثيرات الخلفية المتحركة */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className={`absolute -top-8 -left-8 w-36 h-36 rounded-full bg-gradient-to-br ${cat.accent} opacity-20 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-40`} />
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-tr from-accent/20 to-secondary/20 blur-2xl transition-all duration-700 group-hover:scale-125" />
                </div>

                {/* أيقونة متحركة مع تأثيرات محسنة */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background/95 border-2 border-primary/30 shadow-xl backdrop-blur-md group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                      <IconComp className="w-8 h-8 text-primary transition-all duration-500 group-hover:scale-110 animate-bounce" style={{ animationDuration: '2s' }} />
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-20 space-y-6">
                  {/* العنوان والوصف */}
                  <div className="space-y-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cat.accent} text-white text-sm font-bold shadow-lg`} dir="rtl">
                      <span>قسم عالمي</span>
                      <Brush className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* الميزات العالمية */}
                  <div className="flex flex-wrap gap-2">
                    {(cat as any).globalFeatures?.map((feature: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-success/10 text-success text-xs rounded-full border border-success/20">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* إحصائيات مصغرة */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{cat.stats.projects}</div>
                      <div className="text-xs text-muted-foreground">مشروع</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{cat.stats.satisfaction}</div>
                      <div className="text-xs text-muted-foreground">رضا</div>
                    </div>
                  </div>

                  {/* معاينة الخدمات */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2" dir="rtl">
                      <span>الخدمات المتاحة:</span>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </h3>
                    <ul className="space-y-2">
                      {cat.preview.slice(0, 4).map((service, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground" dir="rtl">
                          <span>{service}</span>
                          <CheckCircle className="w-4 h-4 text-success animate-pulse" />
                        </li>
                      ))}
                      {cat.preview.length > 4 && (
                        <li className="text-xs text-muted-foreground pr-6">
                          +{cat.preview.length - 4} خدمة إضافية...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* التسليم والسعر */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20" dir="rtl">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{cat.delivery}</span>
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">من </span>
                      <span className="font-bold text-primary">{cat.priceFrom} ر.س</span>
                    </div>
                  </div>

                  {/* زر الإجراء */}
                  <div className="pt-2">
                    <Button asChild className="w-full group bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300" dir="rtl">
                      <Link to={`/design-solutions/${cat.slug}`} aria-label={`استكشاف قسم ${cat.title}`}>
                        <ChevronLeft className="w-4 h-4 ml-2 transition-transform group-hover:-translate-x-1" />
                        استكشف القسم
                        <Eye className="w-4 h-4 mr-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* قسم العملاء العالميين */}
        <div className="mb-20 animate-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                عملاؤنا حول العالم
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نفخر بخدمة أكبر الشركات العالمية وتحقيق نتائج استثنائية معهم
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {globalClients.map((client, index) => (
              <div 
                key={client.name}
                className="flex flex-col items-center p-6 bg-card/50 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 hover:scale-105 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
                dir="rtl"
              >
                <div className="text-4xl mb-3">{client.logo}</div>
                <h3 className="font-bold text-sm text-foreground">{client.name}</h3>
                <p className="text-xs text-muted-foreground">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>

        {/* قسم الميزات */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center space-y-6 animate-on-scroll">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">دقة عالمية</h3>
            <p className="text-muted-foreground leading-relaxed">
              نحرص على تطبيق أعلى معايير الجودة العالمية في كل تفصيلة لضمان التميز المطلق
            </p>
          </div>
          <div className="text-center space-y-6 animate-on-scroll" style={{ animationDelay: '200ms' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">إبداع لا محدود</h3>
            <p className="text-muted-foreground leading-relaxed">
              فريق من أمهر المصممين العالميين يقدم حلولاً إبداعية تفوق التوقعات
            </p>
          </div>
          <div className="text-center space-y-6 animate-on-scroll" style={{ animationDelay: '400ms' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-accent to-accent-light rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold">تسليم سريع</h3>
            <p className="text-muted-foreground leading-relaxed">
              التزام صارم بالمواعيد مع ضمان أسرع أوقات التسليم في السوق
            </p>
          </div>
        </div>

        {/* دعوة للعمل محسنة */}
        <div className="text-center space-y-8 p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-3xl border-2 border-primary/20 animate-on-scroll">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                هل أنت مستعد لبدء مشروعك العالمي؟
              </span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
              انضم إلى آلاف العملاء حول العالم واحصل على استشارة مجانية مع خبرائنا
              وعرض سعر مخصص لمشروعك
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن حلول التصميم العالمية.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="px-12 py-4 text-lg bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success transition-all duration-300 group" dir="rtl">
                <ChevronLeft className="w-5 h-5 ml-3 transition-transform group-hover:-translate-x-1" />
                تواصل عبر واتساب
                <Heart className="w-6 h-6 mr-3 animate-pulse" />
              </Button>
            </a>
            <Button asChild size="lg" variant="outline" className="px-12 py-4 text-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group" dir="rtl">
              <Link to="/book-consultation">
                <ChevronLeft className="w-5 h-5 ml-3 transition-transform group-hover:-translate-x-1" />
                احجز استشارة مجانية
                <Users className="w-6 h-6 mr-3" />
              </Link>
            </Button>
          </div>

          {/* مؤشرات الثقة */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-6">
            <div className="flex items-center gap-2" dir="rtl">
              <span>ضمان الجودة العالمية</span>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-center gap-2" dir="rtl">
              <span>تعديلات مجانية لمدة شهر</span>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-center gap-2" dir="rtl">
              <span>دعم مستمر 24/7</span>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-center gap-2" dir="rtl">
              <span>خدمة عملاء متعددة اللغات</span>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        {/* ملاحظة ختامية */}
        <div className="mt-16 text-center animate-on-scroll">
          <div className="inline-flex items-center gap-3 text-lg text-muted-foreground">
            <Sparkles className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-medium">
              جميع أقسامنا تحتوي على منتجات وخدمات احترافية مع أسعار شفافة ومعايير عالمية
            </span>
            <Sparkles className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RTLDesignSolutionsSection;