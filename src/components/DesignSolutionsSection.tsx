import { useMemo, useState } from "react";
import { Palette, Sparkles, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const whatsappNumber = "966555812567";

type Item = { emoji: string; title: string; desc: string; price: number };

type Category = { title: string; description: string; items: Item[] };

const categories: readonly Category[] = [
  {
    title: "تصاميم الهوية البصرية",
    description: "تعكس هوية مشروعك بأسلوب احترافي يرسخ في أذهان العملاء.",
    items: [
      { emoji: "🖌️", title: "تصميم الشعار (Logo Design)", desc: "تصميم شعار مميز يعكس هوية علامتك.", price: 1500 },
      { emoji: "🏢", title: "تصميم هوية كاملة (Full Brand Identity)", desc: "هوية متكاملة تشمل جميع عناصر العلامة.", price: 7000 },
      { emoji: "💳", title: "تصميم البزنس كارد (Business Card Design)", desc: "بطاقات أعمال أنيقة واحترافية.", price: 300 },
      { emoji: "📄", title: "تصميم الأوراق الرسمية (Letterhead & Envelopes)", desc: "أوراق وخطابات معبرة عن شركتك.", price: 500 },
      { emoji: "📘", title: "دليل الهوية البصرية (Brand Guidelines)", desc: "كتيب إرشادي لاستخدام الهوية.", price: 2500 },
    ],
  },
  {
    title: "التصاميم التسويقية",
    description: "أدوات تسويقية مبتكرة لجذب العملاء وزيادة المبيعات.",
    items: [
      { emoji: "📑", title: "تصميم البروشور (Brochure Design)", desc: "كتيبات تعريفية مميزة.", price: 800 },
      { emoji: "📜", title: "تصميم الفلاير (Flyer Design)", desc: "منشورات دعائية مؤثرة.", price: 400 },
      { emoji: "🖼️", title: "تصميم البنرات الإعلانية (Banner Ads)", desc: "بنرات ثابتة ومتحركة.", price: 600 },
      { emoji: "📌", title: "تصميم البوسترات (Poster Design)", desc: "إعلانات كبيرة ولافتة للأنظار.", price: 700 },
      { emoji: "📚", title: "تصميم الكتالوجات (Catalog Design)", desc: "عرض منتجاتك بشكل أنيق.", price: 2500 },
    ],
  },
  {
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على جميع المنصات.",
    items: [
      { emoji: "🖼️", title: "تصميم المنشورات (Posts Design)", desc: "منشورات إبداعية لكل منصة.", price: 150 },
      { emoji: "📲", title: "تصميم القصص (Stories Design)", desc: "ستوري جذابة ومبتكرة.", price: 120 },
      { emoji: "🖌️", title: "تصميم غلاف الصفحات (Cover Photos)", desc: "أغلفة احترافية تعبر عن علامتك.", price: 300 },
      { emoji: "💡", title: "تصميم الإعلانات الممولة (Sponsored Ads Design)", desc: "تصاميم إعلانية مؤثرة لزيادة التفاعل.", price: 250 },
      { emoji: "🎯", title: "حزمة القوالب الجاهزة (Social Media Templates)", desc: "قوالب قابلة للتعديل لتوفير الوقت.", price: 900 },
    ],
  },
  {
    title: "التصاميم الإعلانية المطبوعة",
    description: "قوة الإعلان التقليدي بتصميم حديث.",
    items: [
      { emoji: "🛣️", title: "تصميم اللوحات الطرقية (Billboard Design)", desc: "لوحات ضخمة برسائل قوية.", price: 2000 },
      { emoji: "🎪", title: "تصميم ستاند رول أب (Roll-up Stand Design)", desc: "تصاميم لافتات المعارض والفعاليات.", price: 350 },
      { emoji: "🗞️", title: "تصميم الإعلانات في المجلات والصحف (Magazine & Newspaper Ads)", desc: "إعلانات مطبوعة مؤثرة.", price: 900 },
      { emoji: "💌", title: "تصميم الدعوات وبطاقات المناسبات (Invitations & Event Cards)", desc: "بطاقات أنيقة لكل مناسبة.", price: 500 },
    ],
  },
  {
    title: "التصاميم الرقمية",
    description: "حلول رقمية مبتكرة تناسب جميع الأجهزة والمنصات.",
    items: [
      { emoji: "🌐", title: "تصميم واجهات المواقع (Website UI Design)", desc: "تصميم صفحات ويب احترافية.", price: 3500 },
      { emoji: "📱", title: "تصميم واجهات التطبيقات (Mobile App UI Design)", desc: "واجهات تطبيقات عصرية وسهلة الاستخدام.", price: 4500 },
      { emoji: "📊", title: "تصميم العروض التقديمية (PowerPoint / Pitch Deck)", desc: "عروض احترافية للشركات والمستثمرين.", price: 1800 },
      { emoji: "🧾", title: "تصميم الإنفوجرافيك (Infographic Design)", desc: "رسوم بيانية إبداعية.", price: 600 },
      { emoji: "📩", title: "تصميم النشرات البريدية (Email Newsletter Design)", desc: "نشرات بريدية جذابة وفعالة.", price: 700 },
    ],
  },
  {
    title: "التصاميم الخاصة",
    description: "أعمال مخصصة تلبي احتياجاتك الفردية.",
    items: [
      { emoji: "🏭", title: "تصميم المطبوعات الدعائية للشركات (Corporate Promotional Materials)", desc: "كل ما يدعم صورة شركتك.", price: 1800 },
      { emoji: "📦", title: "تصميم المنتجات والعلب (Product Packaging)", desc: "تغليف احترافي يزيد جاذبية المنتج.", price: 2200 },
      { emoji: "🎁", title: "تصميم الهدايا الدعائية (Promotional Gifts)", desc: "هدايا مخصصة للتسويق.", price: 1200 },
      { emoji: "👕", title: "تصميم الملابس والتيشيرتات (T-shirt & Apparel Design)", desc: "أزياء بتصاميم إبداعية.", price: 400 },
      { emoji: "🛠️", title: "تحسين وتعديل التصاميم (Design Editing & Enhancement)", desc: "تحسين أو تعديل أي تصميم قديم.", price: 300 },
    ],
  },
] as const;

const currency = "SAR" as const;

const DesignSolutionsSection = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ category: string; item: Item } | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const pageTitle = "حلول التصميم الاحترافية";
  const ctaText = useMemo(() => (selected ? `الدفع لـ ${selected.item.title}` : "احجز استشارة مجانية"), [selected]);

  const startPayment = async () => {
    if (!selected) return;
    if (!customer.name || !customer.email) {
      toast({ title: "البيانات مطلوبة", description: "يرجى إدخال الاسم والبريد الإلكتروني.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paylink-payment", {
        body: {
          amount: selected.item.price,
          currency,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          offer_title: selected.item.title,
          description: `${selected.category} - ${selected.item.desc}`,
          success_url: window.location.origin,
        },
      });

      if (error) throw error;
      if (!data?.payment_url) throw new Error("تعذر إنشاء رابط الدفع");

      toast({ title: "إعادة التوجيه للدفع", description: "سيتم فتح صفحة Paylink لإتمام العملية." });
      window.open(data.payment_url, "_blank");
      setOpen(false);
    } catch (e: any) {
      console.error(e);
      toast({ title: "فشل الدفع", description: e.message || "حدث خطأ غير متوقع" , variant: "destructive"});
    } finally {
      setLoading(false);
    }
  };

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
            {pageTitle}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
            ترتيب واضح للأقسام الرئيسية والفرعية مع إمكانية الدفع المباشر عبر Paylink.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <article key={cat.title} className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 animate-fade-in">
              <header className="mb-3">
                <h2 className="text-2xl font-semibold tracking-tight">{cat.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
              </header>
              <ul className="space-y-4">
                {cat.items.map((item) => (
                  <li key={item.title} className="flex items-start justify-between gap-3 rounded-xl border p-4 bg-background hover-scale">
                    <div className="flex items-start gap-3">
                      <span aria-hidden className="text-xl leading-6 select-none">{item.emoji}</span>
                      <div>
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                        <div className="mt-2 text-sm font-semibold text-primary">{item.price.toLocaleString()} ر.س</div>
                      </div>
                    </div>
                    <Dialog open={open && selected?.item.title === item.title} onOpenChange={(o) => { setOpen(o); if(!o) setSelected(null); }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => { setSelected({ category: cat.title, item }); setOpen(true); }}
                          className="min-w-[132px]"
                        >
                          <CreditCard className="w-4 h-4 ml-2" />
                          ادفع الآن
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-lg">الدفع لخدمة: {item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">الاسم الكامل</Label>
                            <Input id="name" placeholder="مثال: أحمد محمد" value={customer.name} onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" type="email" placeholder="example@mail.com" value={customer.email} onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                            <Input id="phone" placeholder="05XXXXXXXX" value={customer.phone} onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))} />
                          </div>
                          <Button onClick={startPayment} disabled={loading} className="w-full">
                            {loading ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري إنشاء رابط الدفع</> : <>الدفع الآن ({item.price.toLocaleString()} ر.س)</>}
                          </Button>
                          <p className="text-xs text-muted-foreground">الدفع آمن عبر Paylink. سيتم فتح صفحة الدفع في تبويب جديد.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </li>
                ))}
              </ul>
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
            <Link to="/BookConsultation">احجز استشارة مجانية</Link>
          </Button>
        </div>

        {/* Subtle footer highlight */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-primary" />
          جميع الخدمات بالريال السعودي (SAR). يمكن تعديل الأسعار لاحقًا حسب رغبتكم.
        </div>
      </div>
    </section>
  );
};

export default DesignSolutionsSection;
