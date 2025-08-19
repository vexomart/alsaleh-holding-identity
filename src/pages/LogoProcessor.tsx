import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LogoProcessor from "@/components/LogoProcessor";
import { PageHeader } from "@/components/ui/page-header";

const LogoProcessorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <Navigation />
      
      <main className="pt-[72px] lg:pt-[124px]">
        <PageHeader
          title="معالج الشعار"
          description="أداة لإزالة الخلفية من الشعار وضبط مقاسه"
          showBackButton={true}
        />
        
        <div className="container mx-auto px-6 py-12">
          <LogoProcessor />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LogoProcessorPage;