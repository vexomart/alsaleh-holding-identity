/**
 * Index Page - Premium Homepage
 * Complete redesigned homepage with all sections
 */

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesPreviewSection from "@/components/ServicesPreviewSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import PartnersSection from "@/components/PartnersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";

// About Section Component (inline for simplicity)
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Target, 
  Shield,
  Globe,
  Rocket,
  ArrowLeft,
  Sparkles
} from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "رؤية طموحة",
      description: "نسعى لأن نكون الخيار الأول في حلول التقنية والإعلام في المنطقة",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "موثوقية عالية",
      description: "نلتزم بأعلى معايير الجودة والأمان في جميع مشاريعنا",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Rocket,
      title: "ابتكار مستمر",
      description: "نواكب أحدث التقنيات ونبتكر حلولاً متقدمة لعملائنا",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Globe,
      title: "تواجد عالمي",
      description: "نمتد بخدماتنا لتشمل عملاء من مختلف أنحاء العالم",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section dir="rtl" className="py-20 lg:py-28 relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-secondary/5 to-primary/5 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div className="flex items-center justify-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-full border border-primary/20">
              من نحن
            </span>
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            <span className="text-foreground">شركة </span>
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              ASH HOLDING
            </span>
          </h2>
          
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            منذ 2016 ونحن نقدم حلولاً تقنية متكاملة للشركات والمؤسسات في جميع أنحاء العالم
          </p>

          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-1 w-24 bg-gradient-to-l from-primary via-accent to-secondary mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary-variant to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">شركة قابضة رائدة</h3>
                <p className="text-sm text-muted-foreground">في الاستثمار التقني والإعلامي</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base">
              ASH HOLDING هي شركة قابضة سعودية رائدة تأسست عام 2016، متخصصة في الاستثمار والتطوير في قطاعات التقنية والإعلام الرقمي. نسعى لتقديم حلول مبتكرة تساهم في التحول الرقمي للمؤسسات.
            </p>

            <p className="text-muted-foreground leading-relaxed text-base">
              من خلال فريق عمل متميز وشراكات استراتيجية عالمية، نقدم مجموعة شاملة من الخدمات تشمل تطوير البرمجيات، الذكاء الاصطناعي، التسويق الرقمي، والاستشارات الإدارية.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/about">
                  <Button className="bg-gradient-to-l from-primary via-primary-variant to-accent text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20">
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/subsidiaries">
                  <Button variant="outline" className="font-semibold px-6 py-3 rounded-xl border-2">
                    <span>شركاتنا التابعة</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg h-full">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

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
          className="absolute top-1/4 right-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-gradient-to-tr from-secondary/10 via-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 w-32 sm:w-40 md:w-64 h-32 sm:h-40 md:h-64 bg-gradient-to-bl from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="relative">
          <HeroSection />
        </section>

        {/* Services Preview Section */}
        <section id="services">
          <ServicesPreviewSection />
        </section>

        {/* About Section */}
        <section id="about">
          <AboutSection />
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us">
          <WhyChooseUsSection />
        </section>

        {/* Partners & Trust Section */}
        <section id="partners">
          <PartnersSection />
        </section>

        {/* CTA Section */}
        <section id="cta">
          <CTASection />
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
