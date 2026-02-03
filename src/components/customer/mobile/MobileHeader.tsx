/**
 * Mobile Header - Premium App-like Header
 * 100% RTL compliant, micro-animations, app-like feel
 */

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/notifications";
import { MobileDrawer } from "./MobileDrawer";
import {
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react";

// Page title mappings
const pageTitles: Record<string, { ar: string; en: string }> = {
  "/app": { ar: "الرئيسية", en: "Home" },
  "/app/orders": { ar: "طلباتي", en: "My Orders" },
  "/app/services": { ar: "الخدمات", en: "Services" },
  "/app/wallet": { ar: "المحفظة", en: "Wallet" },
  "/app/profile": { ar: "الملف الشخصي", en: "Profile" },
  "/app/contracts": { ar: "عقودي", en: "Contracts" },
  "/app/invoices": { ar: "فواتيري", en: "Invoices" },
  "/app/notifications": { ar: "الإشعارات", en: "Notifications" },
  "/app/referrals": { ar: "الإحالات", en: "Referrals" },
  "/app/finance": { ar: "التمويل", en: "Finance" },
  "/app/transactions": { ar: "المعاملات", en: "Transactions" },
  "/app/client-hub": { ar: "مركز العميل", en: "Client Hub" },
};

export function MobileHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();
  const { user, profile } = useAuth();

  // Get page title - check exact match first, then prefix match
  const currentPath = location.pathname;
  let pageInfo = pageTitles[currentPath];
  
  // If no exact match, try to find prefix match
  if (!pageInfo) {
    const matchingPath = Object.keys(pageTitles)
      .filter(p => p !== "/app" && currentPath.startsWith(p))
      .sort((a, b) => b.length - a.length)[0];
    if (matchingPath) {
      pageInfo = pageTitles[matchingPath];
    }
  }
  
  const displayTitle = pageInfo ? (isRTL ? pageInfo.ar : pageInfo.en) : "";

  // Determine if we should show back button
  const canGoBack = currentPath !== "/app";

  // RTL-aware back icon
  const BackIcon = isRTL ? ChevronRight : ChevronLeft;

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/app");
    }
  };

  const userInitial = (profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U";

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "sticky top-0 z-40",
        "bg-background/80 backdrop-blur-xl",
        "border-b border-border/50",
        "h-14",
        "md:hidden"
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div 
        className="h-full flex items-center gap-1 px-2"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* Start: Back/Menu Button */}
        <div className="flex items-center shrink-0">
          {canGoBack ? (
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-10 w-10 rounded-full hover:bg-muted/80"
              >
                <BackIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <MobileDrawer
              trigger={
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-muted/80"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              }
            />
          )}
        </div>

        {/* Center: Title with RTL-aware alignment */}
        <div 
          className="flex-1 min-w-0 px-2"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <motion.h1
            key={displayTitle}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-lg font-bold text-foreground truncate",
              isRTL ? "text-right" : "text-left"
            )}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {displayTitle}
          </motion.h1>
        </div>

        {/* End: Actions - RTL aware ordering */}
        <div 
          className="flex items-center gap-1 shrink-0"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {/* Notifications */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <NotificationBell
              userId={user?.id}
              roleTarget="customer"
              isRTL={isRTL}
              notificationsPageUrl="/app/notifications"
              maxItems={5}
            />
          </motion.div>

          {/* User Avatar */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/app/profile")}
              className="h-10 w-10 rounded-full p-0 hover:bg-muted/80"
            >
              <Avatar className="h-8 w-8 border-2 border-primary/20 ring-2 ring-primary/10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
