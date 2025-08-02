import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          شركة علي صالح الشهري
          <span className="block text-secondary mt-2">القابضة</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-semibold shadow-glow transition-all duration-300"
          >
            تعرف على شركاتنا
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-6 text-lg font-semibold transition-all duration-300"
          >
            تواصل معنا
          </Button>
        </div>
        
        <div className="mt-16 text-primary-foreground/70">
          <p className="text-lg">تأسست عام <span className="text-secondary font-bold">2024</span></p>
        </div>
      </div>
      
      {/* Animated elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;