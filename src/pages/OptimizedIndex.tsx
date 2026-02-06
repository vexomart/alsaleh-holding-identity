/**
 * Optimized Index Page - Performance Enhanced
 * Uses lazy loading for sections and deferred animations
 */

import { lazy, Suspense, memo } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { useDeferredAnimation } from "@/hooks/useDeferredAnimation";
import { HeroSkeleton, ServicesGridSkeleton, SectionSkeleton } from "@/components/skeletons/PageSkeleton";

// Import OptimizedHeroSection directly (critical path)
import OptimizedHeroSection from "@/components/OptimizedHeroSection";

// Lazy load non-critical sections
const ServicesPreviewSection = lazy(() => import("@/components/ServicesPreviewSection"));
const WhyChooseUsSection = lazy(() => import("@/components/WhyChooseUsSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));
const CTASection = lazy(() => import("@/components/CTASection"));

// Lightweight About Section - inline for fast load
const AboutSectionLight = lazy(() => import("@/components/AboutSectionOptimized"));

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

// Minimal section skeleton
const MinimalSkeleton = memo(() => (
  <div className="py-16 lg:py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-muted rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
));
MinimalSkeleton.displayName = "MinimalSkeleton";

const OptimizedIndex = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background pt-14 lg:pt-[104px] overflow-x-hidden relative">
      <PerformanceOptimizer />
      <Navigation />
      
      {/* Lightweight static background - no animations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-br from-primary/5 via-accent/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-gradient-to-tr from-secondary/5 via-primary/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <main className="relative z-10">
        {/* Hero Section - Critical, loads immediately but defers animations */}
        <section id="home" className="relative">
          <OptimizedHeroSection />
        </section>

        {/* Services Preview Section - Lazy with skeleton */}
        <LazySection id="services" fallback={<ServicesGridSkeleton />}>
          <ServicesPreviewSection />
        </LazySection>

        {/* About Section - Lazy with skeleton */}
        <LazySection id="about" fallback={<MinimalSkeleton />}>
          <AboutSectionLight />
        </LazySection>

        {/* Why Choose Us Section - Lazy */}
        <LazySection id="why-us" fallback={<MinimalSkeleton />}>
          <WhyChooseUsSection />
        </LazySection>

        {/* Partners & Trust Section - Lazy */}
        <LazySection id="partners" fallback={<MinimalSkeleton />}>
          <PartnersSection />
        </LazySection>

        {/* CTA Section - Lazy */}
        <LazySection id="cta" fallback={<MinimalSkeleton />}>
          <CTASection />
        </LazySection>
      </main>

      {/* Footer */}
      <footer className="relative z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default memo(OptimizedIndex);
