import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import StatsSection from "@/components/StatsSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import ContactSection from "@/components/ContactSection";
import TeamSection from "@/components/TeamSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SignLanguageSupport from "@/components/SignLanguageSupport";


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
        <section id="stats">
          <StatsSection />
        </section>
        <section id="departments">
          <DepartmentsSection />
        </section>
        <section id="companies">
          <SubsidiariesSection />
        </section>
        <section id="team">
          <TeamSection />
        </section>
        <section id="commitments">
          <CommitmentsSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <SignLanguageSupport />
    </div>
  );
};

export default Index;
