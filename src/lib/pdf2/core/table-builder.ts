/**
 * RTL TABLE BUILDER
 * 
 * Creates properly formatted RTL tables for Arabic PDFs.
 */

import { rtl, ltr } from './bidi';
import { PDF_COLORS, PDF_SPACING } from './brand';

export interface TableConfig {
  headers: string[];
  rows: (string | number)[][];
  widths?: (string | number)[];
  numericCols?: number[];  // Column indices that contain numbers (LTR)
  headerColor?: string;
  alternateRows?: boolean;
}

/**
 * Create RTL table definition for pdfmake
 * Automatically reverses columns for proper RTL display
 */
export function createRtlTable(config: TableConfig): object {
  const { 
    headers, 
    rows, 
    widths, 
    numericCols = [],
    headerColor = PDF_COLORS.backgroundMuted,
    alternateRows = false,
  } = config;
  
  // Reverse headers for RTL
  const rtlHeaders = [...headers].reverse().map((h) => ({
    text: rtl(h),
    bold: true,
    alignment: 'right' as const,
    fillColor: headerColor,
    margin: [PDF_SPACING[2], PDF_SPACING[2], PDF_SPACING[2], PDF_SPACING[2]],
  }));
  
  // Process rows - reverse columns and apply RTL/LTR as needed
  const rtlRows = rows.map((row, rowIndex) => {
    const reversedRow = [...row].reverse();
    const reversedNumericCols = numericCols.map(i => headers.length - 1 - i);
    
    return reversedRow.map((cell, colIndex) => {
      const isNumeric = reversedNumericCols.includes(colIndex);
      const cellText = isNumeric ? ltr(cell) : rtl(String(cell));
      
      return {
        text: cellText,
        alignment: 'right' as const,
        fillColor: alternateRows && rowIndex % 2 === 1 
          ? PDF_COLORS.backgroundAlt 
          : undefined,
        margin: [PDF_SPACING[2], PDF_SPACING[1], PDF_SPACING[2], PDF_SPACING[1]],
      };
    });
  });
  
  // Reverse widths if provided
  const rtlWidths = widths 
    ? [...widths].reverse() 
    : Array(headers.length).fill('*');
  
  return {
    table: {
      headerRows: 1,
      widths: rtlWidths,
      body: [rtlHeaders, ...rtlRows],
    },
    layout: {
      hLineWidth: (i: number, node: { table: { body: unknown[] } }) => 
        (i === 0 || i === 1 || i === node.table.body.length) ? 0.5 : 0.25,
      vLineWidth: () => 0,
      hLineColor: () => PDF_COLORS.border,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0,
    },
  };
}

/**
 * Create key-value pair for RTL layout
 */
export function rtlKeyValue(
  label: string, 
  value: string | number, 
  isLtrValue: boolean = false
): object {
  return {
    columns: [
      { 
        text: isLtrValue ? ltr(value) : rtl(String(value)), 
        width: '*', 
        alignment: 'right' as const 
      },
      { 
        text: rtl(label), 
        width: 'auto', 
        alignment: 'right' as const, 
        bold: true 
      },
    ],
    columnGap: 10,
    margin: [0, 2, 0, 2],
  };
}

/**
 * Create a summary box (like totals section)
 */
export function createSummaryBox(items: Array<{ label: string; value: string; highlight?: boolean }>): object {
  return {
    table: {
      widths: [100, '*'],
      body: items.map(item => [
        { 
          text: item.value, 
          alignment: 'right' as const,
          bold: item.highlight,
          fillColor: item.highlight ? PDF_COLORS.backgroundMuted : undefined,
        },
        { 
          text: rtl(item.label), 
          alignment: 'right' as const, 
          bold: true,
          fillColor: item.highlight ? PDF_COLORS.backgroundMuted : undefined,
        },
      ]),
    },
    layout: 'lightHorizontalLines',
  };
}
