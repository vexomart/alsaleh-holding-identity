/**
 * Disbursement Voucher Types
 * أنواع سند الصرف
 */

export interface DisbursementParty {
  name: string;
  identityType: 'national_id' | 'commercial_registration' | 'iqama';
  identityNumber: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface DisbursementFinancials {
  amount: number;
  currency: 'SAR';
  amountInWords?: string;
  purpose: string;
  contractNumber: string;
  applicationNumber: string;
}

export interface DisbursementSignature {
  signerName: string;
  signerTitle?: string;
  isSigned: boolean;
  signedAt: string | null;
  stampId?: string;
}

export interface DisbursementVoucherData {
  voucherNumber: string;
  issueDate: string;
  
  // Parties
  payer: DisbursementParty; // الشركة - الطرف الدافع
  payee: DisbursementParty; // العميل - المستفيد
  
  // Financial details
  financials: DisbursementFinancials;
  
  // Signatures
  payerSignature: DisbursementSignature;
  payeeSignature?: DisbursementSignature;
  
  // Metadata
  walletNumber?: string;
  transactionReference?: string;
  notes?: string;
}

export interface VoucherRenderOptions {
  showAnimations?: boolean;
  printMode?: boolean;
  language?: 'ar' | 'en';
}
