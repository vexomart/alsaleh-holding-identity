/**
 * RTL Layout Builders for PDF Generation
 * 
 * Provides consistent RTL table, header, footer, and content builders.
 * All layouts are designed for Arabic-first documents.
 */

import { ARABIC_FONT_NAME } from './fonts';

// Type definitions
export type PDFContent = Record<string, unknown> | string | Array<Record<string, unknown> | string>;
export type PDFStyle = Record<string, unknown>;
export type PDFStyleDictionary = Record<string, PDFStyle>;

/**
 * Corporate RTL Style Dictionary
 * Used across all PDF templates for consistency
 */
export const corporateStyles: PDFStyleDictionary = {
  // Headers
  documentTitle: {
    font: ARABIC_FONT_NAME,
    fontSize: 28,
    bold: true,
    alignment: 'center',
    color: '#0f172a',
    margin: [0, 0, 0, 10],
  },
  documentSubtitle: {
    font: ARABIC_FONT_NAME,
    fontSize: 14,
    alignment: 'center',
    color: '#64748b',
    margin: [0, 0, 0, 20],
  },
  sectionHeader: {
    font: ARABIC_FONT_NAME,
    fontSize: 16,
    bold: true,
    alignment: 'right',
    color: '#1e293b',
    margin: [0, 15, 0, 10],
  },
  subsectionHeader: {
    font: ARABIC_FONT_NAME,
    fontSize: 13,
    bold: true,
    alignment: 'right',
    color: '#334155',
    margin: [0, 10, 0, 8],
  },

  // Body text
  body: {
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    alignment: 'right',
    lineHeight: 1.6,
    color: '#1e293b',
  },
  bodySmall: {
    font: ARABIC_FONT_NAME,
    fontSize: 10,
    alignment: 'right',
    lineHeight: 1.5,
    color: '#475569',
  },
  note: {
    font: ARABIC_FONT_NAME,
    fontSize: 10,
    italics: true,
    alignment: 'right',
    color: '#64748b',
    margin: [0, 5, 0, 5],
  },

  // Table styles
  tableHeader: {
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    bold: true,
    alignment: 'right',
    fillColor: '#f1f5f9',
    color: '#0f172a',
    margin: [8, 10, 8, 10],
  },
  tableCell: {
    font: ARABIC_FONT_NAME,
    fontSize: 10,
    alignment: 'right',
    margin: [8, 8, 8, 8],
    color: '#1e293b',
  },
  tableCellLTR: {
    font: ARABIC_FONT_NAME,
    fontSize: 10,
    alignment: 'left',
    margin: [8, 8, 8, 8],
    color: '#1e293b',
  },

  // Labels and values
  label: {
    font: ARABIC_FONT_NAME,
    fontSize: 10,
    color: '#64748b',
    alignment: 'right',
  },
  value: {
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    bold: true,
    alignment: 'right',
    color: '#0f172a',
  },
  valueLTR: {
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    bold: true,
    alignment: 'left',
    color: '#0f172a',
  },

  // Financial
  total: {
    font: ARABIC_FONT_NAME,
    fontSize: 14,
    bold: true,
    alignment: 'right',
    color: '#0369a1',
  },
  currency: {
    font: ARABIC_FONT_NAME,
    fontSize: 12,
    alignment: 'left',
    color: '#0f172a',
  },

  // Footer
  pageFooter: {
    font: ARABIC_FONT_NAME,
    fontSize: 9,
    alignment: 'center',
    color: '#94a3b8',
  },

  // Clause numbering
  clauseNumber: {
    font: ARABIC_FONT_NAME,
    fontSize: 12,
    bold: true,
    color: '#0369a1',
    alignment: 'right',
  },
  clauseTitle: {
    font: ARABIC_FONT_NAME,
    fontSize: 12,
    bold: true,
    color: '#1e293b',
    alignment: 'right',
  },
  clauseContent: {
    font: ARABIC_FONT_NAME,
    fontSize: 11,
    alignment: 'right',
    lineHeight: 1.7,
    color: '#334155',
  },
};

/**
 * Create RTL table with reversed column order
 * Headers and rows are reversed for proper RTL display
 */
export function createRTLTable(
  headers: string[],
  rows: (string | number)[][],
  widths?: (string | number)[],
  options?: {
    headerStyle?: Partial<PDFStyle>;
    cellStyle?: Partial<PDFStyle>;
    alternateRowColor?: string;
    borderColor?: string;
    ltrColumns?: number[]; // Column indices that should be LTR (e.g., numbers)
  }
): PDFContent {
  // Reverse for RTL display
  const rtlHeaders = [...headers].reverse();
  const rtlRows = rows.map(row => [...row].reverse());
  const rtlWidths = widths ? [...widths].reverse() : new Array(headers.length).fill('*');
  const rtlLtrColumns = options?.ltrColumns 
    ? options.ltrColumns.map(i => headers.length - 1 - i) 
    : [];

  const headerCells = rtlHeaders.map((h, colIndex) => ({
    text: h,
    style: 'tableHeader',
    font: ARABIC_FONT_NAME,
    alignment: rtlLtrColumns.includes(colIndex) ? 'left' as const : 'right' as const,
    ...options?.headerStyle,
  }));

  const bodyCells = rtlRows.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      text: String(cell),
      style: rtlLtrColumns.includes(colIndex) ? 'tableCellLTR' : 'tableCell',
      font: ARABIC_FONT_NAME,
      alignment: rtlLtrColumns.includes(colIndex) ? 'left' as const : 'right' as const,
      fillColor: options?.alternateRowColor && rowIndex % 2 === 1 
        ? options.alternateRowColor 
        : undefined,
      ...options?.cellStyle,
    }))
  );

  return {
    table: {
      headerRows: 1,
      widths: rtlWidths,
      body: [headerCells, ...bodyCells],
    },
    layout: {
      hLineColor: () => options?.borderColor || '#e2e8f0',
      vLineColor: () => options?.borderColor || '#e2e8f0',
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 8,
      paddingBottom: () => 8,
    },
  };
}

/**
 * Create RTL key-value pair layout
 * For displaying label: value pairs in RTL
 */
export function createRTLKeyValue(
  items: { label: string; value: string; valueLTR?: boolean }[],
  options?: {
    labelStyle?: Partial<PDFStyle>;
    valueStyle?: Partial<PDFStyle>;
    gap?: number;
  }
): PDFContent {
  return {
    stack: items.map(item => ({
      columns: [
        { 
          text: item.value, 
          style: item.valueLTR ? 'valueLTR' : 'value',
          font: ARABIC_FONT_NAME,
          width: 'auto',
          alignment: item.valueLTR ? 'left' as const : 'right' as const,
          ...options?.valueStyle,
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
          style: 'label',
          font: ARABIC_FONT_NAME,
          width: '*',
          alignment: 'right' as const,
          ...options?.labelStyle,
        },
      ],
      columnGap: options?.gap || 5,
      margin: [0, 3, 0, 3],
    })),
  };
}

/**
 * Create company header block
 */
export function createCompanyHeader(company: {
  nameAr: string;
  nameEn?: string;
  vatNumber?: string;
  crNumber?: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  website?: string;
}): PDFContent {
  const stack: PDFContent[] = [
    { 
      text: company.nameAr, 
      style: 'documentTitle',
      font: ARABIC_FONT_NAME,
      margin: [0, 0, 0, 5],
    },
  ];

  if (company.nameEn) {
    stack.push({
      text: company.nameEn,
      font: ARABIC_FONT_NAME,
      fontSize: 12,
      color: '#64748b',
      alignment: 'center',
      margin: [0, 0, 0, 15],
    });
  }

  if (company.vatNumber) {
    stack.push({
      text: `الرقم الضريبي: ${company.vatNumber}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      alignment: 'center',
      color: '#334155',
      margin: [0, 0, 0, 3],
    });
  }

  if (company.crNumber) {
    stack.push({
      text: `السجل التجاري: ${company.crNumber}`,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      alignment: 'center',
      color: '#64748b',
      margin: [0, 0, 0, 3],
    });
  }

  if (company.addressAr) {
    stack.push({
      text: company.addressAr,
      font: ARABIC_FONT_NAME,
      fontSize: 10,
      alignment: 'center',
      color: '#64748b',
      margin: [0, 0, 0, 3],
    });
  }

  const contactParts: string[] = [];
  if (company.phone) contactParts.push(`هاتف: ${company.phone}`);
  if (company.email) contactParts.push(`بريد: ${company.email}`);
  
  if (contactParts.length > 0) {
    stack.push({
      text: contactParts.join(' | '),
      font: ARABIC_FONT_NAME,
      fontSize: 9,
      alignment: 'center',
      color: '#64748b',
      margin: [0, 0, 0, 3],
    });
  }

  if (company.website) {
    stack.push({
      text: company.website,
      font: ARABIC_FONT_NAME,
      fontSize: 9,
      alignment: 'center',
      color: '#0369a1',
      margin: [0, 0, 0, 5],
    });
  }

  return {
    table: {
      widths: ['*'],
      body: [[{
        stack,
        margin: [20, 15, 20, 15],
      }]],
    },
    layout: {
      fillColor: () => '#f8fafc',
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
    margin: [0, 0, 0, 20],
  };
}

/**
 * Create separator line
 */
export function createSeparator(color: string = '#0369a1', width: number = 515): PDFContent {
  return {
    canvas: [{
      type: 'line',
      x1: 0,
      y1: 0,
      x2: width,
      y2: 0,
      lineWidth: 2,
      lineColor: color,
    }],
    margin: [0, 10, 0, 20],
  };
}

/**
 * Create signature block
 */
export function createSignatureBlock(
  parties: { label: string; name: string; title?: string }[]
): PDFContent {
  return {
    columns: parties.map(party => ({
      width: `${100 / parties.length}%`,
      stack: [
        { 
          text: party.label, 
          font: ARABIC_FONT_NAME,
          bold: true, 
          alignment: 'center', 
          margin: [0, 0, 0, 10],
          fontSize: 12,
        },
        { 
          text: party.name, 
          font: ARABIC_FONT_NAME,
          alignment: 'center', 
          fontSize: 10, 
          margin: [0, 0, 0, 5],
          color: '#334155',
        },
        ...(party.title ? [{
          text: party.title,
          font: ARABIC_FONT_NAME,
          alignment: 'center' as const,
          fontSize: 9,
          color: '#64748b',
          margin: [0, 0, 0, 10],
        }] : []),
        { 
          text: 'التوقيع: _______________', 
          font: ARABIC_FONT_NAME,
          alignment: 'center', 
          fontSize: 10, 
          margin: [0, 20, 0, 10],
        },
        { 
          text: 'التاريخ: _______________', 
          font: ARABIC_FONT_NAME,
          alignment: 'center', 
          fontSize: 10,
        },
      ],
    })),
    margin: [0, 30, 0, 0],
  };
}

/**
 * Create page footer function for pdfmake
 */
export function createPageFooter(documentTitle?: string): (currentPage: number, pageCount: number) => PDFContent {
  return (currentPage: number, pageCount: number) => ({
    columns: [
      documentTitle ? {
        text: documentTitle,
        font: ARABIC_FONT_NAME,
        fontSize: 8,
        color: '#94a3b8',
        alignment: 'right' as const,
        margin: [40, 0, 0, 0],
      } : { text: '', width: '*' },
      {
        text: `صفحة ${currentPage} من ${pageCount}`,
        font: ARABIC_FONT_NAME,
        fontSize: 9,
        color: '#94a3b8',
        alignment: 'center' as const,
      },
      { text: '', width: '*' },
    ],
    margin: [40, 0, 40, 20],
  });
}

// ============================================
// ENHANCED RTL TABLE BUILDER (Brand-aware)
// ============================================

import { colors, components, typography, spacing } from './brand';
import { ltr } from './arabic';

export interface BuildRtlTableOptions {
  headersAr: string[];
  headersEn?: string[];
  rows: (string | number)[][];
  widths?: (string | number)[];
  numericCols?: number[]; // Column indices containing numbers (will use ltr())
  zebraRows?: boolean;
  headerStyle?: 'brand' | 'minimal';
}

/**
 * Build RTL table with brand styling
 * - RTL: headers/rows order reversed automatically
 * - Numeric columns use ltr() and align left within RTL context
 * - Uses brand tokens for colors, spacing, fonts
 */
export function buildRtlTable(options: BuildRtlTableOptions): PDFContent {
  const {
    headersAr,
    rows,
    widths,
    numericCols = [],
    zebraRows = true,
    headerStyle = 'brand',
  } = options;
  
  const colCount = headersAr.length;
  
  // Reverse for RTL display
  const rtlHeaders = [...headersAr].reverse();
  const rtlRows = rows.map(row => [...row].reverse());
  const rtlWidths = widths ? [...widths].reverse() : new Array(colCount).fill('*');
  
  // Map numeric columns to reversed indices
  const rtlNumericCols = numericCols.map(i => colCount - 1 - i);
  
  // Build header row with brand styling
  const headerCells = rtlHeaders.map((h, colIndex) => ({
    text: h,
    font: typography.fontFamily,
    fontSize: components.table.header.fontSize,
    bold: components.table.header.bold,
    alignment: rtlNumericCols.includes(colIndex) ? 'left' as const : 'right' as const,
    color: headerStyle === 'brand' ? components.table.header.textColor : colors.text.primary,
    fillColor: headerStyle === 'brand' ? components.table.header.background : colors.background.section,
    margin: components.table.header.padding,
  }));
  
  // Build body rows
  const bodyCells = rtlRows.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const isNumeric = rtlNumericCols.includes(colIndex);
      const cellValue = isNumeric && typeof cell !== 'undefined' ? ltr(String(cell)) : String(cell);
      
      return {
        text: cellValue,
        font: typography.fontFamily,
        fontSize: components.table.cell.fontSize,
        alignment: isNumeric ? 'left' as const : 'right' as const,
        color: components.table.cell.textColor,
        fillColor: zebraRows && rowIndex % 2 === 1 ? components.table.zebraRow : undefined,
        margin: components.table.cell.padding,
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
      hLineColor: () => components.table.border,
      vLineColor: () => components.table.border,
      hLineWidth: () => components.table.borderWidth,
      vLineWidth: () => components.table.borderWidth,
      paddingLeft: () => spacing.sm,
      paddingRight: () => spacing.sm,
      paddingTop: () => spacing.sm,
      paddingBottom: () => spacing.sm,
    },
  };
}
