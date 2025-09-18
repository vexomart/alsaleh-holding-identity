-- Fix RLS for application_counters table which was missing policies
ALTER TABLE public.application_counters ENABLE ROW LEVEL SECURITY;

-- Only service role and database functions should access counters
CREATE POLICY "Service role can manage application counters" 
ON public.application_counters 
FOR ALL 
USING (
  ((auth.jwt() ->> 'role'::text) = 'service_role'::text) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Functions can access application counters" 
ON public.application_counters 
FOR ALL 
USING (true) 
WITH CHECK (true);