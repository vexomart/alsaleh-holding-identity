/**
 * Customer Bank Transfer Request List - Premium Design
 */

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useBankTransfer } from "@/hooks/useBankTransfer";
import { BANK_TRANSFER_STATUS_LABELS, SAUDI_BANKS } from "@/types/wallet";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileSearch,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BankTransferList() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { transfers, isLoading } = useBankTransfer();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          icon: Clock,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: isRTL ? "قيد المراجعة" : "Submitted"
        };
      case "under_review":
        return {
          icon: FileSearch,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          label: isRTL ? "تحت المراجعة" : "Under Review"
        };
      case "approved":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          label: isRTL ? "مقبول" : "Approved"
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          label: isRTL ? "مرفوض" : "Rejected"
        };
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bg: "bg-muted/50",
          border: "border-border",
          label: status
        };
    }
  };

  const getBankName = (code: string) => {
    const bank = SAUDI_BANKS.find((b) => b.code === code);
    return bank ? (isRTL ? bank.name_ar : bank.name_en) : code;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-500" />
            </div>
            {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-500" />
            </div>
            {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Banknote className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-sm font-medium">
              {isRTL ? "لا توجد طلبات تحويل بنكي" : "No bank transfer requests"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? "ستظهر طلباتك هنا" : "Your requests will appear here"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-amber-500" />
          </div>
          {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transfers.map((transfer, index) => {
          const statusConfig = getStatusConfig(transfer.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="p-4 border border-border/50 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Bank Icon */}
                  <div className="h-12 w-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-sm shrink-0">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-lg text-foreground" dir="ltr">
                        {formatCurrency(transfer.amount)}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "gap-1",
                          statusConfig.bg,
                          statusConfig.color,
                          statusConfig.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{isRTL ? "البنك:" : "Bank:"}</span>{" "}
                      {getBankName(transfer.bank_name)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded inline-block" dir="ltr">
                      {transfer.reference_code}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-end text-xs text-muted-foreground shrink-0">
                  <p className="font-medium">
                    {format(new Date(transfer.created_at), "dd MMM yyyy", {
                      locale: isRTL ? ar : enUS,
                    })}
                  </p>
                  <p>
                    {format(new Date(transfer.created_at), "HH:mm", {
                      locale: isRTL ? ar : enUS,
                    })}
                  </p>
                </div>
              </div>

              {/* Rejection Reason */}
              {transfer.status === "rejected" && transfer.rejection_reason && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-600 mb-1">
                        {isRTL ? "سبب الرفض" : "Rejection Reason"}
                      </p>
                      <p className="text-red-600/80">{transfer.rejection_reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Approved Success */}
              {transfer.status === "approved" && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-green-600 font-medium">
                      {isRTL ? "تمت إضافة المبلغ إلى رصيدك" : "Amount added to your balance"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
