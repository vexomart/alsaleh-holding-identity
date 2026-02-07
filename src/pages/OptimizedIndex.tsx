/**
 * Optimized Index Page - Dark Theme Edition
 * MaxioCore-inspired design - Clean, professional, stable
 */

import { lazy, Suspense, memo } from "react";
import "@/styles/homepage-dark.css";

// Import dark theme components
import { NavigationDark } from "@/components/homepage/NavigationDark";
import { HeroSectionDark } from "@/components/homepage/HeroSectionDark";
import Footer from "@/components/Footer";

// Lazy load non-critical sections
const ServicesSectionDark = lazy(() => import("@/components/homepage/ServicesSectionDark"));
const AboutSectionDark = lazy(() => import("@/components/homepage/AboutSectionDark"));
const CTASectionDark = lazy(() => import("@/components/homepage/CTASectionDark"));

// Section wrapper with intersection observer
const LazySection = memo(({ 
  children, 
  fallback,
  id 
}: { 
  children: React.ReactNode;
  fallback: React.ReactNode;
  id: string;
}) => (
  <section id={id}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </section>
));
LazySection.displayName = "LazySection";

// Dark theme skeleton
const DarkSkeleton = memo(() => (
  <div className="hp-section">
    <div className="container mx-auto px-4">
      <div className="space-y-8">
        <div className="h-8 w-48 bg-[hsl(var(--hp-bg-card))] rounded mx-auto animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-[hsl(var(--hp-bg-card))] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
));
DarkSkeleton.displayName = "DarkSkeleton";

const OptimizedIndex = () => {
  return (
    <div dir="rtl" className="homepage-dark">
      {/* Navigation */}
      <NavigationDark />
      
      {/* Main Content */}
      <main>
        {/* Hero Section - Critical, loads immediately */}
        <section id="home">
          <HeroSectionDark />
        </section>

        {/* Services Section - Lazy with skeleton */}
        <LazySection id="services" fallback={<DarkSkeleton />}>
          <ServicesSectionDark />
        </LazySection>

        {/* About Section - Lazy with skeleton */}
        <LazySection id="about" fallback={<DarkSkeleton />}>
          <AboutSectionDark />
        </LazySection>

        {/* CTA Section - Lazy */}
        <LazySection id="cta" fallback={<DarkSkeleton />}>
          <CTASectionDark />
        </LazySection>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default memo(OptimizedIndex);
