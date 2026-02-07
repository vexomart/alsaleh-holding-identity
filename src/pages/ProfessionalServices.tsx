import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import ServicesSection from "@/components/ServicesSection";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

const ProfessionalServices = () => {
  useEffect(() => {
    // SEO: title, meta description, canonical
    document.title = "خدماتنا الاحترافية | شركة ASH HOLDING";

    const desc =
      "خدماتنا الاحترافية التقنية والتسويقية بمعايير عالمية لرفع المبيعات وتحقيق أهداف عملك";
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
    canonical.href = window.location.origin + "/professional-services";
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="خدماتنا الاحترافية"
        description="نقدم مجموعة شاملة ومتكاملة من الخدمات التقنية والتسويقية المتطورة بمعايير عالمية لتحقيق أهدافك التجارية بأعلى مستويات الاحترافية"
        showBackButton={false}
      >
        <div className="flex justify-center">
          <Breadcrumb>
            <BreadcrumbList className="justify-center">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">الرئيسية</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>خدماتنا الاحترافية</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </PageHeader>

      {/* Services Section */}
      <section aria-labelledby="services-title" className="relative">
        <h2 id="services-title" className="sr-only">قائمة الخدمات</h2>
        <ServicesSection />
      </section>
    </PageContainer>
  );
};

export default ProfessionalServices;
