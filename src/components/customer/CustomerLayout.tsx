/**
 * Customer Dashboard Layout
 * RTL-first with Arabic default
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
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // Real-time subscriptions for services and invoices
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <div className={cn("min-h-screen flex w-full", isRTL && "flex-row-reverse")}>
        <CustomerSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <CustomerHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          
          {/* Real-time connection indicators (debug) */}
          <div className="fixed bottom-4 left-4 flex gap-2 z-50">
            <div 
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isServicesConnected ? "bg-emerald-500" : "bg-muted"
              )}
              title={isRTL ? "اتصال الخدمات" : "Services connection"}
            />
            <div 
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isInvoicesConnected ? "bg-emerald-500" : "bg-muted"
              )}
              title={isRTL ? "اتصال الفواتير" : "Invoices connection"}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
