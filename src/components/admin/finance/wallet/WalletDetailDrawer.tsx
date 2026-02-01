/**
 * Wallet Detail Drawer - Premium Banking Design
 * Slide-out panel with full customer wallet details
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wallet,
  User,
  Mail,
  Phone,
  Copy,
  Check,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  AlertTriangle,
  Loader2,
  History,
  Shield,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  customer: CustomerWithWallet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

export function WalletDetailDrawer({
  customer,
  open,
  onOpenChange,
  onRefresh,
}: WalletDetailDrawerProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  
  // Adjustment dialog
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustType, setAdjustType] = useState<"add" | "deduct">("add");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  // Fetch transactions
  useEffect(() => {
    if (open && customer?.id) {
      fetchTransactions();
    }
  }, [open, customer?.id]);

  const fetchTransactions = async () => {
    if (!customer?.id) return;
    setIsLoadingTx(true);
    try {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .eq("customer_user_id", customer.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions((data || []) as FinancialTransaction[]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTx(false);
    }
  };

  const copyUid = async () => {
    if (!customer?.customer_uid) return;
    try {
      await navigator.clipboard.writeText(customer.customer_uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleAdjustment = async () => {
    if (!customer?.wallet || !adjustAmount || !adjustReason) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "المبلغ غير صحيح" : "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    if (adjustType === "deduct" && amount > Number(customer.wallet.balance)) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "المبلغ أكبر من الرصيد المتاح" : "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    setIsAdjusting(true);
    try {
      const newBalance =
        adjustType === "add"
          ? Number(customer.wallet.balance) + amount
          : Number(customer.wallet.balance) - amount;

      // Update wallet
      const { error: walletError } = await supabase
        .from("customer_wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("id", customer.wallet.id);

      if (walletError) throw walletError;

      // Create transaction
      const { error: txError } = await supabase
        .from("financial_transactions")
        .insert({
          customer_user_id: customer.id,
          wallet_id: customer.wallet.id,
          transaction_type: "adjustment",
          amount: amount,
          currency: "SAR",
          status: "succeeded",
          description: adjustReason,
          description_ar: adjustReason,
          processed_at: new Date().toISOString(),
          metadata: { adjustment_type: adjustType, performed_by: "admin" },
        });

      if (txError) throw txError;

      toast({
        title: isRTL ? "تم التعديل بنجاح" : "Adjustment Successful",
        description: isRTL
          ? `تم ${adjustType === "add" ? "إضافة" : "خصم"} ${formatCurrency(amount)}`
          : `${adjustType === "add" ? "Added" : "Deducted"} ${formatCurrency(amount)}`,
      });

      setShowAdjustDialog(false);
      setAdjustAmount("");
      setAdjustReason("");
      onRefresh();
      fetchTransactions();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تعديل الرصيد" : "Failed to adjust balance",
        variant: "destructive",
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  const createWallet = async () => {
    if (!customer) return;
    try {
      const { error } = await supabase
        .from("customer_wallets" as never)
        .insert({
          customer_user_id: customer.id,
          balance: 0,
          currency: "SAR",
          status: "active",
        } as never);

      if (error) throw error;

      toast({
        title: isRTL ? "تم الإنشاء" : "Created",
        description: isRTL ? "تم إنشاء المحفظة بنجاح" : "Wallet created successfully",
      });

      onRefresh();
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في إنشاء المحفظة" : "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      topup: <ArrowDownLeft className="h-4 w-4 text-emerald-500" />,
      invoice_payment: <Receipt className="h-4 w-4 text-blue-500" />,
      refund: <RefreshCw className="h-4 w-4 text-amber-500" />,
      withdrawal: <ArrowUpRight className="h-4 w-4 text-red-500" />,
      adjustment: <TrendingUp className="h-4 w-4 text-violet-500" />,
    };
    return icons[type] || <Banknote className="h-4 w-4 text-muted-foreground" />;
  };

  const getTransactionLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      topup: { ar: "شحن رصيد", en: "Top Up" },
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل إداري", en: "Adjustment" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: React.ReactNode; label: { ar: string; en: string }; className: string }> = {
      succeeded: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        label: { ar: "مكتمل", en: "Completed" },
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      },
      pending: {
        icon: <Clock className="h-3 w-3" />,
        label: { ar: "قيد الانتظار", en: "Pending" },
        className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      },
      failed: {
        icon: <XCircle className="h-3 w-3" />,
        label: { ar: "فشل", en: "Failed" },
        className: "bg-red-500/10 text-red-600 border-red-500/30",
      },
    };
    const config = configs[status] || { icon: null, label: { ar: status, en: status }, className: "" };
    return (
      <Badge variant="outline" className={config.className}>
        {config.icon}
        <span className="ms-1">{config.label[isRTL ? "ar" : "en"]}</span>
      </Badge>
    );
  };

  if (!customer) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={isRTL ? "left" : "right"}
          className="w-full sm:max-w-xl p-0 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
              <SheetHeader className="relative">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-xl text-white truncate">
                      {customer.full_name || (isRTL ? "عميل" : "Customer")}
                    </SheetTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-white/70 truncate">{customer.email}</span>
                    </div>
                    {customer.customer_uid && (
                      <button
                        onClick={copyUid}
                        className="flex items-center gap-2 mt-2 text-xs bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <span className="font-mono">{customer.customer_uid}</span>
                        {copiedUid ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </SheetHeader>

              {/* Balance card */}
              {customer.wallet && (
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">
                        {isRTL ? "الرصيد المتاح" : "Available Balance"}
                      </p>
                      <p className="text-3xl font-bold mt-1" dir="ltr">
                        {formatCurrency(Number(customer.wallet.balance))}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-white/30",
                          customer.wallet.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        )}
                      >
                        {customer.wallet.status === "active"
                          ? (isRTL ? "نشطة" : "Active")
                          : (isRTL ? "مجمدة" : "Frozen")}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-white/50 mt-2 font-mono" dir="ltr">
                    {customer.wallet.wallet_number}
                  </p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!customer.wallet ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Wallet className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {isRTL ? "لا توجد محفظة" : "No Wallet"}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {isRTL
                      ? "هذا العميل لا يملك محفظة بعد"
                      : "This customer doesn't have a wallet yet"}
                  </p>
                  <Button onClick={createWallet} className="mt-6 gap-2">
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إنشاء محفظة" : "Create Wallet"}
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="transactions" className="h-full flex flex-col">
                  <div className="px-6 pt-4">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="transactions" className="gap-2">
                        <History className="h-4 w-4" />
                        {isRTL ? "المعاملات" : "Transactions"}
                      </TabsTrigger>
                      <TabsTrigger value="actions" className="gap-2">
                        <Shield className="h-4 w-4" />
                        {isRTL ? "إجراءات" : "Actions"}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="transactions" className="flex-1 overflow-hidden px-6 pb-6">
                    <ScrollArea className="h-full">
                      {isLoadingTx ? (
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                          ))}
                        </div>
                      ) : transactions.length === 0 ? (
                        <div className="text-center py-12">
                          <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground">
                            {isRTL ? "لا توجد معاملات" : "No transactions"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {transactions.map((tx, index) => (
                            <motion.div
                              key={tx.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border">
                                {getTransactionIcon(tx.transaction_type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-medium text-sm truncate">
                                    {getTransactionLabel(tx.transaction_type)}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-sm font-bold whitespace-nowrap",
                                      tx.transaction_type === "topup" ||
                                        tx.transaction_type === "refund"
                                        ? "text-emerald-600"
                                        : "text-foreground"
                                    )}
                                    dir="ltr"
                                  >
                                    {tx.transaction_type === "topup" ||
                                    tx.transaction_type === "refund"
                                      ? "+"
                                      : "-"}
                                    {formatCurrency(Number(tx.amount))}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(tx.created_at)}
                                  </span>
                                  {getStatusBadge(tx.status)}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="actions" className="flex-1 px-6 pb-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        {isRTL ? "إجراءات الرصيد" : "Balance Actions"}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                          onClick={() => {
                            setAdjustType("add");
                            setShowAdjustDialog(true);
                          }}
                        >
                          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Plus className="h-5 w-5 text-emerald-500" />
                          </div>
                          <span className="text-sm font-medium">
                            {isRTL ? "إضافة رصيد" : "Add Balance"}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto py-4 flex flex-col items-center gap-2 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
                          onClick={() => {
                            setAdjustType("deduct");
                            setShowAdjustDialog(true);
                          }}
                        >
                          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                            <Minus className="h-5 w-5 text-red-500" />
                          </div>
                          <span className="text-sm font-medium">
                            {isRTL ? "خصم رصيد" : "Deduct Balance"}
                          </span>
                        </Button>
                      </div>

                      <Separator className="my-4" />

                      <h4 className="text-sm font-semibold text-muted-foreground">
                        {isRTL ? "إدارة المحفظة" : "Wallet Management"}
                      </h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 h-12"
                          disabled={customer.wallet?.status === "frozen"}
                        >
                          <Lock className="h-4 w-4 text-amber-500" />
                          <span>{isRTL ? "تجميد المحفظة" : "Freeze Wallet"}</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 h-12"
                          disabled={customer.wallet?.status === "active"}
                        >
                          <Unlock className="h-4 w-4 text-emerald-500" />
                          <span>{isRTL ? "إلغاء التجميد" : "Unfreeze Wallet"}</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {adjustType === "add" ? (
                <Plus className="h-5 w-5 text-emerald-500" />
              ) : (
                <Minus className="h-5 w-5 text-red-500" />
              )}
              {isRTL
                ? adjustType === "add" ? "إضافة رصيد" : "خصم رصيد"
                : adjustType === "add" ? "Add Balance" : "Deduct Balance"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? `تعديل رصيد المحفظة للعميل: ${customer.full_name || customer.email}`
                : `Adjust wallet balance for: ${customer.full_name || customer.email}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <span className="text-sm text-muted-foreground">
                {isRTL ? "الرصيد الحالي" : "Current Balance"}
              </span>
              <p className="text-2xl font-bold mt-1" dir="ltr">
                {formatCurrency(Number(customer?.wallet?.balance || 0))}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "المبلغ" : "Amount"}</Label>
              <Input
                type="number"
                placeholder={isRTL ? "أدخل المبلغ" : "Enter amount"}
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                min="0"
                step="0.01"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "السبب" : "Reason"}</Label>
              <Textarea
                placeholder={isRTL ? "سبب التعديل..." : "Reason for adjustment..."}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                rows={3}
              />
            </div>
            {adjustAmount && (
              <div className={cn(
                "rounded-lg p-4 border",
                adjustType === "add"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              )}>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "الرصيد الجديد" : "New Balance"}
                </span>
                <p className={cn(
                  "text-xl font-bold mt-1",
                  adjustType === "add" ? "text-emerald-600" : "text-red-600"
                )} dir="ltr">
                  {formatCurrency(
                    adjustType === "add"
                      ? Number(customer?.wallet?.balance || 0) + Number(adjustAmount || 0)
                      : Number(customer?.wallet?.balance || 0) - Number(adjustAmount || 0)
                  )}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustDialog(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAdjustment}
              disabled={isAdjusting || !adjustAmount || !adjustReason}
              className={adjustType === "add" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isAdjusting && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
              {isRTL
                ? adjustType === "add" ? "إضافة" : "خصم"
                : adjustType === "add" ? "Add" : "Deduct"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
