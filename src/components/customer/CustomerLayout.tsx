/**
 * Customer Dashboard Layout - Dark Sidebar Edition
 * Full dark theme with right-side sidebar navigation
 * Similar to Admin Command Center design
 * 
 * OPTIMIZED: Uses centralized RouteGuard for auth checks
 */

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { cn } from "@/lib/utils";
import { CustomerSidebar } from "./CustomerSidebar";
import { CacheBuster } from "@/components/CacheBuster";
import { CustomerGuard } from "@/components/auth/RouteGuard";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import '@/styles/v3/tokens.css';

interface CustomerLayoutProps {
  children: ReactNode;
}

function CustomerLayoutContent({ children }: CustomerLayoutProps) {
  const { user, profile } = useAuth();
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-svh w-full flex cmd-center customer-portal"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Sidebar */}
        <CustomerSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="bg-[hsl(220_25%_6%)] flex-1">
          {/* Mobile Header with Menu Toggle */}
          {isMobile && (
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/10 bg-[hsl(220_22%_9%)] px-4">
              <SidebarTrigger className="text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <span className="font-semibold text-white">
                {isRTL ? 'بوابة العميل' : 'Customer Portal'}
              </span>
            </header>
          )}
          
          {/* Content */}
          <main className={cn(
            "container mx-auto px-4 py-6 lg:py-8",
            "text-white"
          )}>
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
                  isServicesConnected ? "bg-[hsl(145_72%_45%)]" : "bg-[hsl(220_15%_30%)]"
                )}
                title={isRTL ? "اتصال الخدمات" : "Services connection"}
              />
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isInvoicesConnected ? "bg-[hsl(145_72%_45%)]" : "bg-[hsl(220_15%_30%)]"
                )}
                title={isRTL ? "اتصال الفواتير" : "Invoices connection"}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
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
