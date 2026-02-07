/**
 * RolesPermissions Page - Redesigned Enterprise UI
 * Modern roles and permissions management interface
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Shield, 
  Users,
  Key,
  Settings,
  RefreshCw,
  CheckCircle2,
  Grid3X3,
  LayoutGrid,
  Zap,
  Activity
} from "lucide-react";

import { RoleCard, roleConfigs } from "./RoleCard";
import { PermissionMatrix } from "./PermissionMatrix";
import { RoleDetailSheet } from "./RoleDetailSheet";

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

export function RolesPermissions() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const roles = Object.keys(roleConfigs);

  // Fetch all data
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    
    try {
      const [permissionsRes, rolePermissionsRes, userRolesRes] = await Promise.all([
        supabase.from("permissions").select("*").order("module"),
        supabase.from("role_permissions").select("*"),
        supabase.from("user_roles").select("role")
      ]);

      if (permissionsRes.error) throw permissionsRes.error;
      if (rolePermissionsRes.error) throw rolePermissionsRes.error;

      setPermissions(permissionsRes.data || []);
      setRolePermissions(rolePermissionsRes.data || []);

      // Count users per role
      if (userRolesRes.data) {
        const counts: Record<string, number> = {};
        userRolesRes.data.forEach(ur => {
          counts[ur.role] = (counts[ur.role] || 0) + 1;
        });
        setUserCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!silent) {
        toast.error(isRTL ? "خطأ في جلب البيانات" : "Error fetching data");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('role-permissions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'role_permissions' },
        () => {
          fetchData(true);
          toast.info(isRTL ? "🔄 تم تحديث الصلاحيات" : "🔄 Permissions updated", {
            duration: 2000
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles' },
        () => {
          fetchData(true);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, isRTL]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleTogglePermission = async (role: string, permissionId: string, currentValue: boolean) => {
    try {
      if (currentValue) {
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          .eq("role", role as any)
          .eq("permission_id", permissionId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("role_permissions")
          .insert({ 
            role: role as any, 
            permission_id: permissionId 
          });
        
        if (error) throw error;
      }

      toast.success(
        isRTL 
          ? `تم ${currentValue ? 'إزالة' : 'إضافة'} الصلاحية` 
          : `Permission ${currentValue ? 'removed' : 'added'}`
      );
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error(isRTL ? "خطأ في تحديث الصلاحية" : "Error updating permission");
      throw error;
    }
  };

  const getRolePermissionsCount = (role: string) => {
    return rolePermissions.filter(rp => rp.role === role).length;
  };

  // Stats
  const stats = useMemo(() => [
    {
      label: isRTL ? "الأدوار" : "Roles",
      value: roles.length,
      icon: Shield,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-500/10"
    },
    {
      label: isRTL ? "الصلاحيات" : "Permissions",
      value: permissions.length,
      icon: Key,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      label: isRTL ? "صلاحيات مُعينة" : "Assigned",
      value: rolePermissions.length,
      icon: CheckCircle2,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10"
    },
    {
      label: isRTL ? "المستخدمين" : "Users",
      value: Object.values(userCounts).reduce((a, b) => a + b, 0),
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10"
    }
  ], [isRTL, roles.length, permissions.length, rolePermissions.length, userCounts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {isRTL ? "الأدوار والصلاحيات" : "Roles & Permissions"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isRTL 
                  ? "إدارة أدوار المستخدمين وصلاحياتهم في النظام"
                  : "Manage user roles and their permissions in the system"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Status */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
            isConnected 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            )} />
            {isConnected ? (isRTL ? "مُتصل" : "LIVE") : (isRTL ? "غير متصل" : "Offline")}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">{isRTL ? "تحديث" : "Refresh"}</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow group">
              <div className={cn(
                "absolute top-0 inset-x-0 h-1 bg-gradient-to-r",
                stat.color
              )} />
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <motion.p 
                      className="text-2xl lg:text-3xl font-bold mt-1"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    stat.bgColor
                  )}>
                    <stat.icon className={cn("h-5 w-5 bg-gradient-to-br bg-clip-text", stat.color)} style={{ color: 'currentColor' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="roles" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LayoutGrid className="h-4 w-4" />
              {isRTL ? "الأدوار" : "Roles"}
            </TabsTrigger>
            <TabsTrigger value="matrix" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Grid3X3 className="h-4 w-4" />
              {isRTL ? "مصفوفة الصلاحيات" : "Permission Matrix"}
            </TabsTrigger>
          </TabsList>

          {/* Roles Grid */}
          <TabsContent value="roles" className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roles.map((role, index) => (
                  <RoleCard
                    key={role}
                    role={role}
                    language={language}
                    permissionsCount={getRolePermissionsCount(role)}
                    totalPermissions={permissions.length}
                    usersCount={userCounts[role] || 0}
                    onClick={() => {
                      setSelectedRole(role);
                      setIsSheetOpen(true);
                    }}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Permission Matrix */}
          <TabsContent value="matrix" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 lg:p-6">
                <PermissionMatrix
                  permissions={permissions}
                  rolePermissions={rolePermissions}
                  onTogglePermission={handleTogglePermission}
                  language={language}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Role Detail Sheet */}
      <RoleDetailSheet
        role={selectedRole}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedRole(null);
        }}
        permissions={permissions}
        rolePermissions={rolePermissions}
        onTogglePermission={handleTogglePermission}
        language={language}
      />
    </div>
  );
}
