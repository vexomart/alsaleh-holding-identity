-- Security Analysis and Fix for Contracts Table
-- First, let's check current RLS status and policies

-- Ensure RLS is enabled on contracts table
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Check for any permissive policies that might allow public access
-- Drop any potentially insecure policies first
DROP POLICY IF EXISTS "Anyone can view contracts" ON public.contracts;
DROP POLICY IF EXISTS "Public read access" ON public.contracts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contracts;

-- Revoke any public permissions that might exist
REVOKE ALL ON public.contracts FROM public;
REVOKE ALL ON public.contracts FROM anon;

-- Ensure the user_id column is NOT NULL for better security
ALTER TABLE public.contracts 
ALTER COLUMN user_id SET NOT NULL;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Enhanced: Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Users can update their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Authenticated users can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Admins can delete contracts" ON public.contracts;

-- Create strict, secure RLS policies
-- 1. SELECT: Only authenticated users can view their own contracts OR admins can view all
CREATE POLICY "Secure: Users can view only their own contracts"
ON public.contracts FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
  AND check_contract_rate_limit(auth.uid())
);

-- 2. INSERT: Only authenticated users can create contracts for themselves
CREATE POLICY "Secure: Users can create their own contracts"
ON public.contracts FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
  AND check_contract_rate_limit(auth.uid())
);

-- 3. UPDATE: Only authenticated users can update their own contracts OR admins
CREATE POLICY "Secure: Users can update their own contracts"
ON public.contracts FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
  AND check_contract_rate_limit(auth.uid())
);

-- 4. DELETE: Only admins can delete contracts
CREATE POLICY "Secure: Only admins can delete contracts"
ON public.contracts FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Explicitly deny anonymous access
CREATE POLICY "Block anonymous access to contracts"
ON public.contracts FOR ALL
USING (auth.uid() IS NOT NULL);

-- Add additional security: Create a function to log contract access attempts
CREATE OR REPLACE FUNCTION public.log_contract_security_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all access attempts to contracts for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'contract_access_attempt',
    auth.uid(),
    TG_OP,
    'contracts',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN auth.uid() IS NULL THEN 'critical'  -- Anonymous access attempt
      WHEN TG_OP = 'SELECT' AND NOT has_role(auth.uid(), 'admin'::app_role) THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'contracts',
      'operation', TG_OP,
      'contract_number', COALESCE(NEW.contract_number, OLD.contract_number),
      'user_authenticated', auth.uid() IS NOT NULL,
      'ip_address', inet_client_addr()::text,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for security logging
DROP TRIGGER IF EXISTS contracts_security_access_trigger ON public.contracts;
CREATE TRIGGER contracts_security_access_trigger
  BEFORE SELECT OR INSERT OR UPDATE OR DELETE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_contract_security_access();

-- Add a view for admins to safely view contract data with masking for non-sensitive access
CREATE OR REPLACE VIEW public.contracts_secure_view AS
SELECT 
  id,
  contract_number,
  client_name,
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN client_email
    ELSE mask_email(client_email, auth.uid())
  END as client_email,
  CASE 
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN client_phone
    ELSE mask_phone(client_phone, auth.uid())
  END as client_phone,
  service_type,
  service_price,
  status,
  created_at,
  user_id
FROM public.contracts
WHERE 
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Grant specific permissions only to authenticated users
GRANT SELECT ON public.contracts_secure_view TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;