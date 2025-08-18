-- Create a function to get current admin user from session
CREATE OR REPLACE FUNCTION get_current_admin_user()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_token TEXT;
  admin_user_id UUID;
BEGIN
  -- Get session token from headers (will be set by application)
  session_token := current_setting('request.headers', true)::json->>'x-admin-session';
  
  IF session_token IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check if session is valid and not expired
  SELECT admin_sessions.admin_user_id INTO admin_user_id
  FROM admin_sessions
  WHERE admin_sessions.session_token = get_current_admin_user.session_token
    AND admin_sessions.expires_at > NOW();
  
  RETURN admin_user_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Update RLS policies for admin_users table to be more secure
DROP POLICY IF EXISTS "Admins can manage users" ON admin_users;
DROP POLICY IF EXISTS "Users can view themselves" ON admin_users;
DROP POLICY IF EXISTS "Users can update themselves" ON admin_users;

-- Create more secure policies
CREATE POLICY "Admin users: Only owners can manage all users" 
ON admin_users FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
    AND au.role = 'owner' 
    AND au.is_active = true
  )
);

CREATE POLICY "Admin users: Users can view and update themselves only" 
ON admin_users FOR SELECT 
USING (id = get_current_admin_user());

CREATE POLICY "Admin users: Users can update themselves only" 
ON admin_users FOR UPDATE 
USING (id = get_current_admin_user())
WITH CHECK (id = get_current_admin_user());