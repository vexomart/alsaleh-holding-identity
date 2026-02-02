/**
 * Payments Tab - إدارة الأقساط
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
import { Search, CheckCircle, AlertTriangle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PAYMENT_STATUS_CONFIG,
  formatCurrencySAR,
  FinancePaymentStatus,
} from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentsTab() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: payments, isLoading } = useQuery({
    queryKey: ["admin-finance-payments", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("finance_payments")
        .select(`
          *,
          contract:finance_contracts(
            contract_number,
            application:finance_applications(
              entity:entities(legal_name_ar)
            )
          )
        `)
        .order("due_date", { ascending: true });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as FinancePaymentStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
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

  const overdueCount = payments?.filter((p) => p.status === "overdue").length || 0;

  return (
    <div className="space-y-4">
      {overdueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">
                  يوجد <span className="font-bold">{overdueCount}</span> قسط متأخر
                  يحتاج متابعة
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>جدول الأقساط</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="scheduled">مجدولة</SelectItem>
                <SelectItem value="paid">مدفوعة</SelectItem>
                <SelectItem value="overdue">متأخرة</SelectItem>
                <SelectItem value="failed">فاشلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {payments?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد أقساط
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم العقد</TableHead>
                    <TableHead className="text-right">الكيان</TableHead>
                    <TableHead className="text-right">رقم القسط</TableHead>
                    <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment, index) => {
                    const statusConfig = PAYMENT_STATUS_CONFIG[payment.status as FinancePaymentStatus];
                    const isOverdue = payment.status === "overdue";
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn("border-b", isOverdue && "bg-red-500/5")}
                      >
                        <TableCell className="font-mono text-sm">
                          {payment.contract?.contract_number || "-"}
                        </TableCell>
                        <TableCell>
                          {payment.contract?.application?.entity?.legal_name_ar || "-"}
                        </TableCell>
                        <TableCell>القسط {payment.installment_no}</TableCell>
                        <TableCell>
                          {new Date(payment.due_date).toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrencySAR(payment.amount_sar)}
                        </TableCell>
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
                            {statusConfig?.label || payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {payment.status === "scheduled" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {isOverdue && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-yellow-600 hover:text-yellow-700"
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
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
    </div>
  );
}
