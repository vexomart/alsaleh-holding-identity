/**
 * Finance Transactions Tab - PHASE FIN-4/5 Enhanced
 * Full-text search, exports, timeline, audit trail + micro-animations
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Banknote,
  Download,
  FileText,
  FileSpreadsheet,
  Eye,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TransactionDetailDialog } from './TransactionDetailDialog';
import { 
  exportTransactionsToCSV, 
  downloadCSV, 
  calculateTransactionSummary, 
  generateTransactionReportDefinition,
  type ExportTransaction,
} from '@/lib/financial/export-utils';
import { STATUS_LABELS, TYPE_LABELS } from '@/lib/financial/status-machine';
import type { TransactionStatus, TransactionType } from '@/lib/financial/status-machine';

interface Transaction {
  id: string;
  transaction_type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: string | null;
  provider_reference: string | null;
  description: string | null;
  description_ar: string | null;
  related_invoice_id: string | null;
  related_order_id: string | null;
  customer_user_id: string;
  created_at: string;
  processed_at: string | null;
}

interface EnrichedTransaction extends Transaction {
  customer_uid?: string;
  customer_name?: string;
  invoice_number?: string;
  order_number?: string;
}

const transactionTypes = [
  { value: 'all', labelAr: 'الكل', labelEn: 'All' },
  { value: 'invoice_payment', labelAr: 'دفع فاتورة', labelEn: 'Invoice Payment' },
  { value: 'topup', labelAr: 'شحن رصيد', labelEn: 'Top Up' },
  { value: 'refund', labelAr: 'استرداد', labelEn: 'Refund' },
  { value: 'withdrawal', labelAr: 'سحب', labelEn: 'Withdrawal' },
  { value: 'adjustment', labelAr: 'تعديل', labelEn: 'Adjustment' },
];

const statusOptions = [
  { value: 'all', labelAr: 'الكل', labelEn: 'All' },
  { value: 'pending', labelAr: 'قيد الانتظار', labelEn: 'Pending' },
  { value: 'processing', labelAr: 'قيد المعالجة', labelEn: 'Processing' },
  { value: 'succeeded', labelAr: 'مكتمل', labelEn: 'Succeeded' },
  { value: 'failed', labelAr: 'فشل', labelEn: 'Failed' },
  { value: 'cancelled', labelAr: 'ملغي', labelEn: 'Cancelled' },
  { value: 'refunded', labelAr: 'مسترد', labelEn: 'Refunded' },
];

export function FinanceTransactions() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const prefersReducedMotion = useReducedMotion();
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [highlightedRows, setHighlightedRows] = useState<Set<string>>(new Set());
  const prevTransactionsRef = useRef<Map<string, TransactionStatus>>(new Map());

  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('finance-transactions-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const txId = (payload.new as Transaction).id;
            // Add highlight effect
            if (!prefersReducedMotion) {
              setHighlightedRows(prev => new Set([...prev, txId]));
              setTimeout(() => {
                setHighlightedRows(prev => {
                  const next = new Set(prev);
                  next.delete(txId);
                  return next;
                });
              }, 600);
            }
            fetchTransactions();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter, typeFilter, prefersReducedMotion]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('financial_transactions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(200);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as TransactionStatus);
      }

      if (typeFilter !== 'all') {
        query = query.eq('transaction_type', typeFilter as TransactionType);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      
      setTotalCount(count || 0);

      // Enrich with customer, invoice, order info
      const enrichedData = await enrichTransactions(data || []);
      setTransactions(enrichedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(isRTL ? 'فشل في جلب المعاملات' : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const enrichTransactions = async (txs: Transaction[]): Promise<EnrichedTransaction[]> => {
    if (txs.length === 0) return [];

    // Get unique customer IDs
    const customerIds = [...new Set(txs.map(t => t.customer_user_id))];
    const invoiceIds = [...new Set(txs.filter(t => t.related_invoice_id).map(t => t.related_invoice_id!))];
    const orderIds = [...new Set(txs.filter(t => t.related_order_id).map(t => t.related_order_id!))];

    // Fetch all related data in parallel
    const [customersRes, invoicesRes, ordersRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, customer_uid')
        .in('id', customerIds),
      invoiceIds.length > 0
        ? supabase.from('invoices').select('id, invoice_number').in('id', invoiceIds)
        : Promise.resolve({ data: [] }),
      orderIds.length > 0
        ? supabase.from('orders').select('id, order_number').in('id', orderIds)
        : Promise.resolve({ data: [] }),
    ]);

    // Create lookup maps
    const customerMap = new Map(
      (customersRes.data || []).map(c => [c.id, { name: c.full_name, uid: c.customer_uid }])
    );
    const invoiceMap = new Map(
      (invoicesRes.data || []).map(i => [i.id, i.invoice_number])
    );
    const orderMap = new Map(
      (ordersRes.data || []).map(o => [o.id, o.order_number])
    );

    // Enrich transactions
    return txs.map(tx => ({
      ...tx,
      customer_name: customerMap.get(tx.customer_user_id)?.name || '',
      customer_uid: customerMap.get(tx.customer_user_id)?.uid || '',
      invoice_number: tx.related_invoice_id ? invoiceMap.get(tx.related_invoice_id) || '' : '',
      order_number: tx.related_order_id ? orderMap.get(tx.related_order_id) || '' : '',
    }));
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'invoice_payment':
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case 'refund':
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const configs: Record<string, { icon: React.ElementType; className: string }> = {
      succeeded: {
        icon: CheckCircle2,
        className: 'bg-green-500/10 text-green-600 border-green-500/30',
      },
      pending: {
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      },
      processing: {
        icon: Loader2,
        className: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      },
      failed: {
        icon: XCircle,
        className: 'bg-red-500/10 text-red-600 border-red-500/30',
      },
      cancelled: {
        icon: XCircle,
        className: 'bg-gray-500/10 text-gray-600 border-gray-500/30',
      },
      refunded: {
        icon: RefreshCw,
        className: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    const label = STATUS_LABELS[status];

    return (
      <Badge variant="outline" className={cn('gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {isRTL ? label?.ar : label?.en}
      </Badge>
    );
  };

  // Full-text search across multiple fields
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase().trim();
    return (
      tx.provider_reference?.toLowerCase().includes(search) ||
      tx.description?.toLowerCase().includes(search) ||
      tx.description_ar?.toLowerCase().includes(search) ||
      tx.customer_uid?.toLowerCase().includes(search) ||
      tx.customer_name?.toLowerCase().includes(search) ||
      tx.invoice_number?.toLowerCase().includes(search) ||
      tx.order_number?.toLowerCase().includes(search) ||
      tx.id.toLowerCase().includes(search)
    );
  });

  // Export handlers
  const handleExportCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      const exportData: ExportTransaction[] = filteredTransactions.map(tx => ({
        ...tx,
        transaction_type: tx.transaction_type,
        status: tx.status,
      }));

      const csv = exportTransactionsToCSV(exportData, { language: language as 'ar' | 'en' });
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
      
      toast.success(isRTL ? 'تم تصدير CSV بنجاح' : 'CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(isRTL ? 'فشل التصدير' : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }, [filteredTransactions, language, isRTL]);

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      // Use unified PDF system
      const { ensurePDFReady } = await import('@/lib/pdf');
      await ensurePDFReady();
      
      const pdfMake = (await import('pdfmake/build/pdfmake')).default;

      const exportData: ExportTransaction[] = filteredTransactions.map(tx => ({
        ...tx,
        transaction_type: tx.transaction_type,
        status: tx.status,
      }));

      const summary = calculateTransactionSummary(exportData);
      const docDefinition = generateTransactionReportDefinition(summary, { 
        language: language as 'ar' | 'en' 
      });

      pdfMake.createPdf(docDefinition as never).download(
        `transactions_report_${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      toast.success(isRTL ? 'تم تصدير PDF بنجاح' : 'PDF exported successfully');
    } catch (error) {
      console.error('PDF Export error:', error);
      toast.error(isRTL ? 'فشل تصدير PDF' : 'PDF export failed');
    } finally {
      setIsExporting(false);
    }
  }, [filteredTransactions, language, isRTL]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || typeFilter !== 'all';

  // RTL helpers
  const rtlRow = isRTL ? "flex-row-reverse" : "flex-row";
  const rtlText = isRTL ? "text-right" : "text-left";

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className={cn("w-full", rtlText, !prefersReducedMotion && 'finance-page-enter')}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className={cn(
            "flex flex-col md:flex-row md:items-center gap-4",
            isRTL ? "md:flex-row-reverse" : ""
          )}>
            <div className="flex-1">
              <CardTitle className="text-lg">
                {isRTL ? 'سجل المعاملات المالية' : 'Financial Transactions Log'}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isRTL 
                  ? `${filteredTransactions.length} من ${totalCount} معاملة`
                  : `${filteredTransactions.length} of ${totalCount} transactions`
                }
              </p>
            </div>

            {/* Export Buttons */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting || filteredTransactions.length === 0}>
                  <span className={cn("inline-flex items-center gap-2", rtlRow)}>
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>{isRTL ? 'تصدير' : 'Export'}</span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                <DropdownMenuItem onClick={handleExportCSV} className={rtlRow}>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="mx-2">{isRTL ? 'تصدير CSV' : 'Export CSV'}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF} className={rtlRow}>
                  <FileText className="h-4 w-4" />
                  <span className="mx-2">{isRTL ? 'تقرير PDF' : 'PDF Report'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className={cn(
            "flex flex-col md:flex-row gap-4 mb-6 flex-wrap items-stretch",
            isRTL ? "md:flex-row-reverse" : ""
          )}>
            <div className="relative flex-1 min-w-[200px]">
              <Search className={cn(
                'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
                isRTL ? 'right-3' : 'left-3'
              )} />
              <Input
                placeholder={isRTL 
                  ? 'بحث بالمرجع، رقم العميل، الفاتورة، الطلب...' 
                  : 'Search by reference, customer ID, invoice, order...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(isRTL ? 'pr-10 text-right' : 'pl-10')}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={isRTL ? 'نوع المعاملة' : 'Transaction Type'} />
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
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {isRTL ? status.labelAr : status.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className={rtlText}>
                      {isRTL ? 'المرجع' : 'Reference'}
                    </TableHead>
                    <TableHead className={rtlText}>
                      {isRTL ? 'العميل' : 'Customer'}
                    </TableHead>
                    <TableHead className={rtlText}>
                      {isRTL ? 'النوع' : 'Type'}
                    </TableHead>
                    <TableHead className={rtlText}>
                      {isRTL ? 'المبلغ' : 'Amount'}
                    </TableHead>
                    <TableHead className={rtlText}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </TableHead>
                    <TableHead className={rtlText}>
                      {isRTL ? 'التاريخ' : 'Date'}
                    </TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isRTL ? 'لا توجد معاملات' : 'No transactions found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className={cn(
                          "finance-table-row cursor-pointer",
                          highlightedRows.has(tx.id) && "finance-row-highlight"
                        )}
                        onClick={() => setSelectedTransaction(tx.id)}
                      >
                        <TableCell className={rtlText}>
                          <div className={cn("flex items-center gap-2", rtlRow)}>
                            {getTypeIcon(tx.transaction_type)}
                            <div>
                              <span className="font-mono text-sm tabular-nums" dir="ltr">
                                {tx.provider_reference || tx.id.slice(0, 8)}
                              </span>
                              {tx.invoice_number && (
                                <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                                  {tx.invoice_number}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={rtlText}>
                          <div>
                            <p className="text-sm font-medium">{tx.customer_name || '-'}</p>
                            <p className="text-xs text-muted-foreground font-mono tabular-nums" dir="ltr">
                              {tx.customer_uid}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className={rtlText}>
                          <span className="text-sm">
                            {isRTL 
                              ? TYPE_LABELS[tx.transaction_type]?.ar 
                              : TYPE_LABELS[tx.transaction_type]?.en
                            }
                          </span>
                        </TableCell>
                        <TableCell className={rtlText}>
                          <span
                            className={cn(
                              'font-semibold tabular-nums',
                              tx.transaction_type === 'topup' || tx.transaction_type === 'refund'
                                ? 'text-green-600'
                                : 'text-foreground'
                            )}
                            dir="ltr"
                          >
                            {tx.transaction_type === 'topup' || tx.transaction_type === 'refund' ? '+' : '-'}
                            {formatCurrency(Number(tx.amount), tx.currency)}
                          </span>
                        </TableCell>
                        <TableCell className={rtlText}>
                          {getStatusBadge(tx.status)}
                        </TableCell>
                        <TableCell className={cn("text-muted-foreground text-sm", rtlText)}>
                          {formatDate(tx.created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTransaction(tx.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        transactionId={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
        onStatusChange={fetchTransactions}
      />
    </div>
  );
}
