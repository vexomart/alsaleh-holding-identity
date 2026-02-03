/**
 * Overview Header - Premium Enterprise Dashboard Header
 * Teal/Gold corporate theme with glassmorphism
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
  Crown,
  TrendingUp,
  Calendar,
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

  return (
    <motion.section
      initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700" />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 end-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 start-0 w-64 h-64 bg-amber-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Gold accent line */}
      <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />

      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main content */}
          <div className="space-y-4 flex-1">
            {/* Date & Badge Row */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-white/90 text-xs font-medium">{currentDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/30">
                <Crown className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-amber-100 text-xs font-semibold">
                  {isRTL ? "عميل مميز" : "Premium Client"}
                </span>
              </div>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {greeting}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-amber-300 mt-1">
                {userName} 👋
              </p>
            </motion.div>

            {/* Welcome message */}
            <motion.p
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed"
            >
              {isRTL
                ? "مرحباً بك في بوابة العميل. تابع طلباتك وعقودك وفواتيرك من مكان واحد."
                : "Welcome to your portal. Track orders, contracts, and invoices all in one place."}
            </motion.p>

            {/* Quick Stats Row */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex items-center gap-2 text-white/70">
                <TrendingUp className="h-4 w-4 text-emerald-300" />
                <span className="text-sm">
                  {isRTL ? "حسابك نشط ومحدث" : "Your account is active & up to date"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Client ID Card - Premium Glass Design */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-amber-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 min-w-[220px] border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    {isRTL ? "رقم العميل" : "Client ID"}
                  </span>
                </div>
                {isVerified && (
                  <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-full">
                    <ShieldCheck className="h-3 w-3 text-emerald-300" />
                    <span className="text-xs text-emerald-300 font-medium">
                      {isRTL ? "موثق" : "Verified"}
                    </span>
                  </div>
                )}
              </div>

              {/* Client ID Display */}
              <div className="bg-slate-900/50 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between gap-3">
                  <span dir="ltr" className="font-mono text-lg text-white tracking-wider tabular-nums">
                    {customerId || "---"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyClientId}
                    className="h-9 w-9 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    {copiedId ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Decorative bottom */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
                <span className="text-[10px] text-white/50 uppercase tracking-widest">
                  ASH Holding Group
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
