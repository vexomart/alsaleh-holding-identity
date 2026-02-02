/**
 * Applications Tab - إدارة طلبات التمويل
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_CONFIG,
  formatCurrencySAR,
  FinanceApplicationStatus,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-finance-applications", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("finance_applications")
        .select(`
          *,
          entity:entities(legal_name_ar, entity_type),
          service:services(name_ar)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as FinanceApplicationStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredApplications = applications?.filter((app) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      app.application_number?.toLowerCase().includes(searchLower) ||
      app.entity?.legal_name_ar?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>طلبات التمويل</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10 w-[200px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="submitted">مقدمة</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="approved">موافق عليها</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
                <SelectItem value="needs_info">تحتاج معلومات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredApplications?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد طلبات تمويل
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">الكيان</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">المدة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications?.map((app, index) => {
                  const statusConfig = APPLICATION_STATUS_CONFIG[app.status as FinanceApplicationStatus];
                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b"
                    >
                      <TableCell className="font-mono text-sm">
                        {app.application_number}
                      </TableCell>
                      <TableCell>{app.entity?.legal_name_ar || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {app.entity?.entity_type === "individual"
                            ? "فرد"
                            : app.entity?.entity_type === "company"
                            ? "شركة"
                            : "مؤسسة"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrencySAR(app.amount_sar)}
                      </TableCell>
                      <TableCell>{app.tenor_months} شهر</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            statusConfig?.variant === "success" &&
                              "bg-green-500/10 text-green-600 border-green-200",
                            statusConfig?.variant === "warning" &&
                              "bg-yellow-500/10 text-yellow-600 border-yellow-200",
                            statusConfig?.variant === "destructive" &&
                              "bg-red-500/10 text-red-600 border-red-200",
                            statusConfig?.variant === "secondary" &&
                              "bg-muted text-muted-foreground"
                          )}
                        >
                          {statusConfig?.label || app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(app.created_at).toLocaleDateString("ar-SA")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {app.status === "submitted" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
