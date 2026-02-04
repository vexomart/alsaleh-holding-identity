import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesPreviewSection from "@/components/ServicesPreviewSection";
import Footer from "@/components/Footer";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";

const Index = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background pt-14 lg:pt-[104px] overflow-x-hidden relative">
      <PerformanceOptimizer />
      <ImageOptimizer />
      <Navigation />
      
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 w-32 sm:w-40 md:w-64 h-32 sm:h-40 md:h-64 bg-gradient-to-bl from-pink-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Particles - Desktop Only */}
        <div className="hidden md:block">
          <motion.div
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 right-20 w-3 h-3 bg-blue-500/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [20, -20, 20],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-40 left-16 w-4 h-4 bg-purple-500/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute top-1/3 left-10 w-2 h-2 bg-emerald-500/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [15, -15, 15],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 3 }}
            className="absolute bottom-1/4 right-10 w-3 h-3 bg-amber-500/30 rounded-full"
          />
        </div>
      </div>
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="relative">
          <HeroSection />
        </section>

        {/* Services Section */}
        <section id="services">
          <ServicesPreviewSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10">
        <Footer />
      </footer>
    </div>
  );
};

export default Index;
