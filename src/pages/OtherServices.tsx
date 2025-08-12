import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import OtherServicesSection from "@/components/OtherServicesSection";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

const OtherServices = () => {
  useEffect(() => {
    // SEO: title, meta description, canonical
    document.title = "خدماتنا الأخرى | شركة علي الشهري القابضة";

    const desc = "مجموعة شاملة من خدماتنا الأخرى المساندة بجودة عالية وتلبية لجميع الاحتياجات";
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
    canonical.href = window.location.origin + "/other-services";
  }, []);

  return (
    <PageContainer showNavigation showFooter>
      <PageHeader
        title="خدماتنا الأخرى"
        description="مجموعة متنوعة من الخدمات المساندة لتلبية جميع احتياجاتك بجودة واحترافية"
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
                <BreadcrumbPage>خدماتنا الأخرى</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </PageHeader>

      {/* Other Services Section */}
      <section aria-labelledby="other-services-title" className="relative">
        <h2 id="other-services-title" className="sr-only">خدماتنا الأخرى</h2>
        <OtherServicesSection />
      </section>
    </PageContainer>
  );
};

export default OtherServices;
