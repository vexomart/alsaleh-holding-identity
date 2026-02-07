/**
 * Index Page - Premium Dark Homepage
 * MaxioCore-inspired design - Clean, professional, stable
 */

import "@/styles/homepage-dark.css";
import { NavigationDark } from "@/components/homepage/NavigationDark";
import { HeroSectionDark } from "@/components/homepage/HeroSectionDark";
import { ServicesSectionDark } from "@/components/homepage/ServicesSectionDark";
import { AboutSectionDark } from "@/components/homepage/AboutSectionDark";
import { CTASectionDark } from "@/components/homepage/CTASectionDark";
import { FooterDark } from "@/components/homepage/FooterDark";

const Index = () => {
  return (
    <div dir="rtl" className="homepage-dark">
      {/* Navigation */}
      <NavigationDark />
      
      {/* Main Content */}
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

      {/* Footer */}
      <FooterDark />
    </div>
  );
};

export default Index;
