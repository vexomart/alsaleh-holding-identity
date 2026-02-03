/**
 * Enhanced Transaction List with Receipt Downloads
 * قائمة المعاملات المحسنة مع تحميل الإيصالات
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentReceiptDialog } from "./PaymentReceiptDialog";
import type { FinancialTransaction } from "@/types/financial";

interface TransactionListEnhancedProps {
  transactions: FinancialTransaction[];
  walletNumber: string;
  customerUid: string;
  isLoading?: boolean;
  newTransactionIds?: Set<string>;
}

const transactionConfig: Record<string, {
  icon: React.ElementType;
  label_ar: string;
  label_en: string;
  color: string;
  bgColor: string;
}> = {
  topup: {
    icon: ArrowDownLeft,
    label_ar: 'شحن رصيد',
    label_en: 'Top Up',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  invoice_payment: {
    icon: Receipt,
    label_ar: 'دفع فاتورة',
    label_en: 'Payment',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  refund: {
    icon: RefreshCw,
    label_ar: 'استرداد',
    label_en: 'Refund',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  withdrawal: {
    icon: ArrowUpRight,
    label_ar: 'سحب',
    label_en: 'Withdrawal',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  adjustment: {
    icon: FileText,
    label_ar: 'تعديل',
    label_en: 'Adjustment',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
  },
  transfer: {
    icon: ArrowUpRight,
    label_ar: 'تحويل',
    label_en: 'Transfer',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
};

const statusConfig: Record<string, {
  icon: React.ElementType;
  label_ar: string;
  label_en: string;
  color: string;
  bgColor: string;
}> = {
  succeeded: {
    icon: CheckCircle2,
    label_ar: 'مكتمل',
    label_en: 'Done',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
  },
  pending: {
    icon: Clock,
    label_ar: 'انتظار',
    label_en: 'Pending',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  processing: {
    icon: RefreshCw,
    label_ar: 'معالجة',
    label_en: 'Processing',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
  },
  failed: {
    icon: XCircle,
    label_ar: 'فشل',
    label_en: 'Failed',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/30',
  },
  refunded: {
    icon: RefreshCw,
    label_ar: 'مسترد',
    label_en: 'Refunded',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
};

export function TransactionListEnhanced({
  transactions,
  walletNumber,
  customerUid,
  isLoading,
  newTransactionIds = new Set(),
}: TransactionListEnhancedProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM", { locale: isRTL ? ar : enUS });
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "HH:mm", { locale: isRTL ? ar : enUS });
  };

  const handleViewReceipt = (tx: FinancialTransaction) => {
    setSelectedTransaction(tx);
    setShowReceipt(true);
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, tx) => {
    const date = format(new Date(tx.created_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, FinancialTransaction[]>);

  return (
    <>
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-primary" />
              </div>
              <span className="text-base">{isRTL ? "آخر المعاملات" : "Recent Transactions"}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {transactions.length} {isRTL ? "معاملة" : "transactions"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {Object.keys(groupedTransactions).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{isRTL ? "لا توجد معاملات" : "No transactions yet"}</p>
                <p className="text-xs mt-1">{isRTL ? "ستظهر معاملاتك هنا" : "Your transactions will appear here"}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {Object.entries(groupedTransactions).map(([date, txs]) => (
                  <div key={date}>
                    {/* Date Header */}
                    <div className="px-4 py-2 bg-muted/30 sticky top-0 z-10">
                      <p className="text-xs font-medium text-muted-foreground">
                        {format(new Date(date), "EEEE, dd MMMM yyyy", { locale: isRTL ? ar : enUS })}
                      </p>
                    </div>
                    
                    {/* Transactions */}
                    {txs.map((tx, index) => {
                      const config = transactionConfig[tx.transaction_type] || transactionConfig.adjustment;
                      const status = statusConfig[tx.status || 'pending'] || statusConfig.pending;
                      const Icon = config.icon;
                      const StatusIcon = status.icon;
                      const isCredit = ['topup', 'refund'].includes(tx.transaction_type);
                      const isNew = newTransactionIds.has(tx.id);

                      return (
                        <motion.div
                          key={tx.id}
                          initial={isNew ? { opacity: 0, x: isRTL ? -20 : 20 } : false}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            "px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors cursor-pointer group",
                            isNew && "bg-primary/5 animate-pulse"
                          )}
                          onClick={() => tx.status === 'succeeded' && handleViewReceipt(tx)}
                        >
                          {/* Left: Icon & Info */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", config.bgColor)}>
                              <Icon className={cn("h-5 w-5", config.color)} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">
                                  {isRTL ? config.label_ar : config.label_en}
                                </p>
                                <Badge variant="outline" className={cn("text-[10px] gap-1 px-1.5 py-0", status.bgColor)}>
                                  <StatusIcon className={cn("h-2.5 w-2.5", status.color)} />
                                  {isRTL ? status.label_ar : status.label_en}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {formatTime(tx.created_at)} • {tx.description_ar || tx.description || '-'}
                              </p>
                            </div>
                          </div>

                          {/* Right: Amount & Download */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn(
                              "font-bold text-sm whitespace-nowrap",
                              isCredit ? "text-emerald-600" : "text-red-600"
                            )} dir="ltr">
                              {isCredit ? "+" : "-"}{formatCurrency(tx.amount)} {tx.currency}
                            </span>
                            {tx.status === 'succeeded' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewReceipt(tx);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <PaymentReceiptDialog
        open={showReceipt}
        onOpenChange={setShowReceipt}
        transaction={selectedTransaction}
        walletNumber={walletNumber}
        customerUid={customerUid}
      />
    </>
  );
}
