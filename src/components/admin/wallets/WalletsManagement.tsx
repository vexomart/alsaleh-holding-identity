/**
 * Admin Wallets Management - Modern Design
 * Full wallet administration with customer search, balance management, and transactions
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wallet,
  Users,
  LayoutGrid,
  List,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { CustomerWallet, FinancialTransaction } from "@/types/financial";

// Modular components
import { WalletStatsCards } from "./WalletStatsCards";
import { WalletsFilters } from "./WalletsFilters";
import { WalletCustomerCard } from "./WalletCustomerCard";
import { WalletDetailDrawer } from "./WalletDetailDrawer";
import { WalletAdjustmentDialog } from "./WalletAdjustmentDialog";

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
  pendingTransactions: number;
  monthlyGrowth?: number;
}

export function WalletsManagement() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // Data state
  const [customers, setCustomers] = useState<CustomerWithWallet[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithWallet | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalWallets: 0,
    activeWallets: 0,
    totalBalance: 0,
    pendingTransactions: 0,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Dialog state
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");

  // Fetch customers with wallets
  const fetchCustomersWithWallets = useCallback(async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, customer_uid, email, full_name, phone")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all wallets
      const { data: wallets, error: walletsError } = await supabase
        .from("customer_wallets")
        .select("*");

      if (walletsError) throw walletsError;

      // Map wallets to customers
      const walletsMap = new Map(
        (wallets as CustomerWallet[]).map((w) => [w.customer_user_id, w])
      );

      const customersWithWallets: CustomerWithWallet[] = (profiles || []).map((p) => ({
        ...p,
        wallet: walletsMap.get(p.id),
      }));

      setCustomers(customersWithWallets);

      // Calculate stats
      const walletsList = wallets as CustomerWallet[] || [];
      const totalBalance = walletsList.reduce((sum, w) => sum + Number(w.balance || 0), 0);
      
      // Get pending transactions count
      const { count } = await supabase
        .from("financial_transactions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalWallets: walletsList.length,
        activeWallets: walletsList.filter((w) => w.status === "active").length,
        totalBalance,
        pendingTransactions: count || 0,
      });
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast.error(isRTL ? "خطأ في تحميل البيانات" : "Error loading data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchCustomersWithWallets();
  }, [fetchCustomersWithWallets]);

  // Fetch transactions for selected customer
  const fetchTransactions = useCallback(async (customerId: string) => {
    setIsLoadingTransactions(true);
    try {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .eq("customer_user_id", customerId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions((data || []) as FinancialTransaction[]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.customer_uid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "with_wallet" && c.wallet) ||
        (statusFilter === "without_wallet" && !c.wallet) ||
        (statusFilter === "active" && c.wallet?.status === "active") ||
        (statusFilter === "frozen" && c.wallet?.status === "frozen");

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Handlers
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCustomersWithWallets();
  };

  const handleViewCustomer = (customer: CustomerWithWallet) => {
    setSelectedCustomer(customer);
    setIsDetailDrawerOpen(true);
    if (customer.id) {
      fetchTransactions(customer.id);
    }
  };

  const handleOpenAdjustment = (customer: CustomerWithWallet, type: "add" | "deduct") => {
    setSelectedCustomer(customer);
    setAdjustmentType(type);
    setIsAdjustmentDialogOpen(true);
  };

  const handleCreateWallet = async (customerId: string) => {
    try {
      // Generate wallet number (16 digits starting with 4)
      const walletNumber = '4' + Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
      
      const { error } = await supabase
        .from("customer_wallets")
        .insert({
          customer_user_id: customerId,
          wallet_number: walletNumber,
          balance: 0,
          currency: "SAR",
          status: "active",
        } as any);

      if (error) throw error;

      toast.success(isRTL ? "تم إنشاء المحفظة بنجاح" : "Wallet created successfully");
      fetchCustomersWithWallets();
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error(isRTL ? "فشل في إنشاء المحفظة" : "Failed to create wallet");
    }
  };

  const handleAdjustmentSubmit = async (amount: number, reason: string) => {
    if (!selectedCustomer?.wallet) return;

    const newBalance =
      adjustmentType === "add"
        ? Number(selectedCustomer.wallet.balance) + amount
        : Number(selectedCustomer.wallet.balance) - amount;

    // Update wallet balance
    const { error: walletError } = await supabase
      .from("customer_wallets")
      .update({ balance: newBalance })
      .eq("id", selectedCustomer.wallet.id);

    if (walletError) throw walletError;

    // Create transaction record
    const { error: txError } = await supabase
      .from("financial_transactions")
      .insert({
        customer_user_id: selectedCustomer.id,
        wallet_id: selectedCustomer.wallet.id,
        transaction_type: "adjustment",
        amount: amount,
        currency: "SAR",
        status: "succeeded",
        description: reason,
        description_ar: reason,
        processed_at: new Date().toISOString(),
        metadata: {
          adjustment_type: adjustmentType,
          performed_by: "admin",
        },
      });

    if (txError) throw txError;

    toast.success(
      isRTL
        ? `تم ${adjustmentType === "add" ? "إضافة" : "خصم"} ${amount} ر.س`
        : `${adjustmentType === "add" ? "Added" : "Deducted"} ${amount} SAR`
    );

    // Refresh data
    fetchCustomersWithWallets();
    if (selectedCustomer.id) {
      fetchTransactions(selectedCustomer.id);
    }

    // Update selected customer
    setSelectedCustomer((prev) =>
      prev?.wallet
        ? { ...prev, wallet: { ...prev.wallet, balance: newBalance } }
        : prev
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 p-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20">
              <WalletCards className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {isRTL ? "إدارة المحافظ" : "Wallet Management"}
                <Sparkles className="h-5 w-5 text-amber-500" />
              </h1>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "إدارة محافظ العملاء والمعاملات المالية"
                  : "Manage customer wallets and financial transactions"}
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-9 px-3 rounded-lg",
                viewMode === "grid" && "shadow-sm"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 me-2" />
              {isRTL ? "شبكة" : "Grid"}
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-9 px-3 rounded-lg",
                viewMode === "list" && "shadow-sm"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 me-2" />
              {isRTL ? "قائمة" : "List"}
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <WalletStatsCards
          stats={stats}
          language={language}
          isLoading={isLoading}
        />

        {/* Filters */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <WalletsFilters
              language={language}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              totalCount={customers.length}
              filteredCount={filteredCustomers.length}
            />
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Users className="h-5 w-5 text-emerald-600" />
              {isRTL ? "قائمة العملاء" : "Customers List"}
              <span className="ms-2 text-sm font-normal text-muted-foreground">
                ({filteredCustomers.length})
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            {isLoading ? (
              <div className={cn(
                "grid gap-4",
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-2xl" />
                ))}
              </div>
            ) : filteredCustomers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  {isRTL ? "لا يوجد عملاء" : "No customers found"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {isRTL
                    ? "لم يتم العثور على عملاء مطابقين للبحث"
                    : "No customers match your current filters"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={cn(
                  "grid gap-4",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {filteredCustomers.map((customer) => (
                    <WalletCustomerCard
                      key={customer.id}
                      customer={customer}
                      language={language}
                      onView={() => handleViewCustomer(customer)}
                      onAddBalance={() => handleOpenAdjustment(customer, "add")}
                      onDeductBalance={() => handleOpenAdjustment(customer, "deduct")}
                      onCreateWallet={() => handleCreateWallet(customer.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Detail Drawer */}
        <WalletDetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
          customer={selectedCustomer}
          transactions={transactions}
          isLoadingTransactions={isLoadingTransactions}
          language={language}
          onAddBalance={() => {
            setAdjustmentType("add");
            setIsAdjustmentDialogOpen(true);
          }}
          onDeductBalance={() => {
            setAdjustmentType("deduct");
            setIsAdjustmentDialogOpen(true);
          }}
        />

        {/* Adjustment Dialog */}
        <WalletAdjustmentDialog
          isOpen={isAdjustmentDialogOpen}
          onClose={() => setIsAdjustmentDialogOpen(false)}
          customer={selectedCustomer}
          adjustmentType={adjustmentType}
          onSubmit={handleAdjustmentSubmit}
          language={language}
        />
      </div>
    </TooltipProvider>
  );
}
