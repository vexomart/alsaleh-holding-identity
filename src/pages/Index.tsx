import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="vision">
          <VisionSection />
        </section>
        <section id="departments">
          <DepartmentsSection />
        </section>
        <section id="companies">
          <SubsidiariesSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
