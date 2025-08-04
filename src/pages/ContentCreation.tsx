import Navigation from "@/components/Navigation";
import ContentCreationSection from "@/components/ContentCreationSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ContentCreation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        <ContentCreationSection />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ContentCreation;