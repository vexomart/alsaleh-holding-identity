/**
 * Receipt Voucher Types
 * أنواع سند القبض
 */

export interface ReceiptParty {
  name: string;
  identityType?: 'national_id' | 'commercial_registration' | 'iqama';
  identityNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ReceiptFinancials {
  amount: number;
  currency: 'SAR';
  amountInWords?: string;
  purpose: string;
  contractNumber?: string;
  installmentNumber?: number;
}

export interface ReceiptSignature {
  signerName: string;
  signerTitle?: string;
  isSigned: boolean;
  signedAt: string | null;
  stampId?: string;
}

export interface ReceiptVoucherData {
  voucherNumber: string;
  issueDate: string;
  
  // Parties
  receiver: ReceiptParty; // الشركة - المستلم
  payer: ReceiptParty;    // العميل - الدافع
  
  // Financial details
  financials: ReceiptFinancials;
  
  // Signatures
  receiverSignature: ReceiptSignature;
  
  // Metadata
  paymentMethod?: 'wallet' | 'bank_transfer' | 'mada' | 'visa' | 'cash';
  transactionReference?: string;
  notes?: string;
}

export interface ReceiptRenderOptions {
  showAnimations?: boolean;
  printMode?: boolean;
  language?: 'ar' | 'en';
}
