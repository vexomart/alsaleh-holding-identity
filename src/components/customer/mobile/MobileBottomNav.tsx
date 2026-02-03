/**
 * Mobile Bottom Navigation - Fixed App-like Navigation
 * 4 main items + More button
 * RTL 100% compliant, no overlap, safe areas
 */

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  MoreHorizontal,
  Bell,
  Package,
  FileSignature,
  Receipt,
  Landmark,
  Users,
  User,
  X,
} from "lucide-react";

// Bottom Nav height for content padding
export const BOTTOM_NAV_HEIGHT = 72;

interface NavItem {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

// More menu items (sections not in bottom nav)
const moreMenuItems: NavItem[] = [
  { id: "services", titleAr: "الخدمات", titleEn: "Services", icon: Package, href: "/app/services" },
  { id: "contracts", titleAr: "عقودي", titleEn: "Contracts", icon: FileSignature, href: "/app/contracts" },
  { id: "invoices", titleAr: "فواتيري", titleEn: "Invoices", icon: Receipt, href: "/app/invoices" },
  { id: "finance", titleAr: "التمويل", titleEn: "Finance", icon: Landmark, href: "/app/finance" },
  { id: "referrals", titleAr: "الإحالات", titleEn: "Referrals", icon: Users, href: "/app/referrals" },
  { id: "notifications", titleAr: "الإشعارات", titleEn: "Notifications", icon: Bell, href: "/app/notifications" },
  { id: "profile", titleAr: "حسابي", titleEn: "Profile", icon: User, href: "/app/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const [moreOpen, setMoreOpen] = useState(false);

  // Main 4 navigation items (most used)
  const mainNavItems: NavItem[] = [
    {
      id: "home",
      titleAr: "الرئيسية",
      titleEn: "Home",
      icon: LayoutDashboard,
      href: "/app",
    },
    {
      id: "orders",
      titleAr: "طلباتي",
      titleEn: "Orders",
      icon: ShoppingCart,
      href: "/app/orders",
    },
    {
      id: "wallet",
      titleAr: "المحفظة",
      titleEn: "Wallet",
      icon: Wallet,
      href: "/app/wallet",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  // Check if any more menu item is active
  const isMoreActive = moreMenuItems.some(item => isActive(item.href));

  const handleNavigation = (href: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(href);
    setMoreOpen(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            
            {/* More Menu Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "fixed bottom-0 inset-x-0 z-[70]",
                "bg-background rounded-t-3xl",
                "max-h-[70vh] overflow-hidden",
                "shadow-2xl"
              )}
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b">
                <h3 className="text-lg font-bold">
                  {isRTL ? "القائمة" : "Menu"}
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="overflow-y-auto p-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                  {moreMenuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hasNotifications = item.id === "notifications" && unreadCount > 0;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2",
                          "p-4 rounded-2xl min-h-[88px]",
                          "transition-all duration-200",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted text-foreground"
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative">
                          <Icon className="h-6 w-6" />
                          {hasNotifications && (
                            <span className="absolute -top-1 -end-1 h-2.5 w-2.5 bg-destructive rounded-full" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">
                          {isRTL ? item.titleAr : item.titleEn}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fixed bottom-0 inset-x-0 z-50",
          "bg-background border-t border-border",
          "md:hidden" // Only on mobile
        )}
        style={{
          height: `${BOTTOM_NAV_HEIGHT}px`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div 
          className="h-full flex items-stretch justify-evenly"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Main Nav Items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1",
                  "min-w-0 px-1",
                  "transition-colors duration-200",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all",
                      active && "scale-110"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1.5 -end-2 h-4 min-w-4 px-1 text-[10px]"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    active && "font-semibold"
                  )}
                >
                  {isRTL ? item.titleAr : item.titleEn}
                </span>
                {/* Active indicator line */}
                {active && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute top-0 h-0.5 w-12 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              "min-w-0 px-1",
              "transition-colors duration-200",
              isMoreActive || moreOpen ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <MoreHorizontal
                className={cn(
                  "h-6 w-6 transition-all",
                  (isMoreActive || moreOpen) && "scale-110"
                )}
                strokeWidth={(isMoreActive || moreOpen) ? 2.5 : 2}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -end-1 h-2.5 w-2.5 bg-destructive rounded-full" />
              )}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium whitespace-nowrap",
                (isMoreActive || moreOpen) && "font-semibold"
              )}
            >
              {isRTL ? "المزيد" : "More"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;
