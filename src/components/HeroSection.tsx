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
  Award, 
  TrendingUp, 
  Shield,
  ChevronDown,
  Rocket,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Code2,
  Zap,
  Building2
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Link } from "react-router-dom";

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
  ];

  const achievements = [
    { 
      icon: Calendar, 
      number: 2016, 
      title: "سنة التأسيس", 
      titleEn: "Foundation Year",
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
      description: "بداية رحلة النجاح"
    },
    { 
      icon: Trophy, 
      number: 14883, 
      title: "مشروع منجز", 
      titleEn: "Completed Projects",
      color: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/20",
      description: "إنجازات متميزة"
    },
    { 
      icon: Users, 
      number: 9512, 
      title: "عميل راضٍ", 
      titleEn: "Satisfied Clients",
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
      description: "ثقة العملاء"
    },
    { 
      icon: Star, 
      number: 100, 
      suffix: "%",
      title: "معدل الرضا", 
      titleEn: "Satisfaction Rate",
      color: "from-purple-500 to-pink-600",
      bgGlow: "bg-purple-500/20",
      description: "رضا كامل"
    }
  ];

  // Floating icons for ambient effect
  const floatingIcons = [
    { Icon: Code2, delay: 0, x: "10%", y: "20%" },
    { Icon: Globe, delay: 0.5, x: "85%", y: "15%" },
    { Icon: Zap, delay: 1, x: "15%", y: "70%" },
    { Icon: Building2, delay: 1.5, x: "80%", y: "65%" },
    { Icon: Shield, delay: 2, x: "50%", y: "10%" },
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

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
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]" 
        />
      </div>
      
      {/* Premium Corporate Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-indigo-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60" />
      
      {/* Animated Grid Pattern */}
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" 
      />
      
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [-20, 20, -20],
              rotate: [-10, 10, -10]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              delay,
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
        className="absolute w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none hidden md:block"
      />
      
      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Top Badge */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8 lg:mb-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            <span className="text-sm sm:text-base lg:text-lg font-bold text-white">
              شركة قابضة عالمية • منذ 2016
            </span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
        
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6 lg:mb-8">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          >
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-block"
            >
              ASH
            </motion.span>
            {" "}
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-block bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              HOLDING
            </motion.span>
          </motion.h1>
          
          {/* Animated Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="h-1 sm:h-1.5 bg-gradient-to-l from-blue-500 via-purple-500 to-pink-500 mx-auto mt-4 rounded-full max-w-xs sm:max-w-md"
          />
        </motion.div>
        
        {/* Subtitle */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400" />
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400">
            رؤية • ابتكار • تميز
          </p>
          <Rocket className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-400" />
        </motion.div>
        
        {/* Description */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto"
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium">
            رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mt-2 sm:mt-3">
            مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية
          </p>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg" 
              className="bg-gradient-to-l from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-purple-500/30 border border-white/10 rounded-2xl group relative overflow-hidden"
              onClick={() => {
                const companiesSection = document.getElementById('companies');
                companiesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                استكشف شركاتنا
                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              </span>
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/consultation">
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
                  className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  مجاناً
                </motion.div>
              </Button>
            </Link>
          </motion.div>

          {/* Video Button */}
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost"
              size="lg"
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 group"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-amber-400 transition-colors" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
        >
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="relative text-center group"
              >
                {/* Glow Effect */}
                <motion.div 
                  className={`absolute inset-0 ${achievement.bgGlow} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/10 group-hover:border-white/30 transition-all duration-500 overflow-hidden">
                  {/* Decorative Corner */}
                  <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${achievement.color} opacity-10 rounded-br-full`} />
                  
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="mb-3 sm:mb-4 flex justify-center"
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${achievement.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Number */}
                  <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-1 sm:mb-2">
                    <AnimatedCounter 
                      end={achievement.number} 
                      suffix={achievement.suffix || ""} 
                      duration={2000}
                    />
                  </div>
                  
                  {/* Title */}
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-white/90 mb-0.5 sm:mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {achievement.titleEn}
                  </div>
                  
                  {/* Hover Description */}
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    whileHover={{ opacity: 1, height: "auto" }}
                    className="text-xs text-white/50 mt-2 overflow-hidden"
                  >
                    {achievement.description}
                  </motion.div>
                  
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

        {/* Bottom Badges */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 sm:mt-14 lg:mt-16"
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[
              { text: "🏆 أفضل شركة قابضة 2024", color: "from-blue-600 to-purple-600" },
              { text: "🌟 100% معدل رضا العملاء", color: "from-emerald-600 to-teal-600" },
              { text: "🚀 قائد السوق العالمي", color: "from-orange-600 to-red-600" }
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Badge className={`bg-gradient-to-l ${badge.color} text-white px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full shadow-lg cursor-pointer`}>
                  {badge.text}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating Decorative Elements */}
      <motion.div 
        variants={floatVariants}
        animate="animate"
        className="hidden lg:block absolute top-24 left-20"
      >
        <Award className="w-8 h-8 text-amber-400/30" />
      </motion.div>
      <motion.div 
        variants={floatVariants}
        animate="animate"
        style={{ animationDelay: "1s" }}
        className="hidden lg:block absolute bottom-32 left-32"
      >
        <TrendingUp className="w-6 h-6 text-emerald-400/30" />
      </motion.div>
      <motion.div 
        variants={floatVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="hidden lg:block absolute top-40 right-24"
      >
        <Shield className="w-7 h-7 text-blue-400/30" />
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {businessImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-6 sm:w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
