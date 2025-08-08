import { Palette, Sparkles, ChevronRight, CheckCircle, PenTool, Megaphone, Share2, Printer, MonitorSmartphone, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    slug: "brand-identity",
    title: "تصاميم الهوية البصرية",
    description: "تعكس هوية مشروعك بأسلوب احترافي يرسخ في أذهان العملاء.",
    accent: "from-success to-success/80",
    preview: ["شعار احترافي", "هوية كاملة", "دليل الهوية", "نظام الألوان والخطوط"],
    delivery: "3–7 أيام عمل",
    Icon: PenTool,
  },
  {
    slug: "marketing-designs",
    title: "التصاميم التسويقية",
    description: "أدوات تسويقية مبتكرة لجذب العملاء وزيادة المبيعات.",
    accent: "from-success to-success/80",
    preview: ["بروشور", "فلاير", "بوسترات", "مطويات"],
    delivery: "2–4 أيام عمل",
    Icon: Megaphone,
  },
  {
    slug: "social-media",
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على جميع المنصات.",
    accent: "from-success to-success/80",
    preview: ["منشورات", "قصص", "أغلفة الصفحات", "قوالب ثابتة ومتحركة"],
    delivery: "1–3 أيام عمل",
    Icon: Share2,
  },
  {
    slug: "print-ads",
    title: "التصاميم الإعلانية المطبوعة",
    description: "قوة الإعلان التقليدي بتصميم حديث.",
    accent: "from-success to-success/80",
    preview: ["لوحات طرقية", "رول أب", "إعلانات مطبوعة", "بطاقات أعمال"],
    delivery: "4–7 أيام عمل",
    Icon: Printer,
  },
  {
    slug: "digital-designs",
    title: "التصاميم الرقمية",
    description: "حلول رقمية مبتكرة تناسب جميع الأجهزة والمنصات.",
    accent: "from-success to-success/80",
    preview: ["واجهات مواقع", "واجهات تطبيقات", "عروض تقديمية", "بانرات تفاعلية"],
    delivery: "3–5 أيام عمل",
    Icon: MonitorSmartphone,
  },
  {
    slug: "custom-designs",
    title: "التصاميم الخاصة",
    description: "أعمال مخصصة تلبي احتياجاتك الفردية.",
    accent: "from-success to-success/80",
    preview: ["مطبوعات دعائية", "تغليف منتجات", "هدايا دعائية", "طلبات خاصة"],
    delivery: "حسب الطلب",
    Icon: Layers,
  },
] as const;

const whatsappNumber = "966555812567";

const EnhancedDesignSolutionsSection = () => {
  return (
    <section id="design-solutions" className="relative py-16 bg-gradient-to-br from-success/5 via-success/5 to-success/10 dark:from-success/10 dark:via-background dark:to-muted/10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border bg-muted/30 border-border">
            <Palette className="w-5 h-5 text-success" />
            <span className="text-sm text-foreground">حلول التصميم</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
            حلول التصميم الاحترافية
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            اختر القسم المناسب ثم استكشف المنتجات والخدمات داخل الصفحة الداخلية لكل قسم.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => {
            const IconComp = cat.Icon as any;
            return (
              <article key={cat.slug} className="relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm p-6 animate-fade-in hover-scale">
                {/* Decorative glow */}
                <div
                  className={`absolute -top-8 -end-8 w-36 h-36 rounded-full bg-gradient-to-br ${cat.accent} opacity-20 blur-2xl animate-glow`}
                  aria-hidden="true"
                />

                {/* Icon bubble */}
                <div className="absolute top-4 end-4 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-background/70 border border-border shadow-glow backdrop-blur-sm">
                  <IconComp className="w-5 h-5 text-success animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                </div>

                <header className="mb-4 pr-14">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${cat.accent} text-white text-xs font-medium`}>
                    <Sparkles className="w-3 h-3" />
                    قسم تصميم
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">{cat.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                </header>

                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {cat.preview.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4 text-success" />
                  <span>موعد التسليم: {cat.delivery}</span>
                </div>

                <div className="mt-5">
                  <Button asChild className="group">
                    <Link to={`/design-solutions/${cat.slug}`} aria-label={`استكشاف قسم ${cat.title}`}>
                      استكشف القسم
                      <ChevronRight className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن حلول التصميم.")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="px-8">
              تواصل عبر واتساب
            </Button>
          </a>
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link to="/book-consultation">احجز استشارة مجانية</Link>
          </Button>
        </div>

        {/* Subtle footer highlight */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-success" />
          كل قسم يحتوي على منتجاته وخدماته مع وصف وأسعار واضحة بالريال السعودي.
        </div>
      </div>
    </section>
  );
};

export default EnhancedDesignSolutionsSection;
