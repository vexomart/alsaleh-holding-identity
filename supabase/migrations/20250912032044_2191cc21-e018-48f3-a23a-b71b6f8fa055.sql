-- إصلاح أمان جدول المستخدمين: إزالة الوصول العام وتطبيق ضوابط صارمة

-- إزالة السياسة الحالية التي تسمح بالتسجيل العام بدون ضوابط
DROP POLICY IF EXISTS "Public registration" ON users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON users;

-- سياسة تسجيل آمنة: فقط للتسجيل مع التحقق من البيانات
CREATE POLICY "secure_user_registration" 
ON users 
FOR INSERT 
WITH CHECK (
  -- التأكد من وجود بيانات أساسية
  email IS NOT NULL 
  AND email != '' 
  AND name IS NOT NULL 
  AND name != ''
  AND password_hash IS NOT NULL
  AND password_hash != ''
  -- فقط أدوار العملاء المسموح بها للتسجيل العام
  AND role IN ('client', 'user')
  -- فقط الحالات النشطة أو المعلقة
  AND status IN ('active', 'pending')
);

-- سياسة قراءة آمنة: المستخدمون يمكنهم رؤية بياناتهم فقط
CREATE POLICY "users_view_own_data_only" 
ON users 
FOR SELECT 
USING (auth.uid() = id);

-- سياسة تحديث آمنة: المستخدمون يمكنهم تحديث بياناتهم فقط
CREATE POLICY "users_update_own_data_only" 
ON users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND id IS NOT NULL
  -- منع تغيير الأدوار والحالات من قبل المستخدمين العاديين
  AND (OLD.role = NEW.role OR has_role(auth.uid(), 'admin'::app_role))
  AND (OLD.status = NEW.status OR has_role(auth.uid(), 'admin'::app_role))
);

-- سياسة حذف آمنة: فقط المديرون يمكنهم حذف المستخدمين
CREATE POLICY "users_admin_delete_only" 
ON users 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسة إدارية شاملة للمديرين
CREATE POLICY "users_admin_full_access" 
ON users 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- إضافة تسجيل أمني للعمليات الحساسة
CREATE OR REPLACE FUNCTION log_user_access()
RETURNS TRIGGER AS $$
BEGIN
  -- تسجيل محاولات الوصول للبيانات الحساسة
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

-- إنشاء مشغل للتسجيل الأمني
DROP TRIGGER IF EXISTS users_security_audit_trigger ON users;
CREATE TRIGGER users_security_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION log_user_access();

-- إضافة دالة للتحقق من صحة البيانات عند التسجيل
CREATE OR REPLACE FUNCTION validate_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- التحقق من صحة البريد الإلكتروني
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- التحقق من قوة كلمة المرور (يجب أن تكون مشفرة)
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

-- إنشاء مشغل للتحقق من صحة البيانات
DROP TRIGGER IF EXISTS validate_user_data_trigger ON users;
CREATE TRIGGER validate_user_data_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION validate_user_registration();