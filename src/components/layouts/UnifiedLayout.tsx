/**
 * UnifiedLayout - Single Layout for Entire Application
 * Header (sticky) + Main Content + Footer (sticky bottom)
 * iOS-like smooth behavior with no horizontal overflow
 * Footer always at bottom even with short content
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
      className="min-h-screen min-h-dvh flex flex-col bg-background"
      style={{ 
        direction: 'rtl',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Sticky Header - Always visible */}
      <NavigationDark />
      
      {/* Main Content Area - Grows to fill available space */}
      <main 
        className={cn(
          "flex-1 flex-grow w-full",
          contentClassName
        )}
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          flex: '1 0 auto',
        }}
      >
        {children}
      </main>
      
      {/* Footer - Always at bottom, never floats */}
      {!hideFooter && (
        <div className="flex-shrink-0 mt-auto w-full">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default UnifiedLayout;
