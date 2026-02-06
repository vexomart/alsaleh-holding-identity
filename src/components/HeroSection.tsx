/**
 * HeroSection - Premium Enterprise Hero
 * Cinematic RTL hero with advanced animations
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Trophy, 
  Users, 
  Star, 
  Play, 
  Target, 
  Globe, 
  ChevronDown,
  Rocket,
  MessageCircle,
  Sparkles,
  Code2,
  Zap,
  Building2,
  Shield,
  ArrowLeft
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const businessImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  ];

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

  // Floating icons for ambient effect
  const floatingIcons = [
    { Icon: Code2, x: "10%", y: "20%" },
    { Icon: Globe, x: "85%", y: "15%" },
    { Icon: Zap, x: "15%", y: "70%" },
    { Icon: Building2, x: "80%", y: "65%" },
    { Icon: Shield, x: "50%", y: "10%" },
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
    <section 
      dir="rtl"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Dynamic Background with Ken Burns Effect */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {businessImages.map((image, index) => (
            index === currentSlide && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
              />
            )
          ))}
        </AnimatePresence>
        
        {/* Animated Gradient Overlays */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.3),transparent_50%)]" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.3),transparent_50%)]" 
        />
      </div>
      
      {/* Premium Corporate Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
      
      {/* Animated Grid Pattern */}
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" 
      />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map(({ Icon, x, y }, index) => (
          <motion.div
            key={index}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [-20, 20, -20],
              rotate: [-10, 10, -10]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              delay: index * 0.5,
              ease: "easeInOut"
            }}
            className="absolute hidden md:block"
            style={{ left: x, top: y }}
          >
            <Icon className="w-8 h-8 text-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Interactive Mouse Follower */}
      <motion.div 
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className="absolute w-48 h-48 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none hidden md:block"
      />
      
      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8 lg:mb-10"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary animate-pulse" />
            <span className="text-sm sm:text-base font-bold text-white">
              شركة قابضة عالمية • منذ 2016
            </span>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
        
        {/* Main Title - RTL Order: ASH on right, HOLDING on left */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          >
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="inline-block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
            >
              HOLDING
            </motion.span>
            {" "}
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-block"
            >
              ASH
            </motion.span>
          </h1>
          
          {/* Animated Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="h-1 sm:h-1.5 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mt-4 rounded-full max-w-xs sm:max-w-md"
          />
        </motion.div>
        
        {/* Subtitle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary" />
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
            رؤية • ابتكار • تميز
          </p>
          <Rocket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary" />
        </motion.div>
        
        {/* Description */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto"
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
            رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60 mt-2 sm:mt-3">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
          </p>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/integrated-services">
              <Button 
                size="lg" 
                className="bg-gradient-to-l from-primary via-primary-variant to-accent hover:opacity-90 text-primary-foreground font-bold w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-primary/30 border border-white/10 rounded-2xl group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  استكشف خدماتنا
                  <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/book-consultation">
              <Button 
                size="lg"
                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-xl border border-white/20 rounded-2xl group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  استشارة مجانية
                  <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                {/* Free Badge */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -left-2 bg-gradient-to-r from-destructive to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  مجاناً
                </motion.div>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative text-center group"
              >
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 group-hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${achievement.color} opacity-10 rounded-br-full`} />
                  
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="mb-3 flex justify-center"
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center shadow-lg ${achievement.shadowColor}`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Number */}
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1">
                    <AnimatedCounter 
                      end={achievement.number} 
                      suffix={achievement.suffix || ""} 
                      duration={2000}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="text-sm sm:text-base font-bold text-white/90 mb-0.5">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-white/50">
                    {achievement.titleEn}
                  </div>
                  
                  {/* Bottom Accent Line */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-l ${achievement.color}`}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
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
      </motion.div>
    </section>
  );
};

export default HeroSection;
