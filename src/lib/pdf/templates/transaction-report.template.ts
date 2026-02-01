/**
 * Transaction Report PDF Generator
 * 
 * Uses the unified PDF core for generating financial transaction reports.
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { initPdf } from '../core/pdf-core';
import { ARABIC_FONT_NAME } from '../core/fonts';
import { downloadBlob } from '../core/download';
import { formatCurrency } from '../core/arabic-utils';

export interface TransactionReportData {
  totalTransactions: number;
  totalAmount: number;
  currency: string;
  dateRange: { from: string; to: string };
  byStatus: Record<string, { count: number; amount: number }>;
  byType: Record<string, { count: number; amount: number }>;
}

export interface CreateTransactionReportOptions {
  language?: 'ar' | 'en';
  download?: boolean;
  filename?: string;
}

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  pending: { ar: 'قيد الانتظار', en: 'Pending' },
  completed: { ar: 'مكتملة', en: 'Completed' },
  failed: { ar: 'فاشلة', en: 'Failed' },
  refunded: { ar: 'مستردة', en: 'Refunded' },
};

const TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  deposit: { ar: 'إيداع', en: 'Deposit' },
  withdrawal: { ar: 'سحب', en: 'Withdrawal' },
  payment: { ar: 'دفع', en: 'Payment' },
  refund: { ar: 'استرداد', en: 'Refund' },
  transfer: { ar: 'تحويل', en: 'Transfer' },
};

/**
 * Create a transaction report PDF using the unified core
 */
export async function createTransactionReportPDF(
  data: TransactionReportData,
  options: CreateTransactionReportOptions = {}
): Promise<{ blob: Blob }> {
  // Initialize PDF system (throws if Cairo not loaded)
  await initPdf();

  const { language = 'ar', download = true, filename } = options;
  const isRTL = language === 'ar';

  const formatAmount = (amount: number) => formatCurrency(amount, data.currency);

  const statusRows = Object.entries(data.byStatus).map(([status, info]) => [
    isRTL ? STATUS_LABELS[status]?.ar || status : STATUS_LABELS[status]?.en || status,
    info.count.toString(),
    formatAmount(info.amount),
  ]);

  const typeRows = Object.entries(data.byType).map(([type, info]) => [
    isRTL ? TYPE_LABELS[type]?.ar || type : TYPE_LABELS[type]?.en || type,
    info.count.toString(),
    formatAmount(info.amount),
  ]);

  const docDefinition = {
    pageOrientation: 'portrait' as const,
    pageSize: 'A4' as const,
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: ARABIC_FONT_NAME,
      alignment: isRTL ? 'right' as const : 'left' as const,
    },
    styles: {
      header: { fontSize: 24, bold: true, font: ARABIC_FONT_NAME },
      subheader: { fontSize: 14, color: '#64748b', font: ARABIC_FONT_NAME },
      tableHeader: { fontSize: 11, bold: true, color: '#1e293b', font: ARABIC_FONT_NAME },
      tableCell: { fontSize: 10, font: ARABIC_FONT_NAME },
    },
    content: [
      {
        text: isRTL ? 'تقرير المعاملات المالية' : 'Financial Transactions Report',
        style: 'header',
        alignment: 'center' as const,
        margin: [0, 0, 0, 20],
      },
      {
        text: isRTL
          ? `الفترة: ${data.dateRange.from} - ${data.dateRange.to}`
          : `Period: ${data.dateRange.from} - ${data.dateRange.to}`,
        style: 'subheader',
        alignment: 'center' as const,
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
              { text: isRTL ? 'إجمالي المعاملات' : 'Total Transactions', bold: true, font: ARABIC_FONT_NAME },
              { text: data.totalTransactions.toString(), font: ARABIC_FONT_NAME },
            ],
            [
              { text: isRTL ? 'إجمالي المبلغ' : 'Total Amount', bold: true, font: ARABIC_FONT_NAME },
              { text: formatAmount(data.totalAmount), font: ARABIC_FONT_NAME },
            ],
          ],
        },
        margin: [0, 0, 0, 30],
      },
      // By Status
      {
        text: isRTL ? 'حسب الحالة' : 'By Status',
        style: 'header',
        fontSize: 16,
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 80, 120],
          body: [
            [
              { text: isRTL ? 'الحالة' : 'Status', style: 'tableHeader', font: ARABIC_FONT_NAME },
              { text: isRTL ? 'العدد' : 'Count', style: 'tableHeader', font: ARABIC_FONT_NAME },
              { text: isRTL ? 'المبلغ' : 'Amount', style: 'tableHeader', font: ARABIC_FONT_NAME },
            ],
            ...statusRows.map(row => row.map(cell => ({ text: cell, style: 'tableCell', font: ARABIC_FONT_NAME }))),
          ],
        },
        layout: {
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          fillColor: (i: number) => i === 0 ? '#f1f5f9' : undefined,
        },
        margin: [0, 0, 0, 30],
      },
      // By Type
      {
        text: isRTL ? 'حسب النوع' : 'By Type',
        style: 'header',
        fontSize: 16,
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 80, 120],
          body: [
            [
              { text: isRTL ? 'النوع' : 'Type', style: 'tableHeader', font: ARABIC_FONT_NAME },
              { text: isRTL ? 'العدد' : 'Count', style: 'tableHeader', font: ARABIC_FONT_NAME },
              { text: isRTL ? 'المبلغ' : 'Amount', style: 'tableHeader', font: ARABIC_FONT_NAME },
            ],
            ...typeRows.map(row => row.map(cell => ({ text: cell, style: 'tableCell', font: ARABIC_FONT_NAME }))),
          ],
        },
        layout: {
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
          fillColor: (i: number) => i === 0 ? '#f1f5f9' : undefined,
        },
      },
      // Footer
      {
        text: `${isRTL ? 'تم التصدير في:' : 'Exported at:'} ${new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}`,
        fontSize: 9,
        color: '#94a3b8',
        alignment: 'center' as const,
        margin: [0, 40, 0, 0],
      },
    ],
  };

  const pdfDoc = pdfMake.createPdf(docDefinition as never);

  const blob = await new Promise<Blob>((resolve, reject) => {
    try {
      (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob(resolve);
    } catch (e) {
      reject(e);
    }
  });

  if (download) {
    const defaultFilename = `transactions_report_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadBlob(blob, filename || defaultFilename);
  }

  return { blob };
}
