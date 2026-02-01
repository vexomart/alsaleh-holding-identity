/**
 * Payment Provider Types - PHASE WALLET-1
 * Provider-agnostic payment interface definitions
 */

// =====================================================
// PAYMENT METHODS
// =====================================================

export type PaymentMethodType = 
  | 'card'          // Generic card (Visa/Mastercard)
  | 'mada'          // Saudi debit cards
  | 'stcpay'        // STC Pay
  | 'apple_pay'     // Apple Pay
  | 'bank_transfer' // Manual bank transfer
  | 'wallet';       // Internal wallet balance

export interface PaymentMethod {
  type: PaymentMethodType;
  label: string;
  label_ar: string;
  icon?: string;
  is_enabled: boolean;
  is_instant: boolean;  // True for card/mada, false for bank_transfer
  requires_review: boolean;  // True for bank_transfer
  supported_currencies: string[];
  min_amount?: number;
  max_amount?: number;
}

// =====================================================
// PAYMENT SESSION
// =====================================================

export interface CreatePaymentSessionParams {
  amount: number;
  currency: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
  invoice_id?: string;
  order_id?: string;
  payment_method?: PaymentMethodType;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentSessionResult {
  success: boolean;
  payment_url?: string;
  provider_ref?: string;
  transaction_no?: string;
  error?: string;
  expires_at?: string;
}

// =====================================================
// PAYMENT VERIFICATION
// =====================================================

export type PaymentVerificationStatus = 
  | 'pending' 
  | 'succeeded' 
  | 'failed' 
  | 'cancelled'
  | 'expired';

export interface VerifyPaymentParams {
  provider_ref?: string;
  invoice_id?: string;
  transaction_id?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  status: PaymentVerificationStatus;
  paid_at?: string;
  amount?: number;
  currency?: string;
  provider_status?: string;
  raw?: Record<string, unknown>;
  error?: string;
}

// =====================================================
// PAYMENT PROVIDER INTERFACE
// =====================================================

export interface PaymentProvider {
  name: string;
  display_name: string;
  display_name_ar: string;
  
  // Supported payment methods
  supported_methods: PaymentMethodType[];
  
  // Create a payment session
  createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>;
  
  // Verify payment status
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  
  // Check if provider is configured
  isConfigured(): Promise<boolean>;
}

// =====================================================
// PROVIDER REGISTRY
// =====================================================

export interface ProviderRegistry {
  providers: Map<string, PaymentProvider>;
  defaultProvider: string;
  
  getProvider(name: string): PaymentProvider | undefined;
  getDefaultProvider(): PaymentProvider | undefined;
  registerProvider(provider: PaymentProvider): void;
}

// =====================================================
// BANK TRANSFER SPECIFIC
// =====================================================

export interface BankTransferRequest {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  bank_name: string;
  iban: string;
  account_holder_name?: string;
  reference_code: string;
  receipt_media_url?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewer_user_id?: string;
  reviewer_notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBankTransferParams {
  amount: number;
  currency?: string;
  bank_name: string;
  iban: string;
  account_holder_name?: string;
  receipt_media_url?: string;
}

// =====================================================
// REALTIME EVENTS
// =====================================================

export type WalletEventType =
  | 'wallet.created'
  | 'wallet.updated'
  | 'wallet.balance_changed';

export type TransactionEventType =
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.succeeded'
  | 'transaction.failed';

export type BankTransferEventType =
  | 'bank_transfer.submitted'
  | 'bank_transfer.under_review'
  | 'bank_transfer.approved'
  | 'bank_transfer.rejected';

export interface WalletEventPayload {
  event: WalletEventType;
  wallet_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  balance?: number;
  previous_balance?: number;
}

export interface TransactionEventPayload {
  event: TransactionEventType;
  transaction_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  amount?: number;
  status?: string;
  previous_status?: string;
}

export interface BankTransferEventPayload {
  event: BankTransferEventType;
  transfer_id: string;
  user_id: string;
  tenant_id?: string;
  timestamp: string;
  amount?: number;
  status?: string;
}
