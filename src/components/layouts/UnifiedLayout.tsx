/**
 * UnifiedLayout - Single Layout for Entire Application
 * Header (sticky) + Main Content + Footer
 * Used for ALL pages without exception
 */

import { ReactNode } from "react";
import { NavigationDark } from "@/components/homepage/NavigationDark";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

interface UnifiedLayoutProps {
  children: ReactNode;
  /** Hide footer for specific pages like auth */
  hideFooter?: boolean;
  /** Additional classes for main content area */
  contentClassName?: string;
}

export function UnifiedLayout({ 
  children, 
  hideFooter = false,
  contentClassName 
}: UnifiedLayoutProps) {
  return (
    <div 
      dir="rtl"
      className="min-h-screen flex flex-col bg-background"
      style={{ direction: 'rtl' }}
    >
      {/* Sticky Header - Always visible */}
      <NavigationDark />
      
      {/* Main Content Area - Grows to fill available space */}
      <main 
        className={cn(
          "flex-1 w-full",
          contentClassName
        )}
      >
        {children}
      </main>
      
      {/* Footer - Always at bottom */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default UnifiedLayout;
