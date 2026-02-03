/**
 * Customer Dashboard Layout V2 - Mobile-First
 * HARD RTL ENFORCEMENT at all levels
 * App-like experience with Bottom Navigation on mobile
 */

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useCustomerRealtime } from "@/hooks/useCustomerRealtime";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import { MobileBottomNav, BOTTOM_NAV_HEIGHT } from "./mobile/MobileBottomNav";
import { MobileHeader } from "./mobile/MobileHeader";
import { Loader2 } from "lucide-react";
import { CacheBuster } from "@/components/CacheBuster";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, profile, isLoading } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Real-time subscriptions
  const { isServicesConnected, isInvoicesConnected } = useCustomerRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user,
  });

  // Apply RTL to document on mount
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";
    document.body.style.direction = isRTL ? "rtl" : "ltr";
    document.body.style.textAlign = isRTL ? "right" : "left";
  }, [isRTL]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen flex items-center justify-center bg-background"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
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
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // =====================
  // MOBILE LAYOUT
  // =====================
  if (isMobile) {
    return (
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen w-full bg-background overflow-x-hidden"
        style={{ 
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {/* Mobile Header */}
        <MobileHeader />

        {/* Main Content */}
        <main 
          className="overflow-x-hidden"
          style={{
            minHeight: `calc(100vh - 56px - ${BOTTOM_NAV_HEIGHT}px)`,
            paddingBottom: `${BOTTOM_NAV_HEIGHT + 16}px`, // Nav height + extra padding
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '16px',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav />

        {/* Connection indicators */}
        <div 
          className="fixed z-40 flex items-center gap-1.5"
          style={{
            bottom: `${BOTTOM_NAV_HEIGHT + 8}px`,
            [isRTL ? 'left' : 'right']: '16px',
          }}
        >
          <div 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isServicesConnected ? "bg-success" : "bg-muted"
            )}
            title={isRTL ? "اتصال الخدمات" : "Services"}
          />
          <div 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isInvoicesConnected ? "bg-success" : "bg-muted"
            )}
            title={isRTL ? "اتصال الفواتير" : "Invoices"}
          />
        </div>
      </div>
    );
  }

  // =====================
  // DESKTOP LAYOUT
  // =====================
  return (
    <SidebarProvider defaultOpen={true}>
      <div 
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen w-full bg-background overflow-x-hidden flex"
        style={{ 
          direction: isRTL ? 'rtl' : 'ltr',
          textAlign: isRTL ? 'right' : 'left',
        }}
      >
        {/* Sidebar */}
        <CustomerSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <CustomerHeader />
          <main className="flex-1 overflow-auto p-4 md:p-5 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Desktop indicators */}
          <div 
            className="fixed bottom-4 flex items-center gap-3 z-50"
            style={{ [isRTL ? 'left' : 'right']: '16px' }}
          >
            <CacheBuster />
            <div className="flex gap-2">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isServicesConnected ? "bg-primary" : "bg-muted"
                )}
              />
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  isInvoicesConnected ? "bg-primary" : "bg-muted"
                )}
              />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default CustomerLayout;
