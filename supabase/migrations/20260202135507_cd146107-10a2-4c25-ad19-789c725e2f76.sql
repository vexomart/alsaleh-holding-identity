-- Drop all existing policies on entities table to fix infinite recursion
DROP POLICY IF EXISTS "Users can view own entities" ON public.entities;
DROP POLICY IF EXISTS "Users can insert own entities" ON public.entities;
DROP POLICY IF EXISTS "Users can update own entities" ON public.entities;
DROP POLICY IF EXISTS "Users can delete own entities" ON public.entities;
DROP POLICY IF EXISTS "Entity owners can view" ON public.entities;
DROP POLICY IF EXISTS "Entity owners can insert" ON public.entities;
DROP POLICY IF EXISTS "Entity owners can update" ON public.entities;
DROP POLICY IF EXISTS "Entity members can view" ON public.entities;

-- Create simple, non-recursive RLS policies for entities
CREATE POLICY "entity_select_owner"
ON public.entities
FOR SELECT
TO authenticated
USING (owner_user_id = auth.uid());

CREATE POLICY "entity_insert_owner"
ON public.entities
FOR INSERT
TO authenticated
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "entity_update_owner"
ON public.entities
FOR UPDATE
TO authenticated
USING (owner_user_id = auth.uid())
WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "entity_delete_owner"
ON public.entities
FOR DELETE
TO authenticated
USING (owner_user_id = auth.uid());