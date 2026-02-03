/**
 * Overview Header V2 - Next-Gen Premium Dashboard Header
 * Ultra-modern design with advanced animations & world-class features
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import {
  Copy,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Zap,
  TrendingUp,
  Star,
  Crown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FloatingParticles } from "./FloatingParticles";
import { GlowingOrbs } from "./GlowingOrbs";
import { AnimatedGridPattern } from "./AnimatedGridPattern";

interface OverviewHeaderProps {
  greeting: string;
  userName: string;
  customerId?: string;
  isVerified?: boolean;
  isRTL: boolean;
}

// Animated word component (Arabic-safe - doesn't break character connections)
const AnimatedWord = ({ word, index, isRTL }: { word: string; index: number; isRTL: boolean }) => {
  const reducedMotion = useReducedMotion();
  
  return (
    <motion.span
      className="inline-block"
      initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut" as const,
      }}
    >
      {word}
    </motion.span>
  );
};

// Live status indicator with pulse
const LiveIndicator = ({ isRTL }: { isRTL: boolean }) => (
  <motion.div
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5 }}
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
    <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">
      {isRTL ? "نشط الآن" : "Live"}
    </span>
  </motion.div>
);

// Premium tier badge
const PremiumBadge = ({ isRTL, isVerified }: { isRTL: boolean; isVerified?: boolean }) => {
  if (!isVerified) return null;
  
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 backdrop-blur-sm"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Crown className="h-3.5 w-3.5 text-amber-400" />
      <span className="text-amber-400 text-xs font-semibold">
        {isRTL ? "عميل موثق" : "Verified Client"}
      </span>
    </motion.div>
  );
};

export function OverviewHeader({
  greeting,
  userName,
  customerId,
  isVerified,
  isRTL,
}: OverviewHeaderProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const reducedMotion = useReducedMotion();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const copyClientId = useCallback(() => {
    if (customerId) {
      navigator.clipboard.writeText(customerId);
      setCopiedId(true);
      toast({
        title: isRTL ? "✓ تم النسخ" : "✓ Copied",
        description: isRTL ? "تم نسخ رقم العميل بنجاح" : "Client ID copied to clipboard",
      });
      setTimeout(() => setCopiedId(false), 2500);
    }
  }, [customerId, isRTL]);

  const currentDate = currentTime.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = currentTime.getHours();
  const TimeIcon = hour < 6 ? Moon : hour < 12 ? Sun : hour < 18 ? Cloud : Moon;
  const timeIconColor = hour < 6 || hour >= 18 ? "text-indigo-400" : hour < 12 ? "text-amber-400" : "text-sky-400";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: reducedMotion ? {} : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <motion.section
      initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Main Card with Advanced Effects */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-2xl shadow-black/20">
        
        {/* Ambient Effects Layer */}
        <GlowingOrbs />
        <FloatingParticles count={15} />
        <AnimatedGridPattern />

        {/* Top Accent Line with Animation */}
        <motion.div
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 p-6 md:p-8 lg:p-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-center">
            
            {/* Main Greeting Column (3/5) */}
            <motion.div variants={itemVariants} className="lg:col-span-3 order-1">
              {/* Status Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <LiveIndicator isRTL={isRTL} />
                <PremiumBadge isRTL={isRTL} isVerified={isVerified} />
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-white/60 text-xs">{currentDate}</span>
                </motion.div>
              </div>

              {/* Greeting with Time Icon */}
              <div className="flex items-center gap-4 mb-4">
                {/* Animated Time Icon */}
                <motion.div
                  className="relative shrink-0"
                  animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-amber-400/40 rounded-2xl blur-xl" />
                  <div className={cn(
                    "relative w-16 h-16 md:w-20 md:h-20 rounded-2xl",
                    "bg-gradient-to-br from-white/10 to-white/5",
                    "backdrop-blur-xl border border-white/20",
                    "flex items-center justify-center",
                    "shadow-xl shadow-black/20"
                  )}>
                    <TimeIcon className={cn("h-8 w-8 md:h-10 md:w-10", timeIconColor)} />
                  </div>
                </motion.div>

                {/* Greeting Text with Word Animation (Arabic-safe) */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    <span className="inline-flex flex-wrap items-baseline gap-x-3">
                      <span className="flex flex-wrap gap-x-2">
                        {greeting.split(" ").map((word, i) => (
                          <AnimatedWord key={i} word={word} index={i} isRTL={isRTL} />
                        ))}
                      </span>
                      <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent font-extrabold flex flex-wrap gap-x-2">
                        {userName.split(" ").map((word, i) => (
                          <AnimatedWord key={i} word={word} index={greeting.split(" ").length + i} isRTL={isRTL} />
                        ))}
                      </span>
                      <motion.span
                        className="text-2xl md:text-3xl"
                        animate={reducedMotion ? {} : { rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, delay: 1, repeat: 2 }}
                      >
                        👋
                      </motion.span>
                    </span>
                  </h1>
                </div>
              </div>

              {/* Welcome Message with Typing Effect */}
              <motion.p
                className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {isRTL
                  ? "مرحباً بك في بوابتك الذكية. تابع طلباتك وعقودك وفواتيرك واحصل على رؤى فورية من مكان واحد."
                  : "Welcome to your smart portal. Track orders, contracts, invoices and get instant insights all in one place."}
              </motion.p>

              {/* Quick Stats Row */}
              <motion.div
                className="flex flex-wrap items-center gap-4 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>{isRTL ? "تحديثات فورية" : "Real-time updates"}</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span>{isRTL ? "تحليلات ذكية" : "Smart analytics"}</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Star className="h-4 w-4 text-primary" />
                  <span>{isRTL ? "خدمة VIP" : "VIP Service"}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Client ID Card Column (2/5) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 order-2 flex justify-center lg:justify-end"
            >
              <ClientIDCard
                customerId={customerId}
                isVerified={isVerified}
                isRTL={isRTL}
                copiedId={copiedId}
                onCopy={copyClientId}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Gradient Line with Pulse */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.section>
  );
}

// Extracted Client ID Card Component
interface ClientIDCardProps {
  customerId?: string;
  isVerified?: boolean;
  isRTL: boolean;
  copiedId: boolean;
  onCopy: () => void;
}

function ClientIDCard({ customerId, isVerified, isRTL, copiedId, onCopy }: ClientIDCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-[340px]">
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-emerald-500/30 to-primary/30 rounded-3xl blur-xl"
        animate={reducedMotion ? {} : { opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white/10 to-white/5",
        "backdrop-blur-xl border border-white/10",
        "shadow-2xl shadow-black/30"
      )}>
        {/* Card Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/30"
              animate={reducedMotion ? {} : { rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-white/50 text-xs uppercase tracking-widest font-medium">
                {isRTL ? "رقم العميل الفريد" : "Unique Client ID"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-white/80 text-sm font-semibold">
                  {isRTL ? "معرّف موثق" : "Verified Identifier"}
                </p>
                {isVerified && (
                  <ShieldCheck className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ID Display */}
        <div className="px-6 pb-4">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
            <div className="flex items-center justify-between gap-3">
              <motion.span
                dir="ltr"
                className="font-mono text-lg md:text-xl text-white tracking-wider tabular-nums truncate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                {customerId || "---"}
              </motion.span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCopy}
                className={cn(
                  "h-10 w-10 rounded-xl transition-all duration-300 shrink-0",
                  copiedId 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                <AnimatePresence mode="wait">
                  {copiedId ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <motion.span
              className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-medium"
              animate={reducedMotion ? {} : { opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ASH Holding Group
            </motion.span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
