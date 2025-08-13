-- Phase 2: Add enhanced security monitoring and audit triggers

-- Create comprehensive security monitoring function for sensitive data operations
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

-- Add security audit triggers for sensitive data modifications
CREATE TRIGGER log_contract_modifications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER log_payment_transaction_modifications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER log_invoice_modifications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_sensitive_data_access();

-- Add trigger for profile modifications
CREATE TRIGGER log_profile_modifications_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW  
  EXECUTE FUNCTION public.log_sensitive_data_access();

-- Enhanced rate limiting for sensitive operations
CREATE OR REPLACE FUNCTION public.enhanced_security_check()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
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

-- Add rate limiting triggers
CREATE TRIGGER enhanced_security_check_contracts_trigger
  BEFORE INSERT OR UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_security_check();

CREATE TRIGGER enhanced_security_check_payment_transactions_trigger
  BEFORE INSERT OR UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.enhanced_security_check();