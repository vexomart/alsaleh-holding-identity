-- CRITICAL SECURITY FIX: Remove anonymous access to job applications
-- This prevents data theft of applicant personal information

-- First, drop the existing insecure INSERT policy that allows anonymous submissions
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;

-- Create secure INSERT policy that requires authentication
CREATE POLICY "Authenticated users can submit job applications"
ON public.job_applications
FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure user is authenticated and spam protection is active
  auth.uid() IS NOT NULL 
  AND check_recent_job_application(email)
);

-- Verify SELECT policy is secure (should already exist but double-check)
-- This ensures only admins can view job applications
DO $$
BEGIN
  -- Check if the admin SELECT policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'job_applications' 
    AND policyname = 'Admins can view all job applications'
    AND cmd = 'SELECT'
  ) THEN
    -- Create the policy if it doesn't exist
    CREATE POLICY "Admins can view all job applications"
    ON public.job_applications
    FOR SELECT
    TO authenticated
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;