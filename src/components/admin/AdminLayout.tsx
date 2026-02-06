/**
 * Admin Dashboard Layout
 * HARD RTL BOUNDARY - dir attribute enforced at root
 * Uses CSS Grid for proper sidebar placement
 */

import * as React from "react";
const { useEffect } = React;
type ReactNode = React.ReactNode;
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { canAccessAdmin, isLoading: rbacLoading } = useRBAC();
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = authLoading || rbacLoading;

  // Real-time subscriptions for services and delivery confirmations
  const { isServicesConnected, isDeliveryConnected } = useAdminRealtime({
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user && canAccessAdmin,
    showDeliveryToasts: true,
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(ROUTES.AUTH.LOGIN, { replace: true });
      } else if (!canAccessAdmin) {
        // If user doesn't have admin access, redirect to customer app
        navigate(ROUTES.APP.ROOT, { replace: true });
      }
    }
  }, [user, canAccessAdmin, isLoading, navigate]);

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

  // Not authorized
  if (!user || !canAccessAdmin) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {/* 
        HARD RTL BOUNDARY - dir attribute at root level
        CSS Grid respects dir attribute for column order automatically
      */}
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "min-h-screen w-full bg-background",
          "grid",
          isRTL ? "text-right" : "text-left"
        )}
        style={{
          gridTemplateColumns: "auto 1fr",
          gridTemplateAreas: '"sidebar content"'
        }}
      >
        {/* Sidebar - Grid placement respects RTL automatically */}
        <div style={{ gridArea: 'sidebar' }}>
          <AdminSidebar />
        </div>
        
        {/* Main Content Area */}
        <SidebarInset 
          className="flex flex-col min-w-0"
          style={{ gridArea: 'content' }}
        >
          <AdminHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          
          {/* Real-time connection indicators (debug) */}
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
