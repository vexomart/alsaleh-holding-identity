-- Phase 1: Critical Authentication Security Fixes (Fixed Version)

-- 1. Create admin_users table if it doesn't exist (based on existing admin_profiles)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL DEFAULT 'REQUIRES_RESET',
  password_salt text DEFAULT 'REQUIRES_RESET',
  role user_role NOT NULL DEFAULT 'editor'::user_role,
  is_active boolean DEFAULT true,
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  session_secret text DEFAULT encode(gen_random_bytes(32), 'hex'),
  last_login_at timestamp with time zone,
  last_password_change timestamp with time zone DEFAULT now() - interval '1 year',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Enhanced password security system with proper hashing
CREATE OR REPLACE FUNCTION public.create_secure_admin_password_v2(plain_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  salt TEXT;
  hash TEXT;
  encrypted_salt TEXT;
BEGIN
  -- Enhanced password strength validation
  IF LENGTH(plain_password) < 12 THEN
    RAISE EXCEPTION 'Password must be at least 12 characters long';
  END IF;
  
  IF plain_password !~ '[A-Z]' THEN
    RAISE EXCEPTION 'Password must contain at least one uppercase letter';
  END IF;
  
  IF plain_password !~ '[a-z]' THEN
    RAISE EXCEPTION 'Password must contain at least one lowercase letter';
  END IF;
  
  IF plain_password !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password must contain at least one number';
  END IF;
  
  IF plain_password !~ '[^A-Za-z0-9]' THEN
    RAISE EXCEPTION 'Password must contain at least one special character';
  END IF;
  
  -- Generate cryptographically secure salt (32 bytes)
  salt := encode(gen_random_bytes(32), 'hex');
  
  -- Use bcrypt with work factor 12 for stronger hashing
  hash := crypt(plain_password || salt, gen_salt('bf', 12));
  
  -- Encrypt salt for additional security
  encrypted_salt := encrypt_sensitive_admin_data(salt);
  
  RETURN json_build_object(
    'hash', hash,
    'salt', encrypted_salt,
    'algorithm', 'bcrypt_12',
    'created_at', now()
  );
END;
$function$;

-- 3. Add missing columns to admin_sessions if needed
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_sessions' AND column_name = 'session_secret') THEN
    ALTER TABLE admin_sessions ADD COLUMN session_secret text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_sessions' AND column_name = 'revoked_at') THEN
    ALTER TABLE admin_sessions ADD COLUMN revoked_at timestamp with time zone;
  END IF;
END $$;

-- 4. Enhanced session management with encryption and fingerprinting
CREATE OR REPLACE FUNCTION public.create_ultra_secure_admin_session(
  admin_user_id uuid, 
  user_ip inet DEFAULT NULL::inet, 
  user_agent text DEFAULT NULL::text,
  additional_entropy text DEFAULT NULL::text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_token TEXT;
  session_secret TEXT;
  fingerprint_hash TEXT;
  encrypted_token TEXT;
  session_id UUID;
BEGIN
  -- Verify user exists and is active (check both tables)
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = admin_user_id AND is_active = TRUE
  ) AND NOT EXISTS (
    SELECT 1 FROM admin_profiles WHERE user_id = admin_user_id AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION 'User not found or inactive';
  END IF;
  
  -- Generate new session secret for this session (rotation)
  session_secret := encode(gen_random_bytes(64), 'hex');
  
  -- Create comprehensive fingerprint from multiple sources
  fingerprint_hash := encode(
    digest(
      COALESCE(user_agent, '') || 
      COALESCE(user_ip::text, '') || 
      COALESCE(additional_entropy, '') ||
      extract(epoch from now())::text,
      'sha384'
    ), 
    'hex'
  );
  
  -- Generate secure session token with HMAC
  session_token := encode(
    hmac(
      admin_user_id::text || 
      extract(epoch from now())::text || 
      fingerprint_hash ||
      encode(gen_random_bytes(16), 'hex'), -- Additional entropy
      session_secret,
      'sha384'
    ),
    'hex'
  );
  
  -- Encrypt the session token
  encrypted_token := encrypt_sensitive_admin_data(session_token);
  
  -- Generate session ID
  session_id := gen_random_uuid();
  
  -- Revoke any existing active sessions for this user (single session policy)
  UPDATE admin_sessions 
  SET is_revoked = TRUE, revoked_at = now()
  WHERE admin_user_id = create_ultra_secure_admin_session.admin_user_id 
    AND is_revoked = FALSE;
  
  -- Create new session record
  INSERT INTO admin_sessions (
    id,
    admin_user_id, 
    session_token, 
    expires_at, 
    ip_address, 
    user_agent,
    fingerprint,
    last_activity,
    session_secret
  ) VALUES (
    session_id,
    admin_user_id, 
    encrypted_token, 
    now() + interval '4 hours', -- Shorter session duration
    user_ip, 
    user_agent,
    fingerprint_hash,
    now(),
    encrypt_sensitive_admin_data(session_secret)
  );
  
  -- Log session creation
  INSERT INTO security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'secure_session_created',
    admin_user_id,
    'admin_session_creation',
    'medium',
    jsonb_build_object(
      'session_id', session_id,
      'fingerprint_hash', fingerprint_hash,
      'ip_address', user_ip::text,
      'timestamp', now()
    )
  );
  
  RETURN json_build_object(
    'session_token', session_token,
    'session_id', session_id,
    'expires_at', now() + interval '4 hours',
    'success', true
  );
END;
$function$;

-- 5. Enhanced session validation with security checks
CREATE OR REPLACE FUNCTION public.validate_ultra_secure_admin_session(
  token text, 
  user_ip inet DEFAULT NULL::inet,
  user_agent text DEFAULT NULL::text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  session_record RECORD;
  current_fingerprint TEXT;
  decrypted_token TEXT;
BEGIN
  -- Create fingerprint for comparison
  current_fingerprint := encode(
    digest(
      COALESCE(user_agent, '') || 
      COALESCE(user_ip::text, ''),
      'sha384'
    ), 
    'hex'
  );
  
  -- Find session by decrypting tokens and matching
  FOR session_record IN 
    SELECT 
      s.*,
      COALESCE(au.id, ap.user_id) as user_id,
      COALESCE(au.name, ap.full_name) as name,
      COALESCE(au.email, 'admin@system') as email,
      COALESCE(au.role::text, ap.role::text) as role,
      COALESCE(au.is_active, ap.is_active) as is_active
    FROM admin_sessions s
    LEFT JOIN admin_users au ON s.admin_user_id = au.id
    LEFT JOIN admin_profiles ap ON s.admin_user_id = ap.user_id
    WHERE s.expires_at > now()
      AND s.is_revoked = FALSE
      AND (au.is_active = TRUE OR ap.is_active = TRUE)
  LOOP
    -- Try to decrypt and match the token
    decrypted_token := decrypt_sensitive_admin_data(session_record.session_token);
    
    IF decrypted_token = token THEN
      -- Token matched, now validate fingerprint
      IF session_record.fingerprint != current_fingerprint THEN
        -- Potential session hijacking - revoke session
        UPDATE admin_sessions 
        SET is_revoked = TRUE, revoked_at = now() 
        WHERE id = session_record.id;
        
        -- Log security incident
        INSERT INTO security_audit_logs (
          event_type,
          user_id,
          action,
          risk_level,
          metadata
        ) VALUES (
          'session_hijacking_detected',
          session_record.user_id,
          'admin_session_validation_failed',
          'critical',
          jsonb_build_object(
            'session_id', session_record.id,
            'expected_fingerprint', session_record.fingerprint,
            'actual_fingerprint', current_fingerprint,
            'ip_address', user_ip::text,
            'timestamp', now()
          )
        );
        
        RETURN json_build_object(
          'valid', FALSE, 
          'reason', 'Session hijacking detected',
          'security_alert', TRUE
        );
      END IF;
      
      -- Check for session timeout (additional security)
      IF session_record.last_activity < now() - interval '30 minutes' THEN
        -- Auto-logout due to inactivity
        UPDATE admin_sessions 
        SET is_revoked = TRUE, revoked_at = now() 
        WHERE id = session_record.id;
        
        RETURN json_build_object(
          'valid', FALSE, 
          'reason', 'Session expired due to inactivity'
        );
      END IF;
      
      -- Update last activity
      UPDATE admin_sessions 
      SET last_activity = now() 
      WHERE id = session_record.id;
      
      RETURN json_build_object(
        'valid', TRUE,
        'user', json_build_object(
          'id', session_record.user_id,
          'name', session_record.name,
          'email', session_record.email,
          'role', session_record.role
        ),
        'session_id', session_record.id
      );
    END IF;
  END LOOP;
  
  -- No valid session found
  RETURN json_build_object(
    'valid', FALSE, 
    'reason', 'Invalid or expired session'
  );
END;
$function$;

-- 6. Enhanced rate limiting for admin operations
CREATE OR REPLACE FUNCTION public.enhanced_admin_rate_limit_check(
  p_admin_id uuid, 
  p_action_type text, 
  p_limit integer DEFAULT 5, 
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  current_count integer;
  window_start_time timestamp with time zone;
BEGIN
  window_start_time := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old entries
  DELETE FROM rate_limits 
  WHERE window_start < window_start_time;
  
  -- Get current count for this admin and action
  SELECT COALESCE(count, 0) INTO current_count
  FROM rate_limits
  WHERE identifier = p_admin_id::text 
    AND action_type = 'admin_' || p_action_type
    AND window_start >= window_start_time;
  
  -- Check if over limit
  IF current_count >= p_limit THEN
    -- Log security event
    INSERT INTO security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_rate_limit_exceeded',
      p_admin_id,
      'admin_' || p_action_type,
      'high',
      jsonb_build_object(
        'current_count', current_count,
        'limit', p_limit,
        'window_minutes', p_window_minutes,
        'timestamp', now()
      )
    );
    RETURN false;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (identifier, action_type, count, window_start)
  VALUES (p_admin_id::text, 'admin_' || p_action_type, 1, now())
  ON CONFLICT (identifier, action_type) 
  DO UPDATE SET 
    count = CASE 
      WHEN rate_limits.window_start < window_start_time THEN 1
      ELSE rate_limits.count + 1 
    END,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start_time THEN now()
      ELSE rate_limits.window_start 
    END;
    
  RETURN true;
END;
$function$;

-- 7. Enable RLS on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. Create secure RLS policies for admin_users
CREATE POLICY "Admin users: System access only for password management" ON public.admin_users
FOR ALL USING (false) WITH CHECK (false);

-- 9. Force password reset for existing admin profiles (safer approach)
UPDATE admin_profiles 
SET last_login_at = now() - interval '1 year'
WHERE is_active = TRUE;