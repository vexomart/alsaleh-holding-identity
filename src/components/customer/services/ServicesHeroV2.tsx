/**
 * Services Hero V2 - Premium animated hero section
 */

import { motion } from "framer-motion";
import { Sparkles, Package, Layers, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicesHeroV2Props {
  totalServices: number;
  totalCategories: number;
  isRTL: boolean;
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={value}
    >
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}

// Floating particle
function FloatingParticle({ delay, size, color, left, top }: {
  delay: number;
  size: number;
  color: string;
  left: string;
  top: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.7, 0.3],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export function ServicesHeroV2({ totalServices, totalCategories, isRTL }: ServicesHeroV2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10"
    >
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Glowing orbs */}
        <motion.div
          className="absolute -top-32 -right-32 w-64 h-64 bg-primary/30 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Floating particles */}
        <FloatingParticle delay={0} size={100} color="rgba(59, 130, 246, 0.3)" left="10%" top="20%" />
        <FloatingParticle delay={1} size={80} color="rgba(168, 85, 247, 0.3)" left="80%" top="30%" />
        <FloatingParticle delay={2} size={60} color="rgba(16, 185, 129, 0.3)" left="50%" top="60%" />
        <FloatingParticle delay={0.5} size={40} color="rgba(245, 158, 11, 0.3)" left="30%" top="70%" />

        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.line
            x1="0%" y1="100%" x2="100%" y2="0%"
            stroke="url(#gradient1)"
            strokeWidth="1"
            strokeDasharray="10 20"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
            </motion.div>
            <span className="text-sm font-medium text-white/90">
              {isRTL ? "خدمات متكاملة" : "Complete Services"}
            </span>
          </motion.div>

          {/* Title with word animation */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {(isRTL ? "اكتشف خدماتنا" : "Discover Our Services").split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="inline-block mx-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg text-white/60 max-w-xl mb-8 leading-relaxed"
          >
            {isRTL
              ? "نقدم لك مجموعة شاملة من الخدمات التقنية والرقمية لتحقيق أهداف أعمالك"
              : "We offer a comprehensive range of technical and digital services to achieve your business goals"}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 md:gap-12"
          >
            {/* Services stat */}
            <div className="text-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 mb-2">
                  <Package className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                </div>
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter value={totalServices} />
              </div>
              <div className="text-xs md:text-sm text-white/50 font-medium">
                {isRTL ? "خدمة" : "Services"}
              </div>
            </div>

            {/* Divider */}
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* Categories stat */}
            <div className="text-center group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 mb-2">
                  <Layers className="h-6 w-6 md:h-7 md:w-7 text-cyan-400" />
                </div>
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter value={totalCategories} />
              </div>
              <div className="text-xs md:text-sm text-white/50 font-medium">
                {isRTL ? "قسم" : "Sections"}
              </div>
            </div>
          </motion.div>

          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-2 text-xs text-white/40"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Activity className="h-3 w-3" />
            <span>{isRTL ? "متاح الآن" : "Available Now"}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ServicesHeroV2;
