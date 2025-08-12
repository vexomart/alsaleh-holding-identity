-- Fix critical security vulnerabilities in RLS policies
-- This migration addresses multiple security issues identified in the security review

-- 1. Fix contracts table security - Add user_id and proper RLS policies
ALTER TABLE public.contracts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing insecure contracts policies that allow public access
DROP POLICY IF EXISTS "Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Anyone can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can update their own contracts" ON public.contracts;

-- Create secure contracts policies
CREATE POLICY "Users can view their own contracts" ON public.contracts
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authenticated users can create contracts" ON public.contracts
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own contracts" ON public.contracts
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete contracts" ON public.contracts
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix job_applications table security - Restrict access to admins only
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;

CREATE POLICY "Anyone can submit job applications" ON public.job_applications
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all job applications" ON public.job_applications
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update job applications" ON public.job_applications
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete job applications" ON public.job_applications
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix newsletter_subscriptions table security - Restrict public access
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.newsletter_subscriptions;

CREATE POLICY "Users can view their own subscription by email" ON public.newsletter_subscriptions
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- 4. Add performance indexes for the new user_id associations
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON public.newsletter_subscriptions(email);

-- 5. Update existing contracts to be associated with a system user (if any exist)
-- Note: In production, you may want to review and properly assign these to actual users
-- For now, we'll leave them as NULL which will only be accessible by admins