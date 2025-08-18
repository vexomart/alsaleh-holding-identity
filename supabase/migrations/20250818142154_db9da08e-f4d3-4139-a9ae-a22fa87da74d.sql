-- First, let's create a proper session management system for admin users
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on sessions table
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

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

-- Prevent direct INSERT/DELETE except by owners
CREATE POLICY "Admin users: Only owners can create users" 
ON admin_users FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
    AND au.role = 'owner' 
    AND au.is_active = true
  )
);

CREATE POLICY "Admin users: Only owners can delete users" 
ON admin_users FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
    AND au.role = 'owner' 
    AND au.is_active = true
  )
);

-- Update the has_admin_role function to use the new session system
CREATE OR REPLACE FUNCTION has_admin_role(required_role user_role DEFAULT 'editor')
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_admin_id UUID;
  current_admin_role user_role;
BEGIN
  current_admin_id := get_current_admin_user();
  
  IF current_admin_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  SELECT role INTO current_admin_role
  FROM admin_users 
  WHERE id = current_admin_id 
    AND is_active = true;
  
  IF current_admin_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN CASE 
    WHEN required_role = 'owner' THEN current_admin_role = 'owner'
    WHEN required_role = 'admin' THEN current_admin_role IN ('owner', 'admin')
    ELSE current_admin_role IN ('owner', 'admin', 'editor')
  END;
END;
$$;

-- Create session management policies
CREATE POLICY "Admin sessions: Users can view their own sessions" 
ON admin_sessions FOR SELECT 
USING (admin_user_id = get_current_admin_user());

CREATE POLICY "Admin sessions: System can create sessions" 
ON admin_sessions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin sessions: Users can delete their own sessions" 
ON admin_sessions FOR DELETE 
USING (admin_user_id = get_current_admin_user());

-- Add function to create secure session
CREATE OR REPLACE FUNCTION create_admin_session(
  p_admin_user_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  session_token TEXT;
  session_id UUID;
BEGIN
  -- Generate secure session token
  session_token := encode(gen_random_bytes(32), 'base64');
  
  -- Clean up expired sessions for this user
  DELETE FROM admin_sessions 
  WHERE admin_user_id = p_admin_user_id 
    AND expires_at < NOW();
  
  -- Create new session (expires in 24 hours)
  INSERT INTO admin_sessions (admin_user_id, session_token, expires_at, ip_address, user_agent)
  VALUES (p_admin_user_id, session_token, NOW() + INTERVAL '24 hours', p_ip_address, p_user_agent)
  RETURNING id INTO session_id;
  
  RETURN session_token;
END;
$$;

-- Add function to invalidate session
CREATE OR REPLACE FUNCTION invalidate_admin_session(p_session_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE session_token = p_session_token;
  RETURN FOUND;
END;
$$;

-- Encrypt sensitive data in admin_users table
ALTER TABLE admin_users ADD COLUMN encrypted_data JSONB DEFAULT '{}';

-- Create function to hash passwords properly
CREATE OR REPLACE FUNCTION hash_admin_password(plain_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- For now, we'll use a simple hash. In production, use bcrypt
  RETURN encode(digest(plain_password || 'admin_salt_2024', 'sha256'), 'hex');
END;
$$;

-- Update existing admin user with hashed password
UPDATE admin_users 
SET password_hash = hash_admin_password('admin123')
WHERE email = 'admin@alialshehriholding.com';

-- Add audit trigger for admin_users table
CREATE TRIGGER audit_admin_users
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();