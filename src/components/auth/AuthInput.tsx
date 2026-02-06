/**
 * Auth Input Component - Premium Form Input
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  hint?: string;
  endAdornment?: React.ReactNode;
}

export function AuthInput({
  label,
  icon,
  error,
  hint,
  endAdornment,
  className,
  id,
  ...props
}: AuthInputProps) {
  const inputId = id || `input-${label.replace(/\s/g, '-')}`;

  return (
    <div className="space-y-2.5">
      <Label 
        htmlFor={inputId}
        className="text-sm font-semibold text-white/90 flex items-center gap-2"
      >
        <span className="text-primary/80">{icon}</span>
        {label}
      </Label>
      
      <div className="relative group">
        <Input
          id={inputId}
          className={cn(
            "h-13 bg-white/[0.04] border-white/[0.08] text-white text-base",
            "placeholder:text-white/25 rounded-xl transition-all duration-200",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.06]",
            "hover:border-white/15 hover:bg-white/[0.05]",
            "ps-12",
            endAdornment && "pe-12",
            error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        
        {/* Icon container */}
        <div className="absolute start-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-focus-within:bg-primary/20">
          <span className="text-primary/70 group-focus-within:text-primary">{icon}</span>
        </div>
        
        {/* End adornment */}
        {endAdornment && (
          <div className="absolute end-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      
      {/* Error / Hint */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-400 flex items-center gap-1.5 ps-1"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/35 ps-1"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
