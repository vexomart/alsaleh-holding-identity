/**
 * Wallet Module Types - PHASE WALLET-0
 */

// Payment Methods
export type PaymentMethodType = 'card' | 'mada' | 'visa' | 'bank_transfer' | 'wallet';

export interface PaymentMethod {
  id: string;
  tenant_id: string | null;
  user_id: string | null;
  type: PaymentMethodType;
  label_ar: string;
  label_en: string;
  is_enabled: boolean;
  is_default: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Bank Transfer Requests
export type BankTransferStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface BankTransferRequest {
  id: string;
  tenant_id: string | null;
  user_id: string;
  wallet_id: string | null;
  amount: number;
  currency: string;
  bank_name: string;
  iban: string;
  account_holder_name: string | null;
  reference_code: string;
  receipt_media_url: string | null;
  status: BankTransferStatus;
  reviewer_user_id: string | null;
  reviewer_notes: string | null;
  rejection_reason: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: {
    full_name: string | null;
    full_name_ar: string | null;
    email: string;
  };
}

export interface CreateBankTransferRequest {
  amount: number;
  bank_name: string;
  iban: string;
  account_holder_name?: string;
  receipt_media_url?: string;
}

// Wallet with reserved balance
export interface WalletWithReserved {
  id: string;
  tenant_id: string | null;
  customer_user_id: string;
  wallet_number: string;
  balance: number;
  reserved_balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Status labels
export const BANK_TRANSFER_STATUS_LABELS: Record<BankTransferStatus, { ar: string; en: string }> = {
  submitted: { ar: 'مقدم', en: 'Submitted' },
  under_review: { ar: 'قيد المراجعة', en: 'Under Review' },
  approved: { ar: 'معتمد', en: 'Approved' },
  rejected: { ar: 'مرفوض', en: 'Rejected' },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, { ar: string; en: string }> = {
  card: { ar: 'بطاقة ائتمان', en: 'Credit Card' },
  mada: { ar: 'مدى', en: 'Mada' },
  visa: { ar: 'فيزا', en: 'Visa' },
  bank_transfer: { ar: 'تحويل بنكي', en: 'Bank Transfer' },
  wallet: { ar: 'المحفظة', en: 'Wallet' },
};

// Saudi Banks
export const SAUDI_BANKS = [
  { code: 'RJHI', name_ar: 'مصرف الراجحي', name_en: 'Al Rajhi Bank' },
  { code: 'ALBI', name_ar: 'البنك الأهلي', name_en: 'Al Ahli Bank (SNB)' },
  { code: 'RIBL', name_ar: 'بنك الرياض', name_en: 'Riyad Bank' },
  { code: 'SABB', name_ar: 'البنك السعودي البريطاني', name_en: 'SABB' },
  { code: 'SIBC', name_ar: 'بنك الإنماء', name_en: 'Alinma Bank' },
  { code: 'BSFR', name_ar: 'البنك السعودي الفرنسي', name_en: 'Banque Saudi Fransi' },
  { code: 'ARNB', name_ar: 'البنك العربي الوطني', name_en: 'Arab National Bank' },
  { code: 'SAIB', name_ar: 'بنك الجزيرة', name_en: 'Bank Aljazira' },
  { code: 'BJAZ', name_ar: 'بنك البلاد', name_en: 'Bank Albilad' },
  { code: 'GULB', name_ar: 'بنك الخليج الدولي', name_en: 'Gulf International Bank' },
];
