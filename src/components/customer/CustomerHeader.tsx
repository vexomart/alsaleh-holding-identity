/**
 * Customer Dashboard Header
 * Language toggle, notifications, user menu
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/hooks/useLanguage";
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
  Settings,
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

  return (
    <header className={cn(
      "sticky top-0 z-40 flex h-14 md:h-16 items-center gap-2 md:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 md:px-4 lg:px-6",
      isRTL && "flex-row-reverse"
    )}>
      {/* Sidebar Trigger */}
      <SidebarTrigger className={isRTL ? "-me-1" : "-ms-1"} />
      
      <Separator orientation="vertical" className="h-4 md:h-6 hidden sm:block" />

      {/* Page Title Area */}
      <div className={cn("flex-1 min-w-0", isRTL ? "text-right" : "text-left")}>
        <h2 className="text-sm md:text-lg font-semibold text-foreground truncate">
          {isRTL ? "مرحباً" : "Welcome"}, {profile?.full_name || profile?.email?.split("@")[0]}
        </h2>
      </div>

      {/* Actions */}
      <div className={cn("flex items-center gap-1 md:gap-2 shrink-0", isRTL && "flex-row-reverse")}>
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"}>
            <DropdownMenuLabel>
              {isRTL ? "اللغة" : "Language"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setLanguage("ar")}
              className={cn(language === "ar" && "bg-accent")}
            >
              <span className={isRTL ? "ms-2" : "me-2"}>🇸🇦</span>
              العربية
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage("en")}
              className={cn(language === "en" && "bg-accent")}
            >
              <span className={isRTL ? "ms-2" : "me-2"}>🇺🇸</span>
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-9 md:w-9 relative"
          onClick={() => navigate("/app/notifications")}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -end-1 h-4 min-w-4 md:h-5 md:min-w-5 px-1 text-[10px] md:text-xs font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full">
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm font-bold">
                  {(profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || profile?.email?.split("@")[0]}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app")}>
              <ShoppingCart className="me-2 h-4 w-4" />
              {isRTL ? "طلباتي" : "My Orders"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/profile")}>
              <User className="me-2 h-4 w-4" />
              {isRTL ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/notifications")}>
              <Bell className="me-2 h-4 w-4" />
              {isRTL ? "الإشعارات" : "Notifications"}
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ms-auto">
                  {unreadCount}
                </Badge>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="me-2 h-4 w-4" />
              {isRTL ? "تسجيل الخروج" : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
