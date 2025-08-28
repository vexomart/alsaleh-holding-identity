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
    <header className="h-20 border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80 sticky top-0 z-50 font-tajawal">
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"></div>
      
      <div className="relative z-10 flex h-full items-center justify-between px-8">
        {/* Left side - Search & Welcome */}
        <div className="flex items-center gap-6 flex-1">
          <SidebarTrigger className="w-10 h-10 hover:bg-white/10 transition-all duration-300 rounded-xl text-white" />
          
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <Input 
              placeholder="البحث في المشاريع والخدمات..." 
              className="pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-primary focus:bg-white/15 transition-all duration-300 rounded-xl backdrop-blur-sm"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            </div>
          </div>
          
          {/* Welcome Message */}
          <div className="text-right hidden lg:block">
            <h1 className="text-xl font-bold text-white animate-fade-in">
              مرحباً بك <span className="gradient-text-primary">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-sm text-white/70 animate-slide-in-right">نتمنى لك يوماً مثمراً</p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-12 h-12 hover:bg-white/10 transition-all duration-300 rounded-xl text-white hover:scale-105"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative w-12 h-12 hover:bg-white/10 transition-all duration-300 rounded-xl text-white hover:scale-105">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    className="absolute -top-1 -left-1 h-6 w-6 p-0 flex items-center justify-center text-xs animate-bounce-gentle bg-gradient-to-r from-red-500 to-red-600 border-0"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 font-tajawal bg-card/95 backdrop-blur-xl border-white/10">
              <DropdownMenuLabel className="text-right text-lg font-bold">الإشعارات</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-right p-4 hover:bg-primary/10 transition-all duration-300">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-base font-semibold">تم قبول مشروعك</p>
                  <p className="text-sm text-muted-foreground">مشروع تطوير الموقع تم قبوله وسيبدأ العمل قريباً</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-right p-4 hover:bg-accent/10 transition-all duration-300">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-base font-semibold">فاتورة جديدة</p>
                  <p className="text-sm text-muted-foreground">فاتورة بقيمة 5,000 ريال متاحة للدفع</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-right p-4 hover:bg-secondary/10 transition-all duration-300">
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-base font-semibold">رسالة جديدة</p>
                  <p className="text-sm text-muted-foreground">رد من فريق المشروع على استفسارك</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Avatar className="h-12 w-12 ring-2 ring-primary/30 transition-all duration-300 hover:ring-primary/60">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="الصورة الشخصية" />
                  <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-secondary text-white font-bold text-lg">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 font-tajawal bg-card/95 backdrop-blur-xl border-white/10" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2 text-right">
                  <p className="text-base font-bold leading-none">
                    {user?.user_metadata?.full_name || 'عميل كريم'}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge className="self-end w-fit bg-gradient-to-r from-primary to-accent text-white border-0">
                    عميل مميز
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={() => navigate('/client/profile')} className="text-right p-3 hover:bg-primary/10 transition-all duration-300">
                <User className="ml-3 h-5 w-5 text-primary" />
                <span className="text-base">الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/client/settings')} className="text-right p-3 hover:bg-accent/10 transition-all duration-300">
                <Settings className="ml-3 h-5 w-5 text-accent" />
                <span className="text-base">الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-right p-3 hover:bg-destructive/10 transition-all duration-300">
                <LogOut className="ml-3 h-5 w-5 text-destructive" />
                <span className="text-base text-destructive">تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};