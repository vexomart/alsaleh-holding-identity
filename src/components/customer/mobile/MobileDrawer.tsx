/**
 * Mobile Drawer - Full Navigation Drawer
 * RTL-aware side drawer with all sections
 * Opens from RIGHT in RTL, LEFT in LTR
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Wallet,
  User,
  Bell,
  FileSignature,
  Receipt,
  Landmark,
  Users,
  LogOut,
  Moon,
  Sun,
  Globe,
  Building2,
  ChevronLeft,
  ChevronRight,
  Settings,
  CreditCard,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface NavSection {
  titleAr: string;
  titleEn: string;
  items: NavItem[];
}

interface NavItem {
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface MobileDrawerProps {
  trigger?: React.ReactNode;
}

export function MobileDrawer({ trigger }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications({ userId: user?.id });

  // All navigation sections
  const navSections: NavSection[] = [
    {
      titleAr: "القائمة الرئيسية",
      titleEn: "Main Menu",
      items: [
        { titleAr: "الرئيسية", titleEn: "Home", icon: LayoutDashboard, href: "/app" },
        { titleAr: "طلباتي", titleEn: "My Orders", icon: ShoppingCart, href: "/app/orders" },
        { titleAr: "الخدمات", titleEn: "Services", icon: Package, href: "/app/services" },
        { titleAr: "المحفظة", titleEn: "Wallet", icon: Wallet, href: "/app/wallet" },
        { titleAr: "المعاملات", titleEn: "Transactions", icon: CreditCard, href: "/app/transactions" },
      ],
    },
    {
      titleAr: "المستندات والعقود",
      titleEn: "Documents",
      items: [
        { titleAr: "عقودي", titleEn: "My Contracts", icon: FileSignature, href: "/app/contracts" },
        { titleAr: "فواتيري", titleEn: "My Invoices", icon: Receipt, href: "/app/invoices" },
      ],
    },
    {
      titleAr: "خدمات إضافية",
      titleEn: "Additional Services",
      items: [
        { titleAr: "التمويل", titleEn: "Finance", icon: Landmark, href: "/app/finance" },
        { titleAr: "الإحالات", titleEn: "Referrals", icon: Users, href: "/app/referrals" },
      ],
    },
    {
      titleAr: "الحساب",
      titleEn: "Account",
      items: [
        { titleAr: "الإشعارات", titleEn: "Notifications", icon: Bell, href: "/app/notifications", badge: unreadCount },
        { titleAr: "الملف الشخصي", titleEn: "Profile", icon: User, href: "/app/profile" },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
    setOpen(false);
  };

  const userName = profile?.full_name || profile?.email?.split("@")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  // RTL-aware chevron
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-[300px] sm:w-[340px] p-0 overflow-hidden flex flex-col"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {/* User Header */}
        <SheetHeader className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b shrink-0">
          <div className={cn(
            "flex items-center gap-4",
            isRTL && "flex-row"
          )}>
            <Avatar className="h-14 w-14 border-2 border-primary/30 shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className={cn(
                "text-lg font-bold truncate",
                isRTL ? "text-right" : "text-left"
              )}>
                {userName}
              </SheetTitle>
              <p 
                className={cn(
                  "text-sm text-muted-foreground truncate",
                  isRTL ? "text-right" : "text-left"
                )} 
                dir="ltr"
              >
                {profile?.email}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 space-y-6">
            {navSections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <p className={cn(
                  "text-xs font-semibold text-muted-foreground mb-2 px-3 uppercase tracking-wider",
                  isRTL ? "text-right" : "text-left"
                )}>
                  {isRTL ? section.titleAr : section.titleEn}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <motion.button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                          "transition-all duration-200",
                          "min-h-[48px]",
                          isRTL && "flex-row",
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={cn(
                          "h-5 w-5 shrink-0",
                          active && "text-primary"
                        )} />
                        <span className={cn(
                          "flex-1",
                          isRTL ? "text-right" : "text-left"
                        )}>
                          {isRTL ? item.titleAr : item.titleEn}
                        </span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                            {item.badge > 99 ? "99+" : item.badge}
                          </Badge>
                        )}
                        <ChevronIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

            <Separator />

            {/* Settings Section */}
            <div className="space-y-1">
              <p className={cn(
                "text-xs font-semibold text-muted-foreground mb-2 px-3 uppercase tracking-wider",
                isRTL ? "text-right" : "text-left"
              )}>
                {isRTL ? "الإعدادات" : "Settings"}
              </p>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                  "text-foreground hover:bg-muted transition-all min-h-[48px]",
                  isRTL && "flex-row"
                )}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 shrink-0" />
                ) : (
                  <Moon className="h-5 w-5 shrink-0" />
                )}
                <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  {isRTL
                    ? theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"
                    : theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                  "text-foreground hover:bg-muted transition-all min-h-[48px]",
                  isRTL && "flex-row"
                )}
              >
                <Globe className="h-5 w-5 shrink-0" />
                <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  {language === "ar" ? "English" : "العربية"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "🇺🇸" : "🇸🇦"}
                </span>
              </button>
            </div>

            <Separator />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl",
                "text-destructive hover:bg-destructive/10 transition-all min-h-[48px]",
                isRTL && "flex-row"
              )}
            >
              <LogOut className={cn("h-5 w-5 shrink-0", isRTL && "scale-x-[-1]")} />
              <span className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                {isRTL ? "تسجيل الخروج" : "Sign Out"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 shrink-0">
          <div className={cn(
            "flex items-center gap-2 justify-center text-xs text-muted-foreground"
          )}>
            <Building2 className="h-4 w-4" />
            <span>ASH {isRTL ? "بوابة العميل" : "Customer Portal"}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileDrawer;
