/**
 * MaxioCore-Inspired Hero Section
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
  Share2,
  ArrowLeft,
  Play
} from "lucide-react";

const features = [
  { icon: Zap, label: "تفعيل فوري", labelEn: "Instant Activation" },
  { icon: Clock, label: "دعم على مدار الساعة", labelEn: "24/7 Support" },
  { icon: BadgeCheck, label: "جودة مضمونة", labelEn: "Guaranteed Quality" },
  { icon: Sparkles, label: "أسعار تنافسية", labelEn: "Competitive Prices" },
];

const serviceHighlights = [
  { 
    icon: Share2, 
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

export function HeroSectionDark() {
  return (
    <section 
      dir="rtl" 
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
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
            <span className="text-[hsl(var(--hp-text-muted))]">منصة الخدمات الرقمية الأولى</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="text-[hsl(var(--hp-text))]">حلول رقمية</span>
            <br />
            <span className="hp-gradient-text">متكاملة</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-base sm:text-lg md:text-xl text-[hsl(var(--hp-text-muted))] max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          نجمع بين قوة{" "}
          <span className="text-[hsl(var(--hp-primary))]">التسويق الذكي</span>
          {" "}و{" "}
          <span className="text-[hsl(var(--hp-secondary))]">البرمجة المتقدمة</span>
          {" "}و{" "}
          <span className="text-[hsl(var(--hp-accent))]">التصميم الإبداعي</span>
          {" "}لتحقيق نجاحك الرقمي
        </motion.p>

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto mb-12"
        >
          {serviceHighlights.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
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

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/auth?mode=signup">
            <button className="hp-btn-primary text-base">
              <Sparkles className="w-5 h-5" />
              <span>ابدأ الآن مجاناً</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <Link to="/our-services">
            <button className="hp-btn-secondary text-base">
              <Play className="w-5 h-5" />
              <span>شاهد كيف نعمل</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSectionDark;
