import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Award, 
  Zap, 
  Building2,
  Users,
  Globe,
  Sparkles,
  Target,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

// مكون HeroSection مبسط بدون hooks معقدة
const SafeHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Content Container */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Main Heading */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              شركة قابضة رائدة منذ 2016
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
              مؤسسة علي الشهري القابضة
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              رؤية مستقبلية • حلول مبتكرة • استثمار ذكي
              <br />
              نبني جسور النجاح نحو التميز والابتكار
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/current-offers">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold group">
                <Target className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                العروض الحالية
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/about">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                <Building2 className="w-5 h-5 mr-2" />
                من نحن
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="border-none bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">مشروع ناجح</div>
              </CardContent>
            </Card>
            
            <Card className="border-none bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">سنوات خبرة</div>
              </CardContent>
            </Card>
            
            <Card className="border-none bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">عميل راضي</div>
              </CardContent>
            </Card>
            
            <Card className="border-none bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">شريك تجاري</div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-6">
              <a 
                href="tel:0555812567" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">0555812567</span>
              </a>
              
              <a 
                href="mailto:info@alialshehriholding.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">تواصل معنا</span>
              </a>
              
              <a 
                href="https://wa.me/966555812567" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafeHeroSection;