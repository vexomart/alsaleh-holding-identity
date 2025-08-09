import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsSection from "@/components/StatsSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import ContactSection from "@/components/ContactSection";

import Footer from "@/components/Footer";
import { Gift, Sparkles, ArrowRight, TrendingUp, Globe, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import digitalServicesBanner from "@/assets/digital-services-banner.jpg";



const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px] overflow-x-hidden relative mobile-scroll">
      <Navigation />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-accent/12 via-primary/6 to-secondary/4 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-3/4 w-80 h-80 bg-gradient-to-tr from-secondary/8 via-accent/6 to-primary/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-6 h-6 bg-accent/15 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-32 w-3 h-12 bg-secondary/10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.02]"></div>
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

          {/* Enhanced Digital Services Section - Luxury Responsive Design */}
          <section className="relative py-16 lg:py-24 overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/12 to-accent/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--primary))_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,hsl(var(--secondary))_0%,transparent_50%)] opacity-30"></div>
            
            {/* Luxury Floating Elements */}
            <div className="absolute top-6 left-6 sm:top-12 sm:left-12 lg:top-20 lg:left-20 w-12 h-12 sm:w-24 sm:h-24 lg:w-40 lg:h-40 bg-gradient-to-br from-primary/25 to-secondary/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 lg:bottom-20 lg:right-20 w-8 h-8 sm:w-16 sm:h-16 lg:w-32 lg:h-32 bg-gradient-to-tl from-accent/20 to-primary/15 rounded-full blur-xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-gradient-to-r from-secondary/10 to-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Luxury Card Container */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl group backdrop-blur-sm border border-white/10">
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary opacity-95"></div>
                  
                  {/* Background Image with Enhanced Effects */}
                  <img 
                    src={digitalServicesBanner} 
                    alt="خدماتنا الرقمية المتطورة" 
                    className="w-full h-[20rem] sm:h-[24rem] lg:h-[28rem] object-cover transition-all duration-1000 group-hover:scale-110 mix-blend-overlay"
                  />
                  
                  {/* Enhanced Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-secondary/30"></div>
                  
                  {/* Main Content Container */}
                  <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-8">
                    <div className="text-white w-full max-w-4xl text-center space-y-3 sm:space-y-5 lg:space-y-6">
                      
                      {/* Premium Badge */}
                      <div className="flex justify-center">
                        <Badge className="bg-gradient-to-r from-white/20 to-white/30 text-white border border-white/40 hover:from-white/30 hover:to-white/40 backdrop-blur-lg text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 shadow-xl rounded-full">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                          خدمات متطورة عالمية المستوى
                        </Badge>
                      </div>
                      
                      {/* Enhanced Main Title */}
                      <div className="space-y-1 sm:space-y-2">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                          <span className="block text-white drop-shadow-2xl mb-1">
                            خدماتنا الرقمية
                          </span>
                          <span className="block text-transparent bg-gradient-to-r from-white via-white/90 to-secondary bg-clip-text drop-shadow-2xl font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                            المتطورة
                          </span>
                        </h2>
                      </div>
                      
                      {/* Enhanced Description */}
                      <div className="max-w-3xl mx-auto">
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/95 leading-relaxed font-medium drop-shadow-lg px-1 sm:px-2">
                          نقدم حلولاً رقمية شاملة بمعايير عالمية لتطوير أعمالك وتحقيق رؤيتك المستقبلية
                        </p>
                      </div>
                      
                      {/* Premium Features Grid - Compact Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-4xl mx-auto">
                        <div className="flex flex-col items-center justify-center text-white py-4 sm:py-5 px-3 sm:px-4 bg-gradient-to-r from-white/20 to-white/30 rounded-lg sm:rounded-xl backdrop-blur-lg border border-white/40 shadow-xl transition-all duration-300">
                          <Globe className="w-5 h-5 sm:w-6 sm:h-6 mb-2 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base text-center">حلول عالمية</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-white py-4 sm:py-5 px-3 sm:px-4 bg-gradient-to-r from-white/20 to-white/30 rounded-lg sm:rounded-xl backdrop-blur-lg border border-white/40 shadow-xl transition-all duration-300">
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 mb-2 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base text-center">أمان متقدم</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-white py-4 sm:py-5 px-3 sm:px-4 bg-gradient-to-r from-white/20 to-white/30 rounded-lg sm:rounded-xl backdrop-blur-lg border border-white/40 shadow-xl transition-all duration-300">
                          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mb-2 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base text-center">نمو مستدام</span>
                        </div>
                      </div>
                      
                      {/* Premium CTA Button */}
                      <div className="flex justify-center pt-2 sm:pt-3">
                        <Link to="/professional-services">
                          <Button size="sm" className="group bg-gradient-to-r from-white to-white/95 hover:from-white/95 hover:to-white text-primary hover:text-primary/90 font-bold text-sm sm:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover-scale rounded-lg sm:rounded-xl border border-white/20">
                            استكشف خدماتنا المتطورة
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Decorative Elements */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6 opacity-40">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white animate-pulse" />
                  </div>
                  <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 lg:bottom-7 lg:left-7 opacity-30">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white animate-float" />
                  </div>
                  <div className="absolute top-1/3 left-2 sm:left-4 lg:left-6 opacity-20">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white animate-pulse" style={{ animationDelay: '1.5s' }} />
                  </div>
                  <div className="absolute bottom-1/3 right-2 sm:right-4 lg:right-6 opacity-25">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white animate-float" style={{ animationDelay: '2s' }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Current Offers - Professional Global Style */}
          <section className="relative py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-primary/6 to-secondary/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent))_0%,transparent_30%),radial-gradient(circle_at_20%_80%,hsl(var(--primary))_0%,transparent_30%)] opacity-20"></div>
            
            {/* Professional Floating Elements */}
            <div className="absolute top-32 right-32 w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/15 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-32 left-32 w-32 h-32 bg-gradient-to-tl from-secondary/20 to-accent/15 rounded-full blur-xl animate-float-delayed"></div>
            <div className="absolute top-1/2 right-16 w-6 h-40 bg-primary/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full mb-6 shadow-glow animate-pulse">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 text-lg px-8 py-3 shadow-lg">
                    عروض محدودة الوقت
                  </Badge>
                </div>
                
                <h2 className="text-5xl lg:text-7xl font-bold mb-8 gradient-text leading-tight">
                  عروضنا الحالية المميزة
                </h2>
                
                <p className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                  اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بمعايير عالمية وأسعار استثنائية
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <Card className="glass-effect border border-accent/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold gradient-text mb-3">تصميم مواقع</div>
                        <div className="text-accent font-semibold text-lg">خصم حتى 35%</div>
                        <div className="w-12 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-primary/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold gradient-text mb-3">متاجر إلكترونية</div>
                        <div className="text-primary font-semibold text-lg">خصم حتى 61%</div>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-effect border border-secondary/20 hover:shadow-glow transition-all duration-500 group hover-scale">
                    <CardContent className="p-8 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-3xl font-bold gradient-text mb-3">هوية بصرية</div>
                        <div className="text-secondary font-semibold text-lg">خصم حتى 40%</div>
                        <div className="w-12 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mt-4"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Link to="/current-offers">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-accent via-primary to-secondary hover:from-accent/90 hover:via-primary/90 hover:to-secondary/90 text-white font-bold px-12 py-6 text-xl shadow-glow hover:shadow-xl transition-all duration-300 hover-scale"
                  >
                    <Gift className="w-6 h-6 ml-2" />
                    شاهد جميع العروض الحالية
                    <ArrowRight className="w-6 h-6 mr-2" />
                  </Button>
                </Link>
                
                <div className="mt-6 text-muted-foreground">
                  <div className="inline-flex items-center bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                    ⏰ عروض محدودة الوقت - لا تفوت الفرصة!
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section - Enhanced Professional */}
          <section id="stats" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-background to-secondary/10"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_80%_50%,transparent,hsl(var(--primary))_20%,transparent_40%,hsl(var(--secondary))_60%,transparent)] opacity-15"></div>
            
            {/* Professional Geometric Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tl from-secondary/12 to-accent/8 rounded-full blur-3xl animate-float-delayed"></div>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:100px_100px] opacity-30"></div>
            
            <div className="relative z-10">
              <StatsSection />
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
              <DepartmentsSection />
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
              <CommitmentsSection />
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
    </div>
  );
};

export default Index;
