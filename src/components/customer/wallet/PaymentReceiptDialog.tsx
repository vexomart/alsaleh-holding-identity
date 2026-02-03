/**
 * Payment Receipt Dialog - View and Download Transaction Receipt
 * إيصال الدفع - عرض وتحميل إيصال المعاملة
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Receipt,
  CheckCircle2,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  Wallet,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadPaymentReceiptPdf, type PaymentReceiptData } from "@/lib/wallet/payment-receipt-template";
import { toast } from "@/hooks/use-toast";
import type { FinancialTransaction } from "@/types/financial";

interface PaymentReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: FinancialTransaction | null;
  walletNumber: string;
  customerUid: string;
}

const transactionTypeConfig: Record<string, { ar: string; en: string; icon: React.ElementType; color: string }> = {
  topup: { ar: 'شحن رصيد', en: 'Top Up', icon: ArrowDownLeft, color: 'text-green-500' },
  invoice_payment: { ar: 'دفع فاتورة', en: 'Invoice Payment', icon: Receipt, color: 'text-blue-500' },
  withdrawal: { ar: 'سحب', en: 'Withdrawal', icon: ArrowUpRight, color: 'text-red-500' },
  refund: { ar: 'استرداد', en: 'Refund', icon: ArrowDownLeft, color: 'text-amber-500' },
  transfer: { ar: 'تحويل', en: 'Transfer', icon: ArrowUpRight, color: 'text-purple-500' },
  adjustment: { ar: 'تعديل', en: 'Adjustment', icon: FileText, color: 'text-gray-500' },
};

export function PaymentReceiptDialog({
  open,
  onOpenChange,
  transaction,
  walletNumber,
  customerUid,
}: PaymentReceiptDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { profile } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!transaction) return null;

  const config = transactionTypeConfig[transaction.transaction_type] || transactionTypeConfig.adjustment;
  const Icon = config.icon;
  const isCredit = ['topup', 'refund'].includes(transaction.transaction_type);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const metadata = transaction.metadata as Record<string, unknown> | null;
      const previousBalance = (metadata?.previous_balance as number) || 0;
      const newBalance = (metadata?.new_balance as number) || (previousBalance + (isCredit ? transaction.amount : -transaction.amount));

      const receiptData: PaymentReceiptData = {
        receiptNumber: `RCP-${transaction.id.slice(0, 8).toUpperCase()}`,
        issueDate: transaction.created_at,
        transactionType: transaction.transaction_type as PaymentReceiptData['transactionType'],
        amount: transaction.amount,
        currency: transaction.currency,
        walletNumber: walletNumber,
        previousBalance: previousBalance,
        newBalance: newBalance,
        customerName: profile?.full_name || profile?.full_name_ar || 'العميل',
        customerUid: customerUid,
        description: isRTL ? (transaction.description_ar || transaction.description) : (transaction.description || transaction.description_ar),
        referenceNumber: transaction.provider_reference || undefined,
        paymentMethod: transaction.provider || undefined,
      };

      await downloadPaymentReceiptPdf(receiptData);
      toast({
        title: isRTL ? "تم التحميل" : "Downloaded",
        description: isRTL ? "تم تحميل الإيصال بنجاح" : "Receipt downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل تحميل الإيصال" : "Failed to download receipt",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            {isRTL ? "إيصال المعاملة" : "Transaction Receipt"}
          </DialogTitle>
        </DialogHeader>

        {/* Receipt Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl p-6 space-y-6"
        >
          {/* Success Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className="gap-2 bg-green-500/10 text-green-600 border-green-500/30 px-4 py-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isRTL ? "معاملة ناجحة" : "Successful Transaction"}
            </Badge>
          </div>

          {/* Amount */}
          <div className="text-center space-y-2">
            <div className={cn(
              "flex items-center justify-center gap-2",
              config.color
            )}>
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">
                {isRTL ? config.ar : config.en}
              </span>
            </div>
            <p className={cn(
              "text-4xl font-bold",
              isCredit ? "text-green-600" : "text-red-600"
            )} dir="ltr">
              {isCredit ? "+" : "-"}{formatCurrency(transaction.amount)} {transaction.currency}
            </p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="space-y-4">
            <DetailRow
              icon={FileText}
              label={isRTL ? "رقم الإيصال" : "Receipt #"}
              value={`RCP-${transaction.id.slice(0, 8).toUpperCase()}`}
              isRTL={isRTL}
              mono
            />
            <DetailRow
              icon={Calendar}
              label={isRTL ? "التاريخ" : "Date"}
              value={formatDate(transaction.created_at)}
              isRTL={isRTL}
            />
            <DetailRow
              icon={Clock}
              label={isRTL ? "الوقت" : "Time"}
              value={formatTime(transaction.created_at)}
              isRTL={isRTL}
            />
            <DetailRow
              icon={Wallet}
              label={isRTL ? "رقم المحفظة" : "Wallet #"}
              value={walletNumber.replace(/(.{4})/g, '$1 ').trim()}
              isRTL={isRTL}
              mono
            />
            <DetailRow
              icon={User}
              label={isRTL ? "رقم العميل" : "Customer ID"}
              value={customerUid}
              isRTL={isRTL}
              mono
            />
            {transaction.provider_reference && (
              <DetailRow
                icon={Receipt}
                label={isRTL ? "رقم المرجع" : "Reference"}
                value={transaction.provider_reference}
                isRTL={isRTL}
                mono
              />
            )}
          </div>

          {/* Description */}
          {(transaction.description || transaction.description_ar) && (
            <>
              <Separator />
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {isRTL ? "الوصف" : "Description"}
                </p>
                <p className="text-sm">
                  {isRTL 
                    ? (transaction.description_ar || transaction.description) 
                    : (transaction.description || transaction.description_ar)
                  }
                </p>
              </div>
            </>
          )}
        </motion.div>

        {/* Download Button */}
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full h-12 gap-2 text-base font-semibold"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {isRTL ? "جاري التحميل..." : "Downloading..."}
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              {isRTL ? "تحميل الإيصال PDF" : "Download Receipt PDF"}
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isRTL,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isRTL: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-semibold",
        mono && "font-mono text-xs bg-background px-2 py-1 rounded"
      )} dir={mono ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
