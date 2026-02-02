/**
 * INVOICE PDF TEMPLATE — Arabic RTL Corporate
 * 
 * Returns a pdfmake document definition ONLY.
 * Does NOT call createPdf — that's done in render.ts.
 */

import { FONT_NAME } from '../init';
import { rtl, ltr, formatCurrency, createRtlTable, rtlKeyValue, arabicDefaultStyles } from '../arabic';
import type { DocDefinition } from '../render';

// Invoice data types
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate?: number;
  total?: number; // Optional, for display purposes
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string | Date;
  dueDate?: string | Date;
  
  // Seller
  seller: {
    name: string;
    address?: string;
    vatNumber?: string;
    crNumber?: string;
    phone?: string;
    email?: string;
  };
  
  // Buyer
  buyer: {
    name: string;
    address?: string;
    vatNumber?: string;
    phone?: string;
    email?: string;
  };
  
  // Items
  items: InvoiceItem[];
  
  // Totals (can be provided or calculated)
  subtotal?: number;
  vatRate?: number;
  vatAmount?: number;
  total?: number;
  
  // Notes
  notes?: string;
  currency?: string;
  
  // Optional status for display (permissive type)
  status?: string;
  
  // Legacy compatibility
  issueDate?: string | Date;
}

/**
 * Convert Date or string to display string
 */
function toDateString(date: string | Date | undefined): string {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

/**
 * Calculate invoice totals
 */
export function calculateTotals(data: InvoiceData): {
  subtotal: number;
  vatAmount: number;
  total: number;
} {
  const vatRate = data.vatRate ?? 0.15;
  
  const subtotal = data.subtotal ?? data.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  const vatAmount = data.vatAmount ?? (subtotal * vatRate);
  const total = data.total ?? (subtotal + vatAmount);
  
  return { subtotal, vatAmount, total };
}

/**
 * Build invoice document definition
 */
export function buildInvoiceDocDefinition(data: InvoiceData): DocDefinition {
  const currency = data.currency || 'SAR';
  const totals = calculateTotals(data);
  const vatRate = data.vatRate ?? 0.15;
  
  // Handle date - use issueDate as fallback
  const invoiceDate = toDateString(data.date || data.issueDate);
  const dueDate = toDateString(data.dueDate);
  
  // Items table data
  const tableHeaders = ['الإجمالي', 'الضريبة', 'السعر', 'الكمية', 'الوصف'];
  const tableRows = data.items.map(item => {
    const lineTotal = item.quantity * item.unitPrice;
    const lineVat = lineTotal * (item.vatRate ?? vatRate);
    return [
      formatCurrency(lineTotal + lineVat, currency),
      formatCurrency(lineVat, currency),
      formatCurrency(item.unitPrice, currency),
      String(item.quantity),
      item.description,
    ];
  });
  
  const content: unknown[] = [
    // Header: فاتورة ضريبية
    {
      text: rtl('فاتورة ضريبية'),
      style: 'header',
      alignment: 'center',
      margin: [0, 0, 0, 20],
    },
    
    // Invoice meta
    {
      columns: [
        {
          width: '*',
          stack: [
            rtlKeyValue('رقم الفاتورة', ltr(data.invoiceNumber), true),
            rtlKeyValue('التاريخ', rtl(invoiceDate)),
            ...(dueDate ? [rtlKeyValue('تاريخ الاستحقاق', rtl(dueDate))] : []),
          ],
        },
      ],
      margin: [0, 0, 0, 20],
    },
    
    // Seller and Buyer boxes
    {
      columns: [
        // Buyer (left in RTL)
        {
          width: '*',
          stack: [
            { text: rtl('المشتري'), style: 'subheader' },
            { text: rtl(data.buyer.name), margin: [0, 5, 0, 0] },
            ...(data.buyer.address ? [{ text: rtl(data.buyer.address) }] : []),
            ...(data.buyer.vatNumber ? [{ text: `${rtl('الرقم الضريبي:')} ${ltr(data.buyer.vatNumber)}` }] : []),
            ...(data.buyer.phone ? [{ text: `${rtl('الهاتف:')} ${ltr(data.buyer.phone)}` }] : []),
          ],
          margin: [0, 0, 10, 0],
        },
        // Seller (right in RTL)
        {
          width: '*',
          stack: [
            { text: rtl('البائع'), style: 'subheader' },
            { text: rtl(data.seller.name), margin: [0, 5, 0, 0] },
            ...(data.seller.address ? [{ text: rtl(data.seller.address) }] : []),
            ...(data.seller.vatNumber ? [{ text: `${rtl('الرقم الضريبي:')} ${ltr(data.seller.vatNumber)}` }] : []),
            ...(data.seller.crNumber ? [{ text: `${rtl('السجل التجاري:')} ${ltr(data.seller.crNumber)}` }] : []),
            ...(data.seller.phone ? [{ text: `${rtl('الهاتف:')} ${ltr(data.seller.phone)}` }] : []),
          ],
        },
      ],
      margin: [0, 0, 0, 20],
    },
    
    // Items table
    { text: rtl('البنود'), style: 'subheader', margin: [0, 10, 0, 10] },
    createRtlTable({
      headers: tableHeaders,
      rows: tableRows,
      widths: [80, 60, 60, 40, '*'],
      numericCols: [0, 1, 2, 3], // All except description
    }),
    
    // Totals box
    {
      margin: [0, 20, 0, 0],
      alignment: 'right',
      table: {
        widths: [100, 100],
        body: [
          [
            { text: formatCurrency(totals.subtotal, currency), alignment: 'right' },
            { text: rtl('المجموع الفرعي'), alignment: 'right', bold: true },
          ],
          [
            { text: formatCurrency(totals.vatAmount, currency), alignment: 'right' },
            { text: rtl(`ضريبة القيمة المضافة (${Math.round(vatRate * 100)}%)`), alignment: 'right', bold: true },
          ],
          [
            { text: formatCurrency(totals.total, currency), alignment: 'right', bold: true, fillColor: '#f3f4f6' },
            { text: rtl('الإجمالي'), alignment: 'right', bold: true, fillColor: '#f3f4f6' },
          ],
        ],
      },
      layout: 'lightHorizontalLines',
    },
    
    // Notes
    ...(data.notes ? [
      { text: rtl('ملاحظات'), style: 'subheader', margin: [0, 20, 0, 5] },
      { text: rtl(data.notes) },
    ] : []),
  ];
  
  return {
    ...arabicDefaultStyles,
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content,
    info: {
      title: `فاتورة ${data.invoiceNumber}`,
      author: data.seller.name,
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${ltr(currentPage)} / ${ltr(pageCount)}`,
      alignment: 'center',
      style: 'footer',
      margin: [0, 20, 0, 0],
    }),
  };
}

/**
 * Convert order data to invoice data
 */
export function orderToInvoiceData(
  order: {
    order_number: string;
    created_at: string | null;
    total_amount: number | null;
    currency?: string | null;
  },
  customer: {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
  },
  services: Array<{
    name?: string | null;
    name_ar?: string | null;
    price?: number | null;
    quantity?: number;
  }>
): InvoiceData {
  const totalAmount = order.total_amount || 0;
  const vatRate = 0.15;
  const subtotal = totalAmount / (1 + vatRate);
  const vatAmount = totalAmount - subtotal;

  return {
    invoiceNumber: `INV-${order.order_number}`,
    date: order.created_at || new Date().toISOString(),
    seller: {
      name: 'شركة الصالح القابضة',
      address: 'الرياض، المملكة العربية السعودية',
      vatNumber: '310123456789012',
      crNumber: '1010123456',
    },
    buyer: {
      name: customer.full_name || 'العميل',
      phone: customer.phone || undefined,
      email: customer.email || undefined,
    },
    items: services.map(s => ({
      description: s.name_ar || s.name || 'خدمة',
      quantity: s.quantity || 1,
      unitPrice: (s.price || 0) / (1 + vatRate),
    })),
    subtotal,
    vatAmount,
    vatRate,
    total: totalAmount,
    currency: order.currency || 'SAR',
  };
}

/**
 * Sample invoice data for testing
 */
export const sampleInvoiceData: InvoiceData = {
  invoiceNumber: 'INV-2025-0001',
  date: '2025-02-02',
  dueDate: '2025-03-02',
  seller: {
    name: 'شركة الصالح القابضة',
    address: 'الرياض، المملكة العربية السعودية',
    vatNumber: '310123456789012',
    crNumber: '1010123456',
    phone: '+966 11 234 5678',
  },
  buyer: {
    name: 'مؤسسة التقنية الحديثة',
    address: 'جدة، المملكة العربية السعودية',
    vatNumber: '310987654321098',
    phone: '+966 12 345 6789',
  },
  items: [
    { description: 'خدمات استشارية', quantity: 10, unitPrice: 500 },
    { description: 'تطوير برمجيات', quantity: 1, unitPrice: 15000 },
    { description: 'دعم فني شهري', quantity: 3, unitPrice: 2000 },
  ],
  vatRate: 0.15,
  notes: 'شكراً لتعاملكم معنا. الدفع مستحق خلال 30 يوماً.',
};
