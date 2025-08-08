import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  showWhatsAppButton?: boolean;
}

export function PageContainer({ 
  children, 
  className,
  showNavigation = false,
  showFooter = false,
  showWhatsAppButton = true
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
      className
    )}>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
      <div className="relative z-10">
        {showNavigation && <Navigation />}
        <main className="relative">
          {children}
        </main>
        {showFooter && <Footer />}
        {showWhatsAppButton && <WhatsAppButton />}
      </div>
    </div>
  );
}