import SEO from "@/components/SEO";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
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

      <PageHeader
        title="قائمة الخدمات والأسعار"
        description="سنُضيف هنا جميع الخدمات مع الباقات والأسعار خلال وقت قصير."
        showBackButton={false}
      />

      <section className="container-fluid py-10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-md">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p className="text-muted-foreground">
                  جاري تجهيز المحتوى — سيتم تحديث هذه الصفحة قريباً بقائمة الخدمات المفصلة والباقات والأسعار.
                </p>
              </div>

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
