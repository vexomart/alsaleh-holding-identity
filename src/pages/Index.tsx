import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import DepartmentsSection from "@/components/DepartmentsSection";
import CommitmentsSection from "@/components/CommitmentsSection";
import ContactSection from "@/components/ContactSection";

import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
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
                        <div className="text-3xl font-bold gradient-text mb-3">متجر البطاقات الرقمية</div>
                        <div className="text-primary font-semibold text-lg">تصميم جديد ومتطور</div>
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
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  
                  <Link to="/electronic-cards-store">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 font-bold px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
                    >
                      <Star className="w-6 h-6 ml-2" />
                      متجر البطاقات الجديد
                      <ArrowRight className="w-6 h-6 mr-2" />
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 text-muted-foreground">
                  <div className="inline-flex items-center bg-background/50 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
                    ⏰ عروض محدودة الوقت - لا تفوت الفرصة!
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

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
};

export default Index;
