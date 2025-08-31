-- إصلاح سياسة إدراج المستخدمين الجدد
DROP POLICY IF EXISTS "ash_users_public_insert_fixed" ON ash_users;

-- إنشاء سياسة جديدة تسمح بإدراج المستخدمين الجدد بدون مصادقة
CREATE POLICY "ash_users_allow_public_registration" 
ON ash_users 
FOR INSERT 
WITH CHECK (true);

-- التأكد من أن جدول user_roles يوجد ويمكن الوصول إليه
INSERT INTO user_roles (user_id, role) 
SELECT id, 'user'::app_role 
FROM ash_users 
WHERE id NOT IN (SELECT user_id FROM user_roles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;