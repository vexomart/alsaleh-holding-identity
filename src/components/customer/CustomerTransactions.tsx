/**
 * Customer Transactions Page
 * Transaction history with filters and links to orders/invoices
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  description_ar: string | null;
  related_invoice_id: string | null;
  related_order_id: string | null;
  created_at: string;
}

export function CustomerTransactions() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user?.id) return;
    fetchTransactions();
  }, [user?.id, statusFilter]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("financial_transactions")
        .select("*")
        .eq("customer_user_id", user!.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "pending" | "processing" | "succeeded" | "failed" | "refunded" | "cancelled");
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topup": return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "invoice_payment": return <Receipt className="h-4 w-4 text-blue-500" />;
      case "refund": return <RefreshCw className="h-4 w-4 text-amber-500" />;
      default: return <Banknote className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; label: { ar: string; en: string } }> = {
      succeeded: { className: "bg-green-500/10 text-green-600 border-green-500/30", label: { ar: "مكتمل", en: "Completed" } },
      pending: { className: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: { ar: "قيد الانتظار", en: "Pending" } },
      failed: { className: "bg-red-500/10 text-red-600 border-red-500/30", label: { ar: "فشل", en: "Failed" } },
    };
    const config = configs[status] || configs.pending;
    return <Badge variant="outline" className={config.className}>{isRTL ? config.label.ar : config.label.en}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      topup: { ar: "شحن رصيد", en: "Top Up" },
      refund: { ar: "استرداد", en: "Refund" },
      adjustment: { ar: "تعديل", en: "Adjustment" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={isRTL ? "text-right" : "text-left"}>
        <h1 className="text-2xl font-bold">{isRTL ? "سجل المعاملات" : "Transaction History"}</h1>
        <p className="text-muted-foreground mt-1">{isRTL ? "تتبع جميع معاملاتك المالية" : "Track all your financial transactions"}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
              <Input placeholder={isRTL ? "بحث..." : "Search..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={isRTL ? "pr-10" : "pl-10"} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? "الكل" : "All"}</SelectItem>
                <SelectItem value="succeeded">{isRTL ? "مكتمل" : "Completed"}</SelectItem>
                <SelectItem value="pending">{isRTL ? "قيد الانتظار" : "Pending"}</SelectItem>
                <SelectItem value="failed">{isRTL ? "فشل" : "Failed"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{isRTL ? "لا توجد معاملات" : "No transactions found"}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">{getTypeIcon(tx.transaction_type)}</div>
                    <div>
                      <p className="font-medium">{getTypeLabel(tx.transaction_type)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className={cn("font-bold", tx.transaction_type === "topup" || tx.transaction_type === "refund" ? "text-green-600" : "")} dir="ltr">
                        {tx.transaction_type === "topup" || tx.transaction_type === "refund" ? "+" : "-"}{formatCurrency(Number(tx.amount))}
                      </p>
                      {getStatusBadge(tx.status)}
                    </div>
                    {tx.related_order_id && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/app/orders/${tx.related_order_id}`}><ExternalLink className="h-4 w-4" /></Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
