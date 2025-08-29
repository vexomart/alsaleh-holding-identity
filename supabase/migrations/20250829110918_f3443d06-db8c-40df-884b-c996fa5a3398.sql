-- إنشاء أو تعديل وظيفة لضمان وجود محفظة للمستخدم
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_wallet_id uuid;
BEGIN
  -- البحث عن محفظة موجودة
  SELECT id INTO v_wallet_id
  FROM public.customer_wallets
  WHERE user_id = p_user_id;
  
  -- إنشاء محفظة جديدة إذا لم توجد
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.customer_wallets (user_id, balance, currency)
    VALUES (p_user_id, 0.00, 'SAR')
    RETURNING id INTO v_wallet_id;
  END IF;
  
  RETURN v_wallet_id;
END;
$$;

-- تحديث وظيفة معالجة المعاملات لتتضمن wallet_id
CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
  p_user_id uuid, 
  p_transaction_type text, 
  p_amount numeric, 
  p_description text, 
  p_reference_id text DEFAULT NULL::text, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE(transaction_id uuid, new_balance numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_transaction_id UUID;
  v_wallet_id UUID;
  v_wallet_balance NUMERIC;
  v_balance_before NUMERIC;
  v_balance_after NUMERIC;
BEGIN
  -- التحقق من صحة المدخلات
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;
  
  IF p_transaction_type NOT IN ('deposit', 'withdrawal', 'payment', 'refund', 'transfer') THEN
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;
  
  -- التأكد من وجود محفظة للمستخدم وإنشاؤها إذا لم توجد
  v_wallet_id := public.ensure_user_wallet(p_user_id);
  
  -- الحصول على الرصيد الحالي
  SELECT balance INTO v_balance_before
  FROM public.customer_wallets
  WHERE id = v_wallet_id;
  
  -- للسحوبات والمدفوعات، التحقق من كفاية الرصيد
  IF p_transaction_type IN ('withdrawal', 'payment') THEN
    IF v_balance_before < p_amount THEN
      RAISE EXCEPTION 'Insufficient balance';
    END IF;
    
    -- تحديث الرصيد (خصم)
    UPDATE public.customer_wallets
    SET balance = balance - p_amount,
        updated_at = now()
    WHERE id = v_wallet_id
    RETURNING balance INTO v_balance_after;
    
    v_balance_after := v_balance_before - p_amount;
  ELSE
    -- للإيداعات والاستردادات، إضافة المبلغ
    UPDATE public.customer_wallets
    SET balance = balance + p_amount,
        updated_at = now()
    WHERE id = v_wallet_id
    RETURNING balance INTO v_balance_after;
    
    v_balance_after := v_balance_before + p_amount;
  END IF;
  
  -- إدراج سجل المعاملة مع wallet_id
  INSERT INTO public.wallet_transactions (
    wallet_id,
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    reference_id,
    metadata,
    status
  ) VALUES (
    v_wallet_id,
    p_user_id,
    p_transaction_type,
    p_amount,
    v_balance_before,
    v_balance_after,
    p_description,
    p_reference_id,
    p_metadata,
    'completed'
  ) RETURNING id INTO v_transaction_id;
  
  RETURN QUERY SELECT v_transaction_id, v_balance_after;
END;
$$;