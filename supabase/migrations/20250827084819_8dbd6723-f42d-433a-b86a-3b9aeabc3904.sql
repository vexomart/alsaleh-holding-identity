-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.customer_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
  p_user_id UUID,
  p_transaction_type TEXT,
  p_amount NUMERIC,
  p_description TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT NULL,
  p_payment_reference TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Get wallet and current balance
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM public.customer_wallets
  WHERE user_id = p_user_id;

  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user';
  END IF;

  -- Calculate new balance
  IF p_transaction_type IN ('deposit', 'refund') THEN
    v_new_balance := v_current_balance + p_amount;
  ELSIF p_transaction_type IN ('withdrawal', 'payment') THEN
    v_new_balance := v_current_balance - p_amount;
    IF v_new_balance < 0 THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;

  -- Create transaction record
  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, transaction_type, amount,
    balance_before, balance_after, description,
    payment_method, payment_reference, status
  )
  VALUES (
    v_wallet_id, p_user_id, p_transaction_type, p_amount,
    v_current_balance, v_new_balance, p_description,
    p_payment_method, p_payment_reference, 'completed'
  )
  RETURNING id INTO v_transaction_id;

  -- Update wallet balance
  UPDATE public.customer_wallets
  SET balance = v_new_balance, updated_at = now()
  WHERE id = v_wallet_id;

  RETURN v_transaction_id;
END;
$$;