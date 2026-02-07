/**
 * Customer Dashboard Layout - Simplified
 * Uses UnifiedLayout for Header/Footer
 * Only provides dashboard navigation and content area
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { cn } from "@/lib/utils";
import { DashboardNav } from "@/components/layouts/DashboardNav";
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
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        "min-h-full w-full bg-background",
        isRTL ? "text-right" : "text-left"
      )}
    >
      {/* Dashboard Navigation Bar */}
      <DashboardNav variant="customer" />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
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
    </div>
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
