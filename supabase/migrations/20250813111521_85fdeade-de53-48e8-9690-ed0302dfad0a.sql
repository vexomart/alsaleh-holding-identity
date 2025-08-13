-- Fix job_applications table security issues
-- Drop existing policies to recreate them with proper restrictions
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can update job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can delete job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Authenticated users can submit job applications" ON public.job_applications;

-- Create more restrictive and secure policies

-- Only authenticated admins can view job applications
CREATE POLICY "Only admins can view job applications" 
ON public.job_applications 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only authenticated admins can update job applications
CREATE POLICY "Only admins can update job applications" 
ON public.job_applications 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only authenticated admins can delete job applications
CREATE POLICY "Only admins can delete job applications" 
ON public.job_applications 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only authenticated users can submit job applications (with rate limiting)
CREATE POLICY "Authenticated users can submit job applications" 
ON public.job_applications 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND check_recent_job_application(email)
);

-- Add additional security audit logging function
CREATE OR REPLACE FUNCTION public.log_job_application_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access attempts to job applications for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'data_access',
    auth.uid(),
    TG_OP,
    'job_applications',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' AND NOT has_role(auth.uid(), 'admin'::app_role) THEN 'high'
      WHEN TG_OP = 'INSERT' THEN 'medium'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'job_applications',
      'operation', TG_OP,
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;