import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PaymentDialog } from "@/components/ui/PaymentDialog";
import brandIdentityImg from "@/assets/brand-identity-service.jpg";
import marketingDesignsImg from "@/assets/marketing-designs-service.jpg";
import socialMediaImg from "@/assets/social-media-service.jpg";
import printAdsImg from "@/assets/print-ads-service.jpg";
import digitalDesignsImg from "@/assets/digital-designs-service.jpg";
import customDesignsImg from "@/assets/custom-designs-service.jpg";
import { Sparkles, CreditCard, Loader2, Lock, Calendar, Clock, ArrowRight, CheckCircle, Palette, Megaphone, MessageCircle, Printer, MonitorSmartphone, Wrench, Crown, IdCard, FileText, BookOpen, Package, Shirt, Gift, Edit3, Layout, Image, Layers, BadgeCheck, BarChart3, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Catalog with detailed features and delivery times
const catalog = {
  "brand-identity": {
    title: "تصاميم الهوية البصرية",
    description: "بناء هوية قوية ومتسقة ترسخ علامتك في أذهان عملائك.",
    accent: {
      headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800",
      chip: "from-success to-success/80",
    },
    items: [
      { name: "تصميم الشعار (Logo Design)", desc: "شعار فريد يعكس شخصية علامتك.", price: 1499, delivery: "4-7 أيام", features: ["3 مقترحات أولية", "تعديلات غير محدودة حتى الاعتماد", "ملفات مفتوحة ومتجهية"] },
      { name: "تصميم هوية كاملة (Full Brand Identity)", desc: "حزمة هوية متكاملة لجميع اللمسات البصرية.", price: 6999, delivery: "2-3 أسابيع", features: ["شعار احترافي", "هوية مطبوعة ورقمية", "دليل استخدام الهوية"] },
      { name: "البزنس كارد (Business Card)", desc: "بطاقات أعمال أنيقة واحترافية.", price: 249, delivery: "1-2 يوم", features: ["تصميمين للاختيار", "جاهز للطباعة", "صياغة احترافية"] },
      { name: "الأوراق الرسمية (Letterhead & Envelopes)", desc: "هوية مراسلات تعزز الثقة.", price: 449, delivery: "2-3 أيام", features: ["خطابات رسمية", "مغلفات", "إصدار رقمي للطباعة"] },
      { name: "دليل الهوية (Brand Guidelines)", desc: "دليل استخدام الهوية لضمان الاتساق.", price: 2399, delivery: "5-7 أيام", features: ["الألوان والخطوط", "الاستخدامات الصحيحة والخاطئة", "أمثلة تطبيقية"] },
    ],
  },
  "marketing-designs": {
    title: "التصاميم التسويقية",
    description: "مواد تسويقية مؤثرة لرفع الوعي وزيادة التحويلات.",
    accent: { headerBg: "bg-gradient-to-br from-rose-50 via-amber-50 to-primary/10 dark:from-slate-900 dark:via-slate-800 dark:to-primary/10", chip: "from-success to-success/80" },
    items: [
      { name: "البروشور (Brochure)", desc: "تعريف احترافي بالخدمات والمنتجات.", price: 749, delivery: "3-5 أيام", features: ["تصميم احترافي", "قياسات متعددة", "جاهز للطباعة"] },
      { name: "الفلاير (Flyer)", desc: "منشورات دعائية سريعة التأثير.", price: 299, delivery: "1-2 يوم", features: ["مقاسين للاختيار", "محتوى موجز", "تدرجات لونية جذابة"] },
      { name: "البنرات الإعلانية (Banner Ads)", desc: "بنرات ثابتة ومتحركة للحملات.", price: 549, delivery: "2-3 أيام", features: ["نسخ متعددة", "مقاسات منصات مختلفة", "تحسين للأداء"] },
      { name: "البوسترات (Poster)", desc: "إعلانات كبيرة لافتة للأنظار.", price: 649, delivery: "2-4 أيام", features: ["هوية متسقة", "حروف واضحة", "جاهز للطباعة"] },
      { name: "الكتالوجات (Catalog)", desc: "عرض منظم وجذاب لمنتجاتك.", price: 2199, delivery: "1-2 أسبوع", features: ["تنسيق صفحات", "صور عالية الجودة", "PDF + للطباعة"] },
    ],
  },
  "social-media": {
    title: "تصاميم وسائل التواصل الاجتماعي",
    description: "تواجد قوي وجذاب على كافة المنصات.",
    accent: { headerBg: "bg-gradient-to-br from-violet-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-success to-success/80" },
    items: [
      { name: "تصميم المنشورات (Posts)", desc: "قوالب جذابة ومتناسقة.", price: 149, delivery: "24-48 ساعة", features: ["قوالب متعددة", "أبعاد المنصات", "قابلة للتعديل"] },
      { name: "تصميم القصص (Stories)", desc: "قصص قصيرة ملفتة.", price: 119, delivery: "24 ساعة", features: ["حركة خفيفة", "مطبوعات جذابة", "أبعاد مناسبة"] },
      { name: "أغلفة الصفحات (Covers)", desc: "غلاف احترافي معبر عن الهوية.", price: 299, delivery: "1-2 يوم", features: ["صورة غلاف", "صورة بروفايل", "تنسيق منصات"] },
      { name: "تصميم للإعلانات الممولة", desc: "تصاميم مهيئة للأداء والتفاعل.", price: 229, delivery: "24-48 ساعة", features: ["CTA واضح", "تجارب A/B", "متوافق مع السياسات"] },
      { name: "حزمة قوالب جاهزة", desc: "قوالب قابلة للتعديل لتوفير الوقت.", price: 799, delivery: "3-5 أيام", features: ["ملفات مصدر", "أدلة استخدام", "تدرجات وألوان"] },
    ],
  },
  "print-ads": {
    title: "التصاميم الإعلانية المطبوعة",
    description: "تصاميم مطبوعة عالية الجودة للتأثير التقليدي الحديث.",
    accent: { headerBg: "bg-gradient-to-br from-amber-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-success to-success/80" },
    items: [
      { name: "اللوحات الطرقية (Billboard)", desc: "رسائل قوية على نطاق واسع.", price: 1899, delivery: "1-2 أسبوع", features: ["أحجام متعددة", "موك أب واقعي", "ملفات للطباعة"] },
      { name: "ستاند رول أب (Roll-up)", desc: "لافتات معارض فعالة.", price: 299, delivery: "2-3 أيام", features: ["قياسات معيارية", "تصميمين", "ملفات للطباعة"] },
      { name: "إعلانات الصحف والمجلات", desc: "تصاميم مطبوعة مؤثرة.", price: 799, delivery: "3-5 أيام", features: ["توافق المقاسات", "نسخ متعددة", "إخراج للطباعة"] },
      { name: "الدعوات وبطاقات المناسبات", desc: "بطاقات أنيقة لكل مناسبة.", price: 449, delivery: "2-4 أيام", features: ["تصاميم موضوعية", "ورق مقترح", "جاهزة للطباعة"] },
    ],
  },
  "digital-designs": {
    title: "التصاميم الرقمية",
    description: "حلول رقمية متوافقة مع جميع الأجهزة والمنصات.",
    accent: { headerBg: "bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-slate-900 dark:to-slate-800", chip: "from-success to-success/80" },
    items: [
      { name: "واجهات المواقع (Website UI)", desc: "واجهات احترافية وسريعة.", price: 3299, delivery: "1-2 أسبوع", features: ["تصميم صفحات رئيسية", "نمط مكونات UI", "توافق جوال"] },
      { name: "واجهات التطبيقات (App UI)", desc: "تجربة استخدام عصرية وسهلة.", price: 4299, delivery: "2-3 أسابيع", features: ["خرائط تدفق", "مكونات قابلة لإعادة الاستخدام", "تصميم متجاوب"] },
      { name: "العروض التقديمية (Pitch Deck)", desc: "عروض قوية للشركات والمستثمرين.", price: 1699, delivery: "3-5 أيام", features: ["قوالب احترافية", "رسوم بيانية", "تحسين الرسائل"] },
      { name: "الإنفوجرافيك (Infographic)", desc: "تبسيط البيانات برسوم جذابة.", price: 549, delivery: "2-4 أيام", features: ["أيقونات مخصصة", "ألوان متناسقة", "ملف SVG + PNG"] },
      { name: "النشرات البريدية (Newsletter)", desc: "قوالب إيميل فعالة وجذابة.", price: 599, delivery: "2-3 أيام", features: ["متوافقة مع مزودي البريد", "CTA واضح", "تحسين للجوال"] },
    ],
  },
  "custom-designs": {
    title: "التصاميم الخاصة",
    description: "حلول مخصصة تلبي احتياجاتك الفردية بكفاءة.",
    accent: { headerBg: "bg-gradient-to-br from-teal-50 via-primary/10 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900", chip: "from-success to-success/80" },
    items: [
      { name: "مطبوعات دعائية للشركات", desc: "كل ما يدعم صورة شركتك.", price: 1699, delivery: "3-7 أيام", features: ["تصاميم متسقة", "إخراج للطباعة", "خيارات متعددة"] },
      { name: "تصميم المنتجات والعلب", desc: "تغليف يزيد جاذبية المنتج.", price: 1999, delivery: "1-2 أسبوع", features: ["تصميم 3D", "مقترحات مواد", "ملفات للطباعة"] },
      { name: "الهدايا الدعائية", desc: "هدايا مخصصة للتسويق.", price: 999, delivery: "3-5 أيام", features: ["خيارات متنوعة", "تصميمين", "موك أب"] },
      { name: "تصميم الملابس والتيشيرتات", desc: "أزياء بتصاميم إبداعية.", price: 349, delivery: "2-4 أيام", features: ["مقاسات مختلفة", "ملفات للطباعة", "تصميمين"] },
      { name: "تحسين وتعديل التصاميم", desc: "تحسين أو تعديل أي تصميم قديم.", price: 249, delivery: "1-2 يوم", features: ["تحسين جودة", "تنسيق ملفات", "تصحيح ألوان"] },
    ],
  },
} as const;

type CatalogKey = keyof typeof catalog;

const whatsappNumber = "966555812567";

export default function DesignCategory() {
  const { slug } = useParams<{ slug: CatalogKey }>();
  const { toast } = useToast();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selected, setSelected] = useState<{ name: string; price: number } | null>(null);

  // Appointment dialog state
  const [apptOpen, setApptOpen] = useState(false);
  const [appt, setAppt] = useState({ date: "", time: "", note: "" });

  const data = catalog[(slug as CatalogKey) || "brand-identity"];
  
  const serviceImages = {
    "brand-identity": brandIdentityImg,
    "marketing-designs": marketingDesignsImg,
    "social-media": socialMediaImg,
    "print-ads": printAdsImg,
    "digital-designs": digitalDesignsImg,
    "custom-designs": customDesignsImg,
  } as const;
  
  const currentImage = serviceImages[(slug as CatalogKey) || "brand-identity"];

  const iconMap = {
    "brand-identity": Palette,
    "marketing-designs": Megaphone,
    "social-media": MessageCircle,
    "print-ads": Printer,
    "digital-designs": MonitorSmartphone,
    "custom-designs": Wrench,
  } as const;
  const CatIcon: any = (iconMap as any)[(slug as CatalogKey) || "brand-identity"] || Sparkles;

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("شعار")) return Crown;
    if (n.includes("هوية")) return Palette;
    if (n.includes("بزنس") || n.includes("بطاقات")) return IdCard;
    if (n.includes("الأوراق") || n.includes("خطابات")) return FileText;
    if (n.includes("دليل")) return BookOpen;
    if (n.includes("بروشور")) return Layout;
    if (n.includes("فلاير")) return Megaphone;
    if (n.includes("بنرات") || n.includes("بوسترات") || n.includes("أغلفة") || n.includes("منشورات") || n.includes("قوالب")) return Image;
    if (n.includes("كتالوج")) return Layers;
    if (n.includes("واجهات المواقع") || n.includes("المواقع")) return MonitorSmartphone;
    if (n.includes("واجهات التطبيقات") || n.includes("التطبيقات")) return MonitorSmartphone;
    if (n.includes("العروض التقديمية") || n.includes("عرض")) return Layout;
    if (n.includes("الإنفوجرافيك")) return BarChart3;
    if (n.includes("النشرات البريدية") || n.includes("إيميل")) return Mail;
    if (n.includes("billboard") || n.includes("اللوحات")) return Megaphone;
    if (n.includes("roll") || n.includes("رول")) return BadgeCheck;
    if (n.includes("الصحف") || n.includes("المجلات")) return FileText;
    if (n.includes("الدعوات") || n.includes("المناسبات")) return Gift;
    if (n.includes("المنتجات") || n.includes("العلب")) return Package;
    if (n.includes("الملابس") || n.includes("تيشيرت")) return Shirt;
    if (n.includes("الهدايا")) return Gift;
    if (n.includes("تحسين") || n.includes("تعديل")) return Edit3;
    return CatIcon;
  };

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

  const handleQuickPayment = (service: { name: string; price: number }) => {
    setSelected(service);
    setPaymentOpen(true);
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

      <header className={`relative bg-gradient-to-br from-success/10 via-success/5 to-success/0 dark:from-success/20 dark:via-slate-900 dark:to-slate-900 border-b border-white/20 dark:border-slate-700/50 py-16 px-6 text-center animate-fade-in`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/80"></div>
        <div className="relative max-w-3xl mx-auto">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${data.accent.chip} text-white text-sm font-medium shadow` }>
            <CatIcon className="w-4 h-4 pulse" />
            <Sparkles className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
            قسم: {data.title}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
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
            {data.items.map((it, idx) => {
              const SvcIcon: any = getServiceIcon(it.name);
              return (
                <Card key={it.name} className="group relative overflow-hidden border-2 border-success/10 hover:border-success/30 transition-all animate-fade-in">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-success/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl pointer-events-none hidden sm:block" />
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl pointer-events-none hidden sm:block" />
                  <div className="absolute top-3 right-3 opacity-20 text-success hidden sm:block">
                    <CatIcon className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-20 text-success hidden sm:block">
                    <Sparkles className="w-6 h-6 animate-bounce" />
                  </div>

                  <AspectRatio ratio={16/9}>
                    <img
                      src={currentImage}
                      alt={`صورة خدمة ${it.name}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </AspectRatio>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                          <SvcIcon className="w-5 h-5 animate-[float_4s_ease-in-out_infinite]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">{it.name}</h2>
                          <p className="text-sm text-muted-foreground mt-0.5">{it.desc}</p>
                        </div>
                      </div>
                      {idx === 0 ? (
                        <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow">الأكثر طلباً</Badge>
                      ) : (
                        <Badge variant="secondary">أفضل قيمة</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-success font-extrabold text-xl">{it.price.toLocaleString()} ر.س</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>مدة التنفيذ: {it.delivery}</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {it.features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* Quick Pay Button */}
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success text-white font-bold transition-all duration-300"
                        onClick={() => handleQuickPayment({ name: it.name, price: it.price })}
                      >
                        <CreditCard className="w-5 h-5 ml-2" /> ادفع الآن
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </Button>

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
              );
            })}
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
            <Sparkles className="inline-block w-4 h-4 ml-1 align-[-2px] text-success" />
            الأسعار بالريال السعودي (SAR) وتشمل ربط الدفع عبر Paylink.
          </div>

          <div className="mt-6 text-center">
            <Link to="/design-solutions" className="story-link text-sm">العودة إلى جميع أقسام حلول التصميم</Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Enhanced Payment Dialog */}
      {selected && (
        <PaymentDialog
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          service={{
            name: selected.name,
            price: selected.price,
            category: data.title
          }}
          onSuccess={() => {
            setSelected(null);
            setPaymentOpen(false);
          }}
        />
      )}
    </div>
  );
}
