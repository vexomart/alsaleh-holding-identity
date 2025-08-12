-- SECURITY FIX: Address linter warnings
-- Fix function search path mutable issues

-- 1. Fix search path for existing functions
ALTER FUNCTION public.check_rate_limit(text, text, integer, integer) SET search_path = '';
ALTER FUNCTION public.check_recent_newsletter_subscription(text) SET search_path = '';
ALTER FUNCTION public.check_recent_job_application(text) SET search_path = '';
ALTER FUNCTION public.generate_client_id() SET search_path = '';
ALTER FUNCTION public.generate_contract_number() SET search_path = '';
ALTER FUNCTION public.generate_invoice_number() SET search_path = '';
ALTER FUNCTION public.generate_ticket_number() SET search_path = '';
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = '';

-- 2. Update functions with proper qualified names
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action_type text,
  p_limit integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count for this identifier and action
  SELECT count INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start >= window_start_time;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, count, window_start)
    VALUES (p_identifier, p_action_type, 1, now())
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET count = 1, window_start = now();
    RETURN true;
  END IF;
  
  -- Check if under limit
  IF current_count < p_limit THEN
    -- Increment counter
    UPDATE public.rate_limits 
    SET count = count + 1
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN true;
  END IF;
  
  -- Over limit
  RETURN false;
END;
$$;