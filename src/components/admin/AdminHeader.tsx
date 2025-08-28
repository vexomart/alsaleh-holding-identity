import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const AdminHeader = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    
    const fetchRealStats = async () => {
      try {
        // Get real active projects count
        const { data: projects } = await supabase
          .from('projects')
          .select('status')
          .eq('status', 'in_progress');
        
        // Get real new clients count (this month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: clients } = await supabase
          .from('clients')
          .select('created_at')
          .gte('created_at', startOfMonth.toISOString());
        
        // Get real notifications count
        const { data: notificationsData } = await supabase
          .from('project_notifications')
          .select('is_read')
          .eq('is_read', false);
        
        setActiveProjects(projects?.length || 0);
        setNewClients(clients?.length || 0);
        setNotifications(notificationsData?.length || 0);
      } catch (error) {
        console.error('Error fetching real stats:', error);
      }
    };
    
    getUser();
    fetchRealStats();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "سيتم إعادة توجيهك إلى صفحة تسجيل الدخول",
      });
      navigate('/admin-login');
    }
  };

  return (
    <header 
      className="h-14 lg:h-16 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border/30 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-50 transition-all duration-200" 
      dir="rtl"
      style={{ fontFamily: 'Noto Kufi Arabic, Amiri, Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Right side - Navigation & Search */}
      <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="h-8 w-8 lg:h-9 lg:w-9 shrink-0" />
        
        <div className="relative flex-1 max-w-xs lg:max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="البحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 h-8 lg:h-9 bg-muted/30 border-muted focus:bg-background text-sm"
            dir="rtl"
          />
        </div>
      </div>

      {/* Left side - Actions & User */}
      <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
        {/* Quick Stats */}
        <div className="hidden xl:flex items-center gap-3 lg:gap-4 ml-2 lg:ml-4">
          <div className="text-xs lg:text-sm text-right">
            <span className="text-muted-foreground">المشاريع النشطة: </span>
            <span className="font-semibold text-primary">{activeProjects}</span>
          </div>
          <div className="text-xs lg:text-sm text-right">
            <span className="text-muted-foreground">العملاء الجدد: </span>
            <span className="font-semibold text-primary">{newClients}</span>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative h-8 w-8 lg:h-9 lg:w-9 p-0 shrink-0">
          <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -left-1 h-4 w-4 lg:h-5 lg:w-5 p-0 flex items-center justify-center text-xs"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Settings - Hidden on mobile */}
        <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 lg:h-9 lg:w-9 p-0 shrink-0">
          <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
        </Button>

        {/* Language - Hidden on mobile */}
        <Button variant="ghost" size="sm" className="hidden md:flex h-8 w-8 lg:h-9 lg:w-9 p-0 shrink-0">
          <Globe className="h-3 w-3 lg:h-4 lg:w-4" />
        </Button>

        {/* Theme Toggle - Hidden on mobile */}
        <Button variant="ghost" size="sm" className="hidden sm:flex h-8 w-8 lg:h-9 lg:w-9 p-0 shrink-0">
          <Sun className="h-3 w-3 lg:h-4 lg:w-4 dark:hidden" />
          <Moon className="h-3 w-3 lg:h-4 lg:w-4 hidden dark:block" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 lg:h-9 gap-1 lg:gap-2 px-2 lg:px-3 shrink-0">
              <Avatar className="h-6 w-6 lg:h-7 lg:w-7">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs lg:text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-end text-right min-w-0">
                <span className="text-sm font-medium truncate">المدير العام</span>
                <span className="text-xs text-muted-foreground truncate max-w-24">
                  {user?.email || 'admin@company.com'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48 lg:w-56">
            <DropdownMenuLabel className="text-right">حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="text-right">
              <User className="ml-2 h-4 w-4" />
              الملف الشخصي
            </DropdownMenuItem>
            
            <DropdownMenuItem className="text-right">
              <Settings className="ml-2 h-4 w-4" />
              الإعدادات
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive text-right">
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};