/**
 * Customer Bank Transfer Request List
 */

import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useBankTransfer } from "@/hooks/useBankTransfer";
import { BANK_TRANSFER_STATUS_LABELS, SAUDI_BANKS } from "@/types/wallet";
import { Building2, Clock, CheckCircle2, XCircle, FileSearch } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function BankTransferList() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { transfers, isLoading } = useBankTransfer();

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{isRTL ? "لا توجد طلبات تحويل بنكي" : "No bank transfer requests"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {isRTL ? "طلبات التحويل البنكي" : "Bank Transfer Requests"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {transfer.amount.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                  </span>
                  <Badge variant={getStatusVariant(transfer.status)}>
                    {getStatusIcon(transfer.status)}
                    <span className="ms-1">
                      {BANK_TRANSFER_STATUS_LABELS[transfer.status as keyof typeof BANK_TRANSFER_STATUS_LABELS]?.[isRTL ? "ar" : "en"] || transfer.status}
                    </span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "البنك:" : "Bank:"} {getBankName(transfer.bank_name)}
                </p>
                <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                  {transfer.reference_code}
                </p>
              </div>
              <div className="text-end text-sm text-muted-foreground">
                <p>
                  {format(new Date(transfer.created_at), "PPp", {
                    locale: isRTL ? ar : enUS,
                  })}
                </p>
              </div>
            </div>
            {transfer.status === "rejected" && transfer.rejection_reason && (
              <div className="mt-3 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                <strong>{isRTL ? "سبب الرفض:" : "Rejection Reason:"}</strong>{" "}
                {transfer.rejection_reason}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
