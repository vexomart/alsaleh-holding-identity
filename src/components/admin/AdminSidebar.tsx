import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  TicketIcon,
  Briefcase,
  Building2,
  FileImage,
  Settings,
  BarChart3,
  UserCheck,
  PlusCircle,
  Globe,
  MessageSquare,
} from "lucide-react";

const menuItems = [
  {
    label: "الإدارة الرئيسية",
    items: [
      { title: "لوحة التحكم", url: "/admin", icon: LayoutDashboard },
      { title: "التقارير", url: "/admin/reports", icon: BarChart3 },
    ]
  },
  {
    label: "إدارة العملاء",
    items: [
      { title: "العملاء", url: "/admin/clients", icon: Users },
      { title: "المشاريع", url: "/admin/projects", icon: FolderKanban },
      { title: "عروض الأسعار", url: "/admin/quotes", icon: FileText },
      { title: "العقود", url: "/admin/contracts", icon: FileText },
      { title: "الفواتير", url: "/admin/invoices", icon: CreditCard },
    ]
  },
  {
    label: "الدعم والخدمات",
    items: [
      { title: "التذاكر", url: "/admin/tickets", icon: TicketIcon },
      { title: "الإشعارات", url: "/admin/notifications", icon: MessageSquare },
    ]
  },
  {
    label: "إدارة المحتوى",
    items: [
      { title: "الصفحات", url: "/admin/pages", icon: Globe },
      { title: "الشركات التابعة", url: "/admin/subsidiaries", icon: Building2 },
      { title: "مكتبة الوسائط", url: "/admin/media", icon: FileImage },
    ]
  },
  {
    label: "الموارد البشرية",
    items: [
      { title: "الوظائف", url: "/admin/jobs", icon: Briefcase },
      { title: "المتقدمين", url: "/admin/applicants", icon: UserCheck },
    ]
  },
  {
    label: "الإعدادات",
    items: [
      { title: "المستخدمين", url: "/admin/users", icon: Users },
      { title: "الإعدادات", url: "/admin/settings", icon: Settings },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h2 className={`font-bold text-lg ${collapsed ? "hidden" : "block"}`}>
            لوحة تحكم المدير
          </h2>
        </div>
        
        {menuItems.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive: linkActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive(item.url) || linkActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}