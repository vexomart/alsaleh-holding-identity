import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Home,
  FileText,
  Building2,
  Newspaper,
  Briefcase,
  Users,
  FileStack,
  Send,
  Image,
  Settings,
  Activity,
  LogOut,
  User
} from 'lucide-react';
import SecureAdminAuth from './SecureAdminAuth';
import { useSecureSession } from '@/hooks/useSecureSession';

interface AdminUser {
  id: string;
  full_name: string;
  role: 'owner' | 'admin' | 'editor';
  department?: string;
}

const menuItems = [
  { path: '/admin', icon: Home, label: 'الرئيسية', exact: true },
  { path: '/admin/pages', icon: FileText, label: 'الصفحات' },
  { path: '/admin/subsidiaries', icon: Building2, label: 'الشركات التابعة' },
  { path: '/admin/news', icon: Newspaper, label: 'الأخبار والبيانات' },
  { path: '/admin/jobs', icon: Briefcase, label: 'الوظائف' },
  { path: '/admin/applications', icon: Users, label: 'طلبات التوظيف' },
  { path: '/admin/forms', icon: FileStack, label: 'النماذج' },
  { path: '/admin/submissions', icon: Send, label: 'واردات النماذج' },
  { path: '/admin/media', icon: Image, label: 'مكتبة الوسائط' },
  { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },
  { path: '/admin/audit', icon: Activity, label: 'سجل النشاط' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useSecureSession();

  const handleAuthSuccess = (adminUser: AdminUser) => {
    // User is set automatically by the secure session hook
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-red-500';
      case 'admin': return 'bg-orange-500';
      case 'editor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'مالك';
      case 'admin': return 'مدير';
      case 'editor': return 'محرر';
      default: return role;
    }
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SecureAdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">لوحة تحكم الإدارة</h2>
        <p className="text-sm text-muted-foreground">مجموعة علي الشهري القابضة</p>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path, item.exact) ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="ml-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-4 lg:px-6">
          {/* Mobile menu trigger */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden ml-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.full_name}</p>
                  {user.department && (
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  )}
                  <Badge className={`text-xs w-fit ${getRoleBadgeColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                <User className="ml-2 h-4 w-4" />
                الملف الشخصي
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-l bg-muted/10">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}