-- إصلاح مشكلة الأمان في function الخاصة بإنشاء المحفظة
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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