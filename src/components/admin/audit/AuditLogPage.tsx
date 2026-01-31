/**
 * Audit Log Page - Enterprise Grade
 * Displays all system activity and changes
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
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
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

type AuditAction = "create" | "read" | "update" | "delete" | "login" | "logout" | "export";

const actionConfig: Record<AuditAction, { icon: React.ElementType; colorClass: string; labelAr: string; labelEn: string }> = {
  create: { icon: Plus, colorClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", labelAr: "إنشاء", labelEn: "Create" },
  read: { icon: Eye, colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", labelAr: "قراءة", labelEn: "Read" },
  update: { icon: FileEdit, colorClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", labelAr: "تعديل", labelEn: "Update" },
  delete: { icon: Trash2, colorClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", labelAr: "حذف", labelEn: "Delete" },
  login: { icon: LogIn, colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", labelAr: "تسجيل دخول", labelEn: "Login" },
  logout: { icon: LogOut, colorClass: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400", labelAr: "تسجيل خروج", labelEn: "Logout" },
  export: { icon: Download, colorClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", labelAr: "تصدير", labelEn: "Export" },
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
};

export function AuditLogPage() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [tableFilter, setTableFilter] = useState<string>("all");

  const { data: auditLogs, isLoading, refetch } = useQuery({
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

  const renderActionBadge = (action: AuditAction) => {
    const config = actionConfig[action];
    if (!config) return <Badge variant="outline">{action}</Badge>;

    const Icon = config.icon;
    return (
      <Badge className={`${config.colorClass} gap-1`}>
        <Icon className="h-3 w-3" />
        {isRTL ? config.labelAr : config.labelEn}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <History className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? "سجل النشاط" : "Audit Log"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? "عرض جميع التغييرات والأنشطة في النظام" 
                : "View all system changes and activities"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 me-2" />
          {isRTL ? "تحديث" : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {isRTL ? "تصفية النتائج" : "Filter Results"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "بحث..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={isRTL ? "نوع الإجراء" : "Action Type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "جميع الإجراءات" : "All Actions"}</SelectItem>
                <SelectItem value="create">{isRTL ? "إنشاء" : "Create"}</SelectItem>
                <SelectItem value="read">{isRTL ? "قراءة" : "Read"}</SelectItem>
                <SelectItem value="update">{isRTL ? "تعديل" : "Update"}</SelectItem>
                <SelectItem value="delete">{isRTL ? "حذف" : "Delete"}</SelectItem>
                <SelectItem value="login">{isRTL ? "تسجيل دخول" : "Login"}</SelectItem>
                <SelectItem value="logout">{isRTL ? "تسجيل خروج" : "Logout"}</SelectItem>
                <SelectItem value="export">{isRTL ? "تصدير" : "Export"}</SelectItem>
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

      {/* Audit Log Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredLogs && filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{isRTL ? "الإجراء" : "Action"}</TableHead>
                    <TableHead>{isRTL ? "الجدول" : "Table"}</TableHead>
                    <TableHead>{isRTL ? "معرف السجل" : "Record ID"}</TableHead>
                    <TableHead>{isRTL ? "المستخدم" : "User"}</TableHead>
                    <TableHead>{isRTL ? "عنوان IP" : "IP Address"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(log.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderActionBadge(log.action as AuditAction)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{getTableName(log.table_name)}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {log.record_id ? log.record_id.slice(0, 8) + "..." : "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <code className="text-xs">
                            {log.user_id ? log.user_id.slice(0, 8) + "..." : "-"}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {String(log.ip_address) || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? "لا توجد سجلات نشاط" : "No audit logs found"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
