/**
 * Financial API Services - PHASE FIN-0
 * API layer for wallets, transactions, and ledger operations
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  LedgerAccount,
  JournalEntry,
  JournalLine,
  CreateJournalEntryRequest,
  CustomerWallet,
  FinancialTransaction,
  CreateTransactionRequest,
  TransactionListParams,
  CustomerProfile,
  FinancialSummary,
  WalletBalanceResponse,
} from '@/types/financial';

// =====================================================
// WALLET OPERATIONS
// =====================================================

/**
 * Get or create wallet for a customer
 */
export async function getOrCreateWallet(
  customerId: string,
  tenantId?: string
): Promise<{ data: CustomerWallet | null; error: Error | null }> {
  try {
    // First try to get existing wallet
    const { data: existing, error: fetchError } = await supabase
      .from('customer_wallets' as never)
      .select('*')
      .eq('customer_user_id', customerId)
      .single();

    if (existing && !fetchError) {
      return { data: existing as CustomerWallet, error: null };
    }

    // Create new wallet if not exists
    const { data: newWallet, error: createError } = await supabase
      .from('customer_wallets' as never)
      .insert({
        customer_user_id: customerId,
        tenant_id: tenantId || null,
        balance: 0,
        currency: 'SAR',
        status: 'active',
      } as never)
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return { data: newWallet as CustomerWallet, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(
  walletId: string
): Promise<{ data: WalletBalanceResponse | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('customer_wallets' as never)
      .select('id, wallet_number, balance, currency, status')
      .eq('id', walletId)
      .single();

    if (error || !data) throw error || new Error('Wallet not found');

    const walletData = data as Record<string, unknown>;
    return {
      data: {
        wallet_id: walletData.id as string,
        wallet_number: walletData.wallet_number as string,
        balance: Number(walletData.balance),
        currency: walletData.currency as string,
        status: walletData.status as string,
      } as WalletBalanceResponse,
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get wallet by customer ID
 */
export async function getWalletByCustomerId(
  customerId: string
): Promise<{ data: CustomerWallet | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('customer_wallets' as never)
      .select('*')
      .eq('customer_user_id', customerId)
      .single();

    if (error) throw error;

    return { data: data as CustomerWallet, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * List all wallets (admin)
 */
export async function listWallets(
  tenantId?: string,
  status?: string
): Promise<{ data: CustomerWallet[]; error: Error | null }> {
  try {
    let query = supabase.from('customer_wallets' as never).select('*');

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return { data: (data || []) as CustomerWallet[], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

// =====================================================
// TRANSACTION OPERATIONS
// =====================================================

/**
 * Create a new financial transaction
 */
export async function createTransaction(
  request: CreateTransactionRequest
): Promise<{ data: FinancialTransaction | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions' as never)
      .insert({
        ...request,
        status: 'pending',
      } as never)
      .select()
      .single();

    if (error) throw error;

    return { data: data as FinancialTransaction, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Get transaction by ID
 */
export async function getTransaction(
  transactionId: string
): Promise<{ data: FinancialTransaction | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions' as never)
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;

    return { data: data as FinancialTransaction, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * List transactions with filters
 */
export async function listTransactions(
  params: TransactionListParams = {}
): Promise<{ data: FinancialTransaction[]; total: number; error: Error | null }> {
  try {
    const { page = 1, limit = 20, ...filters } = params;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('financial_transactions' as never)
      .select('*', { count: 'exact' });

    if (filters.customer_user_id) {
      query = query.eq('customer_user_id', filters.customer_user_id);
    }
    if (filters.wallet_id) {
      query = query.eq('wallet_id', filters.wallet_id);
    }
    if (filters.transaction_type) {
      query = query.eq('transaction_type', filters.transaction_type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.from_date) {
      query = query.gte('created_at', filters.from_date);
    }
    if (filters.to_date) {
      query = query.lte('created_at', filters.to_date);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: (data || []) as FinancialTransaction[],
      total: count || 0,
      error: null,
    };
  } catch (error) {
    return { data: [], total: 0, error: error as Error };
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: string,
  providerResponse?: Record<string, unknown>
): Promise<{ data: FinancialTransaction | null; error: Error | null }> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'succeeded') {
      updateData.processed_at = new Date().toISOString();
    }
    if (providerResponse) {
      updateData.provider_response = providerResponse;
    }

    const { data, error } = await supabase
      .from('financial_transactions' as never)
      .update(updateData as never)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as FinancialTransaction, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// =====================================================
// LEDGER OPERATIONS
// =====================================================

/**
 * Get all ledger accounts
 */
export async function getLedgerAccounts(
  tenantId?: string
): Promise<{ data: LedgerAccount[]; error: Error | null }> {
  try {
    let query = supabase
      .from('ledger_accounts' as never)
      .select('*')
      .eq('is_active', true);

    if (tenantId) {
      query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
    }

    const { data, error } = await query.order('code');

    if (error) throw error;

    return { data: (data || []) as LedgerAccount[], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

/**
 * Create journal entry with lines
 */
export async function createJournalEntry(
  request: CreateJournalEntryRequest
): Promise<{ data: JournalEntry | null; error: Error | null }> {
  try {
    // Validate debit = credit
    const totalDebit = request.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = request.lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (totalDebit !== totalCredit) {
      throw new Error(`Journal entry is unbalanced: debit (${totalDebit}) != credit (${totalCredit})`);
    }

    // Generate entry number
    const { data: entryNumber } = await supabase.rpc('generate_journal_entry_number' as never, {
      p_tenant_id: request.tenant_id || null,
    } as never);

    // Create entry
    const { data: entry, error: entryError } = await supabase
      .from('journal_entries' as never)
      .insert({
        tenant_id: request.tenant_id || null,
        entry_number: entryNumber,
        reference_type: request.reference_type,
        reference_id: request.reference_id,
        description: request.description,
        description_ar: request.description_ar,
        is_posted: false,
      } as never)
      .select()
      .single();

    if (entryError || !entry) throw entryError || new Error('Failed to create journal entry');

    const entryData = entry as Record<string, unknown>;
    
    // Create lines
    const linesToInsert = request.lines.map((line) => ({
      entry_id: entryData.id,
      account_id: line.account_id,
      debit: line.debit || 0,
      credit: line.credit || 0,
      currency: 'SAR',
      description: line.description,
      metadata: line.metadata || {},
    }));

    const { error: linesError } = await supabase
      .from('journal_lines' as never)
      .insert(linesToInsert as never);

    if (linesError) throw linesError;

    return { data: entry as JournalEntry, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Post journal entry (validate and mark as posted)
 */
export async function postJournalEntry(
  entryId: string
): Promise<{ data: JournalEntry | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('journal_entries' as never)
      .update({
        is_posted: true,
        posted_at: new Date().toISOString(),
      } as never)
      .eq('id', entryId)
      .select()
      .single();

    if (error) throw error;

    return { data: data as JournalEntry, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// =====================================================
// CUSTOMER PROFILE OPERATIONS
// =====================================================

/**
 * Get customer profile with UID
 */
export async function getCustomerProfile(
  userId: string
): Promise<{ data: CustomerProfile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return { data: data as CustomerProfile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Search customers by UID (admin)
 */
export async function searchCustomersByUid(
  searchTerm: string,
  tenantId?: string
): Promise<{ data: CustomerProfile[]; error: Error | null }> {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .ilike('customer_uid', `%${searchTerm}%`);

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.limit(20);

    if (error) throw error;

    return { data: (data || []) as CustomerProfile[], error: null };
  } catch (error) {
    return { data: [], error: error as Error };
  }
}

// =====================================================
// SUMMARY & REPORTING
// =====================================================

/**
 * Get financial summary for a customer
 */
export async function getCustomerFinancialSummary(
  customerId: string
): Promise<{ data: FinancialSummary | null; error: Error | null }> {
  try {
    // Get wallet
    const { data: wallet } = await getWalletByCustomerId(customerId);

    // Get transactions summary
    const { data: transactions } = await listTransactions({
      customer_user_id: customerId,
      limit: 1000,
    });

    const summary: FinancialSummary = {
      wallet_balance: wallet?.balance || 0,
      total_transactions: transactions.length,
      pending_transactions: transactions.filter((t) => t.status === 'pending').length,
      total_spent: transactions
        .filter((t) => t.transaction_type === 'invoice_payment' && t.status === 'succeeded')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      total_topped_up: transactions
        .filter((t) => t.transaction_type === 'topup' && t.status === 'succeeded')
        .reduce((sum, t) => sum + Number(t.amount), 0),
      currency: 'SAR',
    };

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
