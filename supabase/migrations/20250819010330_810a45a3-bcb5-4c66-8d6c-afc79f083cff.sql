-- Create function to validate admin session with correct parameter name
CREATE OR REPLACE FUNCTION public.validate_admin_session(session_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_entry RECORD;
  admin_profile RECORD;
  result JSONB;
BEGIN
  -- Find the session in audit logs
  SELECT * INTO log_entry
  FROM public.security_audit_logs
  WHERE event_type = 'admin_login_success'
  AND metadata->>'session_id' = session_id
  AND created_at > now() - INTERVAL '24 hours'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Session not found or expired');
  END IF;
  
  -- Verify admin is still active
  SELECT * INTO admin_profile
  FROM public.admin_profiles
  WHERE user_id = log_entry.user_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Admin user is inactive');
  END IF;
  
  result := jsonb_build_object(
    'valid', true,
    'user', jsonb_build_object(
      'id', admin_profile.user_id,
      'full_name', admin_profile.full_name,
      'role', admin_profile.role,
      'department', admin_profile.department
    )
  );
  
  RETURN result;
END;
$$;