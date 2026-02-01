/**
 * Invoices Table - Desktop RTL table view
 */

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Eye, 
  Download, 
  ArrowUpDown, 
} from 'lucide-react';
import { CustomerInvoice, InvoicesSort, SortField } from './types';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoicesTableProps {
  invoices: CustomerInvoice[];
  isLoading: boolean;
  sort: InvoicesSort;
  onSort: (field: SortField) => void;
  onRowClick: (invoice: CustomerInvoice) => void;
  onDownload?: (invoice: CustomerInvoice) => void;
  selectedInvoiceId?: string;
}

export function InvoicesTable({
  invoices,
  isLoading,
  sort,
  onSort,
  onRowClick,
  onDownload,
  selectedInvoiceId,
}: InvoicesTableProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const reducedMotion = useReducedMotion();

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {children}
      <ArrowUpDown className={cn(
        "h-3 w-3",
        sort.field === field && "text-primary"
      )} />
    </button>
  );

  // Loading skeleton
  if (isLoading && invoices.length === 0) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table dir={isRTL ? 'rtl' : 'ltr'}>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'الحالة' : 'Status'}</TableHead>
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'رقم الفاتورة' : 'Invoice #'}</TableHead>
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'مرتبط بالطلب' : 'Order'}</TableHead>
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'التاريخ' : 'Date'}</TableHead>
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'الإجمالي' : 'Total'}</TableHead>
              <TableHead className={cn("h-12", isRTL && "text-right")}>{isRTL ? 'الضريبة' : 'VAT'}</TableHead>
              <TableHead className={cn("h-12 w-[100px]", isRTL ? "text-left" : "text-right")}>{isRTL ? 'إجراء' : 'Action'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table dir={isRTL ? 'rtl' : 'ltr'}>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              {isRTL ? 'الحالة' : 'Status'}
            </TableHead>
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              {isRTL ? 'رقم الفاتورة' : 'Invoice #'}
            </TableHead>
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              {isRTL ? 'مرتبط بالطلب' : 'Order'}
            </TableHead>
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              <SortHeader field="created_at">
                {isRTL ? 'التاريخ' : 'Date'}
              </SortHeader>
            </TableHead>
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              <SortHeader field="total">
                {isRTL ? 'الإجمالي (ر.س)' : 'Total (SAR)'}
              </SortHeader>
            </TableHead>
            <TableHead className={cn("h-12 font-semibold", isRTL && "text-right")}>
              {isRTL ? 'الضريبة 15%' : 'VAT 15%'}
            </TableHead>
            <TableHead className={cn("h-12 w-[100px] font-semibold", isRTL ? "text-left" : "text-right")}>
              {isRTL ? 'إجراء' : 'Action'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => {
            const isSelected = selectedInvoiceId === invoice.id;
            
            return (
              <motion.tr
                key={invoice.id}
                initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reducedMotion ? 0 : index * 0.03 }}
                onClick={() => onRowClick(invoice)}
                className={cn(
                  "cursor-pointer transition-colors border-b",
                  isSelected 
                    ? "bg-primary/5 hover:bg-primary/10" 
                    : "hover:bg-muted/50"
                )}
              >
                <TableCell className={cn(isRTL && "text-right")}>
                  <InvoiceStatusBadge status={invoice.status} size="sm" />
                </TableCell>
                <TableCell className={cn(isRTL && "text-right")}>
                  <span dir="ltr" className="font-mono text-sm text-muted-foreground tabular-nums inline-block bg-muted/50 px-2 py-0.5 rounded">
                    {invoice.invoice_number}
                  </span>
                </TableCell>
                <TableCell className={cn(isRTL && "text-right")}>
                  {invoice.order ? (
                    <span dir="ltr" className="font-mono text-xs text-muted-foreground tabular-nums">
                      {invoice.order.order_number}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className={cn(isRTL && "text-right")}>
                  <span className="text-sm">{formatDate(invoice.created_at)}</span>
                </TableCell>
                <TableCell className={cn(isRTL && "text-right")}>
                  <span dir="ltr" className="font-mono text-sm font-medium tabular-nums">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </TableCell>
                <TableCell className={cn(isRTL && "text-right")}>
                  <span dir="ltr" className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatCurrency(invoice.vat_amount, invoice.currency)}
                  </span>
                </TableCell>
                <TableCell className={cn(isRTL ? "text-left" : "text-right")} onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onRowClick(invoice)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onDownload(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
