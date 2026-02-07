/**
 * PageLayout - Simple Content Wrapper
 * UnifiedLayout provides Header/Footer globally
 * This component only adds RTL direction to content
 */

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div 
      dir="rtl" 
      className={cn(
        "w-full text-start animate-fade-in",
        className
      )}
    >
      {children}
    </div>
  );
}
