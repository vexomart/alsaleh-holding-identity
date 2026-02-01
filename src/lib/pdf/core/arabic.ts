/**
 * Arabic Correctness Layer for PDF Generation
 * 
 * Provides proper bidirectional text handling for mixed Arabic/Latin content.
 * 
 * KEY CONCEPTS:
 * - RTL base direction for Arabic documents
 * - LTR isolation for IDs, numbers, codes
 * - Mixed content handling with proper bidi markers
 * 
 * UNICODE MARKERS USED:
 * - U+202B (RLE) Right-to-Left Embedding
 * - U+202A (LRE) Left-to-Right Embedding  
 * - U+202C (PDF) Pop Directional Formatting
 * - U+2066 (LRI) Left-to-Right Isolate
 * - U+2067 (RLI) Right-to-Left Isolate
 * - U+2069 (PDI) Pop Directional Isolate
 */

import { ARABIC_FONT_NAME } from './fonts';

// Unicode Directional Markers
const LRE = '\u202A'; // Left-to-Right Embedding
const RLE = '\u202B'; // Right-to-Left Embedding
const PDF = '\u202C'; // Pop Directional Formatting
const LRI = '\u2066'; // Left-to-Right Isolate (stronger)
const RLI = '\u2067'; // Right-to-Left Isolate
const PDI = '\u2069'; // Pop Directional Isolate

// Arabic character range detection
const ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Check if text contains Arabic characters
 */
export function containsArabic(text: string): boolean {
  return ARABIC_RANGE.test(text);
}

/**
 * Check if text is primarily RTL
 */
export function isRTL(text: string): boolean {
  const rtlChars = text.match(/[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/g);
  const ltrChars = text.match(/[A-Za-z\u00C0-\u00FF]/g);
  return (rtlChars?.length || 0) > (ltrChars?.length || 0);
}

/**
 * RTL - Wrap Arabic text with RTL direction markers
 * 
 * Use for:
 * - All Arabic labels and content
 * - Arabic sentences and paragraphs
 * 
 * @example rtl('فاتورة ضريبية') → properly shaped Arabic
 */
export function rtl(text: string): string {
  if (!text) return '';
  // Use RLI/PDI for stronger isolation
  return `${RLI}${text}${PDI}`;
}

/**
 * LTR - Wrap LTR content (IDs, numbers, codes) for RTL context
 * 
 * Use for:
 * - Invoice numbers: INV-2026-0001
 * - VAT numbers: 300000000000003
 * - Order numbers: ORD-2026-0001
 * - IBAN: SA0380000000608010167519
 * - Currency amounts: 5,000.00
 * - Email addresses
 * - Transaction references
 * 
 * @example ltr('INV-2026-0001') → isolated LTR in RTL context
 */
export function ltr(text: string | number): string {
  if (text === null || text === undefined) return '';
  const str = String(text);
  // Use LRI/PDI for stronger isolation
  return `${LRI}${str}${PDI}`;
}

/**
 * MIX - Handle mixed Arabic + LTR content in a single string
 * 
 * Automatically detects and isolates LTR segments (numbers, codes)
 * within Arabic text.
 * 
 * @example mix('فاتورة رقم INV-2026-0001 المبلغ 5,000 SAR')
 *          → Properly rendered with LTR isolation for codes/numbers
 */
export function mix(text: string): string {
  if (!text) return '';
  
  // Pattern to match LTR tokens that should be isolated:
  // - IDs/codes: INV-xxx, ORD-xxx, REF-xxx, etc.
  // - Numbers with formatting: 5,000.00
  // - Currency codes: SAR, USD
  // - Email-like patterns
  // - IBAN patterns
  const ltrPattern = /([A-Z]{2,}[-\d]+|[\d,]+\.?\d*|[A-Z]{3}(?=\s|$)|SA\d{20,}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  
  return text.replace(ltrPattern, (match) => ltr(match));
}

/**
 * Format currency with proper RTL handling
 * Amount is LTR isolated, currency symbol follows
 */
export function currency(amount: number, currencyCode: string = 'SAR'): string {
  const currencySymbols: Record<string, string> = {
    'SAR': 'ر.س',
    'USD': 'د.أ',
    'EUR': 'يورو',
    'AED': 'د.إ',
  };
  
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const symbol = currencySymbols[currencyCode] || currencyCode;
  
  // LTR amount + Arabic symbol
  return `${ltr(formatted)} ${symbol}`;
}

/**
 * Create RTL-safe table definition for pdfmake
 * 
 * Features:
 * - Headers reversed for RTL display
 * - Rows reversed for RTL display
 * - LTR columns properly aligned
 * - Consistent styling with Cairo font
 */
export function rtlTable(
  headers: string[],
  rows: (string | number)[][],
  options: {
    widths?: (string | number)[];
    ltrColumns?: number[]; // 0-indexed columns that contain LTR content
    headerBg?: string;
    alternateBg?: string;
    borderColor?: string;
  } = {}
): Record<string, unknown> {
  const {
    widths = new Array(headers.length).fill('*'),
    ltrColumns = [],
    headerBg = '#f1f5f9',
    alternateBg = '#fafafa',
    borderColor = '#e2e8f0',
  } = options;

  // Reverse for RTL display
  const rtlHeaders = [...headers].reverse();
  const rtlRows = rows.map(row => [...row].reverse());
  const rtlWidths = [...widths].reverse();
  
  // Adjust LTR column indices for reversed array
  const rtlLtrColumns = ltrColumns.map(i => headers.length - 1 - i);

  // Build header row
  const headerCells = rtlHeaders.map((header, colIndex) => ({
    text: header,
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    bold: true,
    fillColor: headerBg,
    alignment: rtlLtrColumns.includes(colIndex) ? 'left' as const : 'right' as const,
    margin: [8, 10, 8, 10],
    color: '#0f172a',
  }));

  // Build body rows
  const bodyCells = rtlRows.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const isLtr = rtlLtrColumns.includes(colIndex);
      const cellValue = String(cell);
      
      return {
        text: isLtr ? ltr(cellValue) : cellValue,
        font: ARABIC_FONT_NAME,
        fontSize: 10,
        alignment: isLtr ? 'left' as const : 'right' as const,
        fillColor: rowIndex % 2 === 1 ? alternateBg : undefined,
        margin: [8, 8, 8, 8],
        color: '#1e293b',
      };
    })
  );

  return {
    table: {
      headerRows: 1,
      widths: rtlWidths,
      body: [headerCells, ...bodyCells],
    },
    layout: {
      hLineColor: () => borderColor,
      vLineColor: () => borderColor,
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
  };
}

/**
 * Create RTL key-value pairs (label: value layout)
 */
export function rtlKeyValue(
  items: { label: string; value: string; isLtr?: boolean }[]
): Record<string, unknown> {
  return {
    stack: items.map(item => ({
      columns: [
        {
          text: item.isLtr ? ltr(item.value) : item.value,
          font: ARABIC_FONT_NAME,
          fontSize: 11,
          bold: true,
          width: 'auto',
          alignment: item.isLtr ? 'left' as const : 'right' as const,
          color: '#0f172a',
        },
        {
          text: ':',
          width: 15,
          font: ARABIC_FONT_NAME,
          alignment: 'center' as const,
          color: '#94a3b8',
        },
        {
          text: item.label,
          font: ARABIC_FONT_NAME,
          fontSize: 10,
          width: '*',
          alignment: 'right' as const,
          color: '#64748b',
        },
      ],
      columnGap: 5,
      margin: [0, 3, 0, 3],
    })),
  };
}

/**
 * Default RTL document style for pdfmake
 */
export const rtlDocumentStyle = {
  font: ARABIC_FONT_NAME,
  fontSize: 11,
  alignment: 'right' as const,
  lineHeight: 1.4,
};

/**
 * Test string for Arabic correctness verification
 */
export const ARABIC_TEST_STRING = 'فاتورة رقم INV-2026-0001 المبلغ 5,000 SAR';

/**
 * Verify Arabic text rendering correctness
 * Returns structured test results
 */
export function verifyArabicRendering(): {
  testString: string;
  processedString: string;
  containsArabicCheck: boolean;
  isRtlCheck: boolean;
  hasLtrIsolation: boolean;
} {
  const processed = mix(ARABIC_TEST_STRING);
  
  return {
    testString: ARABIC_TEST_STRING,
    processedString: processed,
    containsArabicCheck: containsArabic(ARABIC_TEST_STRING),
    isRtlCheck: isRTL(ARABIC_TEST_STRING),
    hasLtrIsolation: processed.includes(LRI) && processed.includes(PDI),
  };
}
