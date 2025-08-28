-- إصلاح مشكلة القيود الخارجية لجدول customer_wallets
-- إزالة القيود الموجودة وإنشاء قيود جديدة صحيحة

-- أولاً: إزالة أي قيود خارجية موجودة على user_id في customer_wallets
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- البحث عن القيود الخارجية الموجودة
    FOR constraint_name IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'customer_wallets' 
        AND tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.customer_wallets DROP CONSTRAINT IF EXISTS ' || constraint_name;
    END LOOP;
END $$;

-- إنشاء قيد خارجي جديد يشير إلى auth.users
-- مع CASCADE للحذف التلقائي عند حذف المستخدم
ALTER TABLE public.customer_wallets 
ADD CONSTRAINT customer_wallets_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- إنشاء فهرس فريد على user_id لضمان وجود محفظة واحدة فقط لكل مستخدم
CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_wallets_user_id_unique 
ON public.customer_wallets(user_id);

-- تحسين function ensure_user_wallet لتعامل مع الأخطاء بشكل أفضل
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  v_wallet_id uuid;
  v_user_exists boolean;
BEGIN
  -- التحقق من وجود المستخدم في auth.users أولاً
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE id = p_user_id) INTO v_user_exists;
  
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'User with ID % does not exist', p_user_id;
  END IF;
  
  -- البحث عن محفظة موجودة
  SELECT id INTO v_wallet_id
  FROM public.customer_wallets
  WHERE user_id = p_user_id;
  
  -- إنشاء محفظة جديدة إذا لم توجد
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.customer_wallets (user_id, balance, currency)
    VALUES (p_user_id, 0.00, 'SAR')
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id INTO v_wallet_id;
    
    -- إذا لم يتم إدراج شيء بسبب CONFLICT، جلب المحفظة الموجودة
    IF v_wallet_id IS NULL THEN
      SELECT id INTO v_wallet_id
      FROM public.customer_wallets
      WHERE user_id = p_user_id;
    END IF;
  END IF;
  
  RETURN v_wallet_id;
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Cannot create wallet: User % does not exist in auth.users', p_user_id;
  WHEN unique_violation THEN
    -- في حالة وجود محفظة بالفعل، جلبها
    SELECT id INTO v_wallet_id
    FROM public.customer_wallets
    WHERE user_id = p_user_id;
    RETURN v_wallet_id;
END;
$$;