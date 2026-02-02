/**
 * Invoice View Component Types
 * Enterprise-grade invoice UI - Shared between Admin & Customer
 */

export type InvoiceViewStatus = 'draft' | 'issued' | 'paid' | 'cancelled' | 'overdue' | 'pending';

export interface InvoiceParty {
  name: string;
  nameAr?: string;
  vatNumber?: string;
  address?: string;
  addressAr?: string;
  email?: string;
  phone?: string;
  customerId?: string;
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice: number;
  vatAmount?: number;
  lineTotal: number;
}

export interface InvoiceViewModel {
  id: string;
  invoiceNumber: string;
  status: InvoiceViewStatus;
  issuedAt: string;
  dueDate?: string | null;
  paidAt?: string | null;
  
  // Financial
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  
  // Parties
  seller: InvoiceParty;
  buyer: InvoiceParty;
  
  // Items
  items: InvoiceLineItem[];
  
  // References
  orderId?: string;
  orderNumber?: string;
  orderTitle?: string;
  orderTitleAr?: string;
  serviceId?: string;
  serviceName?: string;
  serviceNameAr?: string;
  contractId?: string;
  contractNumber?: string;
  
  // Payment
  paymentUrl?: string | null;
  paymentMethods?: PaymentMethod[];
  
  // Meta
  notes?: string;
  notesAr?: string;
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'wallet' | 'apple_pay';
  label: string;
  labelAr: string;
  enabled: boolean;
}

export const INVOICE_STATUS_CONFIG: Record<InvoiceViewStatus, {
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800/60',
  },
  pending: {
    labelAr: 'بانتظار الدفع',
    labelEn: 'Pending',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
  },
  issued: {
    labelAr: 'صادرة',
    labelEn: 'Issued',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
  },
  paid: {
    labelAr: 'مدفوعة',
    labelEn: 'Paid',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  overdue: {
    labelAr: 'متأخرة',
    labelEn: 'Overdue',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
  cancelled: {
    labelAr: 'ملغاة',
    labelEn: 'Cancelled',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/60',
  },
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { type: 'card', label: 'Visa / Mastercard', labelAr: 'فيزا / ماستركارد', enabled: true },
  { type: 'bank_transfer', label: 'Bank Transfer', labelAr: 'تحويل بنكي', enabled: true },
  { type: 'apple_pay', label: 'Apple Pay', labelAr: 'أبل باي', enabled: false },
  { type: 'wallet', label: 'Wallet Balance', labelAr: 'رصيد المحفظة', enabled: false },
];
