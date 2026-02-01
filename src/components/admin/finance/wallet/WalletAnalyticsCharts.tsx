/**
 * Wallet Analytics Charts
 * Shows balance distribution and monthly transaction trends
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { PieChart as PieChartIcon, TrendingUp, Activity, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceDistribution {
  range: string;
  rangeAr: string;
  count: number;
  percentage: number;
}

interface MonthlyTransaction {
  month: string;
  monthAr: string;
  topups: number;
  withdrawals: number;
  payments: number;
  total: number;
}

interface WalletAnalyticsProps {
  className?: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function WalletAnalyticsCharts({ className }: WalletAnalyticsProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  const [balanceDistribution, setBalanceDistribution] = useState<BalanceDistribution[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<MonthlyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch all wallets for balance distribution
      const { data: wallets } = await supabase
        .from("customer_wallets")
        .select("balance");

      // Fetch transactions for monthly trends
      const { data: transactions } = await supabase
        .from("financial_transactions")
        .select("transaction_type, amount, created_at, status")
        .eq("status", "succeeded")
        .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

      // Calculate balance distribution
      const ranges = [
        { min: 0, max: 100, range: "0 - 100 SAR", rangeAr: "٠ - ١٠٠ ر.س" },
        { min: 100, max: 500, range: "100 - 500 SAR", rangeAr: "١٠٠ - ٥٠٠ ر.س" },
        { min: 500, max: 1000, range: "500 - 1,000 SAR", rangeAr: "٥٠٠ - ١,٠٠٠ ر.س" },
        { min: 1000, max: 5000, range: "1,000 - 5,000 SAR", rangeAr: "١,٠٠٠ - ٥,٠٠٠ ر.س" },
        { min: 5000, max: Infinity, range: "5,000+ SAR", rangeAr: "+٥,٠٠٠ ر.س" },
      ];

      const walletsList = wallets || [];
      const totalWallets = walletsList.length;

      const distribution: BalanceDistribution[] = ranges.map((r) => {
        const count = walletsList.filter(
          (w) => Number(w.balance) >= r.min && Number(w.balance) < r.max
        ).length;
        return {
          range: r.range,
          rangeAr: r.rangeAr,
          count,
          percentage: totalWallets > 0 ? Math.round((count / totalWallets) * 100) : 0,
        };
      });

      setBalanceDistribution(distribution);

      // Calculate monthly transactions
      const now = new Date();
      const monthlyData: Record<string, { topups: number; withdrawals: number; payments: number }> = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyData[key] = { topups: 0, withdrawals: 0, payments: 0 };
      }

      // Aggregate transactions by month and type
      (transactions || []).forEach((tx) => {
        if (tx.created_at) {
          const date = new Date(tx.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          if (monthlyData[key]) {
            const amount = Number(tx.amount) || 0;
            if (tx.transaction_type === "topup") {
              monthlyData[key].topups += amount;
            } else if (tx.transaction_type === "withdrawal") {
              monthlyData[key].withdrawals += amount;
            } else if (tx.transaction_type === "invoice_payment") {
              monthlyData[key].payments += amount;
            }
          }
        }
      });

      // Convert to array
      const monthly: MonthlyTransaction[] = Object.entries(monthlyData).map(([key, data]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          month: monthNamesEn[month],
          monthAr: monthNamesAr[month],
          topups: data.topups,
          withdrawals: data.withdrawals,
          payments: data.payments,
          total: data.topups + data.withdrawals + data.payments,
        };
      });

      setMonthlyTransactions(monthly);
    } catch (error) {
      console.error("Error fetching wallet analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{isRTL ? payload[0]?.payload?.monthAr : label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {entry.name === "topups"
                  ? isRTL ? "الإيداعات" : "Top-ups"
                  : entry.name === "withdrawals"
                  ? isRTL ? "السحوبات" : "Withdrawals"
                  : isRTL ? "المدفوعات" : "Payments"}
                :
              </span>
              <span className="font-medium" dir="ltr">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">
            {isRTL ? data.rangeAr : data.range}
          </p>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "عدد المحافظ" : "Wallets"}: {data.count}
          </p>
          <p className="text-sm font-medium text-primary">
            {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Balance Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <PieChartIcon className="h-5 w-5 text-primary" />
              </div>
              {isRTL ? "توزيع الأرصدة" : "Balance Distribution"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "تحليل توزيع أرصدة المحافظ حسب الفئات"
                : "Analysis of wallet balance distribution by ranges"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={balanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    label={({ percentage }) => `${percentage}%`}
                    labelLine={false}
                  >
                    {balanceDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="stroke-background stroke-2"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {balanceDistribution.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground truncate">
                    {isRTL ? item.rangeAr : item.range}
                  </span>
                  <span className="font-medium text-foreground ms-auto">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Transactions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
         <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              {isRTL ? "المعاملات الشهرية" : "Monthly Transactions"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isRTL
                ? "تتبع حركة المعاملات خلال الأشهر الماضية"
                : "Track transaction activity over the past months"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTransactions}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTopups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis
                    dataKey={isRTL ? "monthAr" : "month"}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="topups"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorTopups)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorWithdrawals)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="payments"
                    stroke="hsl(var(--chart-3))"
                    fillOpacity={1}
                    fill="url(#colorPayments)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "الإيداعات" : "Top-ups"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "السحوبات" : "Withdrawals"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "المدفوعات" : "Payments"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
