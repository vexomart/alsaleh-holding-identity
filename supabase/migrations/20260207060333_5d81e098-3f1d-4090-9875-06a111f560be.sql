-- Fix the finance application created SMS trigger to include amount
CREATE OR REPLACE FUNCTION public.notify_finance_app_created_sms()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_phone TEXT;
  customer_name TEXT;
  request_id BIGINT;
BEGIN
  -- Get customer phone and name from entity owner's profile
  SELECT p.phone, p.full_name INTO customer_phone, customer_name
  FROM public.entities e
  JOIN public.profiles p ON p.id = e.owner_user_id
  WHERE e.id = NEW.entity_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RAISE WARNING 'Finance app SMS skipped: no phone for entity %', NEW.entity_id;
    RETURN NEW;
  END IF;

  -- Send SMS notification via edge function
  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', 'finance_submitted',
      'template_data', jsonb_build_object(
        'application_number', NEW.application_number,
        'amount', COALESCE(NEW.amount_sar::text, '0'),
        'name', COALESCE(customer_name, 'عميلنا العزيز')
      )
    )::text
  ) INTO request_id;

  RAISE NOTICE 'Finance app SMS queued for %: request_id=%', customer_phone, request_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance app created SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Fix the finance application status change SMS trigger
CREATE OR REPLACE FUNCTION public.notify_finance_app_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_phone TEXT;
  customer_name TEXT;
  message_type TEXT;
  template_data JSONB;
  request_id BIGINT;
  offer_count INT;
BEGIN
  -- Only process if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get customer phone and name from entity owner's profile
  SELECT p.phone, p.full_name INTO customer_phone, customer_name
  FROM public.entities e
  JOIN public.profiles p ON p.id = e.owner_user_id
  WHERE e.id = NEW.entity_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RAISE WARNING 'Finance status SMS skipped: no phone for entity %', NEW.entity_id;
    RETURN NEW;
  END IF;

  -- Map status to message type
  CASE NEW.status
    WHEN 'under_review' THEN
      message_type := 'finance_under_review';
      template_data := jsonb_build_object('application_number', NEW.application_number);
    
    WHEN 'scoring' THEN
      message_type := 'finance_scoring_started';
      template_data := jsonb_build_object('application_number', NEW.application_number);
    
    WHEN 'offer_ready' THEN
      -- Count available offers
      SELECT COUNT(*) INTO offer_count
      FROM finance_offers
      WHERE application_id = NEW.id AND offer_status = 'pending';
      
      message_type := 'finance_offer_ready';
      template_data := jsonb_build_object(
        'application_number', NEW.application_number,
        'offers_count', COALESCE(offer_count::text, '1')
      );
    
    WHEN 'approved' THEN
      message_type := 'finance_approved';
      template_data := jsonb_build_object(
        'application_number', NEW.application_number,
        'amount', COALESCE(NEW.amount_sar::text, '0'),
        'monthly', '0' -- Will be updated when contract is created
      );
    
    WHEN 'rejected' THEN
      message_type := 'finance_rejected';
      template_data := jsonb_build_object(
        'application_number', NEW.application_number,
        'reason', COALESCE(NEW.decision_reason_ar, 'لم يتم استيفاء الشروط')
      );
    
    ELSE
      -- No SMS for other statuses
      RETURN NEW;
  END CASE;

  -- Send SMS notification via edge function
  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', template_data
    )::text
  ) INTO request_id;

  RAISE NOTICE 'Finance status SMS queued for %: status=%, request_id=%', customer_phone, NEW.status, request_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance status SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Also fix the finance contract status change to include all required fields
CREATE OR REPLACE FUNCTION public.notify_finance_contract_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  template_data JSONB;
  request_id BIGINT;
  app_amount NUMERIC;
  monthly_payment NUMERIC;
BEGIN
  -- Only process if status changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get customer phone via application -> entity -> profile chain
  SELECT p.phone, fa.amount_sar, fo.monthly_payment_sar 
  INTO customer_phone, app_amount, monthly_payment
  FROM public.finance_applications fa
  JOIN public.entities e ON e.id = fa.entity_id
  JOIN public.profiles p ON p.id = e.owner_user_id
  LEFT JOIN public.finance_offers fo ON fo.id = NEW.offer_id
  WHERE fa.id = NEW.application_id;

  IF customer_phone IS NULL OR customer_phone = '' THEN
    RAISE WARNING 'Finance contract SMS skipped: no phone for application %', NEW.application_id;
    RETURN NEW;
  END IF;

  -- Map status to message type
  CASE NEW.status
    WHEN 'pending_signature' THEN
      message_type := 'finance_contract_ready';
      template_data := jsonb_build_object(
        'contract_number', NEW.contract_number,
        'amount', COALESCE(app_amount::text, '0')
      );
    
    WHEN 'signed' THEN
      message_type := 'finance_contract_signed';
      template_data := jsonb_build_object('contract_number', NEW.contract_number);
    
    WHEN 'active' THEN
      message_type := 'finance_disbursed';
      template_data := jsonb_build_object(
        'amount', COALESCE(app_amount::text, '0'),
        'contract_number', NEW.contract_number
      );
    
    ELSE
      -- No SMS for other statuses
      RETURN NEW;
  END CASE;

  -- Send SMS notification via edge function
  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', template_data
    )::text
  ) INTO request_id;

  RAISE NOTICE 'Finance contract SMS queued for %: status=%, request_id=%', customer_phone, NEW.status, request_id;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Finance contract SMS failed: %', SQLERRM;
  RETURN NEW;
END;
$$;