-- Fix the enhanced_sensitive_data_rate_limit function to handle missing rate_limits table gracefully
CREATE OR REPLACE FUNCTION public.enhanced_sensitive_data_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for sensitive data operations
  IF TG_OP = 'INSERT' THEN
    -- Use a simpler rate limit check that doesn't depend on missing functions
    BEGIN
      SELECT public.enhanced_rate_limit_check(
        user_identifier,
        TG_TABLE_NAME || '_submit',
        5, -- Max 5 submissions per hour
        60
      ) INTO rate_limit_passed;
    EXCEPTION 
      WHEN OTHERS THEN
        -- If rate limit check fails, allow the operation but log it
        rate_limit_passed := TRUE;
        INSERT INTO public.security_audit_logs (
          event_type,
          user_id,
          action,
          risk_level,
          metadata
        ) VALUES (
          'rate_limit_check_failed',
          auth.uid(),
          TG_TABLE_NAME || '_rate_limit_bypass',
          'medium',
          jsonb_build_object(
            'table', TG_TABLE_NAME,
            'user_identifier', user_identifier,
            'error', 'Rate limit check failed, operation allowed',
            'timestamp', now()
          )
        );
    END;
    
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
        auth.uid(),
        TG_TABLE_NAME || '_submission_blocked',
        'high',
        jsonb_build_object(
          'table', TG_TABLE_NAME,
          'user_identifier', user_identifier,
          'blocked_submission', true,
          'timestamp', now()
        )
      );
      
      RAISE EXCEPTION 'Rate limit exceeded for % submissions. Please try again later.', TG_TABLE_NAME;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;