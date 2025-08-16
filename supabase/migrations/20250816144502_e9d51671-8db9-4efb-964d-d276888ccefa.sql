-- Critical Security Fix for Contracts Table
-- Handle existing NULL user_id values and implement security

-- First, check and fix existing contracts with NULL user_id
-- For security, we'll create a system admin user or mark them for review
UPDATE public.contracts 
SET user_id = (
  SELECT user_id 
  FROM public.user_roles 
  WHERE role = 'admin'::app_role 
  LIMIT 1
)
WHERE user_id IS NULL;

-- If no admin exists, we need to handle this differently
-- Create a function to get system user
CREATE OR REPLACE FUNCTION public.get_system_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT user_id 
  FROM public.user_roles 
  WHERE role = 'admin'::app_role 
  LIMIT 1;
$$;

-- Update any remaining NULL user_id contracts (fallback)
UPDATE public.contracts 
SET user_id = COALESCE(
  public.get_system_user_id(),
  '00000000-0000-0000-0000-000000000000'::uuid
)
WHERE user_id IS NULL;

-- Now ensure RLS is enabled on contracts table
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Revoke any public permissions that might exist
REVOKE ALL ON public.contracts FROM public;
REVOKE ALL ON public.contracts FROM anon;

-- Now set user_id as NOT NULL since we've handled existing NULLs
ALTER TABLE public.contracts 
ALTER COLUMN user_id SET NOT NULL;

-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Enhanced: Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Users can update their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Authenticated users can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Enhanced: Admins can delete contracts" ON public.contracts;
DROP POLICY IF EXISTS "Admins can delete contracts" ON public.contracts;

-- Create strict, secure RLS policies that block ALL anonymous access

-- 1. SELECT: Only authenticated users can view their own contracts OR admins can view all
CREATE POLICY "Secure: Users can view only their own contracts"
ON public.contracts FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- 2. INSERT: Only authenticated users can create contracts for themselves
CREATE POLICY "Secure: Users can create their own contracts"
ON public.contracts FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
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
);

-- 4. DELETE: Only admins can delete contracts
CREATE POLICY "Secure: Only admins can delete contracts"
ON public.contracts FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Create a secure view for contracts with data masking
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

-- Ensure RLS is properly configured
ALTER VIEW public.contracts_secure_view SET (security_barrier = true);

-- Add comment to indicate this is a security fix
COMMENT ON TABLE public.contracts IS 'Contains sensitive customer contract data. Access restricted by RLS policies.';
COMMENT ON VIEW public.contracts_secure_view IS 'Secure view with data masking for non-admin users.';

-- Log this critical security update
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  resource_type,
  risk_level,
  metadata
) VALUES (
  'security_policy_update',
  auth.uid(),
  'contracts_table_secured',
  'contracts',
  'critical',
  jsonb_build_object(
    'description', 'Implemented RLS policies to fix public data exposure vulnerability',
    'policies_created', 4,
    'anonymous_access_blocked', true,
    'data_masking_enabled', true,
    'timestamp', now()
  )
);