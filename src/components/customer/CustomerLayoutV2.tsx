/**
 * Customer Dashboard Layout V2 - Mobile-First
 * App-like experience with Bottom Navigation on mobile
 * Sidebar on desktop, Bottom Nav on mobile
 */

import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import { MobileBottomNav, MobileHeader, MobileDrawer } from "./mobile";
import { Loader2, Menu } from "lucide-react";
import { CacheBuster } from "@/components/CacheBuster";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Real-time subscriptions
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
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="rtl-root min-h-screen flex items-center justify-center bg-background"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
          </div>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </p>
        </motion.div>
      </section>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "rtl-root min-h-screen w-full bg-background",
          "flex flex-col",
          "overflow-x-hidden"
        )}
      >
        {/* Mobile Header */}
        <MobileHeader 
          onMenuClick={() => setDrawerOpen(true)}
        />

        {/* Mobile Drawer */}
        <MobileDrawer 
          trigger={
            <button 
              className="hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          }
        />

        {/* Main Content - with safe area padding */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            "px-4 py-4",
            "pb-24" // Space for bottom nav
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav />

        {/* Connection indicators - small dots */}
        <div className={cn(
          "fixed bottom-20 flex items-center gap-1.5 z-40",
          isRTL ? "start-4" : "end-4"
        )}>
          <div 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isServicesConnected ? "bg-success" : "bg-muted"
            )}
            title={isRTL ? "اتصال الخدمات" : "Services connection"}
          />
          <div 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isInvoicesConnected ? "bg-success" : "bg-muted"
            )}
            title={isRTL ? "اتصال الفواتير" : "Invoices connection"}
          />
        </div>
      </section>
    );
  }

  // Desktop Layout (Original with Sidebar)
  return (
    <SidebarProvider defaultOpen={true}>
      <section 
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          "rtl-root min-h-screen w-full bg-background overflow-x-hidden",
          "grid"
        )}
        style={{
          gridTemplateColumns: "auto 1fr",
          gridTemplateAreas: '"sidebar content"'
        }}
      >
        {/* Sidebar - Desktop only */}
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
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Real-time connection indicators + Cache Buster */}
          <div className={cn(
            "fixed bottom-4 flex items-center gap-3 z-50",
            isRTL ? "start-4" : "end-4"
          )}>
            <CacheBuster />
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

export default CustomerLayout;
