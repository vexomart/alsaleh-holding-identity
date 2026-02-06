/**
 * Auth Logo Component - Enterprise Branding
 */
import * as React from 'react';
import { motion } from 'framer-motion';

interface AuthLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AuthLogo({ size = 'md' }: AuthLogoProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-2xl', glow: '-inset-1' },
    md: { container: 'w-24 h-24', text: 'text-4xl', glow: '-inset-2' },
    lg: { container: 'w-32 h-32', text: 'text-5xl', glow: '-inset-3' },
  };
  
  const s = sizes[size];

  return (
    <motion.div 
      className="relative inline-block"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <motion.div 
        className={`${s.container} rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary-glow flex items-center justify-center shadow-2xl relative overflow-hidden`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        
        {/* Logo text */}
        <span className={`${s.text} font-black text-white tracking-tight relative z-10 select-none`}>
          ASH
        </span>
      </motion.div>
      
      {/* Glow effect */}
      <div className={`absolute ${s.glow} rounded-2xl bg-gradient-to-br from-primary/50 to-primary-glow/30 blur-xl opacity-50 -z-10`} />
    </motion.div>
  );
}
