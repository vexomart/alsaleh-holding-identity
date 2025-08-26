-- CRITICAL SECURITY FIX: Implement comprehensive RLS policies for all sensitive tables
-- This addresses the security vulnerability where sensitive customer data is publicly accessible

-- First, ensure RLS is enabled on all sensitive tables
ALTER TABLE IF EXISTS public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.client_contacts;
DROP POLICY IF EXISTS "Public read access" ON public.job_applicants;
DROP POLICY IF EXISTS "Public read access" ON public.job_applications;
DROP POLICY IF EXISTS "Public read access" ON public.payment_transactions;
DROP POLICY IF EXISTS "Public read access" ON public.invoices;
DROP POLICY IF EXISTS "Public read access" ON public.product_orders;
DROP POLICY IF EXISTS "Public read access" ON public.contracts;
DROP POLICY IF EXISTS "Public read access" ON public.support_tickets;
DROP POLICY IF EXISTS "Public read access" ON public.profiles;
DROP POLICY IF EXISTS "Public read access" ON public.clients;

-- CLIENT_CONTACTS: Restrict to authorized users only
DROP POLICY IF EXISTS "client_contacts_admin_access_enhanced" ON public.client_contacts;
DROP POLICY IF EXISTS "client_contacts_owner_access_enhanced" ON public.client_contacts;

CREATE POLICY "client_contacts_admin_full_access" ON public.client_contacts
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'client_contact_access'::text)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'client_contact_access'::text)
);

CREATE POLICY "client_contacts_owner_access_only" ON public.client_contacts
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
  )
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'client_contact_access'::text)
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = client_contacts.client_id 
    AND clients.created_by = auth.uid()
  )
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'client_contact_access'::text)
);

-- PROFILES: Only profile owner and admins
CREATE POLICY "profiles_self_access" ON public.profiles
FOR ALL TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "profiles_admin_access" ON public.profiles
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

-- CLIENTS: Only creator and admins
CREATE POLICY "clients_creator_access" ON public.clients
FOR ALL TO authenticated
USING (created_by = auth.uid() AND auth.uid() IS NOT NULL)
WITH CHECK (created_by = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "clients_admin_access" ON public.clients
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

-- CONTRACTS: Only creator and admins with enhanced security
CREATE POLICY "contracts_creator_access" ON public.contracts
FOR ALL TO authenticated
USING (
  user_id = auth.uid() 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'contract_access'::text)
)
WITH CHECK (
  user_id = auth.uid() 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'contract_access'::text)
);

CREATE POLICY "contracts_admin_access" ON public.contracts
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'contract_access'::text)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND auth.uid() IS NOT NULL 
  AND check_sensitive_operation_limit(auth.uid(), 'contract_access'::text)
);

-- PRODUCT_ORDERS: Only order owner and admins
CREATE POLICY "product_orders_customer_access" ON public.product_orders
FOR SELECT TO authenticated
USING (customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND auth.uid() IS NOT NULL);

CREATE POLICY "product_orders_admin_access" ON public.product_orders
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL)
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  company_name text,
  client_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  legal_name text NOT NULL,
  tax_number text,
  commercial_register text,
  billing_email text,
  phone text,
  address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  contract_number text UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  client_type text,
  client_id_number text,
  client_address text,
  service_type text NOT NULL,
  service_price numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on newly created tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;

-- Add security audit triggers for sensitive tables
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'sensitive_data_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    'high',
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers to monitor access to sensitive tables
DROP TRIGGER IF EXISTS log_client_contacts_access ON public.client_contacts;
CREATE TRIGGER log_client_contacts_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.client_contacts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS log_contracts_access ON public.contracts;
CREATE TRIGGER log_contracts_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS log_profiles_access ON public.profiles;
CREATE TRIGGER log_profiles_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;