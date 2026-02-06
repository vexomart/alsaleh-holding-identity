/**
 * Cyber Logo Component - Enterprise Security Design
 * Animated shield logo with cyber effects
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function CyberLogo({ size = 'md', showText = true, className }: CyberLogoProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xl' },
    lg: { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-2xl' },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Logo Container */}
      <motion.div
        className={cn(
          "relative flex items-center justify-center",
          sizes[size].container
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Outer Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsla(190, 100%, 50%, 0.3), hsla(260, 100%, 50%, 0.2))',
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Main Logo Background */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px',
            }}
          />
          
          {/* Shield Icon */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Shield className={cn(sizes[size].icon, "text-cyan-400")} />
            <Lock className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", 
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5',
              "text-white"
            )} />
          </motion.div>
          
          {/* Corner Accents */}
          <div className="absolute top-1 start-1 w-2 h-2 border-t border-s border-cyan-500/50" />
          <div className="absolute top-1 end-1 w-2 h-2 border-t border-e border-cyan-500/50" />
          <div className="absolute bottom-1 start-1 w-2 h-2 border-b border-s border-purple-500/30" />
          <div className="absolute bottom-1 end-1 w-2 h-2 border-b border-e border-purple-500/30" />
        </div>
        
        {/* Animated Border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="12"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -20 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsla(190, 100%, 60%, 0.6)" />
              <stop offset="100%" stopColor="hsla(260, 100%, 60%, 0.4)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <span className={cn(sizes[size].text, "font-bold text-white tracking-tight")}>
            ASH <span className="text-cyan-400">HOLDING</span>
          </span>
          <span className="text-[10px] sm:text-xs text-white/40 font-medium tracking-wider uppercase">
            SECURE PLATFORM
          </span>
        </motion.div>
      )}
    </div>
  );
}
