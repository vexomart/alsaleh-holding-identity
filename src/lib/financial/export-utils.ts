/**
 * Financial Export Utilities - PHASE FIN-4
 * CSV and PDF export for transactions and reports
 */

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import type { TransactionStatus, TransactionType } from './status-machine';
import { STATUS_LABELS, TYPE_LABELS } from './status-machine';

export interface ExportTransaction {
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
  customer_uid?: string;
  customer_name?: string;
  invoice_number?: string;
  order_number?: string;
  created_at: string;
  processed_at?: string | null;
}

export interface ExportOptions {
  language: 'ar' | 'en';
  dateFormat?: string;
  includeHeaders?: boolean;
  filename?: string;
}

/**
 * Format currency for export
 */
function formatCurrency(amount: number, currency: string, language: 'ar' | 'en'): string {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for export
 */
function formatDate(dateStr: string, language: 'ar' | 'en', formatStr: string = 'yyyy-MM-dd HH:mm'): string {
  try {
    return format(new Date(dateStr), formatStr, {
      locale: language === 'ar' ? ar : enUS,
    });
  } catch {
    return dateStr;
  }
}

/**
 * Escape CSV field
 */
function escapeCSV(field: string | null | undefined): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(
  transactions: ExportTransaction[],
  options: ExportOptions
): string {
  const { language, includeHeaders = true } = options;
  const isRTL = language === 'ar';
  
  const headers = isRTL
    ? ['المعرف', 'النوع', 'المبلغ', 'العملة', 'الحالة', 'المزود', 'المرجع', 'رقم العميل', 'اسم العميل', 'رقم الفاتورة', 'رقم الطلب', 'تاريخ الإنشاء', 'تاريخ المعالجة', 'الوصف']
    : ['ID', 'Type', 'Amount', 'Currency', 'Status', 'Provider', 'Reference', 'Customer ID', 'Customer Name', 'Invoice Number', 'Order Number', 'Created At', 'Processed At', 'Description'];
  
  const rows = transactions.map((tx) => [
    tx.id,
    isRTL ? TYPE_LABELS[tx.transaction_type]?.ar || tx.transaction_type : TYPE_LABELS[tx.transaction_type]?.en || tx.transaction_type,
    tx.amount.toString(),
    tx.currency,
    isRTL ? STATUS_LABELS[tx.status]?.ar || tx.status : STATUS_LABELS[tx.status]?.en || tx.status,
    tx.provider || '',
    tx.provider_reference || '',
    tx.customer_uid || tx.customer_user_id,
    tx.customer_name || '',
    tx.invoice_number || '',
    tx.order_number || '',
    formatDate(tx.created_at, language),
    tx.processed_at ? formatDate(tx.processed_at, language) : '',
    (isRTL ? tx.description_ar : tx.description) || '',
  ]);
  
  const csvContent = [
    ...(includeHeaders ? [headers.map(escapeCSV).join(',')] : []),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');
  
  // Add BOM for UTF-8 encoding (Excel compatibility)
  return '\ufeff' + csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate summary statistics for PDF report
 */
export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  byStatus: Record<string, { count: number; amount: number }>;
  byType: Record<string, { count: number; amount: number }>;
  dateRange: { from: string; to: string };
  currency: string;
}

export function calculateTransactionSummary(
  transactions: ExportTransaction[]
): TransactionSummary {
  const summary: TransactionSummary = {
    totalTransactions: transactions.length,
    totalAmount: 0,
    byStatus: {},
    byType: {},
    dateRange: { from: '', to: '' },
    currency: 'SAR',
  };
  
  if (transactions.length === 0) return summary;
  
  let minDate = new Date(transactions[0].created_at);
  let maxDate = new Date(transactions[0].created_at);
  
  transactions.forEach((tx) => {
    // Total amount
    summary.totalAmount += tx.amount;
    
    // By status
    if (!summary.byStatus[tx.status]) {
      summary.byStatus[tx.status] = { count: 0, amount: 0 };
    }
    summary.byStatus[tx.status].count++;
    summary.byStatus[tx.status].amount += tx.amount;
    
    // By type
    if (!summary.byType[tx.transaction_type]) {
      summary.byType[tx.transaction_type] = { count: 0, amount: 0 };
    }
    summary.byType[tx.transaction_type].count++;
    summary.byType[tx.transaction_type].amount += tx.amount;
    
    // Date range
    const txDate = new Date(tx.created_at);
    if (txDate < minDate) minDate = txDate;
    if (txDate > maxDate) maxDate = txDate;
  });
  
  summary.dateRange = {
    from: format(minDate, 'yyyy-MM-dd'),
    to: format(maxDate, 'yyyy-MM-dd'),
  };
  
  summary.currency = transactions[0].currency;
  
  return summary;
}

/**
 * Generate PDF report definition (legacy stub - now handled by invoices module)
 */
export function generateTransactionReportDefinition(
  summary: TransactionSummary,
  options: ExportOptions
): Record<string, unknown> {
  const { language } = options;
  const isRTL = language === 'ar';
  
  const formatAmount = (amount: number) => formatCurrency(amount, summary.currency, language);
  
  const statusRows = Object.entries(summary.byStatus).map(([status, data]) => [
    isRTL ? STATUS_LABELS[status as TransactionStatus]?.ar || status : STATUS_LABELS[status as TransactionStatus]?.en || status,
    data.count.toString(),
    formatAmount(data.amount),
  ]);
  
  const typeRows = Object.entries(summary.byType).map(([type, data]) => [
    isRTL ? TYPE_LABELS[type as TransactionType]?.ar || type : TYPE_LABELS[type as TransactionType]?.en || type,
    data.count.toString(),
    formatAmount(data.amount),
  ]);
  
  return {
    pageOrientation: 'portrait',
    pageSize: 'A4',
    defaultStyle: {
      font: 'Cairo',
      alignment: isRTL ? 'right' : 'left',
    },
    content: [
      {
        text: isRTL ? 'تقرير المعاملات المالية' : 'Financial Transactions Report',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      {
        text: isRTL 
          ? `الفترة: ${summary.dateRange.from} - ${summary.dateRange.to}`
          : `Period: ${summary.dateRange.from} - ${summary.dateRange.to}`,
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      // Summary box
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 0,
          widths: ['*', 'auto'],
          body: [
            [
              { text: isRTL ? 'إجمالي المعاملات' : 'Total Transactions', bold: true },
              summary.totalTransactions.toString(),
            ],
            [
              { text: isRTL ? 'إجمالي المبلغ' : 'Total Amount', bold: true },
              formatAmount(summary.totalAmount),
            ],
          ],
        },
        margin: [0, 0, 0, 20],
      },
      // By Status
      {
        text: isRTL ? 'حسب الحالة' : 'By Status',
        style: 'sectionHeader',
        margin: [0, 10, 0, 10],
      },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: isRTL ? 'الحالة' : 'Status', bold: true },
              { text: isRTL ? 'العدد' : 'Count', bold: true },
              { text: isRTL ? 'المبلغ' : 'Amount', bold: true },
            ],
            ...statusRows,
          ],
        },
        margin: [0, 0, 0, 20],
      },
      // By Type
      {
        text: isRTL ? 'حسب النوع' : 'By Type',
        style: 'sectionHeader',
        margin: [0, 10, 0, 10],
      },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: isRTL ? 'النوع' : 'Type', bold: true },
              { text: isRTL ? 'العدد' : 'Count', bold: true },
              { text: isRTL ? 'المبلغ' : 'Amount', bold: true },
            ],
            ...typeRows,
          ],
        },
      },
      // Footer
      {
        text: isRTL 
          ? `تم إنشاء التقرير في: ${format(new Date(), 'yyyy-MM-dd HH:mm', { locale: ar })}`
          : `Report generated: ${format(new Date(), 'yyyy-MM-dd HH:mm', { locale: enUS })}`,
        style: 'footer',
        alignment: 'center',
        margin: [0, 30, 0, 0],
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        color: '#666666',
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: '#333333',
      },
      footer: {
        fontSize: 9,
        color: '#999999',
      },
    },
  };
}
