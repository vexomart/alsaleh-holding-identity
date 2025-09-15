-- 1) Ensure pg_net extension exists to provide net.http_post
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2) Ensure the default site exists (id + domain)
INSERT INTO public.sites (id, slug, domain)
VALUES ('11111111-1111-1111-1111-111111111111', 'holding', 'alialshehriholding.com')
ON CONFLICT (domain) DO NOTHING;

-- 3) Patch handle_new_user_wallet to avoid failing when pg_net/net schema is missing
CREATE OR REPLACE FUNCTION public.handle_new_user_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- إنشاء محفظة للمستخدم الجديد
  INSERT INTO public.customer_wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'SAR');
  
  -- محاولة إرسال إيميل ترحيبي إن توفّر pg_net، ولا نسمح بفشل العملية حتى لو حدث خطأ
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    BEGIN
      PERFORM
        net.http_post(
          url := current_setting('app.supabase_url', true) || '/functions/v1/welcome-email',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
          ),
          body := jsonb_build_object(
            'user_email', NEW.email,
            'user_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            'user_id', NEW.id::text
          )
        );
    EXCEPTION WHEN OTHERS THEN
      -- تجاهل أي أخطاء هنا حتى لا تتعطل عملية التسجيل
      NULL;
    END;
  END IF;
  
  -- تسجيل الحدث (نبقيه كما هو)
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
$function$;