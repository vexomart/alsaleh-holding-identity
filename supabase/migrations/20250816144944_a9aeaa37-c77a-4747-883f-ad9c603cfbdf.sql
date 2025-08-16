-- Fix security warnings: Update functions to have secure search_path
-- This addresses the "Function Search Path Mutable" warning

-- Update all functions that don't have search_path set to use secure search_path

-- Fix generate_client_id function
CREATE OR REPLACE FUNCTION public.generate_client_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    counter INTEGER;
    client_id_num TEXT;
BEGIN
    -- Get the next counter
    SELECT COALESCE(MAX(CAST(SUBSTRING(client_id FROM 3) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.profiles
    WHERE client_id IS NOT NULL AND client_id LIKE 'CL%';
    
    -- Format as CL + 6-digit number
    client_id_num := 'CL' || LPAD(counter::TEXT, 6, '0');
    
    RETURN client_id_num;
END;
$$;

-- Fix generate_contract_number function
CREATE OR REPLACE FUNCTION public.generate_contract_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  contract_num TEXT;
BEGIN
  -- Get current year last 2 digits
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  -- Get the next counter for this year
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 5 FOR 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.contracts
  WHERE contract_number LIKE 'C' || year_suffix || '%';
  
  -- Format as C + YY + 4-digit counter
  contract_num := 'C' || year_suffix || LPAD(counter::TEXT, 4, '0');
  
  RETURN contract_num;
END;
$$;

-- Fix generate_invoice_number function  
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  year_full INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  year_suffix TEXT := TO_CHAR(CURRENT_DATE, 'YY');
  new_counter INTEGER;
BEGIN
  -- Ensure row exists for the current year
  INSERT INTO public.invoice_counters (year)
  VALUES (year_full)
  ON CONFLICT (year) DO NOTHING;

  -- Atomically increment and return the new counter
  UPDATE public.invoice_counters
  SET counter = counter + 1
  WHERE year = year_full
  RETURNING counter INTO new_counter;

  RETURN 'INV' || year_suffix || LPAD(new_counter::TEXT, 6, '0');
END;
$$;

-- Fix generate_ticket_number function
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
    year_suffix TEXT;
    counter INTEGER;
    ticket_num TEXT;
BEGIN
    year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.tickets
    WHERE ticket_number LIKE 'TK' || year_suffix || '%';
    
    ticket_num := 'TK' || year_suffix || LPAD(counter::TEXT, 6, '0');
    
    RETURN ticket_num;
END;
$$;

-- Fix check_recent_newsletter_subscription function
CREATE OR REPLACE FUNCTION public.check_recent_newsletter_subscription(subscriber_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscriptions 
    WHERE email = subscriber_email 
    AND subscribed_at > NOW() - INTERVAL '1 hour'
  );
END;
$$;

-- Fix check_recent_job_application function
CREATE OR REPLACE FUNCTION public.check_recent_job_application(applicant_email text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.job_applications 
    WHERE email = applicant_email 
    AND created_at > NOW() - INTERVAL '24 hours'
  );
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Log this security fix
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  resource_type,
  risk_level,
  metadata
) VALUES (
  'security_fix',
  auth.uid(),
  'functions_search_path_secured',
  'database_functions',
  'medium',
  jsonb_build_object(
    'description', 'Updated all database functions to use secure search_path settings',
    'functions_updated', 7,
    'vulnerability_fixed', 'Function Search Path Mutable',
    'timestamp', now()
  )
);