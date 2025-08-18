-- Create missing helper functions for admin authentication

-- Create function to verify admin password (simple comparison for now)
CREATE OR REPLACE FUNCTION public.verify_admin_password(plain_password text, stored_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- For now, simple comparison (will use proper hashing later)
  RETURN plain_password = stored_password;
END;
$$;

-- Create function to create admin session
CREATE OR REPLACE FUNCTION public.create_admin_session(admin_user_id uuid, user_ip inet DEFAULT NULL, user_agent text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  session_token TEXT;
BEGIN
  -- Generate a simple session token (in production, use proper JWT or secure token)
  session_token := 'admin_' || admin_user_id::text || '_' || extract(epoch from now())::text;
  
  -- Insert session record
  INSERT INTO admin_sessions (admin_user_id, session_token, expires_at, ip_address, user_agent)
  VALUES (admin_user_id, session_token, now() + interval '24 hours', user_ip, user_agent);
  
  RETURN session_token;
END;
$$;