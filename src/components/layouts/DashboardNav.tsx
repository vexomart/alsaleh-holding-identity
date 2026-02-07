/**
 * DashboardNav - Navigation Bar for Dashboard Pages
 * Replaces sidebar navigation with horizontal tab-style nav
 * Used inside Customer and Admin dashboards
 */

import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users,
  ShoppingCart,
  Wallet,
  Bell,
  Receipt,
  Briefcase,
  FileSignature,
  BarChart3,
  Shield,
  Building2,
  Gift,
  Link2
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

// Customer Dashboard Navigation
const customerNavItems: NavItem[] = [
  { label: "لوحة التحكم", href: "/portal", icon: LayoutDashboard },
  { label: "الطلبات", href: "/portal/orders", icon: ShoppingCart },
  { label: "الخدمات", href: "/portal/services", icon: Briefcase },
  { label: "العقود", href: "/portal/contracts", icon: FileSignature },
  { label: "الفواتير", href: "/portal/invoices", icon: Receipt },
  { label: "المحفظة", href: "/portal/wallet", icon: Wallet },
  { label: "التمويل", href: "/portal/finance", icon: Building2 },
  { label: "الإحالات", href: "/portal/referrals", icon: Gift },
  { label: "الإشعارات", href: "/portal/notifications", icon: Bell },
  { label: "الملف الشخصي", href: "/portal/profile", icon: Settings },
];

// Admin Dashboard Navigation  
const adminNavItems: NavItem[] = [
  { label: "نظرة عامة", href: "/adminash", icon: LayoutDashboard },
  { label: "المستخدمين", href: "/adminash/users", icon: Users },
  { label: "الأدوار", href: "/adminash/roles", icon: Shield },
  { label: "الخدمات", href: "/adminash/services", icon: Briefcase },
  { label: "الطلبات", href: "/adminash/orders", icon: ShoppingCart },
  { label: "العقود", href: "/adminash/contracts", icon: FileSignature },
  { label: "المحافظ", href: "/adminash/wallets", icon: Wallet },
  { label: "التمويل", href: "/adminash/finance", icon: Building2 },
  { label: "الإحالات", href: "/adminash/referrals", icon: Gift },
  { label: "التكاملات", href: "/adminash/integrations", icon: Link2 },
  { label: "التقارير", href: "/adminash/reports", icon: BarChart3 },
  { label: "الإشعارات", href: "/adminash/notifications", icon: Bell },
  { label: "الإعدادات", href: "/adminash/settings", icon: Settings },
];

interface DashboardNavProps {
  variant: 'customer' | 'admin';
}

export function DashboardNav({ variant }: DashboardNavProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const items = variant === 'admin' ? adminNavItems : customerNavItems;
  
  const isActive = (href: string) => {
    if (href === '/portal' || href === '/adminash') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="sticky top-[64px] z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <nav className="flex items-center gap-1 py-2" role="navigation">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/portal' || item.href === '/adminash'}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 shrink-0",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {!isMobile && <span>{item.label}</span>}
                  {isMobile && active && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default DashboardNav;
