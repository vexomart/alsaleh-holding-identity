/**
 * INVOICE TYPES
 * Supports both new and legacy formats
 */

// === NEW CLEAN FORMAT ===
export interface SellerInfo {
  name: string;
  name_ar?: string;
  vat: string;
  address?: string;
  address_ar?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
}

export interface BuyerInfo {
  name: string;
  name_ar?: string;
  vat?: string;
  address?: string;
  address_ar?: string;
  email?: string;
  phone?: string;
}

export interface InvoiceItem {
  description: string;
  description_ar?: string;
  qty: number;
  unit_price: number;
}

export interface InvoiceDataNew {
  invoice_number: string;
  issued_at: string | Date;
  due_date?: string | Date | null;
  seller: SellerInfo;
  buyer: BuyerInfo;
  items: InvoiceItem[];
  vat_rate?: number;
  currency?: string;
  order_id?: string;
  customer_id?: string;
  notes?: string;
  notes_ar?: string;
}

// === LEGACY FORMAT (for backward compatibility) ===
export interface LegacySellerInfo {
  name: string;
  vatNumber?: string;
}

export interface LegacyBuyerInfo {
  name: string;
  vatNumber?: string;
}

export interface LegacyInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDataLegacy {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  status?: string;
  seller: LegacySellerInfo;
  buyer: LegacyBuyerInfo;
  items: LegacyInvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  notes?: string;
}

// Union type that accepts both formats
export type InvoiceData = InvoiceDataNew | InvoiceDataLegacy;

export interface InvoiceTotals {
  subtotal: number;
  vat_amount: number;
  total: number;
  vat_rate: number;
}

// === CONTRACT TYPES ===
export interface ContractData {
  contractNumber: string;
  customerName?: string;
  customerNameAr?: string;
  serviceName: string;
  serviceNameAr?: string;
  serviceDescription?: string;
  scopeSummary?: string;
  scopeSummaryAr?: string;
  pricing?: {
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    total: number;
  };
  signedAt?: string | Date;
  createdAt?: string | Date;
  date?: string | Date;
  currency?: string;
  provider?: { name: string; address?: string; phone?: string; role?: string };
  customer?: { name: string; nationalId?: string; phone?: string; role?: string };
  status?: string;
  // Admin approval info
  adminApprovedAt?: string | Date | null;
  adminApprovedBy?: string | null;
  // Customer signature info
  customerSignedAt?: string | Date | null;
  customerSignatureName?: string | null;
  [key: string]: unknown;
}

// === TRANSACTION TYPES ===
export interface TransactionSummary {
  startDate: string;
  endDate: string;
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  currency: string;
  transactions: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  date: string;
  type: string;
  typeAr?: string;
  description: string;
  descriptionAr?: string;
  amount: number;
  status: string;
  statusAr?: string;
}

// Type guard to check if it's legacy format
export function isLegacyInvoice(data: InvoiceData): data is InvoiceDataLegacy {
  return 'invoiceNumber' in data;
}

// Convert legacy to new format
export function normalizeInvoiceData(data: InvoiceData): InvoiceDataNew {
  if (isLegacyInvoice(data)) {
    return {
      invoice_number: data.invoiceNumber,
      issued_at: data.date,
      due_date: data.dueDate,
      seller: {
        name: data.seller.name,
        vat: data.seller.vatNumber || '',
      },
      buyer: {
        name: data.buyer.name,
        vat: data.buyer.vatNumber,
      },
      items: data.items.map(item => ({
        description: item.description,
        qty: item.quantity,
        unit_price: item.unitPrice,
      })),
      vat_rate: data.vatRate,
      currency: data.currency,
      notes: data.notes,
    };
  }
  return data;
}
