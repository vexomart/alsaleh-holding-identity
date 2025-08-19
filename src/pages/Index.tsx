import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy load below-the-fold components for better performance
import { lazy, Suspense } from "react";
const Footer = lazy(() => import("@/components/Footer"));
const ChatBot = lazy(() => import("@/components/ChatBot"));

import { Gift, Sparkles, ArrowRight, TrendingUp, Globe, Shield, Star, Monitor, Clock, Settings, Zap, Palette, Code2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";




const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px] overflow-x-hidden relative mobile-scroll">
      <PerformanceOptimizer />
      <ImageOptimizer />
      <Navigation />
      
      {/* Simplified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 to-accent/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-tr from-secondary/6 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section - Simplified */}
        <section id="home" className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/8">
          <HeroSection />
        </section>

        {/* Content Sections with Professional Spacing */}
        <div className="space-y-0">
        </div>
      </main>

      {/* Footer with Enhanced Styling - Lazy Loaded */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <Suspense fallback={<div className="h-96 bg-muted/10 animate-pulse" />}>
            <Footer />
          </Suspense>
        </div>
      </footer>

      {/* ChatBot Component - Lazy Loaded */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
};

export default Index;
