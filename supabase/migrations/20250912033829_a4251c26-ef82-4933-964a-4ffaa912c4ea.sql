-- إصلاح أمان جدول المستخدمين: تطبيق ضوابط أمان صارمة

-- إزالة جميع السياسات الحالية للمستخدمين
DROP POLICY IF EXISTS "Public registration" ON users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON users;
DROP POLICY IF EXISTS "secure_user_registration" ON users;
DROP POLICY IF EXISTS "users_view_own_data_only" ON users;
DROP POLICY IF EXISTS "users_update_own_data_only" ON users;
DROP POLICY IF EXISTS "users_admin_delete_only" ON users;
DROP POLICY IF EXISTS "users_admin_full_access" ON users;
DROP POLICY IF EXISTS "Users manage own profile" ON users;
DROP POLICY IF EXISTS "Complete admin access to users" ON users;

-- 1. سياسة تسجيل آمنة مع التحقق من البيانات
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

-- 2. سياسة قراءة آمنة: المستخدمون يمكنهم رؤية بياناتهم فقط
CREATE POLICY "users_view_own_data_only" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- 3. سياسة تحديث آمنة: منع تغيير الأدوار من قبل المستخدمين العاديين
CREATE POLICY "users_update_own_data_safe" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. سياسة إدارية شاملة للمديرين
CREATE POLICY "users_admin_full_access" 
ON users 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إضافة دالة آمنة للتحقق من صحة البيانات
CREATE OR REPLACE FUNCTION validate_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- التحقق من صحة البريد الإلكتروني
  IF NEW.email IS NOT NULL AND NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'صيغة البريد الإلكتروني غير صحيحة';
  END IF;
  
  -- تطبيع البريد الإلكتروني
  IF NEW.email IS NOT NULL THEN
    NEW.email = LOWER(TRIM(NEW.email));
  END IF;
  
  -- التحقق من طول الاسم
  IF NEW.name IS NOT NULL AND (LENGTH(NEW.name) < 2 OR LENGTH(NEW.name) > 100) THEN
    RAISE EXCEPTION 'الاسم يجب أن يكون بين 2 و 100 حرف';
  END IF;
  
  -- التحقق من كلمة المرور المشفرة للمستخدمين الجدد
  IF TG_OP = 'INSERT' AND (NEW.password_hash IS NULL OR LENGTH(NEW.password_hash) < 8) THEN
    RAISE EXCEPTION 'كلمة المرور مطلوبة';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- إنشاء مشغل للتحقق من البيانات
DROP TRIGGER IF EXISTS validate_user_data_trigger ON users;
CREATE TRIGGER validate_user_data_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION validate_user_data();

-- إضافة دالة لتسجيل العمليات الأمنية
CREATE OR REPLACE FUNCTION log_user_operations()
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
    'user_data_operation',
    auth.uid(),
    TG_OP,
    'users',
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP IN ('INSERT', 'DELETE') THEN 'high'
      WHEN TG_OP = 'UPDATE' THEN 'medium'
      ELSE 'low'
    END,
    jsonb_build_object(
      'table', 'users',
      'operation', TG_OP,
      'user_email', CASE WHEN TG_OP = 'DELETE' THEN OLD.email ELSE NEW.email END,
      'user_role', CASE WHEN TG_OP = 'DELETE' THEN OLD.role ELSE NEW.role END,
      'timestamp', now()
    )
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- إنشاء مشغل لتسجيل العمليات
DROP TRIGGER IF EXISTS log_user_operations_trigger ON users;
CREATE TRIGGER log_user_operations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_user_operations();