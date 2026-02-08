/**
 * RolesPermissions Page - Modern Unified Design
 * Premium roles and permissions management with SaaS aesthetics
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Shield, 
  Users,
  Key,
  RefreshCw,
  CheckCircle2,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  Zap
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

  const stats = useMemo(() => [
    {
      label: isRTL ? "الأدوار" : "Roles",
      value: roles.length,
      icon: Shield,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      label: isRTL ? "الصلاحيات" : "Permissions",
      value: permissions.length,
      icon: Key,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      label: isRTL ? "صلاحيات مُعينة" : "Assigned",
      value: rolePermissions.length,
      icon: CheckCircle2,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      label: isRTL ? "المستخدمين" : "Users",
      value: Object.values(userCounts).reduce((a, b) => a + b, 0),
      icon: Users,
      color: "text-muted-foreground",
      bgColor: "bg-muted"
    }
  ], [isRTL, roles.length, permissions.length, rolePermissions.length, userCounts]);

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {isRTL ? "الأدوار والصلاحيات" : "Roles & Permissions"}
              </h1>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                {isRTL ? "متقدم" : "Advanced"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isRTL 
                ? "إدارة أدوار المستخدمين وصلاحياتهم في النظام"
                : "Manage user roles and their permissions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Status */}
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1.5 px-3 py-1.5",
              isConnected 
                ? "bg-accent/10 text-accent border-accent/30" 
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}
          >
            {isConnected ? (
              <>
                <Zap className="h-3.5 w-3.5" />
                {isRTL ? "متصل" : "LIVE"}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {isRTL ? "غير متصل" : "Offline"}
              </>
            )}
          </Badge>

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <motion.p 
                    className="text-2xl font-bold mt-1 text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="roles" className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
          <TabsList className="bg-muted/50 p-1 h-auto">
            <TabsTrigger 
              value="roles" 
              className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <LayoutGrid className="h-4 w-4" />
              {isRTL ? "الأدوار" : "Roles"}
            </TabsTrigger>
            <TabsTrigger 
              value="matrix" 
              className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
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
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-muted/30 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Grid3X3 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {isRTL ? "مصفوفة الصلاحيات" : "Permission Matrix"}
                  </CardTitle>
                </div>
              </CardHeader>
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
