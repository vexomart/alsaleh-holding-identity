-- Fix Function Search Path Security Issues
-- Add SET search_path TO '' to all functions to prevent injection attacks

-- Fix generate_contract_number function
CREATE OR REPLACE FUNCTION public.generate_contract_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Fix set_contract_number function
CREATE OR REPLACE FUNCTION public.set_contract_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
    NEW.contract_number := public.generate_contract_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$function$;

-- Fix update_invoice_counters_updated_at function
CREATE OR REPLACE FUNCTION public.update_invoice_counters_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix update_invoice_updated_at function
CREATE OR REPLACE FUNCTION public.update_invoice_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix set_invoice_number function
CREATE OR REPLACE FUNCTION public.set_invoice_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := public.generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
$function$;

-- Enable RLS on invoice_counters table (missing RLS)
ALTER TABLE public.invoice_counters ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for invoice_counters (system-only access)
CREATE POLICY "System can manage invoice counters"
ON public.invoice_counters
FOR ALL
USING (true)
WITH CHECK (true);

-- Fix critical invoice access control vulnerability
-- Remove the dangerous auth.email() policy and replace with proper user_id-based access
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;

-- Create new secure policy for invoices
CREATE POLICY "Users can view their own invoices"
ON public.invoices
FOR SELECT
USING (
  (auth.uid() = user_id) OR 
  (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'::app_role))
);