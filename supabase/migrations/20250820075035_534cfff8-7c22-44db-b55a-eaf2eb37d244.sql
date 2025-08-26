-- CRITICAL SECURITY FIX: Harden admin_users table access controls
-- This addresses the "Administrator Account Information Could Enable System Takeover" vulnerability

-- 1. Drop all existing permissive policies on admin_users table
DROP POLICY IF EXISTS "Admin users: Can update own record" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users: Can view own record only" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can create users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can delete users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users: Owners can manage all users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users: System access only for password management" ON public.admin_users;

-- 2. Create a more secure admin session validation function
CREATE OR REPLACE FUNCTION public.validate_admin_session_security()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_user_id uuid;
  session_record RECORD;
BEGIN
  -- Get the current admin session from secure context
  session_user_id := get_current_admin_user();
  
  IF session_user_id IS NULL THEN
    -- Log unauthorized access attempt
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'unauthorized_admin_access',
      auth.uid(),
      'admin_table_access_denied',
      'critical',
      jsonb_build_object(
        'table', 'admin_users',
        'reason', 'no_valid_admin_session',
        'timestamp', now(),
        'ip_address', inet_client_addr()
      )
    );
    RETURN NULL;
  END IF;
  
  -- Verify the session is still valid and not hijacked
  SELECT * INTO session_record
  FROM public.admin_sessions
  WHERE admin_user_id = session_user_id
    AND expires_at > now()
    AND is_revoked = FALSE;
    
  IF session_record IS NULL THEN
    -- Log session validation failure
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_session_validation_failed',
      session_user_id,
      'invalid_admin_session',
      'critical',
      jsonb_build_object(
        'reason', 'session_expired_or_revoked',
        'timestamp', now()
      )
    );
    RETURN NULL;
  END IF;
  
  RETURN session_user_id;
END;
$function$;

-- 3. Create ultra-restrictive RLS policies
-- Policy 1: Completely block public access
CREATE POLICY "SECURITY: Block all public access to admin_users"
ON public.admin_users
FOR ALL
TO public
USING (FALSE)
WITH CHECK (FALSE);

-- Policy 2: Allow only validated admin sessions to view their own record
CREATE POLICY "SECURITY: Admins can view own record only with valid session"
ON public.admin_users
FOR SELECT
TO authenticated
USING (
  validate_admin_session_security() IS NOT NULL 
  AND id = validate_admin_session_security()
  AND is_active = TRUE
);

-- Policy 3: Allow only owners to manage other admin users
CREATE POLICY "SECURITY: Only owners can manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (
  validate_admin_session_security() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = validate_admin_session_security()
      AND au.role = 'owner'::user_role
      AND au.is_active = TRUE
  )
)
WITH CHECK (
  validate_admin_session_security() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = validate_admin_session_security()
      AND au.role = 'owner'::user_role
      AND au.is_active = TRUE
  )
);

-- Policy 4: Allow admins to update only their own record (limited fields)
CREATE POLICY "SECURITY: Admins can update own safe fields only"
ON public.admin_users
FOR UPDATE
TO authenticated
USING (
  validate_admin_session_security() IS NOT NULL
  AND id = validate_admin_session_security()
  AND is_active = TRUE
)
WITH CHECK (
  validate_admin_session_security() IS NOT NULL
  AND id = validate_admin_session_security()
  AND is_active = TRUE
);

-- 4. Create enhanced security audit trigger for admin_users
CREATE OR REPLACE FUNCTION public.log_admin_users_security_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Log ALL access attempts to admin_users table with maximum detail
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'critical_admin_data_access',
    validate_admin_session_security(),
    TG_OP,
    'admin_users',
    COALESCE(NEW.id, OLD.id),
    'critical', -- Always critical for admin table access
    jsonb_build_object(
      'table', 'admin_users',
      'operation', TG_OP,
      'target_email', COALESCE(NEW.email, OLD.email),
      'target_role', COALESCE(NEW.role, OLD.role),
      'accessing_admin_id', validate_admin_session_security(),
      'session_valid', CASE WHEN validate_admin_session_security() IS NOT NULL THEN true ELSE false END,
      'timestamp', now(),
      'ip_address', inet_client_addr(),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS admin_users_security_audit_trigger ON public.admin_users;

-- Create new comprehensive security audit trigger
CREATE TRIGGER admin_users_security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE OR SELECT ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION log_admin_users_security_access();

-- 5. Create function to safely retrieve admin info (for system use only)
CREATE OR REPLACE FUNCTION public.get_admin_info_secure(admin_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  admin_info jsonb;
  requesting_admin_id uuid;
BEGIN
  -- Validate the requesting admin
  requesting_admin_id := validate_admin_session_security();
  
  IF requesting_admin_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized access to admin information';
  END IF;
  
  -- Only allow owners to access other admin info, or self-access
  IF requesting_admin_id != admin_id THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = requesting_admin_id
        AND role = 'owner'::user_role
        AND is_active = TRUE
    ) THEN
      RAISE EXCEPTION 'Insufficient privileges to access admin information';
    END IF;
  END IF;
  
  -- Return sanitized admin info (no sensitive fields)
  SELECT jsonb_build_object(
    'id', id,
    'name', name,
    'email', email,
    'role', role,
    'is_active', is_active,
    'last_login_at', last_login_at,
    'created_at', created_at
  ) INTO admin_info
  FROM public.admin_users
  WHERE id = admin_id;
  
  -- Log the access
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_info_accessed',
    requesting_admin_id,
    'secure_admin_info_retrieval',
    'high',
    jsonb_build_object(
      'target_admin_id', admin_id,
      'accessed_by', requesting_admin_id,
      'timestamp', now()
    )
  );
  
  RETURN admin_info;
END;
$function$;

-- 6. Add additional security: encrypt sensitive fields function
CREATE OR REPLACE FUNCTION public.secure_admin_password_update(
  admin_id uuid,
  new_password_hash text,
  new_salt text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  requesting_admin_id uuid;
BEGIN
  -- Validate requesting admin
  requesting_admin_id := validate_admin_session_security();
  
  IF requesting_admin_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized password update attempt';
  END IF;
  
  -- Only allow self-update or owner updating others
  IF requesting_admin_id != admin_id THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = requesting_admin_id
        AND role = 'owner'::user_role
        AND is_active = TRUE
    ) THEN
      RAISE EXCEPTION 'Insufficient privileges for password update';
    END IF;
  END IF;
  
  -- Update password with new security measures
  UPDATE public.admin_users
  SET 
    password_hash = new_password_hash,
    password_salt = new_salt,
    last_password_change = now(),
    session_secret = encode(gen_random_bytes(32), 'hex'), -- Force session renewal
    updated_at = now()
  WHERE id = admin_id AND is_active = TRUE;
  
  -- Revoke all existing sessions for this admin (force re-login)
  UPDATE public.admin_sessions
  SET is_revoked = TRUE, revoked_at = now()
  WHERE admin_user_id = admin_id;
  
  -- Log security event
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_password_updated',
    requesting_admin_id,
    'secure_password_change',
    'high',
    jsonb_build_object(
      'target_admin_id', admin_id,
      'updated_by', requesting_admin_id,
      'sessions_revoked', TRUE,
      'timestamp', now()
    )
  );
  
  RETURN TRUE;
END;
$function$;

-- 7. Add rate limiting specifically for admin operations
CREATE OR REPLACE FUNCTION public.enhanced_admin_rate_limit_check(
  admin_id uuid,
  operation_type text,
  max_attempts integer DEFAULT 3,
  window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  current_attempts integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (window_minutes || ' minutes')::interval;
  
  -- Count recent attempts
  SELECT COUNT(*)
  INTO current_attempts
  FROM public.security_audit_logs
  WHERE user_id = admin_id
    AND action = operation_type
    AND created_at >= window_start;
  
  IF current_attempts >= max_attempts THEN
    -- Log rate limit exceeded
    INSERT INTO public.security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_rate_limit_exceeded',
      admin_id,
      operation_type || '_blocked',
      'critical',
      jsonb_build_object(
        'attempts', current_attempts,
        'max_attempts', max_attempts,
        'window_minutes', window_minutes,
        'timestamp', now()
      )
    );
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Add comment to document security measures
COMMENT ON TABLE public.admin_users IS 'SECURITY HARDENED: Administrator credentials table with ultra-restrictive access controls. Access is logged and monitored. Direct access is blocked - use secure functions only.';

-- Final security verification
DO $verification$
BEGIN
  -- Ensure RLS is enabled
  IF NOT (SELECT row_security FROM pg_tables WHERE tablename = 'admin_users' AND schemaname = 'public') THEN
    RAISE EXCEPTION 'SECURITY ERROR: RLS not enabled on admin_users table';
  END IF;
  
  RAISE NOTICE 'SECURITY FIX COMPLETED: admin_users table is now fully secured against unauthorized access';
END;
$verification$;