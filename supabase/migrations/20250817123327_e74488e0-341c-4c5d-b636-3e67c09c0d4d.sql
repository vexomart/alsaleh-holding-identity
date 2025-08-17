-- Update subscription plans RLS policy to require authentication
-- This prevents public access to detailed pricing information

DROP POLICY IF EXISTS "Secure: Authenticated users can view active subscription plans" ON public.subscription_plans;

CREATE POLICY "Enhanced: Authenticated users can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_active = true
);

-- Log this security enhancement
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
  'subscription_plans_access_restricted',
  'subscription_plans',
  'low',
  jsonb_build_object(
    'policy_name', 'Enhanced: Authenticated users can view active subscription plans',
    'change_type', 'access_restriction_added',
    'description', 'Updated RLS policy to require authentication for subscription plans access',
    'timestamp', now()
  )
);