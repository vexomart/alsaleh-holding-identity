/**
 * PermissionMatrix Component - Visual Permission Grid (Dark Theme)
 * Shows all permissions vs roles in a matrix view
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter,
  Shield,
  Key,
  Users,
  ShoppingCart,
  Settings,
  Palette,
  BarChart3,
  Bell,
  FileText,
  Crown,
  Briefcase,
  UserCog,
  User,
  Headphones,
  DollarSign,
  PenTool,
  Loader2
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  module: string;
}

interface PermissionMatrixProps {
  permissions: Permission[];
  rolePermissions: { role: string; permission_id: string }[];
  onTogglePermission: (role: string, permissionId: string, currentValue: boolean) => Promise<void>;
  language: string;
  isLoading?: boolean;
}

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

const moduleColors: Record<string, string> = {
  users: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  orders: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  services: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  cms: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  reports: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  notifications: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  audit: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  settings: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  roles: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  finance: "bg-green-500/10 text-green-500 border-green-500/20"
};

const roleIcons: Record<string, React.ElementType> = {
  super_admin: Crown,
  admin: Shield,
  manager: Briefcase,
  staff: UserCog,
  customer: User,
  support: Headphones,
  finance: DollarSign,
  content_editor: PenTool
};

const roleColors: Record<string, string> = {
  super_admin: "from-amber-500 to-orange-500",
  admin: "from-blue-500 to-indigo-500",
  manager: "from-emerald-500 to-teal-500",
  staff: "from-slate-500 to-gray-500",
  customer: "from-gray-400 to-gray-500",
  support: "from-pink-500 to-rose-500",
  finance: "from-green-500 to-emerald-500",
  content_editor: "from-violet-500 to-purple-500"
};

const roleOrder = ['super_admin', 'admin', 'manager', 'staff', 'support', 'finance', 'content_editor', 'customer'];

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

const roleNames: Record<string, { ar: string; en: string }> = {
  super_admin: { ar: "مدير عام", en: "Super Admin" },
  admin: { ar: "مدير", en: "Admin" },
  manager: { ar: "مشرف", en: "Manager" },
  staff: { ar: "موظف", en: "Staff" },
  customer: { ar: "عميل", en: "Customer" },
  support: { ar: "دعم", en: "Support" },
  finance: { ar: "مالية", en: "Finance" },
  content_editor: { ar: "محرر", en: "Editor" }
};

export function PermissionMatrix({ 
  permissions, 
  rolePermissions, 
  onTogglePermission, 
  language,
  isLoading 
}: PermissionMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());
  const isRTL = language === "ar";

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(p => {
      if (!grouped[p.module]) grouped[p.module] = [];
      grouped[p.module].push(p);
    });
    return grouped;
  }, [permissions]);

  const modules = Object.keys(permissionsByModule);

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    let filtered = permissions;
    
    if (selectedModule) {
      filtered = filtered.filter(p => p.module === selectedModule);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.name_ar?.toLowerCase().includes(query) ||
        p.module.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [permissions, selectedModule, searchQuery]);

  const hasPermission = (role: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const handleToggle = async (role: string, permissionId: string, currentValue: boolean) => {
    const cellKey = `${role}-${permissionId}`;
    setLoadingCells(prev => new Set(prev).add(cellKey));
    
    try {
      await onTogglePermission(role, permissionId, currentValue);
    } finally {
      setLoadingCells(prev => {
        const next = new Set(prev);
        next.delete(cellKey);
        return next;
      });
    }
  };

  const getPermissionLabel = (permission: Permission) => {
    if (isRTL && permission.name_ar) return permission.name_ar;
    return permission.name.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || permission.name;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-sm text-slate-400">
            {isRTL ? "جاري تحميل البيانات..." : "Loading data..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={isRTL ? "بحث في الصلاحيات..." : "Search permissions..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ps-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        {/* Module Filter */}
        <ScrollArea className="w-full sm:w-auto">
          <div className="flex items-center gap-2 pb-2">
            <Button
              variant={selectedModule === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModule(null)}
              className={cn(
                "whitespace-nowrap",
                selectedModule === null 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              )}
            >
              <Filter className="h-4 w-4 me-1" />
              {isRTL ? "الكل" : "All"}
            </Button>
            {modules.map(module => {
              const Icon = moduleIcons[module] || Settings;
              const isSelected = selectedModule === module;
              return (
                <Button
                  key={module}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedModule(isSelected ? null : module)}
                  className={cn(
                    "whitespace-nowrap",
                    isSelected 
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" 
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  <Icon className="h-4 w-4 me-1" />
                  {moduleNames[module]?.[isRTL ? "ar" : "en"] || module}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Matrix Table */}
      <div className="relative rounded-xl border border-slate-700 overflow-hidden bg-slate-900/50">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-800/80 hover:bg-slate-800/80 border-slate-700">
                <TableHead className="sticky start-0 z-20 bg-slate-800/80 min-w-[200px] border-e border-slate-700">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-blue-400" />
                    <span className="font-semibold text-slate-200">
                      {isRTL ? "الصلاحية" : "Permission"}
                    </span>
                  </div>
                </TableHead>
                {roleOrder.map(role => {
                  const Icon = roleIcons[role] || User;
                  return (
                    <TableHead key={role} className="text-center min-w-[100px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                          "p-1.5 rounded-lg bg-gradient-to-br",
                          roleColors[role]
                        )}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-slate-300">
                          {roleNames[role]?.[isRTL ? "ar" : "en"] || role}
                        </span>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredPermissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={roleOrder.length + 1} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Search className="h-8 w-8 opacity-50" />
                        <p>{isRTL ? "لا توجد صلاحيات مطابقة" : "No matching permissions"}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPermissions.map((permission, index) => {
                    const ModuleIcon = moduleIcons[permission.module] || Settings;
                    return (
                      <motion.tr
                        key={permission.id}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="group hover:bg-slate-800/50 transition-colors border-slate-700/50"
                      >
                        <TableCell className="sticky start-0 z-10 bg-slate-900/80 group-hover:bg-slate-800/80 border-e border-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-1.5 rounded-lg border",
                              moduleColors[permission.module]
                            )}>
                              <ModuleIcon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-slate-200">
                                {getPermissionLabel(permission)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {permission.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        {roleOrder.map(role => {
                          const hasPerm = hasPermission(role, permission.id);
                          const cellKey = `${role}-${permission.id}`;
                          const isUpdating = loadingCells.has(cellKey);
                          
                          return (
                            <TableCell key={role} className="text-center">
                              <div className="flex items-center justify-center">
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                                ) : (
                                  <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="relative"
                                  >
                                    <Switch
                                      checked={hasPerm}
                                      onCheckedChange={() => handleToggle(role, permission.id, hasPerm)}
                                      className="data-[state=checked]:bg-blue-600"
                                    />
                                  </motion.div>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-slate-400 px-1">
        <span>
          {isRTL 
            ? `عرض ${filteredPermissions.length} من ${permissions.length} صلاحية`
            : `Showing ${filteredPermissions.length} of ${permissions.length} permissions`
          }
        </span>
        <span>
          {isRTL 
            ? `${rolePermissions.length} صلاحية مُعينة`
            : `${rolePermissions.length} permissions assigned`
          }
        </span>
      </div>
    </div>
  );
}
