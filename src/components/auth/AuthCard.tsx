/**
 * Auth Card Component - Premium Glassmorphism
 * World-Class SaaS Design
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal';
}

export function AuthCard({ children, className, variant = 'default' }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.5 },
      }}
      className={cn("relative w-full", className)}
    >
      {/* Outer glow effect */}
      <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-50" />
      
      {/* Secondary glow ring */}
      <motion.div 
        className="absolute -inset-[2px] rounded-[30px] opacity-0"
        style={{
          background: 'linear-gradient(135deg, hsla(220, 100%, 60%, 0.3), hsla(265, 100%, 60%, 0.2), transparent)',
        }}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card body */}
      <div className={cn(
        "relative rounded-[26px] overflow-hidden",
        "backdrop-blur-2xl",
        variant === 'default' 
          ? "bg-slate-900/60 border border-white/[0.08]" 
          : "bg-slate-900/40 border border-white/[0.05]",
        "shadow-2xl shadow-black/30"
      )}>
        {/* Inner gradient shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02] pointer-events-none" />
        
        {/* Accent line at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Content container */}
        <div className="relative p-7 sm:p-9">
          {children}
        </div>
        
        {/* Bottom subtle gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
