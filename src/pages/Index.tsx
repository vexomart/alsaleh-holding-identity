import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import StatsSection from "@/components/StatsSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import PaymentMethodsSection from "@/components/PaymentMethodsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";



const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative z-10">
          <HeroSection />
        </section>

        {/* Content Sections with Proper Spacing */}
        <div className="space-y-0">
          {/* About Section */}
          <section id="about" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-primary/5"></div>
            <div className="relative z-10">
              <AboutSection />
            </div>
          </section>

          {/* Vision Section */}
          <section id="vision" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
            <div className="relative z-10">
              <VisionSection />
            </div>
          </section>

          {/* Stats Section */}
          <section id="stats" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-primary/5 to-background"></div>
            <div className="relative z-10">
              <StatsSection />
            </div>
          </section>

          {/* Departments Section */}
          <section id="departments" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-primary/5"></div>
            <div className="relative z-10">
              <DepartmentsSection />
            </div>
          </section>

          {/* Subsidiaries Section */}
          <section id="companies" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
            <div className="relative z-10">
              <SubsidiariesSection />
            </div>
          </section>

          {/* Commitments Section */}
          <section id="commitments" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-primary/5 to-background"></div>
            <div className="relative z-10">
              <CommitmentsSection />
            </div>
          </section>

          {/* Payment Methods Section */}
          <section id="payment-methods" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-primary/5"></div>
            <div className="relative z-10">
              <PaymentMethodsSection />
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="relative py-8 md:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
            <div className="relative z-10">
              <ContactSection />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8">
        <Footer />
      </footer>

      {/* Floating Elements */}
      <WhatsAppButton />
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Index;
