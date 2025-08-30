-- Check existing policies and recreate them properly
SELECT schemaname, tablename, policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'ash_users';

-- Drop all existing policies on ash_users
DROP POLICY IF EXISTS "ash_users_select_admin_or_own" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_update_admin_or_own" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_insert_public" ON public.ash_users;

-- Create new working policies
CREATE POLICY "ash_users_admin_full_access" ON public.ash_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "ash_users_own_access" ON public.ash_users
FOR ALL USING (id = auth.uid());

CREATE POLICY "ash_users_public_insert" ON public.ash_users
FOR INSERT WITH CHECK (true);