import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Calendar, Trophy, Users, Star } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const businessImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Person using MacBook Pro
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // People with laptops
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Monitor with code
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // People looking at screens
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Modern office building
    "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Glass building
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [businessImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Slider */}
      <div className="absolute inset-0">
        {businessImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-fade-in">
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 mb-4 p-3 bg-white/10 rounded-full backdrop-blur-sm animate-scale-in">
            <span className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">شركة عالمية رائدة • منذ 2016</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
          شركة علي صالح الشهري
          <span className="block text-gradient-primary mt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>القابضة</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <Button 
            size="lg" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-glow transition-all duration-300 hover:scale-105 group"
          >
            <span className="group-hover:animate-pulse">تعرف على شركاتنا</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            تواصل معنا
          </Button>
        </div>
        
        {/* Animated Stats Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="text-center group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                <Calendar className="w-8 h-8 text-primary-foreground animate-pulse" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">2016</div>
            <div className="text-primary-foreground font-medium">سنة التأسيس</div>
            <div className="text-primary-foreground/70 text-sm">Foundation Year</div>
          </div>
          
          <div className="text-center group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                <Trophy className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">2846</div>
            <div className="text-primary-foreground font-medium">مشروع ناجح</div>
            <div className="text-primary-foreground/70 text-sm">Successful Projects</div>
          </div>
          
          <div className="text-center group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-glow">
                <Users className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gradient-primary mb-2 group-hover:scale-110 transition-transform duration-300">1744</div>
            <div className="text-primary-foreground font-medium">عميل راضٍ</div>
            <div className="text-primary-foreground/70 text-sm">Satisfied Clients</div>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {businessImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-secondary scale-125' 
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;