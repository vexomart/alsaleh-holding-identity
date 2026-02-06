/**
 * Cyber Hero Section - Enterprise Security Design
 * Animated 3D network visualization with security stats
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Fingerprint, Key, CheckCircle2, Zap, Globe, Server } from 'lucide-react';

interface CyberHeroSectionProps {
  variant?: 'login' | 'register';
}

// Security stat card
function StatCard({ icon: Icon, value, label, delay }: { 
  icon: React.ElementType; 
  value: string; 
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-cyan-500/15 flex items-center justify-center">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
      </div>
      <div>
        <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
        <div className="text-xs sm:text-sm text-white/50">{label}</div>
      </div>
    </motion.div>
  );
}

// Feature badge
function FeatureBadge({ icon: Icon, text, delay }: { 
  icon: React.ElementType; 
  text: string; 
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/50 border border-cyan-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
      <span className="text-xs sm:text-sm text-white/80 font-medium">{text}</span>
    </motion.div>
  );
}

export function CyberHeroSection({ variant = 'login' }: CyberHeroSectionProps) {
  const isLogin = variant === 'login';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 lg:p-12 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-transparent to-purple-950/30" />
      
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
      
      {/* Content */}
      <div className="relative z-10 max-w-lg text-center lg:text-start">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">
            {isLogin ? 'بوابة آمنة مشفرة' : 'انضم إلى منظومتنا الآمنة'}
          </span>
        </motion.div>
        
        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {isLogin ? (
            <>
              مرحباً بعودتك إلى
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                منصة ASH الآمنة
              </span>
            </>
          ) : (
            <>
              ابدأ رحلتك مع
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                بيئة محمية بالكامل
              </span>
            </>
          )}
        </motion.h1>
        
        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-white/60 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {isLogin 
            ? 'نظام مصادقة متعدد الطبقات يحمي بياناتك بأعلى معايير الأمان العالمية'
            : 'أنشئ حسابك واستمتع بحماية فائقة لبياناتك وأعمالك'
          }
        </motion.p>
        
        {/* Feature Badges */}
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-3 mb-8 justify-center lg:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FeatureBadge icon={Lock} text="تشفير 256-bit" delay={0.4} />
          <FeatureBadge icon={Fingerprint} text="مصادقة ثنائية" delay={0.5} />
          <FeatureBadge icon={Key} text="JWT Tokens" delay={0.6} />
          <FeatureBadge icon={Globe} text="SSL/TLS" delay={0.7} />
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard icon={Shield} value="99.9%" label="وقت التشغيل" delay={0.8} />
          <StatCard icon={Zap} value="<50ms" label="زمن الاستجابة" delay={0.9} />
          <StatCard icon={Server} value="SOC2" label="معتمد" delay={1.0} />
          <StatCard icon={CheckCircle2} value="ISO 27001" label="معايير الأمان" delay={1.1} />
        </div>
      </div>
      
      {/* Decorative Shield */}
      <motion.div
        className="absolute bottom-8 end-8 opacity-[0.03]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.03 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Shield className="w-64 h-64" />
      </motion.div>
    </div>
  );
}
