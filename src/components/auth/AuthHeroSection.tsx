/**
 * Auth Hero Section - Premium 3D Visual Display
 * World-Class SaaS Design with Animated Elements
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock, Cloud, Cpu, Network, Sparkles } from 'lucide-react';

interface AuthHeroSectionProps {
  variant?: 'login' | 'register';
}

export function AuthHeroSection({ variant = 'login' }: AuthHeroSectionProps) {
  const features = variant === 'login' ? [
    { icon: Shield, title: 'حماية متقدمة', desc: 'تشفير 256-bit' },
    { icon: Zap, title: 'أداء فائق', desc: 'استجابة فورية' },
    { icon: Globe, title: 'وصول عالمي', desc: 'من أي مكان' },
  ] : [
    { icon: Lock, title: 'خصوصية تامة', desc: 'بياناتك آمنة' },
    { icon: Cloud, title: 'تخزين سحابي', desc: 'نسخ احتياطي دائم' },
    { icon: Cpu, title: 'تقنية متطورة', desc: 'أحدث التقنيات' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 lg:p-12">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating 3D Shapes */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsla(220, 100%, 60%, 0.15), hsla(265, 100%, 60%, 0.1))',
            top: '15%',
            right: '10%',
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsla(185, 100%, 50%, 0.12), transparent)',
            bottom: '20%',
            left: '15%',
            filter: 'blur(30px)',
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1.05, 1, 1.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="heroLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsla(220, 100%, 70%, 0.8)" />
              <stop offset="100%" stopColor="hsla(265, 100%, 70%, 0.4)" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 15}%`}
              y1={`${15 + (i % 3) * 20}%`}
              x2={`${35 + i * 10}%`}
              y2={`${55 + (i % 2) * 25}%`}
              stroke="url(#heroLineGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </svg>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* 3D Floating Icon Container */}
          <motion.div
            className="relative w-28 h-28 mx-auto mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, hsla(220, 100%, 60%, 0.1), hsla(265, 100%, 60%, 0.05))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner Glow */}
            <div className="absolute inset-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 backdrop-blur-sm border border-white/[0.08]" />
            
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Network className="w-12 h-12 text-blue-400" />
            </div>
            
            {/* Sparkle Effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + i * 25}%`,
                  right: `${-5 + i * 10}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <Sparkles className="w-4 h-4 text-blue-400/60" />
              </motion.div>
            ))}
          </motion.div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            {variant === 'login' ? 'مرحباً بعودتك' : 'انضم إلينا'}
          </h2>
          <p className="text-white/50 text-base lg:text-lg">
            {variant === 'login' 
              ? 'قم بتسجيل الدخول للوصول إلى لوحة التحكم' 
              : 'ابدأ رحلتك مع ASH Holding اليوم'}
          </p>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ 
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                x: 5,
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 flex items-center justify-center border border-white/[0.08]">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-start">
                <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                <p className="text-white/40 text-xs">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Trust Badge */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border-2 border-slate-900 flex items-center justify-center"
              >
                <span className="text-xs text-white/60">👤</span>
              </div>
            ))}
          </div>
          <div className="text-start">
            <p className="text-white/60 text-xs">+10,000 مستخدم نشط</p>
            <p className="text-white/30 text-[10px]">يثقون بنا يومياً</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
