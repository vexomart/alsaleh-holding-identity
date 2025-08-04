import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ServicesSection from "@/components/ServicesSection";

const ProfessionalServices = () => {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 md:pt-32 overflow-x-hidden">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/80 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/20"></div>
          <div className="absolute top-5 right-5 sm:top-10 sm:right-10 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 w-24 h-24 sm:w-64 sm:h-64 bg-gradient-to-br from-cyan-200/30 to-emerald-200/30 rounded-full blur-xl sm:blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 dark:text-white mb-6">
                خدماتنا الاحترافية
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                نقدم مجموعة شاملة من الخدمات التقنية والتسويقية المتطورة بمعايير عالمية لتحقيق أهدافك التجارية
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProfessionalServices;