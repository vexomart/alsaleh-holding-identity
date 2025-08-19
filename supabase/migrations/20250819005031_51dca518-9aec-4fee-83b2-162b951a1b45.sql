-- إصلاح شامل لحماية بيانات اعتماد المشرفين - الجزء الثالث
-- إصلاح السياسات وإضافة التدقيق

-- 1. تشديد سياسات RLS على جدول admin_users
-- إزالة السياسات القديمة
DROP POLICY IF EXISTS "Admin users: Can update own record" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Can view own record only" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can create users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Only owners can delete users" ON admin_users;
DROP POLICY IF EXISTS "Admin users: Owners can manage all users" ON admin_users;

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

-- سياسة للتحديث (بقيود صارمة)
CREATE POLICY "Ultra Secure: Limited admin updates"
ON admin_users
FOR UPDATE
TO authenticated
USING (
  get_current_admin_user() IS NOT NULL 
  AND id = get_current_admin_user() 
  AND is_active = true
);

-- سياسة للإنشاء (مالكين فقط)
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

-- 2. دالة آمنة لعرض بيانات المشرفين (بدون البيانات الحساسة)
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

-- 3. trigger لتسجيل جميع العمليات على جدول admin_users
CREATE OR REPLACE FUNCTION log_admin_users_operations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  operation_user_id UUID;
  target_user_email TEXT;
  sensitive_change BOOLEAN := FALSE;
BEGIN
  -- الحصول على معرف المستخدم الذي يقوم بالعملية
  operation_user_id := get_current_admin_user();
  
  -- تحديد البريد الإلكتروني للمستخدم المتأثر
  target_user_email := COALESCE(NEW.email, OLD.email);
  
  -- التحقق من تعديل البيانات الحساسة
  IF TG_OP = 'UPDATE' THEN
    sensitive_change := (
      (NEW.password_hash IS DISTINCT FROM OLD.password_hash) OR
      (NEW.password_salt IS DISTINCT FROM OLD.password_salt) OR
      (NEW.two_factor_secret IS DISTINCT FROM OLD.two_factor_secret) OR
      (NEW.session_secret IS DISTINCT FROM OLD.session_secret)
    );
  END IF;
  
  -- تسجيل العملية في جدول التدقيق
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
    operation_user_id,
    'admin_users',
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    'restricted',
    TRUE,
    CASE TG_OP
      WHEN 'DELETE' THEN 95
      WHEN 'UPDATE' THEN CASE WHEN sensitive_change THEN 90 ELSE 70 END
      WHEN 'INSERT' THEN 80
      ELSE 60
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'affected_user', target_user_email,
      'performed_by', (
        SELECT email FROM admin_users 
        WHERE id = operation_user_id
      ),
      'sensitive_fields_modified', sensitive_change,
      'timestamp', now(),
      'table', 'admin_users'
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

-- 4. دالة لتغيير كلمة مرور المشرف بأمان
CREATE OR REPLACE FUNCTION change_admin_password(
  admin_id UUID,
  old_password TEXT,
  new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  admin_record RECORD;
  password_data JSON;
BEGIN
  -- التحقق من أن المستخدم يغير كلمة مروره
  IF get_current_admin_user() != admin_id THEN
    RETURN json_build_object(
      'success', false,
      'message', 'غير مخول لتغيير كلمة مرور مستخدم آخر'
    );
  END IF;
  
  -- الحصول على بيانات المشرف
  SELECT * INTO admin_record
  FROM admin_users
  WHERE id = admin_id AND is_active = true;
  
  IF admin_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'المستخدم غير موجود أو غير نشط'
    );
  END IF;
  
  -- التحقق من كلمة المرور الحالية
  IF NOT verify_secure_admin_password(old_password, admin_record.password_hash, admin_record.password_salt) THEN
    -- تسجيل محاولة تغيير فاشلة
    INSERT INTO security_audit_logs (
      event_type,
      user_id,
      action,
      risk_level,
      metadata
    ) VALUES (
      'admin_password_change_failure',
      admin_id,
      'invalid_old_password',
      'high',
      jsonb_build_object(
        'admin_email', admin_record.email,
        'reason', 'invalid_old_password'
      )
    );
    
    RETURN json_build_object(
      'success', false,
      'message', 'كلمة المرور الحالية غير صحيحة'
    );
  END IF;
  
  -- إنشاء كلمة مرور جديدة مشفرة
  SELECT create_secure_admin_password(new_password) INTO password_data;
  
  -- تحديث كلمة المرور
  UPDATE admin_users
  SET 
    password_hash = (password_data->>'hash'),
    password_salt = (password_data->>'salt'),
    last_password_change = now(),
    session_secret = encode(gen_random_bytes(32), 'hex') -- إبطال جميع sessions
  WHERE id = admin_id;
  
  -- إبطال جميع sessions المشرف
  UPDATE admin_sessions
  SET is_revoked = true
  WHERE admin_user_id = admin_id;
  
  -- تسجيل نجاح تغيير كلمة المرور
  INSERT INTO security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_password_changed',
    admin_id,
    'password_update_success',
    'medium',
    jsonb_build_object(
      'admin_email', admin_record.email,
      'all_sessions_revoked', true
    )
  );
  
  RETURN json_build_object(
    'success', true,
    'message', 'تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول مرة أخرى'
  );
END;
$$;