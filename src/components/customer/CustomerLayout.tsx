/**
 * Customer Dashboard Layout
 * HARD RTL BOUNDARY - True RTL at layout, grid, and component levels
 * CSS Grid respects dir attribute for sidebar placement
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import { CacheBuster } from "@/components/CacheBuster";
import { CustomerGuard } from "@/components/auth/RouteGuard";

interface CustomerLayoutProps {
  children: ReactNode;
}

function CustomerLayoutContent({ children }: CustomerLayoutProps) {
  const { user, profile } = useAuth();
  const { isRTL } = useLanguage();

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  return (
    <SidebarProvider defaultOpen={true}>
      {/* 
        HARD RTL BOUNDARY - STRICT MODE
        - dir attribute at root level
        - CSS isolation prevents LTR leakage
        - Grid respects dir for column order
        - All children inherit RTL direction
      */}
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "rtl-root min-h-screen w-full bg-background overflow-x-hidden",
          "grid",
          isRTL ? "text-right" : "text-left"
        )}
        style={{
          gridTemplateColumns: "auto 1fr",
          gridTemplateAreas: '"sidebar content"',
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left'
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
          
          {/* Real-time connection indicators + Cache Buster */}
          <div className={cn(
            "fixed bottom-4 flex items-center gap-3 z-50",
            isRTL ? "start-4" : "end-4"
          )}>
            {/* Cache Buster Button */}
            <CacheBuster />
            
            {/* Connection indicators */}
            <div className="flex gap-2">
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
          </div>
        </SidebarInset>
      </section>
    </SidebarProvider>
  );
}

// Wrap with CustomerGuard for auth protection
export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <CustomerGuard>
      <CustomerLayoutContent>{children}</CustomerLayoutContent>
    </CustomerGuard>
  );
}