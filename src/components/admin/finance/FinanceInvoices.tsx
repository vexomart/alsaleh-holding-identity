/**
 * Finance Invoices Tab
 * List paid/unpaid invoices with export options
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
  Download,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  customer_id: string;
  status: string;
  subtotal: number;
  vat_amount: number;
  total: number;
  currency: string;
  payment_url: string | null;
  created_at: string;
  paid_at: string | null;
}

const statusOptions = [
  { value: "all", labelAr: "الكل", labelEn: "All" },
  { value: "issued", labelAr: "صادرة", labelEn: "Issued" },
  { value: "paid", labelAr: "مدفوعة", labelEn: "Paid" },
  { value: "overdue", labelAr: "متأخرة", labelEn: "Overdue" },
  { value: "cancelled", labelAr: "ملغاة", labelEn: "Cancelled" },
];

export function FinanceInvoices() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "draft" | "issued" | "paid" | "cancelled" | "overdue");
      }

      const { data, error } = await query;

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { icon: any; className: string; label: { ar: string; en: string } }> = {
      paid: {
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-600 border-green-500/30",
        label: { ar: "مدفوعة", en: "Paid" },
      },
      issued: {
        icon: Clock,
        className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        label: { ar: "صادرة", en: "Issued" },
      },
      overdue: {
        icon: AlertCircle,
        className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        label: { ar: "متأخرة", en: "Overdue" },
      },
      cancelled: {
        icon: XCircle,
        className: "bg-red-500/10 text-red-600 border-red-500/30",
        label: { ar: "ملغاة", en: "Cancelled" },
      },
      draft: {
        icon: FileText,
        className: "bg-gray-500/10 text-gray-600 border-gray-500/30",
        label: { ar: "مسودة", en: "Draft" },
      },
    };

    const config = configs[status] || configs.draft;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={cn("gap-1", config.className)}>
        <Icon className="h-3 w-3" />
        {isRTL ? config.label.ar : config.label.en}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ["Invoice Number", "Status", "Subtotal", "VAT", "Total", "Date", "Paid At"];
    const rows = invoices.map((inv) => [
      inv.invoice_number,
      inv.status,
      inv.subtotal,
      inv.vat_amount,
      inv.total,
      formatDate(inv.created_at),
      formatDate(inv.paid_at),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchTerm) return true;
    return inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Stats
  const paidTotal = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + Number(i.total), 0);
  const unpaidTotal = invoices.filter((i) => i.status !== "paid" && i.status !== "cancelled").reduce((sum, i) => sum + Number(i.total), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "الفواتير المدفوعة" : "Paid Invoices"}
                </span>
                <div className="text-2xl font-bold text-green-600" dir="ltr">
                  {formatCurrency(paidTotal)}
                </div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-muted-foreground">
                  {isRTL ? "مستحقات غير مدفوعة" : "Unpaid Amount"}
                </span>
                <div className="text-2xl font-bold text-amber-600" dir="ltr">
                  {formatCurrency(unpaidTotal)}
                </div>
              </div>
              <Clock className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {isRTL ? "سجل الفواتير" : "Invoices Log"}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 me-2" />
              {isRTL ? "تصدير CSV" : "Export CSV"}
            </Button>
          </div>
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
                placeholder={isRTL ? "بحث برقم الفاتورة..." : "Search by invoice number..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? "pr-10" : "pl-10"}
              />
            </div>
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
                      {isRTL ? "رقم الفاتورة" : "Invoice #"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "المبلغ" : "Subtotal"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "الضريبة" : "VAT"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "الإجمالي" : "Total"}
                    </TableHead>
                    <TableHead className={isRTL ? "text-right" : "text-left"}>
                      {isRTL ? "التاريخ" : "Date"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {isRTL ? "لا توجد فواتير" : "No invoices found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-muted/30">
                        <TableCell>
                          <span className="font-mono text-sm font-medium" dir="ltr">
                            {inv.invoice_number}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(inv.status)}
                        </TableCell>
                        <TableCell dir="ltr">
                          {formatCurrency(Number(inv.subtotal), inv.currency)}
                        </TableCell>
                        <TableCell dir="ltr">
                          {formatCurrency(Number(inv.vat_amount), inv.currency)}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold" dir="ltr">
                            {formatCurrency(Number(inv.total), inv.currency)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(inv.created_at)}
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
    </div>
  );
}
