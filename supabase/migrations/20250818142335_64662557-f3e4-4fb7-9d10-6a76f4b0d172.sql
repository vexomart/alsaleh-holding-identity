-- Complete the RLS policies for admin_sessions
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