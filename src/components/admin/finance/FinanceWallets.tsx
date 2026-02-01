/**
 * Finance Wallets Tab - Premium Banking Design
 * Modern wallet management with KPIs, customer table, and detail drawer
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WalletStatsCards } from "./wallet/WalletStatsCards";
import { WalletCustomersTable } from "./wallet/WalletCustomersTable";
import { WalletDetailDrawer } from "./wallet/WalletDetailDrawer";
import { WalletAnalyticsCharts } from "./wallet/WalletAnalyticsCharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Wallet } from "lucide-react";
import type { CustomerWallet } from "@/types/financial";

interface CustomerWithWallet {
  id: string;
  customer_uid: string | null;
  email: string;
  full_name: string | null;
  phone: string | null;
  wallet?: CustomerWallet;
}

interface WalletStats {
  totalWallets: number;
  activeWallets: number;
  totalBalance: number;
  avgBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingTransfers: number;
  monthlyGrowth: number;
}

export function FinanceWallets() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [customers, setCustomers] = useState<CustomerWithWallet[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithWallet | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState<WalletStats>({
    totalWallets: 0,
    activeWallets: 0,
    totalBalance: 0,
    avgBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTransfers: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with customer_uid
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, customer_uid, email, full_name, phone")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all wallets
      const { data: wallets, error: walletsError } = await supabase
        .from("customer_wallets" as never)
        .select("*");

      if (walletsError) throw walletsError;

      // Map wallets to customers
      const walletsMap = new Map(
        ((wallets as CustomerWallet[]) || []).map((w) => [w.customer_user_id, w])
      );

      const customersWithWallets: CustomerWithWallet[] = (profiles || []).map((p) => ({
        ...p,
        wallet: walletsMap.get(p.id),
      }));

      setCustomers(customersWithWallets);

      // Calculate stats
      const walletsList = (wallets as CustomerWallet[]) || [];
      const totalBalance = walletsList.reduce((sum, w) => sum + Number(w.balance || 0), 0);
      const activeWallets = walletsList.filter((w) => w.status === "active").length;

      // Get pending bank transfers count
      const { count: pendingCount } = await supabase
        .from("bank_transfer_requests" as never)
        .select("*", { count: "exact", head: true })
        .in("status", ["submitted", "under_review"]);

      // Get deposits total
      const { data: deposits } = await supabase
        .from("financial_transactions" as never)
        .select("amount")
        .eq("transaction_type", "topup")
        .eq("status", "succeeded");

      const totalDeposits = deposits?.reduce((sum, d: { amount: number }) => sum + Number(d.amount), 0) || 0;

      // Get withdrawals total
      const { data: withdrawals } = await supabase
        .from("financial_transactions" as never)
        .select("amount")
        .eq("transaction_type", "withdrawal")
        .eq("status", "succeeded");

      const totalWithdrawals = withdrawals?.reduce((sum, w: { amount: number }) => sum + Number(w.amount), 0) || 0;

      setStats({
        totalWallets: walletsList.length,
        activeWallets,
        totalBalance,
        avgBalance: walletsList.length > 0 ? totalBalance / walletsList.length : 0,
        totalDeposits,
        totalWithdrawals,
        pendingTransfers: pendingCount || 0,
        monthlyGrowth: 12, // Placeholder - would need historical data
      });
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في جلب البيانات" : "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast({
      title: isRTL ? "تم التحديث" : "Refreshed",
      description: isRTL ? "تم تحديث البيانات بنجاح" : "Data refreshed successfully",
    });
  };

  const handleSelectCustomer = (customer: CustomerWithWallet) => {
    setSelectedCustomer(customer);
    setShowDrawer(true);
  };

  const handleCreateWallet = async (customerId: string) => {
    try {
      const { error } = await supabase
        .from("customer_wallets" as never)
        .insert({
          customer_user_id: customerId,
          balance: 0,
          currency: "SAR",
          status: "active",
        } as never);

      if (error) throw error;

      toast({
        title: isRTL ? "تم الإنشاء" : "Created",
        description: isRTL ? "تم إنشاء المحفظة بنجاح" : "Wallet created successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في إنشاء المحفظة" : "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Wallet className="h-7 w-7 text-primary" />
            {isRTL ? "إدارة المحافظ" : "Wallet Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRTL
              ? "إدارة محافظ العملاء ومتابعة الأرصدة والمعاملات"
              : "Manage customer wallets, balances and transactions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 me-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 me-2" />
            {isRTL ? "تصدير" : "Export"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <WalletStatsCards stats={stats} isLoading={isLoading} />

      {/* Analytics Charts */}
      <WalletAnalyticsCharts />

      {/* Customers Table */}
      <WalletCustomersTable
        customers={customers}
        isLoading={isLoading}
        onSelectCustomer={handleSelectCustomer}
        onCreateWallet={handleCreateWallet}
      />

      {/* Detail Drawer */}
      <WalletDetailDrawer
        customer={selectedCustomer}
        open={showDrawer}
        onOpenChange={setShowDrawer}
        onRefresh={() => {
          fetchData();
          // Update selected customer if still viewing
          if (selectedCustomer) {
            const updated = customers.find((c) => c.id === selectedCustomer.id);
            if (updated) setSelectedCustomer(updated);
          }
        }}
      />
    </motion.div>
  );
}
