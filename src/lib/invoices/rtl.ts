/**
 * RTL UTILITIES FOR INVOICE PDF
 * Ensures proper Arabic RTL rendering + LTR isolation for technical tokens
 */

// Unicode isolation markers
const LRI = '\u2066'; // Left-to-Right Isolate
const RLI = '\u2067'; // Right-to-Left Isolate  
const PDI = '\u2069'; // Pop Directional Isolate

/**
 * Force RTL direction for Arabic text
 */
export function forceRtlText(text: string): string {
  if (!text) return '';
  return `${RLI}${text}${PDI}`;
}

/**
 * Keep token in LTR (for invoice numbers, IDs, emails, phone numbers)
 * Prevents numbers from being reversed in RTL context
 */
export function keepLtrToken(token: string | number): string {
  if (token === null || token === undefined) return '';
  return `${LRI}${String(token)}${PDI}`;
}

/**
 * Format money amount in SAR with consistent decimals
 * Returns LTR-isolated string to prevent number reversal
 */
export function formatMoneySAR(amount: number, currency: string = 'SAR'): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${LRI}${formatted} ${currency}${PDI}`;
}

/**
 * Format percentage (e.g., VAT 15%)
 * Returns LTR-isolated string
 */
export function formatPercentage(rate: number): string {
  const percentage = (rate * 100).toFixed(0);
  return `${LRI}${percentage}%${PDI}`;
}

/**
 * Format phone number (always LTR)
 */
export function formatPhoneLtr(phone: string): string {
  if (!phone) return '';
  return keepLtrToken(phone);
}

/**
 * Format email (always LTR)
 */
export function formatEmailLtr(email: string): string {
  if (!email) return '';
  return keepLtrToken(email);
}

/**
 * Format invoice/order number (always LTR)
 */
export function formatInvoiceNumber(number: string): string {
  if (!number) return '';
  return keepLtrToken(number);
}

/**
 * Format date in Arabic locale
 */
export function formatDateAr(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date short (YYYY/MM/DD) - LTR isolated
 */
export function formatDateShortLtr(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  
  const formatted = d.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  return keepLtrToken(formatted);
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Smart direction wrapper - Arabic gets RTL, numbers/English get LTR
 */
export function smartDirection(text: string): string {
  if (!text) return '';
  if (containsArabic(text)) {
    return forceRtlText(text);
  }
  return keepLtrToken(text);
}

export default {
  forceRtlText,
  keepLtrToken,
  formatMoneySAR,
  formatPercentage,
  formatPhoneLtr,
  formatEmailLtr,
  formatInvoiceNumber,
  formatDateAr,
  formatDateShortLtr,
  containsArabic,
  smartDirection,
};
