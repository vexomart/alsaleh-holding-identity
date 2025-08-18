-- Fix admin_users security vulnerabilities with enhanced RLS policies

-- Drop existing policies to recreate them with better security
DROP POLICY IF EXISTS "Admin users: Only owners can manage all users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Users can update themselves only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Users can view and update themselves only" ON admin_users;

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow owners to manage all admin users (highest privilege)
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

-- Policy 2: Allow admin users to view their own record only
CREATE POLICY "Admin users: Can view own record only"
ON admin_users
FOR SELECT
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL AND
  id = get_current_admin_user() AND
  is_active = true
);

-- Policy 3: Allow admin users to update their own record (limited fields)
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

-- Policy 4: Only owners can create new admin users
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

-- Policy 5: Only owners can delete admin users
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

-- Create audit trigger for admin_users table access (only for DML operations)
CREATE OR REPLACE FUNCTION public.log_admin_users_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Log access to admin users table for security monitoring
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
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN 'high'
      WHEN TG_OP = 'DELETE' THEN 'critical'
      ELSE 'medium'
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

-- Create trigger for admin_users access logging (INSERT, UPDATE, DELETE only)
DROP TRIGGER IF EXISTS admin_users_access_log ON admin_users;
CREATE TRIGGER admin_users_access_log
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION log_admin_users_access();

-- Add security function to validate admin access patterns
CREATE OR REPLACE FUNCTION public.validate_admin_access(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  current_admin_id uuid;
  current_admin_role user_role;
  target_admin_role user_role;
BEGIN
  current_admin_id := get_current_admin_user();
  
  -- Deny access if no valid admin session
  IF current_admin_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get current admin role
  SELECT role INTO current_admin_role
  FROM admin_users
  WHERE id = current_admin_id AND is_active = true;
  
  -- Get target user role
  SELECT role INTO target_admin_role
  FROM admin_users
  WHERE id = target_user_id;
  
  -- Owners can access everything
  IF current_admin_role = 'owner'::user_role THEN
    RETURN true;
  END IF;
  
  -- Admins and editors can only access their own records
  IF current_admin_id = target_user_id THEN
    RETURN true;
  END IF;
  
  -- Deny all other access
  RETURN false;
END;
$$;