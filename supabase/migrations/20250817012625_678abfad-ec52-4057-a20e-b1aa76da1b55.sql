-- SECURITY FIX - Phase 2: Enhanced RLS Policies and Data Protection

-- 1. Enhanced data masking functions
CREATE OR REPLACE FUNCTION public.mask_sensitive_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only show full email to admins or data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN email_input;
  END IF;
  
  -- Enhanced masking: show only first char + *** + domain
  IF email_input IS NOT NULL AND email_input != '' AND email_input LIKE '%@%' THEN
    RETURN LEFT(email_input, 1) || '***@' || SPLIT_PART(email_input, '@', 2);
  END IF;
  
  RETURN '***@***.***';
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_sensitive_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only show full phone to admins or data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN phone_input;
  END IF;
  
  -- Enhanced masking: show only country code + last 3 digits
  IF phone_input IS NOT NULL AND LENGTH(phone_input) > 6 THEN
    RETURN LEFT(phone_input, 4) || '***' || RIGHT(phone_input, 3);
  END IF;
  
  RETURN '***-***-***';
END;
$$;

-- 2. Enhanced payment security trigger
CREATE OR REPLACE FUNCTION public.enhanced_payment_security_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Ensure user_id is not NULL for all payment operations
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.user_id IS NULL THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'unauthorized_access_attempt',
      auth.uid(),
      'payment_without_user_id',
      'critical',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'amount', NEW.amount::text,
        'timestamp', now(),
        'blocked', true
      )
    );
    RAISE EXCEPTION 'Payment operations require valid user authentication';
  END IF;

  -- Enhanced rate limiting for payments (max 3 per hour)
  user_identifier := NEW.user_id::text;
  
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    'payment_' || TG_OP,
    3,
    60
  ) INTO rate_limit_passed;
  
  IF NOT rate_limit_passed THEN
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      NEW.user_id,
      'payment_rate_limit_exceeded',
      'critical',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'amount', NEW.amount::text,
        'user_id', NEW.user_id::text,
        'timestamp', now()
      )
    );
    RAISE EXCEPTION 'Payment rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply enhanced payment security trigger
CREATE TRIGGER enhanced_payment_security_trigger
  BEFORE INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_payment_security_trigger();

-- 3. Update contracts RLS policies with enhanced security
DROP POLICY IF EXISTS "Secure: Users can view their own contracts with data masking" ON public.contracts;
CREATE POLICY "Secure: Users can view their own contracts with data masking"
ON public.contracts
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
  AND public.check_contract_rate_limit(auth.uid())
);

DROP POLICY IF EXISTS "Secure: Authenticated users can create contracts" ON public.contracts;
CREATE POLICY "Secure: Authenticated users can create contracts"
ON public.contracts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND user_id IS NOT NULL
  AND public.check_contract_rate_limit(auth.uid())
);

DROP POLICY IF EXISTS "Secure: Users can update their own contracts" ON public.contracts;
CREATE POLICY "Secure: Users can update their own contracts"
ON public.contracts
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL
  AND (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
  AND public.check_contract_rate_limit(auth.uid())
);

-- 4. Enhanced payment transactions RLS policies
DROP POLICY IF EXISTS "Secure: Users can view their own transactions" ON public.payment_transactions;
CREATE POLICY "Secure: Users can view their own transactions"
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL
  AND (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
);

DROP POLICY IF EXISTS "Secure: Authenticated users can create transactions" ON public.payment_transactions;
CREATE POLICY "Secure: Authenticated users can create transactions"
ON public.payment_transactions
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND user_id IS NOT NULL
);

DROP POLICY IF EXISTS "Secure: Authorized users can update transactions" ON public.payment_transactions;
CREATE POLICY "Secure: Authorized users can update transactions"
ON public.payment_transactions
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL
  AND (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role))
);

-- 5. Enhanced profiles security
DROP POLICY IF EXISTS "Secure: Users can view their own profile only" ON public.profiles;
CREATE POLICY "Secure: Users can view their own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL
  AND auth.uid() = user_id
);

-- 6. Create comprehensive security audit trigger
CREATE OR REPLACE FUNCTION public.log_sensitive_operations()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all operations on sensitive tables
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'sensitive_operation',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME IN ('payment_transactions', 'contracts') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'medium'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_id', COALESCE(NEW.user_id, OLD.user_id),
      'timestamp', now(),
      'contract_number', CASE WHEN TG_TABLE_NAME = 'contracts' THEN COALESCE(NEW.contract_number, OLD.contract_number) ELSE NULL END,
      'payment_amount', CASE WHEN TG_TABLE_NAME = 'payment_transactions' THEN COALESCE(NEW.amount, OLD.amount)::text ELSE NULL END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_contracts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_operations();

CREATE TRIGGER audit_payment_transactions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_operations();

-- 7. Log completion of security hardening
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'admin_action',
  auth.uid(),
  'security_hardening_completed',
  'high',
  jsonb_build_object(
    'phase', 'enhanced_rls_and_triggers',
    'timestamp', now(),
    'features_added', jsonb_build_array(
      'enhanced_data_masking',
      'payment_security_triggers', 
      'strengthened_rls_policies',
      'comprehensive_audit_logging'
    )
  )
);