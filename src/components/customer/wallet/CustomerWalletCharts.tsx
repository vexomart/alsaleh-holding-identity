/**
 * Customer Wallet Analytics Charts
 * Monthly spending and deposits tracking with modern design
 */

import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, PiggyBank } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyData {
  month: string;
  monthAr: string;
  deposits: number;
  spending: number;
}

interface CategoryData {
  name: string;
  nameAr: string;
  value: number;
  color: string;
}

export function CustomerWalletCharts() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [totals, setTotals] = useState({ deposits: 0, spending: 0 });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get last 6 months of transactions
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: transactions } = await supabase
        .from("financial_transactions")
        .select("transaction_type, amount, created_at, status, description")
        .eq("customer_user_id", user.id)
        .eq("status", "succeeded")
        .gte("created_at", sixMonthsAgo.toISOString())
        .order("created_at", { ascending: true });

      if (transactions) {
        // Process monthly data
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthNamesAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        
        const monthlyMap: Record<string, { deposits: number; spending: number }> = {};
        let totalDeposits = 0;
        let totalSpending = 0;

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          monthlyMap[key] = { deposits: 0, spending: 0 };
        }

        // Aggregate transactions
        transactions.forEach(tx => {
          const date = new Date(tx.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          
          if (monthlyMap[key]) {
            if (tx.transaction_type === "topup" || tx.transaction_type === "refund") {
              monthlyMap[key].deposits += Number(tx.amount);
              totalDeposits += Number(tx.amount);
            } else if (tx.transaction_type === "invoice_payment" || tx.transaction_type === "withdrawal" || tx.transaction_type === "fee") {
              monthlyMap[key].spending += Number(tx.amount);
              totalSpending += Number(tx.amount);
            }
          }
        });

        // Convert to array
        const monthly = Object.entries(monthlyMap).map(([key, data]) => {
          const [year, month] = key.split("-").map(Number);
          return {
            month: monthNames[month],
            monthAr: monthNamesAr[month],
            deposits: data.deposits,
            spending: data.spending,
          };
        });

        setMonthlyData(monthly);
        setTotals({ deposits: totalDeposits, spending: totalSpending });

        // Category breakdown for spending
        const categories: CategoryData[] = [
          { 
            name: "Service Payments", 
            nameAr: "دفعات الخدمات", 
            value: transactions.filter(t => t.transaction_type === "invoice_payment").reduce((sum, t) => sum + Number(t.amount), 0),
            color: "hsl(var(--primary))"
          },
          { 
            name: "Withdrawals", 
            nameAr: "السحوبات", 
            value: transactions.filter(t => t.transaction_type === "withdrawal").reduce((sum, t) => sum + Number(t.amount), 0),
            color: "hsl(var(--destructive))"
          },
          { 
            name: "Fees", 
            nameAr: "الرسوم", 
            value: transactions.filter(t => t.transaction_type === "fee").reduce((sum, t) => sum + Number(t.amount), 0),
            color: "hsl(var(--muted-foreground))"
          },
        ].filter(c => c.value > 0);

        setCategoryData(categories);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    deposits: {
      label: isRTL ? "الإيداعات" : "Deposits",
      color: "hsl(142, 76%, 36%)",
    },
    spending: {
      label: isRTL ? "الإنفاق" : "Spending",
      color: "hsl(var(--destructive))",
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "إجمالي الإيداعات" : "Total Deposits"}
                </p>
                <p className="text-xl font-bold text-green-600">
                  {totals.deposits.toLocaleString()} <span className="text-sm font-normal">{isRTL ? "ر.س" : "SAR"}</span>
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "إجمالي الإنفاق" : "Total Spending"}
                </p>
                <p className="text-xl font-bold text-red-600">
                  {totals.spending.toLocaleString()} <span className="text-sm font-normal">{isRTL ? "ر.س" : "SAR"}</span>
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {isRTL ? "النشاط الشهري" : "Monthly Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="depositsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey={isRTL ? "monthAr" : "month"} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  reversed={isRTL}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  orientation={isRTL ? "right" : "left"}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  fill="url(#depositsGradient)"
                  name={isRTL ? "الإيداعات" : "Deposits"}
                />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  fill="url(#spendingGradient)"
                  name={isRTL ? "الإنفاق" : "Spending"}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              {isRTL ? "توزيع الإنفاق" : "Spending Breakdown"}
            </CardTitle>
          </CardHeader>
          <CardContent>
        {categoryData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ChartContainer config={chartConfig} className="h-[160px] w-[160px]">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex-1 space-y-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isRTL ? category.nameAr : category.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {category.value.toLocaleString()} {isRTL ? "ر.س" : "SAR"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[160px] flex items-center justify-center text-muted-foreground text-sm">
                {isRTL ? "لا توجد بيانات إنفاق" : "No spending data"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
