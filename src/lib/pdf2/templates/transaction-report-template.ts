/**
 * TRANSACTION REPORT PDF TEMPLATE
 * 
 * Arabic RTL financial transactions report
 */

import { 
  type DocDefinition,
  arabicDocumentStyles,
  rtl, 
  ltr, 
  formatCurrency,
  createRtlTable,
  PDF_COLORS,
  PDF_SPACING,
} from '../core';

// Transaction report types
export interface TransactionItem {
  id: string;
  date: string;
  type: string;
  typeAr: string;
  description: string;
  descriptionAr?: string;
  amount: number;
  status: string;
  statusAr: string;
}

export interface TransactionSummary {
  startDate: string;
  endDate: string;
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  currency: string;
  transactions: TransactionItem[];
}

export interface TransactionReportOptions {
  language?: 'ar' | 'en';
}

/**
 * Build transaction report document definition
 */
export function buildTransactionReportDoc(
  summary: TransactionSummary,
  options: TransactionReportOptions = {}
): DocDefinition {
  const lang = options.language || 'ar';
  const isAr = lang === 'ar';
  const currency = summary.currency || 'SAR';
  
  // Table configuration
  const headers = isAr 
    ? ['الحالة', 'المبلغ', 'الوصف', 'النوع', 'التاريخ', 'الرقم']
    : ['Status', 'Amount', 'Description', 'Type', 'Date', 'ID'];
  
  const rows = summary.transactions.map(tx => [
    isAr ? tx.statusAr : tx.status,
    formatCurrency(tx.amount, currency),
    isAr ? (tx.descriptionAr || tx.description) : tx.description,
    isAr ? tx.typeAr : tx.type,
    tx.date,
    tx.id.substring(0, 8),
  ]);
  
  const content: unknown[] = [
    // Header
    {
      text: rtl(isAr ? 'تقرير المعاملات المالية' : 'Financial Transactions Report'),
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, PDF_SPACING[8]],
    },
    
    // Period
    {
      text: isAr 
        ? `${rtl('الفترة:')} ${ltr(summary.startDate)} - ${ltr(summary.endDate)}`
        : `Period: ${summary.startDate} - ${summary.endDate}`,
      alignment: isAr ? 'right' : 'left',
      margin: [0, 0, 0, PDF_SPACING[8]],
    },
    
    // Summary cards
    {
      columns: [
        {
          stack: [
            { text: rtl(isAr ? 'صافي الرصيد' : 'Net Balance'), bold: true, alignment: 'right' },
            { 
              text: formatCurrency(summary.netAmount, currency), 
              alignment: 'right', 
              fontSize: 14,
              color: summary.netAmount >= 0 ? PDF_COLORS.success : PDF_COLORS.error,
            },
          ],
          width: '*',
        },
        {
          stack: [
            { text: rtl(isAr ? 'المصروفات' : 'Expenses'), bold: true, alignment: 'right' },
            { text: formatCurrency(summary.totalExpense, currency), alignment: 'right', color: PDF_COLORS.error },
          ],
          width: '*',
        },
        {
          stack: [
            { text: rtl(isAr ? 'الإيرادات' : 'Income'), bold: true, alignment: 'right' },
            { text: formatCurrency(summary.totalIncome, currency), alignment: 'right', color: PDF_COLORS.success },
          ],
          width: '*',
        },
        {
          stack: [
            { text: rtl(isAr ? 'عدد المعاملات' : 'Transactions'), bold: true, alignment: 'right' },
            { text: ltr(summary.totalTransactions), alignment: 'right' },
          ],
          width: '*',
        },
      ],
      margin: [0, 0, 0, PDF_SPACING[12]],
    },
    
    // Transactions table
    { 
      text: rtl(isAr ? 'تفاصيل المعاملات' : 'Transaction Details'), 
      style: 'subheader', 
      margin: [0, PDF_SPACING[4], 0, PDF_SPACING[4]] 
    },
    createRtlTable({
      headers,
      rows,
      widths: [60, 70, '*', 60, 70, 50],
      numericCols: [1, 5],
    }),
  ];
  
  return {
    ...arabicDocumentStyles,
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [40, 60, 40, 60],
    content,
    info: {
      title: isAr ? 'تقرير المعاملات المالية' : 'Financial Transactions Report',
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${ltr(currentPage)} / ${ltr(pageCount)}`,
      alignment: 'center',
      style: 'footer',
      margin: [0, 20, 0, 0],
    }),
  };
}
