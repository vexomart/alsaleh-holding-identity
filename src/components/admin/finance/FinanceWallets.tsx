/**
 * Finance Wallets Tab
 * Customer wallets management with balance adjustments
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Wallet,
  User,
  TrendingUp,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerWallet {
  id: string;
  customer_user_id: string;
  wallet_number: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string;
    customer_uid: string | null;
  };
}

export function FinanceWallets() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [wallets, setWallets] = useState<CustomerWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adjustDialog, setAdjustDialog] = useState<{
    open: boolean;
    wallet: CustomerWallet | null;
    type: "add" | "subtract";
  }>({ open: false, wallet: null, type: "add" });
  const [adjustAmount, setAdjustAmount] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setIsLoading(true);
    try {
      // Fetch wallets
      const { data: walletsData, error: walletsError } = await supabase
        .from("customer_wallets")
        .select("*")
        .order("created_at", { ascending: false });

      if (walletsError) throw walletsError;

      // Fetch profiles for each wallet
      const customerIds = walletsData?.map((w) => w.customer_user_id) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email, customer_uid")
        .in("id", customerIds);

      const profilesMap = new Map(profilesData?.map((p) => [p.id, p]) || []);

      const enrichedWallets = walletsData?.map((wallet) => ({
        ...wallet,
        profile: profilesMap.get(wallet.customer_user_id) || undefined,
      })) || [];

      setWallets(enrichedWallets);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleAdjustBalance = async () => {
    if (!adjustDialog.wallet || !adjustAmount) return;

    setIsAdjusting(true);
    try {
      const amount = parseFloat(adjustAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
      }

      const newBalance = adjustDialog.type === "add"
        ? Number(adjustDialog.wallet.balance) + amount
        : Number(adjustDialog.wallet.balance) - amount;

      if (newBalance < 0) {
        throw new Error("Balance cannot be negative");
      }

      // Update wallet balance
      const { error: updateError } = await supabase
        .from("customer_wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("id", adjustDialog.wallet.id);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: txError } = await supabase
        .from("financial_transactions")
        .insert({
          customer_user_id: adjustDialog.wallet.customer_user_id,
          wallet_id: adjustDialog.wallet.id,
          transaction_type: "adjustment",
          amount: amount,
          currency: adjustDialog.wallet.currency,
          status: "succeeded",
          description: `Balance ${adjustDialog.type === "add" ? "increase" : "decrease"} by admin`,
          description_ar: adjustDialog.type === "add" ? "زيادة الرصيد بواسطة المشرف" : "خصم الرصيد بواسطة المشرف",
          processed_at: new Date().toISOString(),
        });

      if (txError) throw txError;

      toast({
        title: isRTL ? "تم التعديل بنجاح" : "Adjustment Successful",
        description: isRTL
          ? `تم ${adjustDialog.type === "add" ? "إضافة" : "خصم"} ${formatCurrency(amount)}`
          : `${adjustDialog.type === "add" ? "Added" : "Subtracted"} ${formatCurrency(amount)}`,
      });

      setAdjustDialog({ open: false, wallet: null, type: "add" });
      setAdjustAmount("");
      fetchWallets();
    } catch (error) {
      console.error("Error adjusting balance:", error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: error instanceof Error ? error.message : "Failed to adjust balance",
        variant: "destructive",
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  const filteredWallets = wallets.filter((wallet) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      wallet.wallet_number.toLowerCase().includes(search) ||
      wallet.profile?.customer_uid?.toLowerCase().includes(search) ||
      wallet.profile?.full_name?.toLowerCase().includes(search) ||
      wallet.profile?.email.toLowerCase().includes(search)
    );
  });

  // Stats
  const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
  const activeWallets = wallets.filter((w) => w.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "إجمالي الأرصدة" : "Total Balances"}
                </span>
                <div className="text-2xl font-bold text-primary" dir="ltr">
                  {formatCurrency(totalBalance)}
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "المحافظ النشطة" : "Active Wallets"}
                </span>
                <div className="text-2xl font-bold text-green-600">
                  {activeWallets}
                </div>
              </div>
              <Wallet className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {isRTL ? "محافظ العملاء" : "Customer Wallets"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
                isRTL ? "right-3" : "left-3"
              )} />
              <Input
                placeholder={isRTL ? "بحث برقم المحفظة أو اسم العميل أو UID..." : "Search by wallet number, name, or UID..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? "pr-10" : "pl-10"}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "العميل" : "Customer"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "رقم المحفظة" : "Wallet #"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "الرصيد" : "Balance"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {isRTL ? "لا توجد محافظ" : "No wallets found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredWallets.map((wallet) => (
                      <TableRow key={wallet.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {wallet.profile?.full_name || (isRTL ? "عميل" : "Customer")}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono" dir="ltr">
                                {wallet.profile?.customer_uid || "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm" dir="ltr">
                            {wallet.wallet_number}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600" dir="ltr">
                            {formatCurrency(Number(wallet.balance), wallet.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              wallet.status === "active"
                                ? "bg-green-500/10 text-green-600 border-green-500/30"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                            )}
                          >
                            {wallet.status === "active"
                              ? (isRTL ? "نشطة" : "Active")
                              : (isRTL ? "معلقة" : "Suspended")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAdjustDialog({ open: true, wallet, type: "add" })}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAdjustDialog({ open: true, wallet, type: "subtract" })}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adjust Dialog */}
      <Dialog open={adjustDialog.open} onOpenChange={(open) => setAdjustDialog({ ...adjustDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL
                ? adjustDialog.type === "add" ? "إضافة رصيد" : "خصم رصيد"
                : adjustDialog.type === "add" ? "Add Balance" : "Subtract Balance"}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? `${adjustDialog.type === "add" ? "إضافة" : "خصم"} رصيد للمحفظة: ${adjustDialog.wallet?.wallet_number}`
                : `${adjustDialog.type === "add" ? "Add" : "Subtract"} balance for wallet: ${adjustDialog.wallet?.wallet_number}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">
                {isRTL ? "الرصيد الحالي" : "Current Balance"}
              </span>
              <div className="text-lg font-bold" dir="ltr">
                {formatCurrency(Number(adjustDialog.wallet?.balance || 0))}
              </div>
            </div>
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustDialog({ open: false, wallet: null, type: "add" })}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAdjustBalance}
              disabled={isAdjusting || !adjustAmount}
              className={adjustDialog.type === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isAdjusting && <Loader2 className="h-4 w-4 me-2 animate-spin" />}
              {isRTL
                ? adjustDialog.type === "add" ? "إضافة" : "خصم"
                : adjustDialog.type === "add" ? "Add" : "Subtract"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
