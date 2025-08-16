-- Fix security vulnerability: Remove access to NULL user_id subscriptions
-- This prevents unauthorized users from viewing payment data

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can view subscriptions" ON public.subscriptions;

-- Create a secure policy that only allows:
-- 1. Users to view their own subscriptions (user_id = auth.uid())
-- 2. Admins to view all subscriptions
CREATE POLICY "Secure: Users can view their own subscriptions only" 
ON public.subscriptions 
FOR SELECT 
USING (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Also update the INSERT policy to ensure user_id cannot be NULL for regular users
DROP POLICY IF EXISTS "Users can create subscriptions" ON public.subscriptions;

CREATE POLICY "Secure: Users can create their own subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id AND auth.uid() IS NOT NULL) 
  OR has_role(auth.uid(), 'admin'::app_role)
);