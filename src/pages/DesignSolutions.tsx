import Navigation from "@/components/Navigation";
import DesignSolutionsSection from "@/components/DesignSolutionsSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const DesignSolutions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        <DesignSolutionsSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default DesignSolutions;