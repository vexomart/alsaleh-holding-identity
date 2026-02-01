/**
 * Arabic Tax Invoice Template (ZATCA Compliant)
 * 
 * Professional RTL invoice with:
 * - Full Arabic support with Cairo font
 * - VAT 15% calculations
 * - Company and customer blocks
 * - RTL services table
 * - Payment information
 * 
 * Uses Arabic correctness layer for proper bidi handling:
 * - ltr() for invoice numbers, VAT numbers, amounts, IBAN
 * - rtl() for Arabic labels and content
 */

import {
  initPdf,
  generatePDFBlob,
  downloadBlob,
  blobToDataUrl,
  createCompanyHeader,
  createRTLTable,
  createRTLKeyValue,
  createSeparator,
  formatCurrency,
  formatArabicDate,
  ltr,
  DEFAULT_COMPANY_INFO,
  ARABIC_FONT_NAME,
  type PDFContent,
} from '../core';

// ============================================
// INVOICE TYPES
// ============================================

export interface InvoiceItem {
  description: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice: number;
  taxAmount?: number;
  total: number;
}

export interface InvoiceCustomer {
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate?: Date | string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  total: number;
  currency: string;
  notes?: string;
  terms?: string;
  paymentMethod?: {
    type: 'bank_transfer' | 'card' | 'wallet' | 'cash';
    details?: string;
  };
  paymentInfo?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  };
}

export interface CompanyInfo {
  nameAr: string;
  nameEn?: string;
  vatNumber: string;
  crNumber?: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  website?: string;
}

// ============================================
// STATUS LABELS
// ============================================

const statusLabels: Record<string, { ar: string; color: string }> = {
  pending: { ar: 'في الانتظار', color: '#f59e0b' },
  paid: { ar: 'مدفوعة', color: '#10b981' },
  overdue: { ar: 'متأخرة', color: '#ef4444' },
  cancelled: { ar: 'ملغية', color: '#6b7280' },
};

const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  card: 'بطاقة ائتمان',
  wallet: 'محفظة إلكترونية',
  cash: 'نقداً',
};

// ============================================
// VAT CALCULATIONS
// ============================================

export function calculateVAT(subtotal: number, taxRate: number = 15): { taxAmount: number; total: number } {
  const taxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { taxAmount, total };
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number = 15,
  discount: number = 0
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const subtotalAfterDiscount = subtotal - discount;
  const { taxAmount, total } = calculateVAT(subtotalAfterDiscount, taxRate);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount,
    total: Math.round(total * 100) / 100,
  };
}

// ============================================
// INVOICE CONTENT GENERATOR
// ============================================

export function generateInvoiceContent(
  invoice: InvoiceData,
  companyInfo: CompanyInfo = DEFAULT_COMPANY_INFO as CompanyInfo
): PDFContent[] {
  const content: PDFContent[] = [];
  const currency = invoice.currency || 'SAR';
  const status = statusLabels[invoice.status] || statusLabels.pending;

  // === INVOICE TITLE ===
  content.push({
    text: 'فاتورة ضريبية',
    font: ARABIC_FONT_NAME,
    fontSize: 28,
    bold: true,
    alignment: 'center',
    color: '#0f172a',
    margin: [0, 0, 0, 5],
  });

  content.push({
    text: 'Tax Invoice',
    font: ARABIC_FONT_NAME,
    fontSize: 12,
    color: '#64748b',
    alignment: 'center',
    margin: [0, 0, 0, 25],
  });

  // === COMPANY HEADER ===
  content.push(createCompanyHeader(companyInfo));

  // === SEPARATOR ===
  content.push(createSeparator('#0369a1'));

  // === INVOICE INFO + CUSTOMER (Two columns) ===
  content.push({
    columns: [
      // Customer Details (visually right in RTL)
      {
        width: '50%',
        stack: [
          {
            text: 'بيانات العميل',
            font: ARABIC_FONT_NAME,
            fontSize: 14,
            bold: true,
            color: '#1e293b',
            margin: [0, 0, 0, 5],
          },
          {
            text: 'Customer Information',
            font: ARABIC_FONT_NAME,
            fontSize: 9,
            color: '#94a3b8',
            margin: [0, 0, 0, 10],
          },
          createRTLKeyValue([
            { label: 'اسم العميل', value: invoice.customer.nameAr || invoice.customer.name },
            { label: 'البريد الإلكتروني', value: ltr(invoice.customer.email), valueLTR: true },
            ...(invoice.customer.phone ? [{ label: 'رقم الهاتف', value: ltr(invoice.customer.phone), valueLTR: true }] : []),
            ...(invoice.customer.address ? [{ label: 'العنوان', value: invoice.customer.address }] : []),
            ...(invoice.customer.taxNumber ? [{ label: 'الرقم الضريبي', value: ltr(invoice.customer.taxNumber), valueLTR: true }] : []),
          ]),
        ],
      },
      // Invoice Details (visually left in RTL)
      {
        width: '50%',
        stack: [
          {
            text: 'تفاصيل الفاتورة',
            font: ARABIC_FONT_NAME,
            fontSize: 14,
            bold: true,
            color: '#1e293b',
            margin: [0, 0, 0, 5],
          },
          {
            text: 'Invoice Details',
            font: ARABIC_FONT_NAME,
            fontSize: 9,
            color: '#94a3b8',
            margin: [0, 0, 0, 10],
          },
          createRTLKeyValue([
            { label: 'رقم الفاتورة', value: ltr(invoice.invoiceNumber), valueLTR: true },
            { label: 'تاريخ الإصدار', value: formatArabicDate(invoice.issueDate, 'short') },
            ...(invoice.dueDate ? [{ label: 'تاريخ الاستحقاق', value: formatArabicDate(invoice.dueDate, 'short') }] : []),
            { label: 'حالة الفاتورة', value: status.ar },
          ]),
        ],
      },
    ],
    columnGap: 30,
    margin: [0, 0, 0, 30],
  });

  // === SERVICES TABLE ===
  content.push({
    text: 'تفاصيل الخدمات',
    font: ARABIC_FONT_NAME,
    fontSize: 14,
    bold: true,
    color: '#1e293b',
    margin: [0, 0, 0, 5],
  });

  content.push({
    text: 'Service Details',
    font: ARABIC_FONT_NAME,
    fontSize: 9,
    color: '#94a3b8',
    margin: [0, 0, 0, 10],
  });

  // Table: الوصف | الكمية | السعر | الضريبة | الإجمالي
  // RTL: Reversed column order for display
  const tableHeaders = ['الوصف', 'الكمية', 'السعر', 'الضريبة', 'الإجمالي'];
  const tableRows = invoice.items.map(item => {
    const itemTax = item.taxAmount ?? Math.round(item.total * 0.15 / 1.15 * 100) / 100;
    return [
      item.descriptionAr || item.description,
      ltr(String(item.quantity)),
      ltr(formatCurrency(item.unitPrice, currency)),
      ltr(formatCurrency(itemTax, currency)),
      ltr(formatCurrency(item.total, currency)),
    ];
  });

  const servicesTable = createRTLTable(tableHeaders, tableRows, ['*', 60, 90, 90, 100], {
    alternateRowColor: '#f9fafb',
    borderColor: '#e2e8f0',
    ltrColumns: [1, 2, 3, 4], // Quantity, Price, Tax, Total are LTR numbers
  });

  content.push({
    ...servicesTable as Record<string, unknown>,
    margin: [0, 0, 0, 25],
  });

  // === TOTALS SECTION ===
  content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 280,
        table: {
          widths: ['*', 120],
          body: [
            // Subtotal
            [
              {
                text: ltr(formatCurrency(invoice.subtotal, currency)),
                font: ARABIC_FONT_NAME,
                alignment: 'left',
                fontSize: 11,
                margin: [8, 8, 8, 8],
              },
              {
                text: 'المجموع الفرعي:',
                font: ARABIC_FONT_NAME,
                alignment: 'right',
                fontSize: 11,
                color: '#64748b',
                margin: [8, 8, 8, 8],
              },
            ],
            // Discount (if any)
            ...(invoice.discount && invoice.discount > 0 ? [[
              {
                text: `- ${ltr(formatCurrency(invoice.discount, currency))}`,
                font: ARABIC_FONT_NAME,
                alignment: 'left',
                fontSize: 11,
                color: '#ef4444',
                margin: [8, 8, 8, 8],
              },
              {
                text: 'الخصم:',
                font: ARABIC_FONT_NAME,
                alignment: 'right',
                fontSize: 11,
                color: '#64748b',
                margin: [8, 8, 8, 8],
              },
            ]] : []),
            // VAT
            [
              {
                text: ltr(formatCurrency(invoice.taxAmount, currency)),
                font: ARABIC_FONT_NAME,
                alignment: 'left',
                fontSize: 11,
                margin: [8, 8, 8, 8],
              },
              {
                text: `ضريبة القيمة المضافة (${ltr(String(invoice.taxRate))}%):`,
                font: ARABIC_FONT_NAME,
                alignment: 'right',
                fontSize: 11,
                color: '#64748b',
                margin: [8, 8, 8, 8],
              },
            ],
            // Total
            [
              {
                text: ltr(formatCurrency(invoice.total, currency)),
                font: ARABIC_FONT_NAME,
                alignment: 'left',
                fontSize: 16,
                bold: true,
                color: '#0369a1',
                margin: [8, 12, 8, 12],
              },
              {
                text: 'الإجمالي المستحق:',
                font: ARABIC_FONT_NAME,
                alignment: 'right',
                fontSize: 14,
                bold: true,
                color: '#0f172a',
                margin: [8, 12, 8, 12],
              },
            ],
          ],
        },
        layout: {
          hLineColor: (i: number, node: { table: { body: unknown[] } }) =>
            i === node.table.body.length - 1 ? '#0369a1' : '#e2e8f0',
          vLineColor: () => 'transparent',
          hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
            i === 0 || i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 0,
          fillColor: (i: number, node: { table: { body: unknown[] } }) =>
            i === node.table.body.length - 1 ? '#f0f9ff' : undefined,
        },
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // === PAYMENT METHOD ===
  if (invoice.paymentMethod) {
    content.push({
      stack: [
        {
          text: 'طريقة الدفع',
          font: ARABIC_FONT_NAME,
          fontSize: 14,
          bold: true,
          color: '#1e293b',
          margin: [0, 0, 0, 5],
        },
        {
          text: 'Payment Method',
          font: ARABIC_FONT_NAME,
          fontSize: 9,
          color: '#94a3b8',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                {
                  text: paymentMethodLabels[invoice.paymentMethod.type] || invoice.paymentMethod.type,
                  font: ARABIC_FONT_NAME,
                  fontSize: 12,
                  bold: true,
                  margin: [0, 3, 0, 3],
                },
                ...(invoice.paymentMethod.details ? [{
                  text: invoice.paymentMethod.details,
                  font: ARABIC_FONT_NAME,
                  fontSize: 10,
                  color: '#64748b',
                  margin: [0, 3, 0, 3],
                }] : []),
              ],
              margin: [15, 12, 15, 12],
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
          },
        },
      ],
      margin: [0, 0, 0, 25],
    });
  }

  // === BANK PAYMENT INFORMATION ===
  if (invoice.paymentInfo && (invoice.paymentInfo.bankName || invoice.paymentInfo.iban)) {
    content.push({
      stack: [
        {
          text: 'معلومات التحويل البنكي',
          font: ARABIC_FONT_NAME,
          fontSize: 14,
          bold: true,
          color: '#1e293b',
          margin: [0, 0, 0, 5],
        },
        {
          text: 'Bank Transfer Information',
          font: ARABIC_FONT_NAME,
          fontSize: 9,
          color: '#94a3b8',
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                ...(invoice.paymentInfo.bankName ? [{
                  columns: [
                    { text: invoice.paymentInfo.bankName, font: ARABIC_FONT_NAME, fontSize: 11, width: 'auto' as const },
                    { text: ' :اسم البنك', font: ARABIC_FONT_NAME, fontSize: 10, color: '#64748b', width: '*', alignment: 'right' as const },
                  ],
                  margin: [0, 3, 0, 3],
                }] : []),
                ...(invoice.paymentInfo.accountNumber ? [{
                  columns: [
                    { text: ltr(invoice.paymentInfo.accountNumber), font: ARABIC_FONT_NAME, fontSize: 11, width: 'auto' as const },
                    { text: ' :رقم الحساب', font: ARABIC_FONT_NAME, fontSize: 10, color: '#64748b', width: '*', alignment: 'right' as const },
                  ],
                  margin: [0, 3, 0, 3],
                }] : []),
                ...(invoice.paymentInfo.iban ? [{
                  columns: [
                    { text: ltr(invoice.paymentInfo.iban), font: ARABIC_FONT_NAME, fontSize: 11, width: 'auto' as const, bold: true },
                    { text: ' :(IBAN) الآيبان', font: ARABIC_FONT_NAME, fontSize: 10, color: '#64748b', width: '*', alignment: 'right' as const },
                  ],
                  margin: [0, 3, 0, 3],
                }] : []),
              ],
              margin: [15, 12, 15, 12],
            }]],
          },
          layout: {
            fillColor: () => '#fefce8',
            hLineColor: () => '#fcd34d',
            vLineColor: () => '#fcd34d',
          },
        },
      ],
      margin: [0, 0, 0, 25],
    });
  }

  // === NOTES ===
  if (invoice.notes) {
    content.push({
      stack: [
        {
          text: 'ملاحظات',
          font: ARABIC_FONT_NAME,
          fontSize: 12,
          bold: true,
          color: '#1e293b',
          margin: [0, 0, 0, 5],
        },
        {
          text: invoice.notes,
          font: ARABIC_FONT_NAME,
          fontSize: 10,
          color: '#475569',
          lineHeight: 1.5,
        },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // === TERMS ===
  if (invoice.terms) {
    content.push({
      stack: [
        {
          text: 'الشروط والأحكام',
          font: ARABIC_FONT_NAME,
          fontSize: 12,
          bold: true,
          color: '#1e293b',
          margin: [0, 0, 0, 5],
        },
        {
          text: invoice.terms,
          font: ARABIC_FONT_NAME,
          fontSize: 10,
          color: '#475569',
          lineHeight: 1.5,
        },
      ],
      margin: [0, 0, 0, 25],
    });
  }

  // === FOOTER ===
  content.push({
    stack: [
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e2e8f0' }] },
      {
        text: 'شكراً لكم لاختيار خدماتنا',
        font: ARABIC_FONT_NAME,
        fontSize: 12,
        alignment: 'center',
        color: '#334155',
        margin: [0, 20, 0, 5],
      },
      {
        text: 'Thank you for choosing our services',
        font: ARABIC_FONT_NAME,
        fontSize: 10,
        color: '#94a3b8',
        alignment: 'center',
        margin: [0, 0, 0, 15],
      },
      {
        text: 'هذه فاتورة ضريبية صادرة إلكترونياً وفقاً لمتطلبات هيئة الزكاة والضريبة والجمارك',
        font: ARABIC_FONT_NAME,
        fontSize: 8,
        alignment: 'center',
        color: '#94a3b8',
        margin: [0, 0, 0, 3],
      },
      {
        text: 'This is an electronic tax invoice issued in accordance with ZATCA requirements',
        font: ARABIC_FONT_NAME,
        fontSize: 7,
        color: '#94a3b8',
        alignment: 'center',
      },
    ],
    margin: [0, 20, 0, 0],
  });

  return content;
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export interface CreateInvoicePDFOptions {
  filename?: string;
  download?: boolean;
  companyInfo?: CompanyInfo;
}

export async function createInvoicePDF(
  invoice: InvoiceData,
  options: CreateInvoicePDFOptions = {}
): Promise<{ blob?: Blob; dataUrl?: string }> {
  console.log('[Invoice Template] Starting PDF generation for:', invoice.invoiceNumber);
  
  try {
    // Initialize PDF system (throws if Cairo not loaded)
    console.log('[Invoice Template] Initializing PDF system...');
    await initPdf();
    console.log('[Invoice Template] PDF system initialized');

    const companyInfo = options.companyInfo || DEFAULT_COMPANY_INFO as CompanyInfo;
    
    console.log('[Invoice Template] Generating content...');
    const content = generateInvoiceContent(invoice, companyInfo);
    console.log('[Invoice Template] Content generated, creating blob...');

    const blob = await generatePDFBlob(content, {
      title: `فاتورة ضريبية - ${invoice.invoiceNumber}`,
      subject: 'فاتورة ضريبية',
    });
    
    console.log('[Invoice Template] Blob created, size:', blob.size);

    if (options.download) {
      const filename = options.filename || `invoice-${invoice.invoiceNumber}.pdf`;
      console.log('[Invoice Template] Downloading as:', filename);
      downloadBlob(blob, filename);
      return { blob };
    }

    const dataUrl = await blobToDataUrl(blob);
    return { blob, dataUrl };
    
  } catch (error) {
    console.error('[Invoice Template] ❌ PDF generation failed:', error);
    throw error;
  }
}

// ============================================
// UTILITY: Order to Invoice Data
// ============================================

export function orderToInvoiceData(
  order: {
    order_number: string;
    created_at: string;
    total_amount?: number;
    currency?: string;
  },
  customer: {
    full_name?: string;
    full_name_ar?: string;
    email: string;
    phone?: string;
  },
  services: {
    name?: string;
    name_ar?: string;
    price?: number;
    quantity?: number;
  }[],
  taxRate: number = 15
): InvoiceData {
  const items: InvoiceItem[] = services.map(service => ({
    description: service.name || 'Service',
    descriptionAr: service.name_ar || service.name || 'خدمة',
    quantity: service.quantity || 1,
    unitPrice: service.price || 0,
    total: (service.price || 0) * (service.quantity || 1),
  }));

  const totals = calculateInvoiceTotals(items, taxRate);

  return {
    invoiceNumber: `INV-${order.order_number.replace('ORD-', '')}`,
    issueDate: new Date(order.created_at),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'pending',
    customer: {
      name: customer.full_name || customer.email,
      nameAr: customer.full_name_ar || customer.full_name || customer.email,
      email: customer.email,
      phone: customer.phone,
    },
    items,
    subtotal: totals.subtotal,
    taxRate,
    taxAmount: totals.taxAmount,
    total: totals.total,
    currency: order.currency || 'SAR',
    notes: 'شكراً لكم على ثقتكم بخدماتنا. يرجى السداد خلال 30 يوماً.',
    paymentMethod: {
      type: 'bank_transfer',
    },
    paymentInfo: {
      bankName: 'البنك الأهلي السعودي',
      iban: 'SA0380000000608010167519',
    },
  };
}

// ============================================
// SAMPLE INVOICES FOR TESTING
// ============================================

export const sampleInvoiceArabicOnly: InvoiceData = {
  invoiceNumber: 'INV-2026-00001',
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  status: 'pending',
  customer: {
    name: 'محمد أحمد العلي',
    nameAr: 'محمد أحمد العلي',
    email: 'mohammed@example.com',
    phone: '+966501234567',
    address: 'الرياض، حي النخيل',
    taxNumber: '300000000000099',
  },
  items: [
    { description: 'استشارات قانونية', descriptionAr: 'استشارات قانونية', quantity: 1, unitPrice: 5000, total: 5000 },
    { description: 'إعداد عقود', descriptionAr: 'إعداد عقود تجارية', quantity: 3, unitPrice: 1500, total: 4500 },
  ],
  subtotal: 9500,
  taxRate: 15,
  taxAmount: 1425,
  total: 10925,
  currency: 'SAR',
  notes: 'يرجى السداد خلال ثلاثين يوماً من تاريخ الإصدار',
  paymentMethod: { type: 'bank_transfer' },
  paymentInfo: {
    bankName: 'البنك الأهلي السعودي',
    iban: 'SA0380000000608010167519',
  },
};

export const sampleInvoiceMixed: InvoiceData = {
  invoiceNumber: 'INV-2026-00002',
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  status: 'paid',
  customer: {
    name: 'Ali Saleh Trading Co.',
    nameAr: 'شركة علي صالح للتجارة',
    email: 'finance@alisaleh-trading.com',
    phone: '+966 11 456 7890',
    address: 'جدة، حي الروضة، شارع الملك فهد',
    taxNumber: '310000000000055',
  },
  items: [
    { description: 'IT Consulting Services', descriptionAr: 'خدمات استشارات تقنية', quantity: 10, unitPrice: 750, total: 7500 },
    { description: 'Software License - Premium', descriptionAr: 'ترخيص برمجيات - النسخة المتميزة', quantity: 5, unitPrice: 2000, total: 10000 },
    { description: 'Annual Support Package', descriptionAr: 'باقة الدعم الفني السنوي', quantity: 1, unitPrice: 12000, total: 12000 },
  ],
  subtotal: 29500,
  taxRate: 15,
  taxAmount: 4425,
  discount: 500,
  total: 33425,
  currency: 'SAR',
  notes: 'فاتورة رقم INV-2026-00002 - تم السداد بنجاح عبر التحويل البنكي',
  terms: 'جميع الخدمات مقدمة وفق الشروط والأحكام المتفق عليها. لا يتم استرداد المبالغ بعد تقديم الخدمة.',
  paymentMethod: { type: 'wallet', details: 'تم الدفع من محفظة العميل' },
  paymentInfo: {
    bankName: 'مصرف الراجحي',
    accountNumber: '123456789012',
    iban: 'SA0280000000001234567890',
  },
};
