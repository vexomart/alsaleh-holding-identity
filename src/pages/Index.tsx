import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Lazy load below-the-fold components for better performance
import { lazy, Suspense } from "react";
const Footer = lazy(() => import("@/components/Footer"));
const ChatBot = lazy(() => import("@/components/ChatBot"));

import { Gift, Sparkles, ArrowRight, TrendingUp, Globe, Shield, Star, Monitor, Clock, Settings, Zap, Palette, Code2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[48px] lg:pt-[112px] overflow-x-hidden relative mobile-scroll">
      <Navigation />
      
      {/* Simplified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/8 to-accent/6 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-3/4 w-48 h-48 bg-gradient-to-tr from-secondary/6 to-primary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <main className="relative overflow-hidden z-10">
        {/* Hero Section - Simplified */}
        <section id="home" className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/8">
          <HeroSection />
        </section>

        {/* Companies Section */}
        <section id="companies" className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">شركاتنا</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                مجموعة متكاملة من الشركات المتخصصة في التقنية والإعلام والخدمات
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* تسهيل للحلول التقنية */}
              <Card className="group hover:scale-105 transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">تسهيل للحلول التقنية</h3>
                    <p className="text-muted-foreground">حلول تقنية متطورة وتطوير البرمجيات</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">تطوير المواقع والتطبيقات</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">حلول الذكاء الاصطناعي</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">الأمن السيبراني</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" asChild>
                    <Link to="/technical-services">
                      <span>استكشف الخدمات</span>
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* كشخة للعبايات */}
              <Card className="group hover:scale-105 transition-all duration-500 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Palette className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">كشخة للعبايات</h3>
                    <p className="text-muted-foreground">أزياء عصرية وعبايات فاخرة</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">تصاميم حصرية</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">جودة عالية</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">شحن عالمي</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700" asChild>
                    <Link to="/kashkha-abaya-store">
                      <span>تسوق الآن</span>
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* متجر البطاقات الإلكترونية */}
              <Card className="group hover:scale-105 transition-all duration-500 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">متجر البطاقات الإلكترونية</h3>
                    <p className="text-muted-foreground">بطاقات رقمية فورية</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span className="text-sm">تسليم فوري</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-sm">متاح 24/7</span>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm">آمن وموثوق</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700" asChild>
                    <Link to="/electronic-cards-store">
                      <span>اشتري بطاقة</span>
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-foreground mb-8">رؤيتنا</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                نسعى لأن نكون الخيار الأول عالمياً في مجال التقنية والإعلام والخدمات المتكاملة، 
                من خلال الابتكار المستمر وتقديم حلول متطورة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">النمو المستدام</h3>
                  <p className="text-muted-foreground">نمو مستمر في جميع قطاعاتنا</p>
                </div>
                <div className="text-center">
                  <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">الوصول العالمي</h3>
                  <p className="text-muted-foreground">خدماتنا تصل لجميع أنحاء العالم</p>
                </div>
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">التميز المؤسسي</h3>
                  <p className="text-muted-foreground">معايير عالية في جميع عملياتنا</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Enhanced Styling - Lazy Loaded */}
      <footer className="relative z-10 mt-8">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
        <div className="relative z-10">
          <Suspense fallback={<div className="h-96 bg-muted/10 animate-pulse" />}>
            <Footer />
          </Suspense>
        </div>
      </footer>

      {/* ChatBot Component - Lazy Loaded */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
};

export default Index;