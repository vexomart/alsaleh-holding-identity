import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";

// Import the simple departments section
import DepartmentsIconsSection from "@/components/DepartmentsIconsSection";

import Footer from "@/components/Footer";
import SmartChatBot from "@/components/SmartChatBot";

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
      
      {/* Optimized Animated Background Elements - Mobile responsive */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-primary/8 via-secondary/4 to-accent/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-gradient-to-tr from-secondary/6 via-accent/4 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Minimal Geometric Patterns - Hidden on mobile for performance */}
        <div className="hidden md:block absolute top-20 right-20 w-3 h-3 bg-primary/15 rotate-45 animate-pulse"></div>
        <div className="hidden md:block absolute bottom-40 left-16 w-4 h-4 bg-accent/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section with Enhanced Background */}
        <section id="home" className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/8"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="relative z-10 container-fluid">
            <HeroSection />
          </div>
        </section>

        {/* Departments Icons Section */}
        <div className="container-fluid">
          <DepartmentsIconsSection />
        </div>
      </main>

      {/* Footer with Enhanced Styling */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <Footer />
        </div>
      </footer>

      {/* Smart ChatBot Component */}
      <SmartChatBot 
        position="bottom-right"
        showWelcomeMessage={true}
        showRating={true}
        theme="auto"
      />
      
    </div>
  );
};

export default Index;
