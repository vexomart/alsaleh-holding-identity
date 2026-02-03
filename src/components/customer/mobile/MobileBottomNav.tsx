/**
 * Mobile Bottom Navigation - Premium App-like Experience
 * 100% RTL compliant, safe areas, micro-animations
 * iPhone-grade design with enterprise feel
 */

import { useState, useCallback } from "react";
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
  Settings,
  CreditCard,
  Building2,
} from "lucide-react";

// Bottom Nav height for content padding calculation
export const BOTTOM_NAV_HEIGHT = 80;

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
  { id: "transactions", titleAr: "المعاملات", titleEn: "Transactions", icon: CreditCard, href: "/app/transactions" },
  { id: "finance", titleAr: "التمويل", titleEn: "Finance", icon: Landmark, href: "/app/finance" },
  { id: "referrals", titleAr: "الإحالات", titleEn: "Referrals", icon: Users, href: "/app/referrals" },
  { id: "notifications", titleAr: "الإشعارات", titleEn: "Notifications", icon: Bell, href: "/app/notifications" },
  { id: "profile", titleAr: "حسابي", titleEn: "Profile", icon: User, href: "/app/profile" },
  { id: "client-hub", titleAr: "مركز العميل", titleEn: "Client Hub", icon: Building2, href: "/app/client-hub" },
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

  const isActive = useCallback((href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  // Check if any more menu item is active
  const isMoreActive = moreMenuItems.some(item => isActive(item.href));

  const handleNavigation = useCallback((href: string) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(href);
    setMoreOpen(false);
  }, [navigate]);

  return (
    <>
      {/* More Menu Bottom Sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              dir={isRTL ? "rtl" : "ltr"}
              className={cn(
                "fixed bottom-0 inset-x-0 z-[70]",
                "bg-background/95 backdrop-blur-xl",
                "rounded-t-[28px]",
                "max-h-[75vh] overflow-hidden",
                "shadow-2xl border-t border-border/50"
              )}
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
                direction: isRTL ? "rtl" : "ltr",
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Header */}
              <div 
                className="flex items-center justify-between px-6 pb-4 border-b border-border/50"
                style={{ direction: isRTL ? "rtl" : "ltr" }}
              >
                <h3 className={cn(
                  "text-xl font-bold",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {isRTL ? "القائمة" : "Menu"}
                </h3>
                <motion.button
                  onClick={() => setMoreOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Menu Items Grid */}
              <div className="overflow-y-auto overscroll-contain p-5 pb-8">
                <div className="grid grid-cols-3 gap-4">
                  {moreMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hasNotifications = item.id === "notifications" && unreadCount > 0;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleNavigation(item.href)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2.5",
                          "p-4 rounded-2xl min-h-[96px]",
                          "transition-all duration-200",
                          active
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted/40 hover:bg-muted/70 text-foreground"
                        )}
                        whileTap={{ scale: 0.92 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="relative">
                          <Icon className="h-7 w-7" strokeWidth={active ? 2.5 : 2} />
                          {hasNotifications && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -end-1 h-3 w-3 bg-destructive rounded-full border-2 border-background" 
                            />
                          )}
                        </div>
                        <span className={cn(
                          "text-xs font-semibold text-center leading-tight",
                          isRTL ? "font-arabic" : ""
                        )}>
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
          "bg-background/95 backdrop-blur-xl",
          "border-t border-border/50",
          "md:hidden"
        )}
        style={{
          height: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))`,
          paddingBottom: "env(safe-area-inset-bottom)",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <div 
          className="h-full flex items-center justify-evenly px-2"
          style={{ 
            maxHeight: `${BOTTOM_NAV_HEIGHT}px`,
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {/* Main Nav Items */}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1",
                  "flex-1 h-full max-w-[88px]",
                  "transition-colors duration-200"
                )}
                whileTap={{ scale: 0.9 }}
              >
                {/* Active pill indicator */}
                {active && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute -top-0.5 w-12 h-1 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Icon container with animation */}
                <motion.div 
                  className="relative"
                  animate={{ 
                    y: active ? -2 : 0,
                    scale: active ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -end-2 h-5 min-w-5 px-1 text-[10px] font-bold"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </motion.div>
                
                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] whitespace-nowrap transition-all",
                    active 
                      ? "text-primary font-bold" 
                      : "text-muted-foreground font-medium"
                  )}
                >
                  {isRTL ? item.titleAr : item.titleEn}
                </span>
              </motion.button>
            );
          })}

          {/* More Button */}
          <motion.button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1",
              "flex-1 h-full max-w-[88px]",
              "transition-colors duration-200"
            )}
            whileTap={{ scale: 0.9 }}
          >
            {/* Active indicator for More */}
            {(isMoreActive || moreOpen) && (
              <motion.div
                layoutId="activeNavPill"
                className="absolute -top-0.5 w-12 h-1 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            
            <motion.div 
              className="relative"
              animate={{ 
                y: (isMoreActive || moreOpen) ? -2 : 0,
                scale: (isMoreActive || moreOpen) ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <MoreHorizontal
                className={cn(
                  "h-6 w-6 transition-colors",
                  (isMoreActive || moreOpen) ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={(isMoreActive || moreOpen) ? 2.5 : 2}
              />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -end-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-background" 
                />
              )}
            </motion.div>
            
            <span
              className={cn(
                "text-[11px] whitespace-nowrap transition-all",
                (isMoreActive || moreOpen) 
                  ? "text-primary font-bold" 
                  : "text-muted-foreground font-medium"
              )}
            >
              {isRTL ? "المزيد" : "More"}
            </span>
          </motion.button>
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;
