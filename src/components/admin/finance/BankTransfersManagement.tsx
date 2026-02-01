/**
 * Admin Bank Transfers Management Page
 * Enhanced with receipt preview and user profile details
 */

import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminBankTransfers } from "@/hooks/useBankTransfer";
import { supabase } from "@/integrations/supabase/client";
import { BANK_TRANSFER_STATUS_LABELS, SAUDI_BANKS } from "@/types/wallet";
import type { BankTransferRequest } from "@/types/wallet";
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
  User,
  Mail,
  Image as ImageIcon,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  customer_uid: string | null;
}

interface EnrichedTransfer extends BankTransferRequest {
  profile?: UserProfile;
}

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

  const [enrichedTransfers, setEnrichedTransfers] = useState<EnrichedTransfer[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<EnrichedTransfer | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user profiles for transfers
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!transfers || transfers.length === 0) {
        setEnrichedTransfers([]);
        return;
      }

      const userIds = [...new Set(transfers.map((t) => t.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, customer_uid")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const enriched = transfers.map((transfer) => ({
        ...transfer,
        profile: profileMap.get(transfer.user_id),
      }));

      setEnrichedTransfers(enriched);
    };

    fetchProfiles();
  }, [transfers]);

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
    await approve({ id: selectedTransfer.id, notes: approvalNotes });
    setShowApproveDialog(false);
    setSelectedTransfer(null);
    setApprovalNotes("");
  };

  const handleReject = async () => {
    if (!selectedTransfer || !rejectionReason.trim()) return;
    await reject({ id: selectedTransfer.id, reason: rejectionReason });
    setShowRejectDialog(false);
    setSelectedTransfer(null);
    setRejectionReason("");
  };

  const handleMarkAsReview = async (transfer: EnrichedTransfer) => {
    await markAsReview(transfer.id);
  };

  const openDetailDialog = (transfer: EnrichedTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailDialog(true);
  };

  const openApproveDialog = (transfer: EnrichedTransfer) => {
    setSelectedTransfer(transfer);
    setShowApproveDialog(true);
  };

  const openRejectDialog = (transfer: EnrichedTransfer) => {
    setSelectedTransfer(transfer);
    setShowRejectDialog(true);
  };

  // Filter transfers by search term
  const filteredTransfers = enrichedTransfers.filter((transfer) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      transfer.reference_code?.toLowerCase().includes(search) ||
      transfer.iban.toLowerCase().includes(search) ||
      transfer.profile?.full_name?.toLowerCase().includes(search) ||
      transfer.profile?.email.toLowerCase().includes(search) ||
      transfer.profile?.customer_uid?.toLowerCase().includes(search)
    );
  });

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
    <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
      <Card>
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
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
          <div className={cn(
            "flex flex-col md:flex-row items-start md:items-center gap-4 mb-6",
            isRTL && "md:flex-row-reverse"
          )}>
            <div className="relative flex-1 w-full md:w-auto">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                placeholder={isRTL ? "بحث بالاسم، البريد، رقم العميل..." : "Search by name, email, customer ID..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("w-full", isRTL ? "pr-10 text-right" : "pl-10")}
              />
            </div>
            <div className={cn(
              "flex items-center gap-2",
              isRTL && "flex-row-reverse"
            )}>
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
          {filteredTransfers.length > 0 ? (
            <div dir={isRTL ? "rtl" : "ltr"} className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "العميل" : "Customer"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "الرقم المرجعي" : "Reference"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "البنك" : "Bank"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "الحالة" : "Status"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "التاريخ" : "Date"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className={isRTL ? "text-right" : "text-left"}>
                        <div className={cn(
                          "flex items-center gap-3",
                          isRTL && "flex-row-reverse"
                        )}>
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className={isRTL ? "text-right" : "text-left"}>
                            <div className="font-medium text-sm">
                              {transfer.profile?.full_name || (isRTL ? "عميل" : "Customer")}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono" dir="ltr">
                              {transfer.profile?.customer_uid || "-"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={cn("font-mono text-sm", isRTL ? "text-right" : "text-left")}>
                        <span dir="ltr">{transfer.reference_code}</span>
                      </TableCell>
                      <TableCell className={cn("font-semibold", isRTL ? "text-right" : "text-left")}>
                        <span dir="ltr">{transfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}</span>
                      </TableCell>
                      <TableCell className={cn("text-sm", isRTL ? "text-right" : "text-left")}>{getBankName(transfer.bank_name)}</TableCell>
                      <TableCell className={isRTL ? "text-right" : "text-left"}>
                        <Badge variant={getStatusVariant(transfer.status)}>
                          {getStatusIcon(transfer.status)}
                          <span className="ms-1">
                            {BANK_TRANSFER_STATUS_LABELS[transfer.status as keyof typeof BANK_TRANSFER_STATUS_LABELS]?.[isRTL ? "ar" : "en"] || transfer.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className={cn("text-sm text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                        {format(new Date(transfer.created_at), "PP", {
                          locale: isRTL ? ar : enUS,
                        })}
                      </TableCell>
                      <TableCell className={isRTL ? "text-right" : "text-left"}>
                        <div className={cn(
                          "flex items-center gap-2",
                          isRTL && "flex-row-reverse"
                        )}>
                          {/* View Details */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDetailDialog(transfer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {(transfer.status === "submitted" || transfer.status === "under_review") && (
                            <>
                              {transfer.status === "submitted" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkAsReview(transfer)}
                                >
                                  <FileSearch className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openApproveDialog(transfer)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectDialog(transfer)}
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

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {isRTL ? "تفاصيل التحويل البنكي" : "Bank Transfer Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedTransfer?.reference_code}
            </DialogDescription>
          </DialogHeader>

          {selectedTransfer && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {isRTL ? "معلومات العميل" : "Customer Info"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">{isRTL ? "الاسم" : "Name"}</span>
                    <span className="font-medium">{selectedTransfer.profile?.full_name || "-"}</span>
                    
                    <span className="text-muted-foreground">{isRTL ? "البريد" : "Email"}</span>
                    <span className="font-medium text-xs" dir="ltr">{selectedTransfer.profile?.email || "-"}</span>
                    
                    <span className="text-muted-foreground">{isRTL ? "رقم العميل" : "Customer ID"}</span>
                    <span className="font-mono text-xs">{selectedTransfer.profile?.customer_uid || "-"}</span>
                  </div>
                </div>

                {/* Transfer Info */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {isRTL ? "بيانات التحويل" : "Transfer Details"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">{isRTL ? "المبلغ" : "Amount"}</span>
                    <span className="font-bold text-green-600">
                      {selectedTransfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                    </span>
                    
                    <span className="text-muted-foreground">{isRTL ? "البنك" : "Bank"}</span>
                    <span className="font-medium">{getBankName(selectedTransfer.bank_name)}</span>
                    
                    <span className="text-muted-foreground">{isRTL ? "الآيبان" : "IBAN"}</span>
                    <span className="font-mono text-xs" dir="ltr">{selectedTransfer.iban}</span>
                    
                    <span className="text-muted-foreground">{isRTL ? "اسم صاحب الحساب" : "Account Holder"}</span>
                    <span className="font-medium">{selectedTransfer.account_holder_name || "-"}</span>
                    
                    <span className="text-muted-foreground">{isRTL ? "التاريخ" : "Date"}</span>
                    <span>
                      {format(new Date(selectedTransfer.created_at), "PPp", {
                        locale: isRTL ? ar : enUS,
                      })}
                    </span>
                    
                    <span className="text-muted-foreground">{isRTL ? "الحالة" : "Status"}</span>
                    <Badge variant={getStatusVariant(selectedTransfer.status)}>
                      {BANK_TRANSFER_STATUS_LABELS[selectedTransfer.status as keyof typeof BANK_TRANSFER_STATUS_LABELS]?.[isRTL ? "ar" : "en"]}
                    </Badge>
                  </div>
                </div>

                {/* Receipt Preview */}
                {selectedTransfer.receipt_media_url && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {isRTL ? "إيصال التحويل" : "Transfer Receipt"}
                    </h4>
                    <div className="relative rounded-lg overflow-hidden border bg-background">
                      <img
                        src={selectedTransfer.receipt_media_url}
                        alt="Transfer Receipt"
                        className="w-full h-auto max-h-64 object-contain"
                      />
                      <a
                        href={selectedTransfer.receipt_media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 bg-background/80 p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedTransfer.status === "rejected" && selectedTransfer.rejection_reason && (
                  <div className="bg-destructive/10 rounded-lg p-4 border border-destructive/20">
                    <h4 className="text-sm font-semibold text-destructive mb-2">
                      {isRTL ? "سبب الرفض" : "Rejection Reason"}
                    </h4>
                    <p className="text-sm">{selectedTransfer.rejection_reason}</p>
                  </div>
                )}

                {/* Reviewer Notes */}
                {selectedTransfer.reviewer_notes && (
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <h4 className="text-sm font-semibold text-blue-600 mb-2">
                      {isRTL ? "ملاحظات المراجع" : "Reviewer Notes"}
                    </h4>
                    <p className="text-sm">{selectedTransfer.reviewer_notes}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              {isRTL ? "إغلاق" : "Close"}
            </Button>
            {selectedTransfer && (selectedTransfer.status === "submitted" || selectedTransfer.status === "under_review") && (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowDetailDialog(false);
                    openApproveDialog(selectedTransfer);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 me-2" />
                  {isRTL ? "اعتماد" : "Approve"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDetailDialog(false);
                    openRejectDialog(selectedTransfer);
                  }}
                >
                  <XCircle className="h-4 w-4 me-2" />
                  {isRTL ? "رفض" : "Reject"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

          {selectedTransfer && (
            <div className="space-y-4">
              {/* Transfer Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{isRTL ? "العميل" : "Customer"}</span>
                  <span className="font-medium">{selectedTransfer.profile?.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{isRTL ? "المبلغ" : "Amount"}</span>
                  <span className="font-bold text-green-600">
                    {selectedTransfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                  </span>
                </div>
              </div>

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
          )}

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

          {selectedTransfer && (
            <div className="space-y-4">
              {/* Transfer Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{isRTL ? "العميل" : "Customer"}</span>
                  <span className="font-medium">{selectedTransfer.profile?.full_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{isRTL ? "المبلغ" : "Amount"}</span>
                  <span className="font-bold">
                    {selectedTransfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                  </span>
                </div>
              </div>

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
          )}

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
