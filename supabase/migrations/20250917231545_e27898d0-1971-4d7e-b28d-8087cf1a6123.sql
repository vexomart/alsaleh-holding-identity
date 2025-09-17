-- Enable RLS on tables that are missing it
ALTER TABLE public.profiles_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for profiles_backup table
-- Since this is a backup table, only admins should access it
CREATE POLICY "Only admins can access profiles backup"
ON public.profiles_backup
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policies for sites table  
-- Sites should be publicly readable but only admins can modify
CREATE POLICY "Sites are publicly readable"
ON public.sites
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Only admins can manage sites"
ON public.sites
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));