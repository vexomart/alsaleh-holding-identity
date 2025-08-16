-- Fix critical security issue: Restrict subscription plans access
-- This addresses the "Business Pricing Strategy Exposure" vulnerability

-- Drop the current public access policy that allows anonymous users to view subscription plans
DROP POLICY IF EXISTS "Authenticated users can view active subscription plans" ON public.subscription_plans;

-- Create a new secure policy that requires authentication
CREATE POLICY "Secure: Authenticated users can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND (is_active = true)
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
  'security_fix',
  auth.uid(),
  'subscription_plans_access_secured',
  'subscription_plans',
  'critical',
  jsonb_build_object(
    'description', 'Removed public access to subscription plans to prevent business strategy exposure',
    'vulnerability_fixed', 'Business Pricing Strategy Exposure',
    'impact', 'Prevents competitors from accessing pricing information',
    'timestamp', now()
  )
);