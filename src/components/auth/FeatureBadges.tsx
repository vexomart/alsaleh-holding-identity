/**
 * Feature Badges - Trust Indicators
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';

interface FeatureBadgesProps {
  variant?: 'login' | 'register';
}

export function FeatureBadges({ variant = 'login' }: FeatureBadgesProps) {
  const features = variant === 'login' ? [
    { icon: Shield, text: 'تسجيل آمن ومشفر' },
    { icon: Zap, text: 'دخول فوري' },
    { icon: Lock, text: 'حماية متقدمة' },
  ] : [
    { icon: Shield, text: 'بياناتك محمية' },
    { icon: Zap, text: 'تفعيل سريع' },
    { icon: Lock, text: 'خصوصية تامة' },
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-2 sm:gap-3"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.08 }}
        >
          <feature.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs text-white/60 font-medium">{feature.text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
