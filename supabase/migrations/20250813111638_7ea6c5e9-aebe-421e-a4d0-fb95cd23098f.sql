-- Fix search_path security issue for the new function
DROP FUNCTION IF EXISTS public.log_job_application_access();

CREATE OR REPLACE FUNCTION public.log_job_application_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log access attempts to job applications for security monitoring
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
    'job_applications',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_OP = 'INSERT' THEN 'medium'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'job_applications',
      'operation', TG_OP,
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;