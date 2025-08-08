import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, CreditCard, Loader2, Lock, Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Catalog with detailed features and delivery times
const catalog = {
  "brand-identity": {
    title: "تصاميم الهوية البصرية",
    description: "بناء هوية قوية ومتسقة ترسخ علامتك في أذهان عملائك.",
    accent: {
      headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800",
      chip: "from-primary to-blue-600",
    },
    items: [
      { name: "تصميم الشعار (Logo Design)", desc: "شعار فريد يعكس شخصية علامتك.", price: 1500, delivery: "4-7 أيام", features: ["3 مقترحات أولية", "تعديلات غير محدودة حتى الاعتماد", "ملفات مفتوحة ومتجهية"] },
      { name: "تصميم هوية كاملة (Full Brand Identity)", desc: "حزمة هوية متكاملة لجميع اللمسات البصرية.", price: 7000, delivery: "2-3 أسابيع", features: ["شعار احترافي", "هوية مطبوعة ورقمية", "دليل استخدام الهوية"] },
      { name: "البزنس كارد (Business Card)", desc: "بطاقات أعمال أنيقة واحترافية.", price: 300, delivery: "1-2 يوم", features: ["تصميمين للاختيار", "جاهز للطباعة", "صياغة احترافية"] },
      { name: "الأوراق الرسمية (Letterhead & Envelopes)", desc: "هوية مراسلات تعزز الثقة.", price: 500, delivery: "2-3 أيام", features: ["خطابات رسمية", "مغلفات", "إصدار رقمي للطباعة"] },
      { name: "دليل الهوية (Brand Guidelines)", desc: "دليل استخدام الهوية لضمان الاتساق.", price: 2500, delivery: "5-7 أيام", features: ["الألوان والخطوط", "الاستخدامات الصحيحة والخاطئة", "أمثلة تطبيقية"] },
    ],
  },
  "marketing-designs": {
    title: "التصاميم التسويقية",
    description: "مواد تسويقية مؤثرة لرفع الوعي وزيادة التحويلات.",
    accent: { headerBg: "bg-gradient-to-br from-rose-50 via-amber-50 to-primary/10 dark:from-slate-900 dark:via-slate-800 dark:to-primary/10", chip: "from-rose-500 to-amber-500" },
    items: [
      { name: "البروشور (Brochure)", desc: "تعريف احترافي بالخدمات والمنتجات.", price: 800, delivery: "3-5 أيام", features: ["تصميم احترافي", "قياسات متعددة", "جاهز للطباعة"] },
      { name: "الفلاير (Flyer)", desc: "منشورات دعائية سريعة التأثير.", price: 400, delivery: "1-2 يوم", features: ["مقاسين للاختيار", "محتوى موجز", "تدرجات لونية جذابة"] },
      { name: "البنرات الإعلانية (Banner Ads)", desc: "بنرات ثابتة ومتحركة للحملات.", price: 600, delivery: "2-3 أيام", features: ["نسخ متعددة", "مقاسات منصات مختلفة", "تحسين للأداء"] },
      { name: "البوسترات (Poster)", desc: "إعلانات كبيرة لافتة للأنظار.", price: 700, delivery: "2-4 أيام", features: ["هوية متسقة", "حروف واضحة", "جاهز للطباعة"] },
      { name: "الكتالوجات (Catalog)", desc: "عرض منظم وجذاب لمنتجاتك.", price: 2500, delivery: "1-2 أسبوع", features: ["تنسيق صفحات", "صور عالية الجودة", "PDF + للطباعة"] },
    ],
  },
  "social-media": {
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على كافة المنصات.",
    accent: { headerBg: "bg-gradient-to-br from-violet-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-violet-500 to-indigo-500" },
    items: [
      { name: "تصميم المنشورات (Posts)", desc: "قوالب جذابة ومتناسقة.", price: 150, delivery: "24-48 ساعة", features: ["قوالب متعددة", "أبعاد المنصات", "قابلة للتعديل"] },
      { name: "تصميم القصص (Stories)", desc: "قصص قصيرة ملفتة.", price: 120, delivery: "24 ساعة", features: ["حركة خفيفة", "مطبوعات جذابة", "أبعاد مناسبة"] },
      { name: "أغلفة الصفحات (Covers)", desc: "غلاف احترافي معبر عن الهوية.", price: 300, delivery: "1-2 يوم", features: ["صورة غلاف", "صورة بروفايل", "تنسيق منصات"] },
      { name: "تصميم للإعلانات الممولة", desc: "تصاميم مهيئة للأداء والتفاعل.", price: 250, delivery: "24-48 ساعة", features: ["CTA واضح", "تجارب A/B", "متوافق مع السياسات"] },
      { name: "حزمة قوالب جاهزة", desc: "قوالب قابلة للتعديل لتوفير الوقت.", price: 900, delivery: "3-5 أيام", features: ["ملفات مصدر", "أدلة استخدام", "تدرجات وألوان"] },
    ],
  },
  "print-ads": {
    title: "التصاميم الإعلانية المطبوعة",
    description: "تصاميم مطبوعة عالية الجودة للتأثير التقليدي الحديث.",
    accent: { headerBg: "bg-gradient-to-br from-amber-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-amber-500 to-orange-500" },
    items: [
      { name: "اللوحات الطرقية (Billboard)", desc: "رسائل قوية على نطاق واسع.", price: 2000, delivery: "1-2 أسبوع", features: ["أحجام متعددة", "موك أب واقعي", "ملفات للطباعة"] },
      { name: "ستاند رول أب (Roll-up)", desc: "لافتات معارض فعالة.", price: 350, delivery: "2-3 أيام", features: ["قياسات معيارية", "تصميمين", "ملفات للطباعة"] },
      { name: "إعلانات الصحف والمجلات", desc: "تصاميم مطبوعة مؤثرة.", price: 900, delivery: "3-5 أيام", features: ["توافق المقاسات", "نسخ متعددة", "إخراج للطباعة"] },
      { name: "الدعوات وبطاقات المناسبات", desc: "بطاقات أنيقة لكل مناسبة.", price: 500, delivery: "2-4 أيام", features: ["تصاميم موضوعية", "ورق مقترح", "جاهزة للطباعة"] },
    ],
  },
  "digital-designs": {
    title: "التصاميم الرقمية",
    description: "حلول رقمية متوافقة مع جميع الأجهزة والمنصات.",
    accent: { headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800", chip: "from-primary to-indigo-600" },
    items: [
      { name: "واجهات المواقع (Website UI)", desc: "واجهات احترافية وسريعة.", price: 3500, delivery: "1-2 أسبوع", features: ["تصميم صفحات رئيسية", "نمط مكونات UI", "توافق جوال"] },
      { name: "واجهات التطبيقات (App UI)", desc: "تجربة استخدام عصرية وسهلة.", price: 4500, delivery: "2-3 أسابيع", features: ["خرائط تدفق", "مكونات قابلة لإعادة الاستخدام", "تصميم متجاوب"] },
      { name: "العروض التقديمية (Pitch Deck)", desc: "عروض قوية للشركات والمستثمرين.", price: 1800, delivery: "3-5 أيام", features: ["قوالب احترافية", "رسوم بيانية", "تحسين الرسائل"] },
      { name: "الإنفوجرافيك (Infographic)", desc: "تبسيط البيانات برسوم جذابة.", price: 600, delivery: "2-4 أيام", features: ["أيقونات مخصصة", "ألوان متناسقة", "ملف SVG + PNG"] },
      { name: "النشرات البريدية (Newsletter)", desc: "قوالب إيميل فعالة وجذابة.", price: 700, delivery: "2-3 أيام", features: ["متوافقة مع مزودي البريد", "CTA واضح", "تحسين للجوال"] },
    ],
  },
  "custom-designs": {
    title: "التصاميم الخاصة",
    description: "حلول مخصصة تلبي احتياجاتك الفردية بكفاءة.",
    accent: { headerBg: "bg-gradient-to-br from-teal-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-teal-500 to-emerald-500" },
    items: [
      { name: "مطبوعات دعائية للشركات", desc: "كل ما يدعم صورة شركتك.", price: 1800, delivery: "3-7 أيام", features: ["تصاميم متسقة", "إخراج للطباعة", "خيارات متعددة"] },
      { name: "تصميم المنتجات والعلب", desc: "تغليف يزيد جاذبية المنتج.", price: 2200, delivery: "1-2 أسبوع", features: ["تصميم 3D", "مقترحات مواد", "ملفات للطباعة"] },
      { name: "الهدايا الدعائية", desc: "هدايا مخصصة للتسويق.", price: 1200, delivery: "3-5 أيام", features: ["خيارات متنوعة", "تصميمين", "موك أب"] },
      { name: "تصميم الملابس والتيشيرتات", desc: "أزياء بتصاميم إبداعية.", price: 400, delivery: "2-4 أيام", features: ["مقاسات مختلفة", "ملفات للطباعة", "تصميمين"] },
      { name: "تحسين وتعديل التصاميم", desc: "تحسين أو تعديل أي تصميم قديم.", price: 300, delivery: "1-2 يوم", features: ["تحسين جودة", "تنسيق ملفات", "تصحيح ألوان"] },
    ],
  },
} as const;

type CatalogKey = keyof typeof catalog;

const whatsappNumber = "966555812567";

export default function DesignCategory() {
  const { slug } = useParams<{ slug: CatalogKey }>();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ name: string; price: number } | null>(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  // Appointment dialog state
  const [apptOpen, setApptOpen] = useState(false);
  const [appt, setAppt] = useState({ date: "", time: "", note: "" });

  const data = catalog[(slug as CatalogKey) || "brand-identity"];

  // SEO
  useEffect(() => {
    const title = `${data.title} | حلول التصميم`;
    document.title = title;

    const desc = `${data.description} — تسعير بالريال السعودي وطرق دفع آمنة عبر Paylink.`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + `/design-solutions/${slug}`;
  }, [slug, data.title, data.description]);

  const startPayment = async () => {
    if (!selected) return;
    if (!customer.name || !customer.email) {
      toast({ title: "البيانات مطلوبة", description: "يرجى إدخال الاسم والبريد الإلكتروني.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: resp, error } = await supabase.functions.invoke("paylink-payment", {
        body: {
          amount: selected.price,
          currency: "SAR",
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          offer_title: selected.name,
          description: `${data.title} - ${selected.name}`,
          success_url: window.location.origin,
        },
      });

      if (error) throw error;
      if (!resp?.payment_url) throw new Error("تعذر إنشاء رابط الدفع");

      toast({ title: "إعادة التوجيه للدفع", description: "سيتم فتح صفحة Paylink لإتمام العملية." });
      window.open(resp.payment_url, "_blank");
      setOpen(false);
    } catch (e: any) {
      console.error(e);
      toast({ title: "فشل الدفع", description: e.message || "حدث خطأ غير متوقع", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = () => {
    if (!appt.date || !appt.time) {
      toast({ title: "أدخل الموعد", description: "يرجى اختيار التاريخ والوقت", variant: "destructive" });
      return;
    }
    const msg = `مرحباً، أود حجز موعد لخدمة: ${selected?.name || data.title}\nالتاريخ: ${appt.date}\nالوقت: ${appt.time}\nملاحظات: ${appt.note || "-"}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setAppt({ date: "", time: "", note: "" });
    setApptOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <header className={`relative ${data.accent.headerBg} border-b border-white/20 dark:border-slate-700/50 py-16 px-6 text-center animate-fade-in`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
        <div className="relative max-w-3xl mx-auto">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${data.accent.chip} text-white text-sm font-medium shadow` }>
            <Sparkles className="w-4 h-4" />
            قسم: {data.title}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {data.title}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {data.description}
          </p>
        </div>
      </header>

      <main className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.items.map((it) => (
              <Card key={it.name} className="p-5 animate-fade-in hover-scale">
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{it.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{it.desc}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>مدة التنفيذ: {it.delivery}</span>
                    </div>
                    <div className="mt-3 text-primary font-bold text-lg">{it.price.toLocaleString()} ر.س</div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {it.features.map((f: string) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Pay Now */}
                    <Dialog open={open && selected?.name === it.name} onOpenChange={(o) => { setOpen(o); if (!o) setSelected(null); }}>
                      <DialogTrigger asChild>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold"
                          onClick={() => { setSelected({ name: it.name, price: it.price }); setOpen(true); }}
                        >
                          <CreditCard className="w-5 h-5 ml-2" /> ادفع الآن
                          <ArrowRight className="w-5 h-5 mr-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-lg">الدفع لخدمة: {it.name}</DialogTitle>
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
                            {loading ? <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري إنشاء رابط الدفع</> : <><Lock className="w-4 h-4 ml-2" /> إتمام الدفع الآن ({it.price.toLocaleString()} ر.س)</>}
                          </Button>
                          <p className="text-xs text-muted-foreground">🔒 الدفع آمن عبر Paylink. سيتم فتح صفحة الدفع في تبويب جديد.</p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Book Appointment */}
                    <Dialog open={apptOpen} onOpenChange={setApptOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="w-full">
                          <Clock className="w-5 h-5 ml-2" /> احجز موعد
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-lg">حجز موعد لخدمة: {selected?.name || data.title}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="date">التاريخ</Label>
                            <Input id="date" type="date" value={appt.date} onChange={(e) => setAppt((s) => ({ ...s, date: e.target.value }))} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="time">الوقت</Label>
                            <Input id="time" type="time" value={appt.time} onChange={(e) => setAppt((s) => ({ ...s, time: e.target.value }))} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="note">ملاحظات</Label>
                            <Input id="note" placeholder="أي تفاصيل إضافية" value={appt.note} onChange={(e) => setAppt((s) => ({ ...s, note: e.target.value }))} />
                          </div>
                          <Button onClick={bookAppointment} className="w-full">
                            إرسال عبر واتساب
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`مرحباً، أود الاستفسار عن ${data.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="px-8">تواصل عبر واتساب</Button>
            </a>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link to="/book-consultation">احجز استشارة مجانية</Link>
            </Button>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-primary" />
            الأسعار بالريال السعودي (SAR) وتشمل ربط الدفع عبر Paylink.
          </div>

          <div className="mt-6 text-center">
            <Link to="/design-solutions" className="story-link text-sm">العودة إلى جميع أقسام حلول التصميم</Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
