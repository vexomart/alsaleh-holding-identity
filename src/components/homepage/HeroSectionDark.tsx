/**
 * ASH HOLDING Hero Section - Dark Theme
 * Clean, dark, professional, stable
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, 
  Clock, 
  BadgeCheck, 
  Sparkles,
  Globe,
  Code2,
  Palette,
  TrendingUp,
  ArrowLeft,
  Play,
  Calendar,
  Trophy,
  Users,
  Star
} from "lucide-react";

const features = [
  { icon: Zap, label: "تفعيل فوري", labelEn: "Instant Activation" },
  { icon: Clock, label: "دعم على مدار الساعة", labelEn: "24/7 Support" },
  { icon: BadgeCheck, label: "جودة مضمونة", labelEn: "Guaranteed Quality" },
  { icon: Sparkles, label: "أسعار تنافسية", labelEn: "Competitive Prices" },
];

const serviceHighlights = [
  { 
    icon: TrendingUp, 
    title: "التسويق الرقمي", 
    subtitle: "نمو رقمي مضمون",
    color: "hp-icon-blue" 
  },
  { 
    icon: Code2, 
    title: "البرمجة والتطوير", 
    subtitle: "مواقع وتطبيقات احترافية",
    color: "hp-icon-green" 
  },
  { 
    icon: Palette, 
    title: "التصميم الإبداعي", 
    subtitle: "هوية بصرية مميزة",
    color: "hp-icon-pink" 
  },
  { 
    icon: Globe, 
    title: "خدمات رقمية", 
    subtitle: "حلول متكاملة ومتنوعة",
    color: "hp-icon-orange" 
  },
];

const achievements = [
  { icon: Calendar, value: "2016", label: "سنة التأسيس" },
  { icon: Trophy, value: "14,883", label: "مشروع منجز" },
  { icon: Users, value: "9,512", label: "عميل راضٍ" },
  { icon: Star, value: "100%", label: "معدل الرضا" },
];

export function HeroSectionDark() {
  return (
    <section 
      dir="rtl" 
      className="hero-section relative min-h-[calc(100vh-100px)] flex items-center justify-center overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Subtle Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[hsl(200_85%_55%/0.08)] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[hsl(173_70%_45%/0.06)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--hp-bg-card))] border border-[hsl(var(--hp-border))] rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-[hsl(var(--hp-primary))]" />
            <span className="text-[hsl(var(--hp-text-muted))]">شركة قابضة عالمية • منذ 2016</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </span>
        </motion.div>

        {/* Main Title - ASH HOLDING */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 dir="ltr" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="text-[hsl(var(--hp-text))]">ASH </span>
            <span className="hp-gradient-text">HOLDING</span>
          </h1>
          {/* Animated Underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-[hsl(var(--hp-primary))] via-[hsl(var(--hp-secondary))] to-[hsl(var(--hp-accent))] mx-auto mt-4 rounded-full max-w-xs sm:max-w-md"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-4"
        >
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-[hsl(var(--hp-secondary))]">
            رؤية • ابتكار • تميز
          </p>
        </motion.div>

        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-base sm:text-lg md:text-xl text-[hsl(var(--hp-text-muted))] max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          رؤية مستقبلية في عالم التقنية والإعلام، نبني جسوراً نحو الابتكار والتميز العالمي
          <br />
          <span className="text-[hsl(var(--hp-text-subtle))]">مع شركاء النجاح حول العالم لتحقيق أهداف استثنائية</span>
        </motion.p>

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`hp-pill ${index === 0 ? 'active' : ''}`}
            >
              <feature.icon className="w-4 h-4" />
              <span>{feature.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Service Highlights Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto mb-12"
        >
          {serviceHighlights.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="service-card p-5 text-center group cursor-pointer"
            >
              <div className={`hp-icon-box ${service.color} mx-auto mb-4`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[hsl(var(--hp-text))] mb-1 text-sm sm:text-base">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-[hsl(var(--hp-text-muted))]">
                {service.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
        >
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="hp-stat-card"
            >
              <item.icon className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--hp-primary))]" />
              <div className="text-2xl sm:text-3xl font-black text-[hsl(var(--hp-text))]">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-[hsl(var(--hp-text-muted))]">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/integrated-services">
            <button className="hp-btn-primary text-base">
              <Globe className="w-5 h-5" />
              <span>استكشف خدماتنا</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <Link to="/book-consultation">
            <button className="hp-btn-secondary text-base relative">
              <Play className="w-5 h-5" />
              <span>استشارة مجانية</span>
              {/* Free Badge */}
              <span className="absolute -top-2 -left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                مجاناً
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSectionDark;
