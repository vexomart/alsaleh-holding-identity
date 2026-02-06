/**
 * Auth Input Component - Premium Floating Label Input
 * World-Class SaaS Design - Mobile Optimized
 */
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  hint?: string;
  success?: boolean;
  endAdornment?: React.ReactNode;
}

export function AuthInput({
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
}: AuthInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputId = id || `input-${label.replace(/\s/g, '-')}`;
  const hasValue = value !== undefined && value !== '';
  const isFloating = isFocused || hasValue;

  return (
    <div className="space-y-1.5">
      <div className="relative group">
        {/* Background glow on focus */}
        <motion.div
          className="absolute -inset-[1px] rounded-xl sm:rounded-2xl opacity-0 pointer-events-none"
          style={{
            background: error 
              ? 'linear-gradient(135deg, hsla(0, 80%, 50%, 0.3), transparent)'
              : success 
                ? 'linear-gradient(135deg, hsla(160, 80%, 45%, 0.3), transparent)'
                : 'linear-gradient(135deg, hsla(220, 100%, 60%, 0.3), hsla(265, 100%, 60%, 0.2))',
          }}
          animate={{ opacity: isFocused ? 0.5 : 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Input container - Responsive height */}
        <div className={cn(
          "relative h-[52px] sm:h-[56px] rounded-xl sm:rounded-2xl transition-all duration-300",
          "bg-white/[0.04] border",
          error 
            ? "border-red-500/40" 
            : success 
              ? "border-emerald-500/40"
              : isFocused 
                ? "border-blue-500/50 bg-white/[0.06]" 
                : "border-white/[0.1] hover:border-white/15 hover:bg-white/[0.05]"
        )}>
          {/* Icon - Responsive size */}
          <motion.div 
            className={cn(
              "absolute start-3 sm:start-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl",
              "flex items-center justify-center transition-colors duration-200",
              error 
                ? "bg-red-500/10 text-red-400"
                : success 
                  ? "bg-emerald-500/10 text-emerald-400"
                  : isFocused 
                    ? "bg-blue-500/15 text-blue-400" 
                    : "bg-white/[0.06] text-white/40"
            )}
            animate={{ 
              scale: isFocused ? 1.03 : 1,
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
              "absolute start-12 sm:start-14 pointer-events-none font-medium transition-colors duration-200",
              isFloating
                ? "text-[10px] sm:text-xs text-white/50"
                : "text-xs sm:text-sm text-white/40"
            )}
            animate={{
              y: isFloating ? -6 : 0,
              top: isFloating ? '28%' : '50%',
            }}
            initial={false}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transform: 'translateY(-50%)' }}
          >
            {label}
          </motion.label>
          
          {/* Input field */}
          <input
            id={inputId}
            value={value}
            className={cn(
              "absolute inset-0 w-full h-full bg-transparent",
              "text-white text-sm sm:text-base font-medium",
              "ps-12 sm:ps-14 pe-11 sm:pe-12 pt-4 sm:pt-5 pb-1.5 sm:pb-2",
              "placeholder:text-transparent focus:placeholder:text-white/25",
              "outline-none border-none",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {/* End adornment / Status icon */}
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
        </div>
      </div>
      
      {/* Error / Hint message */}
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
