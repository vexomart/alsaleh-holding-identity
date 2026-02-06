/**
 * HeaderLogo - Premium Corporate Logo Component
 * Enterprise-grade branding with animations
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderLogoProps {
  variant?: 'default' | 'compact' | 'mobile';
}

export function HeaderLogo({ variant = 'default' }: HeaderLogoProps) {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-3 shrink-0 group"
      aria-label="الصفحة الرئيسية - ASH HOLDING"
    >
      {/* Premium Logo Icon */}
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Main Logo Box */}
        <div className="relative w-10 h-10 lg:w-11 lg:h-11">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-variant to-accent rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300" />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Logo Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-sm lg:text-base tracking-tight">ASH</span>
          </div>
        </div>
        
        {/* Online Indicator */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-success rounded-full border-2 border-card shadow-lg shadow-success/30"
        />
        
        {/* Glow Effect on Hover */}
        <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
      
      {/* Company Name - Desktop */}
      {variant !== 'mobile' && (
        <div className="hidden sm:block">
          <h1 className="text-base lg:text-lg font-black text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
            ASH{' '}
            <span className="bg-gradient-to-l from-primary via-accent to-secondary bg-clip-text text-transparent">
              HOLDING
            </span>
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Star Rating */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 text-secondary fill-secondary" />
              ))}
            </div>
            
            {/* Since Badge */}
            <span className="text-xs text-muted-foreground font-medium">منذ 2016</span>
            
            {/* Verified Badge - Large Screens */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 bg-gradient-to-l from-success/10 to-success/5 rounded-full border border-success/20"
            >
              <ShieldCheck className="w-3 h-3 text-success" />
              <span className="text-xs text-success font-semibold">موثق</span>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Company Name - Mobile Menu */}
      {variant === 'mobile' && (
        <div>
          <span className="block text-sm font-bold text-foreground">
            ASH <span className="text-primary">HOLDING</span>
          </span>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2 h-2 text-secondary fill-secondary" />
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}
