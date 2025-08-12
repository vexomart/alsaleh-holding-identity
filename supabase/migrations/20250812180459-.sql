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

-- 2. SECURE FILE UPLOADS (CVS BUCKET) - Using RLS on storage.objects
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create secure policies for CV uploads
CREATE POLICY "Authenticated users can upload CVs to their own folder"
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'cvs' 
  AND auth.uid() IS NOT NULL 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own CVs, admins can view all"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs' 
  AND auth.uid() IS NOT NULL 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can update their own CVs, admins can update all"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cvs' 
  AND auth.uid() IS NOT NULL 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Users can delete their own CVs, admins can delete all"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'cvs' 
  AND auth.uid() IS NOT NULL 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- 3. ENHANCE SECURITY LOGGING
-- Add file upload activity logging trigger
CREATE OR REPLACE FUNCTION public.log_file_upload_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log file upload activity
  INSERT INTO public.user_activity_logs (
    user_id,
    activity_type,
    description,
    metadata
  ) VALUES (
    auth.uid(),
    'file_upload',
    'File uploaded to storage',
    jsonb_build_object(
      'bucket_id', NEW.bucket_id,
      'file_name', NEW.name,
      'file_size', NEW.metadata->>'size',
      'content_type', NEW.metadata->>'mimetype'
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for file upload logging
DROP TRIGGER IF EXISTS log_file_uploads ON storage.objects;
CREATE TRIGGER log_file_uploads
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.log_file_upload_activity();