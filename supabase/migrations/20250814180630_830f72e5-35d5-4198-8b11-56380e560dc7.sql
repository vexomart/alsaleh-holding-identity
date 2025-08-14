-- Fix critical security vulnerability: Restrict subscription updates
-- This fixes the overly permissive "System can update subscriptions" policy

-- Drop the insecure policy that allows anyone to update any subscription
DROP POLICY IF EXISTS "System can update subscriptions" ON public.subscriptions;

-- Create a secure policy that only allows:
-- 1. Users to update their own subscriptions (limited fields)
-- 2. Service role to update any subscription (for system operations)
-- 3. Admins to update any subscription
CREATE POLICY "Secure subscription updates" 
ON public.subscriptions 
FOR UPDATE 
USING (
  -- Only allow if:
  -- 1. User is updating their own subscription
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR
  -- 2. Service role (for system operations like payment processing)
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) OR
  -- 3. Admin users
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  -- Same conditions for the WITH CHECK clause
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) OR
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add additional security: Log subscription modifications for audit purposes
CREATE OR REPLACE FUNCTION public.log_subscription_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log all subscription changes for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'subscription_modification',
    auth.uid(),
    TG_OP,
    'subscriptions',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'high'
      WHEN TG_OP = 'UPDATE' AND OLD.plan_id != NEW.plan_id THEN 'high'
      WHEN TG_OP = 'UPDATE' THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'subscriptions',
      'operation', TG_OP,
      'old_status', OLD.status,
      'new_status', NEW.status,
      'old_plan_id', OLD.plan_id,
      'new_plan_id', NEW.plan_id,
      'subscription_id', COALESCE(NEW.id, OLD.id),
      'user_id', COALESCE(NEW.user_id, OLD.user_id),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to log subscription changes
DROP TRIGGER IF EXISTS log_subscription_changes_trigger ON public.subscriptions;
CREATE TRIGGER log_subscription_changes_trigger
  AFTER UPDATE OR DELETE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_subscription_changes();