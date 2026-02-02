/**
 * BIDIRECTIONAL TEXT UTILITIES
 * 
 * Handles Arabic RTL text and mixed-direction content.
 */

// Unicode directional isolates
const RLI = '\u2067'; // Right-to-Left Isolate
const LRI = '\u2066'; // Left-to-Right Isolate  
const PDI = '\u2069'; // Pop Directional Isolate

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Wrap text as RTL (Arabic content)
 */
export function rtl(text: string): string {
  if (!text) return '';
  return `${RLI}${text}${PDI}`;
}

/**
 * Wrap text as LTR (numbers, IDs, emails, etc.)
 * Use for: invoice numbers, order IDs, IBAN, phone, email, amounts
 */
export function ltr(text: string | number): string {
  const str = String(text);
  if (!str) return '';
  return `${LRI}${str}${PDI}`;
}

/**
 * Format currency amount with LTR isolation
 */
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${ltr(formatted)} ${ltr(currency)}`;
}

/**
 * Format date for Arabic PDF
 */
export function formatArabicDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return rtl(formatted);
}

/**
 * Format short date (YYYY-MM-DD)
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return ltr(d.toISOString().split('T')[0]);
}

/**
 * Convert number to Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Convert number to Arabic ordinal (الأول، الثاني، ...)
 */
export function toArabicOrdinal(n: number): string {
  const ordinals = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 
    'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر', 'الثاني عشر'];
  return ordinals[n] || `رقم ${toArabicNumerals(n)}`;
}

/**
 * Format phone number with LTR
 */
export function formatPhone(phone: string): string {
  return ltr(phone.replace(/[^\d+\-\s]/g, ''));
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return ltr(`${Math.round(value * 100)}%`);
}
