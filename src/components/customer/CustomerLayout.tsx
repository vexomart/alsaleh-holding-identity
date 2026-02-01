/**
 * Customer Dashboard Layout
 * HARD RTL BOUNDARY - True RTL at layout, grid, and component levels
 * CSS Grid respects dir attribute for sidebar placement
 */

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  // Sync document direction for /app routes only
  useEffect(() => {
    const dir = isRTL ? 'rtl' : 'ltr';
    const lang = isRTL ? 'ar' : 'en';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.dir = dir;
    
    return () => {
      // Reset on unmount if navigating away from /app
      if (!window.location.pathname.startsWith('/app')) {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
        document.body.dir = 'ltr';
      }
    };
  }, [isRTL]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={isRTL ? 'ar' : 'en'}
        className="rtl-root min-h-screen flex items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </section>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {/* 
        HARD RTL BOUNDARY
        - dir attribute at root level
        - CSS isolation prevents LTR leakage
        - Grid respects dir for column order
      */}
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={isRTL ? 'ar' : 'en'}
        className={cn(
          "rtl-root min-h-screen w-full bg-background overflow-x-hidden",
          "grid"
        )}
        style={{
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
          <main className="flex-1 overflow-auto p-4 md:p-5 lg:p-6 pb-safe">
            {children}
          </main>
          
          {/* Real-time connection indicators (debug) */}
          <div className={cn(
            "fixed bottom-4 flex gap-2 z-50",
            isRTL ? "start-4" : "end-4"
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
      </section>
    </SidebarProvider>
  );
}