/**
 * UnifiedLayout - iOS-style Single Layout for Entire Application
 * Header (sticky) + Main Content + Footer (sticky bottom)
 * Buttery smooth behavior with zero horizontal overflow
 * Footer always at bottom even with short content
 * Auto-hides navigation for dashboard routes
 */

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
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

// Routes that should not show main navigation
const DASHBOARD_ROUTES = ['/adminash', '/portal'];

export function UnifiedLayout({ 
  children, 
  hideFooter = false,
  contentClassName 
}: UnifiedLayoutProps) {
  const location = useLocation();
  
  // Auto-detect if current route is a dashboard route
  const isDashboardRoute = DASHBOARD_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );
  
  // Hide navigation and footer for dashboard routes
  const showNavigation = !isDashboardRoute;
  const showFooter = !hideFooter && !isDashboardRoute;

  return (
    <div 
      dir="rtl"
      className={cn(
        "min-h-screen min-h-dvh flex flex-col bg-background",
        "w-full overflow-x-hidden"
      )}
    >
      {/* Sticky Header - Hidden for dashboard pages */}
      {showNavigation && <NavigationDark />}
      
      {/* Main Content Area - Grows to fill available space */}
      <main 
        className={cn(
          "flex-1 flex-grow w-full",
          "overflow-x-hidden",
          contentClassName
        )}
      >
        {children}
      </main>
      
      {/* Footer - Hidden for dashboard and auth pages */}
      {showFooter && (
        <div className="flex-shrink-0 mt-auto w-full overflow-x-hidden">
          <Footer />
        </div>
      )}
    </div>
  );
}

export default UnifiedLayout;
