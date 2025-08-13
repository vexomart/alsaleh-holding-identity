-- CRITICAL SECURITY FIXES - Phase 1: Fix Data Exposure

-- Fix newsletter_subscriptions policies to prevent unauthorized access
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Authenticated users can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (check_recent_newsletter_subscription(email));

-- Fix database functions to use secure search_path
DROP FUNCTION IF EXISTS public.set_invoice_number();
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public._update_updated_at();
CREATE OR REPLACE FUNCTION public._update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_client_id();
CREATE OR REPLACE FUNCTION public.set_client_id()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    IF NEW.client_id IS NULL THEN
        NEW.client_id := public.generate_client_id();
    END IF;
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_ticket_number();
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := public.generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.set_contract_number();
CREATE OR REPLACE FUNCTION public.set_contract_number()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := public.generate_contract_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

DROP FUNCTION IF EXISTS public.update_invoice_counters_updated_at();
CREATE OR REPLACE FUNCTION public.update_invoice_counters_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_invoice_updated_at();
CREATE OR REPLACE FUNCTION public.update_invoice_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add security audit logging for contract access
CREATE OR REPLACE FUNCTION public.log_contract_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log access attempts to contracts for security monitoring
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
    'contracts',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'high'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'contracts',
      'operation', TG_OP,
      'contract_number', COALESCE(NEW.contract_number, OLD.contract_number),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add security audit logging for payment transaction access
CREATE OR REPLACE FUNCTION public.log_payment_transaction_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log access attempts to payment transactions for security monitoring
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
    'payment_transactions',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'medium'
    END,
    jsonb_build_object(
      'table', 'payment_transactions',
      'operation', TG_OP,
      'amount', COALESCE(NEW.amount, OLD.amount),
      'payment_method', COALESCE(NEW.payment_method, OLD.payment_method),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;