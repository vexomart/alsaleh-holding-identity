import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn(
      "relative py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 text-center animate-fade-in",
      "bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50",
      "border-b border-white/20",
      "overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative max-w-5xl mx-auto responsive-container">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6 animate-scale-in leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 lg:mb-12 animate-fade-in delay-200 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {children && (
          <div className="animate-fade-in delay-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}