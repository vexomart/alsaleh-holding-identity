-- Debug the admin_login function by adding better error handling
CREATE OR REPLACE FUNCTION public.admin_login(user_email text, user_password text, user_ip inet DEFAULT NULL, user_agent text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_user_record RECORD;
  session_token TEXT;
  result JSON;
BEGIN
  -- Check if user exists and is active
  SELECT * INTO admin_user_record
  FROM admin_users
  WHERE email = user_email 
    AND is_active = true;
  
  -- If user not found
  IF admin_user_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'المستخدم غير موجود أو غير مفعل'
    );
  END IF;
  
  -- Verify password using our verification function
  IF NOT verify_admin_password(user_password, admin_user_record.password_hash) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'كلمة المرور غير صحيحة'
    );
  END IF;
  
  -- Update last login
  UPDATE admin_users 
  SET last_login_at = NOW()
  WHERE id = admin_user_record.id;
  
  -- Create session
  SELECT create_admin_session(admin_user_record.id, user_ip, user_agent) INTO session_token;
  
  -- Log successful login
  INSERT INTO cms_audit_log (actor_id, action, target_table, target_id, ip_address, user_agent)
  VALUES (admin_user_record.id, 'login', 'admin_users', admin_user_record.id, user_ip, user_agent);
  
  -- Return success with user data
  RETURN json_build_object(
    'success', true,
    'session_token', session_token,
    'user_id', admin_user_record.id,
    'user_name', admin_user_record.name,
    'user_email', admin_user_record.email,
    'user_role', admin_user_record.role
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'حدث خطأ أثناء تسجيل الدخول'
    );
END;
$$;