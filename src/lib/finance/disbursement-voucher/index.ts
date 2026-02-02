/**
 * Disbursement Voucher Module
 * وحدة سند الصرف
 */

export type {
  DisbursementParty,
  DisbursementFinancials,
  DisbursementSignature,
  DisbursementVoucherData,
  VoucherRenderOptions,
} from './types';

export {
  toArabicDigits,
  formatCurrencyArabic,
  formatDateArabic,
  formatDateShort,
  numberToArabicWords,
  generateVoucherNumber,
} from './arabic-utils';

export { renderVoucherHTML } from './template';

import { renderVoucherHTML } from './template';
import type { DisbursementVoucherData } from './types';

/**
 * Preview voucher in new window
 */
export function previewVoucher(data: DisbursementVoucherData): Window | null {
  const html = renderVoucherHTML(data, { showAnimations: true });
  
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
 * Download voucher as HTML file
 */
export function downloadVoucher(data: DisbursementVoucherData): void {
  const html = renderVoucherHTML(data, { showAnimations: false, printMode: true });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `سند-صرف-${data.voucherNumber}.html`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Print voucher
 */
export function printVoucher(data: DisbursementVoucherData): void {
  const html = renderVoucherHTML(data, { showAnimations: false, printMode: true });
  
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
