/**
 * INVOICE UTILITIES
 * VAT calculations, totals, formatting
 */

import type { InvoiceData, InvoiceDataNew, InvoiceItem, InvoiceTotals } from './types';
import { SELLER_INFO } from './constants';

/**
 * Default VAT rate in Saudi Arabia
 */
export const DEFAULT_VAT_RATE = 0.15;

/**
 * Calculate line item total (qty × unit_price)
 */
export function calculateLineTotal(item: InvoiceItem): number {
  return item.qty * item.unit_price;
}

/**
 * Calculate invoice totals: subtotal, VAT, total
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  vatRate: number = DEFAULT_VAT_RATE
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const vat_amount = subtotal * vatRate;
  const total = subtotal + vat_amount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat_amount: Math.round(vat_amount * 100) / 100,
    total: Math.round(total * 100) / 100,
    vat_rate: vatRate,
  };
}

/**
 * Format currency (SAR by default)
 */
export function formatCurrency(amount: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + currency;
}

/**
 * Format date for Arabic display
 */
export function formatArabicDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format date in short format (YYYY/MM/DD)
 */
export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Convert order data to invoice data
 * Supports both old signature (3 args) and new signature (1-2 args)
 */
export function orderToInvoiceData(
  order: {
    id?: string;
    order_number: string;
    title?: string;
    title_ar?: string;
    total_amount?: number | null;
    customer_id?: string;
    created_at?: string | null;
    currency?: string | null;
    service?: { name?: string; name_ar?: string | null } | null;
  },
  customerOrInvoiceNumber?: string | {
    full_name?: string;
    email?: string;
    phone?: string;
  },
  services?: Array<{
    name?: string;
    name_ar?: string;
    price?: number;
    quantity?: number;
  }>
): InvoiceDataNew {
  const now = new Date();
  
  // Handle legacy 3-argument call: orderToInvoiceData(order, customer, services)
  if (typeof customerOrInvoiceNumber === 'object' && services) {
    const customer = customerOrInvoiceNumber;
    const totalAmount = services.reduce((sum, s) => sum + (s.price || 0) * (s.quantity || 1), 0);
    
    return {
      invoice_number: `INV-${order.order_number}`,
      issued_at: order.created_at || now.toISOString(),
      seller: {
        name: SELLER_INFO.name_en,
        name_ar: SELLER_INFO.name_ar,
        vat: SELLER_INFO.vat,
        address_ar: SELLER_INFO.address_ar,
        email: SELLER_INFO.email,
        phone: SELLER_INFO.phone,
      },
      buyer: {
        name: customer.full_name || 'Customer',
        name_ar: customer.full_name || 'العميل',
        email: customer.email,
        phone: customer.phone,
      },
      items: services.map(s => ({
        description: s.name || 'Service',
        description_ar: s.name_ar || 'خدمة',
        qty: s.quantity || 1,
        unit_price: s.price || 0,
      })),
      vat_rate: 0.15,
      currency: order.currency || 'SAR',
      order_id: order.id,
      customer_id: order.customer_id,
    };
  }
  
  // New simple signature: orderToInvoiceData(order, invoiceNumber?)
  const invoiceNumber = typeof customerOrInvoiceNumber === 'string' 
    ? customerOrInvoiceNumber 
    : `INV-${order.order_number}`;
  
  return {
    invoice_number: invoiceNumber,
    issued_at: order.created_at || now.toISOString(),
    seller: {
      name: SELLER_INFO.name_en,
      name_ar: SELLER_INFO.name_ar,
      vat: SELLER_INFO.vat,
      address_ar: SELLER_INFO.address_ar,
      email: SELLER_INFO.email,
      phone: SELLER_INFO.phone,
    },
    buyer: {
      name: 'Customer',
      name_ar: 'العميل',
    },
    items: [{
      description: order.service?.name || order.title || 'Service',
      description_ar: order.service?.name_ar || order.title_ar || 'خدمة',
      qty: 1,
      unit_price: order.total_amount || 0,
    }],
    vat_rate: 0.15,
    currency: order.currency || 'SAR',
    order_id: order.id,
    customer_id: order.customer_id,
  };
}

/**
 * Generate sample invoice for testing
 */
export function generateSampleInvoice(): InvoiceDataNew {
  return {
    invoice_number: 'INV-2026-0001',
    issued_at: new Date(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    seller: {
      name: SELLER_INFO.name_en,
      name_ar: SELLER_INFO.name_ar,
      vat: SELLER_INFO.vat,
      address_ar: SELLER_INFO.address_ar,
      email: SELLER_INFO.email,
      phone: SELLER_INFO.phone,
    },
    buyer: {
      name: 'Mohammed Ali',
      name_ar: 'محمد علي',
      vat: '310000000000456',
      address_ar: 'جدة، المملكة العربية السعودية',
      email: 'mohammed@example.com',
      phone: '+966 50 000 0000',
    },
    items: [
      {
        description: 'Company Formation Service',
        description_ar: 'خدمة تأسيس شركة',
        qty: 1,
        unit_price: 5000,
      },
      {
        description: 'Legal Consultation',
        description_ar: 'استشارة قانونية',
        qty: 2,
        unit_price: 1500,
      },
      {
        description: 'Document Processing',
        description_ar: 'معالجة المستندات',
        qty: 1,
        unit_price: 500,
      },
    ],
    vat_rate: 0.15,
    currency: 'SAR',
    notes_ar: 'شكراً لتعاملكم معنا',
  };
}
