-- هجرة مبسطة للبيانات
SET search_path = public;

-- إنشاء المستخدمين مع كلمة مرور مؤقتة بسيطة
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
VALUES 
  (
    'ali6c205@gmail.com',
    'ali6c205@gmail.com',
    'علي الشهري',
    'hashed_123456_test',
    'client',
    'active',
    NOW(),
    NOW()
  ),
  (
    'info@alialshehriholding.com',
    'info@alialshehriholding.com',
    'Ali Al Shehri Holding',
    'hashed_password_admin',
    'admin',
    'active',
    NOW(),
    NOW()
  ),
  (
    'fekrah4you@gmail.com',
    'fekrah4you@gmail.com',
    'مستخدم',
    'hashed_password_user',
    'client',
    'active',
    NOW(),
    NOW()
  )
ON CONFLICT (email_lower) DO UPDATE SET
  status = 'active',
  verified_at = NOW();