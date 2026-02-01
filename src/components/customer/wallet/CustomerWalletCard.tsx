/**
 * Customer Wallet Card Component - Premium Bank-Grade Design
 * Displays wallet balance, customer UID, and recent transactions
 * Modern glassmorphism with RTL support
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useWalletRealtime } from "@/hooks/useWalletRealtime";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Receipt,
  Banknote,
  Plus,
  Wifi,
  WifiOff,
  Fingerprint,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { WalletTopupDialog } from "./WalletTopupDialog";
import type { CustomerWallet, FinancialTransaction } from "@/types/financial";

interface CustomerWalletCardProps {
  className?: string;
}

export function CustomerWalletCard({ className }: CustomerWalletCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();

  const [wallet, setWallet] = useState<CustomerWallet | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [customerUid, setCustomerUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUid, setCopiedUid] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Realtime updates for wallet
  const { isConnected, lastWalletEvent, lastTransactionEvent } = useWalletRealtime({
    userId: user?.id,
    tenantId: profile?.tenant_id || undefined,
    enabled: !!user?.id,
    onWalletUpdated: (event) => {
      if (wallet && event.balance !== undefined) {
        setWallet(prev => prev ? { ...prev, balance: event.balance! } : prev);
        toast({
          title: isRTL ? "تم تحديث الرصيد" : "Balance Updated",
          description: isRTL 
            ? `الرصيد الجديد: ${event.balance?.toLocaleString('ar-SA')} ر.س`
            : `New balance: ${event.balance?.toLocaleString('en-US')} SAR`,
        });
      }
    },
    onTransactionCreated: () => {
      fetchTransactions();
    },
  });

  const fetchTransactions = async () => {
    if (!user?.id) return;
    const { data: transData } = await supabase
      .from("financial_transactions" as never)
      .select("*")
      .eq("customer_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (transData) {
      setTransactions(transData as FinancialTransaction[]);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchWalletData = async () => {
      setIsLoading(true);
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("customer_uid")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.customer_uid) {
          setCustomerUid(profileData.customer_uid);
        }

        const { data: walletData, error: walletError } = await supabase
          .from("customer_wallets" as never)
          .select("*")
          .eq("customer_user_id", user.id)
          .maybeSingle();

        if (walletData) {
          setWallet(walletData as CustomerWallet);
        } else if (!walletError || walletError.code === "PGRST116") {
          const { data: newWallet } = await supabase
            .from("customer_wallets" as never)
            .insert({
              customer_user_id: user.id,
              tenant_id: profile?.tenant_id || null,
              balance: 0,
              currency: "SAR",
              status: "active",
            } as never)
            .select()
            .maybeSingle();

          if (newWallet) {
            setWallet(newWallet as CustomerWallet);
          }
        }

        const { data: transData } = await supabase
          .from("financial_transactions" as never)
          .select("*")
          .eq("customer_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (transData) {
          setTransactions(transData as FinancialTransaction[]);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user?.id, profile?.tenant_id]);

  const copyUidToClipboard = async () => {
    if (!customerUid) return;
    try {
      await navigator.clipboard.writeText(customerUid);
      setCopiedUid(true);
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? "تم نسخ رقم العميل" : "Customer ID copied",
      });
      setTimeout(() => setCopiedUid(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "topup":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "invoice_payment":
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
            <CheckCircle2 className="h-3 w-3 me-1" />
            {isRTL ? "مكتمل" : "Done"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
            <Clock className="h-3 w-3 me-1" />
            {isRTL ? "انتظار" : "Pending"}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 text-xs">
            <XCircle className="h-3 w-3 me-1" />
            {isRTL ? "فشل" : "Failed"}
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      topup: { ar: "شحن رصيد", en: "Top Up" },
      invoice_payment: { ar: "دفع فاتورة", en: "Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل", en: "Adjustment" },
      transfer: { ar: "تحويل", en: "Transfer" },
      fee: { ar: "رسوم", en: "Fee" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Wallet Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Balance Card - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 md:p-8 relative">
              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">
                        {isRTL ? "الرصيد المتاح" : "Available Balance"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => setShowBalance(!showBalance)}
                        >
                          {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection status */}
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm",
                    isConnected ? "bg-white/20" : "bg-red-500/30"
                  )}>
                    {isConnected ? (
                      <Wifi className="h-3.5 w-3.5" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5" />
                    )}
                    <span className="text-xs font-medium">
                      {isConnected 
                        ? (isRTL ? "مباشر" : "Live") 
                        : (isRTL ? "غير متصل" : "Offline")}
                    </span>
                  </div>
                </div>

                {/* Balance Amount */}
                <div className="mb-6">
                  <div className="text-4xl md:text-5xl font-bold tracking-tight">
                    {showBalance ? formatCurrency(wallet?.balance || 0) : "••••••"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <WalletTopupDialog>
                    <Button 
                      className="gap-2 bg-white text-green-600 hover:bg-white/90 shadow-lg"
                    >
                      <Plus className="h-4 w-4" />
                      {isRTL ? "شحن الرصيد" : "Top Up"}
                    </Button>
                  </WalletTopupDialog>
                  
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "border-white/30 text-white bg-white/10",
                      wallet?.status === "active" ? "" : "bg-amber-500/30 border-amber-500/50"
                    )}
                  >
                    <Sparkles className="h-3 w-3 me-1" />
                    {wallet?.status === "active" 
                      ? (isRTL ? "نشطة" : "Active")
                      : (isRTL ? "معلقة" : "Suspended")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer ID & Wallet Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer ID */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Fingerprint className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? "رقم العميل" : "Customer ID"}
                      </p>
                      <p className="font-mono font-bold text-foreground tracking-wider">
                        {customerUid || "---"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={copyUidToClipboard}
                  >
                    {copiedUid ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Wallet Number */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? "رقم المحفظة" : "Wallet Number"}
                      </p>
                      <p className="font-mono font-medium text-foreground text-sm">
                        {wallet?.wallet_number || "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transactions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="lg:col-span-1"
      >
        <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-blue-500" />
              </div>
              {isRTL ? "آخر المعاملات" : "Recent Transactions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm font-medium">
                  {isRTL ? "لا توجد معاملات بعد" : "No transactions yet"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL ? "ستظهر معاملاتك هنا" : "Your transactions will appear here"}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[380px]">
                <div className="space-y-2 pe-2">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border/50 shadow-sm">
                          {getTransactionIcon(tx.transaction_type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {getTransactionTypeLabel(tx.transaction_type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className={cn(
                          "text-sm font-bold",
                          tx.transaction_type === "topup" || tx.transaction_type === "refund"
                            ? "text-green-600"
                            : "text-foreground"
                        )}>
                          <span dir="ltr">
                            {tx.transaction_type === "topup" || tx.transaction_type === "refund" ? "+" : "-"}
                            {formatCurrency(Number(tx.amount))}
                          </span>
                        </p>
                        <div className="flex justify-end mt-1">
                          {getStatusBadge(tx.status)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
