import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Play, 
  Target, 
  Globe, 
  ChevronDown,
  Heart,
  Rocket
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const businessImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=70",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=70"
  ];

  const achievements = [
    { 
      icon: Calendar, 
      number: 2016, 
      title: "سنة التأسيس", 
      titleEn: "Foundation Year",
      color: "from-amber-600 to-amber-800",
      description: "بداية رحلة النجاح",
      textColor: "text-amber-100"
    },
    { 
      icon: Trophy, 
      number: 14883, 
      title: "مشروع منجز", 
      titleEn: "Completed Projects",
      color: "from-emerald-600 to-emerald-800",
      description: "إنجازات متميزة",
      textColor: "text-emerald-100"
    },
    { 
      icon: Users, 
      number: 9512, 
      title: "عميل راضٍ", 
      titleEn: "Satisfied Clients",
      color: "from-blue-600 to-blue-800",
      description: "ثقة العملاء",
      textColor: "text-blue-100"
    },
    { 
      icon: Star, 
      number: 100, 
      suffix: "%",
      title: "معدل الرضا", 
      titleEn: "Satisfaction Rate",
      color: "from-purple-600 to-purple-800",
      description: "رضا كامل",
      textColor: "text-purple-100"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [businessImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {businessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Business background ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-accent/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
        
        {/* Top Badge */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center px-6 py-4 bg-white/20 rounded-full backdrop-blur-md border border-white/40 shadow-2xl">
            <span className="text-lg font-bold text-white">شركة عالمية رائدة • منذ 2016</span>
          </div>
        </div>
        
        {/* Main Title */}
        <div className="mb-8 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl animate-fade-in">
            ASH HOLDING
          </h1>
          
          <div className="flex justify-center items-center gap-3 animate-fade-in">
            <Target className="w-6 h-6 text-secondary animate-pulse" />
            <p className="text-2xl font-bold text-secondary drop-shadow-lg">
              رؤية • ابتكار • تميز
            </p>
            <Rocket className="w-6 h-6 text-secondary animate-bounce" />
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-primary-foreground/95 mb-12 max-w-5xl mx-auto leading-relaxed animate-fade-in font-medium">
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          <br />
          <span className="text-lg text-primary-foreground/80 mt-2 block">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
          </span>
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary-dark text-secondary-foreground px-12 py-8 text-xl font-bold shadow-glow hover:shadow-xl transition-all duration-500 hover:scale-110 group rounded-2xl"
            onClick={() => {
              const companiesSection = document.getElementById('companies');
              companiesSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span>استكشف شركاتنا</span>
            <ChevronDown className="w-5 h-5 ml-3 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-3 border-primary-foreground/80 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-12 py-8 text-xl font-bold transition-all duration-500 hover:scale-110 glass-effect rounded-2xl group"
            onClick={() => {
              const visionSection = document.getElementById('vision');
              visionSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Heart className="w-6 h-6 mr-3 group-hover:scale-125 group-hover:text-destructive transition-all duration-300" />
            <span>اكتشف رؤيتنا</span>
          </Button>

          <Button 
            variant="ghost"
            size="lg"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="border-2 border-accent/50 text-accent hover:bg-accent/10 w-16 h-16 text-lg font-bold transition-all duration-500 hover:scale-110 rounded-full group glass-effect"
          >
            <Play className="w-8 h-8 group-hover:scale-125 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto animate-fade-in">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <div 
                key={index} 
                className="text-center group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 hover:from-white/25 hover:to-white/10 transition-all duration-700 border border-white/20 shadow-2xl hover:shadow-glow hover:transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="mb-6 flex justify-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${achievement.color} rounded-3xl flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconComponent className="w-10 h-10 text-white group-hover:animate-pulse relative z-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-6xl font-black mb-3 group-hover:scale-125 transition-transform duration-500 drop-shadow-lg ${achievement.textColor || 'text-white'}`}>
                    <AnimatedCounter 
                      end={achievement.number} 
                      suffix={achievement.suffix || ""} 
                      duration={2000}
                    />
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

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${achievement.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </div>
            );
          })}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 animate-fade-in">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🏆 أفضل شركة قابضة 2024
            </Badge>
            <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🌟 100% معدل رضا العملاء
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 text-lg font-bold hover:scale-105 transition-transform duration-200 rounded-full">
              🚀 قائد السوق العالمي
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;