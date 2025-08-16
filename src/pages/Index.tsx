import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Remove direct imports, they are now lazy loaded

import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Gift, Sparkles, ArrowRight, TrendingUp, Globe, Shield, Star, Monitor, Clock, Settings, Zap, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";
import { lazy, Suspense } from "react";

// Lazy load heavy components
const DepartmentsSection = lazy(() => import("@/components/DepartmentsSection"));
const CommitmentsSection = lazy(() => import("@/components/CommitmentsSection"));




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

          {/* Enhanced Current Offers - Corporate Professional Design */}
          <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-background via-muted/5 to-accent/5">
            {/* Advanced Background Layers */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary))_0%,transparent_50%)] opacity-10"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--accent))_0%,transparent_50%)] opacity-10"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,hsl(var(--muted))_50%,transparent_70%)] opacity-5"></div>
            </div>
            
            {/* Floating Animated Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-tl from-accent/15 to-secondary/15 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/3 right-10 w-2 h-20 bg-gradient-to-b from-primary/30 to-transparent animate-pulse"></div>
            <div className="absolute bottom-1/3 left-10 w-2 h-16 bg-gradient-to-t from-accent/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                
                {/* Enhanced Header Section */}
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                        <Gift className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <Badge className="bg-gradient-to-r from-primary via-accent to-secondary text-white border-0 text-base px-6 py-2 rounded-full shadow-lg mb-6 animate-fade-in">
                    ⏰ عروض محدودة الوقت
                  </Badge>
                  
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-tight animate-scale-in">
                    عروضنا الحالية المميزة
                  </h2>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بمعايير عالمية وأسعار استثنائية
                  </p>
                </div>
                
                {/* Responsive Compact Offers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
                  
                  {/* Website Design Offer */}
                  <Card className="group relative overflow-hidden border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 animate-fade-in hover:-translate-y-2" 
                        style={{ animationDelay: '0.3s' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    <CardContent className="relative p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                        تصميم مواقع
                      </h3>
                      
                      <div className="text-xl font-bold gradient-text mb-3">
                        خصم حتى 35%
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        مواقع احترافية متجاوبة مع جميع الأجهزة
                      </p>
                      
                      <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3"></div>
                      
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 ml-1" />
                        عرض لمدة محدودة
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Integrated Services Offer */}
                  <Card className="group relative overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-500 hover:shadow-xl hover:shadow-accent/10 animate-fade-in hover:-translate-y-2" 
                        style={{ animationDelay: '0.4s' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    <CardContent className="relative p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-accent transition-colors duration-300">
                        خدمات متكاملة
                      </h3>
                      
                      <div className="text-xl font-bold gradient-text mb-3">
                        حلول تقنية متطورة
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        حلول شاملة لتطوير وتحسين أعمالك
                      </p>
                      
                      <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-secondary mx-auto rounded-full mb-3"></div>
                      
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Zap className="w-3 h-3 ml-1" />
                        تقنيات حديثة
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Visual Identity Offer */}
                  <Card className="group relative overflow-hidden border border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:shadow-xl hover:shadow-secondary/10 animate-fade-in hover:-translate-y-2 sm:col-span-2 lg:col-span-1" 
                        style={{ animationDelay: '0.5s' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    
                    <CardContent className="relative p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Palette className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-secondary transition-colors duration-300">
                        هوية بصرية
                      </h3>
                      
                      <div className="text-xl font-bold gradient-text mb-3">
                        خصم حتى 40%
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        تصميم هوية بصرية مميزة وشعارات احترافية
                      </p>
                      
                      <div className="w-16 h-0.5 bg-gradient-to-r from-secondary to-primary mx-auto rounded-full mb-3"></div>
                      
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3 ml-1" />
                        تصميم إبداعي
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Enhanced CTA Section */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Link to="/current-offers">
                    <Button 
                      size="lg" 
                      className="group relative overflow-hidden bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-bold px-16 py-8 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-shimmer"></div>
                      <Gift className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                      شاهد جميع العروض الحالية
                      <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  
                  <div className="mt-8">
                    <div className="inline-flex items-center bg-background/60 backdrop-blur-sm px-8 py-4 rounded-2xl border border-border/30 shadow-lg">
                      <div className="flex items-center text-muted-foreground">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-3"></div>
                        <span className="font-medium">عروض محدودة الوقت - لا تفوت الفرصة!</span>
                        <Clock className="w-5 h-5 mr-3 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </section>


          {/* Departments Section - Professional Corporate */}
          <section id="departments" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/6 via-background to-accent/8"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,hsl(var(--secondary))_0%,transparent_40%),radial-gradient(ellipse_at_30%_70%,hsl(var(--accent))_0%,transparent_40%)] opacity-20"></div>
            
            {/* Corporate Design Elements */}
            <div className="absolute top-24 left-24 w-72 h-72 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-24 right-24 w-96 h-96 bg-gradient-to-tl from-accent/12 to-primary/8 rounded-full blur-3xl animate-float-delayed"></div>
            
            {/* Professional Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:120px_120px] opacity-20"></div>
            
            <div className="relative z-10">
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <DepartmentsSection />
              </Suspense>
            </div>
          </section>



          {/* Commitments Section - Global Enterprise Style */}
          <section id="commitments" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-secondary/12"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_270deg_at_20%_80%,transparent,hsl(var(--primary))_15%,transparent_35%,hsl(var(--secondary))_55%,transparent)] opacity-25"></div>
            
            {/* Enterprise-grade Visual Elements */}
            <div className="absolute top-16 left-16 w-80 h-80 bg-gradient-to-br from-primary/12 to-secondary/8 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-16 right-16 w-64 h-64 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-2xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/8 to-primary/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Corporate Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-25"></div>
            
            <div className="relative z-10">
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <CommitmentsSection />
              </Suspense>
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
