/**
 * RoleDetailSheet Component - Slide-out panel for role editing
 * Shows all permissions for a specific role with toggles
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Key,
  CheckCircle2,
  XCircle,
  Loader2,
  Crown,
  Briefcase,
  UserCog,
  User,
  Headphones,
  DollarSign,
  PenTool,
  Users,
  ShoppingCart,
  Settings,
  Palette,
  BarChart3,
  Bell,
  FileText,
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Permission {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  module: string;
}

interface RoleDetailSheetProps {
  role: string | null;
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
  rolePermissions: { role: string; permission_id: string }[];
  onTogglePermission: (role: string, permissionId: string, currentValue: boolean) => Promise<void>;
  language: string;
}

const roleConfigs: Record<string, {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ElementType;
  gradient: string;
}> = {
  super_admin: {
    name: "Super Admin",
    nameAr: "مدير عام",
    description: "Full system access with all permissions",
    descriptionAr: "صلاحيات كاملة للنظام",
    icon: Crown,
    gradient: "from-amber-500 via-orange-500 to-red-500"
  },
  admin: {
    name: "Admin",
    nameAr: "مدير",
    description: "Administrative access to manage the system",
    descriptionAr: "صلاحيات إدارية لإدارة النظام",
    icon: Shield,
    gradient: "from-blue-500 via-indigo-500 to-purple-500"
  },
  manager: {
    name: "Manager",
    nameAr: "مشرف",
    description: "Manage orders, services and staff",
    descriptionAr: "إدارة الطلبات والخدمات والموظفين",
    icon: Briefcase,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500"
  },
  staff: {
    name: "Staff",
    nameAr: "موظف",
    description: "Handle day-to-day operations",
    descriptionAr: "التعامل مع العمليات اليومية",
    icon: UserCog,
    gradient: "from-slate-500 via-gray-500 to-zinc-500"
  },
  customer: {
    name: "Customer",
    nameAr: "عميل",
    description: "Basic access for customers",
    descriptionAr: "صلاحيات أساسية للعملاء",
    icon: User,
    gradient: "from-gray-400 via-gray-500 to-gray-600"
  },
  support: {
    name: "Support",
    nameAr: "دعم فني",
    description: "Handle customer support tickets",
    descriptionAr: "التعامل مع تذاكر الدعم الفني",
    icon: Headphones,
    gradient: "from-pink-500 via-rose-500 to-red-400"
  },
  finance: {
    name: "Finance",
    nameAr: "مالية",
    description: "Access to financial reports and transactions",
    descriptionAr: "الوصول للتقارير المالية والمعاملات",
    icon: DollarSign,
    gradient: "from-green-500 via-emerald-500 to-teal-500"
  },
  content_editor: {
    name: "Content Editor",
    nameAr: "محرر محتوى",
    description: "Manage website content and pages",
    descriptionAr: "إدارة محتوى الموقع والصفحات",
    icon: PenTool,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500"
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
  settings: Settings,
  roles: Shield,
  finance: DollarSign
};

const moduleNames: Record<string, { ar: string; en: string }> = {
  users: { ar: "المستخدمين", en: "Users" },
  orders: { ar: "الطلبات", en: "Orders" },
  services: { ar: "الخدمات", en: "Services" },
  cms: { ar: "المحتوى", en: "CMS" },
  reports: { ar: "التقارير", en: "Reports" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  audit: { ar: "التدقيق", en: "Audit" },
  settings: { ar: "الإعدادات", en: "Settings" },
  roles: { ar: "الأدوار", en: "Roles" },
  finance: { ar: "المالية", en: "Finance" }
};

export function RoleDetailSheet({
  role,
  isOpen,
  onClose,
  permissions,
  rolePermissions,
  onTogglePermission,
  language
}: RoleDetailSheetProps) {
  const [loadingPermissions, setLoadingPermissions] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const isRTL = language === "ar";

  const config = role ? roleConfigs[role] : null;
  const Icon = config?.icon || Shield;

  // Get permissions for this role
  const rolePerms = useMemo(() => {
    if (!role) return [];
    return rolePermissions.filter(rp => rp.role === role);
  }, [role, rolePermissions]);

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(p => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    return grouped;
  }, [permissions]);

  const hasPermission = (permissionId: string) => {
    return rolePerms.some(rp => rp.permission_id === permissionId);
  };

  const handleToggle = async (permissionId: string, currentValue: boolean) => {
    if (!role) return;
    
    setLoadingPermissions(prev => new Set(prev).add(permissionId));
    try {
      await onTogglePermission(role, permissionId, currentValue);
    } finally {
      setLoadingPermissions(prev => {
        const next = new Set(prev);
        next.delete(permissionId);
        return next;
      });
    }
  };

  const toggleModule = (module: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(module)) {
        next.delete(module);
      } else {
        next.add(module);
      }
      return next;
    });
  };

  const toggleAllInModule = async (module: string, enable: boolean) => {
    if (!role) return;
    
    const modulePerms = permissionsByModule[module] || [];
    const permsToToggle = modulePerms.filter(p => hasPermission(p.id) !== enable);
    
    for (const perm of permsToToggle) {
      await handleToggle(perm.id, !enable);
    }
  };

  const getPermissionLabel = (permission: Permission) => {
    if (isRTL && permission.name_ar) return permission.name_ar;
    return permission.name.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || permission.name;
  };

  const totalPerms = permissions.length;
  const assignedPerms = rolePerms.length;
  const percentage = totalPerms > 0 ? Math.round((assignedPerms / totalPerms) * 100) : 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        {/* Header */}
        {config && (
          <div className={cn(
            "relative p-6 bg-gradient-to-br text-white overflow-hidden",
            config.gradient
          )}>
            {/* Background decoration */}
            <div className="absolute -top-12 -end-12 w-32 h-32 opacity-10">
              <Icon className="w-full h-full" />
            </div>
            
            <SheetHeader className="relative z-10">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-3 rounded-xl bg-white/20 backdrop-blur-sm"
                >
                  <Icon className="h-6 w-6" />
                  {role === 'super_admin' && (
                    <Sparkles className="absolute -top-1 -end-1 h-4 w-4 text-amber-300 animate-pulse" />
                  )}
                </motion.div>
                <div>
                  <SheetTitle className="text-white text-xl">
                    {isRTL ? config.nameAr : config.name}
                  </SheetTitle>
                  <SheetDescription className="text-white/80">
                    {isRTL ? config.descriptionAr : config.description}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Progress */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {isRTL ? "الصلاحيات المُعينة" : "Assigned Permissions"}
                </span>
                <span className="font-bold">
                  {assignedPerms}/{totalPerms}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Permissions List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {Object.entries(permissionsByModule).map(([module, modulePerms]) => {
              const ModuleIcon = moduleIcons[module] || Settings;
              const moduleAssigned = modulePerms.filter(p => hasPermission(p.id)).length;
              const isExpanded = expandedModules.has(module);
              const allEnabled = moduleAssigned === modulePerms.length;
              const noneEnabled = moduleAssigned === 0;

              return (
                <motion.div
                  key={module}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border overflow-hidden"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <ModuleIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-start">
                        <p className="font-semibold">
                          {moduleNames[module]?.[isRTL ? "ar" : "en"] || module}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {moduleAssigned}/{modulePerms.length} {isRTL ? "مفعّل" : "enabled"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={allEnabled ? "default" : noneEnabled ? "outline" : "secondary"}>
                        {percentage}%
                      </Badge>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-muted-foreground"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </button>

                  {/* Module Permissions */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 space-y-2">
                          {/* Quick Actions */}
                          <div className="flex items-center gap-2 pb-2 border-b border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllInModule(module, true)}
                              disabled={allEnabled}
                              className="text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3 me-1" />
                              {isRTL ? "تفعيل الكل" : "Enable All"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAllInModule(module, false)}
                              disabled={noneEnabled}
                              className="text-xs"
                            >
                              <XCircle className="h-3 w-3 me-1" />
                              {isRTL ? "تعطيل الكل" : "Disable All"}
                            </Button>
                          </div>

                          {/* Permission Items */}
                          {modulePerms.map(perm => {
                            const hasPerm = hasPermission(perm.id);
                            const isLoading = loadingPermissions.has(perm.id);

                            return (
                              <motion.div
                                key={perm.id}
                                layout
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                                  hasPerm ? "bg-primary/5" : "bg-muted/30"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {hasPerm ? (
                                    <Unlock className="h-4 w-4 text-primary flex-shrink-0" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {getPermissionLabel(perm)}
                                    </p>
                                    {perm.description && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {perm.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                  <Switch
                                    checked={hasPerm}
                                    onCheckedChange={() => handleToggle(perm.id, hasPerm)}
                                  />
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} variant="outline" className="w-full">
            {isRTL ? "إغلاق" : "Close"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
