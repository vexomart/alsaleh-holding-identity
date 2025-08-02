-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  position TEXT NOT NULL,
  experience TEXT,
  education TEXT,
  cover_letter TEXT,
  cv_file_name TEXT,
  cv_file_size INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert job applications (public form)
CREATE POLICY "Anyone can submit job applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();