/**
 * ARABIC RTL HELPERS FOR PDF
 * 
 * Handles bidirectional text, RTL tables, and number formatting.
 */

import { FONT_NAME } from './init';

// Unicode control characters for bidirectional text
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
 * Wrap text as RTL (Arabic)
 */
export function rtl(text: string): string {
  if (!text) return '';
  return `${RLI}${text}${PDI}`;
}

/**
 * Wrap text as LTR (numbers, IDs, references)
 * Use this for: invoice numbers, order IDs, IBAN, phone, email, amounts
 */
export function ltr(text: string | number): string {
  const str = String(text);
  if (!str) return '';
  return `${LRI}${str}${PDI}`;
}

/**
 * Create RTL text node for pdfmake
 */
export function rtlText(text: string, options: { bold?: boolean; fontSize?: number } = {}): object {
  return {
    text: rtl(text),
    font: FONT_NAME,
    alignment: 'right' as const,
    bold: options.bold,
    fontSize: options.fontSize,
  };
}

/**
 * Create LTR token (for numbers/IDs inside RTL context)
 */
export function ltrToken(value: string | number): object {
  return {
    text: ltr(value),
    font: FONT_NAME,
    preserveLeadingSpaces: true,
  };
}

/**
 * Format currency for Arabic PDF (SAR)
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
 * Convert number to Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Create RTL table for pdfmake
 * Automatically reverses columns for proper RTL display
 */
export function createRtlTable(config: {
  headers: string[];
  rows: (string | number)[][];
  widths?: (string | number)[];
  numericCols?: number[]; // Indices of columns that contain numbers (will be LTR)
}): object {
  const { headers, rows, widths, numericCols = [] } = config;
  
  // Reverse headers for RTL
  const rtlHeaders = [...headers].reverse().map((h, i) => ({
    text: rtl(h),
    bold: true,
    alignment: 'right' as const,
    fillColor: '#f3f4f6',
  }));
  
  // Process rows
  const rtlRows = rows.map(row => {
    const reversedRow = [...row].reverse();
    const reversedNumericCols = numericCols.map(i => headers.length - 1 - i);
    
    return reversedRow.map((cell, i) => {
      const isNumeric = reversedNumericCols.includes(i);
      return {
        text: isNumeric ? ltr(cell) : rtl(String(cell)),
        alignment: 'right' as const,
      };
    });
  });
  
  // Reverse widths if provided
  const rtlWidths = widths ? [...widths].reverse() : Array(headers.length).fill('*');
  
  return {
    table: {
      headerRows: 1,
      widths: rtlWidths,
      body: [rtlHeaders, ...rtlRows],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => '#e5e7eb',
      vLineColor: () => '#e5e7eb',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  };
}

/**
 * Create key-value pair for RTL layout
 */
export function rtlKeyValue(label: string, value: string | number, isLtrValue: boolean = false): object {
  return {
    columns: [
      { text: isLtrValue ? ltr(value) : rtl(String(value)), width: '*', alignment: 'right' },
      { text: rtl(label), width: 'auto', alignment: 'right', bold: true },
    ],
    columnGap: 10,
  };
}

/**
 * Default styles for Arabic RTL documents
 */
export const arabicDefaultStyles = {
  defaultStyle: {
    font: FONT_NAME,
    fontSize: 10,
    alignment: 'right' as const,
    direction: 'rtl' as const,
  },
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'right' as const,
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 14,
      bold: true,
      alignment: 'right' as const,
      margin: [0, 10, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 10,
      fillColor: '#f3f4f6',
    },
    footer: {
      fontSize: 8,
      alignment: 'center' as const,
      color: '#6b7280',
    },
  },
};
