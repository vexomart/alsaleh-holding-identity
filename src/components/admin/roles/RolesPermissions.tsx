import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Users,
  Key,
  Lock,
  Unlock,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  FileText,
  Bell,
  BarChart3,
  Palette,
  UserCog,
  Crown,
  Briefcase,
  Headphones,
  DollarSign,
  PenTool,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Permission {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  module: string;
}

interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
}

interface RoleConfig {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  gradient: string;
}

const roleConfigs: Record<string, RoleConfig> = {
  super_admin: {
    name: "Super Admin",
    nameAr: "مدير عام",
    description: "Full system access with all permissions",
    descriptionAr: "صلاحيات كاملة للنظام",
    icon: Crown,
    color: "text-destructive",
    bgColor: "bg-destructive/10 dark:bg-destructive/20",
    gradient: "from-destructive to-destructive/80"
  },
  admin: {
    name: "Admin",
    nameAr: "مدير",
    description: "Administrative access to manage the system",
    descriptionAr: "صلاحيات إدارية لإدارة النظام",
    icon: Shield,
    color: "text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/20",
    gradient: "from-primary to-primary/80"
  },
  manager: {
    name: "Manager",
    nameAr: "مشرف",
    description: "Manage orders, services and staff",
    descriptionAr: "إدارة الطلبات والخدمات والموظفين",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-primary/10 dark:bg-primary/20",
    gradient: "from-primary to-primary/80"
  },
  staff: {
    name: "Staff",
    nameAr: "موظف",
    description: "Handle day-to-day operations",
    descriptionAr: "التعامل مع العمليات اليومية",
    icon: UserCog,
    color: "text-accent",
    bgColor: "bg-accent/10 dark:bg-accent/20",
    gradient: "from-accent to-accent/80"
  },
  customer: {
    name: "Customer",
    nameAr: "عميل",
    description: "Basic access for customers",
    descriptionAr: "صلاحيات أساسية للعملاء",
    icon: User,
    color: "text-muted-foreground",
    bgColor: "bg-muted dark:bg-muted/50",
    gradient: "from-muted-foreground to-muted-foreground/80"
  },
  support: {
    name: "Support",
    nameAr: "دعم فني",
    description: "Handle customer support tickets",
    descriptionAr: "التعامل مع تذاكر الدعم الفني",
    icon: Headphones,
    color: "text-secondary",
    bgColor: "bg-secondary/10 dark:bg-secondary/20",
    gradient: "from-secondary to-secondary/80"
  },
  finance: {
    name: "Finance",
    nameAr: "مالية",
    description: "Access to financial reports and transactions",
    descriptionAr: "الوصول للتقارير المالية والمعاملات",
    icon: DollarSign,
    color: "text-accent",
    bgColor: "bg-accent/10 dark:bg-accent/20",
    gradient: "from-accent to-accent/80"
  },
  content_editor: {
    name: "Content Editor",
    nameAr: "محرر محتوى",
    description: "Manage website content and pages",
    descriptionAr: "إدارة محتوى الموقع والصفحات",
    icon: PenTool,
    color: "text-secondary",
    bgColor: "bg-secondary/10 dark:bg-secondary/20",
    gradient: "from-secondary to-secondary/80"
  }
};

const moduleIcons: Record<string, React.ElementType> = {
  users: Users,
  orders: ShoppingCart,
  services: Settings,
  cms: Palette,
  reports: BarChart3,
  notifications: Bell,
  audit: FileText,
  settings: Settings
};

export function RolesPermissions() {
  const { language } = useLanguage();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      const [permissionsRes, rolePermissionsRes] = await Promise.all([
        supabase.from("permissions").select("*").order("module"),
        supabase.from("role_permissions").select("*")
      ]);

      if (permissionsRes.error) throw permissionsRes.error;
      if (rolePermissionsRes.error) throw rolePermissionsRes.error;

      setPermissions(permissionsRes.data || []);
      setRolePermissions(rolePermissionsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(language === "ar" ? "خطأ في جلب البيانات" : "Error fetching data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('role-permissions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'role_permissions' },
        () => {
          fetchData();
          toast.info(language === "ar" ? "تم تحديث الصلاحيات" : "Permissions updated", {
            duration: 2000
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, language]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const getRolePermissions = (role: string) => {
    return rolePermissions.filter(rp => rp.role === role);
  };

  const hasPermission = (role: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const getPermissionsByModule = () => {
    const modules: Record<string, Permission[]> = {};
    permissions.forEach(p => {
      if (!modules[p.module]) {
        modules[p.module] = [];
      }
      modules[p.module].push(p);
    });
    return modules;
  };

  const handleTogglePermission = async (role: string, permissionId: string, currentValue: boolean) => {
    // Update pending changes for UI feedback
    const key = `${role}-${permissionId}`;
    setPendingChanges(prev => ({ ...prev, [key]: !currentValue }));

    try {
      if (currentValue) {
        // Remove permission
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role as "admin" | "content_editor" | "customer" | "finance" | "manager" | "staff" | "super_admin" | "support")
          .eq("permission_id", permissionId);
        
        if (error) throw error;
      } else {
        // Add permission
        const { error } = await supabase
          .from("role_permissions")
          .insert({ 
            role: role as "admin" | "content_editor" | "customer" | "finance" | "manager" | "staff" | "super_admin" | "support", 
            permission_id: permissionId 
          });
        
        if (error) throw error;
      }

      toast.success(
        language === "ar" 
          ? `تم ${currentValue ? 'إزالة' : 'إضافة'} الصلاحية` 
          : `Permission ${currentValue ? 'removed' : 'added'}`
      );
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error(language === "ar" ? "خطأ في تحديث الصلاحية" : "Error updating permission");
      // Revert pending change
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[key];
        return newChanges;
      });
    }
  };

  const getModuleName = (module: string) => {
    const moduleNames: Record<string, { ar: string; en: string }> = {
      users: { ar: "المستخدمين", en: "Users" },
      orders: { ar: "الطلبات", en: "Orders" },
      services: { ar: "الخدمات", en: "Services" },
      cms: { ar: "إدارة المحتوى", en: "Content Management" },
      reports: { ar: "التقارير", en: "Reports" },
      notifications: { ar: "الإشعارات", en: "Notifications" },
      audit: { ar: "سجل التدقيق", en: "Audit Log" },
      settings: { ar: "الإعدادات", en: "Settings" }
    };
    return moduleNames[module]?.[language === "ar" ? "ar" : "en"] || module;
  };

  const getPermissionLabel = (permission: Permission) => {
    if (language === "ar" && permission.name_ar) {
      return permission.name_ar;
    }
    // Convert permission name to readable format
    return permission.name
      .split('.')
      .pop()
      ?.replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()) || permission.name;
  };

  const roles = Object.keys(roleConfigs);
  const modulePermissions = getPermissionsByModule();

  const stats = [
    {
      titleAr: "الأدوار",
      titleEn: "Roles",
      value: roles.length,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
      gradient: "from-primary to-primary/80"
    },
    {
      titleAr: "الصلاحيات",
      titleEn: "Permissions",
      value: permissions.length,
      icon: Key,
      color: "text-primary",
      bgColor: "bg-primary/10 dark:bg-primary/20",
      gradient: "from-primary to-primary/80"
    },
    {
      titleAr: "الوحدات",
      titleEn: "Modules",
      value: Object.keys(modulePermissions).length,
      icon: Settings,
      color: "text-accent",
      bgColor: "bg-accent/10 dark:bg-accent/20",
      gradient: "from-accent to-accent/80"
    },
    {
      titleAr: "صلاحيات مُعينة",
      titleEn: "Assigned",
      value: rolePermissions.length,
      icon: CheckCircle2,
      color: "text-secondary",
      bgColor: "bg-secondary/10 dark:bg-secondary/20",
      gradient: "from-secondary to-secondary/80"
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            {language === "ar" ? "الأدوار والصلاحيات" : "Roles & Permissions"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {language === "ar" 
              ? "إدارة أدوار المستخدمين وصلاحياتهم في النظام"
              : "Manage user roles and their permissions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">{language === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r", stat.gradient)} />
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {language === "ar" ? stat.titleAr : stat.titleEn}
                  </p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-2 md:p-3 rounded-xl transition-transform group-hover:scale-110", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5 md:h-6 md:w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="roles" className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="roles" className="gap-2">
            <Users className="h-4 w-4" />
            {language === "ar" ? "الأدوار" : "Roles"}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Key className="h-4 w-4" />
            {language === "ar" ? "الصلاحيات" : "Permissions"}
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-4 md:mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-muted" />
                        <div className="h-3 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {roles.map((role, index) => {
                const config = roleConfigs[role];
                const rolePerms = getRolePermissions(role);
                const Icon = config.icon;

                return (
                  <Card
                    key={role}
                    className={cn(
                      "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl group cursor-pointer",
                      "animate-fade-in"
                    )}
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                    onClick={() => {
                      setSelectedRole(role);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <div className={cn("absolute top-0 inset-x-0 h-1 bg-gradient-to-r", config.gradient)} />
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-xl transition-transform group-hover:scale-110",
                          config.bgColor
                        )}>
                          <Icon className={cn("h-6 w-6", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">
                              {language === "ar" ? config.nameAr : config.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {rolePerms.length} {language === "ar" ? "صلاحية" : "permissions"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {language === "ar" ? config.descriptionAr : config.description}
                          </p>
                          
                          {/* Permission preview */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {Object.keys(modulePermissions).slice(0, 4).map(module => {
                              const modulePermsCount = rolePerms.filter(rp => 
                                permissions.find(p => p.id === rp.permission_id)?.module === module
                              ).length;
                              const totalModulePerms = modulePermissions[module].length;
                              const ModuleIcon = moduleIcons[module] || Settings;

                              return (
                                <div
                                  key={module}
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                                    modulePermsCount > 0
                                      ? "bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent"
                                      : "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground"
                                  )}
                                >
                                  <ModuleIcon className="h-3 w-3" />
                                  <span>{modulePermsCount}/{totalModulePerms}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="mt-4 md:mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                {language === "ar" ? "جميع الصلاحيات" : "All Permissions"}
              </CardTitle>
              <CardDescription>
                {language === "ar" 
                  ? "قائمة بجميع الصلاحيات المتاحة في النظام مصنفة حسب الوحدة"
                  : "List of all available permissions organized by module"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-10 rounded bg-muted" />
                      <div className="h-20 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {Object.entries(modulePermissions).map(([module, perms], index) => {
                    const ModuleIcon = moduleIcons[module] || Settings;
                    
                    return (
                      <AccordionItem
                        key={module}
                        value={module}
                        className={cn(
                          "border rounded-lg px-4 animate-fade-in",
                          "data-[state=open]:bg-muted/30"
                        )}
                        style={{ animationDelay: `${500 + index * 50}ms` }}
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <ModuleIcon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{getModuleName(module)}</span>
                            <Badge variant="secondary" className="ms-2">
                              {perms.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="grid gap-2 sm:grid-cols-2">
                            {perms.map(perm => (
                              <div
                                key={perm.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Key className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {getPermissionLabel(perm)}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {perm.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {roles.slice(0, 3).map(role => {
                                    const hasPerm = hasPermission(role, perm.id);
                                    return (
                                      <div
                                        key={role}
                                        className={cn(
                                          "w-6 h-6 rounded-full flex items-center justify-center",
                                          hasPerm
                                            ? roleConfigs[role].bgColor
                                            : "bg-gray-100 dark:bg-gray-800"
                                        )}
                                        title={roleConfigs[role][language === "ar" ? "nameAr" : "name"]}
                                      >
                                        {hasPerm ? (
                                          <CheckCircle2 className={cn("h-3 w-3", roleConfigs[role].color)} />
                                        ) : (
                                          <XCircle className="h-3 w-3 text-gray-400" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Role Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRole && (
                <>
                  {(() => {
                    const config = roleConfigs[selectedRole];
                    const Icon = config.icon;
                    return (
                      <>
                        <div className={cn("p-2 rounded-lg", config.bgColor)}>
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>
                        <span>{language === "ar" ? config.nameAr : config.name}</span>
                      </>
                    );
                  })()}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {language === "ar" 
                ? "إدارة صلاحيات هذا الدور - التغييرات تُحفظ تلقائياً"
                : "Manage permissions for this role - changes are saved automatically"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {selectedRole && (
              <Accordion type="multiple" defaultValue={Object.keys(modulePermissions)} className="space-y-2">
                {Object.entries(modulePermissions).map(([module, perms]) => {
                  const ModuleIcon = moduleIcons[module] || Settings;
                  const modulePermsCount = perms.filter(p => hasPermission(selectedRole, p.id)).length;
                  
                  return (
                    <AccordionItem
                      key={module}
                      value={module}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <ModuleIcon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{getModuleName(module)}</span>
                          <Badge 
                            variant={modulePermsCount > 0 ? "default" : "secondary"}
                            className="ms-2"
                          >
                            {modulePermsCount}/{perms.length}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-2">
                          {perms.map(perm => {
                            const key = `${selectedRole}-${perm.id}`;
                            const hasPerm = pendingChanges[key] !== undefined 
                              ? pendingChanges[key] 
                              : hasPermission(selectedRole, perm.id);
                            
                            return (
                              <div
                                key={perm.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {hasPerm ? (
                                    <Unlock className="h-4 w-4 text-accent" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="font-medium text-sm">
                                      {getPermissionLabel(perm)}
                                    </p>
                                    {perm.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {perm.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Switch
                                  checked={hasPerm}
                                  onCheckedChange={() => 
                                    handleTogglePermission(
                                      selectedRole, 
                                      perm.id, 
                                      hasPermission(selectedRole, perm.id)
                                    )
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {language === "ar" ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
