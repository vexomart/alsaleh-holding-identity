/**
 * Receipt Voucher Module
 * وحدة سند القبض
 */

export type {
  ReceiptParty,
  ReceiptFinancials,
  ReceiptSignature,
  ReceiptVoucherData,
  ReceiptRenderOptions,
} from './types';

export {
  toArabicDigits,
  formatCurrencyArabic,
  formatDateArabic,
  formatDateShort,
  numberToArabicWords,
  generateReceiptNumber,
  getPaymentMethodArabic,
} from './arabic-utils';

export { renderReceiptHTML } from './template';

import { renderReceiptHTML } from './template';
import type { ReceiptVoucherData } from './types';

/**
 * Preview receipt voucher in new window
 */
export function previewReceipt(data: ReceiptVoucherData): Window | null {
  const html = renderReceiptHTML(data, { showAnimations: true });
  
  const previewWindow = window.open('', '_blank', 'width=900,height=800');
  if (!previewWindow) {
    console.error('Could not open preview window');
    return null;
  }
  
  previewWindow.document.write(html);
  previewWindow.document.close();
  
  return previewWindow;
}

/**
 * Download receipt voucher as HTML file
 */
export function downloadReceipt(data: ReceiptVoucherData): void {
  const html = renderReceiptHTML(data, { showAnimations: false, printMode: true });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `سند-قبض-${data.voucherNumber}.html`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Print receipt voucher
 */
export function printReceipt(data: ReceiptVoucherData): void {
  const html = renderReceiptHTML(data, { showAnimations: false, printMode: true });
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}
