/**
 * Contracts Tab - إدارة العقود
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
import { Search, Eye, Download, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTRACT_STATUS_CONFIG, FinanceContractStatus } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";

export function ContractsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["admin-finance-contracts", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("finance_contracts")
        .select(`
          *,
          application:finance_applications(
            application_number,
            amount_sar,
            entity:entities(legal_name_ar)
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as FinanceContractStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredContracts = contracts?.filter((contract) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      contract.contract_number?.toLowerCase().includes(searchLower) ||
      contract.application?.entity?.legal_name_ar?.toLowerCase().includes(searchLower)
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
          <CardTitle>عقود التمويل</CardTitle>
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
                <SelectItem value="generated">منشأ</SelectItem>
                <SelectItem value="signed_by_customer">موقع من العميل</SelectItem>
                <SelectItem value="approved_by_admin">موافق عليه</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredContracts?.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد عقود
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم العقد</TableHead>
                  <TableHead className="text-right">الكيان</TableHead>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ التوقيع</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts?.map((contract, index) => {
                  const statusConfig = CONTRACT_STATUS_CONFIG[contract.status as FinanceContractStatus];
                  return (
                    <motion.tr
                      key={contract.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b"
                    >
                      <TableCell className="font-mono text-sm">
                        {contract.contract_number}
                      </TableCell>
                      <TableCell>
                        {contract.application?.entity?.legal_name_ar || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {contract.application?.application_number || "-"}
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
                          {statusConfig?.label || contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {contract.signed_at
                          ? new Date(contract.signed_at).toLocaleDateString("ar-SA")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          {contract.status === "signed_by_customer" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
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
  );
}
