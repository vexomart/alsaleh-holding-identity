/**
 * Cyber Hero Section - Enterprise Security Design
 * Clean, organized layout with proper RTL alignment
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, Key, CheckCircle2, Zap, Globe, Server } from 'lucide-react';

interface CyberHeroSectionProps {
  variant?: 'login' | 'register';
}

// Security stat card - RTL optimized
function StatCard({ icon: Icon, value, label, delay }: { 
  icon: React.ElementType; 
  value: string; 
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="w-11 h-11 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="text-end flex-1">
        <div className="text-lg font-bold text-white">{value}</div>
        <div className="text-xs text-white/50">{label}</div>
      </div>
    </motion.div>
  );
}

// Feature badge - RTL optimized
function FeatureBadge({ icon: Icon, text, delay }: { 
  icon: React.ElementType; 
  text: string; 
  delay: number;
}) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-cyan-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Icon className="w-4 h-4 text-cyan-400" />
      <span className="text-sm text-white/80 font-medium">{text}</span>
    </motion.div>
  );
}

export function CyberHeroSection({ variant = 'login' }: CyberHeroSectionProps) {
  const isLogin = variant === 'login';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 xl:p-12 overflow-hidden" dir="rtl">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-bl from-slate-950/90 via-transparent to-purple-950/30" />
      
      {/* Animated Grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      
      {/* Content - RTL aligned */}
      <div className="relative z-10 w-full max-w-xl space-y-6">
        {/* Badge */}
        <motion.div
          className="flex justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">
              {isLogin ? 'بوابة آمنة مشفرة' : 'انضم إلى منظومتنا الآمنة'}
            </span>
          </div>
        </motion.div>
        
        {/* Title */}
        <motion.h1
          className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isLogin ? (
            <>
              مرحباً بعودتك إلى
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-blue-500">
                منصة ASH الآمنة
              </span>
            </>
          ) : (
            <>
              ابدأ رحلتك مع
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-purple-500">
                بيئة محمية بالكامل
              </span>
            </>
          )}
        </motion.h1>
        
        {/* Description */}
        <motion.p
          className="text-base lg:text-lg text-white/60 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isLogin 
            ? 'نظام مصادقة متعدد الطبقات يحمي بياناتك بأعلى معايير الأمان العالمية'
            : 'أنشئ حسابك واستمتع بحماية فائقة لبياناتك وأعمالك'
          }
        </motion.p>
        
        {/* Feature Badges - Organized row */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FeatureBadge icon={Lock} text="تشفير 256-bit" delay={0.35} />
          <FeatureBadge icon={Fingerprint} text="مصادقة ثنائية" delay={0.4} />
          <FeatureBadge icon={Key} text="JWT Tokens" delay={0.45} />
          <FeatureBadge icon={Globe} text="SSL/TLS" delay={0.5} />
        </motion.div>
        
        {/* Stats Grid - 2x2 organized */}
        <motion.div 
          className="grid grid-cols-2 gap-3 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <StatCard icon={Zap} value="<50ms" label="زمن الاستجابة" delay={0.55} />
          <StatCard icon={Shield} value="99.9%" label="وقت التشغيل" delay={0.6} />
          <StatCard icon={CheckCircle2} value="ISO 27001" label="معايير الأمان" delay={0.65} />
          <StatCard icon={Server} value="SOC2" label="معتمد" delay={0.7} />
        </motion.div>
      </div>
      
      {/* Decorative Shield */}
      <motion.div
        className="absolute bottom-8 start-8 opacity-[0.03] pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.03 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Shield className="w-48 h-48" />
      </motion.div>
    </div>
  );
}
