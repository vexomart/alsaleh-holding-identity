-- CRITICAL SECURITY FIXES - Phase 1: Fix Data Exposure and Function Security

-- Fix newsletter_subscriptions policies to prevent unauthorized access
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Authenticated users can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (check_recent_newsletter_subscription(email));

-- Fix database functions to use secure search_path (with CASCADE to handle triggers)
DROP FUNCTION IF EXISTS public.set_invoice_number() CASCADE;
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

-- Recreate the invoice triggers
CREATE TRIGGER set_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.set_invoice_number();

DROP FUNCTION IF EXISTS public._update_updated_at() CASCADE;
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

DROP FUNCTION IF EXISTS public.set_client_id() CASCADE;
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

-- Recreate the client_id trigger
CREATE TRIGGER set_client_id_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_client_id();

DROP FUNCTION IF EXISTS public.set_ticket_number() CASCADE;
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

-- Recreate the ticket_number trigger
CREATE TRIGGER set_ticket_number_trigger
  BEFORE INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ticket_number();

DROP FUNCTION IF EXISTS public.set_contract_number() CASCADE;
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

-- Recreate the contract_number trigger
CREATE TRIGGER set_contract_number_trigger
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_contract_number();

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
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

-- Recreate the new user trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP FUNCTION IF EXISTS public.update_invoice_counters_updated_at() CASCADE;
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

-- Recreate the invoice counters trigger
CREATE TRIGGER update_invoice_counters_updated_at_trigger
  BEFORE UPDATE ON public.invoice_counters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_counters_updated_at();

DROP FUNCTION IF EXISTS public.update_invoice_updated_at() CASCADE;
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

-- Recreate the invoice updated_at trigger
CREATE TRIGGER update_invoice_updated_at_trigger
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_updated_at();

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
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