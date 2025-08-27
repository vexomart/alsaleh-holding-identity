-- Create RPC function to process wallet transactions
CREATE OR REPLACE FUNCTION process_wallet_transaction(
  p_user_id UUID,
  p_transaction_type TEXT,
  p_amount NUMERIC,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(transaction_id UUID, new_balance NUMERIC) AS $$
DECLARE
  v_transaction_id UUID;
  v_wallet_balance NUMERIC;
BEGIN
  -- Validate inputs
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  IF p_transaction_type NOT IN ('deposit', 'withdrawal', 'payment', 'refund', 'transfer') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;
  
  -- For withdrawals, check if user has sufficient balance
  IF p_transaction_type IN ('withdrawal', 'payment') THEN
    SELECT balance INTO v_wallet_balance
    FROM public.customer_wallets
    WHERE user_id = p_user_id;
    
    IF v_wallet_balance IS NULL OR v_wallet_balance < p_amount THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    -- Make withdrawal amount negative
    p_amount := -p_amount;
  END IF;
  
  -- Insert transaction record
  INSERT INTO public.wallet_transactions (
    user_id,
    transaction_type,
    amount,
    description,
    reference_id,
    metadata,
    status
  ) VALUES (
    p_user_id,
    p_transaction_type,
    p_amount,
    p_description,
    p_reference_id,
    p_metadata,
    'completed'
  ) RETURNING id INTO v_transaction_id;
  
  -- Get updated balance
  SELECT balance INTO v_wallet_balance
  FROM public.customer_wallets
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_transaction_id, COALESCE(v_wallet_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;