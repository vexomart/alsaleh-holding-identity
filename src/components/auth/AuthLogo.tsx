/**
 * Auth Logo Component - Premium Brand Display
 * World-Class SaaS Design
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function AuthLogo({ size = 'md', showText = false, className }: AuthLogoProps) {
  const sizes = {
    sm: { container: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-xl' },
    md: { container: 'w-18 h-18', icon: 'w-9 h-9', text: 'text-2xl' },
    lg: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-3xl' },
  };

  return (
    <motion.div 
      className={cn("flex flex-col items-center gap-3", className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Container */}
      <motion.div
        className={cn(
          "relative rounded-2xl",
          "bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600",
          "flex items-center justify-center",
          "shadow-2xl shadow-blue-500/30",
          sizes[size].container
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        
        {/* Logo Text */}
        <span className={cn(sizes[size].text, "font-black text-white tracking-tight relative z-10 select-none")}>
          ASH
        </span>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      {/* Brand Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className={cn(sizes[size].text, "font-bold text-white tracking-tight")}>
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text">ASH</span>
            <span className="text-blue-400 ms-1">HOLDING</span>
          </h1>
        </motion.div>
      )}
    </motion.div>
  );
}
