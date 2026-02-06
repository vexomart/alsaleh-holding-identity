/**
 * Cyber Button Component - Enterprise Security Design
 * Gradient buttons with neon glow and cyber animations
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CyberButtonProps {
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

export function CyberButton({
  children,
  isLoading,
  variant = 'primary',
  icon,
  size = 'default',
  className,
  disabled,
  type = 'button',
  onClick,
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const variants: Record<string, string> = {
    primary: cn(
      "bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600",
      "hover:from-cyan-500 hover:via-cyan-400 hover:to-blue-500",
      "text-white font-bold",
      "border-0"
    ),
    secondary: cn(
      "bg-white/[0.05] hover:bg-white/[0.08]",
      "text-white font-semibold",
      "border border-cyan-500/30 hover:border-cyan-500/50"
    ),
    ghost: cn(
      "bg-transparent hover:bg-white/[0.05]",
      "text-white/70 hover:text-cyan-400 font-medium",
      "border border-transparent hover:border-cyan-500/20"
    ),
    outline: cn(
      "bg-transparent hover:bg-cyan-500/10",
      "text-cyan-400 hover:text-cyan-300 font-medium",
      "border border-cyan-500/40 hover:border-cyan-500/60"
    ),
    success: cn(
      "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500",
      "hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400",
      "text-white font-bold",
      "border-0"
    ),
  };

  const sizes = {
    default: "h-12 sm:h-[52px] px-5 sm:px-6 text-sm sm:text-base rounded-xl sm:rounded-2xl",
    lg: "h-[52px] sm:h-14 px-6 sm:px-8 text-sm sm:text-lg rounded-xl sm:rounded-2xl",
  };

  return (
    <motion.button
      type={type}
      className={cn(
        "relative w-full overflow-hidden",
        "transition-all duration-200",
        "flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Animated Glow Effect */}
      {(variant === 'primary' || variant === 'success') && (
        <motion.div
          className="absolute inset-0 rounded-xl sm:rounded-2xl"
          style={{
            boxShadow: variant === 'primary' 
              ? '0 0 30px hsla(190, 100%, 50%, 0.4), 0 0 60px hsla(190, 100%, 50%, 0.2)'
              : '0 0 30px hsla(160, 80%, 45%, 0.4), 0 0 60px hsla(160, 80%, 45%, 0.2)',
          }}
          animate={{ opacity: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Shine Sweep Effect */}
      {(variant === 'primary' || variant === 'success') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      
      {/* Cyber Corner Accents */}
      <div className="absolute top-0 start-0 w-3 h-3 border-t border-s border-white/20 rounded-tl" />
      <div className="absolute top-0 end-0 w-3 h-3 border-t border-e border-white/20 rounded-tr" />
      <div className="absolute bottom-0 start-0 w-3 h-3 border-b border-s border-white/20 rounded-bl" />
      <div className="absolute bottom-0 end-0 w-3 h-3 border-b border-e border-white/20 rounded-br" />
      
      {/* Button Content */}
      <motion.span 
        className="relative flex items-center justify-center gap-2 z-10"
        animate={{ 
          scale: isLoading ? 0.95 : 1,
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
                className="inline-flex [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5"
                animate={{ x: isHovered ? -3 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </motion.span>
    </motion.button>
  );
}
