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
      {/* Enhanced Dynamic Background Slider with Modern Transitions */}
      <div className="absolute inset-0">
        {businessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-in-out transform ${
              index === currentSlide 
                ? 'opacity-100 scale-110 blur-0' 
                : 'opacity-0 scale-100 blur-sm'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        {/* Modern Parallax Effect Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Corporate Professional Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-accent/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/50" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary-glow)/0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles with corporate colors */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-secondary/30 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-accent/25 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary-glow/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/5 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/5 left-1/4 w-28 h-28 bg-accent/15 rounded-full blur-2xl animate-float-delayed" />
        
        {/* Professional grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse" />
        
        {/* Interactive mouse follower with corporate colors */}
        <div 
          className="absolute w-40 h-40 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
          style={{
            left: mousePosition.x - 80,
            top: mousePosition.y - 80,
          }}
        />
      </div>
      
      {/* Enhanced Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
        
        {/* Top Badge - Fixed visibility */}
        <div className="mb-12 animate-fade-in px-4 sm:px-6">
          <div className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-6 bg-white/15 rounded-full backdrop-blur-md border border-white/30 shadow-2xl animate-scale-in group hover:scale-105 transition-all duration-500 w-auto min-w-fit">
            <span className="text-sm sm:text-base lg:text-lg font-bold text-white whitespace-nowrap text-center">شركة عالمية رائدة • منذ 2016</span>
          </div>
        </div>
        
        {/* Enhanced Main Title - Responsive */}
        <div className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
          <div className="relative">
            {/* Main Title with Better Visibility - Responsive Sizes */}
            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in text-white drop-shadow-2xl px-4 sm:px-0">
              شركة علي صالح الشهري القابضة
              
              {/* Animated Underline */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-secondary to-primary hover:w-full transition-all duration-1000 rounded-full shadow-glow" />
            </h1>
            
            {/* Text Glow Effect for Better Visibility - Responsive */}
            <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white/20 blur-sm px-4 sm:px-0">
              شركة علي صالح الشهري القابضة
            </div>
          </div>
          
          {/* Enhanced Subtitle - Responsive */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.3s' }}>
            <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary animate-pulse" />
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-secondary drop-shadow-lg">
              رؤية • ابتكار • تميز
            </p>
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary animate-bounce" />
          </div>
        </div>
        
        {/* Enhanced Description - Responsive */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-primary-foreground/95 mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in font-medium px-4 sm:px-6" style={{ animationDelay: '0.9s' }}>
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          <br />
          <span className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/80 mt-1 sm:mt-2 block">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
          </span>
        </p>
        
        {/* Corporate Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '1.2s' }}>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary-dark text-secondary-foreground w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-bold shadow-glow hover:shadow-xl transition-all duration-500 hover:scale-110 group rounded-2xl"
            onClick={() => {
              const companiesSection = document.getElementById('companies');
              companiesSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span className="group-hover:animate-pulse">استكشف شركاتنا</span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-3 border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-bold transition-all duration-500 hover:scale-110 glass-effect rounded-2xl group"
            onClick={() => {
              const visionSection = document.getElementById('vision');
              visionSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-125 group-hover:text-destructive transition-all duration-300" />
            <span className="hidden sm:block">اكتشف رؤيتنا التفصيلية</span>
            <span className="sm:hidden">رؤيتنا</span>
          </Button>

          {/* Video Play Button - Responsive */}
          <Button 
            variant="ghost"
            size="lg"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="border-2 border-accent/50 text-accent hover:bg-accent/10 w-16 h-16 sm:w-auto sm:h-auto sm:px-8 sm:py-8 text-lg font-bold transition-all duration-500 hover:scale-110 rounded-full group glass-effect"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-125 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Enhanced Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto animate-fade-in px-4 sm:px-0" style={{ animationDelay: '1.5s' }}>
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <div 
                key={index} 
                className="text-center group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:from-white/25 hover:to-white/10 transition-all duration-700 border border-white/20 shadow-2xl hover:shadow-glow hover:transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${1.8 + index * 0.2}s` }}
              >
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${achievement.color} rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:animate-pulse relative z-10" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`} />
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient-primary mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-500">
                    {achievement.number}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">
                    {achievement.title}
                  </div>
                  <div className="text-primary-foreground/70 text-xs sm:text-sm font-medium">
                    {achievement.titleEn}
                  </div>
                  <div className="text-primary-foreground/60 text-xs mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {achievement.description}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl sm:rounded-b-3xl`} />
              </div>
            );
          })}
        </div>

        {/* Additional Info Section - Responsive */}
        <div className="mt-12 sm:mt-16 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '2.2s' }}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🏆 أفضل شركة قابضة 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🌟 99.8% معدل رضا العملاء
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🚀 قائد السوق العالمي
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Modern Slide Indicators - Hidden as requested */}
      
      {/* Enhanced Scroll Indicator - Hidden as requested */}

      {/* Floating elements for extra visual appeal - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-20 right-20 animate-float">
        <Award className="w-6 h-6 lg:w-8 lg:h-8 text-secondary/50" />
      </div>
      <div className="hidden sm:block absolute bottom-40 right-40 animate-float-delayed">
        <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-primary/50" />
      </div>
      <div className="hidden sm:block absolute top-40 left-20 animate-pulse">
        <Shield className="w-5 h-5 lg:w-7 lg:h-7 text-secondary/40" />
      </div>
    </section>
  );
};

export default HeroSection;