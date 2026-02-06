/**
 * Auth Button Component - Premium Gradient CTA
 * World-Class SaaS Design - Mobile Optimized
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'outline';
  icon?: React.ReactNode;
  size?: 'default' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function AuthButton({
  children,
  isLoading,
  variant = 'primary',
  icon,
  size = 'default',
  className,
  disabled,
  type = 'button',
  onClick,
}: AuthButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const variants: Record<string, string> = {
    primary: cn(
      "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600",
      "hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500",
      "text-white font-bold",
      "shadow-lg sm:shadow-xl shadow-blue-500/25",
      "border-0"
    ),
    secondary: cn(
      "bg-white/[0.06] hover:bg-white/[0.1]",
      "text-white font-semibold",
      "border border-white/[0.12] hover:border-white/[0.2]",
      "shadow-md sm:shadow-lg shadow-black/10"
    ),
    ghost: cn(
      "bg-transparent hover:bg-white/[0.05]",
      "text-white/70 hover:text-white font-medium",
      "border border-transparent hover:border-white/[0.1]"
    ),
    outline: cn(
      "bg-transparent hover:bg-white/[0.05]",
      "text-white/80 hover:text-white font-medium",
      "border border-white/[0.15] hover:border-white/[0.25]"
    ),
    success: cn(
      "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500",
      "hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400",
      "text-white font-bold",
      "shadow-lg sm:shadow-xl shadow-emerald-500/25",
      "border-0"
    ),
  };

  const sizes = {
    default: "h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-xl sm:rounded-2xl",
    lg: "h-12 sm:h-14 px-5 sm:px-8 text-sm sm:text-lg rounded-xl sm:rounded-2xl",
  };

  const handleClick = () => {
    if (!disabled && !isLoading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type={type}
      className={cn(
        "relative w-full overflow-hidden",
        "transition-all duration-200",
        "flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        sizes[size],
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Shine effect */}
      {(variant === 'primary' || variant === 'success') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
      
      {/* Glow pulse on hover */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0"
          style={{
            boxShadow: '0 0 30px 0 hsla(220, 100%, 60%, 0.35)',
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Button content */}
      <motion.span 
        className="relative flex items-center justify-center gap-2"
        animate={{ 
          scale: isPressed ? 0.98 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span className="text-sm sm:text-base">جارِ التحميل...</span>
          </>
        ) : (
          <>
            {children}
            {icon && (
              <motion.span 
                className="inline-flex [&>svg]:w-3.5 [&>svg]:h-3.5 sm:[&>svg]:w-4 sm:[&>svg]:h-4"
                whileHover={{ x: -2 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </motion.span>
      
      {/* Active state ring */}
      <motion.div
        className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.1)',
        }}
        animate={{ opacity: isPressed ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  );
}
