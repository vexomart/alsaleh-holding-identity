/**
 * Admin Dashboard Layout
 * HARD RTL BOUNDARY - dir attribute enforced at root
 * Fully responsive for mobile, tablet, and desktop
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminGuard } from "@/components/auth/RouteGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, profile } = useAuth();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Real-time subscriptions for services and delivery confirmations
  const { isServicesConnected, isDeliveryConnected } = useAdminRealtime({
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
    showDeliveryToasts: true,
  });

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      {/* 
        HARD RTL BOUNDARY - dir attribute at root level
        Flexbox layout for proper responsive behavior
      */}
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "min-h-screen w-full bg-background flex",
          isRTL ? "text-right" : "text-left"
        )}
      >
        {/* Sidebar - Hidden on mobile (shown via Sheet) */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="flex flex-col min-w-0 flex-1">
          <AdminHeader />
          <main className={cn(
            "flex-1 overflow-auto",
            isMobile ? "p-3 pb-safe" : "p-4 md:p-6"
          )}>
            {children}
          </main>
          
          {/* Real-time connection indicators (debug) - Desktop only */}
          {!isMobile && (
            <div className={cn(
              "fixed bottom-4 flex gap-2 z-50",
              isRTL ? "left-4" : "right-4"
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
                  isDeliveryConnected ? "bg-primary" : "bg-muted"
                )}
                title={isRTL ? "تأكيدات التسليم" : "Delivery confirmations"}
              />
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Wrap with AdminGuard for auth + role protection
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminGuard>
  );
}