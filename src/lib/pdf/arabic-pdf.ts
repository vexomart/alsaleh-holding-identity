/**
 * Arabic PDF Generator with Full RTL Support
 * 
 * Features:
 * - 100% RTL layout (text direction, alignment, margins)
 * - Proper Arabic shaping and ligatures via embedded Arabic font
 * - Arabic/Hindi numerals support
 * - RTL tables with correct column order
 * - RTL headers and footers
 */

import pdfMake from 'pdfmake/build/pdfmake';
import { loadArabicFont } from './fonts/amiri-font';

// Type definitions for pdfmake content
export type PDFContent = Record<string, unknown> | string | Array<Record<string, unknown> | string>;
export type PDFStyle = Record<string, unknown>;
export type PDFStyleDictionary = Record<string, PDFStyle>;

// Convert Western numerals to Arabic-Indic numerals
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
}

// Convert to Western numerals (for compatibility)
export function toWesternNumerals(num: number | string): string {
  return String(num);
}

// Format currency with Arabic support
export function formatArabicCurrency(amount: number, currency: string = 'SAR', useArabicNumerals: boolean = false): string {
  const currencyNames: Record<string, string> = {
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
  
  const formatted = amount.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const numStr = useArabicNumerals ? toArabicNumerals(formatted) : formatted;
  return `${numStr} ${currencyNames[currency] || currency}`;
}

// Format date in Arabic
export function formatArabicDate(date: Date | string, format: 'full' | 'short' | 'numeric' = 'full'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = format === 'full' 
    ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    : format === 'short'
    ? { year: 'numeric', month: 'short', day: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };
  
  return d.toLocaleDateString('ar-SA', options);
}

// RTL-aware styles with Arabic font
export const rtlStyles: PDFStyleDictionary = {
  header: {
    fontSize: 24,
    bold: true,
    alignment: 'right',
    margin: [0, 0, 0, 20],
    color: '#1e293b',
  },
  subheader: {
    fontSize: 16,
    bold: true,
    alignment: 'right',
    margin: [0, 10, 0, 10],
    color: '#374151',
  },
  normal: {
    fontSize: 11,
    alignment: 'right',
    lineHeight: 1.5,
  },
  tableHeader: {
    fontSize: 11,
    bold: true,
    alignment: 'right',
    fillColor: '#f1f5f9',
    color: '#1e293b',
    margin: [8, 10, 8, 10],
  },
  tableCell: {
    fontSize: 10,
    alignment: 'right',
    margin: [8, 8, 8, 8],
  },
  footer: {
    fontSize: 9,
    alignment: 'right',
    color: '#6b7280',
    margin: [0, 10, 0, 0],
  },
  title: {
    fontSize: 28,
    bold: true,
    alignment: 'center',
    color: '#3b82f6',
    margin: [0, 0, 0, 30],
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    alignment: 'right',
  },
  value: {
    fontSize: 11,
    bold: true,
    alignment: 'right',
    color: '#1e293b',
  },
  total: {
    fontSize: 14,
    bold: true,
    alignment: 'right',
    color: '#3b82f6',
  },
  note: {
    fontSize: 10,
    italics: true,
    alignment: 'right',
    color: '#6b7280',
    margin: [0, 5, 0, 5],
  },
  // LTR style for numbers and emails
  ltr: {
    fontSize: 11,
    alignment: 'left',
  },
};

// PDF Document configuration for RTL
export interface ArabicPDFConfig {
  title?: string;
  author?: string;
  subject?: string;
  useArabicNumerals?: boolean;
  pageSize?: 'A4' | 'A3' | 'LETTER' | 'LEGAL';
  pageOrientation?: 'portrait' | 'landscape';
  fontFamily?: 'amiri' | 'cairo' | 'noto';
  companyInfo?: {
    name: string;
    nameAr?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
  };
  watermark?: string;
}

// Create RTL table with correct column order (columns reversed for RTL)
export function createRTLTable(
  headers: string[],
  rows: (string | number)[][],
  widths?: (string | number)[],
  options?: {
    headerStyle?: PDFStyle;
    cellStyle?: PDFStyle;
    alternateRowColor?: string;
    borderColor?: string;
  }
): PDFContent {
  // Reverse headers and rows for RTL display
  const rtlHeaders = [...headers].reverse();
  const rtlRows = rows.map(row => [...row].reverse());
  const rtlWidths = widths ? [...widths].reverse() : new Array(headers.length).fill('*');

  const headerCells = rtlHeaders.map(h => ({
    text: h,
    style: 'tableHeader',
    alignment: 'right' as const,
    ...options?.headerStyle,
  }));

  const bodyCells = rtlRows.map((row, rowIndex) => 
    row.map(cell => ({
      text: String(cell),
      style: 'tableCell',
      alignment: 'right' as const,
      fillColor: options?.alternateRowColor && rowIndex % 2 === 1 ? options.alternateRowColor : undefined,
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
      hLineColor: () => options?.borderColor || '#e5e7eb',
      vLineColor: () => options?.borderColor || '#e5e7eb',
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 8,
      paddingBottom: () => 8,
    },
  };
}

// Create RTL key-value pairs (label: value)
export function createRTLKeyValue(items: { label: string; value: string }[]): PDFContent {
  return {
    columns: [
      {
        width: '*',
        stack: items.map(item => ({
          columns: [
            { text: item.value, style: 'value', width: 'auto', alignment: 'left' as const },
            { text: ':', width: 10, alignment: 'center' as const },
            { text: item.label, style: 'label', width: 'auto', alignment: 'right' as const },
          ],
          columnGap: 5,
          margin: [0, 3, 0, 3],
        })),
      },
    ],
  };
}

// Create RTL header with company info
export function createRTLHeader(config: ArabicPDFConfig): PDFContent[] {
  const content: PDFContent[] = [];

  if (config.companyInfo) {
    const company = config.companyInfo;
    
    content.push({
      columns: [
        {
          width: '*',
          stack: [
            { text: company.nameAr || company.name, style: 'header', alignment: 'center' },
            company.address ? { text: company.address, style: 'normal', alignment: 'center', fontSize: 10 } : '',
            {
              text: [
                company.phone ? `هاتف: ${company.phone}` : '',
                company.phone && company.email ? ' | ' : '',
                company.email ? `بريد: ${company.email}` : '',
              ].join(''),
              style: 'normal',
              alignment: 'center',
              fontSize: 9,
              color: '#6b7280',
            },
            company.website ? { text: company.website, style: 'normal', alignment: 'center', fontSize: 9, color: '#3b82f6' } : '',
          ].filter(item => item !== ''),
        },
      ],
      margin: [0, 0, 0, 20],
    });

    // Separator line
    content.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 2,
          lineColor: '#3b82f6',
        },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  return content;
}

// Create RTL footer
export function createRTLFooter(text: string, pageNumber?: boolean): PDFContent {
  return {
    columns: [
      pageNumber ? { text: '', width: '*' } : '',
      { text, style: 'footer', alignment: 'center' },
      pageNumber ? { text: '', width: '*' } : '',
    ].filter(item => item !== ''),
  };
}

// Font name constant
const ARABIC_FONT_NAME = 'ArabicFont';

// Main PDF generator class
export class ArabicPDFGenerator {
  private config: ArabicPDFConfig;
  private fontsLoaded: boolean = false;

  constructor(config: ArabicPDFConfig = {}) {
    this.config = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      useArabicNumerals: false,
      fontFamily: 'amiri',
      ...config,
    };
  }

  // Initialize Arabic fonts (must be called before generating PDFs)
  async initializeFonts(): Promise<void> {
    if (this.fontsLoaded) return;

    try {
      console.log('Loading Arabic fonts...');
      
      // Load Arabic font (Amiri, Cairo, or Noto)
      const arabicFonts = await loadArabicFont(this.config.fontFamily || 'amiri');
      
      // Register fonts with pdfmake
      const pdfMakeVfs: Record<string, string> = {};
      pdfMakeVfs[`${ARABIC_FONT_NAME}-Regular.ttf`] = arabicFonts.normal;
      pdfMakeVfs[`${ARABIC_FONT_NAME}-Bold.ttf`] = arabicFonts.bold;
      pdfMakeVfs[`${ARABIC_FONT_NAME}-Italic.ttf`] = arabicFonts.italics;
      pdfMakeVfs[`${ARABIC_FONT_NAME}-BoldItalic.ttf`] = arabicFonts.bolditalics;
      
      // Set virtual file system
      (pdfMake as unknown as { vfs: Record<string, string> }).vfs = pdfMakeVfs;
      
      // Register font family
      const fonts = {
        [ARABIC_FONT_NAME]: {
          normal: `${ARABIC_FONT_NAME}-Regular.ttf`,
          bold: `${ARABIC_FONT_NAME}-Bold.ttf`,
          italics: `${ARABIC_FONT_NAME}-Italic.ttf`,
          bolditalics: `${ARABIC_FONT_NAME}-BoldItalic.ttf`,
        },
      };
      
      (pdfMake as unknown as { fonts: typeof fonts }).fonts = fonts;
      
      this.fontsLoaded = true;
      console.log('Arabic fonts loaded successfully');
    } catch (error) {
      console.error('Failed to load Arabic fonts:', error);
      throw new Error('Failed to load Arabic fonts for PDF generation');
    }
  }

  // Generate PDF document definition
  createDocumentDefinition(content: PDFContent[], options?: Record<string, unknown>): Record<string, unknown> {
    const headerContent = createRTLHeader(this.config);

    return {
      pageSize: this.config.pageSize,
      pageOrientation: this.config.pageOrientation,
      pageMargins: [40, 60, 40, 60],
      
      info: {
        title: this.config.title || 'مستند PDF',
        author: this.config.author || 'شركة علي صالح الشهري القابضة',
        subject: this.config.subject || '',
      },

      // Use Arabic font as default
      defaultStyle: {
        font: ARABIC_FONT_NAME,
        fontSize: 11,
        alignment: 'right',
        lineHeight: 1.4,
      },

      styles: {
        ...rtlStyles,
        // Override all styles to use Arabic font
        header: { ...rtlStyles.header, font: ARABIC_FONT_NAME },
        subheader: { ...rtlStyles.subheader, font: ARABIC_FONT_NAME },
        normal: { ...rtlStyles.normal, font: ARABIC_FONT_NAME },
        tableHeader: { ...rtlStyles.tableHeader, font: ARABIC_FONT_NAME },
        tableCell: { ...rtlStyles.tableCell, font: ARABIC_FONT_NAME },
        footer: { ...rtlStyles.footer, font: ARABIC_FONT_NAME },
        title: { ...rtlStyles.title, font: ARABIC_FONT_NAME },
        label: { ...rtlStyles.label, font: ARABIC_FONT_NAME },
        value: { ...rtlStyles.value, font: ARABIC_FONT_NAME },
        total: { ...rtlStyles.total, font: ARABIC_FONT_NAME },
        note: { ...rtlStyles.note, font: ARABIC_FONT_NAME },
      },

      header: (currentPage: number, pageCount: number) => ({
        text: this.config.title || '',
        font: ARABIC_FONT_NAME,
        alignment: 'center',
        fontSize: 9,
        color: '#9ca3af',
        margin: [40, 20, 40, 0],
      }),

      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          { 
            text: `${currentPage} / ${pageCount}`, 
            font: ARABIC_FONT_NAME,
            alignment: 'center', 
            fontSize: 9, 
            color: '#9ca3af' 
          },
        ],
        margin: [40, 0, 40, 20],
      }),

      content: [...headerContent, ...content],

      ...options,
    };
  }

  // Generate and download PDF
  async download(content: PDFContent[], filename: string = 'document.pdf', options?: Record<string, unknown>): Promise<void> {
    await this.initializeFonts();
    const docDefinition = this.createDocumentDefinition(content, options);
    pdfMake.createPdf(docDefinition as never).download(filename);
  }

  // Generate and open PDF in new tab
  async open(content: PDFContent[], options?: Record<string, unknown>): Promise<void> {
    await this.initializeFonts();
    const docDefinition = this.createDocumentDefinition(content, options);
    pdfMake.createPdf(docDefinition as never).open();
  }

  // Generate PDF as Blob
  async getBlob(content: PDFContent[], options?: Record<string, unknown>): Promise<Blob> {
    await this.initializeFonts();
    const docDefinition = this.createDocumentDefinition(content, options);
    const pdfDoc = pdfMake.createPdf(docDefinition as never);
    
    return new Promise((resolve) => {
      (pdfDoc as { getBlob: (cb: (blob: Blob) => void) => void }).getBlob((blob) => {
        resolve(blob);
      });
    });
  }

  // Generate PDF as Base64
  async getBase64(content: PDFContent[], options?: Record<string, unknown>): Promise<string> {
    await this.initializeFonts();
    const docDefinition = this.createDocumentDefinition(content, options);
    const pdfDoc = pdfMake.createPdf(docDefinition as never);
    
    return new Promise((resolve) => {
      (pdfDoc as { getBase64: (cb: (base64: string) => void) => void }).getBase64((base64) => {
        resolve(base64);
      });
    });
  }

  // Generate PDF as Data URL
  async getDataUrl(content: PDFContent[], options?: Record<string, unknown>): Promise<string> {
    await this.initializeFonts();
    const docDefinition = this.createDocumentDefinition(content, options);
    const pdfDoc = pdfMake.createPdf(docDefinition as never);
    
    return new Promise((resolve) => {
      (pdfDoc as { getDataUrl: (cb: (dataUrl: string) => void) => void }).getDataUrl((dataUrl) => {
        resolve(dataUrl);
      });
    });
  }
}

// Export singleton instance with default config
export const arabicPDF = new ArabicPDFGenerator({
  fontFamily: 'amiri',
  companyInfo: {
    name: 'Ali Saleh Al-Shehri Holding Company',
    nameAr: 'شركة علي صالح الشهري القابضة',
    address: 'المملكة العربية السعودية - الرياض',
    phone: '+966 11 123 4567',
    email: 'info@ash-holding.sa',
    website: 'www.alialshehriholding.com',
  },
});
