-- Fix remaining search path issues for existing functions

-- Update existing functions that don't have proper search_path settings
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(p_identifier text, p_action_type text, p_limit integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.enhanced_security_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for sensitive operations
  IF TG_OP IN ('INSERT', 'UPDATE') AND TG_TABLE_NAME IN ('payment_transactions', 'contracts') THEN
    SELECT public.enhanced_rate_limit_check(
      user_identifier,
      TG_TABLE_NAME || '_' || TG_OP,
      3, -- Limit to 3 operations
      60 -- Per hour
    ) INTO rate_limit_passed;
    
    IF NOT rate_limit_passed THEN
      RAISE EXCEPTION 'Rate limit exceeded for % operation on %', TG_OP, TG_TABLE_NAME;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log access attempts to sensitive data for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'data_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME = 'payment_transactions' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_TABLE_NAME = 'contracts' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'high'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now(),
      'amount', CASE 
        WHEN TG_TABLE_NAME = 'payment_transactions' THEN COALESCE(NEW.amount, OLD.amount)::text
        WHEN TG_TABLE_NAME = 'invoices' THEN COALESCE(NEW.amount, OLD.amount)::text
        ELSE NULL
      END,
      'contract_number', CASE 
        WHEN TG_TABLE_NAME = 'contracts' THEN COALESCE(NEW.contract_number, OLD.contract_number)
        ELSE NULL
      END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;