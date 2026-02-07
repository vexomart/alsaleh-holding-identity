
-- Fix contract SMS trigger to handle correct status values
CREATE OR REPLACE FUNCTION public.notify_contract_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Updated to match actual contract status enum values
  CASE NEW.status::text
    WHEN 'draft' THEN message_type := 'contract_created';
    WHEN 'pre_approved_by_customer' THEN message_type := 'contract_pending_approval';
    WHEN 'pending_admin_approval' THEN message_type := 'contract_pending_approval';
    WHEN 'pending_signature' THEN message_type := 'contract_approved'; -- Admin approved, ready for signature
    WHEN 'signed' THEN message_type := 'contract_signed';
    WHEN 'cancelled' THEN message_type := 'contract_rejected';
    WHEN 'terminated' THEN message_type := 'contract_expired';
    ELSE 
      -- Skip notification for unhandled statuses
      RETURN NEW;
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
$function$;
