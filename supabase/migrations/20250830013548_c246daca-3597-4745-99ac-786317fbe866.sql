-- إصلاح هجرة البيانات مع استخدام دوال PostgreSQL الصحيحة
SET search_path = public;

-- تفعيل امتداد pgcrypto إذا لم يكن مفعل
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- إنشاء المستخدمين من البيانات الموجودة
INSERT INTO ash_users (
  email,
  email_lower,
  name,
  password_hash,
  role,
  status,
  verified_at,
  created_at
)
SELECT DISTINCT
  COALESCE(p.email, vc.email) as email,
  normalize_email(COALESCE(p.email, vc.email)) as email_lower,
  COALESCE(p.full_name, 'مستخدم') as name,
  'migrated_user_' || encode(digest(COALESCE(p.email, vc.email) || now()::text, 'sha256'), 'hex') as password_hash,
  CASE 
    WHEN p.user_role = 'admin' THEN 'admin'
    ELSE 'client'
  END as role,
  CASE 
    WHEN vc.used = true THEN 'active'
    ELSE 'pending'
  END as status,
  CASE 
    WHEN vc.used = true THEN NOW()
    ELSE NULL
  END as verified_at,
  COALESCE(vc.created_at, NOW()) as created_at
FROM verification_codes vc
LEFT JOIN profiles p ON p.email = vc.email
WHERE vc.email IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM ash_users au 
    WHERE au.email_lower = normalize_email(vc.email)
  )
ON CONFLICT (email_lower) DO NOTHING;

-- تحديث كلمة المرور للمستخدم المعروف للاختبار
UPDATE ash_users 
SET password_hash = 'hashed_123456_test'
WHERE email_lower = 'ali6c205@gmail.com';