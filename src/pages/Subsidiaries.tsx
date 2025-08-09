import Navigation from "@/components/Navigation";
import SubsidiariesSection from "@/components/SubsidiariesSection";
import Footer from "@/components/Footer";


const Subsidiaries = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative">
        <SubsidiariesSection />
      </main>

      <Footer />
      
    </div>
  );
};

export default Subsidiaries;