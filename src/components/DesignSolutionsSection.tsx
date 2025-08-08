import { Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const whatsappNumber = "966555812567";

const categories = [
  {
    title: "تصاميم الهوية البصرية",
    description: "تعكس هوية مشروعك بأسلوب احترافي يرسخ في أذهان العملاء.",
    items: [
      { emoji: "🖌️", title: "تصميم الشعار (Logo Design)", desc: "تصميم شعار مميز يعكس هوية علامتك." },
      { emoji: "🏢", title: "تصميم هوية كاملة (Full Brand Identity)", desc: "هوية متكاملة تشمل جميع عناصر العلامة." },
      { emoji: "💳", title: "تصميم البزنس كارد (Business Card Design)", desc: "بطاقات أعمال أنيقة واحترافية." },
      { emoji: "📄", title: "تصميم الأوراق الرسمية (Letterhead & Envelopes)", desc: "أوراق وخطابات معبرة عن شركتك." },
      { emoji: "📘", title: "دليل الهوية البصرية (Brand Guidelines)", desc: "كتيب إرشادي لاستخدام الهوية." },
    ],
  },
  {
    title: "التصاميم التسويقية",
    description: "أدوات تسويقية مبتكرة لجذب العملاء وزيادة المبيعات.",
    items: [
      { emoji: "📑", title: "تصميم البروشور (Brochure Design)", desc: "كتيبات تعريفية مميزة." },
      { emoji: "📜", title: "تصميم الفلاير (Flyer Design)", desc: "منشورات دعائية مؤثرة." },
      { emoji: "🖼️", title: "تصميم البنرات الإعلانية (Banner Ads)", desc: "بنرات ثابتة ومتحركة." },
      { emoji: "📌", title: "تصميم البوسترات (Poster Design)", desc: "إعلانات كبيرة ولافتة للأنظار." },
      { emoji: "📚", title: "تصميم الكتالوجات (Catalog Design)", desc: "عرض منتجاتك بشكل أنيق." },
    ],
  },
  {
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على جميع المنصات.",
    items: [
      { emoji: "🖼️", title: "تصميم المنشورات (Posts Design)", desc: "منشورات إبداعية لكل منصة." },
      { emoji: "📲", title: "تصميم القصص (Stories Design)", desc: "ستوري جذابة ومبتكرة." },
      { emoji: "🖌️", title: "تصميم غلاف الصفحات (Cover Photos)", desc: "أغلفة احترافية تعبر عن علامتك." },
      { emoji: "💡", title: "تصميم الإعلانات الممولة (Sponsored Ads Design)", desc: "تصاميم إعلانية مؤثرة لزيادة التفاعل." },
      { emoji: "🎯", title: "حزمة القوالب الجاهزة (Social Media Templates)", desc: "قوالب قابلة للتعديل لتوفير الوقت." },
    ],
  },
  {
    title: "التصاميم الإعلانية المطبوعة",
    description: "قوة الإعلان التقليدي بتصميم حديث.",
    items: [
      { emoji: "🛣️", title: "تصميم اللوحات الطرقية (Billboard Design)", desc: "لوحات ضخمة برسائل قوية." },
      { emoji: "🎪", title: "تصميم ستاند رول أب (Roll-up Stand Design)", desc: "تصاميم لافتات المعارض والفعاليات." },
      { emoji: "🗞️", title: "تصميم الإعلانات في المجلات والصحف (Magazine & Newspaper Ads)", desc: "إعلانات مطبوعة مؤثرة." },
      { emoji: "💌", title: "تصميم الدعوات وبطاقات المناسبات (Invitations & Event Cards)", desc: "بطاقات أنيقة لكل مناسبة." },
    ],
  },
  {
    title: "التصاميم الرقمية",
    description: "حلول رقمية مبتكرة تناسب جميع الأجهزة والمنصات.",
    items: [
      { emoji: "🌐", title: "تصميم واجهات المواقع (Website UI Design)", desc: "تصميم صفحات ويب احترافية." },
      { emoji: "📱", title: "تصميم واجهات التطبيقات (Mobile App UI Design)", desc: "واجهات تطبيقات عصرية وسهلة الاستخدام." },
      { emoji: "📊", title: "تصميم العروض التقديمية (PowerPoint / Pitch Deck)", desc: "عروض احترافية للشركات والمستثمرين." },
      { emoji: "🧾", title: "تصميم الإنفوجرافيك (Infographic Design)", desc: "رسوم بيانية إبداعية." },
      { emoji: "📩", title: "تصميم النشرات البريدية (Email Newsletter Design)", desc: "نشرات بريدية جذابة وفعالة." },
    ],
  },
  {
    title: "التصاميم الخاصة",
    description: "أعمال مخصصة تلبي احتياجاتك الفردية.",
    items: [
      { emoji: "🏭", title: "تصميم المطبوعات الدعائية للشركات (Corporate Promotional Materials)", desc: "كل ما يدعم صورة شركتك." },
      { emoji: "📦", title: "تصميم المنتجات والعلب (Product Packaging)", desc: "تغليف احترافي يزيد جاذبية المنتج." },
      { emoji: "🎁", title: "تصميم الهدايا الدعائية (Promotional Gifts)", desc: "هدايا مخصصة للتسويق." },
      { emoji: "👕", title: "تصميم الملابس والتيشيرتات (T-shirt & Apparel Design)", desc: "أزياء بتصاميم إبداعية." },
      { emoji: "🛠️", title: "تحسين وتعديل التصاميم (Design Editing & Enhancement)", desc: "تحسين أو تعديل أي تصميم قديم." },
    ],
  },
] as const;

const DesignSolutionsSection = () => {
  return (
    <section id="design-solutions" className="relative py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border bg-muted/30 border-border">
            <Palette className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">حلول التصميم</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            حلول التصميم الاحترافية
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            ترتيب واضح للأقسام الرئيسية والفرعية لتسهيل اختيار الخدمة المناسبة لعملك.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <article key={cat.title} className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold tracking-tight">{cat.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
              </header>
              <ul className="space-y-4">
                {cat.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span aria-hidden className="text-xl leading-6 select-none">{item.emoji}</span>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Link to="/BookConsultation">احجز استشارة مجانية</Link>
          </Button>
        </div>

        {/* Subtle footer highlight */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-primary" />
          جميع الخدمات قابلة للتعديل حسب احتياجك مع ضمان الجودة والالتزام بالمواعيد
        </div>
      </div>
    </section>
  );
};

export default DesignSolutionsSection;
