/**
 * Customer Wallet Page - Premium Bank-Grade Design V3
 * Full RTL support with advanced animations
 * المحفظة الرقمية - تصميم بنكي احترافي
 */

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useWalletRealtime } from "@/hooks/useWalletRealtime";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Wallet, 
  History, 
  ArrowUpRight,
  Shield,
  Sparkles,
  Receipt,
  TrendingUp,
  CreditCard,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Wifi,
  WifiOff,
  BarChart3,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Import wallet components
import { BankTransferDialog } from "./wallet/BankTransferDialog";
import { BankTransferList } from "./wallet/BankTransferList";
import { WalletTopupDialog } from "./wallet/WalletTopupDialog";
import { WalletQuickActions } from "./wallet/WalletQuickActions";
import { TransactionListEnhanced } from "./wallet/TransactionListEnhanced";
import { CustomerWalletCharts } from "./wallet/CustomerWalletCharts";

import type { CustomerWallet as CustomerWalletType, FinancialTransaction } from "@/types/financial";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

export function CustomerWallet() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  
  const [wallet, setWallet] = useState<CustomerWalletType | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [customerUid, setCustomerUid] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [newTransactionIds, setNewTransactionIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("wallet");
  const previousTransactionIds = useRef<Set<string>>(new Set());

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
    onTransactionCreated: (event) => {
      fetchTransactions();
      toast({
        title: isRTL ? "معاملة جديدة" : "New Transaction",
        description: isRTL 
          ? `تم إضافة معاملة بقيمة ${event.amount?.toLocaleString('ar-SA')} ر.س`
          : `Transaction of ${event.amount?.toLocaleString('en-US')} SAR added`,
      });
    },
  });

  const fetchTransactions = async (isInitialLoad = false) => {
    if (!user?.id) return;
    const { data: transData } = await supabase
      .from("financial_transactions" as never)
      .select("*")
      .eq("customer_user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (transData) {
      const newTxs = transData as FinancialTransaction[];
      
      if (!isInitialLoad && previousTransactionIds.current.size > 0) {
        const newIds = new Set<string>();
        newTxs.forEach(tx => {
          if (!previousTransactionIds.current.has(tx.id)) {
            newIds.add(tx.id);
          }
        });
        if (newIds.size > 0) {
          setNewTransactionIds(newIds);
          setTimeout(() => setNewTransactionIds(new Set()), 2000);
        }
      }
      
      previousTransactionIds.current = new Set(newTxs.map(tx => tx.id));
      setTransactions(newTxs);
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
          setWallet(walletData as CustomerWalletType);
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
            setWallet(newWallet as CustomerWalletType);
          }
        }

        await fetchTransactions(true);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [user?.id, profile?.tenant_id]);

  const copyWalletToClipboard = async () => {
    if (!wallet?.wallet_number) return;
    try {
      await navigator.clipboard.writeText(wallet.wallet_number);
      setCopiedWallet(true);
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? "تم نسخ رقم المحفظة" : "Wallet number copied",
      });
      setTimeout(() => setCopiedWallet(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

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

  const formatWalletNumber = (walletNumber: string) => {
    const digits = walletNumber.replace(/\D/g, '').padStart(16, '0');
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 16)}`;
  };

  // Calculate stats
  const stats = transactions.reduce((acc, tx) => {
    const isCredit = ['topup', 'refund'].includes(tx.transaction_type);
    if (isCredit) {
      acc.totalIn += tx.amount;
    } else {
      acc.totalOut += tx.amount;
    }
    return acc;
  }, { totalIn: 0, totalOut: 0 });

  // Tab items for RTL support
  const tabItems = [
    { value: "wallet", icon: Wallet, label: isRTL ? "المحفظة" : "Wallet" },
    { value: "transactions", icon: History, label: isRTL ? "المعاملات" : "Transactions" },
    { value: "bank-transfers", icon: Building2, label: isRTL ? "التحويلات" : "Transfers" },
    { value: "analytics", icon: BarChart3, label: isRTL ? "التحليلات" : "Analytics" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 w-full" dir={isRTL ? "rtl" : "ltr"}>
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Hero Header with Gradient Background */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 md:p-8">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-white blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" 
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <Wallet className="h-6 w-6 text-white" />
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {isRTL ? "المحفظة الرقمية" : "Digital Wallet"}
                </h1>
              </div>
              <p className="text-white/80 text-sm md:text-base max-w-md">
                {isRTL 
                  ? "إدارة رصيدك بأمان وسهولة مع حماية بنكية متقدمة"
                  : "Manage your balance securely with advanced banking protection"
                }
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => setShowBankTransfer(true)} 
                variant="secondary"
                className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Building2 className="h-4 w-4" />
                {isRTL ? "تحويل بنكي" : "Bank Transfer"}
                <ArrowUpRight className={cn("h-3.5 w-3.5", isRTL && "scale-x-[-1]")} />
              </Button>
            </motion.div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-white/70 text-xs"
            >
              <Shield className="h-4 w-4" />
              <span>{isRTL ? "حماية بنكية" : "Bank-grade Security"}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-white/70 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isRTL ? "تحديثات فورية" : "Real-time Updates"}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "flex items-center gap-2 text-xs px-2 py-1 rounded-full",
                isConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
              )}
            >
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{isConnected ? (isRTL ? "متصل مباشر" : "Live Connected") : (isRTL ? "غير متصل" : "Offline")}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <div dir={isRTL ? "rtl" : "ltr"}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
            <TabsList className="w-full md:w-auto bg-muted/50 p-1.5 rounded-xl border border-border/50 gap-1">
              {(isRTL ? [...tabItems].reverse() : tabItems).map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 md:px-6 transition-all duration-200"
                >
                  <tab.icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Wallet Tab */}
            <AnimatePresence mode="wait">
              <TabsContent value="wallet" className="mt-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Main Card Section */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Premium Bank Card */}
                    <motion.div variants={cardVariants}>
                      <div className="relative aspect-[1.8/1] max-w-lg">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl overflow-hidden">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-30"
                          >
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250px_250px]" />
                          </motion.div>
                          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl" />
                          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-2xl" />
                        </div>

                        <div className="relative h-full p-6 flex flex-col justify-between text-white">
                          {/* Top Row */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-12 rounded bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                                <div className="grid grid-cols-3 gap-0.5">
                                  {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-sm bg-amber-700/50" />
                                  ))}
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-[10px] border-0",
                                  wallet?.status === "active" 
                                    ? "bg-emerald-500/20 text-emerald-300" 
                                    : "bg-amber-500/20 text-amber-300"
                                )}
                              >
                                {wallet?.status === "active" ? (isRTL ? "نشطة" : "Active") : (isRTL ? "معلقة" : "Suspended")}
                              </Badge>
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <p className="text-[10px] text-white/50 uppercase tracking-wider">
                                {isRTL ? "محفظة الصالح" : "AlSaleh Wallet"}
                              </p>
                            </div>
                          </div>

                          {/* Middle - Card Number */}
                          <div className="space-y-1">
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">
                              {isRTL ? "رقم المحفظة" : "Wallet Number"}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-lg md:text-xl tracking-[0.2em] text-white/90" dir="ltr">
                                {formatWalletNumber(wallet?.wallet_number || "0000000000000000")}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10 rounded-full"
                                onClick={copyWalletToClipboard}
                              >
                                {copiedWallet ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>

                          {/* Bottom Row */}
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                                {isRTL ? "الرصيد المتاح" : "Available Balance"}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                                  {showBalance ? (
                                    <AnimatedNumber
                                      value={wallet?.balance || 0}
                                      locale={isRTL ? "ar-SA" : "en-US"}
                                      formatOptions={{
                                        style: "currency",
                                        currency: "SAR",
                                        minimumFractionDigits: 2,
                                      }}
                                      className="text-white"
                                    />
                                  ) : "•••••"}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-white/50 hover:text-white hover:bg-white/10 rounded-full"
                                  onClick={() => setShowBalance(!showBalance)}
                                >
                                  {showBalance ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                </Button>
                              </div>
                            </div>
                            <WalletTopupDialog>
                              <Button 
                                size="sm"
                                className="gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                {isRTL ? "شحن" : "Top Up"}
                              </Button>
                            </WalletTopupDialog>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Customer ID Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {isRTL ? "رقم العميل" : "Customer ID"}
                                </p>
                                <p className="font-mono font-bold text-sm" dir="ltr">{customerUid || "---"}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={copyUidToClipboard}
                            >
                              {copiedUid ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <WalletQuickActions
                        walletNumber={wallet?.wallet_number || ""}
                        customerUid={customerUid}
                        currentBalance={wallet?.balance || 0}
                        onBankTransferClick={() => setShowBankTransfer(true)}
                        isRTL={isRTL}
                      />
                    </motion.div>
                  </div>

                  {/* Stats & Quick Summary */}
                  <div className="space-y-4">
                    {/* Mini Stats */}
                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            {isRTL ? "ملخص الحركة" : "Activity Summary"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <span className="text-sm text-muted-foreground">{isRTL ? "إجمالي الوارد" : "Total In"}</span>
                            <span className="font-bold text-emerald-600" dir="ltr">
                              +{stats.totalIn.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                            </span>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                          >
                            <span className="text-sm text-muted-foreground">{isRTL ? "إجمالي الصادر" : "Total Out"}</span>
                            <span className="font-bold text-red-600" dir="ltr">
                              -{stats.totalOut.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                            </span>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                          >
                            <span className="text-sm text-muted-foreground">{isRTL ? "عدد المعاملات" : "Transactions"}</span>
                            <span className="font-bold">{transactions.length}</span>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Recent Transactions Preview */}
                    <motion.div
                      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-primary" />
                            {isRTL ? "آخر المعاملات" : "Recent"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <AnimatePresence>
                            {transactions.slice(0, 3).map((tx, index) => {
                              const isCredit = ['topup', 'refund'].includes(tx.transaction_type);
                              const isNew = newTransactionIds.has(tx.id);
                              return (
                                <motion.div 
                                  key={tx.id} 
                                  initial={{ opacity: 0, x: isRTL ? -10 : 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={cn(
                                    "flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors",
                                    isNew && "bg-primary/10 animate-pulse"
                                  )}
                                >
                                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {tx.description_ar || tx.description || tx.transaction_type}
                                  </span>
                                  <span className={cn("text-xs font-bold", isCredit ? "text-emerald-600" : "text-red-600")} dir="ltr">
                                    {isCredit ? "+" : "-"}{tx.amount.toLocaleString()}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                          {transactions.length === 0 && (
                            <p className="text-xs text-muted-foreground text-center py-4">
                              {isRTL ? "لا توجد معاملات" : "No transactions"}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransactionListEnhanced
                    transactions={transactions}
                    walletNumber={wallet?.wallet_number || ""}
                    customerUid={customerUid}
                    newTransactionIds={newTransactionIds}
                    isRTL={isRTL}
                  />
                </motion.div>
              </TabsContent>

              {/* Bank Transfers Tab */}
              <TabsContent value="bank-transfers" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <BankTransferList />
                </motion.div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CustomerWalletCharts />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </motion.div>

      {/* Bank Transfer Dialog */}
      <BankTransferDialog open={showBankTransfer} onOpenChange={setShowBankTransfer} />
    </motion.div>
  );
}
