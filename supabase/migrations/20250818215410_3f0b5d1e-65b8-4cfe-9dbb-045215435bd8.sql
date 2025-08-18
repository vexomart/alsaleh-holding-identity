-- Comprehensive security fix for all critical data exposure issues
-- This migration will permanently solve the recurring security problems

-- 1. Fix job_applicants table - secure personal data
DROP POLICY IF EXISTS "Admin can manage job applicants" ON job_applicants;
DROP POLICY IF EXISTS "Users can apply for jobs" ON job_applicants;

-- Enable RLS if not already enabled
ALTER TABLE job_applicants ENABLE ROW LEVEL SECURITY;

-- Only admins can view job applicant data
CREATE POLICY "Secure: Only admins can view job applicants"
ON job_applicants
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage job applicant records
CREATE POLICY "Secure: Only admins can manage job applicants"
ON job_applicants
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow public job applications (insert only)
CREATE POLICY "Secure: Anyone can submit job applications"
ON job_applicants
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Fix cms_applications table - secure personal data
DROP POLICY IF EXISTS "Admins can view applications" ON cms_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON cms_applications;

-- Enable RLS
ALTER TABLE cms_applications ENABLE ROW LEVEL SECURITY;

-- Only admins can view applications
CREATE POLICY "Secure: Only admins can view cms applications"
ON cms_applications
FOR SELECT
TO authenticated
USING (has_admin_role(auth.uid()));

-- Only admins can manage applications
CREATE POLICY "Secure: Only admins can manage cms applications"
ON cms_applications
FOR ALL
TO authenticated
USING (has_admin_role(auth.uid()))
WITH CHECK (has_admin_role(auth.uid()));

-- Allow public submissions (insert only)
CREATE POLICY "Secure: Anyone can submit cms applications"
ON cms_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Fix cms_form_submissions table - secure form data
DROP POLICY IF EXISTS "Admins can view submissions" ON cms_form_submissions;
DROP POLICY IF EXISTS "Anyone can submit forms" ON cms_form_submissions;

-- Enable RLS
ALTER TABLE cms_form_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view form submissions
CREATE POLICY "Secure: Only admins can view form submissions"
ON cms_form_submissions
FOR SELECT
TO authenticated
USING (has_admin_role(auth.uid()));

-- Only admins can manage form submissions
CREATE POLICY "Secure: Only admins can manage form submissions"
ON cms_form_submissions
FOR ALL
TO authenticated
USING (has_admin_role(auth.uid()))
WITH CHECK (has_admin_role(auth.uid()));

-- Allow public form submissions (insert only)
CREATE POLICY "Secure: Anyone can submit forms"
ON cms_form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Fix newsletter_subscriptions table - secure email data
DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can subscribe to newsletter" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can view their own newsletter subscription" ON newsletter_subscriptions;

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only admins can view all newsletter subscriptions
CREATE POLICY "Secure: Only admins can view newsletter subscriptions"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage newsletter subscriptions
CREATE POLICY "Secure: Only admins can manage newsletter subscriptions"
ON newsletter_subscriptions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow public newsletter subscriptions (insert only)
CREATE POLICY "Secure: Anyone can subscribe to newsletter"
ON newsletter_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (check_recent_newsletter_subscription(email));

-- Users can view their own subscription only
CREATE POLICY "Secure: Users can view own newsletter subscription"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text
);

-- 5. Add comprehensive audit logging for all sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log all access to sensitive personal data tables
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'sensitive_data_access',
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT (has_role(auth.uid(), 'admin'::app_role) OR has_admin_role(auth.uid())) THEN 'critical'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'medium'
      WHEN TG_OP = 'DELETE' THEN 'high'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'user_role', CASE 
        WHEN has_role(auth.uid(), 'admin'::app_role) THEN 'admin'
        WHEN has_admin_role(auth.uid()) THEN 'cms_admin'
        WHEN auth.uid() IS NOT NULL THEN 'authenticated'
        ELSE 'anonymous'
      END,
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create audit triggers for all sensitive data tables
DROP TRIGGER IF EXISTS job_applicants_audit_log ON job_applicants;
CREATE TRIGGER job_applicants_audit_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON job_applicants
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS cms_applications_audit_log ON cms_applications;
CREATE TRIGGER cms_applications_audit_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON cms_applications
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS cms_form_submissions_audit_log ON cms_form_submissions;
CREATE TRIGGER cms_form_submissions_audit_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON cms_form_submissions
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

DROP TRIGGER IF EXISTS newsletter_subscriptions_audit_log ON newsletter_subscriptions;
CREATE TRIGGER newsletter_subscriptions_audit_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_data_access();

-- 6. Enhanced rate limiting for sensitive operations
CREATE OR REPLACE FUNCTION public.enhanced_sensitive_data_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_identifier TEXT;
  rate_limit_passed BOOLEAN;
BEGIN
  -- Create identifier for rate limiting
  user_identifier := COALESCE(auth.uid()::text, inet_client_addr()::text, 'anonymous');
  
  -- Check rate limits for sensitive data operations
  IF TG_OP = 'INSERT' THEN
    SELECT public.enhanced_rate_limit_check(
      user_identifier,
      TG_TABLE_NAME || '_submit',
      5, -- Max 5 submissions per hour
      60
    ) INTO rate_limit_passed;
    
    IF NOT rate_limit_passed THEN
      -- Log security event
      INSERT INTO public.security_audit_logs (
        event_type,
        user_id,
        action,
        risk_level,
        metadata
      ) VALUES (
        'rate_limit_exceeded',
        auth.uid(),
        TG_TABLE_NAME || '_submission_blocked',
        'high',
        jsonb_build_object(
          'table', TG_TABLE_NAME,
          'user_identifier', user_identifier,
          'blocked_submission', true,
          'timestamp', now()
        )
      );
      
      RAISE EXCEPTION 'Rate limit exceeded for % submissions. Please try again later.', TG_TABLE_NAME;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply rate limiting to all sensitive data tables
DROP TRIGGER IF EXISTS job_applicants_rate_limit ON job_applicants;
CREATE TRIGGER job_applicants_rate_limit
  BEFORE INSERT ON job_applicants
  FOR EACH ROW EXECUTE FUNCTION enhanced_sensitive_data_rate_limit();

DROP TRIGGER IF EXISTS cms_applications_rate_limit ON cms_applications;
CREATE TRIGGER cms_applications_rate_limit
  BEFORE INSERT ON cms_applications
  FOR EACH ROW EXECUTE FUNCTION enhanced_sensitive_data_rate_limit();

DROP TRIGGER IF EXISTS cms_form_submissions_rate_limit ON cms_form_submissions;
CREATE TRIGGER cms_form_submissions_rate_limit
  BEFORE INSERT ON cms_form_submissions
  FOR EACH ROW EXECUTE FUNCTION enhanced_sensitive_data_rate_limit();

DROP TRIGGER IF EXISTS newsletter_subscriptions_rate_limit ON newsletter_subscriptions;
CREATE TRIGGER newsletter_subscriptions_rate_limit
  BEFORE INSERT ON newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION enhanced_sensitive_data_rate_limit();