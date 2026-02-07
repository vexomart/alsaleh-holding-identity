-- Update the trigger function to use correct pg_net syntax
CREATE OR REPLACE FUNCTION public.notify_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
  customer_phone TEXT;
  message_type TEXT;
  operation_type TEXT;
  current_balance NUMERIC;
  request_id BIGINT;
BEGIN
  -- Only process adjustment transactions
  IF NEW.transaction_type != 'adjustment' THEN
    RETURN NEW;
  END IF;

  -- Get customer phone from profiles
  SELECT phone INTO customer_phone
  FROM public.profiles
  WHERE id = NEW.customer_user_id;

  -- Skip if no phone
  IF customer_phone IS NULL OR customer_phone = '' THEN
    RETURN NEW;
  END IF;

  -- Get current wallet balance
  SELECT balance INTO current_balance
  FROM public.customer_wallets
  WHERE id = NEW.wallet_id;

  -- Determine message type based on metadata
  IF (NEW.metadata->>'adjustment_type') = 'add' THEN
    message_type := 'wallet_topup';
    operation_type := 'إيداع نقدي - تعديل إداري';
  ELSE
    message_type := 'wallet_withdrawal';
    operation_type := 'خصم إداري';
  END IF;

  -- Call edge function via pg_net (async HTTP)
  SELECT net.http_post(
    url := 'https://iuzzapnmiopbbjfravww.supabase.co/functions/v1/sms-send-notification',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1enphcG5taW9wYmJqZnJhdnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTIzNzksImV4cCI6MjA4NTM2ODM3OX0.y26uItWk8k__Dd7Dj_U79TBd8GRHgvfhYvJzUP-YXKs"}'::jsonb,
    body := jsonb_build_object(
      'phone', customer_phone,
      'message_type', message_type,
      'template_data', jsonb_build_object(
        'amount', to_char(NEW.amount, 'FM999,999,999'),
        'balance', to_char(COALESCE(current_balance, 0), 'FM999,999,999'),
        'date', to_char(NOW() AT TIME ZONE 'Asia/Riyadh', 'DD/MM/YYYY'),
        'time', to_char(NOW() AT TIME ZONE 'Asia/Riyadh', 'HH12:MI AM'),
        'operation_type', operation_type
      )
    )::text
  ) INTO request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the transaction
  RAISE WARNING 'SMS notification failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;