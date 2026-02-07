/**
 * Admin Dashboard Layout - Simplified
 * Uses UnifiedLayout for Header/Footer
 * Only provides dashboard navigation and content area
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DashboardNav } from "@/components/layouts/DashboardNav";
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
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "min-h-full w-full bg-background",
        isRTL ? "text-right" : "text-left"
      )}
    >
      {/* Dashboard Navigation Bar */}
      <DashboardNav variant="admin" />
      
      {/* Main Content Area */}
      <main className={cn(
        "container mx-auto",
        isMobile ? "px-3 py-4" : "px-4 py-6 lg:py-8"
      )}>
        {children}
      </main>
      
      {/* Real-time connection indicators (debug) - Desktop only */}
      {!isMobile && (
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
              isDeliveryConnected ? "bg-primary" : "bg-muted"
            )}
            title={isRTL ? "تأكيدات التسليم" : "Delivery confirmations"}
          />
        </div>
      )}
    </div>
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
