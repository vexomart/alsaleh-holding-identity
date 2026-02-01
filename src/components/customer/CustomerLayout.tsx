/**
 * Customer Dashboard Layout
 * HARD RTL BOUNDARY for /app routes ONLY
 * Uses CSS Grid for sidebar placement (no flex hacks)
 * Isolated from /admin - only sets document.dir when on /app/*
 */

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import { Loader2 } from "lucide-react";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  /**
   * CRITICAL: Set document direction ONLY when on /app/* routes
   * This creates an isolated RTL boundary that doesn't affect /admin
   */
  useEffect(() => {
    const isCustomerRoute = location.pathname.startsWith('/app');
    
    if (isCustomerRoute) {
      const dir = isRTL ? 'rtl' : 'ltr';
      const lang = isRTL ? 'ar' : 'en';
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      document.body.dir = dir;
    }
    
    // Cleanup: Reset to LTR when leaving /app routes
    return () => {
      const stillOnCustomerRoute = window.location.pathname.startsWith('/app');
      if (!stillOnCustomerRoute) {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
        document.body.dir = 'ltr';
      }
    };
  }, [isRTL, language, location.pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {/* 
        HARD RTL BOUNDARY - dir attribute at root level
        Uses CSS Grid for proper sidebar placement without flex hacks
      */}
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "min-h-screen w-full bg-background",
          // CSS Grid layout: sidebar + content
          // Grid automatically respects dir attribute for column order
          "grid",
          isRTL ? "text-right" : "text-left"
        )}
        style={{
          // CSS Grid with logical placement respects dir attribute
          gridTemplateColumns: "auto 1fr",
          gridTemplateAreas: '"sidebar content"'
        }}
      >
        {/* Sidebar - Grid placement respects RTL automatically */}
        <div style={{ gridArea: 'sidebar' }}>
          <CustomerSidebar />
        </div>
        
        {/* Main Content Area */}
        <SidebarInset 
          className="flex flex-col min-w-0"
          style={{ gridArea: 'content' }}
        >
          <CustomerHeader />
          <main 
            className="flex-1 overflow-auto p-3 md:p-4 lg:p-6"
          >
            {children}
          </main>
          
          {/* Real-time connection indicators (debug) */}
          <div className={cn(
            "fixed bottom-4 flex gap-2 z-50",
            isRTL ? "left-4" : "left-4"
          )}>
            <div 
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isServicesConnected ? "bg-primary" : "bg-muted"
              )}
              title={isRTL ? "اتصال الخدمات" : "Services connection"}
            />
            <div 
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isInvoicesConnected ? "bg-primary" : "bg-muted"
              )}
              title={isRTL ? "اتصال الفواتير" : "Invoices connection"}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}