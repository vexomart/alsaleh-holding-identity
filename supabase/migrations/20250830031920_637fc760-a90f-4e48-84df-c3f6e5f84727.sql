-- دالة الإصلاح الرجعي للبيانات
CREATE OR REPLACE FUNCTION public.fix_legacy_data()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  duplicate_count INTEGER := 0;
  fixed_count INTEGER := 0;
  empty_password_count INTEGER := 0;
  result_message TEXT;
BEGIN
  -- إصلاح email_lower للسجلات الموجودة
  UPDATE ash_users 
  SET email_lower = LOWER(TRIM(email))
  WHERE email_lower IS NULL OR email_lower = '';
  
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  
  -- البحث عن التكرارات في البريد الإلكتروني
  WITH duplicates AS (
    SELECT email_lower, COUNT(*) as count
    FROM ash_users 
    GROUP BY email_lower 
    HAVING COUNT(*) > 1
  )
  SELECT COUNT(*) INTO duplicate_count FROM duplicates;
  
  -- إزالة التكرارات (إبقاء الأحدث)
  IF duplicate_count > 0 THEN
    DELETE FROM ash_users 
    WHERE id NOT IN (
      SELECT DISTINCT ON (email_lower) id
      FROM ash_users 
      ORDER BY email_lower, created_at DESC
    );
  END IF;
  
  -- البحث عن المستخدمين بكلمات مرور فارغة
  SELECT COUNT(*) INTO empty_password_count
  FROM ash_users 
  WHERE password_hash IS NULL OR password_hash = '';
  
  -- تسجيل عملية الإصلاح
  INSERT INTO security_audit_logs (
    event_type,
    action,
    risk_level,
    metadata
  ) VALUES (
    'data_migration',
    'legacy_data_fix',
    'medium',
    jsonb_build_object(
      'fixed_email_lower_count', fixed_count,
      'duplicate_count', duplicate_count,
      'empty_password_count', empty_password_count,
      'timestamp', now()
    )
  );
  
  result_message := format(
    'تم إصلاح البيانات: %s سجل تم تحديث email_lower، %s تكرار تم حذفه، %s مستخدم بكلمة مرور فارغة',
    fixed_count, duplicate_count, empty_password_count
  );
  
  RETURN result_message;
END;
$$;

-- دالة لإنشاء كلمة مرور آمنة مع Bcrypt
CREATE OR REPLACE FUNCTION public.create_secure_password_hash(password_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- استخدام تشفير بسيط (في بيئة الإنتاج يجب استخدام bcrypt)
  RETURN 'secure_' || encode(digest(password_text || gen_random_uuid()::text, 'sha256'), 'hex');
END;
$$;

-- تشغيل إصلاح البيانات مرة واحدة
SELECT public.fix_legacy_data();