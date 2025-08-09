import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right';
}

export function ResponsiveText({ 
  children, 
  className, 
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'right'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'text-responsive-xs',
    sm: 'text-responsive-sm',
    base: 'text-responsive-base',
    lg: 'text-responsive-lg',
    xl: 'text-responsive-xl',
    '2xl': 'text-responsive-2xl',
    '3xl': 'text-responsive-3xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorClasses = {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center mobile-center',
    right: 'text-right'
  };

  return (
    <div 
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        alignClasses[align],
        "mobile-text",
        className
      )}
    >
      {children}
    </div>
  );
}