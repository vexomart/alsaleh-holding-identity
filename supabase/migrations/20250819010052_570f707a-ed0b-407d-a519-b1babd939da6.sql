-- Fix security warnings by setting search_path for all functions

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = $1 
    AND is_active = true
  );
$$;

-- Fix get_admin_role function
CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_profiles 
  WHERE user_id = $1 
  AND is_active = true
  LIMIT 1;
$$;

-- Fix handle_new_admin_user function
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create admin profile if user has admin metadata
  IF NEW.raw_user_meta_data->>'is_admin' = 'true' THEN
    INSERT INTO public.admin_profiles (
      user_id,
      full_name,
      role,
      department
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE((NEW.raw_user_meta_data->>'role')::admin_role, 'editor'),
      NEW.raw_user_meta_data->>'department'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix create_secure_admin_session function
CREATE OR REPLACE FUNCTION public.create_secure_admin_session(
  admin_user_id UUID,
  session_data JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_id TEXT;
  admin_profile RECORD;
  result JSONB;
BEGIN
  -- Verify user is admin
  SELECT * INTO admin_profile 
  FROM public.admin_profiles 
  WHERE user_id = admin_user_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not an active admin';
  END IF;
  
  -- Generate session ID
  session_id := encode(gen_random_bytes(32), 'base64');
  
  -- Log successful admin login
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_login_success',
    admin_user_id,
    'admin_authentication',
    'medium',
    jsonb_build_object(
      'role', admin_profile.role,
      'session_id', session_id,
      'timestamp', now(),
      'session_data', session_data
    )
  );
  
  -- Update last login
  UPDATE public.admin_profiles 
  SET last_login_at = now()
  WHERE user_id = admin_user_id;
  
  result := jsonb_build_object(
    'success', true,
    'session_id', session_id,
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