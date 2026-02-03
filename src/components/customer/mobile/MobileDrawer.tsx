/**
 * Mobile Drawer - Full Navigation Drawer
 * Bottom sheet style drawer for additional navigation
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
}

const navSections: NavSection[] = [
  {
    titleAr: "القائمة الرئيسية",
    titleEn: "Main Menu",
    items: [
      { titleAr: "الرئيسية", titleEn: "Home", icon: LayoutDashboard, href: "/app" },
      { titleAr: "طلباتي", titleEn: "Orders", icon: ShoppingCart, href: "/app/orders" },
      { titleAr: "الخدمات", titleEn: "Services", icon: Package, href: "/app/services" },
      { titleAr: "المحفظة", titleEn: "Wallet", icon: Wallet, href: "/app/wallet" },
    ],
  },
  {
    titleAr: "المستندات",
    titleEn: "Documents",
    items: [
      { titleAr: "عقودي", titleEn: "Contracts", icon: FileSignature, href: "/app/contracts" },
      { titleAr: "فواتيري", titleEn: "Invoices", icon: Receipt, href: "/app/invoices" },
    ],
  },
  {
    titleAr: "المزيد",
    titleEn: "More",
    items: [
      { titleAr: "التمويل", titleEn: "Finance", icon: Landmark, href: "/app/finance" },
      { titleAr: "الإحالات", titleEn: "Referrals", icon: Users, href: "/app/referrals" },
      { titleAr: "الإشعارات", titleEn: "Notifications", icon: Bell, href: "/app/notifications" },
    ],
  },
];

interface MobileDrawerProps {
  trigger?: React.ReactNode;
}

export function MobileDrawer({ trigger }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

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
        className="w-[300px] p-0 overflow-hidden"
      >
        <SheetHeader className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-primary/30">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-start">
              <SheetTitle className="text-lg font-bold truncate">
                {userName}
              </SheetTitle>
              <p className="text-sm text-muted-foreground truncate" dir="ltr">
                {profile?.email}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
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
                        "min-h-[48px]", // Touch target
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                      <span className="flex-1 text-start">
                        {isRTL ? item.titleAr : item.titleEn}
                      </span>
                      <ChevronIcon className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          <Separator />

          {/* Settings Section */}
          <div className="space-y-1">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-all min-h-[48px]"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="flex-1 text-start">
                {isRTL
                  ? theme === "dark"
                    ? "الوضع الفاتح"
                    : "الوضع الداكن"
                  : theme === "dark"
                  ? "Light Mode"
                  : "Dark Mode"}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-all min-h-[48px]"
            >
              <Globe className="h-5 w-5" />
              <span className="flex-1 text-start">
                {language === "ar" ? "English" : "العربية"}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === "ar" ? "🇺🇸" : "🇸🇦"}
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => handleNavigation("/app/profile")}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-all min-h-[48px]"
            >
              <User className="h-5 w-5" />
              <span className="flex-1 text-start">
                {isRTL ? "الملف الشخصي" : "Profile"}
              </span>
              <ChevronIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <Separator />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all min-h-[48px]"
          >
            <LogOut className={cn("h-5 w-5", isRTL && "scale-x-[-1]")} />
            <span className="flex-1 text-start">
              {isRTL ? "تسجيل الخروج" : "Sign Out"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>ASH {isRTL ? "بوابة العميل" : "Customer Portal"}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileDrawer;
