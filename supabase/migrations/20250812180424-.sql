-- COMPREHENSIVE SECURITY FIX: Phase 1 - Critical Data Protection
-- Fix newsletter email enumeration and secure file uploads

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

-- 2. SECURE FILE UPLOADS (CVS BUCKET)
-- Create secure policies for the CVs storage bucket
-- Note: These policies work on storage.objects table

-- Remove any existing insecure policies on CVs bucket
DELETE FROM storage.policies WHERE bucket_id = 'cvs';

-- Allow authenticated users to upload their own CVs only
INSERT INTO storage.policies (bucket_id, name, definition, check_definition)
VALUES (
  'cvs',
  'Authenticated users can upload CVs to their own folder',
  '(bucket_id = ''cvs''::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = auth.uid()::text)',
  '(bucket_id = ''cvs''::text) AND (auth.uid() IS NOT NULL) AND ((storage.foldername(name))[1] = auth.uid()::text)'
);

-- Allow users to read their own CVs and admins to read all CVs
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'cvs',
  'Users can view their own CVs, admins can view all',
  '(bucket_id = ''cvs''::text) AND (auth.uid() IS NOT NULL) AND (((storage.foldername(name))[1] = auth.uid()::text) OR has_role(auth.uid(), ''admin''::app_role))'
);

-- Allow users to update their own CVs and admins to update all CVs
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'cvs',
  'Users can update their own CVs, admins can update all',
  '(bucket_id = ''cvs''::text) AND (auth.uid() IS NOT NULL) AND (((storage.foldername(name))[1] = auth.uid()::text) OR has_role(auth.uid(), ''admin''::app_role))'
);

-- Allow users to delete their own CVs and admins to delete all CVs
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'cvs',
  'Users can delete their own CVs, admins can delete all',
  '(bucket_id = ''cvs''::text) AND (auth.uid() IS NOT NULL) AND (((storage.foldername(name))[1] = auth.uid()::text) OR has_role(auth.uid(), ''admin''::app_role))'
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