import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  glass?: boolean;
}

export function ResponsiveCard({ 
  children, 
  className, 
  size = 'md', 
  hover = true, 
  glass = false 
}: ResponsiveCardProps) {
  const sizeClasses = {
    sm: 'card-responsive p-3 sm:p-4',
    md: 'card-responsive',
    lg: 'card-responsive p-6 sm:p-8 lg:p-10'
  };

  return (
    <div 
      className={cn(
        "bg-white border border-border rounded-lg shadow-sm transition-all duration-300",
        sizeClasses[size],
        hover && "hover:shadow-lg hover:scale-[1.02] mobile-tap",
        glass && "glass-effect",
        className
      )}
    >
      {children}
    </div>
  );
}