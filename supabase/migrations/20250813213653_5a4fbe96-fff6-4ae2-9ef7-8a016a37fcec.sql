-- Fix security linter issues

-- 1. Fix the security definer view issue by removing the contracts_secure view
-- and implementing proper data access through the get_user_contracts function instead
DROP VIEW IF EXISTS public.contracts_secure;

-- 2. Update all functions to have proper search_path settings (fix search path mutable warnings)
CREATE OR REPLACE FUNCTION public.mask_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.mask_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.mask_id_number(id_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.log_contract_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access to sensitive contract data
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'sensitive_data_access',
    auth.uid(),
    TG_OP,
    'contracts',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'contracts',
      'operation', TG_OP,
      'contract_number', COALESCE(NEW.contract_number, OLD.contract_number),
      'client_type', COALESCE(NEW.client_type, OLD.client_type),
      'service_price', COALESCE(NEW.service_price, OLD.service_price)::text,
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_contract_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_user_contracts(requesting_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid,
  contract_number text,
  client_name text,
  client_email text,
  client_phone text,
  service_type text,
  service_price numeric,
  status text,
  created_at timestamptz,
  masked_data boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
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
$$;