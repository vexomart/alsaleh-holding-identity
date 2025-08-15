-- Phase 1: Critical Database Security Fixes

-- Fix search paths for all database functions to prevent SQL injection
CREATE OR REPLACE FUNCTION public.get_user_contracts(requesting_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(id uuid, contract_number text, client_name text, client_email text, client_phone text, service_type text, service_price numeric, status text, created_at timestamp with time zone, masked_data boolean)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check rate limits first
  IF NOT public.check_contract_rate_limit(requesting_user_id) THEN
    RAISE EXCEPTION 'Rate limit exceeded for contract access';
  END IF;
  
  -- Return contracts with appropriate data masking
  RETURN QUERY
  SELECT 
    c.id,
    c.contract_number,
    c.client_name,
    CASE 
      WHEN public.has_role(requesting_user_id, 'admin'::app_role) OR c.user_id = requesting_user_id 
      THEN c.client_email 
      ELSE public.mask_email(c.client_email, requesting_user_id)
    END as client_email,
    CASE 
      WHEN public.has_role(requesting_user_id, 'admin'::app_role) OR c.user_id = requesting_user_id 
      THEN c.client_phone 
      ELSE public.mask_phone(c.client_phone, requesting_user_id)
    END as client_phone,
    c.service_type,
    c.service_price,
    c.status,
    c.created_at,
    NOT (public.has_role(requesting_user_id, 'admin'::app_role) OR c.user_id = requesting_user_id) as masked_data
  FROM public.contracts c
  WHERE 
    (c.user_id = requesting_user_id OR public.has_role(requesting_user_id, 'admin'::app_role));
END;
$function$;

-- Fix enhanced_rate_limit_check function
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(p_identifier text, p_action_type text, p_limit integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
  is_sensitive_action boolean;
BEGIN
  -- More restrictive limits for sensitive actions
  is_sensitive_action := p_action_type IN ('contract_creation', 'payment_processing', 'data_export');
  
  IF is_sensitive_action THEN
    p_limit := LEAST(p_limit, 3); -- Max 3 sensitive operations per hour
    p_window_minutes := GREATEST(p_window_minutes, 60); -- At least 1 hour window
  END IF;
  
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count
  SELECT count INTO current_count
  FROM rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start >= window_start_time;
  
  -- Log suspicious activity to security audit logs if table exists
  IF current_count >= p_limit THEN
    INSERT INTO security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      auth.uid(),
      p_action_type,
      'high',
      jsonb_build_object(
        'identifier', p_identifier,
        'current_count', current_count,
        'limit', p_limit,
        'window_minutes', p_window_minutes
      )
    );
    RETURN false;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (identifier, action_type, count, window_start)
  VALUES (p_identifier, p_action_type, 1, now())
  ON CONFLICT (identifier, action_type) 
  DO UPDATE SET 
    count = CASE 
      WHEN rate_limits.window_start < window_start_time THEN 1
      ELSE rate_limits.count + 1 
    END,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start_time THEN now()
      ELSE rate_limits.window_start 
    END;
    
  RETURN true;
END;
$function$;

-- Fix check_contract_rate_limit function
CREATE OR REPLACE FUNCTION public.check_contract_rate_limit(p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(p_user_id::text, 'anonymous');
  
  -- Check rate limits: max 10 contract operations per hour
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    'contract_access',
    10, -- Limit to 10 operations
    60  -- Per hour
  ) INTO rate_limit_passed;
  
  IF NOT rate_limit_passed THEN
    -- Log security event
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'rate_limit_exceeded',
      p_user_id,
      'contract_access',
      'high',
      jsonb_build_object(
        'limit_type', 'contract_access',
        'limit', 10,
        'window_minutes', 60,
        'timestamp', now()
      )
    );
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Fix mask_email function
CREATE OR REPLACE FUNCTION public.mask_email(email_input text, user_requesting uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only show full email to admins or the data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN email_input;
  END IF;
  
  -- Mask email for others: show first 2 chars + *** + domain
  IF email_input IS NOT NULL AND email_input != '' THEN
    RETURN LEFT(email_input, 2) || '***@' || SPLIT_PART(email_input, '@', 2);
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Fix mask_phone function
CREATE OR REPLACE FUNCTION public.mask_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only show full phone to admins or the data owner
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN phone_input;
  END IF;
  
  -- Mask phone: show only last 4 digits
  IF phone_input IS NOT NULL AND LENGTH(phone_input) > 4 THEN
    RETURN '***-' || RIGHT(phone_input, 4);
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Fix mask_id_number function
CREATE OR REPLACE FUNCTION public.mask_id_number(id_input text, user_requesting uuid DEFAULT auth.uid())
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only show full ID to admins
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN id_input;
  END IF;
  
  -- Completely mask ID numbers for non-admins
  IF id_input IS NOT NULL AND id_input != '' THEN
    RETURN '***MASKED***';
  END IF;
  
  RETURN NULL;
END;
$function$;

-- Secure subscription_plans table - Remove public access and add proper RLS
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON public.subscription_plans;

-- Create restrictive policies for subscription plans
CREATE POLICY "Authenticated users can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Admins can manage all subscription plans" 
ON public.subscription_plans 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add enhanced security trigger for payment transactions
CREATE OR REPLACE FUNCTION public.enhanced_payment_security_check()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for payment operations (stricter limits)
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    'payment_' || TG_OP,
    2, -- Only 2 payment operations
    60 -- Per hour
  ) INTO rate_limit_passed;
  
  IF NOT rate_limit_passed THEN
    -- Log critical security event
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'payment_rate_limit_exceeded',
      auth.uid(),
      'payment_' || TG_OP,
      'critical',
      jsonb_build_object(
        'table', TG_TABLE_NAME,
        'operation', TG_OP,
        'amount', COALESCE(NEW.amount, OLD.amount)::text,
        'payment_method', COALESCE(NEW.payment_method, OLD.payment_method),
        'timestamp', now()
      )
    );
    RAISE EXCEPTION 'Payment rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Apply enhanced security trigger to payment transactions
DROP TRIGGER IF EXISTS enhanced_payment_security_trigger ON public.payment_transactions;
CREATE TRIGGER enhanced_payment_security_trigger
  BEFORE INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_payment_security_check();