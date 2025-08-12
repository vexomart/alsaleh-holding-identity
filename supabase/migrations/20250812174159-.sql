-- Fix remaining security vulnerabilities identified in security scan
-- Address system-wide access policies that could be exploited

-- 1. Fix invoice_counters table - restrict to service role only
DROP POLICY IF EXISTS "System can manage invoice counters" ON public.invoice_counters;

CREATE POLICY "Service role can manage invoice counters" ON public.invoice_counters
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 2. Fix payment_history table - restrict insert to authenticated users and service role
DROP POLICY IF EXISTS "System can insert payment history" ON public.payment_history;

CREATE POLICY "Authenticated users can insert payment history" ON public.payment_history
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL OR 
  auth.jwt() ->> 'role' = 'service_role' OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Fix user_activity_logs table - restrict insert to authenticated users and service role
DROP POLICY IF EXISTS "System can insert activity logs" ON public.user_activity_logs;

CREATE POLICY "Authenticated users can insert activity logs" ON public.user_activity_logs
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL OR 
  auth.jwt() ->> 'role' = 'service_role' OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Fix invoices table - restrict system operations to service role
DROP POLICY IF EXISTS "System can insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "System can update invoices" ON public.invoices;

CREATE POLICY "Authenticated users can create invoices" ON public.invoices
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'role' = 'service_role' OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authenticated users can update invoices" ON public.invoices
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.jwt() ->> 'role' = 'service_role' OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 5. Add basic spam protection for job applications with time-based restriction
-- Note: Full rate limiting would require application-level implementation
-- This adds a database-level constraint to prevent rapid successive submissions

-- Create a function to check recent submissions by email
CREATE OR REPLACE FUNCTION public.check_recent_job_application(applicant_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.job_applications 
    WHERE email = applicant_email 
    AND created_at > NOW() - INTERVAL '24 hours'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update job applications policy to include spam protection
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;

CREATE POLICY "Anyone can submit job applications" ON public.job_applications
FOR INSERT 
WITH CHECK (
  -- Allow if no recent application from same email
  public.check_recent_job_application(email)
);

-- 6. Add similar protection for newsletter subscriptions
CREATE OR REPLACE FUNCTION public.check_recent_newsletter_subscription(subscriber_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscriptions 
    WHERE email = subscriber_email 
    AND subscribed_at > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions
FOR INSERT 
WITH CHECK (
  public.check_recent_newsletter_subscription(email)
);