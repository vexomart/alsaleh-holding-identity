/**
 * Admin Bank Transfers Management Page
 */

import { useState } from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminBankTransfers } from "@/hooks/useBankTransfer";
import { BANK_TRANSFER_STATUS_LABELS, SAUDI_BANKS } from "@/types/wallet";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  FileSearch,
  Eye,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

export function BankTransfersManagement() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const {
    transfers,
    isLoading,
    statusFilter,
    setStatusFilter,
    approve,
    reject,
    markAsReview,
    isApproving,
    isRejecting,
  } = useAdminBankTransfers();

  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <FileSearch className="h-4 w-4" />;
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "submitted":
        return "secondary";
      case "under_review":
        return "outline";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getBankName = (code: string) => {
    const bank = SAUDI_BANKS.find((b) => b.code === code);
    return bank ? (isRTL ? bank.name_ar : bank.name_en) : code;
  };

  const handleApprove = async () => {
    if (!selectedTransfer) return;
    await approve({ id: selectedTransfer, notes: approvalNotes });
    setShowApproveDialog(false);
    setSelectedTransfer(null);
    setApprovalNotes("");
  };

  const handleReject = async () => {
    if (!selectedTransfer || !rejectionReason.trim()) return;
    await reject({ id: selectedTransfer, reason: rejectionReason });
    setShowRejectDialog(false);
    setSelectedTransfer(null);
    setRejectionReason("");
  };

  const handleMarkAsReview = async (id: string) => {
    await markAsReview(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isRTL ? "إدارة التحويلات البنكية" : "Bank Transfers Management"}
          </CardTitle>
          <CardDescription>
            {isRTL
              ? "مراجعة واعتماد طلبات التحويل البنكي من العملاء"
              : "Review and approve bank transfer requests from customers"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                  <SelectItem value="submitted">{isRTL ? "مقدم" : "Submitted"}</SelectItem>
                  <SelectItem value="under_review">{isRTL ? "قيد المراجعة" : "Under Review"}</SelectItem>
                  <SelectItem value="approved">{isRTL ? "معتمد" : "Approved"}</SelectItem>
                  <SelectItem value="rejected">{isRTL ? "مرفوض" : "Rejected"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          {transfers && transfers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? "الرقم المرجعي" : "Reference"}</TableHead>
                    <TableHead>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                    <TableHead>{isRTL ? "البنك" : "Bank"}</TableHead>
                    <TableHead>{isRTL ? "الآيبان" : "IBAN"}</TableHead>
                    <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                    <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-mono text-sm">
                        {transfer.reference_code}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {transfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                      </TableCell>
                      <TableCell>{getBankName(transfer.bank_name)}</TableCell>
                      <TableCell className="font-mono text-xs" dir="ltr">
                        {transfer.iban.slice(0, 10)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transfer.status)}>
                          {getStatusIcon(transfer.status)}
                          <span className="ms-1">
                            {BANK_TRANSFER_STATUS_LABELS[transfer.status as keyof typeof BANK_TRANSFER_STATUS_LABELS]?.[isRTL ? "ar" : "en"] || transfer.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(transfer.created_at), "PP", {
                          locale: isRTL ? ar : enUS,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transfer.status === "submitted" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsReview(transfer.id)}
                              >
                                <FileSearch className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  setSelectedTransfer(transfer.id);
                                  setShowApproveDialog(true);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedTransfer(transfer.id);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {transfer.status === "under_review" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  setSelectedTransfer(transfer.id);
                                  setShowApproveDialog(true);
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedTransfer(transfer.id);
                                  setShowRejectDialog(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{isRTL ? "لا توجد طلبات تحويل بنكي" : "No bank transfer requests"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {isRTL ? "اعتماد التحويل البنكي" : "Approve Bank Transfer"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? "سيتم إضافة المبلغ لرصيد محفظة العميل"
                : "The amount will be added to the customer's wallet balance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {isRTL ? "ملاحظات (اختياري)" : "Notes (optional)"}
              </label>
              <Textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder={isRTL ? "أضف ملاحظات..." : "Add notes..."}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleApprove} disabled={isApproving}>
              {isApproving ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 me-2" />
              )}
              {isRTL ? "اعتماد" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              {isRTL ? "رفض التحويل البنكي" : "Reject Bank Transfer"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? "يرجى توضيح سبب الرفض للعميل"
                : "Please provide a reason for rejection"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {isRTL ? "سبب الرفض *" : "Rejection Reason *"}
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={isRTL ? "أدخل سبب الرفض..." : "Enter rejection reason..."}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin me-2" />
              ) : (
                <XCircle className="h-4 w-4 me-2" />
              )}
              {isRTL ? "رفض" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
