/**
 * HeaderLogo - Premium Corporate Logo Component
 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck } from 'lucide-react';

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
      {/* Logo Icon */}
      <div className="relative">
        <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-primary via-primary-variant to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <span className="text-white font-bold text-sm lg:text-base tracking-tight">ASH</span>
        </div>
        {/* Online Indicator */}
        <div className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-white animate-pulse" />
      </div>
      
      {/* Company Name */}
      {variant !== 'mobile' && (
        <div className="hidden sm:block">
          <h1 className="text-base lg:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            ASH HOLDING
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 text-secondary fill-current" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">منذ 2016</span>
            <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded-full border border-success/20">
              <ShieldCheck className="w-2.5 h-2.5 text-success" />
              <span className="text-xs text-success font-medium">موثق</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Name */}
      {variant === 'mobile' && (
        <div>
          <span className="block text-sm font-bold text-foreground">ASH HOLDING</span>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2 h-2 text-secondary fill-current" />
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}
