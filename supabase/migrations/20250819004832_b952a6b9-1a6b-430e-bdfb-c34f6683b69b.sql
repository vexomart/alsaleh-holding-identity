-- إصلاح شامل لحماية بيانات اعتماد المشرفين - الجزء الثاني
-- تحديث السياسات ونظام المصادقة

-- 1. تحديث دالة admin_login لاستخدام التشفير الجديد
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
  login_attempts INTEGER := 0;
  last_attempt TIMESTAMP WITH TIME ZONE;
  is_locked BOOLEAN := FALSE;
BEGIN
  -- التحقق من معدل محاولات تسجيل الدخول
  SELECT COUNT(*) INTO login_attempts
  FROM security_audit_logs
  WHERE metadata->>'email' = user_email
    AND event_type = 'admin_login_failure'
    AND created_at > now() - interval '1 hour';
  
  -- قفل الحساب مؤقتاً بعد 5 محاولات فاشلة
  IF login_attempts >= 5 THEN
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
      'attempt_count', login_attempts
    )
  );
  
  IF is_locked THEN
    RETURN json_build_object(
      'success', false,
      'message', 'الحساب مقفل مؤقتاً بسبب محاولات دخول متكررة. حاول مرة أخرى بعد ساعة'
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
        'reason', 'user_not_found'
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'بيانات الدخول غير صحيحة'
    );
  END IF;
  
  -- التحقق من كلمة المرور
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
        'ip_address', user_ip
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'حدث خطأ نظامي، يرجى المحاولة لاحقاً'
    );
END;
$$;

-- 2. تشديد سياسات RLS على جدول admin_users
-- إزالة السياسات القديمة
DROP POLICY IF EXISTS "Admin users: Can update own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Can view own record only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can create users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can delete users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Owners can manage all users" ON admin_users;
DROP POLICY IF EXISTS "Secure: Admin can view basic info only" ON admin_users;
DROP POLICY IF EXISTS "Secure: Limited admin updates only" ON admin_users;
DROP POLICY IF EXISTS "Secure: Only owners can create admin users" ON admin_users;
DROP POLICY IF EXISTS "Secure: Owners can delete others only" ON admin_users;

-- سياسة جديدة للعرض (بدون البيانات الحساسة)
CREATE POLICY "Ultra Secure: Admin basic info only"
ON admin_users
FOR SELECT
TO authenticated
USING (
  (get_current_admin_user() IS NOT NULL AND id = get_current_admin_user() AND is_active = true)
  OR
  (get_current_admin_user() IS NOT NULL AND EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
      AND au.role = 'owner'::user_role 
      AND au.is_active = true
  ))
);

-- سياسة للتحديث (بقيود صارمة جداً)
CREATE POLICY "Ultra Secure: No direct sensitive updates"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL 
  AND id = get_current_admin_user() 
  AND is_active = true
)
WITH CHECK (
  -- منع تعديل جميع البيانات الحساسة مباشرة
  password_hash = OLD.password_hash
  AND COALESCE(password_salt, '') = COALESCE(OLD.password_salt, '')
  AND COALESCE(session_secret, '') = COALESCE(OLD.session_secret, '')
  AND COALESCE(two_factor_secret, '') = COALESCE(OLD.two_factor_secret, '')
  -- السماح بتحديث البيانات الأساسية فقط
  AND (name != OLD.name OR role = OLD.role)
);

-- سياسة للإنشاء (مالكين فقط مع تدقيق مشدد)
CREATE POLICY "Ultra Secure: Owner-only admin creation"
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
  -- منع إنشاء مالكين جدد إلا من مالك موجود
  AND (role != 'owner'::user_role OR EXISTS (
    SELECT 1 FROM admin_users existing_owner
    WHERE existing_owner.id = get_current_admin_user()
      AND existing_owner.role = 'owner'::user_role
  ))
);

-- سياسة للحذف (مقيدة جداً)
CREATE POLICY "Ultra Secure: Restricted admin deletion"
ON admin_users
FOR DELETE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL 
  AND id != get_current_admin_user() -- منع حذف الذات
  AND role != 'owner'::user_role -- منع حذف المالكين
  AND EXISTS (
    SELECT 1 FROM admin_users au 
    WHERE au.id = get_current_admin_user() 
      AND au.role = 'owner'::user_role 
      AND au.is_active = true
  )
);

-- 3. دالة آمنة لعرض بيانات المشرفين (بدون البيانات الحساسة)
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
    (get_current_admin_user() IS NOT NULL AND au.id = get_current_admin_user())
    OR
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