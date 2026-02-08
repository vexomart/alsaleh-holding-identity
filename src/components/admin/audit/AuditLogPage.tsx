/**
 * Audit Log Page - Modern Unified Design
 * Premium activity tracking with SaaS aesthetics
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  Search, 
  Filter,
  User,
  Calendar,
  FileEdit,
  Trash2,
  Plus,
  Eye,
  LogIn,
  LogOut,
  Download,
  RefreshCw,
  Sparkles,
  Activity,
  X
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

type AuditAction = "create" | "read" | "update" | "delete" | "login" | "logout" | "export";

const actionConfig: Record<AuditAction, { icon: React.ElementType; color: string; bgColor: string; labelAr: string; labelEn: string }> = {
  create: { icon: Plus, color: "text-accent", bgColor: "bg-accent/10", labelAr: "إنشاء", labelEn: "Create" },
  read: { icon: Eye, color: "text-primary", bgColor: "bg-primary/10", labelAr: "قراءة", labelEn: "Read" },
  update: { icon: FileEdit, color: "text-secondary", bgColor: "bg-secondary/10", labelAr: "تعديل", labelEn: "Update" },
  delete: { icon: Trash2, color: "text-destructive", bgColor: "bg-destructive/10", labelAr: "حذف", labelEn: "Delete" },
  login: { icon: LogIn, color: "text-accent", bgColor: "bg-accent/10", labelAr: "تسجيل دخول", labelEn: "Login" },
  logout: { icon: LogOut, color: "text-muted-foreground", bgColor: "bg-muted", labelAr: "تسجيل خروج", labelEn: "Logout" },
  export: { icon: Download, color: "text-primary", bgColor: "bg-primary/10", labelAr: "تصدير", labelEn: "Export" },
};

const tableNameTranslations: Record<string, { ar: string; en: string }> = {
  profiles: { ar: "الملفات الشخصية", en: "Profiles" },
  users: { ar: "المستخدمون", en: "Users" },
  orders: { ar: "الطلبات", en: "Orders" },
  services: { ar: "الخدمات", en: "Services" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  system_settings: { ar: "إعدادات النظام", en: "System Settings" },
  pages: { ar: "الصفحات", en: "Pages" },
  menus: { ar: "القوائم", en: "Menus" },
  media: { ar: "الوسائط", en: "Media" },
  tickets: { ar: "التذاكر", en: "Tickets" },
  user_roles: { ar: "صلاحيات المستخدمين", en: "User Roles" },
  role_permissions: { ar: "صلاحيات الأدوار", en: "Role Permissions" },
  contracts: { ar: "العقود", en: "Contracts" },
  invoices: { ar: "الفواتير", en: "Invoices" },
  customer_wallets: { ar: "المحافظ", en: "Wallets" },
};

export function AuditLogPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [tableFilter, setTableFilter] = useState<string>("all");

  const { data: auditLogs, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["audit-logs", actionFilter, tableFilter],
    queryFn: async () => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter as AuditAction);
      }

      if (tableFilter !== "all") {
        query = query.eq("table_name", tableFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredLogs = auditLogs?.filter((log) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      log.table_name?.toLowerCase().includes(searchLower) ||
      log.user_id?.toLowerCase().includes(searchLower) ||
      log.record_id?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", {
      locale: isRTL ? ar : enUS,
    });
  };

  const getTableName = (tableName: string | null) => {
    if (!tableName) return "-";
    const translation = tableNameTranslations[tableName];
    if (translation) {
      return isRTL ? translation.ar : translation.en;
    }
    return tableName;
  };

  const hasActiveFilters = searchQuery || actionFilter !== "all" || tableFilter !== "all";

  const stats = [
    { label: isRTL ? "إجمالي السجلات" : "Total Logs", value: auditLogs?.length || 0, icon: History, color: "text-primary" },
    { label: isRTL ? "إنشاء" : "Creates", value: auditLogs?.filter(l => l.action === "create").length || 0, icon: Plus, color: "text-accent" },
    { label: isRTL ? "تعديل" : "Updates", value: auditLogs?.filter(l => l.action === "update").length || 0, icon: FileEdit, color: "text-secondary" },
    { label: isRTL ? "حذف" : "Deletes", value: auditLogs?.filter(l => l.action === "delete").length || 0, icon: Trash2, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl" />
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <History className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {isRTL ? "سجل النشاط" : "Audit Log"}
              </h1>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Activity className="h-3 w-3" />
                {isRTL ? "تتبع" : "Tracking"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isRTL 
                ? "عرض جميع التغييرات والأنشطة في النظام" 
                : "View all system changes and activities"}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
          {isRTL ? "تحديث" : "Refresh"}
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50 shadow-sm overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-base font-semibold">
                {isRTL ? "تصفية النتائج" : "Filter Results"}
              </CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setActionFilter("all");
                    setTableFilter("all");
                  }}
                  className="ms-auto gap-1 text-xs text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                  {isRTL ? "مسح الفلاتر" : "Clear filters"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "بحث في السجلات..." : "Search logs..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={isRTL ? "نوع الإجراء" : "Action Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "جميع الإجراءات" : "All Actions"}</SelectItem>
                  {Object.entries(actionConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <config.icon className={cn("h-3 w-3", config.color)} />
                        {isRTL ? config.labelAr : config.labelEn}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={isRTL ? "الجدول" : "Table"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "جميع الجداول" : "All Tables"}</SelectItem>
                  {Object.entries(tableNameTranslations).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {isRTL ? value.ar : value.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Audit Log List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">
                {isRTL ? "سجلات النشاط" : "Activity Logs"}
              </CardTitle>
              <Badge variant="outline" className="ms-2">
                {filteredLogs?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border/50">
                  <AnimatePresence mode="popLayout">
                    {filteredLogs.map((log, index) => {
                      const config = actionConfig[log.action as AuditAction];
                      const Icon = config?.icon || Activity;
                      
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.02 }}
                          className="p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {/* Action Icon */}
                            <div className={cn(
                              "p-2.5 rounded-xl shrink-0",
                              config?.bgColor || "bg-muted"
                            )}>
                              <Icon className={cn("h-5 w-5", config?.color || "text-muted-foreground")} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className={cn("text-xs", config?.color)}>
                                  {isRTL ? config?.labelAr : config?.labelEn}
                                </Badge>
                                <span className="text-sm font-medium text-foreground">
                                  {getTableName(log.table_name)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(log.created_at)}
                                </span>
                                {log.user_id && (
                                  <span className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                      {log.user_id.slice(0, 8)}...
                                    </code>
                                  </span>
                                )}
                                {log.record_id && (
                                  <span className="hidden sm:flex items-center gap-1.5">
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                      #{log.record_id.slice(0, 8)}
                                    </code>
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* IP Address */}
                            {log.ip_address && (
                              <span className="hidden lg:block text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                                {String(log.ip_address)}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            ) : (
              <div className="p-16 text-center">
                <div className="p-4 rounded-full bg-muted/50 inline-block mb-4">
                  <History className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-medium text-foreground mb-1">
                  {isRTL ? "لا توجد سجلات نشاط" : "No audit logs found"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "ستظهر السجلات هنا عند حدوث أي نشاط" : "Logs will appear here when activity occurs"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
