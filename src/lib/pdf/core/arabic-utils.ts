/**
 * Arabic Text Utilities for PDF Generation
 * 
 * Provides text preprocessing, shaping simulation, and RTL helpers.
 * 
 * IMPORTANT: pdfmake with embedded TTF fonts handles Arabic shaping natively.
 * These utilities ensure consistent RTL layout and number formatting.
 */

// Arabic-Indic digits mapping
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const WESTERN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Convert Western numerals to Arabic-Indic numerals
 */
export function toArabicNumerals(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[parseInt(d)]);
}

/**
 * Convert Arabic-Indic numerals to Western numerals
 */
export function toWesternNumerals(input: string | number): string {
  const str = String(input);
  let result = str;
  ARABIC_DIGITS.forEach((arabicDigit, index) => {
    result = result.replace(new RegExp(arabicDigit, 'g'), String(index));
  });
  return result;
}

/**
 * Preprocess Arabic text for PDF rendering
 * 
 * With embedded Cairo TTF font, pdfmake handles Arabic shaping correctly.
 * This function ensures consistent text normalization.
 */
export function preprocessArabic(text: string): string {
  if (!text) return '';
  
  // Normalize Arabic characters (handle different forms)
  let processed = text
    // Normalize Alef variants
    .replace(/[\u0622\u0623\u0625]/g, '\u0627') // أ إ آ -> ا
    // Normalize Yeh variants  
    .replace(/\u0649/g, '\u064A') // ى -> ي
    // Normalize Teh Marbuta
    .replace(/\u0629/g, '\u0647'); // ة -> ه (optional, keep original if needed)
  
  return processed;
}

/**
 * Wrap LTR content (numbers, IDs, emails) for proper display in RTL context
 * Uses Unicode directional markers
 */
export function ltrToken(text: string | number): string {
  const str = String(text);
  // LTR embedding: U+202A (LRE) ... U+202C (PDF)
  return `\u202A${str}\u202C`;
}

/**
 * Wrap RTL content for explicit RTL direction
 */
export function rtlToken(text: string): string {
  // RTL embedding: U+202B (RLE) ... U+202C (PDF)
  return `\u202B${text}\u202C`;
}

/**
 * Format currency with Arabic support
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'SAR', 
  useArabicNumerals: boolean = false
): string {
  const currencySymbols: Record<string, string> = {
    'SAR': 'ر.س',
    'USD': 'د.أ',
    'EUR': 'يورو',
    'AED': 'د.إ',
    'KWD': 'د.ك',
    'QAR': 'ر.ق',
    'BHD': 'د.ب',
    'OMR': 'ر.ع',
    'EGP': 'ج.م',
    'JOD': 'د.أ',
  };

  // Format with 2 decimal places
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numStr = useArabicNumerals ? toArabicNumerals(formatted) : formatted;
  const symbol = currencySymbols[currency] || currency;

  // For RTL: amount then currency symbol
  return `${numStr} ${symbol}`;
}

/**
 * Format date in Arabic
 */
export function formatArabicDate(
  date: Date | string, 
  format: 'full' | 'short' | 'numeric' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = 
    format === 'full' ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' } :
    format === 'short' ? { year: 'numeric', month: 'short', day: 'numeric' } :
    { year: 'numeric', month: '2-digit', day: '2-digit' };

  return d.toLocaleDateString('ar-SA', options);
}

/**
 * Generate Arabic ordinal number (١ ، ٢ ، ٣)
 */
export function toArabicOrdinal(num: number): string {
  return toArabicNumerals(num);
}

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Check if text is primarily RTL
 */
export function isRTL(text: string): boolean {
  const rtlChars = text.match(/[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/g);
  const ltrChars = text.match(/[A-Za-z\u00C0-\u00FF]/g);
  
  const rtlCount = rtlChars ? rtlChars.length : 0;
  const ltrCount = ltrChars ? ltrChars.length : 0;
  
  return rtlCount > ltrCount;
}
