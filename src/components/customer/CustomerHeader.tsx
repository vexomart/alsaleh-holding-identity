/**
 * Customer Dashboard Header - RTL Optimized
 * Language toggle, notifications, user menu
 */

import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Globe,
  User,
  LogOut,
  ShoppingCart,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

export function CustomerHeader() {
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications({ userId: user?.id });
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const userName = profile?.full_name || profile?.email?.split("@")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <header 
      className="sticky top-0 z-40 flex h-14 md:h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 md:px-4 lg:px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Start Section: Sidebar Trigger */}
      <div className="flex items-center gap-2 md:gap-3">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="h-5 md:h-6 hidden sm:block" />
      </div>

      {/* Center Section: Welcome Message */}
      <div className="flex-1 min-w-0 px-3 md:px-4">
        <h2 className="text-sm md:text-base font-semibold text-foreground truncate">
          {isRTL ? `مرحباً، ${userName}` : `Welcome, ${userName}`}
        </h2>
      </div>

      {/* End Section: Actions */}
      <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-full hover:bg-muted"
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-muted">
              <Globe className="h-[18px] w-[18px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {isRTL ? "اختر اللغة" : "Select Language"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setLanguage("ar")}
              className={cn(
                "gap-2 cursor-pointer",
                language === "ar" && "bg-primary/10 text-primary"
              )}
            >
              <span>🇸🇦</span>
              <span>العربية</span>
              {language === "ar" && <span className="ms-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("en")}
              className={cn(
                "gap-2 cursor-pointer",
                language === "en" && "bg-primary/10 text-primary"
              )}
            >
              <span>🇺🇸</span>
              <span>English</span>
              {language === "en" && <span className="ms-auto text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full hover:bg-muted relative"
          onClick={() => navigate("/app/notifications")}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-0.5 -end-0.5 h-[18px] min-w-[18px] px-1 text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-9 gap-2 px-2 rounded-full hover:bg-muted"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium max-w-[100px] truncate">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {userName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/app/orders")}
              className="gap-2 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              {isRTL ? "طلباتي" : "My Orders"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/app/profile")}
              className="gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              {isRTL ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate("/app/notifications")}
              className="gap-2 cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {isRTL ? "الإشعارات" : "Notifications"}
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ms-auto text-xs">
                  {unreadCount}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              {isRTL ? "تسجيل الخروج" : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
