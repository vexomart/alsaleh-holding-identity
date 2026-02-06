/**
 * Auth Card Component - Glassmorphism Container
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative w-full", className)}
    >
      {/* Outer glow border */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-white/0" />
      
      {/* Card body */}
      <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/20">
        {/* Inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative p-6 sm:p-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
