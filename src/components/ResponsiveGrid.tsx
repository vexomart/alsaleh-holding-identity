import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: '1-2' | '1-2-3' | '1-2-4' | '1-2-5' | '2-4';
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = '1-2-3',
  gap = 'md' 
}: ResponsiveGridProps) {
  const colClasses = {
    '1-2': 'grid-responsive-1-2',
    '1-2-3': 'grid-responsive-1-2-3', 
    '1-2-4': 'grid-responsive-1-2-4',
    '1-2-5': 'grid-responsive-1-2-5',
    '2-4': 'grid-responsive-2-4'
  };

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  return (
    <div 
      className={cn(
        "grid",
        colClasses[cols],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}