/**
 * Admin Wallets Management - Modern Design
 * Customer list with navigation to detail pages
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
import type { CustomerWallet } from "@/types/financial";

import { WalletStatsCards } from "./WalletStatsCards";
import { WalletsFilters } from "./WalletsFilters";
import { WalletCustomerCard } from "./WalletCustomerCard";

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
}

export function WalletsManagement() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [customers, setCustomers] = useState<CustomerWithWallet[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalWallets: 0,
    activeWallets: 0,
    totalBalance: 0,
    pendingTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchCustomersWithWallets = useCallback(async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, customer_uid, email, full_name, phone")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: wallets, error: walletsError } = await supabase
        .from("customer_wallets")
        .select("*");

      if (walletsError) throw walletsError;

      const walletsMap = new Map(
        (wallets as CustomerWallet[]).map((w) => [w.customer_user_id, w])
      );

      const customersWithWallets: CustomerWithWallet[] = (profiles || []).map((p) => ({
        ...p,
        wallet: walletsMap.get(p.id),
      }));

      setCustomers(customersWithWallets);

      const walletsList = wallets as CustomerWallet[] || [];
      const { count } = await supabase
        .from("financial_transactions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        totalWallets: walletsList.length,
        activeWallets: walletsList.filter((w) => w.status === "active").length,
        totalBalance: walletsList.reduce((sum, w) => sum + Number(w.balance || 0), 0),
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCustomersWithWallets();
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20">
              <WalletCards className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {isRTL ? "إدارة المحافظ" : "Wallet Management"}
                <Sparkles className="h-5 w-5 text-secondary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                {isRTL ? "اضغط على العميل لعرض تفاصيل المحفظة" : "Click on a customer to view wallet details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className={cn("h-9 px-3 rounded-lg", viewMode === "grid" && "shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 me-2" />
              {isRTL ? "شبكة" : "Grid"}
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={cn("h-9 px-3 rounded-lg", viewMode === "list" && "shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 me-2" />
              {isRTL ? "قائمة" : "List"}
            </Button>
          </div>
        </motion.div>

        <WalletStatsCards stats={stats} language={language} isLoading={isLoading} />

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

        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Users className="h-5 w-5 text-accent" />
              {isRTL ? "قائمة العملاء" : "Customers List"}
              <span className="ms-2 text-sm font-normal text-muted-foreground">({filteredCustomers.length})</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            {isLoading ? (
              <div className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{isRTL ? "لا يوجد عملاء" : "No customers found"}</h3>
                <p className="text-sm text-muted-foreground">{isRTL ? "لم يتم العثور على عملاء" : "No customers match your filters"}</p>
              </div>
            ) : (
              <motion.div layout className={cn("grid gap-4", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
                <AnimatePresence mode="popLayout">
                  {filteredCustomers.map((customer) => (
                    <WalletCustomerCard key={customer.id} customer={customer} language={language} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
