/**
 * Arabic Tax Invoice PDF Generator (VAT Compliant)
 * 
 * Generates professional tax invoices with:
 * - Full RTL support
 * - Arabic shaping and embedded fonts
 * - VAT calculations (configurable rate, default 15%)
 * - Company and customer blocks
 * - RTL services table with reversed columns
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
import { ensurePdfInitialized } from './pdf-init';

// Invoice item structure
export interface InvoiceItem {
  description: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Complete invoice data structure
export interface InvoiceData {
  // Invoice identification
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate?: Date | string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  
  // Customer information
  customer: {
    name: string;
    nameAr?: string;
    email: string;
    phone?: string;
    address?: string;
    taxNumber?: string; // VAT registration number
  };
  
  // Line items
  items: InvoiceItem[];
  
  // Financial totals
  subtotal: number;
  taxRate: number; // VAT percentage (default 15)
  taxAmount: number;
  discount?: number;
  total: number;
  
  // Currency
  currency: string;
  
  // Additional information
  notes?: string;
  terms?: string;
  
  // Payment details
  paymentInfo?: {
    bankName?: string;
    accountNumber?: string;
    iban?: string;
  };
}

// Company information for invoice header
export interface CompanyInfo {
  name: string;
  nameAr: string;
  vatNumber: string;
  crNumber?: string; // Commercial Registration
  address: string;
  addressAr?: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string; // Base64 or URL
}

// Order status translations
const statusLabels: Record<string, string> = {
  'pending': 'في الانتظار',
  'paid': 'مدفوعة',
  'overdue': 'متأخرة',
  'cancelled': 'ملغية',
  'processing': 'قيد المعالجة',
  'in_progress': 'قيد التنفيذ',
  'completed': 'مكتملة',
  'refunded': 'مستردة',
};

// Default company info (can be overridden)
const defaultCompanyInfo: CompanyInfo = {
  name: 'Ali Saleh Al-Shehri Holding Company',
  nameAr: 'شركة علي صالح الشهري القابضة',
  vatNumber: '300000000000003',
  crNumber: '1010000000',
  address: 'Riyadh, Kingdom of Saudi Arabia',
  addressAr: 'الرياض، المملكة العربية السعودية',
  phone: '+966 11 123 4567',
  email: 'info@ash-holding.sa',
  website: 'www.alialshehriholding.com',
};

/**
 * Calculate VAT for an invoice
 */
export function calculateVAT(subtotal: number, taxRate: number = 15): { taxAmount: number; total: number } {
  const taxAmount = Math.round((subtotal * (taxRate / 100)) * 100) / 100; // Round to 2 decimals
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { taxAmount, total };
}

/**
 * Calculate invoice totals from items
 */
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
    total: Math.round((total) * 100) / 100 
  };
}

/**
 * Generate invoice PDF content
 */
export function generateInvoiceContent(
  invoice: InvoiceData, 
  companyInfo: CompanyInfo = defaultCompanyInfo,
  useArabicNumerals: boolean = false
): PDFContent[] {
  const formatNum = (n: number | string) => useArabicNumerals ? toArabicNumerals(n) : String(n);
  const formatCurrency = (amount: number) => formatArabicCurrency(amount, invoice.currency, useArabicNumerals);

  const content: PDFContent[] = [];

  // ============================================
  // INVOICE TITLE (فاتورة ضريبية)
  // ============================================
  content.push({
    text: 'فاتورة ضريبية',
    style: 'title',
    alignment: 'center',
    margin: [0, 0, 0, 20],
  });

  content.push({
    text: 'Tax Invoice',
    fontSize: 12,
    color: '#6b7280',
    alignment: 'center',
    margin: [0, 0, 0, 30],
  });

  // ============================================
  // COMPANY BLOCK (RTL)
  // ============================================
  content.push({
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          // Company name (Arabic)
          { text: companyInfo.nameAr, style: 'header', alignment: 'center', margin: [0, 0, 0, 5] },
          // Company name (English)
          { text: companyInfo.name, fontSize: 11, color: '#6b7280', alignment: 'center', margin: [0, 0, 0, 10] },
          // VAT Number
          { 
            text: `الرقم الضريبي: ${companyInfo.vatNumber}`, 
            fontSize: 10, 
            alignment: 'center', 
            color: '#1e293b',
            margin: [0, 0, 0, 5],
          },
          // CR Number (if available)
          ...(companyInfo.crNumber ? [{ 
            text: `السجل التجاري: ${companyInfo.crNumber}`, 
            fontSize: 10, 
            alignment: 'center', 
            color: '#6b7280',
            margin: [0, 0, 0, 5],
          }] : []),
          // Address
          { 
            text: companyInfo.addressAr || companyInfo.address, 
            fontSize: 10, 
            alignment: 'center', 
            color: '#6b7280',
            margin: [0, 0, 0, 5],
          },
          // Contact info
          {
            text: `هاتف: ${companyInfo.phone} | بريد: ${companyInfo.email}`,
            fontSize: 9,
            alignment: 'center',
            color: '#6b7280',
            margin: [0, 0, 0, 5],
          },
          // Website
          ...(companyInfo.website ? [{
            text: companyInfo.website,
            fontSize: 9,
            alignment: 'center',
            color: '#3b82f6',
          }] : []),
        ],
        margin: [15, 15, 15, 15],
      }]],
    },
    layout: {
      fillColor: () => '#f8fafc',
      hLineColor: () => '#e5e7eb',
      vLineColor: () => '#e5e7eb',
      hLineWidth: () => 1,
      vLineWidth: () => 1,
    },
    margin: [0, 0, 0, 25],
  });

  // ============================================
  // INVOICE INFO + CUSTOMER INFO (Side by side RTL)
  // ============================================
  content.push({
    columns: [
      // Customer Details (Left in code = Right visually in RTL)
      {
        width: '50%',
        stack: [
          { text: 'بيانات العميل', style: 'subheader', margin: [0, 0, 0, 10] },
          { text: 'Customer Information', fontSize: 9, color: '#9ca3af', margin: [0, 0, 0, 10] },
          createRTLKeyValue([
            { label: 'اسم العميل', value: invoice.customer.nameAr || invoice.customer.name },
            { label: 'البريد الإلكتروني', value: invoice.customer.email },
            ...(invoice.customer.phone ? [{ label: 'رقم الهاتف', value: invoice.customer.phone }] : []),
            ...(invoice.customer.address ? [{ label: 'العنوان', value: invoice.customer.address }] : []),
            ...(invoice.customer.taxNumber ? [{ label: 'الرقم الضريبي للعميل', value: invoice.customer.taxNumber }] : []),
          ]),
        ],
      },
      // Invoice Details (Right in code = Left visually in RTL)
      {
        width: '50%',
        stack: [
          { text: 'تفاصيل الفاتورة', style: 'subheader', margin: [0, 0, 0, 10] },
          { text: 'Invoice Details', fontSize: 9, color: '#9ca3af', margin: [0, 0, 0, 10] },
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

  // ============================================
  // SERVICES TABLE (RTL - columns reversed)
  // Columns: الخدمة | الكمية | السعر | الإجمالي
  // ============================================
  content.push({
    text: 'تفاصيل الخدمات',
    style: 'subheader',
    margin: [0, 0, 0, 5],
  });

  content.push({
    text: 'Service Details',
    fontSize: 9,
    color: '#9ca3af',
    margin: [0, 0, 0, 10],
  });

  // Table headers (will be reversed by createRTLTable)
  const tableHeaders = ['الخدمة', 'الكمية', 'السعر', 'الإجمالي'];
  
  // Table rows (will be reversed by createRTLTable)
  const tableRows = invoice.items.map(item => [
    item.descriptionAr || item.description,
    formatNum(item.quantity),
    formatCurrency(item.unitPrice),
    formatCurrency(item.total),
  ]);

  const tableContent = createRTLTable(tableHeaders, tableRows, ['*', 60, 100, 100], {
    alternateRowColor: '#f9fafb',
    borderColor: '#e5e7eb',
  });
  
  content.push({
    ...tableContent as Record<string, unknown>,
    margin: [0, 0, 0, 25],
  });

  // ============================================
  // TOTALS SECTION (RTL aligned)
  // ============================================
  content.push({
    columns: [
      { width: '*', text: '' }, // Spacer
      {
        width: 280,
        table: {
          widths: ['*', 120],
          body: [
            // Subtotal
            [
              { text: formatCurrency(invoice.subtotal), alignment: 'left', fontSize: 11, margin: [8, 8, 8, 8] },
              { text: 'المجموع الفرعي:', alignment: 'right', fontSize: 11, color: '#6b7280', margin: [8, 8, 8, 8] },
            ],
            // Discount (if any)
            ...(invoice.discount && invoice.discount > 0 ? [[
              { text: `- ${formatCurrency(invoice.discount)}`, alignment: 'left', fontSize: 11, color: '#ef4444', margin: [8, 8, 8, 8] },
              { text: 'الخصم:', alignment: 'right', fontSize: 11, color: '#6b7280', margin: [8, 8, 8, 8] },
            ]] : []),
            // VAT
            [
              { text: formatCurrency(invoice.taxAmount), alignment: 'left', fontSize: 11, margin: [8, 8, 8, 8] },
              { text: `ضريبة القيمة المضافة (${formatNum(invoice.taxRate)}%):`, alignment: 'right', fontSize: 11, color: '#6b7280', margin: [8, 8, 8, 8] },
            ],
            // Total
            [
              { text: formatCurrency(invoice.total), alignment: 'left', fontSize: 14, bold: true, color: '#3b82f6', margin: [8, 10, 8, 10] },
              { text: 'الإجمالي المستحق:', alignment: 'right', fontSize: 14, bold: true, color: '#1e293b', margin: [8, 10, 8, 10] },
            ],
          ],
        },
        layout: {
          hLineColor: (i: number, node: { table: { body: unknown[] } }) => i === node.table.body.length - 1 ? '#3b82f6' : '#e5e7eb',
          vLineColor: () => '#e5e7eb',
          hLineWidth: (i: number, node: { table: { body: unknown[] } }) => i === 0 || i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 0,
          fillColor: (i: number, node: { table: { body: unknown[] } }) => i === node.table.body.length - 1 ? '#f0f9ff' : undefined,
        },
      },
    ],
    margin: [0, 0, 0, 30],
  });

  // ============================================
  // PAYMENT INFORMATION
  // ============================================
  if (invoice.paymentInfo && (invoice.paymentInfo.bankName || invoice.paymentInfo.iban)) {
    content.push({
      stack: [
        { text: 'معلومات الدفع', style: 'subheader', margin: [0, 0, 0, 5] },
        { text: 'Payment Information', fontSize: 9, color: '#9ca3af', margin: [0, 0, 0, 10] },
        {
          table: {
            widths: ['*'],
            body: [[{
              stack: [
                ...(invoice.paymentInfo.bankName ? [{ 
                  text: `اسم البنك: ${invoice.paymentInfo.bankName}`, 
                  style: 'normal', 
                  margin: [0, 3, 0, 3] 
                }] : []),
                ...(invoice.paymentInfo.accountNumber ? [{ 
                  text: `رقم الحساب: ${invoice.paymentInfo.accountNumber}`, 
                  style: 'normal', 
                  margin: [0, 3, 0, 3] 
                }] : []),
                ...(invoice.paymentInfo.iban ? [{ 
                  text: `الآيبان (IBAN): ${invoice.paymentInfo.iban}`, 
                  style: 'normal', 
                  margin: [0, 3, 0, 3] 
                }] : []),
              ],
              margin: [12, 12, 12, 12],
            }]],
          },
          layout: {
            fillColor: () => '#f8fafc',
            hLineColor: () => '#e5e7eb',
            vLineColor: () => '#e5e7eb',
          },
        },
      ],
      margin: [0, 0, 0, 25],
    });
  }

  // ============================================
  // NOTES
  // ============================================
  if (invoice.notes) {
    content.push({
      stack: [
        { text: 'ملاحظات', style: 'subheader', margin: [0, 0, 0, 5] },
        { text: 'Notes', fontSize: 9, color: '#9ca3af', margin: [0, 0, 0, 10] },
        { text: invoice.notes, style: 'note' },
      ],
      margin: [0, 0, 0, 20],
    });
  }

  // ============================================
  // TERMS & CONDITIONS
  // ============================================
  if (invoice.terms) {
    content.push({
      stack: [
        { text: 'الشروط والأحكام', style: 'subheader', margin: [0, 0, 0, 5] },
        { text: 'Terms & Conditions', fontSize: 9, color: '#9ca3af', margin: [0, 0, 0, 10] },
        { text: invoice.terms, style: 'note' },
      ],
      margin: [0, 0, 0, 25],
    });
  }

  // ============================================
  // FOOTER
  // ============================================
  content.push({
    stack: [
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' }] },
      { text: 'شكراً لكم لاختيار خدماتنا', style: 'footer', alignment: 'center', margin: [0, 15, 0, 5], fontSize: 11 },
      { text: 'Thank you for choosing our services', fontSize: 9, color: '#9ca3af', alignment: 'center', margin: [0, 0, 0, 10] },
      { 
        text: 'هذه فاتورة ضريبية صادرة إلكترونياً وفقاً لمتطلبات هيئة الزكاة والضريبة والجمارك', 
        style: 'footer', 
        alignment: 'center', 
        fontSize: 8,
        margin: [0, 0, 0, 3],
      },
      { 
        text: 'This is an electronic tax invoice issued in accordance with ZATCA requirements', 
        fontSize: 7, 
        color: '#9ca3af', 
        alignment: 'center',
      },
    ],
    margin: [0, 20, 0, 0],
  });

  return content;
}

/**
 * Create Invoice PDF Generator instance and generate PDF
 */
export async function createInvoicePDF(
  invoice: InvoiceData,
  options?: {
    filename?: string;
    download?: boolean;
    useArabicNumerals?: boolean;
    companyInfo?: CompanyInfo;
  }
): Promise<{ blob?: Blob; dataUrl?: string }> {
  // CRITICAL: Ensure fonts are initialized BEFORE any PDF generation
  // This is a singleton — all callers share the same promise.
  // If initialization fails, this throws and PDF generation is blocked.
  await ensurePdfInitialized();

  const companyInfo = options?.companyInfo || defaultCompanyInfo;
  
  const generator = new ArabicPDFGenerator({
    title: `فاتورة ${invoice.invoiceNumber}`,
    subject: 'فاتورة ضريبية',
    useArabicNumerals: options?.useArabicNumerals,
    companyInfo: {
      name: companyInfo.name,
      nameAr: companyInfo.nameAr,
      address: companyInfo.addressAr || companyInfo.address,
      phone: companyInfo.phone,
      email: companyInfo.email,
      website: companyInfo.website,
    },
  });

  const content = generateInvoiceContent(invoice, companyInfo, options?.useArabicNumerals);

  // IMPORTANT: avoid pdfmake's .download() since browsers may block it
  // when triggered after async operations. We always generate a Blob and
  // download it via a Blob URL.
  if (options?.download) {
    const { downloadBlob } = await import('./blob-download');
    const blob = await generator.getBlob(content);
    downloadBlob(blob, options.filename || `invoice-${invoice.invoiceNumber}.pdf`);
    return {};
  }

  const [blob, dataUrl] = await Promise.all([
    generator.getBlob(content),
    generator.getDataUrl(content),
  ]);

  return { blob, dataUrl };
}

/**
 * Generate invoice PDF from order ID (fetches order data and generates PDF)
 * This is the main entry point for generating invoices from orders
 */
export async function generateInvoicePdf(
  orderId: string,
  options?: {
    download?: boolean;
    useArabicNumerals?: boolean;
    companyInfo?: CompanyInfo;
  }
): Promise<{ blob?: Blob; dataUrl?: string; invoiceData?: InvoiceData }> {
  // In a real implementation, this would fetch the order from the database
  // For now, we'll throw an error indicating the order needs to be fetched
  console.log('Generating invoice for order:', orderId);
  
  // This function should be called with actual order data
  // The caller should transform the order data into InvoiceData format
  throw new Error('generateInvoicePdf requires order data. Use createInvoicePDF with InvoiceData instead, or implement order fetching logic.');
}

/**
 * Transform order data to invoice data
 */
export function orderToInvoiceData(
  order: {
    id: string;
    order_number: string;
    title: string;
    title_ar?: string;
    status: string;
    total_amount?: number;
    currency?: string;
    created_at: string;
    due_date?: string;
    notes?: unknown;
    metadata?: unknown;
  },
  customer: {
    full_name?: string;
    full_name_ar?: string;
    email: string;
    phone?: string;
  },
  services: Array<{
    name: string;
    name_ar?: string;
    price?: number;
    quantity?: number;
  }>,
  taxRate: number = 15
): InvoiceData {
  // Build items from services
  const items: InvoiceItem[] = services.map(service => ({
    description: service.name,
    descriptionAr: service.name_ar,
    quantity: service.quantity || 1,
    unitPrice: service.price || 0,
    total: (service.price || 0) * (service.quantity || 1),
  }));

  // Calculate totals
  const { subtotal, taxAmount, total } = calculateInvoiceTotals(items, taxRate);

  return {
    invoiceNumber: `INV-${order.order_number}`,
    issueDate: new Date(order.created_at),
    dueDate: order.due_date ? new Date(order.due_date) : undefined,
    status: order.status as InvoiceData['status'],
    
    customer: {
      name: customer.full_name || customer.email,
      nameAr: customer.full_name_ar,
      email: customer.email,
      phone: customer.phone,
    },
    
    items,
    subtotal,
    taxRate,
    taxAmount,
    total,
    currency: order.currency || 'SAR',
  };
}

/**
 * Example JSON input for an order with 2 services
 */
export const exampleInvoiceInput = {
  order: {
    id: 'ord-123',
    order_number: '2026-0042',
    title: 'Web Development Project',
    title_ar: 'مشروع تطوير موقع إلكتروني',
    status: 'pending',
    total_amount: 57500,
    currency: 'SAR',
    created_at: '2026-01-31T10:00:00Z',
    due_date: '2026-03-01T10:00:00Z',
  },
  customer: {
    full_name: 'Mohammed Al-Qahtani',
    full_name_ar: 'محمد القحطاني',
    email: 'mohammed@example.com',
    phone: '+966 55 123 4567',
  },
  services: [
    {
      name: 'Website Design & Development',
      name_ar: 'تصميم وتطوير موقع إلكتروني',
      price: 35000,
      quantity: 1,
    },
    {
      name: 'Monthly Maintenance Package',
      name_ar: 'باقة الصيانة الشهرية',
      price: 2500,
      quantity: 6,
    },
  ],
  taxRate: 15,
};
