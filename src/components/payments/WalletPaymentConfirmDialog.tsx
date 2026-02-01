/**
 * Wallet Payment Confirmation Dialog
 * Shows confirmation before deducting from wallet balance
 */

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { Wallet, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletPaymentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  invoiceNumber: string;
  amount: number;
  currency: string;
  walletBalance: number;
  isProcessing?: boolean;
}

export function WalletPaymentConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  invoiceNumber,
  amount,
  currency,
  walletBalance,
  isProcessing = false,
}: WalletPaymentConfirmDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const newBalance = walletBalance - amount;
  const isInsufficientBalance = walletBalance < amount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isRTL ? "تأكيد الدفع من المحفظة" : "Confirm Wallet Payment"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRTL
              ? "سيتم خصم المبلغ التالي من رصيد محفظتك"
              : "The following amount will be deducted from your wallet balance"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Invoice Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isRTL ? "رقم الفاتورة" : "Invoice Number"}
              </span>
              <span className="font-mono font-medium">{invoiceNumber}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {isRTL ? "المبلغ المطلوب" : "Amount Due"}
              </span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(amount)}
              </span>
            </div>
          </div>

          {/* Balance Preview */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isRTL ? "الرصيد الحالي" : "Current Balance"}
              </span>
              <span className="font-bold text-green-600">
                {formatCurrency(walletBalance)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {isRTL ? "الرصيد بعد الدفع" : "Balance After Payment"}
              </span>
              <span className={cn(
                "font-bold",
                newBalance >= 0 ? "text-foreground" : "text-destructive"
              )}>
                {formatCurrency(Math.max(0, newBalance))}
              </span>
            </div>
          </div>

          {/* Warning if insufficient balance */}
          {isInsufficientBalance && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  {isRTL ? "رصيد غير كافٍ" : "Insufficient Balance"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL
                    ? `تحتاج ${formatCurrency(amount - walletBalance)} إضافية لإتمام الدفع`
                    : `You need additional ${formatCurrency(amount - walletBalance)} to complete payment`}
                </p>
              </div>
            </div>
          )}

          {/* Confirmation Notice */}
          {!isInsufficientBalance && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {isRTL
                  ? "هذه العملية لا يمكن التراجع عنها. تأكد من صحة المبلغ قبل المتابعة."
                  : "This action cannot be undone. Please verify the amount before proceeding."}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter className={cn("gap-2", isRTL && "flex-row-reverse")}>
          <AlertDialogCancel disabled={isProcessing}>
            {isRTL ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isInsufficientBalance || isProcessing}
            className="bg-primary hover:bg-primary/90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                {isRTL ? "جاري الدفع..." : "Processing..."}
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 me-2" />
                {isRTL ? "تأكيد الدفع" : "Confirm Payment"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
