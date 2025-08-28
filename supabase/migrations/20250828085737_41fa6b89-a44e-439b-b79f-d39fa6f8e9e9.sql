-- إصلاح مشكلة wallet_transactions وإضافة آلية إنشاء محافظ تلقائياً

-- أولاً: تعديل جدول wallet_transactions ليجعل wallet_id اختياري مؤقتاً
ALTER TABLE public.wallet_transactions ALTER COLUMN wallet_id DROP NOT NULL;

-- إضافة فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_customer_wallets_user_id ON public.customer_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);

-- إنشاء أو تحديث function لإنشاء محفظة تلقائياً للمستخدم الجديد
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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

-- تحديث function معالجة معاملات المحفظة لتضمين wallet_id
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
SET search_path TO ''
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

-- إنشاء trigger لإنشاء محفظة تلقائياً عند إنشاء مستخدم جديد
CREATE OR REPLACE FUNCTION public.create_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO public.customer_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- في حالة وجود خطأ، لا نوقف إنشاء المستخدم
    RETURN NEW;
END;
$$;

-- إنشاء trigger على جدول auth.users (إذا لم يكن موجوداً)
DROP TRIGGER IF EXISTS on_auth_user_created_wallet ON auth.users;
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_wallet();

-- تحديث المعاملات الموجودة التي لا تحتوي على wallet_id
UPDATE public.wallet_transactions 
SET wallet_id = (
  SELECT cw.id 
  FROM public.customer_wallets cw 
  WHERE cw.user_id = wallet_transactions.user_id 
  LIMIT 1
)
WHERE wallet_id IS NULL;