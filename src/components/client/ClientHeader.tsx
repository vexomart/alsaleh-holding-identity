import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Settings, LogOut, Moon, Sun, Search, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export const ClientHeader = () => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } else {
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-full items-center justify-between px-4">
        {/* Right side - Brand */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <h2 className="text-sm font-semibold text-foreground hidden sm:block">لوحة التحكم</h2>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المشاريع..."
              className="pr-9 h-8 bg-muted/30 border-muted text-sm"
            />
          </div>
        </div>

        {/* Left side - Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -left-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-card border z-50">
              <DropdownMenuLabel className="text-right text-sm font-medium">الإشعارات</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-right p-3">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-medium">تم قبول مشروعك</p>
                  <p className="text-xs text-muted-foreground">مشروع تطوير الموقع تم قبوله</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-right p-3">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm font-medium">فاتورة جديدة</p>
                  <p className="text-xs text-muted-foreground">فاتورة بقيمة 5,000 ريال</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="الصورة الشخصية" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card border z-50" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1 text-right">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || 'عميل كريم'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/client/profile')} className="text-right p-2">
                <User className="ml-2 h-4 w-4" />
                <span className="text-sm">الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/client/settings')} className="text-right p-2">
                <Settings className="ml-2 h-4 w-4" />
                <span className="text-sm">الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-right p-2">
                <LogOut className="ml-2 h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};