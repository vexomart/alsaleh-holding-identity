/**
 * Auth Card Component - Premium Glassmorphism
 * World-Class SaaS Design - Mobile Optimized
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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.4 },
      }}
      className={cn("relative w-full", className)}
    >
      {/* Outer glow effect */}
      <div className="absolute -inset-[1px] rounded-2xl sm:rounded-[28px] bg-gradient-to-b from-white/15 via-white/5 to-transparent opacity-50" />
      
      {/* Secondary glow ring */}
      <motion.div 
        className="absolute -inset-[2px] rounded-2xl sm:rounded-[30px] opacity-0"
        style={{
          background: 'linear-gradient(135deg, hsla(220, 100%, 60%, 0.3), hsla(265, 100%, 60%, 0.2), transparent)',
        }}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card body */}
      <div className={cn(
        "relative rounded-2xl sm:rounded-[26px] overflow-hidden",
        "backdrop-blur-xl sm:backdrop-blur-2xl",
        variant === 'default' 
          ? "bg-slate-900/70 sm:bg-slate-900/60 border border-white/[0.08]" 
          : "bg-slate-900/50 sm:bg-slate-900/40 border border-white/[0.05]",
        "shadow-xl sm:shadow-2xl shadow-black/30"
      )}>
        {/* Inner gradient shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-white/[0.02] pointer-events-none" />
        
        {/* Accent line at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        
        {/* Content container - Responsive padding */}
        <div className="relative p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        
        {/* Bottom subtle gradient */}
        <div className="absolute bottom-0 inset-x-0 h-20 sm:h-32 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
