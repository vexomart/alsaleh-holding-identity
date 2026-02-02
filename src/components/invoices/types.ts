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
    color: 'text-slate-100',
    bgColor: 'bg-slate-600',
  },
  pending: {
    labelAr: 'بانتظار الدفع',
    labelEn: 'Pending',
    color: 'text-amber-100',
    bgColor: 'bg-amber-600',
  },
  issued: {
    labelAr: 'صادرة',
    labelEn: 'Issued',
    color: 'text-blue-100',
    bgColor: 'bg-blue-600',
  },
  paid: {
    labelAr: 'مدفوعة',
    labelEn: 'Paid',
    color: 'text-emerald-100',
    bgColor: 'bg-emerald-600',
  },
  overdue: {
    labelAr: 'متأخرة',
    labelEn: 'Overdue',
    color: 'text-red-100',
    bgColor: 'bg-red-600',
  },
  cancelled: {
    labelAr: 'ملغاة',
    labelEn: 'Cancelled',
    color: 'text-gray-100',
    bgColor: 'bg-gray-600',
  },
};

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { type: 'card', label: 'Visa / Mastercard', labelAr: 'فيزا / ماستركارد', enabled: true },
  { type: 'bank_transfer', label: 'Bank Transfer', labelAr: 'تحويل بنكي', enabled: true },
  { type: 'apple_pay', label: 'Apple Pay', labelAr: 'أبل باي', enabled: false },
  { type: 'wallet', label: 'Wallet Balance', labelAr: 'رصيد المحفظة', enabled: false },
];
