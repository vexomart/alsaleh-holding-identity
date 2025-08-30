-- Fix RLS policies for ash_users to allow admin access properly
-- Drop existing policies
DROP POLICY IF EXISTS "ash_users_select_safe" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_update_safe" ON public.ash_users;

-- Create a simpler approach using existing user_roles table
CREATE POLICY "ash_users_select_admin_or_own" ON public.ash_users
FOR SELECT USING (
  id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "ash_users_update_admin_or_own" ON public.ash_users
FOR UPDATE USING (
  id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);