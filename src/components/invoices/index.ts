/**
 * Invoice Components - Enterprise Grade
 * Unified UI for Admin & Customer dashboards
 */

// Types
export * from './types';

// Main View
export { InvoiceView } from './InvoiceView';

// Components
export { InvoiceHeader } from './InvoiceHeader';
export { InvoiceMetricsRow } from './InvoiceMetricsRow';
export { InvoiceParties } from './InvoiceParties';
export { InvoiceItemsTable } from './InvoiceItemsTable';
export { InvoiceTotalsCard } from './InvoiceTotalsCard';
export { InvoiceActions } from './InvoiceActions';
export { InvoiceSkeleton } from './InvoiceSkeleton';
export { InvoiceStatusBadge } from './InvoiceStatusBadge';
export { InvoicePaymentSheet } from './InvoicePaymentSheet';
export { InvoiceFullPage } from './InvoiceFullPage';

// Utility: Convert CustomerInvoice to InvoiceViewModel
export function mapCustomerInvoiceToViewModel(
  invoice: {
    id: string;
    invoice_number: string;
    status: string;
    subtotal: number;
    vat_rate: number;
    vat_amount: number;
    total: number;
    currency: string;
    created_at: string;
    due_date?: string | null;
    paid_at?: string | null;
    payment_url?: string | null;
    notes?: string | null;
    order?: {
      id: string;
      order_number: string;
      title: string;
      title_ar?: string | null;
      service?: {
        name: string;
        name_ar?: string | null;
      } | null;
    } | null;
  },
  options?: {
    sellerName?: string;
    sellerNameAr?: string;
    sellerVat?: string;
    sellerAddress?: string;
    sellerAddressAr?: string;
    buyerName?: string;
    buyerNameAr?: string;
    buyerCustomerId?: string;
  }
): import('./types').InvoiceViewModel {
  const seller = {
    name: options?.sellerName || 'Ali Saleh Al-Shahri Holding Co.',
    nameAr: options?.sellerNameAr || 'شركة علي صالح الشهري القابضة',
    vatNumber: options?.sellerVat || '310123456789012',
    address: options?.sellerAddress || 'Riyadh, Saudi Arabia',
    addressAr: options?.sellerAddressAr || 'الرياض، المملكة العربية السعودية',
    email: 'info@ash-holding.sa',
    phone: '+966 11 000 0000',
  };

  const buyer = {
    name: options?.buyerName || 'Customer',
    nameAr: options?.buyerNameAr || 'العميل',
    customerId: options?.buyerCustomerId,
  };

  const items = [{
    id: '1',
    description: invoice.order?.service?.name || invoice.order?.title || 'Service',
    descriptionAr: invoice.order?.service?.name_ar || invoice.order?.title_ar || 'خدمة',
    quantity: 1,
    unitPrice: invoice.subtotal,
    lineTotal: invoice.subtotal,
  }];

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoice_number,
    status: invoice.status as any,
    issuedAt: invoice.created_at,
    dueDate: invoice.due_date,
    paidAt: invoice.paid_at,
    subtotal: invoice.subtotal,
    vatRate: invoice.vat_rate / 100, // Convert from percentage to decimal
    vatAmount: invoice.vat_amount,
    total: invoice.total,
    currency: invoice.currency,
    seller,
    buyer,
    items,
    orderId: invoice.order?.id,
    orderNumber: invoice.order?.order_number,
    orderTitle: invoice.order?.title,
    orderTitleAr: invoice.order?.title_ar || undefined,
    serviceName: invoice.order?.service?.name,
    serviceNameAr: invoice.order?.service?.name_ar || undefined,
    paymentUrl: invoice.payment_url,
    notes: invoice.notes || undefined,
  };
}

// Utility: Convert Order to InvoiceViewModel for Admin preview
export function mapOrderToInvoiceViewModel(
  order: {
    id: string;
    order_number: string;
    title: string;
    title_ar?: string | null;
    total_amount?: number | null;
    currency?: string | null;
    created_at?: string | null;
    due_date?: string | null;
    status?: string | null;
    customer_id?: string | null;
    service?: {
      name?: string;
      name_ar?: string | null;
    } | null;
  },
  options?: {
    invoiceNumber?: string;
    buyerName?: string;
    buyerNameAr?: string;
  }
): import('./types').InvoiceViewModel {
  const subtotal = order.total_amount || 0;
  const vatRate = 0.15;
  const vatAmount = Math.round(subtotal * vatRate * 100) / 100;
  const total = Math.round((subtotal + vatAmount) * 100) / 100;

  return {
    id: order.id,
    invoiceNumber: options?.invoiceNumber || `INV-${order.order_number}`,
    status: order.status === 'completed' ? 'paid' : 'pending',
    issuedAt: order.created_at || new Date().toISOString(),
    dueDate: order.due_date,
    subtotal,
    vatRate,
    vatAmount,
    total,
    currency: order.currency || 'SAR',
    seller: {
      name: 'Ali Saleh Al-Shahri Holding Co.',
      nameAr: 'شركة علي صالح الشهري القابضة',
      vatNumber: '310123456789012',
      address: 'Riyadh, Saudi Arabia',
      addressAr: 'الرياض، المملكة العربية السعودية',
      email: 'info@ash-holding.sa',
      phone: '+966 11 000 0000',
    },
    buyer: {
      name: options?.buyerName || 'Customer',
      nameAr: options?.buyerNameAr || 'العميل',
      customerId: order.customer_id || undefined,
    },
    items: [{
      id: '1',
      description: order.service?.name || order.title || 'Service',
      descriptionAr: order.service?.name_ar || order.title_ar || 'خدمة',
      quantity: 1,
      unitPrice: subtotal,
      lineTotal: subtotal,
    }],
    orderId: order.id,
    orderNumber: order.order_number,
    orderTitle: order.title,
    orderTitleAr: order.title_ar || undefined,
    serviceName: order.service?.name,
    serviceNameAr: order.service?.name_ar || undefined,
  };
}
