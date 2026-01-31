/**
 * Finance Transactions Tab
 * Powerful table with filters: status/type/date/customer/invoice/order
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  provider: string | null;
  provider_reference: string | null;
  description: string | null;
  description_ar: string | null;
  related_invoice_id: string | null;
  related_order_id: string | null;
  customer_user_id: string;
  created_at: string;
}

const transactionTypes = [
  { value: "all", labelAr: "الكل", labelEn: "All" },
  { value: "invoice_payment", labelAr: "دفع فاتورة", labelEn: "Invoice Payment" },
  { value: "topup", labelAr: "شحن رصيد", labelEn: "Top Up" },
  { value: "refund", labelAr: "استرداد", labelEn: "Refund" },
  { value: "withdrawal", labelAr: "سحب", labelEn: "Withdrawal" },
  { value: "adjustment", labelAr: "تعديل", labelEn: "Adjustment" },
];

const statusOptions = [
  { value: "all", labelAr: "الكل", labelEn: "All" },
  { value: "pending", labelAr: "قيد الانتظار", labelEn: "Pending" },
  { value: "processing", labelAr: "قيد المعالجة", labelEn: "Processing" },
  { value: "succeeded", labelAr: "مكتمل", labelEn: "Succeeded" },
  { value: "failed", labelAr: "فشل", labelEn: "Failed" },
  { value: "cancelled", labelAr: "ملغي", labelEn: "Cancelled" },
];

export function FinanceTransactions() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, typeFilter]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("financial_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "pending" | "processing" | "succeeded" | "failed" | "refunded" | "cancelled");
      }

      if (typeFilter !== "all") {
        query = query.eq("transaction_type", typeFilter as "invoice_payment" | "refund" | "topup" | "withdrawal" | "adjustment" | "transfer" | "fee");
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

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency,
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
      case "topup":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "invoice_payment":
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: any; className: string; label: { ar: string; en: string } }> = {
      succeeded: {
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-600 border-green-500/30",
        label: { ar: "مكتمل", en: "Succeeded" },
      },
      pending: {
        icon: Clock,
        className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        label: { ar: "قيد الانتظار", en: "Pending" },
      },
      processing: {
        icon: Loader2,
        className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        label: { ar: "قيد المعالجة", en: "Processing" },
      },
      failed: {
        icon: XCircle,
        className: "bg-red-500/10 text-red-600 border-red-500/30",
        label: { ar: "فشل", en: "Failed" },
      },
      cancelled: {
        icon: XCircle,
        className: "bg-gray-500/10 text-gray-600 border-gray-500/30",
        label: { ar: "ملغي", en: "Cancelled" },
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("gap-1", config.className)}>
        <Icon className="h-3 w-3" />
        {isRTL ? config.label.ar : config.label.en}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      invoice_payment: { ar: "دفع فاتورة", en: "Invoice Payment" },
      topup: { ar: "شحن رصيد", en: "Top Up" },
      refund: { ar: "استرداد", en: "Refund" },
      withdrawal: { ar: "سحب", en: "Withdrawal" },
      adjustment: { ar: "تعديل", en: "Adjustment" },
      transfer: { ar: "تحويل", en: "Transfer" },
      fee: { ar: "رسوم", en: "Fee" },
    };
    return labels[type]?.[isRTL ? "ar" : "en"] || type;
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      tx.provider_reference?.toLowerCase().includes(search) ||
      tx.description?.toLowerCase().includes(search) ||
      tx.description_ar?.toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {isRTL ? "سجل المعاملات المالية" : "Financial Transactions Log"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
              isRTL ? "right-3" : "left-3"
            )} />
            <Input
              placeholder={isRTL ? "بحث بالمرجع أو الوصف..." : "Search by reference or description..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={isRTL ? "pr-10" : "pl-10"}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={isRTL ? "نوع المعاملة" : "Transaction Type"} />
            </SelectTrigger>
            <SelectContent>
              {transactionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {isRTL ? type.labelAr : type.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={isRTL ? "الحالة" : "Status"} />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {isRTL ? status.labelAr : status.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                    {isRTL ? "المرجع" : "Reference"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {isRTL ? "النوع" : "Type"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {isRTL ? "المبلغ" : "Amount"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {isRTL ? "الحالة" : "Status"}
                  </TableHead>
                  <TableHead className={isRTL ? "text-right" : "text-left"}>
                    {isRTL ? "التاريخ" : "Date"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {isRTL ? "لا توجد معاملات" : "No transactions found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.transaction_type)}
                          <span className="font-mono text-sm" dir="ltr">
                            {tx.provider_reference || tx.id.slice(0, 8)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeLabel(tx.transaction_type)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-semibold",
                            tx.transaction_type === "topup" || tx.transaction_type === "refund"
                              ? "text-green-600"
                              : "text-foreground"
                          )}
                          dir="ltr"
                        >
                          {tx.transaction_type === "topup" || tx.transaction_type === "refund" ? "+" : "-"}
                          {formatCurrency(Number(tx.amount), tx.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(tx.created_at)}
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
  );
}
