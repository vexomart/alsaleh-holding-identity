/**
 * Cyber Auth Card - Enterprise Security Design
 * Advanced glassmorphism with animated cyber borders
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberAuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function CyberAuthCard({ children, className }: CyberAuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("relative w-full", className)}
    >
      {/* Animated Border Glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl opacity-60"
        style={{
          background: 'linear-gradient(135deg, hsla(190, 100%, 50%, 0.4), hsla(260, 100%, 50%, 0.2), hsla(190, 100%, 50%, 0.4))',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Secondary Glow Ring */}
      <motion.div 
        className="absolute -inset-[2px] rounded-2xl sm:rounded-3xl blur-sm opacity-30"
        style={{
          background: 'linear-gradient(135deg, hsla(190, 100%, 60%, 0.5), transparent, hsla(260, 100%, 60%, 0.5))',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Main Card Body */}
      <div className={cn(
        "relative rounded-2xl sm:rounded-3xl overflow-hidden",
        "backdrop-blur-2xl",
        "bg-slate-950/80 border border-cyan-500/20",
        "shadow-2xl shadow-cyan-900/20"
      )}>
        {/* Inner Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none" />
        
        {/* Top Accent Line */}
        <motion.div 
          className="absolute top-0 inset-x-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, hsla(190, 100%, 60%, 0.5), hsla(260, 100%, 60%, 0.3), transparent)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Corner Accents */}
        <div className="absolute top-0 start-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-s-2 border-cyan-500/30 rounded-tl-2xl sm:rounded-tl-3xl" />
        <div className="absolute top-0 end-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-e-2 border-cyan-500/30 rounded-tr-2xl sm:rounded-tr-3xl" />
        <div className="absolute bottom-0 start-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-s-2 border-purple-500/20 rounded-bl-2xl sm:rounded-bl-3xl" />
        <div className="absolute bottom-0 end-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-e-2 border-purple-500/20 rounded-br-2xl sm:rounded-br-3xl" />
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Content Container */}
        <div className="relative p-5 sm:p-6 lg:p-8">
          {children}
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
