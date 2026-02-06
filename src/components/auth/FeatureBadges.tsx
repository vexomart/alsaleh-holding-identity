/**
 * Feature Badges - Premium Trust Indicators
 * World-Class SaaS Design
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, CheckCircle2, Globe, Fingerprint } from 'lucide-react';

interface FeatureBadgesProps {
  variant?: 'login' | 'register';
  layout?: 'horizontal' | 'vertical';
}

export function FeatureBadges({ variant = 'login', layout = 'horizontal' }: FeatureBadgesProps) {
  const features = variant === 'login' ? [
    { icon: Shield, text: 'تشفير متقدم', color: 'from-blue-500/20 to-blue-600/10' },
    { icon: Zap, text: 'دخول فوري', color: 'from-cyan-500/20 to-cyan-600/10' },
    { icon: Lock, text: 'حماية 24/7', color: 'from-indigo-500/20 to-indigo-600/10' },
  ] : [
    { icon: CheckCircle2, text: 'تسجيل سريع', color: 'from-emerald-500/20 to-emerald-600/10' },
    { icon: Fingerprint, text: 'تحقق آمن', color: 'from-blue-500/20 to-blue-600/10' },
    { icon: Globe, text: 'وصول عالمي', color: 'from-purple-500/20 to-purple-600/10' },
  ];

  const containerClass = layout === 'horizontal' 
    ? "flex flex-wrap justify-center gap-2 sm:gap-3"
    : "flex flex-col gap-2";

  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-gradient-to-r ${feature.color}
            border border-white/[0.06] backdrop-blur-sm
            ${layout === 'horizontal' ? '' : 'w-full'}
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
            <feature.icon className="w-4 h-4 text-white/70" />
          </div>
          <span className="text-xs sm:text-sm text-white/60 font-medium">{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
