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
  borderColor: string;
  iconColor: string;
}> = {
  draft: {
    labelAr: 'مسودة',
    labelEn: 'Draft',
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50',
    borderColor: 'border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-500',
  },
  pending: {
    labelAr: 'بانتظار الدفع',
    labelEn: 'Pending',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    iconColor: 'text-amber-500',
  },
  issued: {
    labelAr: 'صادرة',
    labelEn: 'Issued',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-500',
  },
  paid: {
    labelAr: 'مدفوعة',
    labelEn: 'Paid',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    iconColor: 'text-emerald-500',
  },
  overdue: {
    labelAr: 'متأخرة',
    labelEn: 'Overdue',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-500',
  },
  cancelled: {
    labelAr: 'ملغاة',
    labelEn: 'Cancelled',
    color: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
    borderColor: 'border-gray-200 dark:border-gray-700',
    iconColor: 'text-gray-400',
  },
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { type: 'card', label: 'Visa / Mastercard', labelAr: 'فيزا / ماستركارد', enabled: true },
  { type: 'bank_transfer', label: 'Bank Transfer', labelAr: 'تحويل بنكي', enabled: true },
  { type: 'apple_pay', label: 'Apple Pay', labelAr: 'أبل باي', enabled: false },
  { type: 'wallet', label: 'Wallet Balance', labelAr: 'رصيد المحفظة', enabled: false },
];
