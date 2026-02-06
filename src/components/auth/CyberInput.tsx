/**
 * Cyber Input Component - Enterprise Security Design
 * Animated floating labels with cyber glow effects
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  hint?: string;
  success?: boolean;
  endAdornment?: React.ReactNode;
}

export function CyberInput({
  label,
  icon,
  error,
  hint,
  success,
  endAdornment,
  className,
  id,
  value,
  ...props
}: CyberInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputId = id || `cyber-input-${label.replace(/\s/g, '-')}`;
  const hasValue = value !== undefined && value !== '';
  const isFloating = isFocused || hasValue;

  return (
    <div className="space-y-1.5">
      <div className="relative group">
        {/* Focus Glow Effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
          style={{
            background: error 
              ? 'linear-gradient(135deg, hsla(0, 80%, 50%, 0.4), hsla(0, 80%, 50%, 0.1))'
              : success 
                ? 'linear-gradient(135deg, hsla(160, 80%, 45%, 0.4), hsla(160, 80%, 45%, 0.1))'
                : 'linear-gradient(135deg, hsla(190, 100%, 50%, 0.4), hsla(260, 100%, 50%, 0.2))',
          }}
          animate={{ opacity: isFocused ? 0.6 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Input Container */}
        <div className={cn(
          "relative h-14 sm:h-[60px] rounded-xl sm:rounded-2xl transition-all duration-300",
          "bg-slate-900/60 border",
          error 
            ? "border-red-500/50" 
            : success 
              ? "border-emerald-500/50"
              : isFocused 
                ? "border-cyan-500/60 bg-slate-900/80" 
                : "border-white/10 hover:border-cyan-500/30 hover:bg-slate-900/70"
        )}>
          {/* Icon Container - Right side (start in RTL) */}
          <motion.div 
            className={cn(
              "absolute start-3 sm:start-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl",
              "flex items-center justify-center transition-all duration-200",
              error 
                ? "bg-red-500/15 text-red-400"
                : success 
                  ? "bg-emerald-500/15 text-emerald-400"
                  : isFocused 
                    ? "bg-cyan-500/15 text-cyan-400" 
                    : "bg-white/[0.05] text-white/40 group-hover:text-cyan-400/60"
            )}
            animate={{ 
              scale: isFocused ? 1.05 : 1,
              boxShadow: isFocused && !error && !success 
                ? '0 0 15px hsla(190, 100%, 50%, 0.3)' 
                : '0 0 0 transparent',
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
              {icon}
            </span>
          </motion.div>
          
          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            className={cn(
              "absolute start-14 sm:start-16 pointer-events-none font-medium transition-colors duration-200",
              isFloating
                ? "text-[10px] sm:text-xs text-cyan-400/70"
                : "text-xs sm:text-sm text-white/40"
            )}
            animate={{
              y: isFloating ? -8 : 0,
              top: isFloating ? '28%' : '50%',
            }}
            initial={false}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transform: 'translateY(-50%)' }}
          >
            {label}
          </motion.label>
          
          {/* Input Field */}
          <input
            id={inputId}
            value={value}
            className={cn(
              "absolute inset-0 w-full h-full bg-transparent",
              "text-white text-sm sm:text-base font-medium",
              "ps-14 sm:ps-16 pe-4 sm:pe-5 pt-5 sm:pt-6 pb-2",
              "placeholder:text-transparent focus:placeholder:text-white/20",
              "outline-none border-none",
              "caret-cyan-400",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* Status Indicator */}
          <div className="absolute end-3 sm:end-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {success && !error && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            )}
            {endAdornment}
          </div>
          
          {/* Cyber Corner Accents */}
          {isFocused && (
            <>
              <motion.div 
                className="absolute top-0 start-0 w-4 h-4 border-t border-s border-cyan-500/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.div 
                className="absolute bottom-0 end-0 w-4 h-4 border-b border-e border-cyan-500/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Error / Hint Message */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="overflow-hidden"
          >
            <p className="flex items-center gap-1.5 text-[11px] sm:text-xs text-red-400 ps-1">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              {error}
            </p>
          </motion.div>
        ) : hint ? (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-[11px] sm:text-xs text-white/30 ps-1">{hint}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
