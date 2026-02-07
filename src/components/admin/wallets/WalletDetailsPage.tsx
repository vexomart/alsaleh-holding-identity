/**
 * Admin Wallet Details Page
 * Comprehensive wallet management for a single customer
 */

import { useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowLeft,
  Wallet,
  User,
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
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  History,
  Sparkles,
  Building2,
  Activity,
  FileText,
  ShoppingCart,
} from "lucide-react";
import type { CustomerWallet, FinancialTransaction } from "@/types/financial";

// Import adjustment dialog
import { WalletAdjustmentDialog } from "./WalletAdjustmentDialog";

export function WalletDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();

  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");

  // Fetch customer data with wallet and transactions
  const { data: customerData, isLoading, refetch } = useQuery({
    queryKey: ["admin-wallet-details", id],
    queryFn: async () => {
      if (!id) throw new Error("No customer ID");

      const [profileRes, walletRes, transactionsRes, ordersRes, invoicesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("customer_wallets").select("*").eq("customer_user_id", id).maybeSingle(),
        supabase.from("financial_transactions").select("*").eq("customer_user_id", id).order("created_at", { ascending: false }).limit(100),
        supabase.from("orders").select("id, order_number, status, total_amount, created_at").eq("customer_id", id).order("created_at", { ascending: false }).limit(10),
        supabase.from("invoices").select("id, invoice_number, status, total, created_at").eq("customer_id", id).order("created_at", { ascending: false }).limit(10),
      ]);

      return {
        profile: profileRes.data,
        wallet: walletRes.data as CustomerWallet | null,
        transactions: (transactionsRes.data || []) as FinancialTransaction[],
        orders: ordersRes.data || [],
        invoices: invoicesRes.data || [],
      };
    },
    enabled: !!id,
  });

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async () => {
      const walletNumber = '4' + Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
      
      const { error } = await supabase
        .from("customer_wallets")
        .insert({
          customer_user_id: id,
          wallet_number: walletNumber,
          balance: 0,
          currency: "SAR",
          status: "active",
        } as any);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(isRTL ? "تم إنشاء المحفظة بنجاح" : "Wallet created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-wallet-details", id] });
    },
    onError: () => {
      toast.error(isRTL ? "فشل في إنشاء المحفظة" : "Failed to create wallet");
    },
  });

  // Handle adjustment with real-time notifications
  const handleAdjustmentSubmit = async (amount: number, reason: string) => {
    if (!customerData?.wallet) return;

    const newBalance =
      adjustmentType === "add"
        ? Number(customerData.wallet.balance) + amount
        : Number(customerData.wallet.balance) - amount;

    // Update wallet balance
    const { error: walletError } = await supabase
      .from("customer_wallets")
      .update({ balance: newBalance } as any)
      .eq("id", customerData.wallet.id);

    if (walletError) throw walletError;

    // Insert transaction record
    const { error: txError } = await supabase
      .from("financial_transactions")
      .insert({
        customer_user_id: id,
        wallet_id: customerData.wallet.id,
        transaction_type: "adjustment",
        amount: amount,
        currency: "SAR",
        status: "succeeded",
        description: reason,
        description_ar: reason,
        processed_at: new Date().toISOString(),
        metadata: { adjustment_type: adjustmentType, performed_by: "admin" },
      } as any);

    if (txError) throw txError;

    // ⚡⚡⚡ INSTANT SMS - MUST RUN IMMEDIATELY ⚡⚡⚡
    const customerPhone = customerData.profile?.phone;
    const customerEmail = customerData.profile?.email;
    const customerName = customerData.profile?.full_name || "عميلنا الكريم";

    // Format date and time for banking SMS
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-SA", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit" 
    });
    const timeStr = now.toLocaleTimeString("ar-SA", { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: true 
    });
    const operationType = adjustmentType === "add" 
      ? "إيداع نقدي - تعديل إداري" 
      : "خصم إداري";

    console.log("🔔 Starting SMS dispatch...", { customerPhone, adjustmentType, amount, newBalance });

    if (customerPhone) {
      const messageType = adjustmentType === "add" ? "wallet_topup" : "wallet_withdrawal";
      
      console.log("📤 SENDING SMS NOW to:", customerPhone);
      
      // Use Supabase SDK - guaranteed to work
      const { data: smsData, error: smsError } = await supabase.functions.invoke("sms-send-notification", {
        body: {
          phone: customerPhone,
          message_type: messageType,
          template_data: {
            amount: amount.toLocaleString("ar-SA"),
            balance: newBalance.toLocaleString("ar-SA"),
            date: dateStr,
            time: timeStr,
            operation_type: operationType,
          },
        },
      });
      
      console.log("📱 SMS Result:", { smsData, smsError });
      
      if (smsError) {
        console.error("❌ SMS Error:", smsError);
        toast.error(isRTL ? "فشل إرسال SMS" : "SMS failed");
      } else if (smsData?.success) {
        console.log("✅ SMS SENT SUCCESSFULLY!");
        toast.success(isRTL ? "📱 تم إرسال إشعار SMS للعميل" : "📱 SMS sent");
      } else {
        console.warn("⚠️ SMS response:", smsData);
      }
    } else {
      console.warn("⚠️ No phone number - SMS skipped");
    }

    // Email Notification - send in background (less critical)
    if (customerEmail && !customerEmail.endsWith("@ash.local")) {
      supabase.functions.invoke("wallet-email-notifications", {
        body: {
          type: adjustmentType === "add" ? "deposit" : "withdrawal",
          customer_email: customerEmail,
          customer_name: customerName,
          amount: amount,
          newBalance: newBalance,
          transactionId: `ADJ-${Date.now()}`,
        },
      }).then(res => {
        console.log("✅ Email notification sent:", res);
      }).catch(err => {
        console.error("❌ Email notification failed:", err);
      });
    }

    toast.success(
      isRTL
        ? `تم ${adjustmentType === "add" ? "إضافة" : "خصم"} ${amount} ر.س بنجاح`
        : `Successfully ${adjustmentType === "add" ? "added" : "deducted"} ${amount} SAR`
    );

    queryClient.invalidateQueries({ queryKey: ["admin-wallet-details", id] });
  };

  // Formatters
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
      case "topup": return <ArrowDownLeft className="h-4 w-4 text-accent" />;
      case "invoice_payment": return <Receipt className="h-4 w-4 text-primary" />;
      case "refund": return <RefreshCw className="h-4 w-4 text-secondary" />;
      case "withdrawal": return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case "adjustment": return <Banknote className="h-4 w-4 text-primary" />;
      default: return <CreditCard className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const isCredit = (type: string) => ["topup", "refund"].includes(type);

  // Filter transactions
  const filteredTransactions = customerData?.transactions.filter((tx) => {
    const matchesFilter = transactionFilter === "all" || tx.transaction_type === transactionFilter;
    const matchesSearch = !searchQuery || 
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description_ar?.includes(searchQuery);
    return matchesFilter && matchesSearch;
  }) || [];

  // Calculate stats
  const stats = {
    totalDeposits: customerData?.transactions.filter(t => isCredit(t.transaction_type) && t.status === "succeeded").reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    totalSpent: customerData?.transactions.filter(t => !isCredit(t.transaction_type) && t.status === "succeeded").reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    transactionCount: customerData?.transactions.length || 0,
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <div className="space-y-6 p-1">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!customerData?.profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <XCircle className="h-16 w-16 text-destructive/50" />
        <h2 className="text-xl font-semibold">{isRTL ? "العميل غير موجود" : "Customer not found"}</h2>
        <Button variant="outline" onClick={() => navigate("/admin/wallets")}>
          <BackIcon className="h-4 w-4 me-2" />
          {isRTL ? "العودة للمحافظ" : "Back to Wallets"}
        </Button>
      </div>
    );
  }

  const { profile, wallet, transactions, orders, invoices } = customerData;
  const displayName = profile.full_name || profile.email.split("@")[0];
  const balance = Number(wallet?.balance || 0);

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => navigate("/admin/wallets")}
          >
            <BackIcon className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-14 w-14 ring-2 ring-background shadow-xl">
            <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white text-xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {displayName}
              <Sparkles className="h-5 w-5 text-secondary" />
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              {profile.customer_uid && (
                <Badge variant="outline" className="font-mono text-xs">
                  {profile.customer_uid}
                </Badge>
              )}
              {wallet && (
                <Badge 
                  variant="secondary"
                  className={cn(
                    wallet.status === "active" 
                      ? "bg-accent/20 text-accent" 
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {wallet.status === "active" ? (isRTL ? "نشط" : "Active") : (isRTL ? "مجمد" : "Frozen")}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => navigate(`/admin/clients/${id}`)}
          >
            <User className="h-4 w-4 me-2" />
            {isRTL ? "ملف العميل الكامل" : "Full Client Profile"}
            <ExternalLink className="h-3 w-3 ms-2" />
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Wallet & Stats */}
        <div className="space-y-6 lg:col-span-2">
          {/* Wallet Card */}
          {wallet ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="bg-gradient-to-br from-accent to-accent/80 p-6 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        {isRTL ? "الرصيد الحالي" : "Current Balance"}
                      </p>
                      <p className="text-4xl font-bold mt-1" dir="ltr">
                        {formatCurrency(balance)}
                      </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Wallet className="h-7 w-7" />
                    </div>
                  </div>
                  
                  {wallet.wallet_number && (
                    <div className="font-mono text-lg text-white/90 mb-4" dir="ltr">
                      {formatWalletNumber(wallet.wallet_number)}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                      onClick={() => {
                        setAdjustmentType("add");
                        setIsAdjustmentDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 me-2" />
                      {isRTL ? "إضافة رصيد" : "Add Balance"}
                    </Button>
                    <Button
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                      onClick={() => {
                        setAdjustmentType("deduct");
                        setIsAdjustmentDialogOpen(true);
                      }}
                    >
                      <Minus className="h-4 w-4 me-2" />
                      {isRTL ? "خصم رصيد" : "Deduct Balance"}
                    </Button>
                  </div>
                </div>

                {/* Stats Row */}
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-accent" />
                      <p className="text-lg font-bold" dir="ltr">{formatCurrency(stats.totalDeposits)}</p>
                      <p className="text-xs text-muted-foreground">{isRTL ? "إجمالي الإيداعات" : "Total Deposits"}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <TrendingDown className="h-5 w-5 mx-auto mb-1 text-destructive" />
                      <p className="text-lg font-bold" dir="ltr">{formatCurrency(stats.totalSpent)}</p>
                      <p className="text-xs text-muted-foreground">{isRTL ? "إجمالي المصروفات" : "Total Spent"}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <p className="text-lg font-bold">{stats.transactionCount}</p>
                      <p className="text-xs text-muted-foreground">{isRTL ? "عدد المعاملات" : "Transactions"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {isRTL ? "لا توجد محفظة" : "No Wallet"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL ? "هذا العميل ليس لديه محفظة بعد" : "This customer doesn't have a wallet yet"}
                </p>
                <Button onClick={() => createWalletMutation.mutate()} disabled={createWalletMutation.isPending}>
                  <Plus className="h-4 w-4 me-2" />
                  {isRTL ? "إنشاء محفظة" : "Create Wallet"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transactions Tab */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  {isRTL ? "سجل المعاملات" : "Transaction History"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isRTL ? "بحث في المعاملات..." : "Search transactions..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10 h-10 rounded-xl"
                  />
                </div>
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-[160px] h-10 rounded-xl">
                    <Filter className="h-4 w-4 me-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                    <SelectItem value="topup">{isRTL ? "شحن" : "Top Up"}</SelectItem>
                    <SelectItem value="invoice_payment">{isRTL ? "دفع فاتورة" : "Payment"}</SelectItem>
                    <SelectItem value="adjustment">{isRTL ? "تعديل" : "Adjustment"}</SelectItem>
                    <SelectItem value="refund">{isRTL ? "استرداد" : "Refund"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-medium">{isRTL ? "الداخل" : "Income"}</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-600" dir="ltr">
                    +{formatCurrency(filteredTransactions.filter(t => isCredit(t.transaction_type) && t.status === "succeeded").reduce((s, t) => s + Number(t.amount), 0))}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-700 font-medium">{isRTL ? "الخارج" : "Outcome"}</span>
                  </div>
                  <p className="text-lg font-bold text-red-600" dir="ltr">
                    -{formatCurrency(filteredTransactions.filter(t => !isCredit(t.transaction_type) && t.status === "succeeded").reduce((s, t) => s + Number(t.amount), 0))}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-700 font-medium">{isRTL ? "مكتملة" : "Completed"}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {filteredTransactions.filter(t => t.status === "succeeded").length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-amber-700 font-medium">{isRTL ? "معلقة" : "Pending"}</span>
                  </div>
                  <p className="text-lg font-bold text-amber-600">
                    {filteredTransactions.filter(t => t.status === "pending").length}
                  </p>
                </div>
              </div>

              {/* Transactions List */}
              <ScrollArea className="h-[500px]">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>{isRTL ? "لا توجد معاملات" : "No transactions"}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Group by date */}
                    {Object.entries(
                      filteredTransactions.reduce((groups, tx) => {
                        const date = new Date(tx.created_at || "").toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                        if (!groups[date]) groups[date] = [];
                        groups[date].push(tx);
                        return groups;
                      }, {} as Record<string, typeof filteredTransactions>)
                    ).map(([date, txs], groupIndex) => (
                      <div key={date}>
                        {/* Date Header */}
                        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{date}</span>
                            <Badge variant="secondary" className="text-xs">
                              {txs.length} {isRTL ? "معاملة" : "tx"}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Day Transactions */}
                        <div className="space-y-2">
                          {txs.map((tx, index) => (
                            <motion.div
                              key={tx.id}
                              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (groupIndex * txs.length + index) * 0.02 }}
                              className={cn(
                                "group p-4 rounded-xl border transition-all duration-200",
                                "hover:shadow-md hover:border-primary/30",
                                tx.status === "pending" && "border-amber-500/30 bg-amber-500/5",
                                tx.status === "failed" && "border-red-500/30 bg-red-500/5",
                                tx.status === "succeeded" && "bg-card"
                              )}
                            >
                              <div className="flex items-start gap-4">
                                {/* Icon with animation */}
                                <div className={cn(
                                  "relative h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                  isCredit(tx.transaction_type) 
                                    ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/20" 
                                    : "bg-gradient-to-br from-red-500/20 to-orange-500/20"
                                )}>
                                  {getTransactionIcon(tx.transaction_type)}
                                  {/* Direction indicator */}
                                  <div className={cn(
                                    "absolute -top-1 -end-1 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold",
                                    isCredit(tx.transaction_type) ? "bg-emerald-500" : "bg-red-500"
                                  )}>
                                    {isCredit(tx.transaction_type) ? "+" : "-"}
                                  </div>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                      <p className="font-semibold text-sm">
                                        {getTransactionTypeLabel(tx.transaction_type)}
                                      </p>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(tx.created_at || "").toLocaleTimeString(isRTL ? "ar-SA" : "en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        {tx.provider_reference && (
                                          <Badge variant="outline" className="text-[10px] font-mono h-5">
                                            #{tx.provider_reference.slice(0, 8)}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {/* Amount */}
                                    <div className="text-end shrink-0">
                                      <p className={cn(
                                        "text-xl font-bold tabular-nums",
                                        isCredit(tx.transaction_type) ? "text-emerald-600" : "text-red-600"
                                      )} dir="ltr">
                                        {isCredit(tx.transaction_type) ? "+" : "-"}
                                        {formatCurrency(Number(tx.amount))}
                                      </p>
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-xs mt-1 gap-1",
                                          tx.status === "succeeded" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                                          tx.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/30 animate-pulse",
                                          tx.status === "failed" && "bg-red-500/10 text-red-600 border-red-500/30"
                                        )}
                                      >
                                        {tx.status === "succeeded" && <CheckCircle2 className="h-3 w-3" />}
                                        {tx.status === "pending" && <Clock className="h-3 w-3" />}
                                        {tx.status === "failed" && <XCircle className="h-3 w-3" />}
                                        {tx.status === "succeeded" ? (isRTL ? "مكتمل" : "Completed") : 
                                         tx.status === "pending" ? (isRTL ? "قيد المعالجة" : "Processing") : 
                                         (isRTL ? "فشل" : "Failed")}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Description & Metadata */}
                                  {(tx.description || tx.description_ar || tx.related_invoice_id || tx.related_order_id) && (
                                    <div className="mt-3 pt-3 border-t border-dashed space-y-2">
                                      {(tx.description || tx.description_ar) && (
                                        <p className="text-sm text-muted-foreground">
                                          {isRTL ? tx.description_ar || tx.description : tx.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {tx.related_invoice_id && (
                                          <Badge variant="secondary" className="text-xs gap-1">
                                            <FileText className="h-3 w-3" />
                                            {isRTL ? "فاتورة مرتبطة" : "Invoice linked"}
                                          </Badge>
                                        )}
                                        {tx.related_order_id && (
                                          <Badge variant="secondary" className="text-xs gap-1">
                                            <ShoppingCart className="h-3 w-3" />
                                            {isRTL ? "طلب مرتبط" : "Order linked"}
                                          </Badge>
                                        )}
                                        {tx.provider && (
                                          <Badge variant="outline" className="text-xs gap-1">
                                            <Building2 className="h-3 w-3" />
                                            {tx.provider}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Info & Quick Links */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                {isRTL ? "معلومات العميل" : "Customer Info"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm" dir="ltr">{profile.phone}</span>
                </div>
              )}
              {profile.customer_uid && (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{profile.customer_uid}</span>
                </div>
              )}
              <Separator />
              <Button 
                variant="outline" 
                className="w-full rounded-xl"
                onClick={() => navigate(`/admin/clients/${id}`)}
              >
                {isRTL ? "عرض الملف الكامل" : "View Full Profile"}
                <ExternalLink className="h-4 w-4 ms-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                {isRTL ? "آخر الطلبات" : "Recent Orders"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isRTL ? "لا توجد طلبات" : "No orders"}
                </p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="p-2 rounded-lg bg-muted/50 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{order.order_number}</span>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-amber-500" />
                {isRTL ? "آخر الفواتير" : "Recent Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {isRTL ? "لا توجد فواتير" : "No invoices"}
                </p>
              ) : (
                <div className="space-y-2">
                  {invoices.slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="p-2 rounded-lg bg-muted/50 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{invoice.invoice_number}</span>
                        <span className="font-bold text-xs" dir="ltr">
                          {formatCurrency(invoice.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Adjustment Dialog */}
      <WalletAdjustmentDialog
        isOpen={isAdjustmentDialogOpen}
        onClose={() => setIsAdjustmentDialogOpen(false)}
        customer={customerData?.profile ? {
          id: customerData.profile.id,
          customer_uid: customerData.profile.customer_uid,
          email: customerData.profile.email,
          full_name: customerData.profile.full_name,
          phone: customerData.profile.phone,
          wallet: customerData.wallet || undefined,
        } : null}
        adjustmentType={adjustmentType}
        onSubmit={handleAdjustmentSubmit}
        language={language}
      />
    </div>
  );
}
