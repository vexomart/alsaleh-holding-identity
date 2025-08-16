-- Fix critical security vulnerability in automation_usage table
-- Replace overly permissive INSERT policy with secure authentication checks

-- Drop the insecure policy that allows anyone to insert records
DROP POLICY IF EXISTS "System can insert usage records" ON public.automation_usage;

-- Create a secure INSERT policy that only allows:
-- 1. Service role (for system operations)
-- 2. Admin users (for management)
-- 3. Authenticated users inserting their own records
CREATE POLICY "Secure: Only authenticated service/admin can insert usage records"
ON public.automation_usage FOR INSERT 
WITH CHECK (
  -- Allow service role (for automated systems)
  (auth.jwt() ->> 'role')::text = 'service_role'
  OR
  -- Allow admin users
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Allow authenticated users to insert their own records only
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- Add validation policy to ensure user_id matches authenticated user for non-service operations
CREATE POLICY "Secure: Validate user_id for non-service operations"
ON public.automation_usage FOR INSERT 
WITH CHECK (
  -- If not service role, user_id must match authenticated user
  CASE 
    WHEN (auth.jwt() ->> 'role')::text = 'service_role' THEN true
    WHEN has_role(auth.uid(), 'admin'::app_role) THEN true
    ELSE (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  END
);

-- Log this critical security fix
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
  'automation_usage_table_secured',
  'automation_usage',
  'critical',
  jsonb_build_object(
    'description', 'Fixed critical vulnerability: replaced permissive INSERT policy with secure authentication checks',
    'vulnerability_fixed', 'System Can Insert Fake Usage Records Without Authentication',
    'policies_updated', 2,
    'anonymous_access_blocked', true,
    'timestamp', now()
  )
);