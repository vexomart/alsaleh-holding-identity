/**
 * Arabic Invoice PDF Generator
 * 
 * Generates professional invoices with full RTL support
 */

import { 
  ArabicPDFGenerator, 
  createRTLTable, 
  createRTLKeyValue,
  formatArabicCurrency,
  formatArabicDate,
  toArabicNumerals,
  type PDFContent,
} from './arabic-pdf';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate?: Date | string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
  };
  
  items: InvoiceItem[];
  
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  total: number;
  
  currency: string;
  notes?: string;
  terms?: string;
  
  paymentInfo?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  };
}

const statusLabels: Record<string, string> = {
  'pending': 'في الانتظار',
  'paid': 'مدفوعة',
  'overdue': 'متأخرة',
  'cancelled': 'ملغية',
};

export function generateInvoiceContent(invoice: InvoiceData, useArabicNumerals: boolean = false): PDFContent[] {
  const formatNum = (n: number | string) => useArabicNumerals ? toArabicNumerals(n) : String(n);
  const formatCurrency = (amount: number) => formatArabicCurrency(amount, invoice.currency, useArabicNumerals);

  const content: PDFContent[] = [];

  // Invoice Title
  content.push({
    text: 'فاتورة ضريبية',
    style: 'title',
  });

  // Invoice Info and Customer Info (side by side in RTL)
  content.push({
    columns: [
      // Customer Details (Left in RTL = Right side visually)
      {
        width: '50%',
        stack: [
          { text: 'بيانات العميل', style: 'subheader', margin: [0, 0, 0, 10] },
          createRTLKeyValue([
            { label: 'اسم العميل', value: invoice.customer.name },
            { label: 'البريد الإلكتروني', value: invoice.customer.email },
            ...(invoice.customer.phone ? [{ label: 'رقم الهاتف', value: invoice.customer.phone }] : []),
            ...(invoice.customer.address ? [{ label: 'العنوان', value: invoice.customer.address }] : []),
            ...(invoice.customer.taxNumber ? [{ label: 'الرقم الضريبي', value: invoice.customer.taxNumber }] : []),
          ]),
        ],
      },
      // Invoice Details (Right in RTL = Left side visually)
      {
        width: '50%',
        stack: [
          { text: 'تفاصيل الفاتورة', style: 'subheader', margin: [0, 0, 0, 10] },
          createRTLKeyValue([
            { label: 'رقم الفاتورة', value: invoice.invoiceNumber },
            { label: 'تاريخ الإصدار', value: formatArabicDate(invoice.issueDate, 'short') },
            ...(invoice.dueDate ? [{ label: 'تاريخ الاستحقاق', value: formatArabicDate(invoice.dueDate, 'short') }] : []),
            { label: 'حالة الفاتورة', value: statusLabels[invoice.status] || invoice.status },
          ]),
        ],
      },
    ],
    columnGap: 30,
    margin: [0, 0, 0, 30],
  });

  // Items Table (RTL - columns reversed)
  const tableHeaders = ['الوصف', 'الكمية', 'سعر الوحدة', 'الإجمالي'];
  const tableRows = invoice.items.map(item => [
    item.description,
    formatNum(item.quantity),
    formatCurrency(item.unitPrice),
    formatCurrency(item.total),
  ]);

  content.push({
    text: 'تفاصيل الخدمات',
    style: 'subheader',
    margin: [0, 0, 0, 10],
  });

  const tableContent = createRTLTable(tableHeaders, tableRows, ['*', 60, 100, 100], {
    alternateRowColor: '#f9fafb',
  });
  
  content.push({
    ...tableContent as Record<string, unknown>,
    margin: [0, 0, 0, 20],
  });

  // Totals Section (Right-aligned for RTL)
  content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 250,
        stack: [
          {
            columns: [
              { text: formatCurrency(invoice.subtotal), style: 'value', alignment: 'left' },
              { text: 'المجموع الفرعي:', style: 'label', alignment: 'right' },
            ],
            margin: [0, 5, 0, 5],
          },
          ...(invoice.discount ? [{
            columns: [
              { text: `- ${formatCurrency(invoice.discount)}`, style: 'value', alignment: 'left', color: '#ef4444' },
              { text: 'الخصم:', style: 'label', alignment: 'right' },
            ],
            margin: [0, 5, 0, 5],
          }] : []),
          {
            columns: [
              { text: formatCurrency(invoice.taxAmount), style: 'value', alignment: 'left' },
              { text: `ضريبة القيمة المضافة (${formatNum(invoice.taxRate)}%):`, style: 'label', alignment: 'right' },
            ],
            margin: [0, 5, 0, 5],
          },
          {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 250, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }],
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              { text: formatCurrency(invoice.total), style: 'total', alignment: 'left' },
              { text: 'الإجمالي الكلي:', style: 'total', alignment: 'right' },
            ],
            margin: [0, 5, 0, 5],
          },
        ],
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // Payment Information
  if (invoice.paymentInfo) {
    const paymentStack: PDFContent[] = [];
    if (invoice.paymentInfo.bankName) {
      paymentStack.push({ text: `اسم البنك: ${invoice.paymentInfo.bankName}`, style: 'normal', margin: [0, 3, 0, 3] });
    }
    if (invoice.paymentInfo.accountNumber) {
      paymentStack.push({ text: `رقم الحساب: ${invoice.paymentInfo.accountNumber}`, style: 'normal', margin: [0, 3, 0, 3] });
    }
    if (invoice.paymentInfo.iban) {
      paymentStack.push({ text: `الآيبان: ${invoice.paymentInfo.iban}`, style: 'normal', margin: [0, 3, 0, 3] });
    }

    content.push({
      stack: [
        { text: 'معلومات الدفع', style: 'subheader', margin: [0, 0, 0, 10] },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: paymentStack,
              margin: [10, 10, 10, 10],
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb',
          },
        },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // Notes
  if (invoice.notes) {
    content.push({
      stack: [
        { text: 'ملاحظات', style: 'subheader', margin: [0, 0, 0, 10] },
        { text: invoice.notes, style: 'note' },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // Terms
  if (invoice.terms) {
    content.push({
      stack: [
        { text: 'الشروط والأحكام', style: 'subheader', margin: [0, 0, 0, 10] },
        { text: invoice.terms, style: 'note' },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // Footer
  content.push({
    stack: [
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }] },
      { text: 'شكراً لكم لاختيار خدماتنا', style: 'footer', alignment: 'center', margin: [0, 15, 0, 5] },
      { text: 'هذه فاتورة ضريبية صادرة إلكترونياً ولا تحتاج إلى توقيع', style: 'footer', alignment: 'center', fontSize: 8 },
    ],
    margin: [0, 20, 0, 0],
  });

  return content;
}

// Create Invoice PDF Generator instance
export async function createInvoicePDF(
  invoice: InvoiceData,
  options?: {
    filename?: string;
    download?: boolean;
    useArabicNumerals?: boolean;
  }
): Promise<{ blob?: Blob; dataUrl?: string }> {
  const generator = new ArabicPDFGenerator({
    title: `فاتورة ${invoice.invoiceNumber}`,
    subject: 'فاتورة ضريبية',
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

  const content = generateInvoiceContent(invoice, options?.useArabicNumerals);

  if (options?.download) {
    await generator.download(content, options.filename || `invoice-${invoice.invoiceNumber}.pdf`);
    return {};
  }

  const [blob, dataUrl] = await Promise.all([
    generator.getBlob(content),
    generator.getDataUrl(content),
  ]);

  return { blob, dataUrl };
}
