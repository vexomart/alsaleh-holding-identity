import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";


interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  
}

export function PageContainer({ 
  children, 
  className,
  showNavigation = false,
  showFooter = false,
  
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 dark:from-background dark:via-primary/5 dark:to-accent/5",
      className
    )}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>
      <div className="relative z-10">
        {showNavigation && <Navigation />}
        <main className="relative">
          {children}
        </main>
        {showFooter && <Footer />}
        
      </div>
    </div>
  );
}