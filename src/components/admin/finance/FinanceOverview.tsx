/**
 * Finance Overview Tab
 * Shows totals, cashflow, VAT collected, refunds
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  RefreshCw,
  CreditCard,
  Clock,
  CheckCircle2,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinanceStats {
  totalPaid: number;
  totalUnpaid: number;
  totalVat: number;
  totalRefunds: number;
  transactionsCount: number;
  pendingCount: number;
}

export function FinanceOverview() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch paid invoices
        const { data: paidInvoices } = await supabase
          .from("invoices")
          .select("total, vat_amount")
          .eq("status", "paid");

        // Fetch unpaid invoices
        const { data: unpaidInvoices } = await supabase
          .from("invoices")
          .select("total")
          .in("status", ["issued", "overdue"]);

        // Fetch refunds
        const { data: refunds } = await supabase
          .from("financial_transactions")
          .select("amount")
          .eq("transaction_type", "refund")
          .eq("status", "succeeded");

        // Fetch transaction counts
        const { count: totalTxns } = await supabase
          .from("financial_transactions")
          .select("*", { count: "exact", head: true });

        const { count: pendingTxns } = await supabase
          .from("financial_transactions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        const totalPaid = paidInvoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
        const totalUnpaid = unpaidInvoices?.reduce((sum, inv) => sum + Number(inv.total), 0) || 0;
        const totalVat = paidInvoices?.reduce((sum, inv) => sum + Number(inv.vat_amount), 0) || 0;
        const totalRefunds = refunds?.reduce((sum, ref) => sum + Number(ref.amount), 0) || 0;

        setStats({
          totalPaid,
          totalUnpaid,
          totalVat,
          totalRefunds,
          transactionsCount: totalTxns || 0,
          pendingCount: pendingTxns || 0,
        });
      } catch (error) {
        console.error("Error fetching finance stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: isRTL ? "إجمالي المدفوعات" : "Total Paid",
      value: stats?.totalPaid || 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: isRTL ? "مستحقات غير مدفوعة" : "Unpaid Amount",
      value: stats?.totalUnpaid || 0,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: isRTL ? "ضريبة القيمة المضافة" : "VAT Collected",
      value: stats?.totalVat || 0,
      icon: Receipt,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: isRTL ? "المبالغ المستردة" : "Total Refunds",
      value: stats?.totalRefunds || 0,
      icon: RefreshCw,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn("border", card.borderColor)}>
                <CardContent className="p-6">
                  <div className={cn(
                    "flex items-center justify-between mb-4",
                    isRTL && "flex-row-reverse"
                  )}>
                    <span className="text-sm text-muted-foreground font-medium">
                      {card.title}
                    </span>
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", card.bgColor)}>
                      <Icon className={cn("h-5 w-5", card.color)} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold" dir="ltr">
                    {formatCurrency(card.value)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn(
                "text-base flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <CreditCard className="h-4 w-4 text-primary" />
                {isRTL ? "إحصائيات المعاملات" : "Transaction Stats"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold text-foreground">
                    {stats?.transactionsCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isRTL ? "إجمالي المعاملات" : "Total Transactions"}
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">
                    {stats?.pendingCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isRTL ? "قيد الانتظار" : "Pending"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className={cn(
                "text-base flex items-center gap-2",
                isRTL && "flex-row-reverse"
              )}>
                <Banknote className="h-4 w-4 text-primary" />
                {isRTL ? "صافي الإيرادات" : "Net Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-3xl font-bold text-green-600" dir="ltr">
                  {formatCurrency((stats?.totalPaid || 0) - (stats?.totalRefunds || 0))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isRTL ? "بعد خصم المستردات" : "After refunds"}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
