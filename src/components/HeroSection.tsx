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
    "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Banking-Style Dynamic Background */}
      <div className="absolute inset-0">
        {businessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[4000ms] ease-in-out ${
              index === currentSlide 
                ? 'opacity-30 scale-105' 
                : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        
        {/* Professional Banking Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-800/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_98%,rgba(255,255,255,0.03)_100%)] bg-[length:50px_50px]" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_98%,rgba(255,255,255,0.03)_100%)] bg-[length:50px_50px]" />
        </div>
        
        {/* Banking-Style Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl animate-float" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-cyan-500/25 rounded-full blur-xl animate-bounce" />
          <div className="absolute top-1/5 right-1/4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute bottom-1/5 left-1/4 w-28 h-28 bg-slate-400/10 rounded-full blur-2xl animate-pulse" />
        </div>
      </div>
      
      {/* Interactive mouse follower with banking colors */}
      <div 
        className="absolute w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
      />
      
      {/* Enhanced Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
        
        {/* Banking-Style Professional Badge */}
        <div className="mb-6 sm:mb-10 animate-fade-in w-full flex justify-center px-6 sm:px-8 pt-12 sm:pt-16">
          <div className="inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-blue-700/30 rounded-2xl backdrop-blur-xl border border-blue-300/30 shadow-2xl animate-scale-in group hover:scale-105 transition-all duration-700 hover:shadow-blue-500/25">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 mr-3 animate-pulse" />
            <span className="text-sm sm:text-base lg:text-xl font-bold text-white whitespace-nowrap tracking-wide">شركة عالمية رائدة • منذ 2016</span>
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200 ml-3 animate-pulse" />
          </div>
        </div>
        
         {/* Banking-Style Main Title */}
        <div className="mb-8 sm:mb-12 space-y-6 sm:space-y-8">
          <div className="relative">
            {/* Professional Banking Title */}
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-fade-in text-white drop-shadow-2xl px-4 sm:px-0 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                شركة علي صالح الشهري القابضة
              </span>
              
              {/* Professional Animated Underline */}
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-1 sm:h-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 hover:w-full transition-all duration-1500 rounded-full shadow-xl shadow-blue-500/50" />
            </h1>
            
            {/* Enhanced Banking Glow Effect */}
            <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-300/30 blur-lg px-4 sm:px-0 tracking-tight">
              شركة علي صالح الشهري القابضة
            </div>
          </div>
          
          {/* Banking-Style Professional Subtitle */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.4s' }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
              رؤية • ابتكار • تميز
            </h2>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>
        
        {/* Banking-Style Professional Description */}
        <div className="mb-10 sm:mb-16 max-w-6xl mx-auto animate-fade-in px-4 sm:px-6" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-100 leading-relaxed font-medium mb-4">
            رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-200/80 leading-relaxed font-light">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية في التطوير والنمو المستدام
          </p>
        </div>
        
        {/* Banking-Style Professional Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.8s' }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-700 hover:scale-110 group rounded-2xl border border-blue-400/30"
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
            className="border-2 border-blue-300/60 text-blue-100 hover:bg-blue-500/20 hover:text-white hover:border-blue-200 w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-bold transition-all duration-700 hover:scale-110 backdrop-blur-md rounded-2xl group"
            onClick={() => {
              const visionSection = document.getElementById('vision');
              visionSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-125 group-hover:text-red-400 transition-all duration-300" />
            <span className="hidden sm:block">اكتشف رؤيتنا التفصيلية</span>
            <span className="sm:hidden">رؤيتنا</span>
          </Button>

          {/* Banking-Style Video Play Button */}
          <Button 
            variant="ghost"
            size="lg"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-300 w-16 h-16 sm:w-auto sm:h-auto sm:px-8 sm:py-8 text-lg font-bold transition-all duration-700 hover:scale-110 rounded-full group backdrop-blur-md"
          >
            <Play className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-125 transition-transform duration-300" />
            <span className="hidden sm:block sm:ml-2">مشاهدة الفيديو</span>
          </Button>
        </div>
        
        {/* Banking-Style Professional Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto animate-fade-in px-4 sm:px-0" style={{ animationDelay: '1.0s' }}>
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <div 
                key={index} 
                className="text-center group bg-gradient-to-br from-blue-900/40 via-slate-800/30 to-blue-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:from-blue-800/50 hover:via-blue-700/40 hover:to-cyan-800/50 transition-all duration-700 border border-blue-300/20 shadow-2xl hover:shadow-blue-500/25 hover:transform hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${1.2 + index * 0.15}s` }}
              >
                <div className="mb-4 sm:mb-6 flex justify-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${achievement.color} rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative overflow-hidden border border-white/20`}>
                    <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:animate-pulse relative z-10" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-60 blur-xl transition-all duration-500`} />
                  </div>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-500">
                    {achievement.number}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-blue-100 group-hover:text-white transition-colors duration-300">
                    {achievement.title}
                  </div>
                  <div className="text-blue-200/70 text-xs sm:text-sm font-medium">
                    {achievement.titleEn}
                  </div>
                  <div className="text-blue-300/60 text-xs mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {achievement.description}
                  </div>
                </div>

                {/* Banking-Style Hover Effect Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl sm:rounded-b-3xl shadow-lg`} />
                
                {/* Additional Banking Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-transparent to-blue-400/0 group-hover:from-blue-500/10 group-hover:to-blue-400/5 transition-all duration-700 rounded-2xl sm:rounded-3xl" />
              </div>
            );
          })}
        </div>

        {/* Banking-Style Professional Achievement Badges */}
        <div className="mt-12 sm:mt-16 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '1.4s' }}>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Badge className="bg-gradient-to-r from-blue-600/80 via-indigo-600/70 to-blue-700/80 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300 rounded-2xl border border-blue-300/30 backdrop-blur-md shadow-xl hover:shadow-blue-500/25">
              🏆 أفضل شركة قابضة 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-600/80 via-teal-600/70 to-cyan-600/80 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300 rounded-2xl border border-emerald-300/30 backdrop-blur-md shadow-xl hover:shadow-emerald-500/25">
              🌟 99.8% معدل رضا العملاء
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600/80 via-red-600/70 to-pink-600/80 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300 rounded-2xl border border-orange-300/30 backdrop-blur-md shadow-xl hover:shadow-orange-500/25">
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