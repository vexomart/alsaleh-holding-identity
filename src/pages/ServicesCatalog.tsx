import SEO from "@/components/SEO";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Mail, Phone } from "lucide-react";

const ServicesCatalog = () => {
  const title = "قائمة الخدمات والأسعار | شركة علي الشهري القابضة";
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

  return (
    <PageContainer showNavigation showFooter>
      <SEO title={title} description={description} canonicalUrl={canonical} jsonLd={jsonLd} />

      {/* Offset for fixed header */}
      <div className="pt-[48px] lg:pt-[112px]" />

      {/* Hero */}
      <section className="relative corporate-gradient overflow-hidden py-16 md:py-24 text-center animate-fade-in">
        <div className="container-fluid">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            قائمة الخدمات والأسعار
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            سنُضيف هنا جميع الخدمات مع الباقات والأسعار خلال وقت قصير. تابعنا للاطلاع على التحديثات قريباً.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>جاري التجهيز</span>
          </div>
        </div>
      </section>

      {/* Placeholder Grid */}
      <section className="container-fluid py-10 animate-fade-in">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="shadow-corporate hover-scale">
              <CardHeader>
                <CardTitle className="text-base">قسم خدمة</CardTitle>
                <CardDescription>سيتم إضافة التفاصيل قريباً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container-fluid py-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">كيف سنعمل معك</h2>
          <ol className="space-y-4">
            <li className="rounded-xl border border-border bg-card p-4 shadow-md animate-fade-in">
              <div className="font-medium">١) استلام قائمة الخدمات والباقات</div>
              <p className="text-sm text-muted-foreground mt-1">أرسل الخدمات والتفاصيل التي تريد عرضها.</p>
            </li>
            <li className="rounded-xl border border-border bg-card p-4 shadow-md animate-fade-in">
              <div className="font-medium">٢) ترتيب الأقسام وإضافة التسعير</div>
              <p className="text-sm text-muted-foreground mt-1">نقوم بتنسيق الصفحة وإضافة جميع الباقات بشكل منظم.</p>
            </li>
            <li className="rounded-xl border border-border bg-card p-4 shadow-md animate-fade-in">
              <div className="font-medium">٣) المراجعة والنشر</div>
              <p className="text-sm text-muted-foreground mt-1">نراجع الشكل النهائي معك ثم ننشر الصفحة.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="container-fluid pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-md">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <a href="tel:0555812567">
                    <Phone className="w-4 h-4 ml-2" />
                    اتصل بنا
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:info@alialshehriholding.com">
                    <Mail className="w-4 h-4 ml-2" />
                    راسلنا
                  </a>
                </Button>
                <Button className="w-full" asChild>
                  <a href="/start-with-us">
                    <FileText className="w-4 h-4 ml-2" />
                    ابدأ معنا الآن
                  </a>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                ملاحظة: قد تتوفر أسعار خاصة للمشاريع الكبيرة أو العقود طويلة الأجل.
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default ServicesCatalog;
