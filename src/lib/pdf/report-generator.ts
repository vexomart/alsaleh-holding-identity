/**
 * Arabic Report PDF Generator
 * 
 * Generates professional reports with full RTL support
 */

import { 
  ArabicPDFGenerator, 
  createRTLTable, 
  formatArabicDate,
  toArabicNumerals,
  type PDFContent,
} from './arabic-pdf';

export interface ReportSection {
  title: string;
  content: string | ReportTable | ReportChart;
}

export interface ReportTable {
  type: 'table';
  headers: string[];
  rows: (string | number)[][];
  widths?: (string | number)[];
}

export interface ReportChart {
  type: 'chart';
  chartType: 'bar' | 'pie' | 'line';
  data: { label: string; value: number }[];
}

export interface ReportData {
  title: string;
  subtitle?: string;
  date: Date | string;
  period?: { from: Date | string; to: Date | string };
  sections: ReportSection[];
  summary?: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }[];
  notes?: string;
}

export function generateReportContent(report: ReportData, useArabicNumerals: boolean = false): PDFContent[] {
  const formatNum = (n: number | string) => useArabicNumerals ? toArabicNumerals(n) : String(n);
  const content: PDFContent[] = [];

  // Report Header
  const headerStack: PDFContent[] = [
    { text: report.title, style: 'title' },
  ];
  
  if (report.subtitle) {
    headerStack.push({ text: report.subtitle, style: 'subheader', alignment: 'center', margin: [0, 0, 0, 10] });
  }
  
  headerStack.push({ 
    text: `تاريخ التقرير: ${formatArabicDate(report.date, 'full')}`, 
    style: 'normal', 
    alignment: 'center',
    color: '#6b7280',
    margin: [0, 0, 0, 5],
  });
  
  if (report.period) {
    headerStack.push({
      text: `الفترة: من ${formatArabicDate(report.period.from, 'short')} إلى ${formatArabicDate(report.period.to, 'short')}`,
      style: 'normal',
      alignment: 'center',
      color: '#6b7280',
    });
  }

  content.push({
    stack: headerStack,
    margin: [0, 0, 0, 30],
  });

  // Summary Cards (if provided)
  if (report.summary && report.summary.length > 0) {
    const summaryColumns = report.summary.map(item => ({
      width: '*',
      stack: [
        { 
          text: typeof item.value === 'number' ? formatNum(item.value) : item.value, 
          fontSize: item.highlight ? 24 : 18, 
          bold: true, 
          alignment: 'center',
          color: item.highlight ? '#3b82f6' : '#1e293b',
        },
        { 
          text: item.label, 
          fontSize: 10, 
          alignment: 'center',
          color: '#6b7280',
          margin: [0, 5, 0, 0],
        },
      ],
      margin: [5, 10, 5, 10],
    }));

    content.push({
      table: {
        widths: new Array(report.summary.length).fill('*'),
        body: [summaryColumns],
      },
      layout: {
        fillColor: () => '#f8fafc',
        hLineColor: () => '#e5e7eb',
        vLineColor: () => '#e5e7eb',
        hLineWidth: () => 1,
        vLineWidth: () => 1,
        paddingLeft: () => 10,
        paddingRight: () => 10,
        paddingTop: () => 15,
        paddingBottom: () => 15,
      },
      margin: [0, 0, 0, 30],
    });
  }

  // Report Sections
  report.sections.forEach((section, index) => {
    content.push({
      text: section.title,
      style: 'subheader',
      margin: [0, index > 0 ? 20 : 0, 0, 15],
    });

    if (typeof section.content === 'string') {
      // Text content
      content.push({
        text: section.content,
        style: 'normal',
        margin: [0, 0, 0, 15],
      });
    } else if (section.content.type === 'table') {
      // Table content
      const table = section.content as ReportTable;
      const tableContent = createRTLTable(table.headers, table.rows, table.widths, {
        alternateRowColor: '#f9fafb',
      });
      content.push({
        ...tableContent as Record<string, unknown>,
        margin: [0, 0, 0, 15],
      });
    } else if (section.content.type === 'chart') {
      // Chart representation (as table since PDF doesn't support charts natively)
      const chart = section.content as ReportChart;
      const maxValue = Math.max(...chart.data.map(d => d.value));
      
      const chartRows = chart.data.map(item => {
        const barWidth = Math.round((item.value / maxValue) * 100);
        return [
          { text: item.label, style: 'tableCell' },
          { text: formatNum(item.value), style: 'tableCell' },
          { 
            canvas: [
              { 
                type: 'rect', 
                x: 0, 
                y: 2, 
                w: barWidth * 2, 
                h: 12, 
                color: '#3b82f6',
                r: 2,
              }
            ],
            margin: [0, 4, 0, 4],
          },
        ];
      });

      content.push({
        table: {
          widths: [100, 60, '*'],
          body: [
            [
              { text: 'البند', style: 'tableHeader' },
              { text: 'القيمة', style: 'tableHeader' },
              { text: 'النسبة', style: 'tableHeader' },
            ],
            ...chartRows,
          ],
        },
        layout: {
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
        },
        margin: [0, 0, 0, 15],
      });
    }
  });

  // Notes
  if (report.notes) {
    content.push({
      stack: [
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }] },
        { text: 'ملاحظات', style: 'subheader', margin: [0, 15, 0, 10] },
        { text: report.notes, style: 'note' },
      ],
      margin: [0, 20, 0, 0],
    });
  }

  return content;
}

// Create Report PDF Generator
export async function createReportPDF(
  report: ReportData,
  options?: {
    filename?: string;
    download?: boolean;
    useArabicNumerals?: boolean;
  }
): Promise<{ blob?: Blob; dataUrl?: string }> {
  const generator = new ArabicPDFGenerator({
    title: report.title,
    subject: 'تقرير',
    useArabicNumerals: options?.useArabicNumerals,
    companyInfo: {
      name: 'Ali Saleh Al-Shehri Holding Company',
      nameAr: 'شركة علي صالح الشهري القابضة',
      address: 'المملكة العربية السعودية - الرياض',
      phone: '+966 11 123 4567',
      email: 'info@alialshehriholding.com',
      website: 'www.alialshehriholding.com',
    },
  });

  const content = generateReportContent(report, options?.useArabicNumerals);

  if (options?.download) {
    await generator.download(content, options.filename || `report-${Date.now()}.pdf`);
    return {};
  }

  const [blob, dataUrl] = await Promise.all([
    generator.getBlob(content),
    generator.getDataUrl(content),
  ]);

  return { blob, dataUrl };
}
