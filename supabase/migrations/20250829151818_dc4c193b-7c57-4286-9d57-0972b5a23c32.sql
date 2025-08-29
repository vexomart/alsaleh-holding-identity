-- إنشاء function لضمان وجود محفظة للمستخدم
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- إنشاء function لإنشاء محفظة عند تسجيل مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO public.customer_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  -- إرسال إيميل ترحيب (اختياري)
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'wallet_creation',
    NEW.id,
    'auto_wallet_created',
    'low',
    jsonb_build_object(
      'description', 'Auto-created wallet for new user',
      'user_email', NEW.email,
      'timestamp', now()
    )
  );
  
  RETURN NEW;
END;
$$;

-- إنشاء trigger يتم تشغيله عند تسجيل مستخدم جديد
DROP TRIGGER IF EXISTS on_auth_user_create_wallet ON auth.users;
CREATE TRIGGER on_auth_user_create_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_wallet();