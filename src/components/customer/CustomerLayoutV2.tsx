/**
 * Customer Dashboard Layout V2 - Mobile-First Premium
 * 100% RTL ENFORCEMENT at all levels
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

  // Apply RTL to document on mount - HARD ENFORCEMENT
  useEffect(() => {
    const dir = isRTL ? "rtl" : "ltr";
    const lang = isRTL ? "ar" : "en";
    
    // Apply to html element
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-direction", dir);
    
    // Apply to body element
    document.body.dir = dir;
    document.body.style.direction = dir;
    document.body.style.textAlign = isRTL ? "right" : "left";
    document.body.setAttribute("data-lang", lang);
    
    // Add class for CSS targeting
    if (isRTL) {
      document.documentElement.classList.add("rtl");
      document.documentElement.classList.remove("ltr");
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.documentElement.classList.add("ltr");
      document.documentElement.classList.remove("rtl");
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
    
    console.log(`[RTL] Layout direction: ${dir}`);
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

  // Calculate safe padding for bottom nav
  const bottomPadding = BOTTOM_NAV_HEIGHT + 24; // Nav height + extra buffer

  // =====================
  // MOBILE LAYOUT - App-like Experience
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
        {/* Mobile Header - Sticky */}
        <MobileHeader />

        {/* Main Content with proper padding */}
        <main 
          className="overflow-x-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            minHeight: `calc(100vh - 56px - ${bottomPadding}px)`,
            paddingBottom: `${bottomPadding}px`,
            paddingInlineStart: '16px',
            paddingInlineEnd: '16px',
            paddingTop: '16px',
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation - Fixed */}
        <MobileBottomNav />

        {/* Connection status indicators */}
        <div 
          className="fixed z-40 flex items-center gap-1.5"
          style={{
            bottom: `${BOTTOM_NAV_HEIGHT + 12}px`,
            [isRTL ? 'left' : 'right']: '16px',
          }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isServicesConnected ? "bg-success" : "bg-muted"
            )}
            title={isRTL ? "اتصال الخدمات" : "Services"}
          />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
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
          <main 
            className="flex-1 overflow-auto p-4 md:p-5 lg:p-6"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
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
          
          {/* Desktop connection indicators */}
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
