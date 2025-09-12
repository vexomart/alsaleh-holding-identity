-- إصلاح أمان جدول المستخدمين مع تصحيح الأخطاء

-- إزالة السياسات الحالية غير الآمنة
DROP POLICY IF EXISTS "Public registration" ON users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON users;
DROP POLICY IF EXISTS "Complete admin access to users" ON users;
DROP POLICY IF EXISTS "Users manage own profile" ON users;

-- سياسة تسجيل آمنة مع تحقق من البيانات
CREATE POLICY "secure_user_registration" 
ON users 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND email != '' 
  AND name IS NOT NULL 
  AND name != ''
  AND password_hash IS NOT NULL
  AND password_hash != ''
  AND role IN ('client', 'user')
  AND status IN ('active', 'pending')
);

-- سياسة قراءة آمنة: المستخدمون يرون بياناتهم فقط
CREATE POLICY "users_view_own_data_only" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- سياسة تحديث آمنة
CREATE POLICY "users_update_own_data_only" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND id IS NOT NULL);

-- سياسة حذف للمديرين فقط
CREATE POLICY "users_admin_delete_only" 
ON users 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسة إدارية شاملة
CREATE POLICY "users_admin_full_access" 
ON users 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إضافة دالة التسجيل الأمني
CREATE OR REPLACE FUNCTION log_user_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    resource_id,
    risk_level,
    metadata
  ) VALUES (
    'user_data_access',
    auth.uid(),
    TG_OP,
    'users',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP IN ('INSERT', 'UPDATE', 'DELETE') THEN 'high'
      ELSE 'medium'
    END,
    jsonb_build_object(
      'table', 'users',
      'operation', TG_OP,
      'user_email', COALESCE(NEW.email, OLD.email),
      'user_role', COALESCE(NEW.role, OLD.role),
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- إنشاء المشغل للتسجيل الأمني
DROP TRIGGER IF EXISTS users_security_audit_trigger ON users;
CREATE TRIGGER users_security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_user_access();

-- دالة التحقق من صحة البيانات
CREATE OR REPLACE FUNCTION validate_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- التحقق من صحة البريد الإلكتروني
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- التحقق من قوة كلمة المرور المشفرة
  IF LENGTH(NEW.password_hash) < 32 THEN
    RAISE EXCEPTION 'Password hash appears to be too short';
  END IF;
  
  -- التحقق من طول الاسم
  IF LENGTH(NEW.name) < 2 OR LENGTH(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 2 and 100 characters';
  END IF;
  
  -- تطبيع البريد الإلكتروني
  NEW.email = LOWER(TRIM(NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- إنشاء مشغل التحقق من البيانات
DROP TRIGGER IF EXISTS validate_user_data_trigger ON users;
CREATE TRIGGER validate_user_data_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION validate_user_registration();