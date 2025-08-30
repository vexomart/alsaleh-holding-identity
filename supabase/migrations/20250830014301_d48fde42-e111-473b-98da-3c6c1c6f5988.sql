-- Fix infinite recursion in ash_users RLS policies
-- First, create a security definer function to check user role safely
CREATE OR REPLACE FUNCTION public.get_current_ash_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.ash_users WHERE id = auth.uid();
$$;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "ash_users_select_own_or_admin" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_update_own_or_admin" ON public.ash_users;

-- Create new policies using the security definer function
CREATE POLICY "ash_users_select_safe" ON public.ash_users
FOR SELECT USING (
  id = auth.uid() OR 
  public.get_current_ash_user_role() IN ('superadmin', 'admin')
);

CREATE POLICY "ash_users_update_safe" ON public.ash_users
FOR UPDATE USING (
  id = auth.uid() OR 
  public.get_current_ash_user_role() IN ('superadmin', 'admin')
);