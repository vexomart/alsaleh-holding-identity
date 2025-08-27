-- إنشاء مستخدم إداري جديد مع الصلاحيات المطلوبة

-- أولاً: إدراج البيانات في جدول auth.users (إذا لم يكن موجوداً)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'info@alialshehriholding.com',
  crypt('Ali@@#@@1409', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "المدير العام", "is_admin": true}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Ali@@#@@1409', gen_salt('bf')),
  raw_user_meta_data = '{"full_name": "المدير العام", "is_admin": true}',
  updated_at = now();

-- ثانياً: إضافة دور الإدارة لهذا المستخدم
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'info@alialshehriholding.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ثالثاً: إضافة ملف تعريف للمستخدم الإداري (إذا كان هناك جدول profiles)
INSERT INTO public.profiles (user_id, full_name, user_role, client_id)
SELECT 
  id, 
  'المدير العام',
  'admin',
  'ADMIN001'
FROM auth.users 
WHERE email = 'info@alialshehriholding.com'
ON CONFLICT (user_id) DO UPDATE SET
  full_name = 'المدير العام',
  user_role = 'admin',
  updated_at = now();