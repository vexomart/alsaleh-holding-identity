-- إصلاح سياسة إدراج المستخدمين الجدد
DROP POLICY IF EXISTS "ash_users_public_insert_fixed" ON ash_users;

-- إنشاء سياسة جديدة تسمح بإدراج المستخدمين الجدد
CREATE POLICY "ash_users_allow_public_registration" 
ON ash_users 
FOR INSERT 
WITH CHECK (true);