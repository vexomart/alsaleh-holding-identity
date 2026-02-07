-- =============================================
-- COMPREHENSIVE SMS NOTIFICATION TRIGGERS - PART 1
-- Define ALL functions FIRST
-- =============================================

-- 1. ORDER CREATED SMS FUNCTION
CREATE OR REPLACE FUNCTION public.notify_order_created_sms()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  request_id BIGINT;
BEGIN
  SELECT p.phone INTO customer_phone
  FROM public.profiles p
  WHERE p.id = NEW.customer_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', 'order_created',
      'template_data', jsonb_build_object('order_number', NEW.order_number)
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Order created SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. ORDER STATUS CHANGE FUNCTION
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  order_num TEXT;
  status_ar TEXT;
  request_id BIGINT;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  order_num := NEW.order_number;

  SELECT p.phone INTO customer_phone
  FROM public.profiles p
  WHERE p.id = NEW.customer_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  CASE NEW.status::text
    WHEN 'pending' THEN message_type := 'order_created'; status_ar := 'قيد الانتظار';
    WHEN 'confirmed' THEN message_type := 'order_confirmed'; status_ar := 'تم التأكيد';
    WHEN 'processing' THEN message_type := 'order_processing'; status_ar := 'قيد التنفيذ';
    WHEN 'completed' THEN message_type := 'order_completed'; status_ar := 'مكتمل';
    WHEN 'cancelled' THEN message_type := 'order_cancelled'; status_ar := 'ملغي';
    ELSE message_type := 'order_status'; status_ar := NEW.status::text;
  END CASE;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', jsonb_build_object(
        'order_number', order_num,
        'status', status_ar,
        'amount', COALESCE(to_char(NEW.total_amount, 'FM999,999,999'), '0')
      )
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Order SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. CONTRACT CREATED SMS FUNCTION
CREATE OR REPLACE FUNCTION public.notify_contract_created_sms()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  request_id BIGINT;
BEGIN
  SELECT p.phone INTO customer_phone
  FROM public.profiles p
  WHERE p.id = NEW.customer_user_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', 'contract_created',
      'template_data', jsonb_build_object('contract_number', NEW.contract_number)
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Contract created SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. CONTRACT STATUS CHANGE FUNCTION
CREATE OR REPLACE FUNCTION public.notify_contract_status_change()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  contract_num TEXT;
  request_id BIGINT;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  contract_num := NEW.contract_number;

  SELECT p.phone INTO customer_phone
  FROM public.profiles p
  WHERE p.id = NEW.customer_user_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  CASE NEW.status::text
    WHEN 'draft' THEN message_type := 'contract_created';
    WHEN 'pending_approval' THEN message_type := 'contract_pending_signature';
    WHEN 'approved' THEN message_type := 'contract_approved';
    WHEN 'rejected' THEN message_type := 'contract_rejected';
    WHEN 'signed' THEN message_type := 'contract_signed';
    WHEN 'active' THEN message_type := 'contract_active';
    WHEN 'expired' THEN message_type := 'contract_expired';
    ELSE message_type := 'contract_created';
  END CASE;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', jsonb_build_object(
        'contract_number', contract_num,
        'reason', COALESCE(NEW.admin_rejection_reason, '')
      )
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Contract SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. FINANCE APP CREATED SMS FUNCTION
CREATE OR REPLACE FUNCTION public.notify_finance_app_created_sms()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  request_id BIGINT;
BEGIN
  SELECT p.phone INTO customer_phone
  FROM public.entities e
  JOIN public.profiles p ON p.id = e.owner_user_id
  WHERE e.id = NEW.entity_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', 'finance_submitted',
      'template_data', jsonb_build_object('application_number', NEW.application_number)
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance app created SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. FINANCE APP STATUS CHANGE FUNCTION
CREATE OR REPLACE FUNCTION public.notify_finance_app_status_change()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  app_num TEXT;
  request_id BIGINT;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  app_num := NEW.application_number;

  SELECT p.phone INTO customer_phone
  FROM public.entities e
  JOIN public.profiles p ON p.id = e.owner_user_id
  WHERE e.id = NEW.entity_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  CASE NEW.status::text
    WHEN 'submitted' THEN message_type := 'finance_submitted';
    WHEN 'approved' THEN message_type := 'finance_approved';
    WHEN 'rejected' THEN message_type := 'finance_rejected';
    WHEN 'offer_ready' THEN message_type := 'finance_offer_ready';
    ELSE message_type := 'finance_submitted';
  END CASE;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', jsonb_build_object(
        'application_number', app_num,
        'amount', COALESCE(to_char(NEW.amount_sar, 'FM999,999,999'), '0'),
        'monthly', '0'
      )
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. FINANCE CONTRACT STATUS CHANGE FUNCTION
CREATE OR REPLACE FUNCTION public.notify_finance_contract_status_change()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  contract_num TEXT;
  request_id BIGINT;
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  contract_num := NEW.contract_number;

  SELECT p.phone INTO customer_phone
  FROM public.finance_applications fa
  JOIN public.entities e ON e.id = fa.entity_id
  JOIN public.profiles p ON p.id = e.owner_user_id
  WHERE fa.id = NEW.application_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  CASE NEW.status::text
    WHEN 'pending_signature' THEN message_type := 'finance_contract_ready';
    WHEN 'signed' THEN message_type := 'contract_signed';
    WHEN 'active' THEN message_type := 'finance_disbursed';
    ELSE message_type := 'finance_contract_ready';
  END CASE;

  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', jsonb_build_object('contract_number', contract_num, 'amount', '0')
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance contract SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================
-- NOW CREATE ALL TRIGGERS
-- =============================================

-- Orders triggers
DROP TRIGGER IF EXISTS order_status_sms_trigger ON public.orders;
CREATE TRIGGER order_status_sms_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_status_change();

DROP TRIGGER IF EXISTS order_created_sms_trigger ON public.orders;
CREATE TRIGGER order_created_sms_trigger
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_order_created_sms();

-- Contracts triggers
DROP TRIGGER IF EXISTS contract_status_sms_trigger ON public.contracts;
CREATE TRIGGER contract_status_sms_trigger
  AFTER UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contract_status_change();

DROP TRIGGER IF EXISTS contract_created_sms_trigger ON public.contracts;
CREATE TRIGGER contract_created_sms_trigger
  AFTER INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contract_created_sms();

-- Finance applications triggers
DROP TRIGGER IF EXISTS finance_app_status_sms_trigger ON public.finance_applications;
CREATE TRIGGER finance_app_status_sms_trigger
  AFTER UPDATE ON public.finance_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_finance_app_status_change();

DROP TRIGGER IF EXISTS finance_app_created_sms_trigger ON public.finance_applications;
CREATE TRIGGER finance_app_created_sms_trigger
  AFTER INSERT ON public.finance_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_finance_app_created_sms();

-- Finance contracts triggers
DROP TRIGGER IF EXISTS finance_contract_status_sms_trigger ON public.finance_contracts;
CREATE TRIGGER finance_contract_status_sms_trigger
  AFTER UPDATE ON public.finance_contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_finance_contract_status_change();