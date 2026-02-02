-- STRICT FIX: remove all legacy/public policies on entities that are still causing recursion
DROP POLICY IF EXISTS "Admins can manage all entities" ON public.entities;
DROP POLICY IF EXISTS "Owners can update their entities" ON public.entities;
DROP POLICY IF EXISTS "Users can create entities" ON public.entities;
DROP POLICY IF EXISTS "Users can view their own entities" ON public.entities;

-- Re-create admin manage policy safely (no recursion) and limit to authenticated role
CREATE POLICY "entity_admin_all"
ON public.entities
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid(), tenant_id))
WITH CHECK (public.is_admin(auth.uid(), tenant_id));
