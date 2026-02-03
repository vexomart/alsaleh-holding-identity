/**
 * Mobile Bottom Navigation - App-like Navigation
 * Fixed bottom bar with 5 main navigation items
 * RTL-aware with smooth animations
 */

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
  Package,
  Wallet,
  User,
} from "lucide-react";

interface NavItem {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });

  const navItems: NavItem[] = [
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
      id: "services",
      titleAr: "الخدمات",
      titleEn: "Services",
      icon: Package,
      href: "/app/services",
    },
    {
      id: "wallet",
      titleAr: "المحفظة",
      titleEn: "Wallet",
      icon: Wallet,
      href: "/app/wallet",
    },
    {
      id: "profile",
      titleAr: "حسابي",
      titleEn: "Profile",
      icon: User,
      href: "/app/profile",
      badge: unreadCount,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(href);
  };

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50",
        "bg-background/95 backdrop-blur-xl",
        "border-t border-border/50",
        "pb-safe",
        "md:hidden" // Only show on mobile
      )}
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="relative flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "min-w-[64px] min-h-[56px] rounded-2xl",
                "transition-all duration-200",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileTap={{ scale: 0.92 }}
            >
              {/* Active indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon Container */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                    y: active ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      active && "text-primary"
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -end-1.5 h-4 min-w-4 px-1 text-[10px] font-bold"
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>

              {/* Label */}
              <motion.span
                className={cn(
                  "text-[10px] font-medium mt-1",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                animate={{
                  fontWeight: active ? 600 : 500,
                }}
              >
                {isRTL ? item.titleAr : item.titleEn}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
