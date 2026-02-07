-- ============================================================
-- Auto-credit wallet on finance contract approval
-- Trigger + Function to credit customer wallet when admin approves
-- Also sends SMS notification via pg_net
-- ============================================================

-- 1. Create function to credit wallet and send SMS
CREATE OR REPLACE FUNCTION public.auto_credit_wallet_on_contract_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_user_id uuid;
  v_wallet_id uuid;
  v_amount numeric;
  v_currency text;
  v_phone text;
  v_contract_number text;
  v_service_name text;
  v_msegat_key text;
  v_msegat_sender text;
  v_sms_message text;
  v_supabase_url text;
BEGIN
  -- Only trigger when status changes TO 'pending_signature' (admin approved)
  IF TG_OP = 'UPDATE' 
     AND OLD.status IS DISTINCT FROM NEW.status
     AND NEW.status = 'pending_signature'
     AND OLD.status = 'pre_approved_by_customer'
  THEN
    v_customer_user_id := NEW.customer_user_id;
    v_contract_number := NEW.contract_number;
    
    -- Get pricing info
    IF NEW.pricing_json IS NOT NULL THEN
      v_amount := (NEW.pricing_json->>'total')::numeric;
      v_currency := COALESCE(NEW.pricing_json->>'currency', 'SAR');
    ELSE
      -- No pricing, skip
      RETURN NEW;
    END IF;
    
    -- Skip if no amount
    IF v_amount IS NULL OR v_amount <= 0 THEN
      RETURN NEW;
    END IF;
    
    -- Get customer wallet
    SELECT id INTO v_wallet_id
    FROM public.customer_wallets
    WHERE customer_user_id = v_customer_user_id
    LIMIT 1;
    
    -- Create wallet if doesn't exist
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.customer_wallets (
        customer_user_id,
        wallet_number,
        balance,
        currency,
        status
      )
      VALUES (
        v_customer_user_id,
        'WLT-' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0'),
        0,
        v_currency,
        'active'
      )
      RETURNING id INTO v_wallet_id;
    END IF;
    
    -- Credit the wallet
    UPDATE public.customer_wallets
    SET 
      balance = COALESCE(balance, 0) + v_amount,
      updated_at = NOW()
    WHERE id = v_wallet_id;
    
    -- Get service name
    SELECT COALESCE(name_ar, name) INTO v_service_name
    FROM public.services
    WHERE id = NEW.service_id;
    
    -- Create financial transaction record
    INSERT INTO public.financial_transactions (
      customer_user_id,
      wallet_id,
      transaction_type,
      amount,
      currency,
      status,
      description,
      description_ar,
      metadata,
      processed_at
    )
    VALUES (
      v_customer_user_id,
      v_wallet_id,
      'credit',
      v_amount,
      v_currency,
      'succeeded',
      'Credit from approved contract: ' || v_contract_number,
      'إيداع من عقد معتمد: ' || v_contract_number,
      jsonb_build_object(
        'source', 'contract_approval',
        'contract_id', NEW.id,
        'contract_number', v_contract_number,
        'service_name', v_service_name
      ),
      NOW()
    );
    
    -- Send SMS notification via pg_net
    SELECT phone INTO v_phone
    FROM public.profiles
    WHERE id = v_customer_user_id;
    
    IF v_phone IS NOT NULL THEN
      -- Get Msegat credentials
      SELECT 
        decrypted_secret INTO v_msegat_key
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_API_KEY'
      LIMIT 1;
      
      SELECT 
        decrypted_secret INTO v_msegat_sender
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_SENDER_NAME'
      LIMIT 1;
      
      IF v_msegat_key IS NOT NULL THEN
        v_sms_message := 'ASH HOLDING
تم اعتماد عقدك رقم ' || v_contract_number || '
تم إيداع ' || v_amount || ' ' || v_currency || ' في محفظتك
يرجى التوقيع الإلكتروني لإتمام العملية';
        
        PERFORM net.http_post(
          url := 'https://www.msegat.com/gw/sendsms.php',
          headers := '{"Content-Type": "application/json"}'::jsonb,
          body := jsonb_build_object(
            'apiKey', v_msegat_key,
            'userName', 'ashholding',
            'numbers', v_phone,
            'userSender', COALESCE(v_msegat_sender, 'ASH HOLDING'),
            'msg', v_sms_message,
            'msgEncoding', 'UTF8'
          )
        );
        
        -- Log SMS
        INSERT INTO public.sms_logs (phone, message, status, metadata)
        VALUES (
          v_phone,
          v_sms_message,
          'sent',
          jsonb_build_object(
            'trigger', 'contract_approval_credit',
            'contract_id', NEW.id,
            'amount', v_amount
          )
        );
      END IF;
    END IF;
    
    RAISE NOTICE 'Credited % % to wallet % for contract %', v_amount, v_currency, v_wallet_id, v_contract_number;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create trigger on contracts table
DROP TRIGGER IF EXISTS trigger_auto_credit_on_contract_approval ON public.contracts;

CREATE TRIGGER trigger_auto_credit_on_contract_approval
  AFTER UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_credit_wallet_on_contract_approval();

-- 3. Add trigger for contract signed notification
CREATE OR REPLACE FUNCTION public.notify_contract_signed()
RETURNS TRIGGER AS $$
DECLARE
  v_phone text;
  v_contract_number text;
  v_msegat_key text;
  v_msegat_sender text;
  v_sms_message text;
BEGIN
  -- Only trigger when status changes TO 'signed'
  IF TG_OP = 'UPDATE' 
     AND OLD.status IS DISTINCT FROM NEW.status
     AND NEW.status = 'signed'
  THEN
    v_contract_number := NEW.contract_number;
    
    SELECT phone INTO v_phone
    FROM public.profiles
    WHERE id = NEW.customer_user_id;
    
    IF v_phone IS NOT NULL THEN
      SELECT decrypted_secret INTO v_msegat_key
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_API_KEY'
      LIMIT 1;
      
      SELECT decrypted_secret INTO v_msegat_sender
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_SENDER_NAME'
      LIMIT 1;
      
      IF v_msegat_key IS NOT NULL THEN
        v_sms_message := 'ASH HOLDING
تم توقيع عقدك رقم ' || v_contract_number || ' بنجاح
شكراً لثقتكم بنا';
        
        PERFORM net.http_post(
          url := 'https://www.msegat.com/gw/sendsms.php',
          headers := '{"Content-Type": "application/json"}'::jsonb,
          body := jsonb_build_object(
            'apiKey', v_msegat_key,
            'userName', 'ashholding',
            'numbers', v_phone,
            'userSender', COALESCE(v_msegat_sender, 'ASH HOLDING'),
            'msg', v_sms_message,
            'msgEncoding', 'UTF8'
          )
        );
        
        INSERT INTO public.sms_logs (phone, message, status, metadata)
        VALUES (
          v_phone,
          v_sms_message,
          'sent',
          jsonb_build_object('trigger', 'contract_signed', 'contract_id', NEW.id)
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_notify_contract_signed ON public.contracts;

CREATE TRIGGER trigger_notify_contract_signed
  AFTER UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contract_signed();

-- 4. Add trigger for contract rejection notification
CREATE OR REPLACE FUNCTION public.notify_contract_rejected()
RETURNS TRIGGER AS $$
DECLARE
  v_phone text;
  v_contract_number text;
  v_msegat_key text;
  v_msegat_sender text;
  v_sms_message text;
BEGIN
  -- Only trigger when status changes TO 'cancelled' with rejection reason
  IF TG_OP = 'UPDATE' 
     AND OLD.status IS DISTINCT FROM NEW.status
     AND NEW.status = 'cancelled'
     AND NEW.admin_rejection_reason IS NOT NULL
  THEN
    v_contract_number := NEW.contract_number;
    
    SELECT phone INTO v_phone
    FROM public.profiles
    WHERE id = NEW.customer_user_id;
    
    IF v_phone IS NOT NULL THEN
      SELECT decrypted_secret INTO v_msegat_key
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_API_KEY'
      LIMIT 1;
      
      SELECT decrypted_secret INTO v_msegat_sender
      FROM vault.decrypted_secrets 
      WHERE name = 'MSEGAT_SENDER_NAME'
      LIMIT 1;
      
      IF v_msegat_key IS NOT NULL THEN
        v_sms_message := 'ASH HOLDING
نأسف، تم رفض عقدك رقم ' || v_contract_number || '
السبب: ' || LEFT(NEW.admin_rejection_reason, 100) || '
للاستفسار: info@ash-holding.sa';
        
        PERFORM net.http_post(
          url := 'https://www.msegat.com/gw/sendsms.php',
          headers := '{"Content-Type": "application/json"}'::jsonb,
          body := jsonb_build_object(
            'apiKey', v_msegat_key,
            'userName', 'ashholding',
            'numbers', v_phone,
            'userSender', COALESCE(v_msegat_sender, 'ASH HOLDING'),
            'msg', v_sms_message,
            'msgEncoding', 'UTF8'
          )
        );
        
        INSERT INTO public.sms_logs (phone, message, status, metadata)
        VALUES (
          v_phone,
          v_sms_message,
          'sent',
          jsonb_build_object('trigger', 'contract_rejected', 'contract_id', NEW.id)
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_notify_contract_rejected ON public.contracts;

CREATE TRIGGER trigger_notify_contract_rejected
  AFTER UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contract_rejected();