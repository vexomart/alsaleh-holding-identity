-- CRITICAL SECURITY FIX: Implement comprehensive RLS policies for all sensitive tables
-- This addresses the security vulnerability where sensitive customer data is publicly accessible

-- First, ensure RLS is enabled on all sensitive tables
ALTER TABLE IF EXISTS public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.client_contacts;
DROP POLICY IF EXISTS "Public read access" ON public.job_applicants;
DROP POLICY IF EXISTS "Public read access" ON public.job_applications;
DROP POLICY IF EXISTS "Public read access" ON public.payment_transactions;
DROP POLICY IF EXISTS "Public read access" ON public.invoices;
DROP POLICY IF EXISTS "Public read access" ON public.support_tickets;

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

-- Add security audit function for sensitive tables
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

-- Add monitoring triggers for sensitive tables (correct syntax)
DROP TRIGGER IF EXISTS log_client_contacts_access ON public.client_contacts;
CREATE TRIGGER log_client_contacts_access
  AFTER INSERT OR UPDATE OR DELETE ON public.client_contacts
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();