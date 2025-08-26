import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import RTLDesignSolutionsSection from "@/components/RTLDesignSolutionsSection";
import Footer from "@/components/Footer";

const DesignSolutions = () => {
  useEffect(() => {
    document.title = "حلول التصميم | شركة ASH HOLDING";
    const desc = "خدمات تصميم احترافية: هوية بصرية، تسويق، سوشيال ميديا، مطبوعات، رقمية، أعمال خاصة.";

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
    canonical.href = window.location.origin + window.location.pathname;
  }, []);
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navigation />
      
      <main className="relative">
        <RTLDesignSolutionsSection />
      </main>

      <Footer />
      
    </div>
  );
};

export default DesignSolutions;