-- تحسين دالة إنشاء المحفظة للتعامل مع المستخدمين بدون auth.users
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_wallet_id uuid;
BEGIN
  -- البحث عن المحفظة الموجودة
  SELECT id INTO v_wallet_id
  FROM public.customer_wallets
  WHERE user_id = p_user_id;
  
  -- إذا لم توجد المحفظة، إنشاؤها
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.customer_wallets (user_id, balance, currency)
    VALUES (p_user_id, 0.00, 'SAR')
    RETURNING id INTO v_wallet_id;
    
    -- تسجيل الحدث
    INSERT INTO public.security_audit_logs (
      event_type,
      action,
      user_id,
      risk_level,
      metadata
    ) VALUES (
      'wallet_creation',
      'auto_wallet_creation',
      p_user_id,
      'low',
      jsonb_build_object(
        'wallet_id', v_wallet_id,
        'created_by_function', 'ensure_user_wallet',
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN v_wallet_id;
END;
$$;

-- تحسين دالة معالجة المعاملات المالية
CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
  p_user_id uuid, 
  p_transaction_type text, 
  p_amount numeric, 
  p_description text, 
  p_reference_id text DEFAULT NULL, 
  p_metadata jsonb DEFAULT '{}'
)
RETURNS TABLE(transaction_id uuid, new_balance numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_transaction_id UUID;
  v_wallet_id UUID;
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
  
  -- ضمان وجود محفظة للمستخدم
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
    v_balance_after := v_balance_before - p_amount;
  ELSE
    -- للإيداعات والاستردادات، إضافة المبلغ
    v_balance_after := v_balance_before + p_amount;
  END IF;
  
  -- تحديث الرصيد
  UPDATE public.customer_wallets
  SET balance = v_balance_after,
      updated_at = now()
  WHERE id = v_wallet_id;
  
  -- إدراج سجل المعاملة
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