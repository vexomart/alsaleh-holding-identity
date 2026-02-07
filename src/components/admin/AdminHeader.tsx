/**
 * Admin Header - Enterprise Grade Design
 * Corporate professional style with breadcrumbs and enhanced functionality
 * Fully responsive for all devices
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  Search, 
  Globe, 
  Moon, 
  Sun, 
  ChevronRight,
  X,
  Home,
  Maximize2,
  Minimize2,
  Menu
} from "lucide-react";
import { useLanguage, Language } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/constants/routes";

interface AdminHeaderProps {
  className?: string;
}

interface Breadcrumb {
  labelAr: string;
  labelEn: string;
  href?: string;
}

const routeToBreadcrumbs: Record<string, Breadcrumb[]> = {
  [ROUTES.ADMIN.OVERVIEW]: [
    { labelAr: "لوحة التحكم", labelEn: "Dashboard" }
  ],
  [ROUTES.ADMIN.USERS]: [
    { labelAr: "إدارة المستخدمين", labelEn: "User Management" }
  ],
  [ROUTES.ADMIN.ROLES]: [
    { labelAr: "الأدوار والصلاحيات", labelEn: "Roles & Permissions" }
  ],
  [ROUTES.ADMIN.SERVICES]: [
    { labelAr: "إدارة الخدمات", labelEn: "Service Management" }
  ],
  [ROUTES.ADMIN.ORDERS]: [
    { labelAr: "إدارة الطلبات", labelEn: "Order Management" }
  ],
  [ROUTES.ADMIN.REPORTS]: [
    { labelAr: "التقارير والتحليلات", labelEn: "Reports & Analytics" }
  ],
  [ROUTES.ADMIN.NOTIFICATIONS]: [
    { labelAr: "مركز الإشعارات", labelEn: "Notification Center" }
  ],
  [ROUTES.ADMIN.AUDIT]: [
    { labelAr: "سجل النشاط", labelEn: "Activity Log" }
  ],
  [ROUTES.ADMIN.SETTINGS]: [
    { labelAr: "إعدادات النظام", labelEn: "System Settings" }
  ],
};

export function AdminHeader({ className }: AdminHeaderProps) {
  const { language, setLanguage, isRTL } = useLanguage();
  const { profile, signOut } = useAuth();
  const { isSuperAdmin } = useRBAC();
  const { toggleSidebar, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState([
    { id: 1, titleAr: "طلب جديد", titleEn: "New Order", time: "5 min", unread: true },
    { id: 2, titleAr: "تحديث النظام", titleEn: "System Update", time: "1 hour", unread: true },
    { id: 3, titleAr: "مستخدم جديد", titleEn: "New User", time: "2 hours", unread: false },
  ]);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const toggleLanguage = () => {
    const newLang: Language = language === "ar" ? "en" : "ar";
    setLanguage(newLang);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(true);
    } else {
      toggleSidebar();
    }
  };

  const breadcrumbs = routeToBreadcrumbs[location.pathname] || [];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <TooltipProvider>
      <header
        className={cn(
          "sticky top-0 z-50 flex items-center gap-2 sm:gap-4 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
          isMobile ? "h-14 px-3" : "h-16 px-4",
          className
        )}
      >
        {/* Menu Trigger - Visible on all devices */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMenuClick}
          className={cn(
            "shrink-0 hover:bg-muted/80 transition-colors",
            isMobile ? "h-10 w-10" : "h-9 w-9"
          )}
        >
          <Menu className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Separator - Desktop only */}
        <div className="hidden sm:block h-6 w-px bg-border/50" />

        {/* Breadcrumbs - Desktop only */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(ROUTES.ADMIN.OVERVIEW)}
          >
            <Home className="h-3.5 w-3.5" />
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="font-medium text-foreground">
                {language === "ar" ? crumb.labelAr : crumb.labelEn}
              </span>
            </div>
          ))}
        </nav>

        {/* Mobile Page Title */}
        {isMobile && breadcrumbs.length > 0 && (
          <span className="font-semibold text-sm truncate flex-1">
            {language === "ar" ? breadcrumbs[0].labelAr : breadcrumbs[0].labelEn}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1 hidden md:block" />

        {/* Search Button - Desktop only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex items-center gap-2 h-9 px-3 text-muted-foreground hover:text-foreground border-dashed"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">{language === "ar" ? "بحث سريع..." : "Quick search..."}</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ms-2">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{language === "ar" ? "بحث سريع (⌘K)" : "Quick Search (⌘K)"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className={cn(
              "lg:hidden hover:bg-muted/80",
              isMobile ? "h-10 w-10" : "h-9 w-9"
            )}
          >
            <Search className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
          </Button>

          {/* Language Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className={cn(
                  "hover:bg-muted/80",
                  isMobile ? "h-10 w-10" : "h-9 w-9"
                )}
              >
                <Globe className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === "ar" ? "English" : "العربية"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle - Tablet+ */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={cn(
                  "hidden sm:flex hover:bg-muted/80",
                  isMobile ? "h-10 w-10" : "h-9 w-9"
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDark 
                ? (language === "ar" ? "الوضع النهاري" : "Light Mode") 
                : (language === "ar" ? "الوضع الليلي" : "Dark Mode")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Fullscreen Toggle - Desktop only */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-9 w-9 hover:bg-muted/80 hidden xl:flex"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen 
                ? (language === "ar" ? "إلغاء ملء الشاشة" : "Exit Fullscreen") 
                : (language === "ar" ? "ملء الشاشة" : "Fullscreen")}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative hover:bg-muted/80",
                  isMobile ? "h-10 w-10" : "h-9 w-9"
                )}
              >
                <Bell className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{language === "ar" ? "الإشعارات" : "Notifications"}</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">{unreadCount} {language === "ar" ? "جديد" : "new"}</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      notif.unread ? "bg-primary" : "bg-muted"
                    )} />
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", notif.unread && "font-medium")}>
                        {language === "ar" ? notif.titleAr : notif.titleEn}
                      </p>
                      <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-primary cursor-pointer">
                {language === "ar" ? "عرض جميع الإشعارات" : "View all notifications"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separator - Desktop only */}
          <div className="hidden sm:block h-6 w-px bg-border/50 mx-1 sm:mx-2" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "relative gap-2 hover:bg-muted/80",
                  isMobile ? "h-10 px-1.5" : "h-9 px-2"
                )}
              >
                <Avatar className={cn(
                  "ring-2 ring-primary/20 ring-offset-1 ring-offset-background",
                  isMobile ? "h-8 w-8" : "h-8 w-8"
                )}>
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-medium">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {profile?.full_name || profile?.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {isSuperAdmin 
                      ? (language === "ar" ? "مدير النظام" : "Super Admin")
                      : (language === "ar" ? "مدير" : "Admin")}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56">
              <div className="flex items-center gap-3 p-3 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">
                    {profile?.full_name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {profile?.email}
                  </span>
                </div>
              </div>
              <DropdownMenuItem onClick={() => navigate(ROUTES.ADMIN.SETTINGS)}>
                {language === "ar" ? "الملف الشخصي" : "Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(ROUTES.ADMIN.SETTINGS)}>
                {language === "ar" ? "الإعدادات" : "Settings"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
                {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Dialog */}
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="sm:max-w-[500px] p-0">
            <DialogHeader className="px-4 pt-4 pb-0">
              <DialogTitle className="sr-only">
                {language === "ar" ? "البحث" : "Search"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center border-b px-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder={language === "ar" ? "ابحث في النظام..." : "Search the system..."}
                className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center py-8">
                {language === "ar" ? "ابدأ الكتابة للبحث..." : "Start typing to search..."}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </header>
    </TooltipProvider>
  );
}