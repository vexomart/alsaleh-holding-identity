import { Palette, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    slug: "brand-identity",
    title: "تصاميم الهوية البصرية",
    description: "تعكس هوية مشروعك بأسلوب احترافي يرسخ في أذهان العملاء.",
    accent: "from-primary to-blue-600",
    preview: ["شعار احترافي", "هوية كاملة", "دليل الهوية"],
  },
  {
    slug: "marketing-designs",
    title: "التصاميم التسويقية",
    description: "أدوات تسويقية مبتكرة لجذب العملاء وزيادة المبيعات.",
    accent: "from-rose-500 to-amber-500",
    preview: ["بروشور", "فلاير", "بوسترات"],
  },
  {
    slug: "social-media",
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على جميع المنصات.",
    accent: "from-violet-500 to-indigo-500",
    preview: ["منشورات", "قصص", "أغلفة الصفحات"],
  },
  {
    slug: "print-ads",
    title: "التصاميم الإعلانية المطبوعة",
    description: "قوة الإعلان التقليدي بتصميم حديث.",
    accent: "from-amber-500 to-orange-500",
    preview: ["لوحات طرقية", "رول أب", "إعلانات مطبوعة"],
  },
  {
    slug: "digital-designs",
    title: "التصاميم الرقمية",
    description: "حلول رقمية مبتكرة تناسب جميع الأجهزة والمنصات.",
    accent: "from-primary to-indigo-600",
    preview: ["واجهات مواقع", "واجهات تطبيقات", "عروض تقديمية"],
  },
  {
    slug: "custom-designs",
    title: "التصاميم الخاصة",
    description: "أعمال مخصصة تلبي احتياجاتك الفردية.",
    accent: "from-teal-500 to-emerald-500",
    preview: ["مطبوعات دعائية", "تغليف منتجات", "هدايا دعائية"],
  },
] as const;

const whatsappNumber = "966555812567";

const DesignSolutionsSection = () => {
  return (
    <section id="design-solutions" className="relative py-16 bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 dark:from-primary/10 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border bg-muted/30 border-border">
            <Palette className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">حلول التصميم</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            حلول التصميم الاحترافية
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            اختر القسم المناسب ثم استكشف المنتجات والخدمات داخل الصفحة الداخلية لكل قسم.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <article key={cat.slug} className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 animate-fade-in hover-scale">
              <header className="mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${cat.accent} text-white text-xs font-medium`}>
                  <Sparkles className="w-3 h-3" />
                  قسم تصميم
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{cat.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
              </header>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {cat.preview.map((p) => (
                  <li key={p} className="before:content-['•'] before:mx-1 before:text-primary">{p}</li>
                ))}
              </ul>
              <div className="mt-5">
                <Button asChild className="group">
                  <Link to={`/design-solutions/${cat.slug}`}>
                    استكشف القسم
                    <ChevronRight className="w-4 h-4 mr-1 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
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
          <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-primary" />
          كل قسم يحتوي على منتجاته وخدماته مع وصف وأسعار واضحة بالريال السعودي.
        </div>
      </div>
    </section>
  );
};

export default DesignSolutionsSection;
