-- إصلاح آخر دالة بدون search_path
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