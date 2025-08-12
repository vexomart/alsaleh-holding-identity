-- Fix function search path security warnings
-- Update the newly created functions to have proper search paths

-- Fix check_recent_job_application function
CREATE OR REPLACE FUNCTION public.check_recent_job_application(applicant_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.job_applications 
    WHERE email = applicant_email 
    AND created_at > NOW() - INTERVAL '24 hours'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix check_recent_newsletter_subscription function  
CREATE OR REPLACE FUNCTION public.check_recent_newsletter_subscription(subscriber_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.newsletter_subscriptions 
    WHERE email = subscriber_email 
    AND subscribed_at > NOW() - INTERVAL '1 hour'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';