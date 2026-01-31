/**
 * Customer Wallet Card Component
 * Displays wallet balance, customer UID, and recent transactions
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
  Loader2,
  TrendingUp,
  Receipt,
  Banknote,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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

  // Fetch wallet and transactions
  useEffect(() => {
    if (!user?.id) return;

    const fetchWalletData = async () => {
      setIsLoading(true);
      try {
        // Fetch customer UID
        const { data: profileData } = await supabase
          .from("profiles")
          .select("customer_uid")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.customer_uid) {
          setCustomerUid(profileData.customer_uid);
        }

        // Fetch or create wallet
        const { data: walletData, error: walletError } = await supabase
          .from("customer_wallets" as never)
          .select("*")
          .eq("customer_user_id", user.id)
          .maybeSingle();

        if (walletData) {
          setWallet(walletData as CustomerWallet);
        } else if (!walletError || walletError.code === "PGRST116") {
          // Create wallet if not exists
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

        // Fetch transactions
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

  // Copy UID to clipboard
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

  // Get transaction icon
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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {isRTL ? "مكتمل" : "Completed"}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {isRTL ? "قيد الانتظار" : "Pending"}
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            {isRTL ? "فشل" : "Failed"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      topup: { ar: "شحن رصيد", en: "Top Up" },
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل", en: "Adjustment" },
      transfer: { ar: "تحويل", en: "Transfer" },
      fee: { ar: "رسوم", en: "Fee" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isRTL ? "المحفظة الرقمية" : "Digital Wallet"}
          </CardTitle>
          <CardDescription>
            {isRTL ? "رصيدك ومعاملاتك المالية" : "Your balance and transactions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer UID Card */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">
                {isRTL ? "رقم العميل" : "Customer ID"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={copyUidToClipboard}
              >
                {copiedUid ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="font-mono text-lg font-bold tracking-wider text-primary">
              {customerUid || "---"}
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium block mb-1">
                  {isRTL ? "الرصيد المتاح" : "Available Balance"}
                </span>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(wallet?.balance || 0)}
                </div>
              </div>
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className={cn(
                "text-xs",
                wallet?.status === "active" 
                  ? "bg-green-500/10 text-green-600 border-green-500/30"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
              )}>
                {wallet?.status === "active" 
                  ? (isRTL ? "نشطة" : "Active")
                  : (isRTL ? "معلقة" : "Suspended")}
              </Badge>
              {wallet?.wallet_number && (
                <span className="text-xs text-muted-foreground font-mono">
                  {wallet.wallet_number}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Transactions */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {isRTL ? "آخر المعاملات" : "Recent Transactions"}
            </h4>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {isRTL ? "لا توجد معاملات بعد" : "No transactions yet"}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-3">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border">
                          {getTransactionIcon(tx.transaction_type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
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
                          {tx.transaction_type === "topup" || tx.transaction_type === "refund" ? "+" : "-"}
                          {formatCurrency(Number(tx.amount))}
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
