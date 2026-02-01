-- Create wallet payment function for invoices (PHASE WALLET-1)
-- This function handles paying an invoice from wallet balance with proper double-entry accounting

CREATE OR REPLACE FUNCTION public.pay_invoice_from_wallet(
  p_invoice_id uuid,
  p_customer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_invoice invoices%ROWTYPE;
  v_wallet customer_wallets%ROWTYPE;
  v_transaction_id uuid;
  v_journal_entry_id uuid;
  v_entry_number text;
  v_cash_account_id uuid;
  v_wallet_liability_id uuid;
  v_revenue_account_id uuid;
  v_vat_account_id uuid;
BEGIN
  -- Get invoice
  SELECT * INTO v_invoice FROM invoices WHERE id = p_invoice_id;
  
  IF v_invoice IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invoice not found', 'error_ar', 'الفاتورة غير موجودة');
  END IF;
  
  -- Verify customer owns the invoice
  IF v_invoice.customer_id != p_customer_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized', 'error_ar', 'غير مصرح');
  END IF;
  
  -- Check invoice status
  IF v_invoice.status = 'paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invoice already paid', 'error_ar', 'الفاتورة مدفوعة مسبقاً');
  END IF;
  
  IF v_invoice.status = 'cancelled' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invoice is cancelled', 'error_ar', 'الفاتورة ملغاة');
  END IF;
  
  -- Get customer wallet
  SELECT * INTO v_wallet FROM customer_wallets WHERE customer_user_id = p_customer_id;
  
  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found', 'error_ar', 'المحفظة غير موجودة');
  END IF;
  
  -- Check sufficient balance
  IF v_wallet.balance < v_invoice.total THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Insufficient balance', 
      'error_ar', 'رصيد غير كافٍ',
      'required', v_invoice.total,
      'available', v_wallet.balance
    );
  END IF;
  
  -- Get ledger accounts for double-entry
  SELECT id INTO v_cash_account_id FROM ledger_accounts WHERE code = '1000' LIMIT 1;
  SELECT id INTO v_wallet_liability_id FROM ledger_accounts WHERE code = '1100' LIMIT 1;
  SELECT id INTO v_revenue_account_id FROM ledger_accounts WHERE code = '4000' LIMIT 1;
  SELECT id INTO v_vat_account_id FROM ledger_accounts WHERE code = '2100' LIMIT 1;
  
  -- Generate journal entry number
  v_entry_number := generate_journal_entry_number(v_invoice.tenant_id);
  
  -- Create journal entry
  INSERT INTO journal_entries (
    entry_number,
    tenant_id,
    reference_type,
    reference_id,
    description,
    description_ar,
    is_posted,
    posted_at
  ) VALUES (
    v_entry_number,
    v_invoice.tenant_id,
    'invoice_payment',
    v_invoice.id,
    'Wallet payment for invoice ' || v_invoice.invoice_number,
    'دفع من المحفظة للفاتورة ' || v_invoice.invoice_number,
    true,
    now()
  ) RETURNING id INTO v_journal_entry_id;
  
  -- Create journal lines (double-entry)
  -- 1. Debit Customer Wallet Liability (reduce liability) - total amount
  IF v_wallet_liability_id IS NOT NULL THEN
    INSERT INTO journal_lines (entry_id, account_id, debit, credit, currency, description)
    VALUES (v_journal_entry_id, v_wallet_liability_id, v_invoice.total, 0, v_invoice.currency, 'Wallet payment');
  END IF;
  
  -- 2. Credit Service Revenue - subtotal
  IF v_revenue_account_id IS NOT NULL THEN
    INSERT INTO journal_lines (entry_id, account_id, debit, credit, currency, description)
    VALUES (v_journal_entry_id, v_revenue_account_id, 0, v_invoice.subtotal, v_invoice.currency, 'Service revenue');
  END IF;
  
  -- 3. Credit VAT Payable - VAT amount
  IF v_vat_account_id IS NOT NULL AND v_invoice.vat_amount > 0 THEN
    INSERT INTO journal_lines (entry_id, account_id, debit, credit, currency, description)
    VALUES (v_journal_entry_id, v_vat_account_id, 0, v_invoice.vat_amount, v_invoice.currency, 'VAT collected');
  END IF;
  
  -- Create financial transaction
  INSERT INTO financial_transactions (
    customer_user_id,
    wallet_id,
    transaction_type,
    amount,
    currency,
    status,
    provider,
    provider_reference,
    related_invoice_id,
    related_order_id,
    journal_entry_id,
    description,
    description_ar,
    processed_at
  ) VALUES (
    p_customer_id,
    v_wallet.id,
    'invoice_payment',
    v_invoice.total,
    v_invoice.currency,
    'succeeded',
    'wallet',
    'WALLET-' || v_invoice.invoice_number,
    v_invoice.id,
    v_invoice.order_id,
    v_journal_entry_id,
    'Wallet payment for invoice ' || v_invoice.invoice_number,
    'دفع من المحفظة للفاتورة ' || v_invoice.invoice_number,
    now()
  ) RETURNING id INTO v_transaction_id;
  
  -- Deduct from wallet balance
  UPDATE customer_wallets 
  SET balance = balance - v_invoice.total, 
      updated_at = now()
  WHERE id = v_wallet.id;
  
  -- Update invoice status to paid
  UPDATE invoices 
  SET status = 'paid', 
      paid_at = now(),
      updated_at = now()
  WHERE id = p_invoice_id;
  
  -- Update order status if exists
  IF v_invoice.order_id IS NOT NULL THEN
    UPDATE orders 
    SET status = 'processing',
        updated_at = now()
    WHERE id = v_invoice.order_id AND status = 'pending';
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id,
    'new_balance', v_wallet.balance - v_invoice.total,
    'invoice_number', v_invoice.invoice_number,
    'amount_paid', v_invoice.total
  );
END;
$$;