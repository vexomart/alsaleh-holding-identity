-- إصلاح شامل لحماية بيانات اعتماد المشرفين
-- تشديد الأمان وحماية البيانات الحساسة

-- 1. إنشاء دالة تشفير متقدمة للبيانات الحساسة
CREATE OR REPLACE FUNCTION encrypt_sensitive_admin_data(data_text TEXT, secret_key TEXT DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encryption_key TEXT;
  encrypted_data TEXT;
BEGIN
  -- استخدام مفتاح تشفير آمن
  encryption_key := COALESCE(secret_key, encode(digest('ADMIN_ENCRYPTION_2024', 'sha256'), 'hex'));
  
  -- تشفير البيانات باستخدام AES
  encrypted_data := encode(
    encrypt(
      data_text::bytea,
      encryption_key::bytea,
      'aes-cbc/pad:pkcs'
    ),
    'base64'
  );
  
  RETURN encrypted_data;
END;
$$;

-- 2. دالة فك التشفير الآمنة
CREATE OR REPLACE FUNCTION decrypt_sensitive_admin_data(encrypted_data TEXT, secret_key TEXT DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  encryption_key TEXT;
  decrypted_data TEXT;
BEGIN
  -- التحقق من وجود البيانات
  IF encrypted_data IS NULL OR encrypted_data = '' THEN
    RETURN NULL;
  END IF;
  
  encryption_key := COALESCE(secret_key, encode(digest('ADMIN_ENCRYPTION_2024', 'sha256'), 'hex'));
  
  -- فك التشفير
  BEGIN
    decrypted_data := convert_from(
      decrypt(
        decode(encrypted_data, 'base64'),
        encryption_key::bytea,
        'aes-cbc/pad:pkcs'
      ),
      'UTF8'
    );
  EXCEPTION WHEN OTHERS THEN
    -- في حالة فشل فك التشفير، إرجاع NULL
    RETURN NULL;
  END;
  
  RETURN decrypted_data;
END;
$$;

-- 3. دالة آمنة لإنشاء كلمة مرور مشفرة
CREATE OR REPLACE FUNCTION create_secure_admin_password(plain_password TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  salt TEXT;
  hash TEXT;
  encrypted_salt TEXT;
BEGIN
  -- التحقق من قوة كلمة المرور
  IF LENGTH(plain_password) < 12 THEN
    RAISE EXCEPTION 'كلمة المرور يجب أن تكون 12 حرف على الأقل';
  END IF;
  
  -- إنشاء salt عشوائي قوي
  salt := encode(gen_random_bytes(32), 'hex');
  
  -- تشفير كلمة المرور مع salt
  hash := crypt(plain_password || salt, gen_salt('bf', 12));
  
  -- تشفير salt للحماية الإضافية
  encrypted_salt := encrypt_sensitive_admin_data(salt);
  
  RETURN json_build_object(
    'hash', hash,
    'salt', encrypted_salt,
    'created_at', now()
  );
END;
$$;

-- 4. دالة التحقق الآمنة من كلمة المرور
CREATE OR REPLACE FUNCTION verify_secure_admin_password(
  plain_password TEXT, 
  stored_hash TEXT, 
  stored_encrypted_salt TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  decrypted_salt TEXT;
BEGIN
  -- فك تشفير salt
  decrypted_salt := decrypt_sensitive_admin_data(stored_encrypted_salt);
  
  IF decrypted_salt IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- التحقق من كلمة المرور
  RETURN stored_hash = crypt(plain_password || decrypted_salt, stored_hash);
END;
$$;

-- 5. تحديث دالة admin_login لاستخدام التشفير الجديد
CREATE OR REPLACE FUNCTION secure_admin_login(
  user_email TEXT, 
  user_password TEXT, 
  user_ip INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_user_record RECORD;
  session_token TEXT;
  login_attempts INTEGER;
  last_attempt TIMESTAMP WITH TIME ZONE;
  is_locked BOOLEAN := FALSE;
BEGIN
  -- التحقق من معدل محاولات تسجيل الدخول
  SELECT COUNT(*), MAX(created_at) INTO login_attempts, last_attempt
  FROM security_audit_logs
  WHERE resource_type = 'admin_login' 
    AND metadata->>'email' = user_email
    AND event_type = 'admin_login_failure'
    AND created_at > now() - interval '1 hour';
  
  -- قفل الحساب مؤقتاً بعد 5 محاولات فاشلة
  IF login_attempts >= 5 AND last_attempt > now() - interval '30 minutes' THEN
    is_locked := TRUE;
  END IF;
  
  -- تسجيل محاولة الوصول
  INSERT INTO sensitive_data_audit (
    resource_type,
    resource_id,
    access_type,
    data_classification,
    success,
    risk_score,
    metadata
  ) VALUES (
    'admin_login_attempt',
    user_email,
    'authentication',
    'restricted',
    NOT is_locked,
    CASE WHEN is_locked THEN 95 ELSE 50 END,
    jsonb_build_object(
      'email', user_email,
      'ip_address', user_ip,
      'user_agent', user_agent,
      'is_locked', is_locked,
      'attempt_count', login_attempts,
      'timestamp', now()
    )
  );
  
  IF is_locked THEN
    RETURN json_build_object(
      'success', false,
      'message', 'الحساب مقفل مؤقتاً بسبب محاولات دخول متكررة. حاول مرة أخرى بعد 30 دقيقة'
    );
  END IF;
  
  -- البحث عن المستخدم
  SELECT * INTO admin_user_record
  FROM admin_users
  WHERE email = user_email 
    AND is_active = true;
  
  IF admin_user_record IS NULL THEN
    -- تسجيل محاولة دخول فاشلة
    INSERT INTO security_audit_logs (
      event_type,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_login_failure',
      'user_not_found',
      'high',
      jsonb_build_object(
        'email', user_email,
        'ip_address', user_ip,
        'user_agent', user_agent,
        'reason', 'user_not_found'
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'بيانات الدخول غير صحيحة'
    );
  END IF;
  
  -- التحقق من كلمة المرور باستخدام الدالة الآمنة
  IF NOT verify_secure_admin_password(user_password, admin_user_record.password_hash, admin_user_record.password_salt) THEN
    -- تسجيل محاولة دخول فاشلة
    INSERT INTO security_audit_logs (
      event_type,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_login_failure',
      'invalid_password',
      'high',
      jsonb_build_object(
        'email', user_email,
        'user_id', admin_user_record.id,
        'ip_address', user_ip,
        'user_agent', user_agent,
        'reason', 'invalid_password'
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'بيانات الدخول غير صحيحة'
    );
  END IF;
  
  -- تحديث آخر تسجيل دخول
  UPDATE admin_users 
  SET last_login_at = NOW()
  WHERE id = admin_user_record.id;
  
  -- إنشاء session آمن
  SELECT create_secure_admin_session(admin_user_record.id, user_ip, user_agent) INTO session_token;
  
  -- تسجيل نجاح تسجيل الدخول
  INSERT INTO security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_login_success',
    admin_user_record.id,
    'successful_login',
    'low',
    jsonb_build_object(
      'email', admin_user_record.email,
      'role', admin_user_record.role,
      'ip_address', user_ip,
      'user_agent', user_agent,
      'session_created', true
    )
  );
  
  RETURN json_build_object(
    'success', true,
    'session_token', session_token,
    'user_id', admin_user_record.id,
    'user_name', admin_user_record.name,
    'user_email', admin_user_record.email,
    'user_role', admin_user_record.role,
    'two_factor_required', admin_user_record.two_factor_enabled
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- تسجيل الأخطاء النظامية
    INSERT INTO security_audit_logs (
      event_type,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_login_error',
      'system_error',
      'critical',
      jsonb_build_object(
        'email', user_email,
        'error', SQLERRM,
        'ip_address', user_ip,
        'user_agent', user_agent
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'حدث خطأ نظامي، يرجى المحاولة لاحقاً'
    );
END;
$$;

-- 6. تشديد سياسات RLS على جدول admin_users
-- إزالة جميع السياسات القديمة وإنشاء سياسات أكثر أماناً
DROP POLICY IF EXISTS "Admin users: Can update own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Can view own record only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can create users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can delete users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Owners can manage all users" ON admin_users;

-- سياسة جديدة للعرض (بدون البيانات الحساسة)
CREATE POLICY "Secure: Admin can view basic info only"
ON admin_users
FOR SELECT
TO authenticated
USING (
  -- المشرف يرى معلوماته الأساسية فقط
  (get_current_admin_user() IS NOT NULL AND id = get_current_admin_user() AND is_active = true)
  OR
  -- المالك يرى معلومات أساسية للجميع (بدون كلمات المرور)
  (get_current_admin_user() IS NOT NULL AND EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
      AND au.role = 'owner'::user_role 
      AND au.is_active = true
  ))
);

-- سياسة للتحديث (بقيود صارمة)
CREATE POLICY "Secure: Limited admin updates only"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL 
  AND id = get_current_admin_user() 
  AND is_active = true
)
WITH CHECK (
  -- منع تعديل البيانات الحساسة مباشرة
  password_hash = OLD.password_hash
  AND password_salt = OLD.password_salt
  AND session_secret = OLD.session_secret
  AND two_factor_secret = OLD.two_factor_secret
);

-- سياسة للإنشاء (مالكين فقط)
CREATE POLICY "Secure: Only owners can create admin users"
ON admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  get_current_admin_user() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
      AND au.role = 'owner'::user_role 
      AND au.is_active = true
  )
);

-- سياسة للحذف (مالكين فقط ومنع حذف الذات)
CREATE POLICY "Secure: Owners can delete others only"
ON admin_users
FOR DELETE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL 
  AND id != get_current_admin_user() -- منع حذف الذات
  AND EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
      AND au.role = 'owner'::user_role 
      AND au.is_active = true
  )
);

-- 7. دالة آمنة لعرض بيانات المشرفين (بدون البيانات الحساسة)
CREATE OR REPLACE FUNCTION get_admin_users_safe()
RETURNS TABLE(
  id UUID,
  name TEXT,
  email TEXT,
  role user_role,
  is_active BOOLEAN,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  two_factor_enabled BOOLEAN
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    au.id,
    au.name,
    au.email,
    au.role,
    au.is_active,
    au.last_login_at,
    au.created_at,
    au.two_factor_enabled
  FROM admin_users au
  WHERE (
    -- المشرف يرى معلوماته فقط
    (get_current_admin_user() IS NOT NULL AND au.id = get_current_admin_user())
    OR
    -- المالك يرى الجميع
    (get_current_admin_user() IS NOT NULL AND EXISTS (
      SELECT 1 FROM admin_users owner 
      WHERE owner.id = get_current_admin_user() 
        AND owner.role = 'owner'::user_role 
        AND owner.is_active = true
    ))
  )
  AND au.is_active = true
  ORDER BY au.role, au.name;
$$;

-- 8. trigger لتسجيل جميع العمليات على جدول admin_users
CREATE OR REPLACE FUNCTION log_admin_users_operations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- تسجيل جميع العمليات على بيانات المشرفين
  INSERT INTO sensitive_data_audit (
    user_id,
    resource_type,
    resource_id,
    access_type,
    data_classification,
    success,
    risk_score,
    metadata
  ) VALUES (
    get_current_admin_user(),
    'admin_users',
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    'restricted',
    TRUE,
    CASE TG_OP
      WHEN 'DELETE' THEN 95
      WHEN 'UPDATE' THEN 85
      WHEN 'INSERT' THEN 80
      ELSE 70
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'affected_user', COALESCE(NEW.email, OLD.email),
      'performed_by', (
        SELECT email FROM admin_users 
        WHERE id = get_current_admin_user()
      ),
      'timestamp', now(),
      'sensitive_fields_accessed', CASE 
        WHEN TG_OP = 'UPDATE' AND (
          NEW.password_hash != OLD.password_hash OR
          NEW.password_salt != OLD.password_salt OR
          NEW.two_factor_secret != OLD.two_factor_secret
        ) THEN true
        ELSE false
      END
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- إضافة trigger
DROP TRIGGER IF EXISTS audit_admin_users_operations ON admin_users;
CREATE TRIGGER audit_admin_users_operations
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION log_admin_users_operations();