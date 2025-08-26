import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Remove direct imports, they are now lazy loaded

import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
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
      
      {/* Optimized Animated Background Elements - Reduced for performance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 via-secondary/4 to-accent/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-tr from-secondary/6 via-accent/4 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Minimal Geometric Patterns */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-primary/15 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-accent/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section with Enhanced Background */}
        <section id="home" className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/8"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <HeroSection />
          </div>
        </section>

        {/* Content Sections with Professional Spacing */}
        <div className="space-y-0">



          {/* Services Preview Section */}
          <section className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/6 via-background to-accent/8"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,hsl(var(--secondary))_0%,transparent_40%),radial-gradient(ellipse_at_30%_70%,hsl(var(--accent))_0%,transparent_40%)] opacity-20"></div>
            
            {/* Corporate Design Elements */}
            <div className="absolute top-24 left-24 w-72 h-72 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-24 right-24 w-96 h-96 bg-gradient-to-tl from-accent/12 to-primary/8 rounded-full blur-3xl animate-float-delayed"></div>
            
            {/* Professional Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:120px_120px] opacity-20"></div>
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16 animate-fade-in">
                
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                  نقدم مجموعة شاملة من الخدمات المتطورة في مختلف المجالات التقنية والإبداعية لتلبية احتياجاتكم المتنوعة
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[
                  { 
                    title: "الخدمات التقنية", 
                    description: "أقسام متخصصة في أحدث التقنيات العالمية", 
                    icon: Code2, 
                    href: "/technical-services",
                    color: "from-blue-600 to-purple-600",
                    stats: "8 أقسام متخصصة"
                  },
                  { 
                    title: "خدمات الأعمال", 
                    description: "حلول شاملة لتطوير ونمو الأعمال", 
                    icon: Building2, 
                    href: "/business-services",
                    color: "from-emerald-600 to-teal-600",
                    stats: ""
                  },
                  { 
                    title: "العروض الحالية", 
                    description: "أفضل العروض والخصومات المحدودة", 
                    icon: Gift, 
                    href: "/current-offers",
                    color: "from-orange-600 to-red-600",
                    stats: "خصومات حتى 50%"
                  }
                ].map((service, index) => (
                  <Card key={index} className="group hover:scale-105 transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 overflow-hidden">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {service.stats}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild className="group-hover:text-primary">
                          <Link to={service.href}>
                            استكشف
                            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  <Link to="/services-catalog">
                    عرض جميع خدماتنا
                    <Sparkles className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>




        </div>
      </main>

      {/* Footer with Enhanced Styling */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <Footer />
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
};

export default Index;
