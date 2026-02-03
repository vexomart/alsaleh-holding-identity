/**
 * Wallet Statement Dialog - Generate monthly/custom period statement
 * كشف حساب المحفظة - إنشاء كشف حساب شهري أو لفترة محددة
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Calendar,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FinancialTransaction } from "@/types/financial";
import { SELLER_INFO } from "@/lib/invoices/constants";

interface WalletStatementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletNumber: string;
  customerUid: string;
  currentBalance: number;
}

type PeriodOption = 'current_month' | 'last_month' | 'last_3_months' | 'last_6_months';

const periodOptions: { value: PeriodOption; label_ar: string; label_en: string }[] = [
  { value: 'current_month', label_ar: 'الشهر الحالي', label_en: 'Current Month' },
  { value: 'last_month', label_ar: 'الشهر الماضي', label_en: 'Last Month' },
  { value: 'last_3_months', label_ar: 'آخر 3 أشهر', label_en: 'Last 3 Months' },
  { value: 'last_6_months', label_ar: 'آخر 6 أشهر', label_en: 'Last 6 Months' },
];

export function WalletStatementDialog({
  open,
  onOpenChange,
  walletNumber,
  customerUid,
  currentBalance,
}: WalletStatementDialogProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const { user, profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('current_month');
  const [isGenerating, setIsGenerating] = useState(false);

  const getPeriodDates = (period: PeriodOption) => {
    const now = new Date();
    switch (period) {
      case 'current_month':
        return { start: startOfMonth(now), end: now };
      case 'last_month':
        return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
      case 'last_3_months':
        return { start: startOfMonth(subMonths(now, 3)), end: now };
      case 'last_6_months':
        return { start: startOfMonth(subMonths(now, 6)), end: now };
    }
  };

  const periodDates = getPeriodDates(selectedPeriod);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["wallet-statement", user?.id, selectedPeriod],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { start, end } = getPeriodDates(selectedPeriod);
      
      const { data, error } = await supabase
        .from("financial_transactions" as never)
        .select("*")
        .eq("customer_user_id", user.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data || []) as FinancialTransaction[];
    },
    enabled: open && !!user?.id,
  });

  const stats = transactions?.reduce((acc, tx) => {
    const isCredit = ['topup', 'refund'].includes(tx.transaction_type);
    if (isCredit) {
      acc.totalIn += tx.amount;
      acc.inCount++;
    } else {
      acc.totalOut += tx.amount;
      acc.outCount++;
    }
    return acc;
  }, { totalIn: 0, totalOut: 0, inCount: 0, outCount: 0 }) || { totalIn: 0, totalOut: 0, inCount: 0, outCount: 0 };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleGeneratePdf = async () => {
    if (!transactions || transactions.length === 0) return;
    
    setIsGenerating(true);
    try {
      // Generate statement HTML
      const html = generateStatementHTML({
        customerName: profile?.full_name || profile?.full_name_ar || 'العميل',
        customerUid,
        walletNumber,
        periodStart: periodDates.start,
        periodEnd: periodDates.end,
        transactions,
        stats,
        currentBalance,
        isRTL,
      });

      // Create and download PDF
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position: fixed; top: -9999px; left: -9999px; width: 800px; height: 1200px;';
      document.body.appendChild(iframe);
      
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const [html2canvas, { jsPDF }] = await Promise.all([
          import('html2canvas').then(m => m.default),
          import('jspdf')
        ]);
        
        const container = doc.querySelector('.statement-container') as HTMLElement;
        if (container) {
          const canvas = await html2canvas(container, { scale: 2, useCORS: true });
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`wallet-statement-${format(periodDates.start, 'yyyy-MM')}.pdf`);
        }
      }
      
      document.body.removeChild(iframe);
    } catch (error) {
      console.error('Error generating statement:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const transactionTypeIcons: Record<string, React.ElementType> = {
    topup: ArrowDownLeft,
    invoice_payment: Receipt,
    refund: RefreshCw,
    withdrawal: ArrowUpRight,
  };

  const transactionTypeLabels: Record<string, { ar: string; en: string }> = {
    topup: { ar: 'شحن', en: 'Top Up' },
    invoice_payment: { ar: 'دفع', en: 'Payment' },
    refund: { ar: 'استرداد', en: 'Refund' },
    withdrawal: { ar: 'سحب', en: 'Withdrawal' },
    adjustment: { ar: 'تعديل', en: 'Adjustment' },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isRTL ? "كشف حساب المحفظة" : "Wallet Statement"}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "عرض وتحميل كشف حساب المحفظة لفترة محددة"
              : "View and download wallet statement for a specific period"}
          </DialogDescription>
        </DialogHeader>

        {/* Period Selection */}
        <div className="space-y-3">
          <Label>{isRTL ? "اختر الفترة" : "Select Period"}</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {periodOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedPeriod === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(option.value)}
                className="text-xs"
              >
                {isRTL ? option.label_ar : option.label_en}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? "الوارد" : "Income"}
              </span>
            </div>
            <p className="text-lg font-bold text-green-600" dir="ltr">
              +{formatCurrency(stats.totalIn)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.inCount} {isRTL ? "معاملة" : "transactions"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? "الصادر" : "Expenses"}
              </span>
            </div>
            <p className="text-lg font-bold text-red-600" dir="ltr">
              -{formatCurrency(stats.totalOut)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.outCount} {isRTL ? "معاملة" : "transactions"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? "صافي الحركة" : "Net Change"}
              </span>
            </div>
            <p className={cn(
              "text-lg font-bold",
              (stats.totalIn - stats.totalOut) >= 0 ? "text-green-600" : "text-red-600"
            )} dir="ltr">
              {formatCurrency(stats.totalIn - stats.totalOut)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted/50 border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {isRTL ? "عدد المعاملات" : "Transactions"}
              </span>
            </div>
            <p className="text-lg font-bold">
              {(transactions?.length || 0)}
            </p>
          </motion.div>
        </div>

        {/* Transactions List */}
        <div className="border rounded-xl">
          <div className="p-4 bg-muted/30 border-b">
            <h4 className="font-semibold text-sm">
              {isRTL ? "تفاصيل المعاملات" : "Transaction Details"}
            </h4>
          </div>
          <ScrollArea className="h-[250px]">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                {isRTL ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : transactions?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                {isRTL ? "لا توجد معاملات في هذه الفترة" : "No transactions in this period"}
              </div>
            ) : (
              <div className="divide-y">
                {transactions?.map((tx) => {
                  const Icon = transactionTypeIcons[tx.transaction_type] || Receipt;
                  const typeLabel = transactionTypeLabels[tx.transaction_type] || { ar: tx.transaction_type, en: tx.transaction_type };
                  const isCredit = ['topup', 'refund'].includes(tx.transaction_type);

                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          isCredit ? "bg-green-500/10" : "bg-red-500/10"
                        )}>
                          <Icon className={cn("h-5 w-5", isCredit ? "text-green-500" : "text-red-500")} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {isRTL ? typeLabel.ar : typeLabel.en}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(tx.created_at), "dd MMM, HH:mm", {
                              locale: isRTL ? ar : enUS,
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "font-bold",
                        isCredit ? "text-green-600" : "text-red-600"
                      )} dir="ltr">
                        {isCredit ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            {isRTL ? "إغلاق" : "Close"}
          </Button>
          <Button
            onClick={handleGeneratePdf}
            disabled={isGenerating || !transactions?.length}
            className="flex-1 gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isRTL ? "جاري الإنشاء..." : "Generating..."}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {isRTL ? "تحميل PDF" : "Download PDF"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateStatementHTML(data: {
  customerName: string;
  customerUid: string;
  walletNumber: string;
  periodStart: Date;
  periodEnd: Date;
  transactions: FinancialTransaction[];
  stats: { totalIn: number; totalOut: number; inCount: number; outCount: number };
  currentBalance: number;
  isRTL: boolean;
}): string {
  const formatDate = (date: Date) => format(date, 'yyyy/MM/dd');
  const formatCurrency = (amount: number) => `${amount.toLocaleString('ar-SA')} ر.س`;

  const transactionRows = data.transactions.map(tx => {
    const isCredit = ['topup', 'refund'].includes(tx.transaction_type);
    const typeLabel = tx.transaction_type === 'topup' ? 'شحن' : tx.transaction_type === 'invoice_payment' ? 'دفع' : tx.transaction_type;
    return `
      <tr>
        <td>${format(new Date(tx.created_at), 'yyyy/MM/dd HH:mm')}</td>
        <td>${typeLabel}</td>
        <td>${tx.description_ar || tx.description || '-'}</td>
        <td style="color: ${isCredit ? '#10b981' : '#ef4444'}">${isCredit ? '+' : '-'}${formatCurrency(tx.amount)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
        body { font-family: 'Cairo', sans-serif; padding: 40px; color: #1e293b; }
        .statement-container { max-width: 800px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0d9488, #059669); color: white; padding: 30px; border-radius: 16px 16px 0 0; }
        .header h1 { margin: 0 0 8px; font-size: 24px; }
        .header p { margin: 0; opacity: 0.9; }
        .info-section { background: #f8fafc; padding: 20px 30px; border-bottom: 1px solid #e2e8f0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-item label { font-size: 12px; color: #64748b; display: block; margin-bottom: 4px; }
        .info-item span { font-weight: 600; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 20px 30px; background: white; }
        .stat-box { text-align: center; padding: 16px; border-radius: 12px; background: #f1f5f9; }
        .stat-box.green { background: #dcfce7; color: #16a34a; }
        .stat-box.red { background: #fee2e2; color: #dc2626; }
        .stat-label { font-size: 11px; color: #64748b; margin-bottom: 4px; }
        .stat-value { font-size: 18px; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8fafc; padding: 12px; text-align: right; font-size: 12px; color: #64748b; border-bottom: 2px solid #e2e8f0; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 11px; background: #1e293b; color: white; border-radius: 0 0 16px 16px; }
      </style>
    </head>
    <body>
      <div class="statement-container">
        <div class="header">
          <h1>${SELLER_INFO.name_ar}</h1>
          <p>كشف حساب المحفظة</p>
        </div>
        
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <label>اسم العميل</label>
              <span>${data.customerName}</span>
            </div>
            <div class="info-item">
              <label>رقم العميل</label>
              <span>${data.customerUid}</span>
            </div>
            <div class="info-item">
              <label>رقم المحفظة</label>
              <span>${data.walletNumber}</span>
            </div>
            <div class="info-item">
              <label>الفترة</label>
              <span>${formatDate(data.periodStart)} - ${formatDate(data.periodEnd)}</span>
            </div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-box green">
            <div class="stat-label">إجمالي الوارد</div>
            <div class="stat-value">+${formatCurrency(data.stats.totalIn)}</div>
          </div>
          <div class="stat-box red">
            <div class="stat-label">إجمالي الصادر</div>
            <div class="stat-value">-${formatCurrency(data.stats.totalOut)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">صافي الحركة</div>
            <div class="stat-value">${formatCurrency(data.stats.totalIn - data.stats.totalOut)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">الرصيد الحالي</div>
            <div class="stat-value">${formatCurrency(data.currentBalance)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>نوع المعاملة</th>
              <th>الوصف</th>
              <th>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${transactionRows || '<tr><td colspan="4" style="text-align:center;padding:40px;color:#64748b;">لا توجد معاملات</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <p>${SELLER_INFO.name_en} | ${SELLER_INFO.phone} | ${SELLER_INFO.email}</p>
          <p>تم إنشاء هذا الكشف بتاريخ ${format(new Date(), 'yyyy/MM/dd HH:mm')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
