/**
 * Index Page - Premium Dark Homepage
 * MaxioCore-inspired design - Clean, professional, stable
 * NOTE: Header/Footer provided by UnifiedLayout - DO NOT add here
 */

import "@/styles/homepage-dark.css";
import { HeroSectionDark } from "@/components/homepage/HeroSectionDark";
import { ServicesSectionDark } from "@/components/homepage/ServicesSectionDark";
import { AboutSectionDark } from "@/components/homepage/AboutSectionDark";
import { CTASectionDark } from "@/components/homepage/CTASectionDark";

const Index = () => {
  return (
    <div dir="rtl" className="homepage-dark">
      {/* Main Content - Header/Footer provided by UnifiedLayout */}
      <main>
        {/* Hero Section */}
        <section id="home">
          <HeroSectionDark />
        </section>

        {/* Services Section */}
        <section id="services">
          <ServicesSectionDark />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSectionDark />
        </section>

        {/* CTA Section */}
        <section id="cta">
          <CTASectionDark />
        </section>
      </main>
    </div>
  );
};

export default Index;
