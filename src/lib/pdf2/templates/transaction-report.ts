/**
 * TRANSACTION REPORT PDF TEMPLATE — Arabic RTL Corporate
 * 
 * Returns a pdfmake document definition ONLY.
 * Does NOT call createPdf — that's done in render.ts.
 */

import { FONT_NAME } from '../init';
import { rtl, ltr, formatCurrency, createRtlTable, arabicDefaultStyles } from '../arabic';
import type { DocDefinition } from '../render';

// Transaction report types
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

/**
 * Build transaction report document definition
 */
export function buildTransactionReportDocDefinition(
  summary: TransactionSummary,
  options?: { language?: 'ar' | 'en' }
): DocDefinition {
  const lang = options?.language || 'ar';
  const isAr = lang === 'ar';
  const currency = summary.currency || 'SAR';
  
  // Transaction table
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
      margin: [0, 0, 0, 20],
    },
    
    // Period
    {
      text: isAr 
        ? `${rtl('الفترة:')} ${ltr(summary.startDate)} - ${ltr(summary.endDate)}`
        : `Period: ${summary.startDate} - ${summary.endDate}`,
      alignment: isAr ? 'right' : 'left',
      margin: [0, 0, 0, 20],
    },
    
    // Summary cards
    {
      columns: [
        {
          stack: [
            { text: rtl(isAr ? 'صافي الرصيد' : 'Net Balance'), bold: true, alignment: 'right' },
            { text: formatCurrency(summary.netAmount, currency), alignment: 'right', fontSize: 14 },
          ],
          width: '*',
        },
        {
          stack: [
            { text: rtl(isAr ? 'المصروفات' : 'Expenses'), bold: true, alignment: 'right' },
            { text: formatCurrency(summary.totalExpense, currency), alignment: 'right', color: '#dc2626' },
          ],
          width: '*',
        },
        {
          stack: [
            { text: rtl(isAr ? 'الإيرادات' : 'Income'), bold: true, alignment: 'right' },
            { text: formatCurrency(summary.totalIncome, currency), alignment: 'right', color: '#059669' },
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
      margin: [0, 0, 0, 30],
    },
    
    // Transactions table
    { text: rtl(isAr ? 'تفاصيل المعاملات' : 'Transaction Details'), style: 'subheader', margin: [0, 10, 0, 10] },
    createRtlTable({
      headers,
      rows,
      widths: [60, 70, '*', 60, 70, 50],
      numericCols: [1, 5], // Amount and ID
    }),
  ];
  
  return {
    ...arabicDefaultStyles,
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

/**
 * Convenience: create and download report
 */
export async function createTransactionReportPDF(
  summary: TransactionSummary,
  options?: { language?: 'ar' | 'en'; download?: boolean }
): Promise<Blob> {
  const { createPdfBlob } = await import('../render');
  const { safeDownloadPdf } = await import('../download');
  
  const doc = buildTransactionReportDocDefinition(summary, options);
  const blob = await createPdfBlob(doc);
  
  if (options?.download) {
    const filename = `transactions-report-${summary.startDate}-${summary.endDate}.pdf`;
    safeDownloadPdf(blob, filename);
  }
  
  return blob;
}
