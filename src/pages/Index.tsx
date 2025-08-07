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
import WhatsAppButton from "@/components/WhatsAppButton";
import { Gift, Sparkles, ArrowRight, Code, Palette, Megaphone, Smartphone, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import digitalServicesBanner from "@/assets/digital-services-banner.jpg";



const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px] overflow-x-hidden" dir="rtl">
      <Navigation />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative z-10">
          <HeroSection />
          
          {/* Quick Access Buttons - Hidden as requested */}
        </section>

        {/* Content Sections with Proper Spacing */}
        <div className="space-y-0">

          {/* Digital Services Banner Section */}
          <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20"></div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl group">
                  <img 
                    src={digitalServicesBanner} 
                    alt="خدماتنا الرقمية المتطورة" 
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-start p-6 sm:p-8 lg:p-12">
                    <div className="text-white max-w-2xl">
                      <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                        <Sparkles className="w-4 h-4 mr-2" />
                        خدمات متطورة
                      </Badge>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                        خدماتنا الرقمية المتطورة
                      </h2>
                      <p className="text-lg sm:text-xl mb-6 text-white/90 leading-relaxed">
                        نقدم حلولاً رقمية شاملة لتطوير أعمالك وتحقيق أهدافك التجارية
                      </p>
                      <Link to="/professional-services">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                          استكشف خدماتنا
                          <ArrowRight className="w-5 h-5 mr-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Current Offers Call-to-Action Section */}
          <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-orange-50/80 via-red-50/60 to-pink-50/80 dark:from-orange-950/20 dark:via-red-950/10 dark:to-pink-950/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-lg px-6 py-2 animate-pulse">
                  <Gift className="w-5 h-5 mr-2" />
                  عروض محدودة الوقت
                </Badge>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  عروضنا الحالية المميزة
                </h2>
                
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                  اكتشف عروضنا الحصرية والمحدودة الوقت واحصل على أفضل الخدمات بأسعار استثنائية
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                  <Link to="/current-offers?category=development">
                    <Card className="bg-white/80 backdrop-blur-sm border border-blue-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Code className="w-8 h-8 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-blue-600 mb-2">البرمجة والتطوير</div>
                        <div className="text-sm text-muted-foreground">خصم حتى 45%</div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/current-offers?category=design">
                    <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Palette className="w-8 h-8 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-purple-600 mb-2">التصميم</div>
                        <div className="text-sm text-muted-foreground">خصم حتى 40%</div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/current-offers?category=marketing">
                    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Megaphone className="w-8 h-8 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-green-600 mb-2">التسويق</div>
                        <div className="text-sm text-muted-foreground">خصم حتى 35%</div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/current-offers?category=applications">
                    <Card className="bg-white/80 backdrop-blur-sm border border-indigo-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Smartphone className="w-8 h-8 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-indigo-600 mb-2">التطبيقات</div>
                        <div className="text-sm text-muted-foreground">خصم حتى 50%</div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link to="/current-offers?category=hosting">
                    <Card className="bg-white/80 backdrop-blur-sm border border-orange-200/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Globe className="w-8 h-8 mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-lg font-bold text-orange-600 mb-2">النطاقات والهوست</div>
                        <div className="text-sm text-muted-foreground">خصم حتى 30%</div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                
                <Link to="/current-offers">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                  >
                    <Gift className="w-6 h-6 ml-2" />
                    شاهد جميع العروض الحالية
                    <ArrowRight className="w-6 h-6 mr-2" />
                  </Button>
                </Link>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  ⏰ عروض محدودة الوقت - لا تفوت الفرصة!
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section id="stats" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-orange-50/80 via-amber-50/60 to-yellow-50/80 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-yellow-950/20"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-orange-100/20"></div>
            <div className="absolute top-5 right-5 sm:top-16 sm:right-16 w-24 h-24 sm:w-60 sm:h-60 bg-gradient-to-br from-orange-200/50 to-amber-200/50 rounded-full blur-lg sm:blur-2xl animate-pulse"></div>
            <div className="absolute bottom-5 left-5 sm:bottom-16 sm:left-16 w-32 h-32 sm:w-72 sm:h-72 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="relative z-10">
              <StatsSection />
            </div>
          </section>





          {/* Departments Section */}
          <section id="departments" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/80 via-pink-50/60 to-fuchsia-50/80 dark:from-rose-950/20 dark:via-pink-950/10 dark:to-fuchsia-950/20"></div>
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-rose-100/10 via-pink-100/15 via-fuchsia-100/10 to-rose-100/10 opacity-60"></div>
            <div className="absolute top-5 left-5 sm:top-24 sm:left-24 w-24 h-24 sm:w-64 sm:h-64 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-lg sm:blur-2xl animate-float"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-24 sm:right-24 w-32 h-32 sm:w-80 sm:h-80 bg-gradient-to-br from-fuchsia-200/30 to-purple-200/30 rounded-full blur-xl sm:blur-3xl animate-float-delayed"></div>
            <div className="relative z-10">
              <DepartmentsSection />
            </div>
          </section>


          {/* Commitments Section */}
          <section id="commitments" className="relative py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-violet-50/80 via-purple-50/60 to-indigo-50/80 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_var(--tw-gradient-stops))] from-violet-100/20 via-transparent to-purple-100/20"></div>
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 w-32 h-32 sm:w-92 sm:h-92 bg-gradient-to-br from-violet-200/35 to-purple-200/35 rounded-full blur-xl sm:blur-3xl animate-float"></div>
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 w-24 h-24 sm:w-68 sm:h-68 bg-gradient-to-br from-indigo-200/45 to-violet-200/45 rounded-full blur-lg sm:blur-2xl animate-float-delayed"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-300/25 to-indigo-300/25 rounded-full blur-sm sm:blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            <div className="relative z-10">
              <CommitmentsSection />
            </div>
          </section>


        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-4 sm:mt-8">
        <Footer />
      </footer>

      {/* Floating Elements */}
      <WhatsAppButton />
      
      {/* Background Decorative Elements - Hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default Index;
