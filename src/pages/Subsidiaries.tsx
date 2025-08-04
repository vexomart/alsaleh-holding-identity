import Navigation from "@/components/Navigation";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Subsidiaries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        <SubsidiariesSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Subsidiaries;