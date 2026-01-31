/**
 * Financial System Types - PHASE FIN-0
 * Bank-grade double-entry ledger types
 */

// =====================================================
// LEDGER ACCOUNTS
// =====================================================

export type LedgerAccountType = 'asset' | 'liability' | 'revenue' | 'expense' | 'equity';

export interface LedgerAccount {
  id: string;
  tenant_id: string | null;
  code: string;
  name_ar: string;
  name_en: string;
  account_type: LedgerAccountType;
  parent_id: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// =====================================================
// JOURNAL ENTRIES
// =====================================================

export interface JournalEntry {
  id: string;
  tenant_id: string | null;
  entry_number: string;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  description_ar: string | null;
  posted_at: string | null;
  is_posted: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  lines?: JournalLine[];
}

export interface JournalLine {
  id: string;
  entry_id: string;
  account_id: string;
  debit: number;
  credit: number;
  currency: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  account?: LedgerAccount;
}

export interface CreateJournalEntryRequest {
  tenant_id?: string;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  description_ar?: string;
  lines: {
    account_id: string;
    debit: number;
    credit: number;
    description?: string;
    metadata?: Record<string, unknown>;
  }[];
}

// =====================================================
// CUSTOMER WALLETS
// =====================================================

export type WalletStatus = 'active' | 'frozen' | 'closed';

export interface CustomerWallet {
  id: string;
  tenant_id: string | null;
  customer_user_id: string;
  wallet_number: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  ledger_account_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WalletBalanceResponse {
  wallet_id: string;
  wallet_number: string;
  balance: number;
  currency: string;
  status: WalletStatus;
}

// =====================================================
// FINANCIAL TRANSACTIONS
// =====================================================

export type FinancialTransactionType = 
  | 'invoice_payment' 
  | 'refund' 
  | 'topup' 
  | 'withdrawal' 
  | 'adjustment' 
  | 'transfer' 
  | 'fee';

export type FinancialTransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'succeeded' 
  | 'failed' 
  | 'refunded' 
  | 'cancelled';

export interface FinancialTransaction {
  id: string;
  tenant_id: string | null;
  customer_user_id: string;
  wallet_id: string | null;
  transaction_type: FinancialTransactionType;
  amount: number;
  currency: string;
  status: FinancialTransactionStatus;
  provider: string | null;
  provider_reference: string | null;
  provider_response: Record<string, unknown> | null;
  idempotency_key: string | null;
  related_invoice_id: string | null;
  related_order_id: string | null;
  journal_entry_id: string | null;
  description: string | null;
  description_ar: string | null;
  metadata: Record<string, unknown>;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  wallet?: CustomerWallet;
  journal_entry?: JournalEntry;
}

export interface CreateTransactionRequest {
  tenant_id?: string;
  customer_user_id: string;
  wallet_id?: string;
  transaction_type: FinancialTransactionType;
  amount: number;
  currency?: string;
  provider?: string;
  provider_reference?: string;
  idempotency_key?: string;
  related_invoice_id?: string;
  related_order_id?: string;
  description?: string;
  description_ar?: string;
  metadata?: Record<string, unknown>;
}

export interface TransactionListParams {
  customer_user_id?: string;
  wallet_id?: string;
  transaction_type?: FinancialTransactionType;
  status?: FinancialTransactionStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

// =====================================================
// CUSTOMER PROFILE (Extended)
// =====================================================

export interface CustomerProfile {
  id: string;
  customer_uid: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  tenant_id: string | null;
  created_at: string;
  updated_at: string;
  wallet?: CustomerWallet;
}

// =====================================================
// API RESPONSES
// =====================================================

export interface FinancialSummary {
  wallet_balance: number;
  total_transactions: number;
  pending_transactions: number;
  total_spent: number;
  total_topped_up: number;
  currency: string;
}

export interface LedgerSummary {
  total_assets: number;
  total_liabilities: number;
  total_revenue: number;
  total_expenses: number;
  net_income: number;
  currency: string;
}
