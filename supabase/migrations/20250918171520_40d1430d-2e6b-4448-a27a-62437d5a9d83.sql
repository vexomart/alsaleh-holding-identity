-- Fix infinite recursion in RLS for application_counters
DROP POLICY IF EXISTS "Functions can access application counters" ON public.application_counters;

-- Remove the second policy that was causing conflict
-- Keep only the service role policy for application_counters