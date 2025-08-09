import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
}

export function ResponsiveContainer({ 
  children, 
  className, 
  size = 'lg',
  padding = true 
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div 
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        padding && "container-fluid",
        className
      )}
    >
      {children}
    </div>
  );
}