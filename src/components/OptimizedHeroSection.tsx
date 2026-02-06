/**
 * Optimized HeroSection - Performance Enhanced
 * Defers animations until after First Paint
 * Lazy loads images and heavy visual effects
 */

import { Button } from "@/components/ui/button";
import { useState, useEffect, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Target, 
  Globe, 
  ChevronDown,
  Rocket,
  MessageCircle,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Link } from "react-router-dom";
import { useDeferredAnimation, useShouldReduceAnimations } from "@/hooks/useDeferredAnimation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Static content - no animations
const StaticHeroContent = memo(() => (
  <>
    {/* Static Badge */}
    <div className="mb-6 sm:mb-8 lg:mb-10">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
        <span className="text-sm sm:text-base font-bold text-white">
          شركة قابضة عالمية • منذ 2016
        </span>
        <div className="w-2 h-2 bg-success rounded-full" />
      </div>
    </div>
    
    {/* Static Title */}
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <h1 
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight"
        style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
      >
        <span className="inline-block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          HOLDING
        </span>
        {" "}
        <span className="inline-block">ASH</span>
      </h1>
      
      <div className="h-1 sm:h-1.5 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mt-4 rounded-full max-w-xs sm:max-w-md" />
    </div>
    
    {/* Subtitle */}
    <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary" />
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
        رؤية • ابتكار • تميز
      </p>
      <Rocket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary" />
    </div>
    
    {/* Description */}
    <div className="mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto">
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
        رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
      </p>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 mt-2 sm:mt-3">
        مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
      </p>
    </div>
  </>
));
StaticHeroContent.displayName = "StaticHeroContent";

// CTA Buttons
const HeroCTAButtons = memo(({ enableAnimations }: { enableAnimations: boolean }) => {
  const Wrapper = enableAnimations ? motion.div : "div";
  const wrapperProps = enableAnimations ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.98 } } : {};

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16">
      <Wrapper {...wrapperProps}>
        <Link to="/integrated-services">
          <Button 
            size="lg" 
            className="bg-gradient-to-l from-primary via-primary-variant to-accent hover:opacity-90 text-primary-foreground font-bold w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-primary/30 border border-white/10 rounded-2xl group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              استكشف خدماتنا
              <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </Button>
        </Link>
      </Wrapper>
      
      <Wrapper {...wrapperProps}>
        <Link to="/book-consultation">
          <Button 
            size="lg"
            className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-xl border border-white/20 rounded-2xl group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              استشارة مجانية
              <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-destructive to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              مجاناً
            </div>
          </Button>
        </Link>
      </Wrapper>
    </div>
  );
});
HeroCTAButtons.displayName = "HeroCTAButtons";

// Stats component - deferred
const HeroStats = memo(({ enableAnimations }: { enableAnimations: boolean }) => {
  const achievements = [
    { 
      icon: Calendar, 
      number: 2016, 
      title: "سنة التأسيس", 
      titleEn: "Foundation",
      color: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/30"
    },
    { 
      icon: Trophy, 
      number: 14883, 
      title: "مشروع منجز", 
      titleEn: "Projects",
      color: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/30"
    },
    { 
      icon: Users, 
      number: 9512, 
      title: "عميل راضٍ", 
      titleEn: "Clients",
      color: "from-blue-500 to-indigo-600",
      shadowColor: "shadow-blue-500/30"
    },
    { 
      icon: Star, 
      number: 100, 
      suffix: "%",
      title: "معدل الرضا", 
      titleEn: "Satisfaction",
      color: "from-purple-500 to-pink-600",
      shadowColor: "shadow-purple-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
      {achievements.map((achievement, index) => {
        const IconComponent = achievement.icon;
        const CardWrapper = enableAnimations ? motion.div : "div";
        const cardProps = enableAnimations 
          ? { 
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 + index * 0.1 },
              whileHover: { scale: 1.05, y: -5 }
            } 
          : {};
        
        return (
          <CardWrapper key={index} {...cardProps} className="relative text-center group">
            <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 group-hover:border-white/20 transition-all duration-500 overflow-hidden">
              <div className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${achievement.color} opacity-10 rounded-br-full`} />
              
              <div className="mb-3 flex justify-center">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center shadow-lg ${achievement.shadowColor}`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">
                {enableAnimations ? (
                  <AnimatedCounter 
                    end={achievement.number} 
                    suffix={achievement.suffix || ""} 
                    duration={2000}
                  />
                ) : (
                  <span>{achievement.number.toLocaleString()}{achievement.suffix || ""}</span>
                )}
              </div>
              
              <div className="text-sm sm:text-base font-bold text-white/90 mb-0.5">
                {achievement.title}
              </div>
              <div className="text-xs text-white/50">
                {achievement.titleEn}
              </div>
            </div>
          </CardWrapper>
        );
      })}
    </div>
  );
});
HeroStats.displayName = "HeroStats";

// Background - only loaded when ready
const HeroBackground = memo(({ enableAnimations }: { enableAnimations: boolean }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const businessImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ];

  useEffect(() => {
    if (!enableAnimations) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [enableAnimations, businessImages.length]);

  if (!enableAnimations) {
    return (
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${businessImages[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        {businessImages.map((image, index) => (
          index === currentSlide && (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          )
        ))}
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
      
      {/* Subtle grid - no animation */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:60px_60px]" />
    </div>
  );
});
HeroBackground.displayName = "HeroBackground";

// Main optimized component
const OptimizedHeroSection = () => {
  // Defer animations until after First Paint
  const animationsReady = useDeferredAnimation({ minDelay: 150, waitForIdle: true });
  const shouldReduceAnimations = useShouldReduceAnimations();
  const prefersReducedMotion = useReducedMotion();
  
  // Enable animations only when ready and user doesn't prefer reduced motion
  const enableAnimations = animationsReady && !shouldReduceAnimations && !prefersReducedMotion;

  return (
    <section 
      dir="rtl"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background - deferred */}
      <HeroBackground enableAnimations={enableAnimations} />
      
      {/* Main Content - static first, animated later */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <StaticHeroContent />
        <HeroCTAButtons enableAnimations={enableAnimations} />
        <HeroStats enableAnimations={enableAnimations} />

        {/* Scroll Indicator */}
        {enableAnimations && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 sm:mt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-white/50"
            >
              <span className="text-xs">اكتشف المزيد</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
        
        {!enableAnimations && (
          <div className="mt-12 sm:mt-16 flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs">اكتشف المزيد</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(OptimizedHeroSection);
