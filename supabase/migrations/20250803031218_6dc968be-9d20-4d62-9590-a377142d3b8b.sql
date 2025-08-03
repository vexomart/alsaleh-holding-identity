-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Create policies for CV uploads
CREATE POLICY "Anyone can upload CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Anyone can view their own CVs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cvs');