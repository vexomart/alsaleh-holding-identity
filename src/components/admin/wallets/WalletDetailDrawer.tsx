/**
 * Wallet Detail Drawer Component
 * Side drawer with full wallet details and transaction history
 */

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  X,
  Wallet,
  Mail,
  Phone,
  CreditCard,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  Banknote,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CustomerWallet, FinancialTransaction } from "@/types/financial";

interface CustomerWithWallet {
  id: string;
  customer_uid: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  wallet?: CustomerWallet;
}

interface WalletDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerWithWallet | null;
  transactions: FinancialTransaction[];
  isLoadingTransactions: boolean;
  language: string;
  onAddBalance: () => void;
  onDeductBalance: () => void;
}

export const WalletDetailDrawer = memo(function WalletDetailDrawer({
  isOpen,
  onClose,
  customer,
  transactions,
  isLoadingTransactions,
  language,
  onAddBalance,
  onDeductBalance,
}: WalletDetailDrawerProps) {
  const isRTL = language === "ar";

  if (!customer) return null;

  const displayName = customer.full_name || customer.email.split("@")[0];
  const balance = Number(customer.wallet?.balance || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatWalletNumber = (num: string) => {
    return num.replace(/(.{4})/g, "$1 ").trim();
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      topup: { ar: "شحن رصيد", en: "Top Up" },
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل إداري", en: "Adjustment" },
      transfer: { ar: "تحويل", en: "Transfer" },
      fee: { ar: "رسوم", en: "Fee" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup":
        return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
      case "invoice_payment":
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "adjustment":
        return <Banknote className="h-4 w-4 text-purple-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 text-xs">
            <CheckCircle2 className="h-3 w-3 me-1" />
            {isRTL ? "مكتمل" : "Completed"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-xs">
            <Clock className="h-3 w-3 me-1" />
            {isRTL ? "معلق" : "Pending"}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30 text-xs">
            <XCircle className="h-3 w-3 me-1" />
            {isRTL ? "فشل" : "Failed"}
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const isCredit = (type: string) => ["topup", "refund"].includes(type);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side={isRTL ? "left" : "right"} 
        className="w-full sm:max-w-lg p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 pb-4 border-b bg-muted/30">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-background shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-bold truncate">
                  {displayName}
                </SheetTitle>
                <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span dir="ltr">{customer.phone}</span>
                    </div>
                  )}
                  {customer.customer_uid && (
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{customer.customer_uid}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Wallet Info Card */}
          {customer.wallet && (
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <span className="font-medium">{isRTL ? "الرصيد الحالي" : "Current Balance"}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "bg-white/20 text-white border-white/30",
                    customer.wallet.status === "active" ? "" : "bg-blue-500/30"
                  )}
                >
                  {customer.wallet.status === "active" 
                    ? (isRTL ? "نشط" : "Active") 
                    : (isRTL ? "مجمد" : "Frozen")}
                </Badge>
              </div>
              
              <div className="text-3xl font-bold mb-2" dir="ltr">
                {formatCurrency(balance)}
              </div>
              
              {customer.wallet.wallet_number && (
                <div className="text-sm text-white/80 font-mono" dir="ltr">
                  {formatWalletNumber(customer.wallet.wallet_number)}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={onAddBalance}
                >
                  <Plus className="h-4 w-4 me-1" />
                  {isRTL ? "إضافة" : "Add"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={onDeductBalance}
                >
                  <Minus className="h-4 w-4 me-1" />
                  {isRTL ? "خصم" : "Deduct"}
                </Button>
              </div>
            </div>
          )}

          {/* Transactions */}
          <div className="flex-1 flex flex-col min-h-0 mt-4">
            <div className="px-4 pb-2">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {isRTL ? "سجل المعاملات" : "Transaction History"}
              </h3>
            </div>
            
            <ScrollArea className="flex-1 px-4">
              {isLoadingTransactions ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{isRTL ? "لا توجد معاملات" : "No transactions yet"}</p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-2 pb-4">
                    {transactions.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-xl border bg-card/50 hover:bg-card transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                            isCredit(tx.transaction_type) 
                              ? "bg-emerald-500/10" 
                              : "bg-red-500/10"
                          )}>
                            {getTransactionIcon(tx.transaction_type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm">
                                  {getTransactionTypeLabel(tx.transaction_type)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {formatDate(tx.created_at || "")}
                                </p>
                              </div>
                              <div className="text-end">
                                <p className={cn(
                                  "font-bold text-sm",
                                  isCredit(tx.transaction_type) 
                                    ? "text-emerald-600" 
                                    : "text-red-600"
                                )} dir="ltr">
                                  {isCredit(tx.transaction_type) ? "+" : "-"}
                                  {formatCurrency(Number(tx.amount))}
                                </p>
                                <div className="mt-1">
                                  {getStatusBadge(tx.status || "pending")}
                                </div>
                              </div>
                            </div>
                            {tx.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                                {isRTL ? tx.description_ar || tx.description : tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
