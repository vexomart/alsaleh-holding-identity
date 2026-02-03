/**
 * Overview Header - Modern Premium Dashboard Header
 * Clean, minimal design with gradient accents
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Copy,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Cloud,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OverviewHeaderProps {
  greeting: string;
  userName: string;
  customerId?: string;
  isVerified?: boolean;
  isRTL: boolean;
}

export function OverviewHeader({
  greeting,
  userName,
  customerId,
  isVerified,
  isRTL,
}: OverviewHeaderProps) {
  const [copiedId, setCopiedId] = useState(false);
  const reducedMotion = useReducedMotion();

  const copyClientId = () => {
    if (customerId) {
      navigator.clipboard.writeText(customerId);
      setCopiedId(true);
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? "تم نسخ رقم العميل" : "Client ID copied",
      });
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const currentDate = new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hour = new Date().getHours();
  const TimeIcon = hour < 12 ? Sun : hour < 18 ? Cloud : Moon;

  return (
    <motion.section
      initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-emerald-500/20 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-500/20 via-primary/10 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-5">
              {/* Date Badge */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <TimeIcon className="h-4 w-4 text-amber-400" />
                <span className="text-white/70 text-sm font-medium">{currentDate}</span>
              </motion.div>

              {/* Greeting */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {greeting}
                </h1>
                <div className="flex items-center gap-3">
                  <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                    {userName}
                  </p>
                  <span className="text-3xl">👋</span>
                </div>
              </motion.div>

              {/* Welcome Message */}
              <motion.p
                initial={reducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed"
              >
                {isRTL
                  ? "مرحباً بك في بوابة العميل. تابع طلباتك وعقودك وفواتيرك من مكان واحد."
                  : "Welcome to your portal. Track orders, contracts, and invoices all in one place."}
              </motion.p>

              {/* Status Pills */}
              <motion.div
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-medium">
                    {isRTL ? "حسابك نشط" : "Account Active"}
                  </span>
                </div>
                {isVerified && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="text-primary text-xs font-medium">
                      {isRTL ? "موثق" : "Verified"}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Client ID Card */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative lg:self-center"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 rounded-2xl blur-xl opacity-50" />
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-5 min-w-[260px] border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-wider">
                        {isRTL ? "رقم العميل" : "Client ID"}
                      </p>
                      <p className="text-white/80 text-sm font-semibold">
                        {isRTL ? "معرّف فريد" : "Unique Identifier"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ID Display */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <span dir="ltr" className="font-mono text-lg text-white tracking-widest tabular-nums">
                      {customerId || "---"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyClientId}
                      className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedId ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-white/5">
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
                    ASH Holding Group
                  </span>
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </motion.section>
  );
}
