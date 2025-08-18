-- Fix admin_users security vulnerabilities with enhanced RLS policies

-- Drop existing policies to recreate them with better security
DROP POLICY IF EXISTS "Admin users: Only owners can manage all users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Users can update themselves only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Users can view and update themselves only" ON admin_users;

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Explicit denial for unauthenticated users
CREATE POLICY "Admin users: Deny access to unauthenticated users"
ON admin_users
FOR ALL
USING (false)
WITH CHECK (false);

-- Policy 2: Allow owners to manage all admin users (highest privilege)
CREATE POLICY "Admin users: Owners can manage all users"
ON admin_users
FOR ALL
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.id = get_current_admin_user()
    AND au.role = 'owner'::user_role
    AND au.is_active = true
  )
)
WITH CHECK (
  get_current_admin_user() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.id = get_current_admin_user()
    AND au.role = 'owner'::user_role
    AND au.is_active = true
  )
);

-- Policy 3: Allow admin users to view their own record only
CREATE POLICY "Admin users: Can view own record only"
ON admin_users
FOR SELECT
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL AND
  id = get_current_admin_user() AND
  is_active = true
);

-- Policy 4: Allow admin users to update their own record (limited fields)
CREATE POLICY "Admin users: Can update own record"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL AND
  id = get_current_admin_user() AND
  is_active = true
)
WITH CHECK (
  get_current_admin_user() IS NOT NULL AND
  id = get_current_admin_user() AND
  is_active = true
);

-- Policy 5: Explicit denial for INSERT and DELETE by non-owners
CREATE POLICY "Admin users: Only owners can create users"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  get_current_admin_user() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.id = get_current_admin_user()
    AND au.role = 'owner'::user_role
    AND au.is_active = true
  )
);

CREATE POLICY "Admin users: Only owners can delete users"
ON admin_users
FOR DELETE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.id = get_current_admin_user()
    AND au.role = 'owner'::user_role
    AND au.is_active = true
  )
);

-- Add security function to mask sensitive data for non-owner access
CREATE OR REPLACE FUNCTION public.mask_admin_user_data(requesting_user_id uuid, target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  is_owner boolean := false;
BEGIN
  -- Check if requesting user is owner
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = requesting_user_id
    AND role = 'owner'::user_role
    AND is_active = true
  ) INTO is_owner;
  
  -- Owners can see everything, others can only see their own data
  RETURN is_owner OR (requesting_user_id = target_user_id);
END;
$$;

-- Create audit trigger for admin_users table access
CREATE OR REPLACE FUNCTION public.log_admin_users_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log all access to admin users table for security monitoring
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'admin_data_access',
    get_current_admin_user(),
    TG_OP,
    'admin_users',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'SELECT' THEN 'medium'
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'admin_users',
      'operation', TG_OP,
      'target_email', COALESCE(NEW.email, OLD.email),
      'target_role', COALESCE(NEW.role, OLD.role),
      'accessing_user', get_current_admin_user(),
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for admin_users access logging
DROP TRIGGER IF EXISTS admin_users_access_log ON admin_users;
CREATE TRIGGER admin_users_access_log
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION log_admin_users_access();