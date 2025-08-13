-- Phase 2: Fix remaining database functions and add security audit triggers

-- Fix remaining database functions that still need secure search_path
UPDATE auth.config 
SET value = '300' 
WHERE name = 'email_otp_expire_in';

UPDATE auth.config 
SET value = '300'
WHERE name = 'sms_otp_expire_in';

-- Enable leaked password protection
UPDATE auth.config 
SET value = 'true'
WHERE name = 'enable_leaked_password_protection';

-- Add security audit triggers for sensitive tables
CREATE TRIGGER log_contract_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_job_application_access();

CREATE TRIGGER log_payment_transaction_access_trigger
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_job_application_access();

-- Create comprehensive security monitoring function
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
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
      WHEN TG_TABLE_NAME = 'payment_transactions' AND TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_TABLE_NAME = 'contracts' AND TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'high'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now(),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;