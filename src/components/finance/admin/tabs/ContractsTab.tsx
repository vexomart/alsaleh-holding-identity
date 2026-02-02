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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Eye, Download, CheckCircle, Loader2, Stamp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTRACT_STATUS_CONFIG, FinanceContractStatus, formatCurrencySAR } from "@/types/finance";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AdminDigitalStamp } from "../AdminDigitalStamp";

interface Contract {
  id: string;
  contract_number: string;
  status: FinanceContractStatus;
  signed_at?: string;
  admin_approved_at?: string;
  admin_approved_by?: string;
  pdf_url?: string;
  application?: {
    application_number: string;
    amount_sar: number;
    tenor_months?: number;
    entity?: {
      legal_name_ar: string;
    };
  };
}

export function ContractsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  
  const queryClient = useQueryClient();

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
            tenor_months,
            entity:entities(legal_name_ar)
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter as FinanceContractStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Contract[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (contract: Contract) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("غير مصرح");

      const amountSar = contract.application?.amount_sar;
      const tenorMonths = contract.application?.tenor_months;
      if (!amountSar || !tenorMonths) {
        throw new Error("بيانات العقد غير مكتملة (المبلغ/المدة)");
      }

      const { error } = await supabase
        .from("finance_contracts")
        .update({ 
          status: "active" as FinanceContractStatus,
          admin_approved_at: new Date().toISOString(),
          admin_approved_by: user.id
        })
        .eq("id", contract.id);
      if (error) throw error;

      // Generate installments immediately (creates rows in finance_payments)
      const startDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const { error: installmentsError } = await supabase.rpc(
        "generate_finance_installments" as never,
        {
          p_amount_sar: amountSar,
          p_contract_id: contract.id,
          p_tenor_months: tenorMonths,
          p_start_date: startDate,
        } as never
      );
      if (installmentsError) throw installmentsError;
    },
    onSuccess: () => {
      toast.success("تمت الموافقة على العقد وتفعيله");
      // Invalidate all related queries for instant UI update
      queryClient.invalidateQueries({ queryKey: ["admin-finance-contracts"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["admin-finance-applications"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["admin-finance-payments"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["finance-applications"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["finance-contracts"], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ["my-upcoming-payments"], refetchType: 'active' });
      setShowApproveDialog(false);
      setSelectedContract(null);
    },
    onError: (error) => {
      console.error("Approval error:", error);
      toast.error("حدث خطأ أثناء الموافقة على العقد");
    },
  });

  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setShowDetails(true);
  };

  const handleApprove = (contract: Contract) => {
    setSelectedContract(contract);
    setShowApproveDialog(true);
  };

  const handleDownload = async (contract: Contract) => {
    if (contract.pdf_url) {
      window.open(contract.pdf_url, "_blank");
    } else {
      toast.info("ملف PDF غير متوفر حالياً");
    }
  };

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
    <>
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
                    <TableHead className="text-right">المبلغ</TableHead>
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
                        <TableCell className="font-semibold">
                          {contract.application?.amount_sar 
                            ? formatCurrencySAR(contract.application.amount_sar)
                            : "-"}
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
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleView(contract)}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDownload(contract)}
                              title="تحميل PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {contract.status === "signed_by_customer" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(contract)}
                                title="الموافقة والتفعيل"
                              >
                                <Stamp className="h-4 w-4" />
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

      {/* Contract Details Sheet */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent side="left" className="w-full sm:max-w-lg" dir="rtl">
          <SheetHeader>
            <SheetTitle>تفاصيل العقد</SheetTitle>
            <SheetDescription>
              {selectedContract?.contract_number}
            </SheetDescription>
          </SheetHeader>
          {selectedContract && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">الكيان</p>
                  <p className="font-semibold">{selectedContract.application?.entity?.legal_name_ar}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">مبلغ التمويل</p>
                  <p className="font-semibold">
                    {selectedContract.application?.amount_sar 
                      ? formatCurrencySAR(selectedContract.application.amount_sar)
                      : "-"}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">حالة العقد</p>
                  <Badge className="mt-1">
                    {CONTRACT_STATUS_CONFIG[selectedContract.status]?.label || selectedContract.status}
                  </Badge>
                </div>

                {selectedContract.signed_at && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">تاريخ توقيع العميل</p>
                    <p className="font-semibold">
                      {new Date(selectedContract.signed_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                )}

                {/* Admin Approval Stamp */}
                {selectedContract.admin_approved_at && (
                  <div className="flex flex-col items-center p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
                    <p className="text-sm text-emerald-700 mb-3">ختم الموافقة الإدارية</p>
                    <AdminDigitalStamp 
                      approvalDate={selectedContract.admin_approved_at}
                      stampId={selectedContract.id}
                      size="lg"
                    />
                  </div>
                )}
              </div>

              {selectedContract.status === "signed_by_customer" && (
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={() => {
                      setShowDetails(false);
                      handleApprove(selectedContract);
                    }}
                  >
                    <Stamp className="h-4 w-4 ml-2" />
                    الموافقة وتفعيل العقد
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Approve Contract Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Stamp className="h-5 w-5 text-green-600" />
              الموافقة على العقد
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>هل تريد الموافقة على العقد رقم {selectedContract?.contract_number} وتفعيله؟</p>
              <p className="text-sm text-muted-foreground">
                سيتم إضافة ختم الموافقة الرقمي وتفعيل جدول الأقساط.
              </p>
              {/* Preview of stamp */}
              <div className="flex justify-center py-4">
                <AdminDigitalStamp size="md" />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={() => selectedContract && approveMutation.mutate(selectedContract)}
              disabled={approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Stamp className="h-4 w-4 ml-2" />
              )}
              الموافقة والتفعيل
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
