-- إصلاح جميع الدوال المتبقية
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND auth.uid() IS NOT NULL
  );
$$;

CREATE OR REPLACE FUNCTION public.check_sensitive_operation_limit(p_user_id uuid, p_operation_type text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  user_identifier := COALESCE(p_user_id::text, 'anonymous');
  
  -- Stricter limits for sensitive operations
  SELECT public.enhanced_rate_limit_check(
    user_identifier,
    p_operation_type,
    CASE 
      WHEN p_operation_type IN ('payment_transaction', 'job_application') THEN 2
      WHEN p_operation_type IN ('invoice_creation', 'contract_creation') THEN 5
      ELSE 10
    END,
    60 -- Per hour
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
      p_user_id,
      p_operation_type || '_rate_limit_exceeded',
      'high',
      jsonb_build_object(
        'operation_type', p_operation_type,
        'timestamp', now(),
        'user_id', p_user_id::text
      )
    );
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(p_identifier text, p_action_type text, p_limit integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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