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

        {/* Content Sections with Optimized Spacing */}
        <div className="space-y-4 lg:space-y-6">

          {/* Current Offers Section - Compact & Professional */}
          <section className="relative py-6 lg:py-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/3 to-secondary/5"></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full mb-3">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 px-4 py-1">
                    عروض محدودة الوقت
                  </Badge>
                </div>
                
                <h2 className="text-2xl lg:text-4xl font-bold mb-4 gradient-text">
                  عروضنا الحالية المميزة
                </h2>
                
                <p className="text-base lg:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="glass-effect border border-accent/20 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold gradient-text mb-1">تصميم مواقع</div>
                      <div className="text-accent font-semibold">خصم حتى 35%</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-primary/20 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold gradient-text mb-1">خدمات متكاملة</div>
                      <div className="text-primary font-semibold">حلول تقنية متطورة</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-secondary/20 hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="p-4 text-center">
                      <div className="text-xl font-bold gradient-text mb-1">هوية بصرية</div>
                      <div className="text-secondary font-semibold">خصم حتى 40%</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center">
                  <Link to="/current-offers">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-accent via-primary to-secondary hover:opacity-90 text-white font-bold px-6 py-3 shadow-lg transition-all duration-300"
                    >
                      <Gift className="w-4 h-4 ml-2" />
                      شاهد جميع العروض
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Departments Section - Compact */}
          <section id="departments" className="relative py-6 lg:py-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/3 via-background to-accent/4"></div>
            
            <div className="relative z-10">
              <Suspense fallback={<DepartmentsSkeleton />}>
                <DepartmentsSection />
              </Suspense>
            </div>
          </section>

          {/* Commitments Section - Compact */}
          <section id="commitments" className="relative py-6 lg:py-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-secondary/6"></div>
            
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
