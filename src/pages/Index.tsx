import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdvancedSEO } from "@/components/AdvancedSEO";
import { HeroSkeleton, DepartmentsSkeleton } from "@/components/SkeletonLoader";
import { lazy, Suspense } from "react";

// Remove direct imports, they are now lazy loaded

import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { Gift, Sparkles, ArrowRight, TrendingUp, Globe, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { ImageOptimizer } from "@/components/ImageOptimizer";

// Lazy load heavy components
const DepartmentsSection = lazy(() => import("@/components/DepartmentsSection"));
const CommitmentsSection = lazy(() => import("@/components/CommitmentsSection"));




const Index = () => {
  return (
    <>
      <AdvancedSEO 
        title="شركة علي صالح الشهري القابضة - الرئيسية"
        description="شركة قابضة رائدة في الاستثمار التقني والإعلامي في المملكة العربية السعودية. نقدم خدمات متكاملة في التقنية والإعلام والاستثمار."
        keywords={["الصفحة الرئيسية", "خدمات متكاملة", "استثمار", "تقنية متطورة"]}
      />
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
              <Suspense fallback={<HeroSkeleton />}>
                <HeroSection />
              </Suspense>
            </div>
          </section>

        {/* Content Sections with Professional Spacing */}
        <div className="space-y-0">

          {/* Current Offers - Professional Global Style */}
          <section className="relative py-12 lg:py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-primary/6 to-secondary/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent))_0%,transparent_30%),radial-gradient(circle_at_20%_80%,hsl(var(--primary))_0%,transparent_30%)] opacity-20"></div>
            
            {/* Professional Floating Elements */}
            <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/15 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-16 left-16 w-20 h-20 bg-gradient-to-tl from-secondary/20 to-accent/15 rounded-full blur-xl animate-float-delayed"></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full mb-4 shadow-glow animate-pulse">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 text-base px-6 py-2 shadow-lg">
                    عروض محدودة الوقت
                  </Badge>
                </div>
                
                <h2 className="text-3xl lg:text-5xl font-bold mb-6 gradient-text leading-tight">
                  عروضنا الحالية المميزة
                </h2>
                
                <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بمعايير عالمية وأسعار استثنائية
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="glass-effect border border-accent/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl font-bold gradient-text mb-2">تصميم مواقع</div>
                        <div className="text-accent font-semibold text-base">خصم حتى 35%</div>
                        <div className="w-8 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-3"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-primary/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl font-bold gradient-text mb-2">خدمات متكاملة</div>
                        <div className="text-primary font-semibold text-base">حلول تقنية متطورة</div>
                        <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-3"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-secondary/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl font-bold gradient-text mb-2">هوية بصرية</div>
                        <div className="text-secondary font-semibold text-base">خصم حتى 40%</div>
                        <div className="w-8 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mt-3"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center">
                  <Link to="/current-offers">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-accent via-primary to-secondary hover:from-accent/90 hover:via-primary/90 hover:to-secondary/90 text-white font-bold px-8 py-4 text-lg shadow-glow hover:shadow-xl transition-all duration-300 hover-scale"
                    >
                      <Gift className="w-5 h-5 ml-2" />
                      شاهد جميع العروض الحالية
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-4 text-muted-foreground">
                  <div className="inline-flex items-center bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 text-sm">
                    ⏰ عروض محدودة الوقت - لا تفوت الفرصة!
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Departments Section - Professional Corporate */}
          <section id="departments" className="relative py-16 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/6 via-background to-accent/8"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,hsl(var(--secondary))_0%,transparent_40%),radial-gradient(ellipse_at_30%_70%,hsl(var(--accent))_0%,transparent_40%)] opacity-20"></div>
            
            {/* Corporate Design Elements */}
            <div className="absolute top-12 left-12 w-32 h-32 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-12 right-12 w-40 h-40 bg-gradient-to-tl from-accent/12 to-primary/8 rounded-full blur-3xl animate-float-delayed"></div>
            
            {/* Professional Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:120px_120px] opacity-20"></div>
            
            <div className="relative z-10">
              <Suspense fallback={<DepartmentsSkeleton />}>
                <DepartmentsSection />
              </Suspense>
            </div>
          </section>



          {/* Commitments Section - Global Enterprise Style */}
          <section id="commitments" className="relative py-16 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-secondary/12"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_270deg_at_20%_80%,transparent,hsl(var(--primary))_15%,transparent_35%,hsl(var(--secondary))_55%,transparent)] opacity-25"></div>
            
            {/* Enterprise-grade Visual Elements */}
            <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-primary/12 to-secondary/8 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-8 right-8 w-28 h-28 bg-gradient-to-tl from-secondary/15 to-accent/10 rounded-full blur-2xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-accent/8 to-primary/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Corporate Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-25"></div>
            
            <div className="relative z-10">
              <Suspense fallback={<DepartmentsSkeleton />}>
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
    </>
  );
};

export default Index;
