import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import BackButton from "@/components/ui/back-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonFallback?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  className,
  showBackButton = true,
  backButtonFallback = "/"
}: PageHeaderProps) {
  return (
    <div className={cn(
      "relative py-16 px-6 text-center animate-fade-in",
      "bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900",
      "border-b border-white/20 dark:border-slate-700/50",
      className
    )}>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
      
      {/* Back Button */}
      {showBackButton && (
        <div className="absolute top-6 right-6 z-10">
          <BackButton fallbackPath={backButtonFallback} />
        </div>
      )}
      
      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4 animate-scale-in">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in delay-200">
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