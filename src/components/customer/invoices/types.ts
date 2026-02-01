/**
 * Customer Invoices Types
 * Enterprise Invoices Center - RTL-first
 */

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue';

export interface CustomerInvoice {
  id: string;
  invoice_number: string;
  order_id: string;
  customer_id: string;
  tenant_id: string | null;
  status: InvoiceStatus;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  currency: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  pdf_url: string | null;
  payment_url: string | null;
  provider: string | null;
  provider_invoice_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined relations
  order?: {
    id: string;
    order_number: string;
    title: string;
    title_ar: string | null;
    total_amount: number | null;
    status: string | null;
    service?: {
      name: string;
      name_ar: string | null;
    } | null;
  } | null;
}

export interface InvoiceFilters {
  search: string;
  status: InvoiceStatus | 'all';
  dateRange: 'all' | '7d' | '30d' | '90d' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export type SortField = 'created_at' | 'due_date' | 'total' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface InvoicesSort {
  field: SortField;
  direction: SortDirection;
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-700 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
  },
  issued: {
    labelAr: 'صادرة',
    labelEn: 'Issued',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  paid: {
    labelAr: 'مدفوعة',
    labelEn: 'Paid',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  overdue: {
    labelAr: 'متأخرة',
    labelEn: 'Overdue',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  cancelled: {
    labelAr: 'ملغاة',
    labelEn: 'Cancelled',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};
