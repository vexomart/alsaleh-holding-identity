-- Create storage bucket for CVs/Resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  false,
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- RLS policy: Anyone can upload CVs (for job applications)
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'cvs');

-- RLS policy: Only authenticated admins can view CVs
CREATE POLICY "Admins can view CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cvs');

-- RLS policy: Admins can delete CVs
CREATE POLICY "Admins can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cvs');