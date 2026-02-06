/**
 * Auth Button Component - Premium CTA Button
 */
import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export function AuthButton({
  children,
  isLoading,
  variant = 'primary',
  icon,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const variants = {
    primary: cn(
      "bg-gradient-to-r from-primary via-primary to-primary/90",
      "hover:opacity-95 active:opacity-90",
      "text-primary-foreground font-bold",
      "shadow-xl shadow-primary/25",
      "border-0"
    ),
    secondary: cn(
      "bg-white/[0.06] hover:bg-white/10",
      "text-white font-semibold",
      "border border-white/10 hover:border-white/20"
    ),
    outline: cn(
      "bg-transparent hover:bg-white/[0.04]",
      "text-white/80 hover:text-white font-medium",
      "border border-white/10 hover:border-white/20"
    ),
  };

  return (
    <Button
      className={cn(
        "h-13 w-full rounded-xl text-base transition-all duration-200 relative overflow-hidden group",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine effect on hover */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      )}
      
      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {children}
            {icon && (
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {icon}
              </span>
            )}
          </>
        )}
      </span>
    </Button>
  );
}
