import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Play, 
  ArrowDown, 
  Sparkles, 
  Target, 
  Globe, 
  Award, 
  TrendingUp, 
  Zap, 
  Shield,
  ChevronDown,
  MousePointer,
  Eye,
  Heart,
  Rocket
} from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const businessImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ];

  const achievements = [
    { 
      icon: Calendar, 
      number: "2016", 
      title: "سنة التأسيس", 
      titleEn: "Foundation Year",
      color: "from-blue-600 to-cyan-600",
      description: "بداية رحلة النجاح"
    },
    { 
      icon: Star, 
      number: "2024", 
      title: "شركة قابضة", 
      titleEn: "Holding Company",
      color: "from-purple-600 to-pink-600",
      description: "التطور والنمو"
    },
    { 
      icon: Trophy, 
      number: "2,846", 
      title: "مشروع ناجح", 
      titleEn: "Successful Projects",
      color: "from-emerald-600 to-teal-600",
      description: "إنجازات متميزة"
    },
    { 
      icon: Users, 
      number: "1,744", 
      title: "عميل راضٍ", 
      titleEn: "Satisfied Clients",
      color: "from-orange-600 to-red-600",
      description: "ثقة العملاء"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [businessImages.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Dynamic Background Slider */}
      <div className="absolute inset-0">
        {businessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-2000 transform ${
              index === currentSlide 
                ? 'opacity-100 scale-105' 
                : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      {/* Enhanced Overlay with gradient animation */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30 animate-pulse" />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/5 right-1/4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/5 left-1/4 w-28 h-28 bg-secondary/15 rounded-full blur-2xl animate-float-delayed" />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-pulse" />
        
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-40 h-40 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
          style={{
            left: mousePosition.x - 80,
            top: mousePosition.y - 80,
          }}
        />
      </div>
      
      {/* Enhanced Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        
        {/* Top Badge */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-6 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-2xl animate-scale-in group hover:scale-105 transition-all duration-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">شركة عالمية رائدة • منذ 2016</span>
            <Badge className="bg-gradient-to-r from-secondary to-primary text-white border-0">
              متميزون
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Main Title with Advanced Typography */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-pulse blur-sm opacity-50">
              شركة علي صالح الشهري القابضة
            </div>
            
            {/* Main Title with Advanced Effects */}
            <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in group">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary-foreground via-white to-primary-foreground animate-gradient-x">
                شركة علي صالح الشهري
              </span>
              <br />
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-secondary animate-gradient-x mt-2" style={{ animationDelay: '0.5s' }}>
                القابضة
              </span>
              
              {/* Animated Underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-secondary to-primary group-hover:w-full transition-all duration-1000 rounded-full shadow-glow" />
              
              {/* Sparkle Effects */}
              <div className="absolute top-0 right-0 animate-ping">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-secondary opacity-70" />
              </div>
              <div className="absolute bottom-0 left-0 animate-ping" style={{ animationDelay: '1s' }}>
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-primary opacity-60" />
              </div>
              
              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-bold text-primary/20 transform translate-x-2 translate-y-2 -z-10">
                شركة علي صالح الشهري القابضة
              </div>
            </h1>
            
            {/* Reflection Effect */}
            <div className="absolute top-full left-0 right-0 h-20 overflow-hidden opacity-30">
              <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary-foreground/50 to-transparent transform scale-y-[-1] blur-sm">
                شركة علي صالح الشهري القابضة
              </div>
            </div>
          </div>
          
          {/* Enhanced Subtitle with typing effect */}
          <div className="flex justify-center items-center gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Target className="w-6 h-6 text-secondary animate-pulse" />
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary via-primary to-secondary animate-gradient-x">
                رؤية • ابتكار • تميز
              </p>
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-60 animate-pulse" />
            </div>
            <Rocket className="w-6 h-6 text-secondary animate-bounce" />
          </div>
        </div>
        
        {/* Enhanced Description */}
        <p className="text-xl md:text-3xl text-primary-foreground/95 mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.9s' }}>
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          <br />
          <span className="text-lg md:text-xl text-primary-foreground/80 mt-2 block">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
          </span>
        </p>
        
        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground px-12 py-8 text-xl font-bold shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-glow group rounded-2xl"
          >
            <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span className="group-hover:animate-pulse">استكشف شركاتنا</span>
            <ChevronDown className="w-5 h-5 ml-3 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-3 border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-12 py-8 text-xl font-bold transition-all duration-500 hover:scale-110 backdrop-blur-md bg-white/5 rounded-2xl group"
          >
            <Heart className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:text-red-500 transition-all duration-300" />
            تواصل معنا
          </Button>

          {/* Video Play Button */}
          <Button 
            variant="ghost"
            size="lg"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="border-2 border-secondary/50 text-secondary hover:bg-secondary/10 px-8 py-8 text-lg font-bold transition-all duration-500 hover:scale-110 rounded-full group bg-white/5 backdrop-blur-md"
          >
            <Play className="w-8 h-8 group-hover:scale-125 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Enhanced Stats Grid with better animations */}
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: '1.5s' }}>
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <div 
                key={index} 
                className="text-center group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 hover:from-white/25 hover:to-white/10 transition-all duration-700 border border-white/20 shadow-2xl hover:shadow-glow hover:transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${1.8 + index * 0.2}s` }}
              >
                <div className="mb-6 flex justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${achievement.color} rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconComponent className="w-10 h-10 text-white group-hover:animate-pulse relative z-10" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-gradient-primary mb-3 group-hover:scale-125 transition-transform duration-500">
                    {achievement.number}
                  </div>
                  <div className="text-xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">
                    {achievement.title}
                  </div>
                  <div className="text-primary-foreground/70 text-sm font-medium">
                    {achievement.titleEn}
                  </div>
                  <div className="text-primary-foreground/60 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {achievement.description}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '2.2s' }}>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🏆 أفضل شركة قابضة 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🌟 99.8% معدل رضا العملاء
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🚀 قائد السوق العالمي
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {businessImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`relative overflow-hidden transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? 'w-12 h-4 bg-secondary shadow-glow' 
                : 'w-4 h-4 bg-primary-foreground/50 hover:bg-primary-foreground/70 hover:scale-125'
            }`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary animate-pulse" />
            )}
          </button>
        ))}
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce z-20 group">
        <div className="flex flex-col items-center space-y-2">
          <MousePointer className="w-6 h-6 text-primary-foreground/70 group-hover:text-secondary transition-colors duration-300" />
          <div className="w-6 h-12 border-2 border-primary-foreground/70 rounded-full flex justify-center group-hover:border-secondary transition-colors duration-300">
            <div className="w-1 h-4 bg-primary-foreground/70 rounded-full mt-2 animate-pulse group-hover:bg-secondary transition-colors duration-300" />
          </div>
          <span className="text-xs text-primary-foreground/60 font-medium">اكتشف المزيد</span>
        </div>
      </div>

      {/* Floating elements for extra visual appeal */}
      <div className="absolute top-20 right-20 animate-float">
        <Award className="w-8 h-8 text-secondary/50" />
      </div>
      <div className="absolute bottom-40 right-40 animate-float-delayed">
        <TrendingUp className="w-6 h-6 text-primary/50" />
      </div>
      <div className="absolute top-40 left-20 animate-pulse">
        <Shield className="w-7 h-7 text-secondary/40" />
      </div>
    </section>
  );
};

export default HeroSection;