-- COMPREHENSIVE SECURITY FIX: Phase 1 - Critical Data Protection  
-- Fix newsletter email enumeration and enhance security logging

-- 1. SECURE NEWSLETTER SUBSCRIPTIONS
-- Remove the insecure policy that allows email enumeration
DROP POLICY IF EXISTS "Users can view their own subscription by email" ON public.newsletter_subscriptions;

-- Create secure admin-only SELECT policy for newsletter subscriptions
CREATE POLICY "Admins can view all newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for users to manage their own subscription status
CREATE POLICY "Users can view their own newsletter subscription"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- 2. ENHANCE SECURITY AUDIT LOGGING
-- Add new security event types for better monitoring
UPDATE public.user_activity_logs 
SET activity_type = activity_type 
WHERE activity_type IN ('file_upload', 'sensitive_data_access', 'admin_action', 'contract_creation');

-- 3. ADD RATE LIMITING PROTECTION
-- Create table for tracking rate limits
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- Can be IP, user_id, email, etc.
  action_type text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit data
CREATE POLICY "Admins can manage rate limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action_type text,
  p_limit integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count for this identifier and action
  SELECT count INTO current_count
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND action_type = p_action_type
    AND window_start >= window_start_time;
  
  -- If no record exists, create one
  IF current_count IS NULL THEN
    INSERT INTO public.rate_limits (identifier, action_type, count, window_start)
    VALUES (p_identifier, p_action_type, 1, now())
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET count = 1, window_start = now();
    RETURN true;
  END IF;
  
  -- Check if under limit
  IF current_count < p_limit THEN
    -- Increment counter
    UPDATE public.rate_limits 
    SET count = count + 1
    WHERE identifier = p_identifier AND action_type = p_action_type;
    RETURN true;
  END IF;
  
  -- Over limit
  RETURN false;
END;
$$;