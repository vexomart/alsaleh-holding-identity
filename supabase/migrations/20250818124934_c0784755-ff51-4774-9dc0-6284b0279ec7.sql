-- Fix critical security vulnerability: Remove overly permissive system_settings access policy
-- This policy allowed any authenticated user to view system configuration data

-- Drop the dangerous policy that allows all users to view system settings
DROP POLICY IF EXISTS "Users can view system settings" ON public.system_settings;

-- The admin-only policy already exists and is secure:
-- "Admin can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role))

-- Add a more restrictive policy for read-only access to non-sensitive settings if needed
-- (This is commented out for now - only admins should have access to system settings)
-- CREATE POLICY "Users can view public system settings" ON public.system_settings 
-- FOR SELECT TO authenticated 
-- USING (has_role(auth.uid(), 'admin'::app_role) OR category = 'public');

-- Log this security fix in the audit logs for tracking
INSERT INTO public.security_audit_logs (
  event_type,
  action,
  risk_level,
  metadata
) VALUES (
  'security_policy_update',
  'removed_overly_permissive_system_settings_policy',
  'critical',
  jsonb_build_object(
    'description', 'Removed policy allowing all users to view system settings',
    'fixed_policy', 'Users can view system settings',
    'security_impact', 'Prevented exposure of sensitive system configuration',
    'timestamp', now()
  )
);