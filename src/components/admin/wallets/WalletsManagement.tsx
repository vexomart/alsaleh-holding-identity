/**
 * Admin Wallets Management
 * Full wallet administration with customer search, balance management, and transactions
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  Search,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Eye,
  Receipt,
  Banknote,
  CreditCard,
  AlertTriangle,
  Loader2,
  Copy,
  Check,
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

export function WalletsManagement() {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  // State
  const [customers, setCustomers] = useState<CustomerWithWallet[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithWallet | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Adjustment dialog
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalWallets: 0,
    activeWallets: 0,
    totalBalance: 0,
    pendingTransactions: 0,
  });

  // Copy UID
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Fetch customers with wallets
  useEffect(() => {
    fetchCustomersWithWallets();
  }, []);

  const fetchCustomersWithWallets = async () => {
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
        (wallets as CustomerWallet[]).map((w) => [w.customer_user_id, w])
      );

      const customersWithWallets: CustomerWithWallet[] = (profiles || []).map((p) => ({
        ...p,
        wallet: walletsMap.get(p.id),
      }));

      setCustomers(customersWithWallets);

      // Calculate stats
      const walletsList = wallets as CustomerWallet[] || [];
      setStats({
        totalWallets: walletsList.length,
        activeWallets: walletsList.filter((w) => w.status === "active").length,
        totalBalance: walletsList.reduce((sum, w) => sum + Number(w.balance || 0), 0),
        pendingTransactions: 0, // Will be updated
      });

      // Get pending transactions count
      const { count } = await supabase
        .from("financial_transactions" as never)
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats((prev) => ({ ...prev, pendingTransactions: count || 0 }));
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في جلب البيانات" : "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transactions for selected customer
  const fetchTransactions = async (customerId: string) => {
    setIsLoadingTransactions(true);
    try {
      const { data, error } = await supabase
        .from("financial_transactions" as never)
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
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.customer_uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "with_wallet" && c.wallet) ||
        (statusFilter === "without_wallet" && !c.wallet) ||
        (statusFilter === "active" && c.wallet?.status === "active") ||
        (statusFilter === "frozen" && c.wallet?.status === "frozen");

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Handle customer selection
  const handleSelectCustomer = (customer: CustomerWithWallet) => {
    setSelectedCustomer(customer);
    if (customer.id) {
      fetchTransactions(customer.id);
    }
  };

  // Create wallet for customer
  const createWalletForCustomer = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from("customer_wallets" as never)
        .insert({
          customer_user_id: customerId,
          balance: 0,
          currency: "SAR",
          status: "active",
        } as never)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: isRTL ? "تم الإنشاء" : "Created",
        description: isRTL ? "تم إنشاء المحفظة بنجاح" : "Wallet created successfully",
      });

      fetchCustomersWithWallets();

      // Update selected customer
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer((prev) =>
          prev ? { ...prev, wallet: data as CustomerWallet } : null
        );
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في إنشاء المحفظة" : "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  // Handle balance adjustment
  const handleAdjustment = async () => {
    if (!selectedCustomer?.wallet || !adjustmentAmount || !adjustmentReason) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "المبلغ غير صحيح" : "Invalid amount",
        variant: "destructive",
      });
      return;
    }

    // Check for deduction limit
    if (adjustmentType === "deduct" && amount > Number(selectedCustomer.wallet.balance)) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "المبلغ أكبر من الرصيد المتاح" : "Amount exceeds available balance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newBalance =
        adjustmentType === "add"
          ? Number(selectedCustomer.wallet.balance) + amount
          : Number(selectedCustomer.wallet.balance) - amount;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from("customer_wallets" as never)
        .update({ balance: newBalance } as never)
        .eq("id", selectedCustomer.wallet.id);

      if (walletError) throw walletError;

      // Create transaction record
      const { error: txError } = await supabase
        .from("financial_transactions" as never)
        .insert({
          customer_user_id: selectedCustomer.id,
          wallet_id: selectedCustomer.wallet.id,
          transaction_type: "adjustment",
          amount: amount,
          currency: "SAR",
          status: "succeeded",
          description: adjustmentReason,
          description_ar: adjustmentReason,
          processed_at: new Date().toISOString(),
          metadata: {
            adjustment_type: adjustmentType,
            performed_by: "admin",
          },
        } as never);

      if (txError) throw txError;

      toast({
        title: isRTL ? "تم التعديل" : "Adjusted",
        description: isRTL
          ? `تم ${adjustmentType === "add" ? "إضافة" : "خصم"} ${amount} ر.س`
          : `${adjustmentType === "add" ? "Added" : "Deducted"} ${amount} SAR`,
      });

      // Refresh data
      setShowAdjustmentDialog(false);
      setAdjustmentAmount("");
      setAdjustmentReason("");
      fetchCustomersWithWallets();
      fetchTransactions(selectedCustomer.id);

      // Update selected customer wallet
      setSelectedCustomer((prev) =>
        prev?.wallet
          ? { ...prev, wallet: { ...prev.wallet, balance: newBalance } }
          : prev
      );
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في تعديل الرصيد" : "Failed to adjust balance",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy UID
  const copyUid = async (uid: string) => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      topup: { ar: "شحن رصيد", en: "Top Up" },
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل إداري", en: "Admin Adjustment" },
      transfer: { ar: "تحويل", en: "Transfer" },
      fee: { ar: "رسوم", en: "Fee" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {isRTL ? "مكتمل" : "Completed"}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            {isRTL ? "قيد الانتظار" : "Pending"}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            {isRTL ? "فشل" : "Failed"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Wallet className="h-7 w-7 text-primary" />
          {isRTL ? "إدارة المحافظ" : "Wallet Management"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isRTL
            ? "إدارة محافظ العملاء والمعاملات المالية"
            : "Manage customer wallets and financial transactions"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "إجمالي المحافظ" : "Total Wallets"}
                </p>
                <p className="text-2xl font-bold">{stats.totalWallets}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "المحافظ النشطة" : "Active Wallets"}
                </p>
                <p className="text-2xl font-bold text-green-600">{stats.activeWallets}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "إجمالي الأرصدة" : "Total Balance"}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? "معاملات معلقة" : "Pending Transactions"}
                </p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendingTransactions}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customers List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {isRTL ? "العملاء" : "Customers"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "اختر عميل لعرض التفاصيل" : "Select a customer to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? "البحث برقم العميل أو البريد..." : "Search by ID, email..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                <SelectItem value="with_wallet">{isRTL ? "لديه محفظة" : "Has Wallet"}</SelectItem>
                <SelectItem value="without_wallet">{isRTL ? "بدون محفظة" : "No Wallet"}</SelectItem>
                <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                <SelectItem value="frozen">{isRTL ? "مجمد" : "Frozen"}</SelectItem>
              </SelectContent>
            </Select>

            {/* List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedCustomer?.id === customer.id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted/50 border-transparent"
                    )}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-primary">
                        {customer.customer_uid || "---"}
                      </span>
                      {customer.wallet ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            customer.wallet.status === "active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {customer.wallet.status === "active"
                            ? isRTL ? "نشط" : "Active"
                            : isRTL ? "مجمد" : "Frozen"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-muted">
                          {isRTL ? "بدون محفظة" : "No Wallet"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">
                      {customer.full_name || customer.email}
                    </p>
                    {customer.wallet && (
                      <p className="text-sm font-bold text-green-600 mt-1">
                        {formatCurrency(Number(customer.wallet.balance))}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="lg:col-span-2">
          {selectedCustomer ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {selectedCustomer.full_name || selectedCustomer.email}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="font-mono">{selectedCustomer.customer_uid}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => selectedCustomer.customer_uid && copyUid(selectedCustomer.customer_uid)}
                      >
                        {copiedUid === selectedCustomer.customer_uid ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </CardDescription>
                  </div>
                  {selectedCustomer.wallet ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => {
                          setAdjustmentType("add");
                          setShowAdjustmentDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        {isRTL ? "إضافة" : "Add"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => {
                          setAdjustmentType("deduct");
                          setShowAdjustmentDialog(true);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                        {isRTL ? "خصم" : "Deduct"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => createWalletForCustomer(selectedCustomer.id)}
                    >
                      <Plus className="h-4 w-4" />
                      {isRTL ? "إنشاء محفظة" : "Create Wallet"}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Info */}
                {selectedCustomer.wallet ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                      <p className="text-xs text-muted-foreground mb-1">
                        {isRTL ? "الرصيد الحالي" : "Current Balance"}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(selectedCustomer.wallet.balance))}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {isRTL ? "رقم المحفظة" : "Wallet Number"}
                      </p>
                      <p className="text-sm font-mono">{selectedCustomer.wallet.wallet_number}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {isRTL ? "حالة المحفظة" : "Wallet Status"}
                      </p>
                      <Badge
                        className={cn(
                          selectedCustomer.wallet.status === "active"
                            ? "bg-green-500/20 text-green-600"
                            : "bg-amber-500/20 text-amber-600"
                        )}
                      >
                        {selectedCustomer.wallet.status === "active"
                          ? isRTL ? "نشطة" : "Active"
                          : isRTL ? "مجمدة" : "Frozen"}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                    <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>{isRTL ? "لا توجد محفظة لهذا العميل" : "No wallet for this customer"}</p>
                    <Button
                      size="sm"
                      className="mt-4 gap-2"
                      onClick={() => createWalletForCustomer(selectedCustomer.id)}
                    >
                      <Plus className="h-4 w-4" />
                      {isRTL ? "إنشاء محفظة الآن" : "Create Wallet Now"}
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Transactions */}
                <div>
                  <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {isRTL ? "سجل المعاملات" : "Transaction History"}
                  </h4>

                  {isLoadingTransactions ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14" />
                      ))}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>{isRTL ? "لا توجد معاملات" : "No transactions"}</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{isRTL ? "النوع" : "Type"}</TableHead>
                            <TableHead>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                            <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
                            <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                <span className="text-sm">
                                  {getTransactionTypeLabel(tx.transaction_type)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    "font-medium",
                                    tx.transaction_type === "topup" ||
                                      tx.transaction_type === "refund" ||
                                      (tx.transaction_type === "adjustment" &&
                                        (tx.metadata as Record<string, unknown>)?.adjustment_type === "add")
                                      ? "text-green-600"
                                      : "text-foreground"
                                  )}
                                >
                                  {tx.transaction_type === "topup" ||
                                  tx.transaction_type === "refund" ||
                                  (tx.transaction_type === "adjustment" &&
                                    (tx.metadata as Record<string, unknown>)?.adjustment_type === "add")
                                    ? "+"
                                    : "-"}
                                  {formatCurrency(Number(tx.amount))}
                                </span>
                              </TableCell>
                              <TableCell>{getStatusBadge(tx.status)}</TableCell>
                              <TableCell>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(tx.created_at)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[600px]">
              <div className="text-center text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  {isRTL ? "اختر عميلاً لعرض التفاصيل" : "Select a customer to view details"}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Adjustment Dialog */}
      <Dialog open={showAdjustmentDialog} onOpenChange={setShowAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === "add"
                ? isRTL ? "إضافة رصيد" : "Add Balance"
                : isRTL ? "خصم رصيد" : "Deduct Balance"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? `الرصيد الحالي: ${formatCurrency(Number(selectedCustomer?.wallet?.balance || 0))}`
                : `Current balance: ${formatCurrency(Number(selectedCustomer?.wallet?.balance || 0))}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{isRTL ? "المبلغ (ر.س)" : "Amount (SAR)"}</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label>{isRTL ? "السبب" : "Reason"}</Label>
              <Input
                placeholder={isRTL ? "سبب التعديل..." : "Reason for adjustment..."}
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustmentDialog(false)}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAdjustment}
              disabled={isSubmitting}
              className={cn(
                adjustmentType === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : adjustmentType === "add" ? (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  {isRTL ? "إضافة" : "Add"}
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 mr-1" />
                  {isRTL ? "خصم" : "Deduct"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
