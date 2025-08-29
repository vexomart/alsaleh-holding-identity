-- تحديث trigger إنشاء المحفظة لإرسال إيميل ترحيبي
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
  
  -- إرسال إيميل ترحيبي باستخدام edge function
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object(
        'user_email', NEW.email,
        'user_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user_id', NEW.id::text
      )
    );
  
  -- تسجيل الحدث في سجل الأمان
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'wallet_creation',
    NEW.id,
    'auto_wallet_created_with_welcome_email',
    'low',
    jsonb_build_object(
      'description', 'Auto-created wallet for new user with welcome email',
      'user_email', NEW.email,
      'timestamp', now()
    )
  );
  
  RETURN NEW;
END;
$$;