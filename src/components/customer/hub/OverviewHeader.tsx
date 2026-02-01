/**
 * Overview Header - Premium App-like Sticky Header
 * Mobile-first, RTL-first with smooth animations
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Copy,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Sparkles,
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

  return (
    <motion.section
      initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Decorative gradients */}
      <div className="absolute top-0 end-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-56 h-56 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-5 md:p-8">
        {/* Top Row: Portal Badge + Client ID */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            {/* Portal Badge */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">
                {isRTL ? "بوابة العميل" : "Client Portal"}
              </span>
            </motion.div>

            {/* Greeting */}
            <motion.h1
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
            >
              {greeting}، {userName} 👋
            </motion.h1>

            <motion.p
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-sm md:text-base max-w-md"
            >
              {isRTL
                ? "مرحباً بك في لوحة التحكم. يمكنك متابعة طلباتك وعقودك من هنا."
                : "Welcome to your dashboard. Track orders and manage contracts here."}
            </motion.p>
          </div>

          {/* Client ID Card */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[180px] border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-300">
                {isRTL ? "رقم العميل" : "Client ID"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white text-sm tracking-wide" dir="ltr">
                {customerId || "---"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyClientId}
                className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10"
              >
                {copiedId ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {isVerified ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">
                    {isRTL ? "موثق" : "Verified"}
                  </span>
                </>
              ) : (
                <>
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400">
                    {isRTL ? "غير موثق" : "Not Verified"}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
